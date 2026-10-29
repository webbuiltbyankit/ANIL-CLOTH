import { describe, expect, it } from 'vitest';
import {
  filterAndSortCatalog,
  getAllSellableGarments,
  getCatalogStats,
  getCuratedGarments,
  getProductByIdOrShortcode,
  getRelatedDesigns,
  getStoreNoticePost,
} from '@/data/catalog-resolver';
import {
  normalizeSearchQuery,
  sanitizeExternalUrl,
  sanitizeLocalMediaPath,
  sanitizePlainText,
} from '@/lib/security';
import {
  buildMultiDesignWhatsAppMessage,
  buildSingleProductWhatsAppMessage,
  buildWhatsAppUrl,
} from '@/lib/whatsapp';
import { clampQuantity, MAX_ENQUIRY_QTY, MIN_ENQUIRY_QTY } from '@/features/store-context';
import { validateProductCandidate } from '@/types/catalog';

describe('Catalog Normalization & Resolver (Prompts 004, 005, 032, 060, 088)', () => {
  it('resolves exactly 97 sellable media-backed garments and 38 visually curated designs', () => {
    const stats = getCatalogStats();
    const sellable = getAllSellableGarments();
    const curated = getCuratedGarments();

    expect(stats.totalSourcePosts).toBe(100);
    expect(sellable).toHaveLength(97);
    expect(curated).toHaveLength(38);

    // Every sellable garment must have a local image, playable video, ACH- displayId, and null numeric price
    for (const item of sellable) {
      expect(item.displayId).toMatch(/^ACH-[A-Za-z0-9_-]+$/);
      expect(item.hasLocalImage).toBe(true);
      expect(item.hasPlayableVideo).toBe(true);
      expect(item.images.length).toBeGreaterThan(0);
      expect(item.videos.length).toBeGreaterThan(0);
      expect(item.price).toBeNull();
      expect(item.numericPriceInr).toBeNull();
      expect(item.priceStatusLabel).toBe('Price on request');
      expect(item.isNoticeGraphic).toBe(false);
    }
  });

  it('excludes the blue ordering policy card (C_pknaLv-Hc) and missing .webp posts from sellable garments', () => {
    const sellableShortcodes = new Set(getAllSellableGarments().map((p) => p.shortcode));
    expect(sellableShortcodes.has('C_pknaLv-Hc')).toBe(false);
    expect(sellableShortcodes.has('DcWRrPfPZkI')).toBe(false);
    expect(sellableShortcodes.has('DcF_q50SRmk')).toBe(false);

    const noticePost = getStoreNoticePost();
    expect(noticePost).toBeDefined();
    expect(noticePost?.shortcode).toBe('C_pknaLv-Hc');
    expect(noticePost?.isNoticeGraphic).toBe(true);
    expect(noticePost?.isSellableGarment).toBe(false);
  });

  it('looks up products by id, shortcode, or ACH- displayId case-insensitively', () => {
    const sample = getCuratedGarments()[0];
    expect(getProductByIdOrShortcode(sample.id)?.shortcode).toBe(sample.shortcode);
    expect(getProductByIdOrShortcode(sample.shortcode.toLowerCase())?.id).toBe(sample.id);
    expect(getProductByIdOrShortcode(sample.displayId)?.id).toBe(sample.id);
  });

  it('filters and sorts deterministically by collection, colour tag, search query, and sort order', () => {
    const embroidered = filterAndSortCatalog({
      collections: ['embroidered-edit'],
      includeFullArchive: false,
    });
    expect(embroidered.length).toBeGreaterThan(0);
    expect(
      embroidered.every((p) => p.editorialCollections.includes('embroidered-edit'))
    ).toBe(true);

    // Search by ACH- prefix or shortcode automatically searches across all 97 valid garments
    const byShortcode = filterAndSortCatalog({
      searchQuery: 'ACH-DfC6hNDTwrJ',
    });
    expect(byShortcode.some((p) => p.shortcode === 'DfC6hNDTwrJ')).toBe(true);

    // Alphabetical sort check
    const alpha = filterAndSortCatalog({
      includeFullArchive: false,
      sortBy: 'alphabetical',
    });
    for (let i = 1; i < alpha.length; i++) {
      expect(alpha[i - 1].displayId.localeCompare(alpha[i].displayId)).toBeLessThanOrEqual(0);
    }
  });

  it('computes visually related designs without including the current product or duplicates', () => {
    const target = getCuratedGarments()[0];
    const related = getRelatedDesigns(target, 4);
    expect(related).toHaveLength(4);
    const ids = new Set(related.map((r) => r.id));
    expect(ids.size).toBe(4);
    expect(ids.has(target.id)).toBe(false);
  });
});

describe('Quantity Clamping & WhatsApp Message Encoding (Prompts 044, 054, 060, 088)', () => {
  it('clamps quantities between MIN_ENQUIRY_QTY (1) and MAX_ENQUIRY_QTY (500)', () => {
    expect(clampQuantity(0)).toBe(MIN_ENQUIRY_QTY);
    expect(clampQuantity(-42)).toBe(MIN_ENQUIRY_QTY);
    expect(clampQuantity(Number.NaN)).toBe(MIN_ENQUIRY_QTY);
    expect(clampQuantity(12.6)).toBe(13);
    expect(clampQuantity(9999)).toBe(MAX_ENQUIRY_QTY);
  });

  it('builds single-product and multi-design WhatsApp drafts with verified +91 8810530298 URL', () => {
    const product = getCuratedGarments()[0];
    const singleMsg = buildSingleProductWhatsAppMessage(product, 'personal', 'Need size 40');
    expect(singleMsg).toContain(product.displayId);
    expect(singleMsg).toContain(product.shortcode);
    expect(singleMsg).toContain('NO COD');
    expect(singleMsg).toContain('Need size 40');

    const waUrl = buildWhatsAppUrl(singleMsg);
    expect(waUrl.startsWith('https://wa.me/918810530298?text=')).toBe(true);

    const multi = buildMultiDesignWhatsAppMessage(
      [
        {
          entry: {
            productId: product.id,
            shortcode: product.shortcode,
            displayId: product.displayId,
            quantity: 3,
            note: 'Bridal sister outfit',
            addedAt: new Date().toISOString(),
          },
          product,
        },
      ],
      {
        intent: 'wholesale',
        businessName: 'Roop Saree Emporium',
        buyerType: 'boutique',
        cityCountry: 'Jaipur, India',
      }
    );

    expect(multi.isTruncatedWarning).toBe(false);
    expect(multi.message).toContain('WHOLESALE / BULK ENQUIRY DRAFT');
    expect(multi.message).toContain('Roop Saree Emporium');
    expect(multi.message).toContain('Total Pieces of Interest:* 3');
  });
});

describe('Security Sanitization & Runtime Validation Against Malicious Fixtures (Prompts 087, 088)', () => {
  it('blocks javascript:, data:, and unauthorized domains in external URLs', () => {
    const fallback = 'https://www.instagram.com/anil_cloth_house_official/';
    expect(sanitizeExternalUrl('javascript:alert(1)')).toBe(fallback);
    expect(sanitizeExternalUrl('data:text/html,<script>alert(1)</script>')).toBe(fallback);
    expect(sanitizeExternalUrl('https://evil-phishing.example.com/reel')).toBe(fallback);
    expect(
      sanitizeExternalUrl('https://www.instagram.com/reel/DVdR13PE32E/')
    ).toBe('https://www.instagram.com/reel/DVdR13PE32E/');
  });

  it('blocks path traversal and non-media extensions in local media paths', () => {
    expect(sanitizeLocalMediaPath('../../etc/passwd')).toBeNull();
    expect(sanitizeLocalMediaPath('/media/images/../../secret.jpg')).toBeNull();
    expect(sanitizeLocalMediaPath('/media/images/script.js')).toBeNull();
    expect(sanitizeLocalMediaPath('/media/images/DVdR13PE32E_cover.jpg')).toBe(
      '/media/images/DVdR13PE32E_cover.jpg'
    );
    expect(sanitizeLocalMediaPath('/media/videos/DVdR13PE32E_video.mp4')).toBe(
      '/media/videos/DVdR13PE32E_video.mp4'
    );
  });

  it('strips HTML tags and control characters from plain text and search queries', () => {
    expect(sanitizePlainText('<script>alert("xss")</script>Hello\u0000World')).toBe(
      'alert("xss")HelloWorld'
    );
    expect(normalizeSearchQuery('ACH-001<img src=x onerror=alert(1)>')).toBe(
      'ACH-001img src=x onerror=alert(1)'
    );
  });

  it('rejects malformed product candidates safely in runtime validator', () => {
    expect(validateProductCandidate(null)).toBeNull();
    expect(validateProductCandidate({ id: 123 })).toBeNull();
  });
});
