import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Check,
  Copy,
  ExternalLink,
  MessageCircle,
  Minus,
  Plus,
  ShieldAlert,
  ShoppingBag,
  Trash2,
} from 'lucide-react';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { clampQuantity, useStore } from '@/features/store-context';
import { ProductImage } from '@/components/media/ProductMedia';
import { buildMultiDesignWhatsAppMessage, buildWhatsAppUrl } from '@/lib/whatsapp';
import { BUSINESS_FACTS } from '@/data/business-facts';
import { getCuratedGarments } from '@/data/catalog-resolver';
import { ProductCard } from '@/components/commerce/ProductCard';
import { sanitizeExternalUrl } from '@/lib/security';

/**
 * EnquiryBagPage (`Prompts 052, 053, 054, 076`)
 * Styled like a luxury editorial cart, structurally framed as Your Enquiry Bag.
 */
export const EnquiryBagPage: React.FC = () => {
  useDocumentMeta({
    title: 'Your Enquiry Bag — Multi-Design WhatsApp Composer',
    description:
      'Review your selected occasionwear references, set quantities of interest, and compose a consolidated WhatsApp enquiry for ANIL CLOTH HOUSE.',
  });

  const {
    bagItemsWithProduct,
    totalBagDesigns,
    totalBagUnits,
    updateBagQuantity,
    updateBagNote,
    removeFromBag,
    clearBag,
    enquiryDraft,
    setEnquiryIntent,
    updateEnquiryDraft,
    showToast,
  } = useStore();

  const [showMessagePreview, setShowMessagePreview] = useState(true);
  const [copiedMessage, setCopiedMessage] = useState(false);

  const { message: composedMessage, isTruncatedWarning } = buildMultiDesignWhatsAppMessage(
    bagItemsWithProduct,
    enquiryDraft
  );
  const whatsappUrl = buildWhatsAppUrl(composedMessage);
  const emptySuggestions = getCuratedGarments().slice(0, 4);

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(composedMessage);
      setCopiedMessage(true);
      showToast('Copied formatted WhatsApp enquiry draft to clipboard');
      setTimeout(() => setCopiedMessage(false), 2500);
    } catch {
      showToast('Select and copy the message text from the preview box.');
    }
  };

  return (
    <div>
      {/* Header */}
      <section className="bg-ivory-warm border-b border-ivory-border py-8 sm:py-12">
        <div className="editorial-container flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="eyebrow-label text-brass-dark">Consolidated Store Inquiry</span>
            <h1 className="text-heading-1 font-semibold text-ink mt-1">
              Your Enquiry Bag ({totalBagDesigns} {totalBagDesigns === 1 ? 'Design' : 'Designs'})
            </h1>
            <p className="text-xs sm:text-sm text-ink-muted mt-1 max-w-2xl leading-relaxed">
              This bag saves design references so you can ask <strong className="text-ink">ANIL CLOTH HOUSE</strong> about pricing, available colours/sizes, and shipping in one structured message.{' '}
              <strong className="text-oxblood">Adding items here does not reserve stock or charge payment.</strong>
            </p>
          </div>

          {/* Personal vs Wholesale Intent Toggle (Prompt 052) */}
          <div className="bg-ivory p-2 border border-ivory-border flex items-center gap-1.5 self-start md:self-auto">
            <button
              type="button"
              onClick={() => setEnquiryIntent('personal')}
              aria-pressed={enquiryDraft.intent === 'personal'}
              className={`min-h-[38px] px-3.5 py-1.5 text-xs font-medium transition-colors ${
                enquiryDraft.intent === 'personal'
                  ? 'bg-oxblood text-ivory'
                  : 'text-ink hover:bg-ivory-warm'
              }`}
            >
              Personal Enquiry
            </button>
            <button
              type="button"
              onClick={() => setEnquiryIntent('wholesale')}
              aria-pressed={enquiryDraft.intent === 'wholesale'}
              className={`min-h-[38px] px-3.5 py-1.5 text-xs font-medium transition-colors ${
                enquiryDraft.intent === 'wholesale'
                  ? 'bg-oxblood text-ivory'
                  : 'text-ink hover:bg-ivory-warm'
              }`}
            >
              Wholesale / Bulk Intent
            </button>
          </div>
        </div>
      </section>

      <section className="py-8 sm:py-12">
        <div className="editorial-container">
          {bagItemsWithProduct.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Enquiry Bag Rows */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-ivory-border text-xs text-ink-muted">
                  <span>Selected Design References ({totalBagDesigns})</span>
                  <button
                    type="button"
                    onClick={clearBag}
                    className="inline-flex items-center gap-1 text-oxblood hover:underline font-medium"
                  >
                    <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Clear Enquiry Bag</span>
                  </button>
                </div>

                {isTruncatedWarning && (
                  <div className="p-3.5 bg-brass-champagne/60 border border-brass text-xs text-ink">
                    <strong>Note on Selection Length:</strong> You have {totalBagDesigns} designs in your bag. To keep the WhatsApp URL concise and reliable on mobile devices, the first 10 references are detailed in full and the remainder are summarized. Consider keeping selections to 1–10 items per inquiry.
                  </div>
                )}

                <div className="divide-y divide-ivory-border border border-ivory-border bg-ivory">
                  {bagItemsWithProduct.map(({ entry, product }) => {
                    const safePostUrl = sanitizeExternalUrl(product.sourcePostUrl);
                    return (
                      <article
                        key={entry.productId}
                        className="p-4 sm:p-5 grid grid-cols-12 gap-4 items-start"
                        data-testid={`bag-row-${product.shortcode}`}
                      >
                        {/* Thumbnail */}
                        <div className="col-span-4 sm:col-span-3">
                          <Link to={`/product/${product.shortcode}`} className="block">
                            <ProductImage
                              src={product.images[0]?.publicPath}
                              alt={product.title}
                              shortcode={product.shortcode}
                            />
                          </Link>
                        </div>

                        {/* Details & Quantity / Note Editor */}
                        <div className="col-span-8 sm:col-span-9 flex flex-col justify-between gap-3">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <span className="text-[11px] font-mono font-semibold text-brass-dark">
                                {product.displayId}
                              </span>
                              <h2 className="font-serif text-lg font-semibold text-ink">
                                <Link
                                  to={`/product/${product.shortcode}`}
                                  className="hover:text-oxblood"
                                >
                                  {product.title}
                                </Link>
                              </h2>
                              <p className="text-xs text-ink-muted mt-0.5">
                                {product.editorialSubtitle}
                              </p>
                              <a
                                href={safePostUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-[11px] text-ink-muted hover:text-oxblood mt-1"
                              >
                                <span>Source Reel ({product.shortcode})</span>
                                <ExternalLink className="w-3 h-3" aria-hidden="true" />
                              </a>
                            </div>

                            <button
                              type="button"
                              onClick={() => removeFromBag(product.id)}
                              aria-label={`Remove ${product.displayId} from Enquiry Bag`}
                              className="w-9 h-9 inline-flex items-center justify-center text-ink-muted hover:text-oxblood border border-ivory-border"
                            >
                              <Trash2 className="w-4 h-4" aria-hidden="true" />
                            </button>
                          </div>

                          {/* Quantity of Interest Editor (Prompt 053) */}
                          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-ivory-border/60">
                            <div>
                              <label
                                htmlFor={`qty-${product.shortcode}`}
                                className="text-xs font-medium text-ink block"
                              >
                                {enquiryDraft.intent === 'wholesale'
                                  ? 'Units / Sets of Interest:'
                                  : 'Pieces of Interest:'}
                              </label>
                              <span className="text-[10px] text-ink-muted">
                                {enquiryDraft.intent === 'wholesale'
                                  ? 'MOQ confirmed directly by store'
                                  : 'For enquiry count only'}
                              </span>
                            </div>

                            <div className="inline-flex items-center border border-ivory-border bg-ivory-warm">
                              <button
                                type="button"
                                onClick={() =>
                                  updateBagQuantity(product.id, entry.quantity - 1)
                                }
                                aria-label={`Decrease quantity for ${product.displayId}`}
                                className="w-9 h-9 inline-flex items-center justify-center text-ink hover:bg-ivory-stone"
                              >
                                <Minus className="w-3.5 h-3.5" aria-hidden="true" />
                              </button>
                              <input
                                id={`qty-${product.shortcode}`}
                                type="number"
                                min={1}
                                max={500}
                                value={entry.quantity}
                                onChange={(e) =>
                                  updateBagQuantity(
                                    product.id,
                                    clampQuantity(Number(e.target.value))
                                  )
                                }
                                className="w-14 h-9 text-center text-xs font-semibold text-ink bg-ivory focus:outline-none"
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  updateBagQuantity(product.id, entry.quantity + 1)
                                }
                                aria-label={`Increase quantity for ${product.displayId}`}
                                className="w-9 h-9 inline-flex items-center justify-center text-ink hover:bg-ivory-stone"
                              >
                                <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                              </button>
                            </div>
                          </div>

                          {/* Per-design note field */}
                          <div>
                            <label
                              htmlFor={`note-${product.shortcode}`}
                              className="sr-only"
                            >
                              Note for {product.displayId}
                            </label>
                            <input
                              id={`note-${product.shortcode}`}
                              type="text"
                              value={entry.note}
                              onChange={(e) => updateBagNote(product.id, e.target.value)}
                              placeholder="Add optional note for this design (e.g., preferred colour or blouse size)..."
                              className="w-full min-h-[38px] px-3 py-1.5 bg-ivory-warm/60 border border-ivory-border text-xs text-ink placeholder:text-ink-subtle"
                            />
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Honest Summary & WhatsApp Multi-Design Composer (Prompt 052, 054) */}
              <aside className="lg:col-span-5 lg:sticky lg:top-28 space-y-5">
                <div className="bg-ivory-warm border border-ivory-border p-5 sm:p-6 space-y-4">
                  <div className="border-b border-ivory-border pb-3">
                    <span className="eyebrow-label text-brass-dark">Enquiry Summary</span>
                    <h2 className="font-serif text-2xl font-semibold text-ink mt-0.5">
                      {enquiryDraft.intent === 'wholesale'
                        ? 'Wholesale / Bulk Enquiry Draft'
                        : 'Personal Design Enquiry Draft'}
                    </h2>
                  </div>

                  <dl className="space-y-2.5 text-xs">
                    <div className="flex justify-between">
                      <dt className="text-ink-muted">Selected Designs</dt>
                      <dd className="font-semibold text-ink">{totalBagDesigns}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-ink-muted">Total Pieces of Interest (Enquiry Count)</dt>
                      <dd className="font-semibold text-ink">{totalBagUnits} pcs</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-ink-muted">Merchandise Total</dt>
                      <dd className="font-semibold text-oxblood">
                        Pricing will be confirmed by the store
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-ink-muted">Store Payment Policy</dt>
                      <dd className="font-medium text-ink">NO COD (Confirm via WhatsApp)</dd>
                    </div>
                  </dl>

                  {/* Optional Overall Buyer Note */}
                  <div className="pt-2 border-t border-ivory-border">
                    <label
                      htmlFor="bag-overall-note"
                      className="block text-xs font-semibold uppercase tracking-wider text-ink mb-1"
                    >
                      Optional Buyer Note / Destination City
                    </label>
                    <textarea
                      id="bag-overall-note"
                      rows={2}
                      value={enquiryDraft.customNotes}
                      onChange={(e) => updateEnquiryDraft({ customNotes: e.target.value })}
                      placeholder="e.g., Delivering to New Delhi; please share current rates and dispatch timeline."
                      className="w-full p-2.5 bg-ivory border border-ivory-border text-xs text-ink placeholder:text-ink-subtle"
                    />
                  </div>

                  {/* WhatsApp Multi-Design Composer Controls (Prompt 054) */}
                  <div className="space-y-2.5 pt-2">
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-luxury-primary w-full text-xs sm:text-sm"
                    >
                      <MessageCircle className="w-4 h-4 text-brass-light" aria-hidden="true" />
                      <span>
                        Open Consolidated Enquiry in WhatsApp ({BUSINESS_FACTS.verifiedFromSuppliedFiles.whatsappDisplay})
                      </span>
                    </a>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setShowMessagePreview((p) => !p)}
                        className="btn-luxury-secondary text-xs py-2 px-3"
                      >
                        {showMessagePreview ? 'Hide Draft Preview' : 'Preview Message'}
                      </button>

                      <button
                        type="button"
                        onClick={handleCopyMessage}
                        className="btn-luxury-secondary text-xs py-2 px-3"
                      >
                        {copiedMessage ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-brass-dark" aria-hidden="true" />
                            <span>Copied Text</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-brass-dark" aria-hidden="true" />
                            <span>Copy Text</span>
                          </>
                        )}
                      </button>
                    </div>

                    {showMessagePreview && (
                      <div className="bg-ivory border border-ivory-border p-3">
                        <span className="block text-[10px] font-semibold uppercase tracking-wider text-ink-muted mb-1">
                          Exact WhatsApp Draft Preview
                        </span>
                        <pre className="text-xs text-ink whitespace-pre-wrap font-sans leading-relaxed max-h-48 overflow-y-auto">
                          {composedMessage}
                        </pre>
                      </div>
                    )}
                  </div>

                  {/* Link to 4-Step Order Enquiry / Checkout Concept (Prompt 055) */}
                  <div className="pt-4 border-t border-ivory-border space-y-2">
                    <Link
                      to="/checkout"
                      className="w-full min-h-[44px] px-4 py-2.5 bg-oxblood-deep hover:bg-oxblood text-ivory text-xs font-semibold tracking-wide inline-flex items-center justify-center gap-2 transition-colors"
                    >
                      <span>Proceed to 4-Step Enquiry Checkout Concept</span>
                      <ArrowRight className="w-4 h-4 text-brass-light" aria-hidden="true" />
                    </Link>
                    <p className="text-[11px] text-ink-muted flex items-start gap-1.5">
                      <ShieldAlert className="w-3.5 h-3.5 text-brass-dark shrink-0 mt-0.5" aria-hidden="true" />
                      <span>
                        Interactive prototype step to add contact/delivery preferences before sending via WhatsApp. No payment is collected.
                      </span>
                    </p>
                  </div>
                </div>
              </aside>
            </div>
          ) : (
            /* Empty Enquiry Bag State */
            <div className="bg-ivory-warm/70 border border-ivory-border p-8 sm:p-12 text-center space-y-6">
              <div className="w-12 h-12 rounded-full bg-ivory border border-ivory-border mx-auto flex items-center justify-center text-oxblood">
                <ShoppingBag className="w-5 h-5" aria-hidden="true" />
              </div>
              <div className="max-w-md mx-auto space-y-2">
                <h2 className="text-heading-3 font-semibold text-ink">
                  Your Enquiry Bag is empty
                </h2>
                <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
                  Add one or more designs while browsing the collection to build a consolidated multi-design WhatsApp inquiry for individual or wholesale orders.
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                <Link to="/shop" className="btn-luxury-primary text-xs">
                  Browse Curated Designs
                </Link>
                <Link to="/wholesale" className="btn-luxury-secondary text-xs">
                  Explore Wholesale Hub
                </Link>
              </div>

              <div className="pt-8 border-t border-ivory-border text-left">
                <h3 className="font-serif text-lg font-semibold text-ink mb-4 text-center">
                  Suggested Showroom Pieces
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {emptySuggestions.map((item) => (
                    <ProductCard key={item.id} product={item} compact={true} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

