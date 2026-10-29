import React, { useEffect, useState } from 'react';
import { Check, Copy, MessageCircle, Sparkles, X } from 'lucide-react';
import { useStore } from '@/features/store-context';
import { buildCustomSourcingWhatsAppMessage, buildWhatsAppUrl } from '@/lib/whatsapp';
import { BUSINESS_FACTS } from '@/data/business-facts';

/**
 * SourcingModal (`Prompt 069`)
 * "Can't find a design?" personal or wholesale inquiry builder.
 */
export const SourcingModal: React.FC = () => {
  const { isSourcingModalOpen, closeSourcingModal, enquiryDraft, showToast } = useStore();

  const [buyerType, setBuyerType] = useState<'personal' | 'wholesale'>(enquiryDraft.intent);
  const [desiredStyle, setDesiredStyle] = useState('');
  const [preferredColor, setPreferredColor] = useState('');
  const [quantityInterest, setQuantityInterest] = useState('');
  const [cityCountry, setCityCountry] = useState(enquiryDraft.cityCountry || '');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setBuyerType(enquiryDraft.intent);
  }, [enquiryDraft.intent]);

  useEffect(() => {
    if (!isSourcingModalOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeSourcingModal();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKey);
    };
  }, [isSourcingModalOpen, closeSourcingModal]);

  if (!isSourcingModalOpen) return null;

  const draftMessage = buildCustomSourcingWhatsAppMessage({
    desiredStyle: desiredStyle || 'Embroidered blouse / lehenga / draped saree ensemble',
    preferredColor,
    quantityInterest,
    buyerType,
    cityCountry,
  });

  const whatsappUrl = buildWhatsAppUrl(draftMessage);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(draftMessage);
      setCopied(true);
      showToast('Copied inquiry message to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast('Please select and copy the preview text manually.');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-oxblood-deep/75 backdrop-blur-sm p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="sourcing-modal-title"
      onClick={closeSourcingModal}
    >
      <div
        className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto bg-ivory border border-ivory-border p-5 sm:p-7 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={closeSourcingModal}
          aria-label="Close sourcing inquiry modal"
          className="absolute top-3 right-3 w-11 h-11 inline-flex items-center justify-center text-ink hover:bg-ivory-warm border border-ivory-border"
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>

        <div className="flex items-center gap-2 text-brass-dark eyebrow-label mb-1">
          <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Direct Store Inquiry</span>
        </div>

        <h2 id="sourcing-modal-title" className="text-heading-3 font-semibold text-ink">
          Looking for a Specific Style or Shade?
        </h2>
        <p className="text-xs sm:text-sm text-ink-muted mt-1 leading-relaxed">
          This catalog displays 97 recent public Reels out of {BUSINESS_FACTS.verifiedFromSuppliedFiles.snapshotMetrics.postCount.toLocaleString()}+ posts from{' '}
          <strong className="text-ink">ANIL CLOTH HOUSE</strong>. Describe what you are looking for to ask the NIT Faridabad showroom directly on WhatsApp.
        </p>

        <div className="mt-4 space-y-3.5">
          <fieldset>
            <legend className="text-xs font-semibold uppercase tracking-wider text-ink mb-1.5">
              Enquiry Intent
            </legend>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setBuyerType('personal')}
                aria-pressed={buyerType === 'personal'}
                className={`min-h-[42px] px-3 py-2 text-xs font-medium border transition-colors ${
                  buyerType === 'personal'
                    ? 'bg-oxblood text-ivory border-oxblood'
                    : 'bg-ivory text-ink border-ivory-border hover:bg-ivory-warm'
                }`}
              >
                Personal Occasion Wear
              </button>
              <button
                type="button"
                onClick={() => setBuyerType('wholesale')}
                aria-pressed={buyerType === 'wholesale'}
                className={`min-h-[42px] px-3 py-2 text-xs font-medium border transition-colors ${
                  buyerType === 'wholesale'
                    ? 'bg-oxblood text-ivory border-oxblood'
                    : 'bg-ivory text-ink border-ivory-border hover:bg-ivory-warm'
                }`}
              >
                Wholesale / Bulk Buyer
              </button>
            </div>
          </fieldset>

          <div>
            <label htmlFor="sourcing-style" className="block text-xs font-semibold uppercase tracking-wider text-ink mb-1">
              Desired Look or Silhouette
            </label>
            <input
              id="sourcing-style"
              type="text"
              value={desiredStyle}
              onChange={(e) => setDesiredStyle(e.target.value)}
              placeholder="e.g., Heavy pearl-work blouse with pre-draped saree or bridal guest lehenga"
              className="w-full min-h-[42px] px-3 py-2 bg-ivory border border-ivory-border text-sm text-ink placeholder:text-ink-subtle"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="sourcing-color" className="block text-xs font-semibold uppercase tracking-wider text-ink mb-1">
                Preferred Colour Tone (Optional)
              </label>
              <input
                id="sourcing-color"
                type="text"
                value={preferredColor}
                onChange={(e) => setPreferredColor(e.target.value)}
                placeholder="e.g., Wine, Champagne Gold, Teal"
                className="w-full min-h-[42px] px-3 py-2 bg-ivory border border-ivory-border text-sm text-ink placeholder:text-ink-subtle"
              />
            </div>

            <div>
              <label htmlFor="sourcing-qty" className="block text-xs font-semibold uppercase tracking-wider text-ink mb-1">
                Quantity of Interest
              </label>
              <input
                id="sourcing-qty"
                type="text"
                value={quantityInterest}
                onChange={(e) => setQuantityInterest(e.target.value)}
                placeholder={buyerType === 'wholesale' ? 'e.g., 10–15 sets' : 'e.g., 1 piece'}
                className="w-full min-h-[42px] px-3 py-2 bg-ivory border border-ivory-border text-sm text-ink placeholder:text-ink-subtle"
              />
            </div>
          </div>

          <div>
            <label htmlFor="sourcing-city" className="block text-xs font-semibold uppercase tracking-wider text-ink mb-1">
              City / Country (Optional)
            </label>
            <input
              id="sourcing-city"
              type="text"
              value={cityCountry}
              onChange={(e) => setCityCountry(e.target.value)}
              placeholder="e.g., Delhi NCR, Mumbai, London"
              className="w-full min-h-[42px] px-3 py-2 bg-ivory border border-ivory-border text-sm text-ink placeholder:text-ink-subtle"
            />
          </div>

          <div className="bg-ivory-warm border border-ivory-border p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
                Prepared WhatsApp Message Preview
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1 text-xs text-brass-dark hover:text-oxblood font-medium"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Text'}</span>
              </button>
            </div>
            <pre className="text-xs text-ink whitespace-pre-wrap font-sans leading-relaxed max-h-32 overflow-y-auto">
              {draftMessage}
            </pre>
          </div>

          <p className="text-[11px] text-ink-muted leading-relaxed">
            Note: This prepares a direct inquiry for the store; it does not promise custom replication, guaranteed stock, or confirmed pricing until verified by {BUSINESS_FACTS.verifiedFromSuppliedFiles.brandName}.
          </p>

          <div className="flex flex-col sm:flex-row gap-2 pt-1">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-luxury-primary flex-1"
            >
              <MessageCircle className="w-4 h-4 text-brass-light" aria-hidden="true" />
              <span>Open in WhatsApp ({BUSINESS_FACTS.verifiedFromSuppliedFiles.whatsappDisplay})</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

