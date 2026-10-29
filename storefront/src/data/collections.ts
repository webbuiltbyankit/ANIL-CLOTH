import { Collection, EditorialCollectionSlug } from '@/types/catalog';

/**
 * Editorial Collections Registry (`Prompts 006, 017, 024, 035`)
 * All groupings are explicitly marked as manual/editorial visual edits rather than confirmed SKU taxonomy.
 */
export const EDITORIAL_COLLECTIONS: Collection[] = [
  {
    slug: 'embroidered-edit',
    title: 'The Embroidered Edit',
    eyebrow: 'Editorial Selection • 01',
    shortDescription: 'Intricate beadwork, floral cutwork, and crystal-latticed bodices paired with coordinated skirts.',
    editorialIntro:
      'A visually curated selection of heavy occasion blouses and lehenga ensembles featuring dense sequin, pearl, and floral embroidery captured in the NIT Faridabad showroom.',
    heroImagePublicPath: '/media/images/De-5_dRTcdi_cover.jpg',
    heroShortcode: 'De-5_dRTcdi',
    isEditorialClassification: true,
    featuredInMegaMenu: true,
    featuredOnHomeTile: true,
  },
  {
    slug: 'festive-selections',
    title: 'Festive Selections',
    eyebrow: 'Editorial Selection • 02',
    shortDescription: 'Celebratory jewel tones, warm champagne golds, and pastel silhouettes for wedding guests.',
    editorialIntro:
      'From peacock-teal and mustard-gold drapes to soft mauve and blush ensembles, this edit brings together occasion-ready silhouettes suited for festive celebrations and bulk boutique curation.',
    heroImagePublicPath: '/media/images/De5vI8aTSed_cover.jpg',
    heroShortcode: 'De5vI8aTSed',
    isEditorialClassification: true,
    featuredInMegaMenu: true,
    featuredOnHomeTile: true,
  },
  {
    slug: 'statement-details',
    title: 'Statement Details',
    eyebrow: 'Editorial Selection • 03',
    shortDescription: 'Architectural necklines, cascading pearl fringes, choker sets, and high-contrast evening tones.',
    editorialIntro:
      'Focused on distinctive construction details—sweetheart bustiers with pearl tassels, asymmetric straps, cape sleeves, and deep wine, cobalt, and noir palettes.',
    heroImagePublicPath: '/media/images/De-6uVATb2e_cover.jpg',
    heroShortcode: 'De-6uVATb2e',
    isEditorialClassification: true,
    featuredInMegaMenu: true,
    featuredOnHomeTile: true,
  },
  {
    slug: 'draped-silhouettes',
    title: 'Draped & Cape Silhouettes',
    eyebrow: 'Editorial Selection • 04',
    shortDescription: 'Pre-draped saree ensembles, scalloped pallu borders, and fluid shimmer drapes.',
    editorialIntro:
      'Contemporary draped silhouettes combining embellished designer blouses with ready-to-wear pleated drapes and sheer cape overlays.',
    heroImagePublicPath: '/media/images/DfC6hNDTwrJ_cover.jpg',
    heroShortcode: 'DfC6hNDTwrJ',
    isEditorialClassification: true,
    featuredInMegaMenu: true,
    featuredOnHomeTile: true,
  },
];

export function getCollectionBySlug(slug: string | undefined): Collection | undefined {
  if (!slug) return undefined;
  return EDITORIAL_COLLECTIONS.find((c) => c.slug === (slug as EditorialCollectionSlug));
}

