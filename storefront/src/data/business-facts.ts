import { OWNER_REVIEW_CONFIG } from './owner-review';

/**
 * Source-of-Truth Business Facts Registry (`Prompt 002`)
 * Strictly separates verified source facts, owner-confirmation items, and demo-only metadata.
 */
export const BUSINESS_FACTS = {
  verifiedFromSuppliedFiles: {
    brandName: 'ANIL CLOTH HOUSE',
    instagramHandle: '@anil_cloth_house_official',
    instagramUsername: 'anil_cloth_house_official',
    instagramUrl: 'https://www.instagram.com/anil_cloth_house_official/',
    whatsappDisplay: '+91 8810530298',
    whatsappRawDigits: '918810530298',
    whatsappBaseUrl: 'https://wa.me/918810530298',
    positioningHeadline: 'Manufacturer & Wholesaler • Clothing Brand',
    captionPositioning: 'Export and Manufacturing ethnic wear store',
    noCodPolicy: "NO DM'S NO COD",
    noHoldPolicy: 'To order from us, you have to order instant by confirming payment. We do not hold items.',
    statedShippingClaim: 'Worldwide shipping',
    addressBio: OWNER_REVIEW_CONFIG.confirmedStoreAddress.profileBioLine,
    addressCaption: OWNER_REVIEW_CONFIG.confirmedStoreAddress.captionDerivedLine,
    addressDisplay: OWNER_REVIEW_CONFIG.confirmedStoreAddress.displayLine,
    youtubeLinks: [
      'https://youtu.be/-Cdm4guXk6c?si=m_GSuOiOfBdPAxvq',
      'https://youtu.be/SK99PSCye0w?si=fdz9VUUGwffsOXSp',
    ],
    snapshotMetrics: {
      followersCount: 8972,
      followingCount: 19,
      postCount: 2055,
      capturedDateLabel: '29 Oct 2026',
      disclaimer: 'Snapshot from public profile extraction on 29 Oct 2026; not a live real-time counter.',
    },
    sourceAssetTotals: {
      imagesInArchive: 99,
      reelCoversCount: 97,
      feedNoticeImagesCount: 1,
      profilePicturesCount: 1,
      reelVideosCount: 97,
      metadataPostsCount: 100,
      unresolvedWebpCount: 2,
    },
  },
  needsOwnerConfirmation: {
    officialLogo: 'Profile picture (100×100) shows Adinya® By Anil Cloth House visiting card; vector logo pending.',
    pricing: OWNER_REVIEW_CONFIG.pricingPolicy.reelStickerCaveat,
    moqAndTradeTerms: OWNER_REVIEW_CONFIG.wholesaleTerms.defaultMoqFallback,
    sizesAndAlterations: 'Available size chart, blouse margin allowances, and custom stitching options require confirmation.',
    fabricComposition: 'Exact base fabrics (organza, georgette, tissue, silk blend) and care instructions require confirmation.',
    shippingRatesAndTimelines: OWNER_REVIEW_CONFIG.shippingRules.unconfirmedDetailsNote,
    returnExchangeRules: OWNER_REVIEW_CONFIG.returnsRules.defaultProvisionalNote,
    openingHoursAndMapPin: 'Showroom visiting hours and exact Google Maps pin in NIT Faridabad require confirmation.',
  },
  demoOnly: {
    conceptLabel: 'Unofficial Private Concept Demo',
    shortDisclosure:
      'Unofficial Private Concept Demo • Frontend-only prototype built from supplied public Instagram assets. No live checkout, payment processing, or real-time stock.',
    fullDisclosure:
      'This website is an unofficial, private frontend concept prototype prepared for ANIL CLOTH HOUSE (@anil_cloth_house_official). All garment photography and Reel videos originate from the supplied local extraction archive. Prices, sizes, fabrics, stock availability, shipping charges, and return terms are not confirmed and must be verified directly with the store via WhatsApp (+91 8810530298). No orders are placed and no data leaves your browser until you explicitly open WhatsApp.',
  },
} as const;

