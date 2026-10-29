import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Check,
  Copy,
  Globe,
  MessageCircle,
  Plus,
  ShieldAlert,
  Sparkles,
  Trash2,
} from 'lucide-react';
import {
  getAllSellableGarments,
  getCuratedGarments,
} from '@/data/catalog-resolver';
import { BUSINESS_FACTS } from '@/data/business-facts';
import { useStore } from '@/features/store-context';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { ProductImage } from '@/components/media/ProductMedia';
import { buildWhatsAppUrl } from '@/lib/whatsapp';
import { sanitizePlainText } from '@/lib/security';
import { EnquiryDraft, ProductCandidate } from '@/types/catalog';

export const WholesalePage: React.FC = () => {
  useDocumentMeta({
    title: 'Wholesale & Boutique Trade Enquiries',
    description:
      'Direct manufacturer & wholesaler trade inquiries for ANIL CLOTH HOUSE in NIT Faridabad, Delhi NCR.',
  });

  const {
    bagEntries,
    addToBag,
    removeFromBag,
    enquiryDraft,
    setEnquiryIntent,
    updateEnquiryDraft,
    showToast,
  } = useStore();

  const allProducts = useMemo(() => getAllSellableGarments(), []);
  const curatedProducts = useMemo(() => getCuratedGarments().slice(0, 12), []);

  const [selectedIds, setSelectedIds] = useState<string[]>(() =>
    bagEntries.map((entry) => entry.productId)
  );
  const [approxQuantity, setApproxQuantity] = useState('15–30 sets / assorted');
  const [copied, setCopied] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');

  const activeSelectedProducts = useMemo<ProductCandidate[]>(() => {
    const idSet = new Set([
      ...selectedIds,
      ...bagEntries.map((b) => b.productId),
    ]);
    return allProducts.filter((p) => idSet.has(p.id));
  }, [allProducts, selectedIds, bagEntries]);

  const toggleProductSelection = (product: ProductCandidate) => {
    const isCurrentlySelected =
      selectedIds.includes(product.id) ||
      bagEntries.some((b) => b.productId === product.id);

    if (isCurrentlySelected) {
      setSelectedIds((prev) => prev.filter((id) => id !== product.id));
      if (bagEntries.some((b) => b.productId === product.id)) {
        removeFromBag(product.id);
      }
      showToast(`Removed ${product.displayId} from wholesale selection`);
    } else {
      setSelectedIds((prev) => [...prev, product.id]);
      addToBag(product.id, 1, 'Wholesale trade selection');
      setEnquiryIntent('wholesale');
    }
  };

  const filteredCatalog = useMemo<ProductCandidate[]>(() => {
    if (!searchFilter.trim()) return curatedProducts;
    const q = searchFilter.toLowerCase().trim();
    return allProducts
      .filter(
        (p) =>
          p.displayId.toLowerCase().includes(q) ||
          p.shortcode.toLowerCase().includes(q) ||
          p.title.toLowerCase().includes(q) ||
          (p.visualColorTag && p.visualColorTag.toLowerCase().includes(q)) ||
          p.editorialSubtitle.toLowerCase().includes(q)
      )
      .slice(0, 12);
  }, [allProducts, curatedProducts, searchFilter]);

  const buyerTypeLabelMap: Record<EnquiryDraft['buyerType'], string> = {
    '': 'Boutique / Multi-brand Retailer',
    boutique: 'Boutique / Multi-brand Retailer',
    reseller: 'Wholesale Distributor / Reseller',
    international: 'International Ethnic Wear Buyer',
    individual: 'Personal / Trousseau Buyer',
  };

  const messageDraft = useMemo(() => {
    const lines: string[] = [
      `Hello ${BUSINESS_FACTS.verifiedFromSuppliedFiles.brandName} team,`,
      '',
      `*WHOLESALE / BOUTIQUE TRADE ENQUIRY*`,
      `• *Boutique / Business Name:* ${sanitizePlainText(enquiryDraft.businessName, 100) || 'To be confirmed on chat'}`,
      `• *Buyer Category:* ${buyerTypeLabelMap[enquiryDraft.buyerType] || 'Boutique / Multi-brand Retailer'}`,
      `• *City / Country:* ${sanitizePlainText(enquiryDraft.cityCountry, 100) || 'To be confirmed on chat'}`,
      `• *Approximate Quantity Interest:* ${sanitizePlainText(approxQuantity, 80)}`,
    ];

    if (activeSelectedProducts.length > 0) {
      lines.push('', `*Selected Design References (${activeSelectedProducts.length}):*`);
      activeSelectedProducts.slice(0, 10).forEach((item, idx) => {
        lines.push(`${idx + 1}. ${item.displayId} (IG: ${item.shortcode}) — ${item.editorialSubtitle}`);
      });
    } else {
      lines.push('', `• *Selected Designs:* Requesting current wholesale lookbook & fast-moving lots`);
    }

    if (enquiryDraft.customNotes.trim()) {
      lines.push('', `• *Specific Requirements:* ${sanitizePlainText(enquiryDraft.customNotes, 300)}`);
    }

    lines.push(
      '',
      'Please share current wholesale lot rates, MOQ, set breakdown, and dispatch details. (We note your NO COD policy.)',
      'Thank you!'
    );

    return lines.join('\n');
  }, [
    enquiryDraft.businessName,
    enquiryDraft.buyerType,
    enquiryDraft.cityCountry,
    enquiryDraft.customNotes,
    approxQuantity,
    activeSelectedProducts,
  ]);

  const whatsappUrl = useMemo(() => buildWhatsAppUrl(messageDraft), [messageDraft]);

  const handleCopyDraft = async () => {
    try {
      await navigator.clipboard.writeText(messageDraft);
      setCopied(true);
      showToast('Wholesale enquiry draft copied to clipboard');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      showToast('Select the message text below to copy manually');
    }
  };

  return (
    <div className="pb-20">
      {/* Masthead */}
      <section className="bg-oxblood-deep text-ivory py-14 sm:py-20 border-b border-brass/30">
        <div className="editorial-container">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-brass-light/15 border border-brass-light/30 text-brass-light text-xs uppercase tracking-widest mb-4">
              <Building2 className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Direct Manufacturer &amp; Wholesaler • NIT Faridabad</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl text-ivory leading-tight mb-4">
              Wholesale &amp; Boutique Trade Desk
            </h1>
            <p className="text-ivory/80 text-base sm:text-lg leading-relaxed mb-6">
              {BUSINESS_FACTS.verifiedFromSuppliedFiles.brandName} supplies boutique owners,
              multi-brand ethnic wear retailers, and international trade buyers directly from our
              NIT Faridabad showroom in Delhi NCR.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-ivory/15 text-xs text-ivory/80">
              <div className="flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-brass-light shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="font-semibold text-ivory">Source Positioning</p>
                  <p className="text-ivory/70">
                    {BUSINESS_FACTS.verifiedFromSuppliedFiles.positioningHeadline}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Globe className="w-4 h-4 text-brass-light shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="font-semibold text-ivory">Dispatch Reach</p>
                  <p className="text-ivory/70">
                    Delhi NCR showroom &amp; {BUSINESS_FACTS.verifiedFromSuppliedFiles.statedShippingClaim}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <ShieldAlert className="w-4 h-4 text-brass-light shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="font-semibold text-ivory">Store Terms</p>
                  <p className="text-ivory/70">
                    WhatsApp ({BUSINESS_FACTS.verifiedFromSuppliedFiles.whatsappDisplay}) •{' '}
                    {BUSINESS_FACTS.verifiedFromSuppliedFiles.noCodPolicy}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Split: Configurator + Live Preview */}
      <section id="bulk-configurator" className="editorial-container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left 7 cols: Bulk Inquiry Configurator */}
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-ivory-warm border border-ivory-border p-6 sm:p-8">
              <h2 className="font-serif text-2xl text-ink mb-2">
                1. Configure Your Trade / Bulk Inquiry
              </h2>
              <p className="text-sm text-ink-muted mb-6">
                Complete your boutique or trade profile below. We do not publish fake minimum order
                quantities (MOQs) or unverified tier slabs—our team confirms current lot availability,
                colour sets, and dispatch timelines directly on WhatsApp.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="ws-business-name"
                    className="block text-xs font-medium uppercase tracking-wider text-ink mb-1.5"
                  >
                    Boutique / Business Name
                  </label>
                  <input
                    id="ws-business-name"
                    type="text"
                    value={enquiryDraft.businessName}
                    onChange={(e) => updateEnquiryDraft({ businessName: e.target.value })}
                    placeholder="e.g. Meher Luxe Boutique"
                    className="input-editorial"
                  />
                </div>

                <div>
                  <label
                    htmlFor="ws-buyer-type"
                    className="block text-xs font-medium uppercase tracking-wider text-ink mb-1.5"
                  >
                    Buyer Category
                  </label>
                  <select
                    id="ws-buyer-type"
                    value={enquiryDraft.buyerType || 'boutique'}
                    onChange={(e) =>
                      updateEnquiryDraft({
                        buyerType: e.target.value as EnquiryDraft['buyerType'],
                      })
                    }
                    className="input-editorial"
                  >
                    <option value="boutique">Boutique / Multi-brand Retailer</option>
                    <option value="reseller">Wholesale Distributor / Reseller</option>
                    <option value="international">International Ethnic Wear Buyer</option>
                    <option value="individual">Personal / Bridal Trousseau</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="ws-city-country"
                    className="block text-xs font-medium uppercase tracking-wider text-ink mb-1.5"
                  >
                    Destination City &amp; Country
                  </label>
                  <input
                    id="ws-city-country"
                    type="text"
                    value={enquiryDraft.cityCountry}
                    onChange={(e) => updateEnquiryDraft({ cityCountry: e.target.value })}
                    placeholder="e.g. Ludhiana, India or Leicester, UK"
                    className="input-editorial"
                  />
                </div>

                <div>
                  <label
                    htmlFor="ws-approx-qty"
                    className="block text-xs font-medium uppercase tracking-wider text-ink mb-1.5"
                  >
                    Approximate Quantity Interest
                  </label>
                  <select
                    id="ws-approx-qty"
                    value={approxQuantity}
                    onChange={(e) => setApproxQuantity(e.target.value)}
                    className="input-editorial"
                  >
                    <option value="5–15 pieces (Trial Boutique Assortment)">
                      5–15 pieces (Trial Boutique Assortment)
                    </option>
                    <option value="15–30 sets / assorted">15–30 sets / assorted</option>
                    <option value="30–75 sets (Full Season Edit)">
                      30–75 sets (Full Season Edit)
                    </option>
                    <option value="75+ sets (Volume Wholesale)">
                      75+ sets (Volume Wholesale)
                    </option>
                    <option value="Need MOQ & Set Breakdown Details">
                      Need MOQ &amp; Set Breakdown Details
                    </option>
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <label
                  htmlFor="ws-requirements"
                  className="block text-xs font-medium uppercase tracking-wider text-ink mb-1.5"
                >
                  Specific Fabric, Colourway, or Dispatch Requirements
                </label>
                <textarea
                  id="ws-requirements"
                  rows={3}
                  value={enquiryDraft.customNotes}
                  onChange={(e) => updateEnquiryDraft({ customNotes: e.target.value })}
                  placeholder="Share preferred silhouettes, colour ratio questions, video-call viewing request, or freight forwarder details..."
                  className="input-editorial"
                />
              </div>

              {/* Selected Design Chips */}
              <div className="mt-6 pt-5 border-t border-ivory-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-ink">
                    Selected Design References ({activeSelectedProducts.length})
                  </span>
                  {activeSelectedProducts.length > 0 && (
                    <span className="text-xs text-ink-muted">
                      Synced with your Enquiry Bag
                    </span>
                  )}
                </div>

                {activeSelectedProducts.length === 0 ? (
                  <p className="text-xs text-ink-muted italic bg-ivory border border-dashed border-ivory-border p-3">
                    No specific design codes selected yet. Select designs from the gallery below to
                    attach exact `ACH-` reference codes to your trade inquiry.
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {activeSelectedProducts.map((item) => (
                      <div
                        key={item.id}
                        className="inline-flex items-center gap-2 pl-2.5 pr-2 py-1 bg-ivory border border-oxblood/30 text-xs text-ink"
                      >
                        <span className="font-mono font-semibold text-oxblood">
                          {item.displayId}
                        </span>
                        <span className="text-ink-muted truncate max-w-[140px]">
                          {item.title}
                        </span>
                        <button
                          type="button"
                          onClick={() => toggleProductSelection(item)}
                          aria-label={`Remove ${item.displayId}`}
                          className="p-0.5 text-ink-muted hover:text-oxblood transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right 5 cols: Sticky Live Message Preview & Handoff */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <div className="bg-ivory border-2 border-oxblood/20 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-widest text-oxblood">
                  Live WhatsApp Trade Draft
                </span>
                <span className="text-xs font-mono text-ink-muted">
                  {BUSINESS_FACTS.verifiedFromSuppliedFiles.whatsappDisplay}
                </span>
              </div>

              <pre className="bg-ivory-warm border border-ivory-border p-4 text-xs font-mono text-ink whitespace-pre-wrap leading-relaxed max-h-72 overflow-y-auto">
                {messageDraft}
              </pre>

              <div className="mt-4 space-y-2.5">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-luxury-primary w-full justify-center"
                >
                  <MessageCircle className="w-4 h-4" aria-hidden="true" />
                  <span>Send Wholesale Inquiry on WhatsApp</span>
                </a>

                <button
                  type="button"
                  onClick={handleCopyDraft}
                  className="btn-luxury-outline w-full justify-center"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-700" aria-hidden="true" />
                      <span>Copied Wholesale Draft!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" aria-hidden="true" />
                      <span>Copy Formatted Trade Inquiry Text</span>
                    </>
                  )}
                </button>
              </div>

              <div className="mt-4 pt-4 border-t border-ivory-border text-[11px] text-ink-muted space-y-1">
                <p>
                  • <strong>No Automated Billing:</strong> This concept demo never collects online
                  payments or invents wholesale rate sheets.
                </p>
                <p>
                  • <strong>Terms &amp; Availability:</strong>{' '}
                  {BUSINESS_FACTS.needsOwnerConfirmation.moqAndTradeTerms}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Browse Designs for Bulk Enquiry */}
      <section className="editorial-container pt-6">
        <div className="border-t border-ivory-border pt-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="eyebrow-label">Curated Trade Assortment</span>
              <h2 className="font-serif text-2xl sm:text-3xl text-ink mt-1">
                2. Browse Designs for Bulk Enquiry
              </h2>
              <p className="text-sm text-ink-muted mt-1">
                Click &ldquo;Add to Wholesale Enquiry&rdquo; on any design to append its reference
                code immediately to your trade sheet above.
              </p>
            </div>

            <div className="w-full sm:w-72">
              <label htmlFor="ws-catalog-filter" className="sr-only">
                Filter designs by code or colour
              </label>
              <input
                id="ws-catalog-filter"
                type="search"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Filter by ACH- code, colour, or style..."
                className="input-editorial"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredCatalog.map((product) => {
              const isSelected =
                selectedIds.includes(product.id) ||
                bagEntries.some((b) => b.productId === product.id);
              const primaryImage = product.images[0]?.publicPath;

              return (
                <article
                  key={product.id}
                  className={`border transition-all overflow-hidden bg-ivory flex flex-col ${
                    isSelected
                      ? 'border-oxblood ring-2 ring-oxblood/20'
                      : 'border-ivory-border hover:border-brass'
                  }`}
                >
                  <Link
                    to={`/product/${product.shortcode}`}
                    className="relative block group"
                  >
                    <ProductImage
                      src={primaryImage}
                      alt={product.title}
                      shortcode={product.shortcode}
                    />
                    <span className="absolute top-3 left-3 z-20 px-2.5 py-1 bg-oxblood-deep/90 text-ivory font-mono text-[11px]">
                      {product.displayId}
                    </span>
                    {product.onImageOverlayNote && (
                      <span className="absolute bottom-3 left-3 right-3 z-20 px-2.5 py-1 bg-ivory/95 text-ink text-[11px] font-medium shadow-sm">
                        Cover Note: {product.onImageOverlayNote}
                      </span>
                    )}
                  </Link>

                  <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-ink-muted mb-1">
                        <span>IG: {product.shortcode}</span>
                        <span>{product.visualColorTag || 'Showroom Edit'}</span>
                      </div>
                      <Link
                        to={`/product/${product.shortcode}`}
                        className="font-serif text-base text-ink hover:text-oxblood transition-colors line-clamp-1"
                      >
                        {product.title}
                      </Link>
                      <p className="text-xs text-ink-muted mt-0.5 line-clamp-1">
                        {product.editorialSubtitle}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleProductSelection(product)}
                      className={`w-full py-2.5 px-3 text-xs font-medium inline-flex items-center justify-center gap-1.5 transition-colors ${
                        isSelected
                          ? 'bg-oxblood text-ivory'
                          : 'bg-ivory-warm text-ink hover:bg-oxblood hover:text-ivory border border-ivory-border'
                      }`}
                    >
                      {isSelected ? (
                        <>
                          <Check className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Added to Wholesale Enquiry</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Add to Wholesale Enquiry</span>
                        </>
                      )}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};
