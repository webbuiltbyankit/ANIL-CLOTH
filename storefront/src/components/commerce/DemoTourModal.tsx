import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Compass, RotateCcw, Sparkles, X } from 'lucide-react';
import { useStore } from '@/features/store-context';

interface TourStep {
  stepNumber: number;
  title: string;
  route: string;
  routeLabel: string;
  valueProposition: string;
  exampleShortcode: string;
  exampleImage: string;
  highlights: string[];
}

const TOUR_STEPS: TourStep[] = [
  {
    stepNumber: 1,
    title: 'Editorial Storefront From Raw Instagram Reels',
    route: '/',
    routeLabel: 'Open Editorial Home (/)',
    valueProposition:
      'Reorganizes unindexed Instagram Reels into a high-contrast couture lookbook with clear pathways for individual shoppers and bulk boutique buyers.',
    exampleShortcode: 'DfC6hNDTwrJ',
    exampleImage: '/media/images/DfC6hNDTwrJ_cover.jpg',
    highlights: [
      'Art-directed split hero preserving 640×1136 garment framing',
      'Truthful confidence strip backed strictly by supplied bio & captions',
      'Zero invented discounts, fake countdowns, or unverified claims',
    ],
  },
  {
    stepNumber: 2,
    title: 'Curated Collections & 97-Reel Archive Discovery',
    route: '/shop',
    routeLabel: 'Explore Shop & Filters (/shop)',
    valueProposition:
      'Shoppers can filter by visually reviewed editorial collections, observed colour palette, or search any Instagram shortcode directly.',
    exampleShortcode: 'De5vI8aTSed',
    exampleImage: '/media/images/De5vI8aTSed_cover.jpg',
    highlights: [
      '38 visually curated featured pieces + switch to browse all 97 Reel designs',
      'Instant shortcode search (e.g., ACH-De5vI8aTSed)',
      'Desktop sticky filter rail & mobile slide-up filter sheet',
    ],
  },
  {
    stepNumber: 3,
    title: 'Immersive Product Detail + Local .mp4 Reel Playback',
    route: '/product/DfC6hNDTwrJ',
    routeLabel: 'Inspect Product & Video (/product/DfC6hNDTwrJ)',
    valueProposition:
      'Every product detail page pairs the original portrait cover with its playable local .mp4 Instagram Reel video, structured facts, and Instagram post provenance.',
    exampleShortcode: 'DfC5XpkTzsZ',
    exampleImage: '/media/images/DfC5XpkTzsZ_cover.jpg',
    highlights: [
      'Switch seamlessly between garment still zoom and original Reel video (.mp4)',
      'Honest specifications: Price on request, NO COD notice, and source link',
      'One-tap Ask About This Design on WhatsApp (+91 8810530298)',
    ],
  },
  {
    stepNumber: 4,
    title: 'Shortlist Wishlist & Multi-Design Enquiry Bag',
    route: '/bag',
    routeLabel: 'Open Your Enquiry Bag (/bag)',
    valueProposition:
      'Instead of taking screenshots of 10 different Reels, buyers save designs into an Enquiry Bag, set desired quantities, and generate one consolidated WhatsApp draft.',
    exampleShortcode: 'De-7aBHTYcS',
    exampleImage: '/media/images/De-7aBHTYcS_cover.jpg',
    highlights: [
      'Toggle between Personal Occasion and Wholesale / Bulk intent',
      'Inline quantity stepper & per-design notes persisted in localStorage',
      'Transparent summary: Pricing & availability confirmed by the store',
    ],
  },
  {
    stepNumber: 5,
    title: 'Dedicated B2B Wholesale Destination & Bulk Configurator',
    route: '/wholesale',
    routeLabel: 'Visit Wholesale Hub (/wholesale)',
    valueProposition:
      'Honors ANIL CLOTH HOUSE’s core positioning as a Manufacturer & Wholesaler with a tailored trade landing page and bulk inquiry composer.',
    exampleShortcode: 'De5vvzvTSF2',
    exampleImage: '/media/images/De5vvzvTSF2_cover.jpg',
    highlights: [
      'Configure boutique name, city/country, design references, and piece counts',
      'No fabricated MOQ or fake trade price tables',
      'Direct WhatsApp handoff formatted for quick showroom quoting',
    ],
  },
  {
    stepNumber: 6,
    title: '4-Step Order Enquiry Concept & Client Presentation Controls',
    route: '/checkout',
    routeLabel: 'Preview Enquiry Checkout Concept (/checkout)',
    valueProposition:
      'Demonstrates how a structured enquiry checkout flow works without pretending to process payments or reserve inventory.',
    exampleShortcode: 'De-5_dRTcdi',
    exampleImage: '/media/images/De-5_dRTcdi_cover.jpg',
    highlights: [
      'Explicit NO COD & provisional worldwide shipping transparency',
      'Presentation Mode toggle & one-click Demo Data Reset for client meetings',
      'Centralized owner-review.ts ready for final brand sign-off',
    ],
  },
];

/**
 * DemoTourModal (`Prompt 094` & `Prompt 097`)
 * Guided 3–5 minute client walkthrough overlay with sample state loader & reset controls.
 */
export const DemoTourModal: React.FC = () => {
  const {
    isDemoTourOpen,
    closeDemoTour,
    isPresentationMode,
    togglePresentationMode,
    loadShowcaseSampleState,
    clearAllDemoData,
  } = useStore();
  const navigate = useNavigate();
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  useEffect(() => {
    if (!isDemoTourOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeDemoTour();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [isDemoTourOpen, closeDemoTour]);

  if (!isDemoTourOpen) return null;

  const currentStep = TOUR_STEPS[activeStepIndex];

  const handleGoToRoute = (route: string) => {
    navigate(route);
    closeDemoTour();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-oxblood-deep/80 backdrop-blur-sm p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="demo-tour-title"
      onClick={closeDemoTour}
    >
      <div
        className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto bg-ivory border border-ivory-border shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Bar */}
        <div className="bg-oxblood text-ivory px-5 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-brass-light" aria-hidden="true" />
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-brass-light block">
                Unofficial Private Concept Walkthrough
              </span>
              <h2 id="demo-tour-title" className="font-serif text-lg sm:text-xl font-semibold">
                ANIL CLOTH HOUSE — Guided Client Presentation Tour
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={closeDemoTour}
            aria-label="Close guided tour"
            className="w-10 h-10 inline-flex items-center justify-center text-ivory/80 hover:text-ivory border border-ivory/20"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Stepper Pills */}
        <div className="px-5 py-3 bg-ivory-warm border-b border-ivory-border flex items-center gap-1.5 overflow-x-auto">
          {TOUR_STEPS.map((s, idx) => (
            <button
              key={s.stepNumber}
              type="button"
              onClick={() => setActiveStepIndex(idx)}
              className={`px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors ${
                idx === activeStepIndex
                  ? 'bg-oxblood text-ivory'
                  : 'bg-ivory text-ink-muted hover:text-ink border border-ivory-border'
              }`}
            >
              0{s.stepNumber}. {s.title.split(' ')[0]}
            </button>
          ))}
        </div>

        {/* Step Content */}
        <div className="p-5 sm:p-7 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-4">
            <div className="aspect-[9/16] max-h-72 mx-auto overflow-hidden border border-ivory-border bg-ivory-warm">
              <img
                src={currentStep.exampleImage}
                alt={`Tour preview ACH-${currentStep.exampleShortcode}`}
                className="w-full h-full object-cover object-top"
              />
            </div>
            <p className="text-center text-[11px] font-mono text-ink-muted mt-1.5">
              Source Asset: ACH-{currentStep.exampleShortcode}
            </p>
          </div>

          <div className="md:col-span-8 space-y-4">
            <div className="text-xs font-semibold uppercase tracking-widest text-brass-dark">
              Step {currentStep.stepNumber} of {TOUR_STEPS.length}
            </div>
            <h3 className="text-heading-3 font-semibold text-ink">{currentStep.title}</h3>
            <p className="text-sm text-ink-muted leading-relaxed">
              {currentStep.valueProposition}
            </p>

            <ul className="space-y-2 pt-1">
              {currentStep.highlights.map((h) => (
                <li key={h} className="flex items-start gap-2 text-xs sm:text-sm text-ink">
                  <CheckCircle2 className="w-4 h-4 text-brass-dark shrink-0 mt-0.5" aria-hidden="true" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>

            <div className="pt-3 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => handleGoToRoute(currentStep.route)}
                className="btn-luxury-primary text-xs"
              >
                <span>{currentStep.routeLabel}</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>

              {activeStepIndex < TOUR_STEPS.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setActiveStepIndex((i) => i + 1)}
                  className="btn-luxury-secondary text-xs"
                >
                  Next Highlight →
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setActiveStepIndex(0)}
                  className="btn-luxury-secondary text-xs"
                >
                  Restart Tour
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Meeting Controls (Prompt 097) */}
        <div className="px-5 py-4 bg-ivory-warm border-t border-ivory-border flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={togglePresentationMode}
              aria-pressed={isPresentationMode}
              className={`min-h-[38px] px-3 py-1.5 font-medium border inline-flex items-center gap-1.5 transition-colors ${
                isPresentationMode
                  ? 'bg-oxblood text-ivory border-oxblood'
                  : 'bg-ivory text-ink border-ivory-border hover:bg-ivory-stone'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-brass-light" aria-hidden="true" />
              <span>Presentation Mode: {isPresentationMode ? 'ON' : 'OFF'}</span>
            </button>

            <button
              type="button"
              onClick={loadShowcaseSampleState}
              className="min-h-[38px] px-3 py-1.5 bg-ivory hover:bg-ivory-stone text-ink border border-ivory-border font-medium transition-colors"
            >
              Preload Sample Shortlist & Bag
            </button>
          </div>

          <button
            type="button"
            onClick={clearAllDemoData}
            className="min-h-[38px] px-3 py-1.5 text-oxblood hover:bg-oxblood/10 font-medium inline-flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Reset All Local Demo Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};

