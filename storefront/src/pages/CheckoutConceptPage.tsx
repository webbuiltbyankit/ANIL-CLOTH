import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Copy,
  Edit3,
  Globe,
  Lock,
  MessageCircle,
  RotateCcw,
  ShieldAlert,
} from 'lucide-react';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { useStore } from '@/features/store-context';
import { buildMultiDesignWhatsAppMessage, buildWhatsAppUrl } from '@/lib/whatsapp';
import { BUSINESS_FACTS } from '@/data/business-facts';

type CheckoutStep = 1 | 2 | 3 | 4;

/**
 * CheckoutConceptPage (`Prompts 055–059, 076`)
 * Honest 4-step front-end-only Order Enquiry / Checkout Concept prototype.
 * Explicitly states no payment is collected, no stock is reserved, and NO COD applies.
 */
export const CheckoutConceptPage: React.FC = () => {
  useDocumentMeta({
    title: 'Order Enquiry / Checkout Concept (Frontend Prototype)',
    description:
      'Honest 4-step Order Enquiry / Checkout Concept prototype for ANIL CLOTH HOUSE. No live payment processing or stock reservation.',
  });

  const {
    bagItemsWithProduct,
    totalBagDesigns,
    totalBagUnits,
    enquiryDraft,
    updateEnquiryDraft,
    setEnquiryIntent,
    clearBag,
    showToast,
  } = useStore();

  const [step, setStep] = useState<CheckoutStep>(1);
  const [errors, setErrors] = useState<{ name?: string; cityCountry?: string }>({});
  const [copiedDraft, setCopiedDraft] = useState(false);

  const { message: generatedWhatsAppText } = buildMultiDesignWhatsAppMessage(
    bagItemsWithProduct,
    enquiryDraft
  );
  const whatsappUrl = buildWhatsAppUrl(generatedWhatsAppText);

  const shippingInquiryUrl = buildWhatsAppUrl(
    `Hello ${BUSINESS_FACTS.verifiedFromSuppliedFiles.brandName}, I would like to confirm shipping eligibility, estimated charges, and dispatch lead time to ${
      enquiryDraft.cityCountry || 'my destination'
    } (noting your NO COD policy).`
  );

  const validateStep1 = (): boolean => {
    const nextErrors: { name?: string; cityCountry?: string } = {};
    if (!enquiryDraft.name.trim()) {
      nextErrors.name = 'Please enter your name or boutique contact person.';
    }
    if (!enquiryDraft.cityCountry.trim()) {
      nextErrors.cityCountry = 'Please enter your destination city / country so the shop can quote delivery.';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleContinueFromStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep1()) {
      setStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleCopyDraft = async () => {
    try {
      await navigator.clipboard.writeText(generatedWhatsAppText);
      setCopiedDraft(true);
      showToast('Copied prepared enquiry draft to clipboard');
      setTimeout(() => setCopiedDraft(false), 2500);
    } catch {
      showToast('Please copy the text directly from the preview box.');
    }
  };

  return (
    <div className="py-8 sm:py-12">
      <div className="editorial-container max-w-5xl">
        {/* Top Honest Prototype Disclosure Banner (Prompt 055) */}
        <div className="bg-oxblood text-ivory p-4 sm:p-5 border border-brass/40 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-brass-light shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-widest text-brass-light block">
                Order Enquiry / Checkout Concept (Frontend-Only Prototype)
              </span>
              <p className="text-xs sm:text-sm text-ivory/90 mt-0.5 leading-relaxed">
                This prototype does <strong>not</strong> collect payment, process credit/UPI details, reserve stock, or place an automated order. It structures your contact &amp; delivery preferences into a ready-to-send WhatsApp enquiry.
              </p>
            </div>
          </div>
          <Link
            to="/bag"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-brass-light hover:underline shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Back to Enquiry Bag</span>
          </Link>
        </div>

        {/* 4-Step Progress Bar */}
        <nav aria-label="Enquiry Preparation Steps" className="mb-8">
          <ol className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { num: 1 as CheckoutStep, label: '1. Contact Details' },
              { num: 2 as CheckoutStep, label: '2. Delivery & NO-COD' },
              { num: 3 as CheckoutStep, label: '3. Review Enquiry' },
              { num: 4 as CheckoutStep, label: '4. Enquiry Draft Ready' },
            ].map((item) => {
              const active = step === item.num;
              const completed = step > item.num;
              return (
                <li key={item.num}>
                  <button
                    type="button"
                    onClick={() => {
                      if (item.num === 1 || completed || validateStep1()) {
                        setStep(item.num);
                      }
                    }}
                    aria-current={active ? 'step' : undefined}
                    className={`w-full min-h-[44px] px-3 py-2 text-left text-xs font-semibold border transition-colors flex items-center justify-between ${
                      active
                        ? 'bg-oxblood text-ivory border-oxblood'
                        : completed
                          ? 'bg-ivory-warm text-ink border-brass'
                          : 'bg-ivory text-ink-muted border-ivory-border'
                    }`}
                  >
                    <span>{item.label}</span>
                    {completed && (
                      <Check className="w-3.5 h-3.5 text-brass-dark" aria-hidden="true" />
                    )}
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Active Step Area */}
          <div className="lg:col-span-8">
            {/* STEP 1: CONTACT & BUYER PROFILE (Prompt 056) */}
            {step === 1 && (
              <form
                onSubmit={handleContinueFromStep1}
                noValidate
                className="bg-ivory border border-ivory-border p-5 sm:p-7 space-y-5"
              >
                <div className="border-b border-ivory-border pb-3">
                  <span className="eyebrow-label text-brass-dark">Step 01 of 04</span>
                  <h1 className="text-heading-2 font-semibold text-ink mt-0.5">
                    Contact &amp; Enquiry Profile
                  </h1>
                </div>

                {/* Privacy Note (Prompt 056) */}
                <div className="flex items-start gap-2.5 bg-ivory-warm p-3.5 border border-ivory-border text-xs text-ink-muted">
                  <Lock className="w-4 h-4 text-brass-dark shrink-0 mt-0.5" aria-hidden="true" />
                  <span>
                    <strong className="text-ink">Local Browser Privacy Note:</strong> No information entered here is transmitted to a server. It stays in this browser solely to format your WhatsApp message draft. We do not ask for street addresses or identity documents in this demo.
                  </span>
                </div>

                <fieldset>
                  <legend className="text-xs font-semibold uppercase tracking-wider text-ink mb-2">
                    Enquiry Type
                  </legend>
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setEnquiryIntent('personal')}
                      aria-pressed={enquiryDraft.intent === 'personal'}
                      className={`min-h-[44px] px-4 py-2 text-xs font-semibold border transition-colors ${
                        enquiryDraft.intent === 'personal'
                          ? 'bg-oxblood text-ivory border-oxblood'
                          : 'bg-ivory text-ink border-ivory-border hover:bg-ivory-warm'
                      }`}
                    >
                      Personal Occasion Buyer
                    </button>
                    <button
                      type="button"
                      onClick={() => setEnquiryIntent('wholesale')}
                      aria-pressed={enquiryDraft.intent === 'wholesale'}
                      className={`min-h-[44px] px-4 py-2 text-xs font-semibold border transition-colors ${
                        enquiryDraft.intent === 'wholesale'
                          ? 'bg-oxblood text-ivory border-oxblood'
                          : 'bg-ivory text-ink border-ivory-border hover:bg-ivory-warm'
                      }`}
                    >
                      Wholesale / Boutique Buyer
                    </button>
                  </div>
                </fieldset>

                <div>
                  <label
                    htmlFor="checkout-name"
                    className="block text-xs font-semibold uppercase tracking-wider text-ink mb-1"
                  >
                    Your Name <span className="text-oxblood">*</span>
                  </label>
                  <input
                    id="checkout-name"
                    type="text"
                    autoComplete="name"
                    required
                    value={enquiryDraft.name}
                    onChange={(e) => {
                      updateEnquiryDraft({ name: e.target.value });
                      if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                    }}
                    placeholder="e.g., Priya Sharma"
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? 'checkout-name-error' : undefined}
                    className="w-full min-h-[44px] px-3.5 py-2 bg-ivory border border-ivory-border text-sm text-ink"
                  />
                  {errors.name && (
                    <p id="checkout-name-error" className="text-xs text-oxblood font-medium mt-1">
                      {errors.name}
                    </p>
                  )}
                </div>

                {enquiryDraft.intent === 'wholesale' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="checkout-business"
                        className="block text-xs font-semibold uppercase tracking-wider text-ink mb-1"
                      >
                        Boutique / Business Name (Optional)
                      </label>
                      <input
                        id="checkout-business"
                        type="text"
                        autoComplete="organization"
                        value={enquiryDraft.businessName}
                        onChange={(e) => updateEnquiryDraft({ businessName: e.target.value })}
                        placeholder="e.g., Aarya Bridal Studio"
                        className="w-full min-h-[44px] px-3.5 py-2 bg-ivory border border-ivory-border text-sm text-ink"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="checkout-buyer-type"
                        className="block text-xs font-semibold uppercase tracking-wider text-ink mb-1"
                      >
                        Buyer Category (Optional)
                      </label>
                      <select
                        id="checkout-buyer-type"
                        value={enquiryDraft.buyerType}
                        onChange={(e) =>
                          updateEnquiryDraft({
                            buyerType: e.target.value as typeof enquiryDraft.buyerType,
                          })
                        }
                        className="w-full min-h-[44px] px-3.5 py-2 bg-ivory border border-ivory-border text-sm text-ink"
                      >
                        <option value="">Select buyer category...</option>
                        <option value="boutique">Retail Boutique / Showroom</option>
                        <option value="reseller">Independent Reseller / Stylist</option>
                        <option value="international">International / Export Buyer</option>
                      </select>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="checkout-city"
                      className="block text-xs font-semibold uppercase tracking-wider text-ink mb-1"
                    >
                      Destination City &amp; Country <span className="text-oxblood">*</span>
                    </label>
                    <input
                      id="checkout-city"
                      type="text"
                      required
                      value={enquiryDraft.cityCountry}
                      onChange={(e) => {
                        updateEnquiryDraft({ cityCountry: e.target.value });
                        if (errors.cityCountry)
                          setErrors((prev) => ({ ...prev, cityCountry: undefined }));
                      }}
                      placeholder="e.g., New Delhi, India or Dubai, UAE"
                      aria-invalid={Boolean(errors.cityCountry)}
                      aria-describedby={errors.cityCountry ? 'checkout-city-error' : undefined}
                      className="w-full min-h-[44px] px-3.5 py-2 bg-ivory border border-ivory-border text-sm text-ink"
                    />
                    {errors.cityCountry && (
                      <p id="checkout-city-error" className="text-xs text-oxblood font-medium mt-1">
                        {errors.cityCountry}
                      </p>
                    )}
                    <span className="text-[11px] text-ink-muted block mt-1">
                      Delivery availability and charges to your destination will be confirmed by the store.
                    </span>
                  </div>

                  <div>
                    <label
                      htmlFor="checkout-contact"
                      className="block text-xs font-semibold uppercase tracking-wider text-ink mb-1"
                    >
                      Phone or Email (Optional)
                    </label>
                    <input
                      id="checkout-contact"
                      type="tel"
                      inputMode="tel"
                      value={enquiryDraft.phoneOrEmail}
                      onChange={(e) => updateEnquiryDraft({ phoneOrEmail: e.target.value })}
                      placeholder="e.g., +91 98XXXXXXXX"
                      className="w-full min-h-[44px] px-3.5 py-2 bg-ivory border border-ivory-border text-sm text-ink"
                    />
                  </div>
                </div>

                <div className="pt-3 flex justify-end">
                  <button type="submit" className="btn-luxury-primary text-xs">
                    <span>Continue to Delivery &amp; Policies</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              </form>
            )}

            {/* STEP 2: DELIVERY PREFERENCE, SHIPPING & NO-COD TRANSPARENCY (Prompt 057) */}
            {step === 2 && (
              <div className="bg-ivory border border-ivory-border p-5 sm:p-7 space-y-6">
                <div className="border-b border-ivory-border pb-3">
                  <span className="eyebrow-label text-brass-dark">Step 02 of 04</span>
                  <h1 className="text-heading-2 font-semibold text-ink mt-0.5">
                    Delivery Preference &amp; NO-COD Policy
                  </h1>
                </div>

                <fieldset className="space-y-2.5">
                  <legend className="text-xs font-semibold uppercase tracking-wider text-ink mb-2">
                    Preferred Fulfillment Discussion Option
                  </legend>

                  {[
                    {
                      val: 'discuss_on_whatsapp',
                      title: 'Confirm Best Shipping Option on WhatsApp',
                      desc: 'Discuss courier availability, dispatch timing, and charges directly with the store.',
                    },
                    {
                      val: 'pickup_faridabad',
                      title: 'Visit NIT Faridabad Showroom In Person',
                      desc: 'Inspect garments and finalize directly at Plot No. 1K/6A, NIT Faridabad 121001.',
                    },
                    {
                      val: 'domestic_courier',
                      title: 'Domestic Courier Inquiry (Within India)',
                      desc: 'Request domestic shipping charges and estimated transit days.',
                    },
                    {
                      val: 'international_shipping',
                      title: 'Worldwide / International Shipping Inquiry',
                      desc: 'Profile bio mentions Worldwide Shipping; confirm country eligibility & export courier rates.',
                    },
                  ].map((opt) => (
                    <label
                      key={opt.val}
                      className={`flex items-start gap-3 p-3.5 border cursor-pointer transition-colors ${
                        enquiryDraft.deliveryPreference === opt.val
                          ? 'bg-ivory-warm border-oxblood'
                          : 'bg-ivory border-ivory-border hover:bg-ivory-warm/50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="delivery-pref"
                        checked={enquiryDraft.deliveryPreference === opt.val}
                        onChange={() =>
                          updateEnquiryDraft({
                            deliveryPreference: opt.val as typeof enquiryDraft.deliveryPreference,
                          })
                        }
                        className="mt-1 accent-oxblood"
                      />
                      <div>
                        <span className="text-xs sm:text-sm font-semibold text-ink block">
                          {opt.title}
                        </span>
                        <span className="text-xs text-ink-muted block mt-0.5">{opt.desc}</span>
                      </div>
                    </label>
                  ))}
                </fieldset>

                {/* Shipping & NO-COD Transparency Panel (Prompt 057) */}
                <div className="bg-ivory-warm border-l-4 border-oxblood p-4 sm:p-5 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-oxblood">
                    <Globe className="w-4 h-4" aria-hidden="true" />
                    <span>Shipping &amp; Payment Transparency</span>
                  </div>
                  <ul className="space-y-2 text-xs text-ink leading-relaxed list-disc list-inside">
                    <li>
                      <strong>Cash on Delivery (COD) Not Offered:</strong> The store&apos;s public Instagram bio and notice post explicitly state{' '}
                      <code className="font-mono font-semibold text-oxblood">NO DM&apos;S NO COD</code> and{' '}
                      <em>&ldquo;We do not hold items.&rdquo;</em>
                    </li>
                    <li>
                      <strong>Worldwide Shipping Mentioned:</strong> While the profile biography mentions{' '}
                      <em>Worldwide shipping</em>, eligible countries, courier charges, and lead times are not published in source metadata and must be confirmed with the shop.
                    </li>
                    <li>
                      <strong>No Online Payment Gateways Here:</strong> No card numbers, UPI IDs, or shipping fees are collected in this unofficial concept demo.
                    </li>
                  </ul>

                  <div className="pt-1">
                    <a
                      href={shippingInquiryUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-oxblood hover:underline"
                    >
                      <MessageCircle className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Ask About Shipping on WhatsApp →</span>
                    </a>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="checkout-notes"
                    className="block text-xs font-semibold uppercase tracking-wider text-ink mb-1"
                  >
                    Additional Questions or Delivery Notes (Optional)
                  </label>
                  <textarea
                    id="checkout-notes"
                    rows={3}
                    value={enquiryDraft.customNotes}
                    onChange={(e) => updateEnquiryDraft({ customNotes: e.target.value })}
                    placeholder="e.g., Needed for a wedding in December; please confirm blouse size margin and courier timeline."
                    className="w-full p-3 bg-ivory border border-ivory-border text-xs sm:text-sm text-ink"
                  />
                </div>

                <div className="pt-2 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="btn-luxury-secondary text-xs"
                  >
                    <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                    <span>Back to Contact</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setStep(3);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="btn-luxury-primary text-xs"
                  >
                    <span>Review Enquiry Draft</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: POLISHED CHECKOUT REVIEW SCREEN (Prompt 058) */}
            {step === 3 && (
              <div className="bg-ivory border border-ivory-border p-5 sm:p-7 space-y-6">
                <div className="border-b border-ivory-border pb-3">
                  <span className="eyebrow-label text-brass-dark">Step 03 of 04</span>
                  <h1 className="text-heading-2 font-semibold text-ink mt-0.5">
                    Review Your Enquiry Draft
                  </h1>
                  <p className="text-xs text-ink-muted mt-1">
                    Verify your contact preferences and selected design references before generating your ready-to-send WhatsApp message.
                  </p>
                </div>

                {/* Contact & Delivery Summary with Edit Actions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-ivory-warm border border-ivory-border space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold uppercase tracking-wider text-ink-muted">
                        Contact Profile
                      </span>
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="inline-flex items-center gap-1 text-oxblood font-semibold hover:underline"
                      >
                        <Edit3 className="w-3 h-3" aria-hidden="true" />
                        <span>Edit</span>
                      </button>
                    </div>
                    <p className="font-semibold text-ink">{enquiryDraft.name || 'Not specified'}</p>
                    <p className="text-ink-muted">
                      Intent:{' '}
                      <strong className="text-ink capitalize">{enquiryDraft.intent}</strong>
                    </p>
                    {enquiryDraft.businessName && (
                      <p className="text-ink-muted">Boutique: {enquiryDraft.businessName}</p>
                    )}
                    <p className="text-ink-muted">
                      Location: {enquiryDraft.cityCountry || 'To be confirmed'}
                    </p>
                    {enquiryDraft.phoneOrEmail && (
                      <p className="text-ink-muted">Contact: {enquiryDraft.phoneOrEmail}</p>
                    )}
                  </div>

                  <div className="p-4 bg-ivory-warm border border-ivory-border space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold uppercase tracking-wider text-ink-muted">
                        Fulfillment &amp; Terms
                      </span>
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="inline-flex items-center gap-1 text-oxblood font-semibold hover:underline"
                      >
                        <Edit3 className="w-3 h-3" aria-hidden="true" />
                        <span>Edit</span>
                      </button>
                    </div>
                    <p className="font-semibold text-ink">
                      {enquiryDraft.deliveryPreference.replace(/_/g, ' ').toUpperCase()}
                    </p>
                    <p className="text-ink-muted">
                      Price &amp; Availability:{' '}
                      <strong className="text-oxblood">To be confirmed by store</strong>
                    </p>
                    <p className="text-ink-muted">
                      Payment Rule: <strong className="text-ink">NO COD</strong>
                    </p>
                  </div>
                </div>

                {/* Selected Designs List */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold uppercase tracking-wider text-ink">
                      Chosen Designs ({totalBagDesigns} designs • {totalBagUnits} units of interest)
                    </span>
                    <Link to="/bag" className="text-oxblood font-semibold hover:underline">
                      Edit Designs in Bag →
                    </Link>
                  </div>

                  {bagItemsWithProduct.length > 0 ? (
                    <div className="divide-y divide-ivory-border border border-ivory-border">
                      {bagItemsWithProduct.map(({ entry, product }) => (
                        <div
                          key={entry.productId}
                          className="p-3 flex items-center justify-between gap-3 text-xs"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={product.images[0]?.publicPath}
                              alt={product.title}
                              className="w-10 h-14 object-cover object-top border border-ivory-border shrink-0"
                            />
                            <div>
                              <span className="font-mono font-semibold text-brass-dark block">
                                {product.displayId}
                              </span>
                              <span className="font-serif font-semibold text-sm text-ink block">
                                {product.title}
                              </span>
                              {entry.note && (
                                <span className="text-[11px] text-ink-muted block">
                                  Note: {entry.note}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="font-semibold text-ink block">
                              {entry.quantity} {entry.quantity === 1 ? 'unit' : 'units'} of interest
                            </span>
                            <span className="text-[11px] text-oxblood">Price on request</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-ink-muted italic p-4 bg-ivory-warm border border-ivory-border">
                      No specific designs in bag — your enquiry will be prepared as a general store/wholesale inquiry.
                    </p>
                  )}
                </div>

                <div className="pt-3 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="btn-luxury-secondary text-xs"
                  >
                    <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                    <span>Back</span>
                  </button>

                  {/* Primary Action is Prepare Enquiry, never Place Order (Prompt 058) */}
                  <button
                    type="button"
                    onClick={() => {
                      setStep(4);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="btn-luxury-primary text-xs sm:text-sm"
                  >
                    <span>Prepare Enquiry Draft</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: CLIENT-SIDE ENQUIRY CONFIRMATION WITHOUT FAKE SUCCESS (Prompt 059) */}
            {step === 4 && (
              <div
                className="bg-ivory border-2 border-brass p-5 sm:p-8 space-y-6"
                data-testid="enquiry-confirmation-step"
              >
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-7 h-7 text-brass-dark shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <span className="eyebrow-label text-brass-dark">Step 04 of 04 • Prototype Complete</span>
                    <h1 className="text-heading-2 font-semibold text-ink mt-0.5">
                      Your enquiry draft is ready
                    </h1>
                    <p className="text-xs sm:text-sm text-ink-muted mt-1 leading-relaxed">
                      <strong className="text-oxblood">Important:</strong> The store has received nothing yet. No order has been placed and no inventory is held. Click{' '}
                      <strong className="text-ink">Open WhatsApp</strong> below to send your prepared message to{' '}
                      <strong className="text-ink">{BUSINESS_FACTS.verifiedFromSuppliedFiles.whatsappDisplay}</strong>, or copy the text manually.
                    </p>
                  </div>
                </div>

                {/* Accessible Preview of Generated Text */}
                <div className="bg-ivory-warm border border-ivory-border p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-ink">
                      Prepared WhatsApp Message Text
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyDraft}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-oxblood hover:underline"
                    >
                      {copiedDraft ? (
                        <>
                          <Check className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Copied to Clipboard</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Copy Message Text</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="text-xs sm:text-sm text-ink whitespace-pre-wrap font-sans leading-relaxed max-h-64 overflow-y-auto bg-ivory p-3.5 border border-ivory-border">
                    {generatedWhatsAppText}
                  </pre>
                </div>

                {/* Primary & Secondary Handoff Actions */}
                <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-luxury-primary flex-1 text-sm"
                  >
                    <MessageCircle className="w-4 h-4 text-brass-light" aria-hidden="true" />
                    <span>
                      Open WhatsApp &amp; Send ({BUSINESS_FACTS.verifiedFromSuppliedFiles.whatsappDisplay})
                    </span>
                  </a>

                  <button
                    type="button"
                    onClick={handleCopyDraft}
                    className="btn-luxury-secondary text-xs"
                  >
                    <Copy className="w-4 h-4 text-oxblood" aria-hidden="true" />
                    <span>{copiedDraft ? 'Copied!' : 'Copy Text'}</span>
                  </button>
                </div>

                <div className="pt-4 border-t border-ivory-border flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="text-ink-muted hover:text-ink underline"
                    >
                      ← Edit Review Details
                    </button>
                    <Link to="/shop" className="text-oxblood font-semibold hover:underline">
                      Return to Browsing →
                    </Link>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      clearBag();
                      setStep(1);
                    }}
                    className="inline-flex items-center gap-1 text-ink-muted hover:text-oxblood"
                  >
                    <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Clear Enquiry Bag &amp; Reset</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Summary Sidebar */}
          <aside className="lg:col-span-4 bg-ivory-warm border border-ivory-border p-5 space-y-4">
            <h2 className="font-serif text-xl font-semibold text-ink border-b border-ivory-border pb-2.5">
              Transparent Summary
            </h2>

            <dl className="space-y-2 text-xs">
              <div className="flex justify-between">
                <dt className="text-ink-muted">Enquiry Mode</dt>
                <dd className="font-semibold text-ink capitalize">{enquiryDraft.intent}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-muted">Designs Included</dt>
                <dd className="font-semibold text-ink">{totalBagDesigns}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-muted">Total Units of Interest</dt>
                <dd className="font-semibold text-ink">{totalBagUnits}</dd>
              </div>
              <div className="flex justify-between pt-2 border-t border-ivory-border">
                <dt className="text-ink-muted font-medium">Price &amp; Availability</dt>
                <dd className="font-semibold text-oxblood text-right">
                  To be confirmed by store
                </dd>
              </div>
            </dl>

            <p className="text-[11px] text-ink-muted leading-relaxed pt-2 border-t border-ivory-border">
              Per <strong className="text-ink">ANIL CLOTH HOUSE</strong> public profile: <code className="font-mono">NO DM&apos;S NO COD</code>. All pricing, shipping charges, and dispatch timelines are agreed directly on WhatsApp.
            </p>
          </aside>
        </div>
      </div>
    </div>
  );
};

