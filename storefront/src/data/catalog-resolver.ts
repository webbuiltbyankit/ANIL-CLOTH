import rawCatalogBundle from './catalog.generated.json';
import {
  EditorialCollectionSlug,
  GeneratedCatalogBundle,
  ProductCandidate,
  validateProductCandidate,
} from '@/types/catalog';
import { normalizeSearchQuery } from '@/lib/security';

const typedBundle = rawCatalogBundle as unknown as GeneratedCatalogBundle;

const ALL_VALIDATED_CANDIDATES: ProductCandidate[] = Array.isArray(typedBundle.items)
  ? typedBundle.items
      .map((item) => validateProductCandidate(item))
      .filter((item): item is ProductCandidate => item !== null)
  : [];

/**
 * Returns all 97 valid media-backed wearable garment candidates (excludes missing .webp posts and the blue text notice graphic).
 */
export function getAllSellableGarments(): ProductCandidate[] {
  return ALL_VALIDATED_CANDIDATES.filter((item) => item.isSellableGarment && item.hasLocalImage);
}

/**
 * Returns the 38 visually curated high-visibility designs sorted by curatedRank (`Prompt 006`).
 */
export function getCuratedGarments(): ProductCandidate[] {
  return getAllSellableGarments()
    .filter((item) => item.isCurated)
    .sort((a, b) => (a.curatedRank ?? 999) - (b.curatedRank ?? 999));
}

/**
 * Returns hero candidates for the homepage editorial carousel (`Prompts 021–022`).
 */
export function getHeroCandidates(): ProductCandidate[] {
  const heroes = getCuratedGarments().filter((item) => item.isHeroCandidate);
  return heroes.length > 0 ? heroes : getCuratedGarments().slice(0, 3);
}

/**
 * Finds a product candidate by id (`prod_DfC6hNDTwrJ`), shortcode (`DfC6hNDTwrJ`), or displayId (`ACH-DfC6hNDTwrJ`).
 */
export function getProductByIdOrShortcode(identifier: string | undefined): ProductCandidate | undefined {
  if (!identifier) return undefined;
  const clean = identifier.trim();
  const normalizedLower = clean.toLowerCase();
  return getAllSellableGarments().find(
    (item) =>
      item.id.toLowerCase() === normalizedLower ||
      item.shortcode.toLowerCase() === normalizedLower ||
      item.displayId.toLowerCase() === normalizedLower
  );
}

/**
 * Returns products belonging to a specific editorial collection (`Prompt 035`).
 */
export function getProductsByCollection(
  slug: EditorialCollectionSlug,
  includeExtendedArchive = false
): ProductCandidate[] {
  const pool = includeExtendedArchive ? getAllSellableGarments() : getCuratedGarments();
  return pool.filter((item) => item.editorialCollections.includes(slug));
}

/**
 * Returns all distinct manually verified visual color tags (`Prompt 032`).
 */
export function getAvailableColorTags(): Array<{ tag: string; count: number }> {
  const counts = new Map<string, number>();
  for (const item of getAllSellableGarments()) {
    if (item.visualColorTag) {
      counts.set(item.visualColorTag, (counts.get(item.visualColorTag) || 0) + 1);
    }
  }
  return Array.from(counts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}

export type CatalogSortOption = 'curated' | 'recent' | 'alphabetical';

export interface CatalogFilterState {
  includeFullArchive: boolean; // false = 38 visually curated, true = all 97 valid garment reels
  collections: EditorialCollectionSlug[];
  colorTags: string[];
  onlyWithPlayableVideo: boolean;
  searchQuery: string;
  sortBy: CatalogSortOption;
}

export const DEFAULT_FILTER_STATE: CatalogFilterState = {
  includeFullArchive: false,
  collections: [],
  colorTags: [],
  onlyWithPlayableVideo: false,
  searchQuery: '',
  sortBy: 'curated',
};

/**
 * Client-side deterministic filter & sort engine (`Prompts 032, 038`).
 */
export function filterAndSortCatalog(state: Partial<CatalogFilterState>): ProductCandidate[] {
  const merged: CatalogFilterState = { ...DEFAULT_FILTER_STATE, ...state };

  // When a user searches or selects 'uncategorized', automatically search across all 97 valid garments so no shortcode is missed
  const forceAllArchive =
    merged.includeFullArchive ||
    merged.searchQuery.trim().length > 0 ||
    merged.collections.includes('uncategorized');

  let list = forceAllArchive ? getAllSellableGarments() : getCuratedGarments();

  if (merged.collections.length > 0) {
    list = list.filter((item) =>
      merged.collections.some((col) => item.editorialCollections.includes(col))
    );
  }

  if (merged.colorTags.length > 0) {
    list = list.filter(
      (item) => item.visualColorTag !== null && merged.colorTags.includes(item.visualColorTag)
    );
  }

  if (merged.onlyWithPlayableVideo) {
    list = list.filter((item) => item.hasPlayableVideo);
  }

  const cleanQuery = normalizeSearchQuery(merged.searchQuery);
  if (cleanQuery) {
    const tokens = cleanQuery
      .toLowerCase()
      .replace(/^ach-/i, '')
      .replace(/^prod_/i, '')
      .split(/\s+/)
      .filter(Boolean);

    list = list.filter((item) => {
      const searchableHaystack = [
        item.shortcode,
        item.displayId,
        item.id,
        item.title,
        item.editorialSubtitle,
        item.visualColorTag || '',
        item.visualCraftNote || '',
        item.lookbookStory || '',
        item.editorialCollections.join(' '),
        item.rawCaption || '',
      ]
        .join(' ')
        .toLowerCase();

      return tokens.every((tk) => searchableHaystack.includes(tk));
    });
  }

  const sorted = [...list];
  if (merged.sortBy === 'recent') {
    sorted.sort((a, b) => {
      const tA = a.publishedAt ? Date.parse(a.publishedAt) : 0;
      const tB = b.publishedAt ? Date.parse(b.publishedAt) : 0;
      return tB - tA;
    });
  } else if (merged.sortBy === 'alphabetical') {
    sorted.sort((a, b) => a.displayId.localeCompare(b.displayId));
  } else {
    // 'curated' default: curated items first by curatedRank, then recent
    sorted.sort((a, b) => {
      if (a.isCurated && b.isCurated) {
        return (a.curatedRank ?? 999) - (b.curatedRank ?? 999);
      }
      if (a.isCurated) return -1;
      if (b.isCurated) return 1;
      const tA = a.publishedAt ? Date.parse(a.publishedAt) : 0;
      const tB = b.publishedAt ? Date.parse(b.publishedAt) : 0;
      return tB - tA;
    });
  }

  return sorted;
}

/**
 * Visually curated Related Designs selector (`Prompt 047`).
 * Excludes the current item, avoids duplicates, prioritizes shared collection & color tag, and falls back to curated items.
 */
export function getRelatedDesigns(currentProduct: ProductCandidate, limit = 4): ProductCandidate[] {
  const candidates = getCuratedGarments().filter((item) => item.id !== currentProduct.id);

  const scored = candidates.map((item) => {
    let score = 0;
    const sharedCols = item.editorialCollections.filter((c) =>
      currentProduct.editorialCollections.includes(c)
    ).length;
    score += sharedCols * 3;
    if (
      item.visualColorTag &&
      currentProduct.visualColorTag &&
      item.visualColorTag === currentProduct.visualColorTag
    ) {
      score += 2;
    }
    if (item.lookbookStory && item.lookbookStory === currentProduct.lookbookStory) {
      score += 1;
    }
    return { item, score };
  });

  scored.sort((a, b) => b.score - a.score || (a.item.curatedRank ?? 99) - (b.item.curatedRank ?? 99));
  return scored.slice(0, limit).map((s) => s.item);
}

/**
 * Returns the store policy notice post (`C_pknaLv-Hc`) for provenance/trust explanations.
 */
export function getStoreNoticePost(): ProductCandidate | undefined {
  return ALL_VALIDATED_CANDIDATES.find((item) => item.shortcode === 'C_pknaLv-Hc');
}

export function getCatalogStats() {
  return typedBundle.stats;
}

