import React from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  Eye,
  FileWarning,
  Globe,
  HelpCircle,
  RotateCcw,
  ShieldAlert,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { BUSINESS_FACTS } from '@/data/business-facts';
import { OWNER_REVIEW_CONFIG } from '@/data/owner-review';
import { useStore } from '@/features/store-context';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';

export const ShippingPage: React.FC = () => {
  useDocumentMeta({
    title: 'Shipping & Dispatch Information',
    description:
      'Worldwide shipping & NIT Faridabad showroom dispatch guidance for ANIL CLOTH HOUSE.',
  });

  return (
    <div className="editorial-container max-w-4xl py-12 sm:py-16 space-y-8">
      <div>
        <span className="eyebrow-label">Dispatch &amp; Delivery Transparency</span>
        <h1 className="font-serif text-3xl sm:text-4xl text-ink mt-1">
          Shipping &amp; Dispatch Guidance
        </h1>
        <p className="text-sm text-ink-muted mt-2">
          To protect buyers from fabricated delivery promises, this page clearly separates facts
          stated on the public Instagram profile from logistics details that must be confirmed on
          WhatsApp for your specific order.
        </p>
      </div>

      {/* Section 1: Information shown on public profile */}
      <div className="p-6 bg-ivory border border-ivory-border space-y-3">
        <div className="flex items-center gap-2 text-emerald-800 text-xs font-semibold uppercase tracking-wider">
          <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
          <span>1. Information Shown on Public Profile</span>
        </div>
        <ul className="text-sm text-ink space-y-2 leading-relaxed">
          <li>
            • <strong>Worldwide Shipping:</strong>{' '}
            {OWNER_REVIEW_CONFIG.shippingRules.statedProfileClaim}.
          </li>
          <li>
            • <strong>Dispatch Origin:</strong>{' '}
            {BUSINESS_FACTS.verifiedFromSuppliedFiles.addressDisplay}.
          </li>
          <li>
            • <strong>No Cash on Delivery:</strong>{' '}
            <em>&ldquo;{BUSINESS_FACTS.verifiedFromSuppliedFiles.noCodPolicy}&rdquo;</em> — all
            shipments are dispatched against confirmed prepaid WhatsApp orders.
          </li>
        </ul>
      </div>

      {/* Section 2: Details not yet provided */}
      <div className="p-6 bg-ivory-warm border border-ivory-border space-y-3">
        <div className="flex items-center gap-2 text-oxblood text-xs font-semibold uppercase tracking-wider">
          <FileWarning className="w-4 h-4" aria-hidden="true" />
          <span>2. Details Not Yet Provided in Public Captions</span>
        </div>
        <p className="text-sm text-ink-muted leading-relaxed">
          {OWNER_REVIEW_CONFIG.shippingRules.unconfirmedDetailsNote}
        </p>
        <ul className="text-sm text-ink-muted space-y-2 leading-relaxed">
          <li>• Domestic &amp; international courier partner names and tracking SLA windows.</li>
          <li>• Weight-based or destination-based shipping tariff slabs.</li>
          <li>• Customs duty and import tax handling terms for overseas shipments.</li>
        </ul>
      </div>

      {/* Section 3: Questions to ask the store */}
      <div className="p-6 bg-ivory border border-brass/40 space-y-3">
        <div className="flex items-center gap-2 text-ink text-xs font-semibold uppercase tracking-wider">
          <HelpCircle className="w-4 h-4 text-oxblood" aria-hidden="true" />
          <span>3. Questions to Ask the Store on WhatsApp Before Paying</span>
        </div>
        <ul className="text-sm text-ink space-y-2 leading-relaxed">
          <li>1. &ldquo;Is this ACH design code ready for immediate dispatch from Faridabad?&rdquo;</li>
          <li>
            2. &ldquo;What is the estimated shipping charge and courier service to my pin code /
            country?&rdquo;
          </li>
          <li>3. &ldquo;When will I receive the airway bill / tracking number after payment?&rdquo;</li>
        </ul>
      </div>
    </div>
  );
};

export const ReturnsPage: React.FC = () => {
  useDocumentMeta({
    title: 'Returns, Exchanges & Hold Policy',
    description:
      'Store ordering rules (NO COD, We do not hold items) and return/exchange guidance for ANIL CLOTH HOUSE.',
  });

  return (
    <div className="editorial-container max-w-4xl py-12 sm:py-16 space-y-8">
      <div>
        <span className="eyebrow-label">Provisional Policy &amp; Buyer Checklist</span>
        <h1 className="font-serif text-3xl sm:text-4xl text-ink mt-1">
          Returns, Exchanges &amp; Hold Rules
        </h1>
        <p className="text-sm text-ink-muted mt-2">
          We never publish boilerplate legal return terms that haven&apos;t been approved by the
          showroom owner. Below is what the store publicly states versus what you should confirm on
          WhatsApp.
        </p>
      </div>

      <div className="p-6 bg-ivory border border-ivory-border space-y-3">
        <div className="flex items-center gap-2 text-emerald-800 text-xs font-semibold uppercase tracking-wider">
          <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
          <span>1. Information Shown on Public Profile &amp; Notice Card (C_pknaLv-Hc)</span>
        </div>
        <ul className="text-sm text-ink space-y-2 leading-relaxed">
          <li>
            • <strong>&ldquo;We do not hold items&rdquo;:</strong>{' '}
            {OWNER_REVIEW_CONFIG.paymentAndCodPolicy.holdItemsPolicy}
          </li>
          <li>
            • <strong>&ldquo;NO DM&apos;S • NO COD&rdquo;:</strong>{' '}
            {OWNER_REVIEW_CONFIG.paymentAndCodPolicy.codNotice}
          </li>
        </ul>
      </div>

      <div className="p-6 bg-ivory-warm border border-ivory-border space-y-3">
        <div className="flex items-center gap-2 text-oxblood text-xs font-semibold uppercase tracking-wider">
          <FileWarning className="w-4 h-4" aria-hidden="true" />
          <span>2. Details Pending Formal Owner Policy</span>
        </div>
        <p className="text-sm text-ink-muted leading-relaxed">
          {OWNER_REVIEW_CONFIG.returnsRules.defaultProvisionalNote}
        </p>
      </div>

      <div className="p-6 bg-ivory border border-brass/40 space-y-3">
        <div className="flex items-center gap-2 text-ink text-xs font-semibold uppercase tracking-wider">
          <HelpCircle className="w-4 h-4 text-oxblood" aria-hidden="true" />
          <span>3. Questions to Ask the Store on WhatsApp</span>
        </div>
        <ul className="text-sm text-ink space-y-2 leading-relaxed">
          <li>
            1. &ldquo;Please confirm the exact bust/waist/length measurements for my size before
            dispatch.&rdquo;
          </li>
          <li>
            2. &ldquo;What is the procedure if an item arrives with a transit defect?&rdquo;
          </li>
        </ul>
      </div>
    </div>
  );
};

export const DemoNoticePage: React.FC = () => {
  useDocumentMeta({
    title: 'Unofficial Private Concept Demo, Privacy & Accessibility Notice',
    description:
      'Full disclosure, owner confirmation checklist, local storage controls, and WCAG accessibility statement.',
  });

  const {
    isPresentationMode,
    togglePresentationMode,
    loadShowcaseSampleState,
    clearAllDemoData,
    openDemoTour,
    wishlistIds,
    totalBagDesigns,
  } = useStore();

  const ownerConfirmEntries = Object.entries(BUSINESS_FACTS.needsOwnerConfirmation);

  return (
    <div className="editorial-container max-w-5xl py-12 sm:py-16 space-y-10">
      <div className="bg-oxblood-deep text-ivory p-6 sm:p-8 border border-brass/30">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-brass-light/20 text-brass-light text-xs font-semibold uppercase tracking-widest mb-3">
          <ShieldAlert className="w-3.5 h-3.5" aria-hidden="true" />
          <span>{BUSINESS_FACTS.demoOnly.conceptLabel}</span>
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-ivory mb-3">
          Concept Demo Disclosure, Privacy &amp; Accessibility
        </h1>
        <p className="text-sm sm:text-base text-ivory/80 leading-relaxed">
          {BUSINESS_FACTS.demoOnly.fullDisclosure}
        </p>

        <div className="mt-6 pt-6 border-t border-ivory/15 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={togglePresentationMode}
            className="btn-luxury-brass text-xs"
          >
            <Eye className="w-4 h-4" aria-hidden="true" />
            <span>
              {isPresentationMode ? 'Exit Presentation Mode' : 'Enable Presentation Mode'}
            </span>
          </button>

          <button
            type="button"
            onClick={loadShowcaseSampleState}
            className="btn-luxury-outline-light text-xs"
          >
            <Sparkles className="w-4 h-4 text-brass-light" aria-hidden="true" />
            <span>Load Sample Demo State (Wishlist + Bag)</span>
          </button>

          <button
            type="button"
            onClick={openDemoTour}
            className="btn-luxury-outline-light text-xs"
          >
            <Globe className="w-4 h-4 text-brass-light" aria-hidden="true" />
            <span>Launch 6-Step Guided Tour</span>
          </button>

          <button
            type="button"
            onClick={clearAllDemoData}
            className="inline-flex items-center gap-2 px-4 py-2.5 border border-rose-400/40 text-rose-200 text-xs font-medium hover:bg-rose-950/50 transition-colors"
          >
            <Trash2 className="w-4 h-4" aria-hidden="true" />
            <span>
              Clear Demo Data ({wishlistIds.length} Saved, {totalBagDesigns} in Bag)
            </span>
          </button>
        </div>
      </div>

      {/* Privacy & Local Storage Notice */}
      <section className="bg-ivory border border-ivory-border p-6 sm:p-8 space-y-3">
        <div className="flex items-center gap-2 text-oxblood text-xs font-semibold uppercase tracking-wider">
          <RotateCcw className="w-4 h-4" aria-hidden="true" />
          <span>Zero-Backend Privacy &amp; Browser Storage Notice</span>
        </div>
        <h2 className="font-serif text-2xl text-ink">
          How Your Enquiry Data Is Handled
        </h2>
        <p className="text-sm text-ink-muted leading-relaxed">
          This application runs 100% locally in your browser with zero backend servers, databases,
          or analytics trackers. Your Wishlist, Enquiry Bag, Recent Searches, and draft notes are
          stored strictly in your own browser&apos;s `localStorage` and are only shared with the
          store when you explicitly click a WhatsApp button. Clicking &ldquo;Clear Demo Data&rdquo;
          above (or in the footer) immediately wipes all saved demo keys.
        </p>
      </section>

      {/* Centralized Owner Confirmation Matrix (Prompt 095) */}
      <section className="bg-ivory border border-ivory-border p-6 sm:p-8 space-y-4">
        <h2 className="font-serif text-2xl text-ink">
          Owner Review &amp; Confirmation Registry ({ownerConfirmEntries.length} Areas)
        </h2>
        <p className="text-xs sm:text-sm text-ink-muted">
          Every assumption or unverified operational detail across the storefront is tracked in{' '}
          <code>src/data/owner-review.ts</code> and surfaced below for sign-off:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ownerConfirmEntries.map(([key, explanation]) => (
            <div
              key={key}
              className="p-4 bg-ivory-warm border border-ivory-border text-xs space-y-1.5"
            >
              <span className="font-mono font-semibold text-oxblood uppercase">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </span>
              <p className="text-ink-muted leading-relaxed">{explanation}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Accessibility Statement (Prompt 081) */}
      <section className="bg-ivory border border-ivory-border p-6 sm:p-8 space-y-3">
        <h2 className="font-serif text-2xl text-ink">
          Accessibility Statement (WCAG 2.1 AA Target)
        </h2>
        <ul className="text-sm text-ink-muted space-y-2 leading-relaxed">
          <li>
            • <strong>Keyboard Navigation &amp; Focus Management:</strong> Global skip-to-content
            link, visible focus rings, Escape-key dismissal on all drawers/modals (Search, Quick
            View, Sourcing, Guided Tour), and semantic landmarks (`header`, `main`, `nav`, `footer`).
          </li>
          <li>
            • <strong>Reduced Motion Respect:</strong> Honours `prefers-reduced-motion: reduce` and
            never auto-plays unmuted video reels.
          </li>
          <li>
            • <strong>Screen Reader Live Regions:</strong> Enquiry Bag additions, Wishlist toggles,
            and clipboard copy actions announce updates via `aria-live="polite"`.
          </li>
        </ul>
        <div className="pt-3">
          <Link
            to="/design-system"
            className="text-xs font-medium text-oxblood underline hover:no-underline"
          >
            Inspect Live Design System &amp; Contrast Tokens →
          </Link>
        </div>
      </section>
    </div>
  );
};
