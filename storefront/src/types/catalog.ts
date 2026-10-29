export type TypeConfidence =
  | 'visually_reviewed_editorial'
  | 'unreviewed_reel_capture'
  | 'non_product_notice'
  | 'missing_media_excluded';

export type AvailabilityStatus = 'confirm_with_store';

export type EditorialCollectionSlug =
  | 'embroidered-edit'
  | 'festive-selections'
  | 'statement-details'
  | 'draped-silhouettes'
  | 'uncategorized';

export interface CatalogImage {
  id: string;
  filename: string;
  publicPath: string;
  originalRelativePath: string;
  width: number;
  height: number;
  aspectRatio: string;
  mediaCategory: string;
  sha256: string | null;
  hasEmbeddedOverlayText: boolean;
  altText: string;
}

export interface CatalogVideo {
  id: string;
  filename: string;
  publicPath: string;
  originalRelativePath: string;
  fileSizeBytes: number | null;
  sha256: string | null;
  posterPublicPath: string | null;
}

export interface SourceReference {
  shortcode: string;
  postUrl: string;
  extractedAt: string | null;
  sourceProvider: string | null;
}

export interface ProductCandidate {
  id: string;
  shortcode: string;
  displayId: string; // e.g., ACH-DfC6hNDTwrJ
  sourcePostUrl: string;
  publishedAt: string | null;
  mediaType: 'reel' | 'image';
  isReel: boolean;
  images: CatalogImage[];
  videos: CatalogVideo[];
  hasPlayableVideo: boolean;
  hasLocalImage: boolean;
  isSellableGarment: boolean;
  isNoticeGraphic: boolean;
  isCurated: boolean;
  curatedRank: number | null;
  isHeroCandidate: boolean;
  lookbookStory: string | null;
  typeConfidence: TypeConfidence;
  title: string;
  editorialSubtitle: string;
  visualCraftNote: string | null;
  onImageOverlayNote: string | null;
  price: number | null;
  numericPriceInr: number | null;
  priceStatusLabel: string;
  sizes: string[] | null;
  colors: string[] | null;
  visualColorTag: string | null;
  materials: string[] | null;
  availability: AvailabilityStatus;
  editorialCollections: EditorialCollectionSlug[];
  rawCaption: string | null;
  hashtags: string[];
  externalLinks: string[];
  likesCount: number | null;
  commentsCount: number | null;
  sellerNotes: string | null;
  extractionNotes: string | null;
  needsVerification: boolean;
  sourceReference: SourceReference;
}

export interface BusinessProfile {
  username: string;
  displayName: string;
  profileUrl: string;
  profilePicturePublicPath: string | null;
  biography: string;
  businessAddress: string;
  businessPhone: string;
  followersCountSnapshot: number | null;
  followingCountSnapshot: number | null;
  postCountSnapshot: number | null;
  extractedAt: string;
}

export interface Collection {
  slug: EditorialCollectionSlug;
  title: string;
  eyebrow: string;
  shortDescription: string;
  editorialIntro: string;
  heroImagePublicPath: string;
  heroShortcode: string;
  isEditorialClassification: true;
  featuredInMegaMenu: boolean;
  featuredOnHomeTile: boolean;
}

export type EnquiryIntent = 'personal' | 'wholesale';

export interface CartEntry {
  productId: string;
  shortcode: string;
  displayId: string;
  quantity: number;
  note: string;
  addedAt: string;
}

export interface EnquiryDraft {
  intent: EnquiryIntent;
  name: string;
  phoneOrEmail: string;
  cityCountry: string;
  businessName: string;
  buyerType: 'individual' | 'boutique' | 'reseller' | 'international' | '';
  deliveryPreference: 'pickup_faridabad' | 'domestic_courier' | 'international_shipping' | 'discuss_on_whatsapp';
  customNotes: string;
  acknowledgedNoCod: boolean;
}

export interface GeneratedCatalogBundle {
  generatedAt: string;
  sourceProfile: BusinessProfile;
  stats: {
    totalSourcePosts: number;
    totalSellableGarments: number;
    totalCuratedDesigns: number;
    totalWithPlayableVideo: number;
    totalNoticeGraphics: number;
    totalExcludedMissingMedia: number;
  };
  items: ProductCandidate[];
}

/**
 * Runtime schema validator & safe parser for ProductCandidate records (Prompt 004 & Prompt 087)
 */
export function validateProductCandidate(raw: unknown): ProductCandidate | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;
  if (typeof r.shortcode !== 'string' || !r.shortcode.trim()) return null;
  if (!/^[A-Za-z0-9_-]{5,20}$/.test(r.shortcode)) return null;

  const images = Array.isArray(r.images)
    ? (r.images.filter(
        (img): img is CatalogImage =>
          Boolean(img && typeof img === 'object' && typeof (img as CatalogImage).publicPath === 'string')
      ) as CatalogImage[])
    : [];

  const videos = Array.isArray(r.videos)
    ? (r.videos.filter(
        (vid): vid is CatalogVideo =>
          Boolean(vid && typeof vid === 'object' && typeof (vid as CatalogVideo).publicPath === 'string')
      ) as CatalogVideo[])
    : [];

  return {
    id: typeof r.id === 'string' ? r.id : `prod_${r.shortcode}`,
    shortcode: r.shortcode,
    displayId: typeof r.displayId === 'string' ? r.displayId : `ACH-${r.shortcode}`,
    sourcePostUrl:
      typeof r.sourcePostUrl === 'string' && r.sourcePostUrl.startsWith('https://www.instagram.com/')
        ? r.sourcePostUrl
        : `https://www.instagram.com/reel/${r.shortcode}/`,
    publishedAt: typeof r.publishedAt === 'string' ? r.publishedAt : null,
    mediaType: r.mediaType === 'image' ? 'image' : 'reel',
    isReel: Boolean(r.isReel),
    images,
    videos,
    hasPlayableVideo: videos.length > 0,
    hasLocalImage: images.length > 0,
    isSellableGarment: Boolean(r.isSellableGarment) && images.length > 0,
    isNoticeGraphic: Boolean(r.isNoticeGraphic),
    isCurated: Boolean(r.isCurated),
    curatedRank: typeof r.curatedRank === 'number' ? r.curatedRank : null,
    isHeroCandidate: Boolean(r.isHeroCandidate),
    lookbookStory: typeof r.lookbookStory === 'string' ? r.lookbookStory : null,
    typeConfidence:
      r.typeConfidence === 'visually_reviewed_editorial' ||
      r.typeConfidence === 'unreviewed_reel_capture' ||
      r.typeConfidence === 'non_product_notice' ||
      r.typeConfidence === 'missing_media_excluded'
        ? r.typeConfidence
        : 'unreviewed_reel_capture',
    title: typeof r.title === 'string' ? r.title : `Design / ${r.shortcode}`,
    editorialSubtitle:
      typeof r.editorialSubtitle === 'string'
        ? r.editorialSubtitle
        : 'Embroidered Occasionwear Ensemble',
    visualCraftNote: typeof r.visualCraftNote === 'string' ? r.visualCraftNote : null,
    onImageOverlayNote: typeof r.onImageOverlayNote === 'string' ? r.onImageOverlayNote : null,
    price: null, // Strictly null until owner confirms pricing
    numericPriceInr: null,
    priceStatusLabel: 'Price on request',
    sizes: null,
    colors: Array.isArray(r.colors) ? (r.colors.filter((c) => typeof c === 'string') as string[]) : null,
    visualColorTag: typeof r.visualColorTag === 'string' ? r.visualColorTag : null,
    materials: null,
    availability: 'confirm_with_store',
    editorialCollections: Array.isArray(r.editorialCollections)
      ? (r.editorialCollections as EditorialCollectionSlug[])
      : ['uncategorized'],
    rawCaption: typeof r.rawCaption === 'string' ? r.rawCaption : null,
    hashtags: Array.isArray(r.hashtags) ? (r.hashtags.filter((h) => typeof h === 'string') as string[]) : [],
    externalLinks: Array.isArray(r.externalLinks)
      ? (r.externalLinks.filter((l) => typeof l === 'string' && l.startsWith('https://')) as string[])
      : [],
    likesCount: typeof r.likesCount === 'number' ? r.likesCount : null,
    commentsCount: typeof r.commentsCount === 'number' ? r.commentsCount : null,
    sellerNotes: typeof r.sellerNotes === 'string' ? r.sellerNotes : null,
    extractionNotes: typeof r.extractionNotes === 'string' ? r.extractionNotes : null,
    needsVerification: r.needsVerification !== false,
    sourceReference: {
      shortcode: r.shortcode,
      postUrl:
        typeof r.sourcePostUrl === 'string' && r.sourcePostUrl.startsWith('https://www.instagram.com/')
          ? r.sourcePostUrl
          : `https://www.instagram.com/reel/${r.shortcode}/`,
      extractedAt:
        r.sourceReference && typeof (r.sourceReference as SourceReference).extractedAt === 'string'
          ? (r.sourceReference as SourceReference).extractedAt
          : null,
      sourceProvider:
        r.sourceReference && typeof (r.sourceReference as SourceReference).sourceProvider === 'string'
          ? (r.sourceReference as SourceReference).sourceProvider
          : null,
    },
  };
}

