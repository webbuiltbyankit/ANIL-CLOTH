import { BUSINESS_FACTS } from '@/data/business-facts';
import { CartEntry, EnquiryDraft, EnquiryIntent, ProductCandidate } from '@/types/catalog';
import { sanitizePlainText } from './security';

/**
 * Builds the encoded WhatsApp wa.me URL for a given message body (`Prompts 044, 054, 062, 087`).
 */
export function buildWhatsAppUrl(messageBody: string): string {
  const cleanMessage = messageBody.trim();
  const encoded = encodeURIComponent(cleanMessage);
  return `${BUSINESS_FACTS.verifiedFromSuppliedFiles.whatsappBaseUrl}?text=${encoded}`;
}

/**
 * Single-Design WhatsApp Enquiry Builder (`Prompt 044`)
 */
export function buildSingleProductWhatsAppMessage(
  product: ProductCandidate,
  intent: EnquiryIntent = 'personal',
  customQuestion?: string
): string {
  const lines: string[] = [
    `Hello ${BUSINESS_FACTS.verifiedFromSuppliedFiles.brandName} team,`,
    '',
    intent === 'wholesale'
      ? `I would like to enquire about *Wholesale / Bulk Availability* for this design:`
      : `I would like to enquire about this design from your collection:`,
    `• *Design Reference:* ${product.displayId} (Shortcode: ${product.shortcode})`,
    `• *Description:* ${product.editorialSubtitle}`,
    product.visualColorTag ? `• *Observed Colour Tone:* ${product.visualColorTag}` : '',
    `• *Source Instagram Post:* ${product.sourcePostUrl}`,
    '',
    intent === 'wholesale'
      ? 'Could you please confirm current wholesale rate, minimum order quantity (MOQ), available colour set breakdown, and dispatch terms?'
      : 'Could you please confirm current price, available colours/sizes, and delivery terms (noting your NO COD policy)?',
  ].filter(Boolean);

  if (customQuestion && customQuestion.trim()) {
    lines.push('', `*Additional Note:* ${sanitizePlainText(customQuestion, 300)}`);
  }

  lines.push('', 'Thank you!');
  return lines.join('\n');
}

/**
 * Multi-Design Enquiry Bag / Checkout Concept WhatsApp Composer (`Prompts 054, 058`)
 */
export function buildMultiDesignWhatsAppMessage(
  entries: Array<{ entry: CartEntry; product: ProductCandidate }>,
  draft?: Partial<EnquiryDraft>
): { message: string; isTruncatedWarning: boolean } {
  const intent = draft?.intent || 'personal';
  const isTruncatedWarning = entries.length > 10;
  const includedEntries = entries.slice(0, 10);

  const lines: string[] = [
    `Hello ${BUSINESS_FACTS.verifiedFromSuppliedFiles.brandName} team,`,
    '',
    intent === 'wholesale'
      ? `*WHOLESALE / BULK ENQUIRY DRAFT* (${entries.length} design${entries.length === 1 ? '' : 's'})`
      : `*DESIGN ENQUIRY SHORTLIST* (${entries.length} design${entries.length === 1 ? '' : 's'})`,
    '',
  ];

  includedEntries.forEach(({ entry, product }, idx) => {
    const qtyLabel =
      intent === 'wholesale'
        ? `${entry.quantity} unit${entry.quantity > 1 ? 's' : ''}/sets of interest`
        : `${entry.quantity} pc${entry.quantity > 1 ? 's' : ''} of interest`;
    lines.push(
      `${idx + 1}. *${product.displayId}* — ${qtyLabel}`,
      `   Style: ${product.editorialSubtitle}`,
      `   Post: ${product.sourcePostUrl}`
    );
    if (entry.note && entry.note.trim()) {
      lines.push(`   Note: ${sanitizePlainText(entry.note, 160)}`);
    }
  });

  if (isTruncatedWarning) {
    lines.push(
      '',
      `*(Plus ${entries.length - 10} additional design(s) in shortlist — kept concise for WhatsApp message length)*`
    );
  }

  const totalUnits = entries.reduce((sum, item) => sum + item.entry.quantity, 0);
  lines.push('', `• *Total Pieces of Interest:* ${totalUnits} (for availability & price confirmation)`);

  if (draft) {
    if (draft.name?.trim()) {
      lines.push(`• *Name:* ${sanitizePlainText(draft.name, 80)}`);
    }
    if (draft.businessName?.trim()) {
      lines.push(`• *Business / Boutique:* ${sanitizePlainText(draft.businessName, 100)}`);
    }
    if (draft.buyerType) {
      lines.push(`• *Buyer Profile:* ${draft.buyerType}`);
    }
    if (draft.cityCountry?.trim()) {
      lines.push(`• *City / Country:* ${sanitizePlainText(draft.cityCountry, 100)}`);
    }
    if (draft.phoneOrEmail?.trim()) {
      lines.push(`• *Contact:* ${sanitizePlainText(draft.phoneOrEmail, 100)}`);
    }
    if (draft.deliveryPreference) {
      const prefMap: Record<string, string> = {
        pickup_faridabad: 'Showroom Visit / Pickup (NIT Faridabad)',
        domestic_courier: 'Domestic Courier (India)',
        international_shipping: 'Worldwide / International Shipping',
        discuss_on_whatsapp: 'Discuss delivery options on WhatsApp',
      };
      lines.push(`• *Delivery Preference:* ${prefMap[draft.deliveryPreference] || draft.deliveryPreference}`);
    }
    if (draft.customNotes?.trim()) {
      lines.push(`• *Requirements / Notes:* ${sanitizePlainText(draft.customNotes, 350)}`);
    }
  }

  lines.push(
    '',
    intent === 'wholesale'
      ? 'Please share current wholesale pricing, MOQ, available colours/sizes, and shipping estimate. (We understand NO COD applies.)'
      : 'Please confirm current price, availability, and shipping charges. (We understand NO COD applies.)',
    '',
    'Thank you!'
  );

  return {
    message: lines.join('\n'),
    isTruncatedWarning,
  };
}

/**
 * Custom Sourcing / "Can't Find a Design?" Request Builder (`Prompt 069`)
 */
export function buildCustomSourcingWhatsAppMessage(params: {
  desiredStyle: string;
  preferredColor: string;
  quantityInterest: string;
  buyerType: 'personal' | 'wholesale';
  cityCountry?: string;
}): string {
  const lines = [
    `Hello ${BUSINESS_FACTS.verifiedFromSuppliedFiles.brandName} team,`,
    '',
    `I am looking for a specific occasionwear design and would like to check if you have similar pieces in your NIT Faridabad showroom:`,
    `• *Enquiry Type:* ${params.buyerType === 'wholesale' ? 'Wholesale / Boutique Buyer' : 'Personal Occasion Shopper'}`,
    `• *Desired Look / Silhouette:* ${sanitizePlainText(params.desiredStyle, 250) || 'Embroidered blouse / lehenga / draped saree'}`,
    params.preferredColor.trim()
      ? `• *Preferred Colour Palette:* ${sanitizePlainText(params.preferredColor, 100)}`
      : '',
    params.quantityInterest.trim()
      ? `• *Approximate Quantity of Interest:* ${sanitizePlainText(params.quantityInterest, 80)}`
      : '',
    params.cityCountry?.trim()
      ? `• *Destination City / Country:* ${sanitizePlainText(params.cityCountry, 100)}`
      : '',
    '',
    'Could you please share matching Reel designs, current pricing, and availability?',
    'Thank you!',
  ].filter(Boolean);

  return lines.join('\n');
}
