import React from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  ExternalLink,
  Instagram,
  MapPin,
  MessageCircle,
  RotateCcw,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import { BUSINESS_FACTS } from '@/data/business-facts';
import { EDITORIAL_COLLECTIONS } from '@/data/collections';
import { useStore } from '@/features/store-context';

/**
 * GlobalFooter (`Prompt 019`)
 * Luxury multi-column footer with source-backed manufacturer/wholesaler identity,
 * verified contact channels, provisional policy links, and private demo disclosure.
 */
export const GlobalFooter: React.FC = () => {
  const {
    openDemoTour,
    openSourcingModal,
    clearAllDemoData,
    isPresentationMode,
    togglePresentationMode,
  } = useStore();

  return (
    <footer className="bg-oxblood text-ivory border-t border-brass/30">
      {/* Upper Assurance & Sourcing Banner */}
      <div className="border-b border-ivory/10 bg-oxblood-plum/40">
        <div className="editorial-container py-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <span className="eyebrow-label text-brass-light">Personal &amp; Wholesale Assistance</span>
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-ivory mt-1">
              Need Current Wholesale Rates, MOQ, or a Specific Shade?
            </h2>
            <p className="text-xs sm:text-sm text-ivory/80 mt-1">
              Speak directly with the NIT Faridabad showroom via WhatsApp ({BUSINESS_FACTS.verifiedFromSuppliedFiles.whatsappDisplay}). Remember: {BUSINESS_FACTS.verifiedFromSuppliedFiles.noCodPolicy}.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => openSourcingModal()}
              className="btn-luxury-brass text-xs"
            >
              <Sparkles className="w-4 h-4" aria-hidden="true" />
              <span>Can&apos;t Find a Design? Ask Store</span>
            </button>

            <a
              href={BUSINESS_FACTS.verifiedFromSuppliedFiles.whatsappBaseUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-luxury-outline-light text-xs"
            >
              <MessageCircle className="w-4 h-4 text-brass-light" aria-hidden="true" />
              <span>WhatsApp Showroom</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main 4-Column Footer */}
      <div className="editorial-container py-12 sm:py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10">
        {/* Column 1: Brand Identity */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center gap-3">
            <img
              src="/media/images/profile_picture.jpg"
              alt="ANIL CLOTH HOUSE visiting card thumbnail"
              width={48}
              height={48}
              loading="lazy"
              className="w-12 h-12 rounded-sm border border-brass-light/40 object-cover shrink-0"
            />
            <div>
              <span className="font-serif text-2xl font-bold tracking-wider text-ivory block leading-none">
                {BUSINESS_FACTS.verifiedFromSuppliedFiles.brandName}
              </span>
              <span className="text-xs text-brass-light tracking-wider uppercase mt-1 block">
                {BUSINESS_FACTS.verifiedFromSuppliedFiles.positioningHeadline}
              </span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-ivory/80 leading-relaxed">
            Showcasing embroidered women&apos;s occasionwear, bridal-guest blouses, lehenga sets, and pre-draped saree ensembles from NIT Faridabad. Built from real public Instagram Reels (<code className="font-mono text-brass-light">{BUSINESS_FACTS.verifiedFromSuppliedFiles.instagramHandle}</code>).
          </p>

          <div className="pt-1 space-y-2 text-xs text-ivory/85">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-brass-light shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <span className="font-medium block">
                  {BUSINESS_FACTS.verifiedFromSuppliedFiles.addressDisplay}
                </span>
                <span className="text-[11px] text-ivory/65">
                  (Address wording sourced from profile bio &amp; captions; exact map pin pending owner confirmation)
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-brass-light shrink-0" aria-hidden="true" />
              <a
                href={BUSINESS_FACTS.verifiedFromSuppliedFiles.whatsappBaseUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-brass-light underline underline-offset-4"
              >
                WhatsApp Orders: {BUSINESS_FACTS.verifiedFromSuppliedFiles.whatsappDisplay}
              </a>
            </div>

            <div className="flex items-center gap-2">
              <Instagram className="w-4 h-4 text-brass-light shrink-0" aria-hidden="true" />
              <a
                href={BUSINESS_FACTS.verifiedFromSuppliedFiles.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 hover:text-brass-light underline underline-offset-4"
              >
                <span>{BUSINESS_FACTS.verifiedFromSuppliedFiles.instagramHandle}</span>
                <ExternalLink className="w-3 h-3" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>

        {/* Column 2: Collections & Discovery */}
        <div className="lg:col-span-3 space-y-3">
          <h3 className="eyebrow-label text-brass-light">Collections &amp; Catalog</h3>
          <ul className="space-y-2 text-xs sm:text-sm text-ivory/85">
            <li>
              <Link to="/shop" className="hover:text-brass-light transition-colors">
                Shop Curated Edit (38 Designs)
              </Link>
            </li>
            <li>
              <Link to="/shop?archive=all" className="hover:text-brass-light transition-colors">
                Full Reel Archive (97 Designs)
              </Link>
            </li>
            {EDITORIAL_COLLECTIONS.map((col) => (
              <li key={col.slug}>
                <Link
                  to={`/collections/${col.slug}`}
                  className="hover:text-brass-light transition-colors"
                >
                  {col.title}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/lookbook" className="hover:text-brass-light transition-colors">
                Editorial Lookbook &amp; Reels
              </Link>
            </li>
            <li>
              <Link to="/search" className="hover:text-brass-light transition-colors">
                Search by Shortcode / ID
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Wholesale & Buyer Tools */}
        <div className="lg:col-span-2 space-y-3">
          <h3 className="eyebrow-label text-brass-light">Trade &amp; Shortlist</h3>
          <ul className="space-y-2 text-xs sm:text-sm text-ivory/85">
            <li>
              <Link to="/wholesale" className="hover:text-brass-light transition-colors">
                Wholesale Hub (B2B)
              </Link>
            </li>
            <li>
              <Link to="/bag" className="hover:text-brass-light transition-colors">
                Your Enquiry Bag
              </Link>
            </li>
            <li>
              <Link to="/wishlist" className="hover:text-brass-light transition-colors">
                Saved Wishlist
              </Link>
            </li>
            <li>
              <Link to="/checkout" className="hover:text-brass-light transition-colors">
                Enquiry Checkout Concept
              </Link>
            </li>
            <li>
              <Link to="/our-story" className="hover:text-brass-light transition-colors">
                Our Story &amp; Provenance
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-brass-light transition-colors">
                Contact &amp; Showroom
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 4: Policies & Concept Transparency */}
        <div className="lg:col-span-3 space-y-3">
          <h3 className="eyebrow-label text-brass-light">Policies &amp; Demo Controls</h3>
          <ul className="space-y-2 text-xs sm:text-sm text-ivory/85">
            <li>
              <Link to="/faq" className="hover:text-brass-light transition-colors">
                FAQs (Ordering, NO COD &amp; MOQ)
              </Link>
            </li>
            <li>
              <Link to="/shipping" className="hover:text-brass-light transition-colors">
                Shipping Info (Pending Confirmation)
              </Link>
            </li>
            <li>
              <Link to="/returns" className="hover:text-brass-light transition-colors">
                Returns &amp; Exchanges (Pending Confirmation)
              </Link>
            </li>
            <li>
              <Link to="/demo-notice" className="hover:text-brass-light transition-colors">
                Unofficial Demo &amp; Privacy Notice
              </Link>
            </li>
            {!isPresentationMode && (
              <li>
                <Link to="/design-system" className="hover:text-brass-light transition-colors text-ivory/65">
                  Internal Design System (/design-system)
                </Link>
              </li>
            )}
          </ul>

          <div className="pt-3 border-t border-ivory/15 space-y-2">
            <button
              type="button"
              onClick={openDemoTour}
              className="w-full min-h-[38px] px-3 py-1.5 bg-ivory/10 hover:bg-ivory/20 text-brass-light text-xs font-medium inline-flex items-center justify-center gap-1.5 border border-brass-light/30 transition-colors"
            >
              <Compass className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Launch Guided Demo Tour</span>
            </button>

            <div className="flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={togglePresentationMode}
                className="text-[11px] text-ivory/70 hover:text-ivory underline"
              >
                Presentation Mode: {isPresentationMode ? 'ON' : 'OFF'}
              </button>
              <button
                type="button"
                onClick={clearAllDemoData}
                className="inline-flex items-center gap-1 text-[11px] text-ivory/70 hover:text-brass-light underline"
              >
                <RotateCcw className="w-3 h-3" aria-hidden="true" />
                <span>Clear Demo Data</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Legal & Noindex Disclosure Bar (Prompts 019, 068) */}
      <div className="bg-oxblood-deep border-t border-ivory/10 text-[11px] text-ivory/70">
        <div className="editorial-container py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-brass-light shrink-0" aria-hidden="true" />
            <span>
              <strong>UNOFFICIAL PRIVATE CONCEPT DEMO</strong> • Frontend-only prototype (`noindex, nofollow`). Not an approved public brand launch or live payment store.
            </span>
          </p>
          <p className="shrink-0">
            Media &amp; metadata sourced locally from{' '}
            <a
              href={BUSINESS_FACTS.verifiedFromSuppliedFiles.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brass-light hover:underline"
            >
              @anil_cloth_house_official
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

