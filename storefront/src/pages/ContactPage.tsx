import React, { useMemo, useState } from 'react';
import {
  AlertCircle,
  Check,
  Copy,
  ExternalLink,
  Instagram,
  MapPin,
  MessageCircle,
  Phone,
  ShieldAlert,
} from 'lucide-react';
import { BUSINESS_FACTS } from '@/data/business-facts';
import { OWNER_REVIEW_CONFIG } from '@/data/owner-review';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { buildWhatsAppUrl } from '@/lib/whatsapp';
import { sanitizePlainText } from '@/lib/security';

export const ContactPage: React.FC = () => {
  useDocumentMeta({
    title: 'Contact & NIT Faridabad Showroom',
    description:
      'Direct WhatsApp contact (+91 8810530298), Instagram handle, and NIT Faridabad showroom address details for ANIL CLOTH HOUSE.',
  });

  const [visitorName, setVisitorName] = useState('');
  const [inquiryTopic, setInquiryTopic] = useState('Personal Order / Price & Fabric Check');
  const [designRefs, setDesignRefs] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [copied, setCopied] = useState(false);

  const composedMessage = useMemo(() => {
    const lines = [
      `Hello ${BUSINESS_FACTS.verifiedFromSuppliedFiles.brandName} team,`,
      '',
      `I am reaching out via your concept storefront regarding: ${sanitizePlainText(inquiryTopic)}.`,
    ];
    if (visitorName.trim()) {
      lines.push(`• Name: ${sanitizePlainText(visitorName)}`);
    }
    if (designRefs.trim()) {
      lines.push(`• Design Reference(s): ${sanitizePlainText(designRefs)}`);
    }
    if (customMessage.trim()) {
      lines.push(`• Question / Note: ${sanitizePlainText(customMessage)}`);
    }
    lines.push('', 'Please share current availability and details. Thank you!');
    return lines.join('\n');
  }, [visitorName, inquiryTopic, designRefs, customMessage]);

  const whatsappHref = useMemo(() => buildWhatsAppUrl(composedMessage), [composedMessage]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(composedMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // ignore
    }
  };

  return (
    <div className="pb-20">
      <section className="bg-ivory-warm border-b border-ivory-border py-12 sm:py-16">
        <div className="editorial-container">
          <span className="eyebrow-label">Direct Showroom Concierge</span>
          <h1 className="font-serif text-3xl sm:text-5xl text-ink mt-1 mb-3">
            Contact &amp; Showroom Location
          </h1>
          <p className="text-sm sm:text-base text-ink-muted max-w-2xl">
            All orders, price inquiries, and wholesale consultations are handled directly on WhatsApp.
            Please review our verified contact channels and showroom address notes below.
          </p>
        </div>
      </section>

      <section className="editorial-container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left 6 cols: Verified Channels & Address Comparison */}
          <div className="lg:col-span-6 space-y-6">
            {/* Primary WhatsApp Card */}
            <div className="bg-ivory border-2 border-oxblood/25 p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-oxblood/10 text-oxblood text-xs font-semibold">
                  <Phone className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Primary Ordering Channel</span>
                </span>
                <span className="text-xs font-mono text-ink-muted">WhatsApp Only</span>
              </div>
              <h2 className="font-serif text-2xl text-ink">
                {BUSINESS_FACTS.verifiedFromSuppliedFiles.whatsappDisplay}
              </h2>
              <p className="text-xs text-ink-muted mt-1 mb-4">
                Share the `ACH-` design code, Instagram shortcode, or screenshot of the outfit you
                wish to enquire about.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-luxury-primary text-xs"
                >
                  <MessageCircle className="w-4 h-4" aria-hidden="true" />
                  <span>Chat on WhatsApp Now</span>
                </a>
                <a
                  href={BUSINESS_FACTS.verifiedFromSuppliedFiles.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-luxury-outline text-xs"
                >
                  <Instagram className="w-4 h-4 text-oxblood" aria-hidden="true" />
                  <span>{BUSINESS_FACTS.verifiedFromSuppliedFiles.instagramHandle}</span>
                  <ExternalLink className="w-3 h-3" aria-hidden="true" />
                </a>
              </div>
            </div>

            {/* Ordering Rules Banner */}
            <div className="bg-oxblood-deep text-ivory p-6">
              <div className="flex items-center gap-2 text-brass-light text-xs uppercase tracking-widest font-semibold mb-2">
                <ShieldAlert className="w-4 h-4" aria-hidden="true" />
                <span>Published Store Ordering Rules</span>
              </div>
              <ul className="space-y-2 text-xs sm:text-sm text-ivory/90">
                <li>
                  • <strong>NO DM&apos;S:</strong> Instagram Direct Messages are not monitored for
                  order booking; please message on WhatsApp (
                  {BUSINESS_FACTS.verifiedFromSuppliedFiles.whatsappDisplay}).
                </li>
                <li>
                  • <strong>NO COD:</strong> Cash on Delivery is not offered. Payment modes are
                  confirmed directly on WhatsApp during order booking.
                </li>
                <li>
                  • <strong>We Do Not Hold Items:</strong> Fast-moving ethnic sets are allocated on a
                  first-confirmed basis.
                </li>
              </ul>
            </div>

            {/* Transparent Address Comparison (Bio vs Caption) */}
            <div className="bg-ivory border border-ivory-border p-6">
              <div className="flex items-center gap-2 text-oxblood text-xs font-semibold uppercase tracking-wider mb-3">
                <MapPin className="w-4 h-4" aria-hidden="true" />
                <span>NIT Faridabad Showroom Address Records</span>
              </div>
              <p className="text-xs text-ink-muted mb-4">
                Our source archive contains two slight plot-number variations between the short
                Instagram bio line and the full address repeated inside post captions. Both are
                shown transparently below:
              </p>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 bg-ivory-warm border border-ivory-border">
                  <span className="font-semibold text-ink block mb-0.5">
                    1. Full Caption Address (Repeated Across Post Captions):
                  </span>
                  <span className="font-mono text-ink">
                    {OWNER_REVIEW_CONFIG.confirmedStoreAddress.captionDerivedLine}
                  </span>
                </div>

                <div className="p-3.5 bg-ivory-warm border border-ivory-border">
                  <span className="font-semibold text-ink block mb-0.5">
                    2. Short Instagram Bio Line:
                  </span>
                  <span className="font-mono text-ink">
                    {OWNER_REVIEW_CONFIG.confirmedStoreAddress.profileBioLine}
                  </span>
                </div>
              </div>

              <div className="mt-4 flex items-start gap-2 p-3 bg-brass/10 border border-brass/30 text-[11px] text-ink">
                <AlertCircle className="w-4 h-4 text-oxblood shrink-0 mt-0.5" aria-hidden="true" />
                <p>
                  <strong>Why there is no embedded map pin:</strong> To prevent directing visitors
                  to an unverified GPS coordinate, we do not render a guessed map pin. Please
                  request a live WhatsApp location pin from the showroom before visiting in person.
                </p>
              </div>
            </div>
          </div>

          {/* Right 6 cols: Interactive Demo Inquiry Composer */}
          <div className="lg:col-span-6">
            <div className="bg-ivory-warm border border-ivory-border p-6 sm:p-8">
              <h2 className="font-serif text-2xl text-ink mb-1">
                Compose a Showroom Message
              </h2>
              <p className="text-xs text-ink-muted mb-6">
                This frontend-only composer formats a structured message and opens WhatsApp directly
                — no personal data is stored on any server.
              </p>

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="contact-name"
                    className="block text-xs font-medium uppercase tracking-wider text-ink mb-1"
                  >
                    Your Name (Optional)
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    value={visitorName}
                    onChange={(e) => setVisitorName(e.target.value)}
                    placeholder="e.g. Priya Sharma"
                    className="input-editorial"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-topic"
                    className="block text-xs font-medium uppercase tracking-wider text-ink mb-1"
                  >
                    Inquiry Topic
                  </label>
                  <select
                    id="contact-topic"
                    value={inquiryTopic}
                    onChange={(e) => setInquiryTopic(e.target.value)}
                    className="input-editorial"
                  >
                    <option value="Personal Order / Price & Fabric Check">
                      Personal Order / Price &amp; Fabric Check
                    </option>
                    <option value="Wholesale / Boutique Trade Lot Inquiry">
                      Wholesale / Boutique Trade Lot Inquiry
                    </option>
                    <option value="Showroom Visit & Live Location Pin Request">
                      Showroom Visit &amp; Live Location Pin Request
                    </option>
                    <option value="International / Worldwide Shipping Quote">
                      International / Worldwide Shipping Quote
                    </option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="contact-refs"
                    className="block text-xs font-medium uppercase tracking-wider text-ink mb-1"
                  >
                    Design Codes of Interest (Optional)
                  </label>
                  <input
                    id="contact-refs"
                    type="text"
                    value={designRefs}
                    onChange={(e) => setDesignRefs(e.target.value)}
                    placeholder="e.g. ACH-DfC6hNDTwrJ"
                    className="input-editorial"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-note"
                    className="block text-xs font-medium uppercase tracking-wider text-ink mb-1"
                  >
                    Message or Question
                  </label>
                  <textarea
                    id="contact-note"
                    rows={3}
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    placeholder="Ask about available sizes, fabric closeup videos, or showroom hours..."
                    className="input-editorial"
                  />
                </div>

                <div className="pt-2">
                  <span className="block text-[11px] uppercase tracking-wider text-ink-muted mb-1.5">
                    Message Preview
                  </span>
                  <pre className="p-3.5 bg-ivory border border-ivory-border text-xs font-mono text-ink whitespace-pre-wrap">
                    {composedMessage}
                  </pre>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-luxury-primary flex-1 justify-center"
                  >
                    <MessageCircle className="w-4 h-4" aria-hidden="true" />
                    <span>Open in WhatsApp</span>
                  </a>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="btn-luxury-outline justify-center"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-700" aria-hidden="true" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" aria-hidden="true" />
                        <span>Copy Text</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
