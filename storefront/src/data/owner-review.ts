/**
 * Centralized Owner-Confirmation Placeholders (`Prompt 095`)
 *
 * When ANIL CLOTH HOUSE approves official brand assets, retail/wholesale policies,
 * or verified SKU specifications, update this single file to propagate across the app.
 */

export interface OwnerReviewConfig {
  isOwnerApprovedForPublicLaunch: boolean;
  officialVectorLogoPath: string | null;
  subBrandLabel: string;
  verifiedEmailAddress: string | null;
  verifiedOpeningHours: string | null;
  verifiedGoogleMapsUrl: string | null;
  confirmedStoreAddress: {
    displayLine: string;
    captionDerivedLine: string;
    profileBioLine: string;
    visitingCardLine: string;
    verificationNote: string;
  };
  pricingPolicy: {
    showNumericPrices: boolean;
    defaultPriceLabel: string;
    reelStickerCaveat: string;
  };
  wholesaleTerms: {
    confirmedMoqText: string | null;
    defaultMoqFallback: string;
    tradeDiscountNote: string;
  };
  paymentAndCodPolicy: {
    codOffered: false;
    codNotice: string;
    holdItemsPolicy: string;
    acceptedPaymentMethodsNote: string;
  };
  shippingRules: {
    statedProfileClaim: string;
    unconfirmedDetailsNote: string;
  };
  returnsRules: {
    statedProfileClaim: string | null;
    defaultProvisionalNote: string;
  };
}

export const OWNER_REVIEW_CONFIG: OwnerReviewConfig = {
  isOwnerApprovedForPublicLaunch: false,
  officialVectorLogoPath: null, // Uses refined typographic wordmark while null
  subBrandLabel: 'Adinya® By Anil Cloth House (seen on profile visiting card — pending brand confirmation)',
  verifiedEmailAddress: null, // Not shown in public metadata
  verifiedOpeningHours: null, // Not shown in public metadata
  verifiedGoogleMapsUrl: null, // Never guess a map pin
  confirmedStoreAddress: {
    displayLine: 'Plot No. 1K/6A, NIT Faridabad 121001, Haryana (Delhi NCR)',
    captionDerivedLine: 'Plot no. 1k/6a nit faridabad 121001 , Haryana , Delhi ncr.',
    profileBioLine: 'Delhi,1k/6a NIT. Faridabad',
    visitingCardLine: 'Shop No. 1K/6A, Near Kalyan Singh Chowk, N.I.T. Faridabad, Haryana - 121001',
    verificationNote:
      'Sourced from Instagram biography and post captions. Confirm exact landmark wording with store owner before public launch.',
  },
  pricingPolicy: {
    showNumericPrices: false,
    defaultPriceLabel: 'Price on request',
    reelStickerCaveat:
      'Some Instagram Reel covers display embedded wholesale rate stickers. Current single-piece vs. bulk pricing must be confirmed directly on WhatsApp.',
  },
  wholesaleTerms: {
    confirmedMoqText: null,
    defaultMoqFallback: 'Minimum order quantity (MOQ), set breakdowns, and trade pricing are confirmed directly by the store via WhatsApp.',
    tradeDiscountNote: 'Terms and availability confirmed directly by the store.',
  },
  paymentAndCodPolicy: {
    codOffered: false,
    codNotice: "Cash on Delivery (COD) is not offered ('NO DM'S NO COD' stated on public profile).",
    holdItemsPolicy: 'Per store notice post (C_pknaLv-Hc): items are not held without confirmed payment.',
    acceptedPaymentMethodsNote:
      'Specific bank transfer / UPI details are shared directly by the store on WhatsApp (+91 8810530298) upon enquiry confirmation.',
  },
  shippingRules: {
    statedProfileClaim: 'Worldwide shipping (stated in public Instagram biography)',
    unconfirmedDetailsNote:
      'Eligible destination countries, courier partners, dispatch lead times, and shipping charges are not listed publicly and must be confirmed with the shop prior to ordering.',
  },
  returnsRules: {
    statedProfileClaim: null,
    defaultProvisionalNote:
      'Public profile metadata does not state a return or exchange policy. Please confirm exchange eligibility, size alterations, and transit-damage rules directly on WhatsApp before confirming an order.',
  },
};

