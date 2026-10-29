import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Building2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Film,
  Globe,
  Instagram,
  MapPin,
  MessageCircle,
  Pause,
  Play,
  Sparkles,
} from 'lucide-react';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import {
  getCuratedGarments,
  getHeroCandidates,
  getProductsByCollection,
} from '@/data/catalog-resolver';
import { EDITORIAL_COLLECTIONS } from '@/data/collections';
import { BUSINESS_FACTS } from '@/data/business-facts';
import { ProductImage, ReelVideoPlayer } from '@/components/media/ProductMedia';
import { ProductCard } from '@/components/commerce/ProductCard';
import { RecentlyViewedStrip } from '@/components/commerce/RecentlyViewedStrip';
import { useStore } from '@/features/store-context';
import { sanitizeExternalUrl } from '@/lib/security';

export const HomePage: React.FC = () => {
  useDocumentMeta({
    title: 'Editorial Occasionwear & Wholesale Catalogue',
    description:
      'Unofficial private concept storefront for ANIL CLOTH HOUSE (@anil_cloth_house_official), NIT Faridabad. Explore embroidered blouses, lehengas, draped sarees, and Reels.',
  });

  const { openQuickView, openSourcingModal, openDemoTour } = useStore();
  const heroSlides = getHeroCandidates().slice(0, 3);
  const curatedProducts = getCuratedGarments();
  const selectedRailItems = curatedProducts.slice(0, 8);
  const lookbookPreviewItems = curatedProducts.slice(6, 12);
  const instagramOriginItems = curatedProducts.slice(12, 18);

  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showHeroVideo, setShowHeroVideo] = useState(false);

  // Respect prefers-reduced-motion & pause state for hero rotation (Prompt 022)
  useEffect(() => {
    if (isPaused || showHeroVideo || heroSlides.length <= 1) return;
    const prefersReduced =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const timer = window.setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6500);

    return () => window.clearInterval(timer);
  }, [isPaused, showHeroVideo, heroSlides.length]);

  const currentHero = heroSlides[activeSlide] || curatedProducts[0];

  const handlePrevSlide = () => {
    setShowHeroVideo(false);
    setActiveSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const handleNextSlide = () => {
    setShowHeroVideo(false);
    setActiveSlide((prev) => (prev + 1) % heroSlides.length);
  };

  return (
    <div>
      {/* SECTION 1: FASHION EDITORIAL SPLIT HERO (Prompts 021, 022, 071) */}
      <section
        aria-label="Featured Collection Editorial Hero"
        className="bg-oxblood text-ivory border-b border-brass/30 overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="editorial-container py-8 sm:py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Editorial Narrative Column */}
            <div className="lg:col-span-7 space-y-5 sm:space-y-6 order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-ivory/10 border border-brass-light/30 text-brass-light text-xs uppercase tracking-[0.18em]">
                <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                <span>NIT Faridabad Showroom • Manufacturer &amp; Wholesaler</span>
              </div>

              <h1 className="text-display-hero font-semibold text-ivory">
                Crafted for a Statement. Curated from the Showroom Floor.
              </h1>

              <p className="text-sm sm:text-base text-ivory/85 max-w-xl leading-relaxed">
                Explore ornate women&apos;s occasionwear, crystal-embellished blouses, festive lehenga sets, and pre-draped silhouettes from{' '}
                <strong className="text-ivory font-semibold">ANIL CLOTH HOUSE</strong>. Reorganized from 97 real showroom Instagram Reels for effortless individual discovery and consolidated wholesale enquiries.
              </p>

              {/* Featured Slide Reference Card */}
              {currentHero && (
                <div className="bg-oxblood-deep/75 border border-ivory/15 p-3.5 sm:p-4 max-w-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono text-brass-light font-semibold">
                        {currentHero.displayId}
                      </span>
                      {currentHero.visualColorTag && (
                        <span className="text-[11px] text-ivory/75">
                          • {currentHero.visualColorTag}
                        </span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-ivory font-medium mt-0.5">
                      {currentHero.editorialSubtitle}
                    </p>
                  </div>
                  <Link
                    to={`/product/${currentHero.shortcode}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-brass-light hover:underline shrink-0"
                  >
                    <span>Inspect Design</span>
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </Link>
                </div>
              )}

              {/* Primary Hero CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Link to="/shop" className="btn-luxury-brass">
                  <span>Explore the Edit</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>

                <Link to="/wholesale" className="btn-luxury-outline-light">
                  <span>Wholesale Enquiries</span>
                </Link>

                <button
                  type="button"
                  onClick={openDemoTour}
                  className="text-xs text-brass-light hover:underline px-2 py-2"
                >
                  How This Concept Works →
                </button>
              </div>

              {/* Slide Controls (Prompt 022) */}
              <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-ivory/80">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handlePrevSlide}
                    aria-label="Previous hero design"
                    className="w-10 h-10 inline-flex items-center justify-center border border-ivory/25 hover:border-brass-light hover:text-brass-light transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsPaused((p) => !p)}
                    aria-label={isPaused ? 'Resume slide rotation' : 'Pause slide rotation'}
                    aria-pressed={isPaused}
                    className="w-10 h-10 inline-flex items-center justify-center border border-ivory/25 hover:border-brass-light hover:text-brass-light transition-colors"
                  >
                    {isPaused ? (
                      <Play className="w-3.5 h-3.5" aria-hidden="true" />
                    ) : (
                      <Pause className="w-3.5 h-3.5" aria-hidden="true" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleNextSlide}
                    aria-label="Next hero design"
                    className="w-10 h-10 inline-flex items-center justify-center border border-ivory/25 hover:border-brass-light hover:text-brass-light transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  {heroSlides.map((slide, idx) => (
                    <button
                      key={slide.id}
                      type="button"
                      onClick={() => {
                        setShowHeroVideo(false);
                        setActiveSlide(idx);
                      }}
                      aria-label={`Show hero slide ${idx + 1}: ${slide.displayId}`}
                      aria-current={idx === activeSlide ? 'true' : undefined}
                      className={`h-2 transition-all ${
                        idx === activeSlide
                          ? 'w-8 bg-brass-light'
                          : 'w-2.5 bg-ivory/30 hover:bg-ivory/60'
                      }`}
                    />
                  ))}
                </div>

                <span className="text-[11px] font-mono text-ivory/70">
                  Slide 0{activeSlide + 1} / 0{heroSlides.length}
                </span>
              </div>
            </div>

            {/* Right Portrait Garment Frame + Real Reel Video Switch (Prompts 021, 022) */}
            <div className="lg:col-span-5 order-1 lg:order-2">
              {currentHero && (
                <div className="max-w-xs sm:max-w-sm mx-auto">
                  <div className="relative p-2 sm:p-3 bg-ivory/10 border border-brass-light/35 shadow-2xl">
                    {showHeroVideo && currentHero.videos[0]?.publicPath ? (
                      <ReelVideoPlayer
                        videoSrc={currentHero.videos[0].publicPath}
                        posterSrc={currentHero.images[0]?.publicPath}
                        alt={currentHero.title}
                        shortcode={currentHero.shortcode}
                        autoPlayMuted={true}
                      />
                    ) : (
                      <div className="relative">
                        <ProductImage
                          src={currentHero.images[0]?.publicPath}
                          alt={currentHero.images[0]?.altText || currentHero.title}
                          shortcode={currentHero.shortcode}
                          priority={true}
                        />
                        {currentHero.hasPlayableVideo && (
                          <button
                            type="button"
                            onClick={() => setShowHeroVideo(true)}
                            className="absolute bottom-3 left-3 z-20 min-h-[42px] px-3.5 py-2 bg-oxblood-deep/90 hover:bg-oxblood text-ivory text-xs font-medium inline-flex items-center gap-2 border border-brass-light/40 backdrop-blur-sm transition-colors"
                          >
                            <Film className="w-4 h-4 text-brass-light" aria-hidden="true" />
                            <span>Watch Original Reel (.mp4)</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[11px] text-ivory/75 px-1">
                    <span>Real Showroom Capture • {currentHero.displayId}</span>
                    <span>Price on request</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: TRUTHFUL CONFIDENCE & SERVICE STRIP (Prompt 023) */}
      <section
        aria-label="Verified Store Positioning and Ordering Rules"
        className="bg-ivory-warm border-b border-ivory-border"
      >
        <div className="editorial-container py-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 divide-y sm:divide-y-0 lg:divide-x divide-ivory-border">
            <div className="pt-3 sm:pt-0 lg:px-4 first:lg:pl-0 flex items-start gap-3">
              <Building2 className="w-5 h-5 text-brass-dark shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <h2 className="text-xs font-semibold uppercase tracking-wider text-ink">
                  Manufacturer &amp; Wholesaler
                </h2>
                <p className="text-xs text-ink-muted mt-0.5 leading-relaxed">
                  Stated in official Instagram profile bio &amp; captions. Open to individual enquiries and bulk boutique trade.
                </p>
              </div>
            </div>

            <div className="pt-3 sm:pt-0 lg:px-4 flex items-start gap-3">
              <MessageCircle className="w-5 h-5 text-brass-dark shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <h2 className="text-xs font-semibold uppercase tracking-wider text-ink">
                  WhatsApp Ordering • NO COD
                </h2>
                <p className="text-xs text-ink-muted mt-0.5 leading-relaxed">
                  Orders &amp; rate confirmations via{' '}
                  <strong className="text-ink">+91 8810530298</strong>. Profile explicitly states{' '}
                  <strong className="text-oxblood">NO DM&apos;S NO COD</strong>.
                </p>
              </div>
            </div>

            <div className="pt-3 sm:pt-0 lg:px-4 flex items-start gap-3">
              <MapPin className="w-5 h-5 text-brass-dark shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <h2 className="text-xs font-semibold uppercase tracking-wider text-ink">
                  Faridabad / Delhi NCR
                </h2>
                <p className="text-xs text-ink-muted mt-0.5 leading-relaxed">
                  Plot No. 1K/6A, NIT Faridabad 121001, Haryana.{' '}
                  <Link to="/contact" className="text-oxblood underline underline-offset-2">
                    View Showroom Info
                  </Link>
                </p>
              </div>
            </div>

            <div className="pt-3 sm:pt-0 lg:px-4 flex items-start gap-3">
              <Globe className="w-5 h-5 text-brass-dark shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <h2 className="text-xs font-semibold uppercase tracking-wider text-ink">
                  Worldwide Shipping Mentioned
                </h2>
                <p className="text-xs text-ink-muted mt-0.5 leading-relaxed">
                  Mentioned in public profile bio; destination eligibility, charges &amp; timeline confirmed on{' '}
                  <Link to="/shipping" className="text-oxblood underline underline-offset-2">
                    enquiry
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: CATEGORIES AS EDITORIAL TILES (Prompt 024) */}
      <section aria-labelledby="editorial-categories-heading" className="py-12 sm:py-16">
        <div className="editorial-container">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="eyebrow-label text-brass-dark">Curated Merchandising Edits</span>
              <h2 id="editorial-categories-heading" className="text-heading-2 font-semibold text-ink mt-1">
                Explore by Silhouette &amp; Surface Detail
              </h2>
            </div>
            <Link
              to="/shop"
              className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-oxblood hover:underline"
            >
              <span>Explore Everything (97 Reels)</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            {EDITORIAL_COLLECTIONS.map((col, idx) => {
              const count = getProductsByCollection(col.slug).length;
              const colSpan =
                idx === 0 || idx === 3 ? 'md:col-span-7' : 'md:col-span-5';
              return (
                <Link
                  key={col.slug}
                  to={`/collections/${col.slug}`}
                  className={`${colSpan} group relative overflow-hidden bg-ivory-warm border border-ivory-border grid grid-cols-1 sm:grid-cols-12 items-center hover:border-oxblood transition-colors`}
                >
                  <div className="sm:col-span-5 aspect-[9/14] sm:aspect-[4/5] w-full overflow-hidden bg-ivory-stone">
                    <img
                      src={col.heroImagePublicPath}
                      alt={`${col.title} — ACH-${col.heroShortcode}`}
                      loading="lazy"
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="sm:col-span-7 p-5 sm:p-6 flex flex-col justify-between gap-4">
                    <div>
                      <span className="text-[11px] font-semibold uppercase tracking-widest text-brass-dark">
                        {col.eyebrow} • {count} Designs
                      </span>
                      <h3 className="text-heading-3 font-semibold text-ink group-hover:text-oxblood mt-1">
                        {col.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-ink-muted mt-2 leading-relaxed">
                        {col.shortDescription}
                      </p>
                    </div>
                    <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-oxblood uppercase tracking-wider">
                      <span>Open Collection</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 4: CURATED 8-ITEM COLLECTION RAIL (Prompt 025) */}
      <section
        aria-labelledby="selected-pieces-heading"
        className="py-12 sm:py-16 bg-ivory-warm/60 border-y border-ivory-border"
      >
        <div className="editorial-container">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="eyebrow-label text-brass-dark">From the Collection</span>
              <h2 id="selected-pieces-heading" className="text-heading-2 font-semibold text-ink mt-1">
                Selected Showroom Pieces
              </h2>
              <p className="text-xs sm:text-sm text-ink-muted mt-1">
                Visually reviewed garment captures with playable Reel videos and instant WhatsApp price inquiry.
              </p>
            </div>
            <Link to="/shop" className="btn-luxury-secondary text-xs self-start sm:self-auto">
              View All Curated Designs
            </Link>
          </div>

          {/* Responsive Grid / Touch Rail */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
            {selectedRailItems.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: CLOSE-UP EMBROIDERY & ORNAMENTATION STORY (Prompt 027) */}
      <section aria-labelledby="embroidery-story-heading" className="py-14 sm:py-20">
        <div className="editorial-container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-6 grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <ProductImage
                  src="/media/images/De-7IkczBi5_cover.jpg"
                  alt="Embellished jewel-toned neckline detail ACH-De-7IkczBi5"
                  shortcode="De-7IkczBi5"
                />
                <p className="text-[11px] font-mono text-ink-muted">
                  Reference: ACH-De-7IkczBi5 (Choker &amp; Jewel Bodice)
                </p>
              </div>
              <div className="space-y-2 pt-6 sm:pt-10">
                <ProductImage
                  src="/media/images/De-5_dRTcdi_cover.jpg"
                  alt="Scalloped floral embroidery detail ACH-De-5_dRTcdi"
                  shortcode="De-5_dRTcdi"
                />
                <p className="text-[11px] font-mono text-ink-muted">
                  Reference: ACH-De-5_dRTcdi (Floral Scallop Lehenga)
                </p>
              </div>
            </div>

            <div className="lg:col-span-6 space-y-5">
              <span className="eyebrow-label text-brass-dark">Surface &amp; Silhouette Study</span>
              <h2 id="embroidery-story-heading" className="text-heading-2 font-semibold text-ink">
                Intricate Embellishments, Occasion-Ready Proportions
              </h2>
              <p className="text-sm sm:text-base text-ink-muted leading-relaxed">
                Across the supplied showroom Reels, each piece highlights dense surface ornamentation—combining crystal lattice work, pearl drop fringes, scalloped cutwork borders, and multi-tone floral motifs.
              </p>
              <p className="text-xs sm:text-sm text-ink-muted leading-relaxed bg-ivory-warm p-4 border-l-2 border-brass">
                <strong className="text-ink">Source Honesty Note:</strong> While ornate beadwork, sequin patterns, and structured silhouettes are visibly apparent in the showroom photography and videos, specific fabric compositions, base weaves, and care instructions are confirmed directly by the store upon inquiry.
              </p>
              <div className="pt-2">
                <Link
                  to="/collections/embroidered-edit"
                  className="btn-luxury-primary text-xs"
                >
                  <span>Discover the Details</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: WHOLESALE & TRADE SHOWCASE (Prompt 026) */}
      <section
        aria-labelledby="wholesale-intro-heading"
        className="bg-oxblood text-ivory py-14 sm:py-20 border-y border-brass/30"
      >
        <div className="editorial-container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-7 space-y-5">
              <span className="eyebrow-label text-brass-light">
                Direct From NIT Faridabad • Manufacturer &amp; Wholesaler
              </span>
              <h2 id="wholesale-intro-heading" className="text-heading-1 font-semibold text-ivory">
                Sourcing for a Boutique or Bridal Studio?
              </h2>
              <p className="text-sm sm:text-base text-ivory/85 leading-relaxed max-w-2xl">
                <strong className="text-ivory">ANIL CLOTH HOUSE</strong> describes itself in its public Instagram biography and captions as a manufacturer and wholesaler of ethnic and occasion wear. Browse design references with your team, shortlist multiple styles, and send a single structured WhatsApp trade inquiry.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3.5 bg-oxblood-deep/70 border border-ivory/15">
                  <span className="text-xs font-semibold text-brass-light block">
                    01. Select References
                  </span>
                  <span className="text-xs text-ivory/80 mt-1 block">
                    Shortlist `ACH-` design codes from 97 real showroom Reels.
                  </span>
                </div>
                <div className="p-3.5 bg-oxblood-deep/70 border border-ivory/15">
                  <span className="text-xs font-semibold text-brass-light block">
                    02. Specify Quantities
                  </span>
                  <span className="text-xs text-ivory/80 mt-1 block">
                    Indicate approximate sets or pieces of interest in the Enquiry Bag.
                  </span>
                </div>
                <div className="p-3.5 bg-oxblood-deep/70 border border-ivory/15">
                  <span className="text-xs font-semibold text-brass-light block">
                    03. Direct WhatsApp Quote
                  </span>
                  <span className="text-xs text-ivory/80 mt-1 block">
                    Confirm current wholesale rate, colour sets, MOQ &amp; dispatch directly.
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-3">
                <Link to="/wholesale" className="btn-luxury-brass">
                  <span>Explore Wholesale</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
                <Link to="/wholesale#bulk-configurator" className="btn-luxury-outline-light">
                  <span>Start a Bulk Enquiry</span>
                </Link>
              </div>

              <p className="text-xs text-brass-light/90 italic">
                Terms and availability confirmed directly by the store. No specific MOQ or trade discount is assumed by this demo.
              </p>
            </div>

            <div className="lg:col-span-5">
              <div className="max-w-xs sm:max-w-sm mx-auto bg-ivory/10 p-3 border border-brass-light/30">
                <ProductImage
                  src="/media/images/De5vvzvTSF2_cover.jpg"
                  alt="ANIL CLOTH HOUSE Wholesale Feature Garment ACH-De5vvzvTSF2"
                  shortcode="De5vvzvTSF2"
                />
                <div className="mt-2.5 flex items-center justify-between text-xs text-ivory/85 px-1">
                  <span className="font-mono text-brass-light">ACH-De5vvzvTSF2</span>
                  <Link
                    to="/product/De5vvzvTSF2"
                    className="underline hover:text-brass-light"
                  >
                    Inspect Design →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: INTERACTIVE CURATED LOOKBOOK PREVIEW (Prompt 028) */}
      <section aria-labelledby="lookbook-preview-heading" className="py-12 sm:py-16">
        <div className="editorial-container">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="eyebrow-label text-brass-dark">Visual Gallery &amp; Reels</span>
              <h2 id="lookbook-preview-heading" className="text-heading-2 font-semibold text-ink mt-1">
                Showroom Lookbook Preview
              </h2>
              <p className="text-xs sm:text-sm text-ink-muted mt-1">
                Tap any frame to inspect the full portrait still, play its original `.mp4` Reel video, or copy its reference ID.
              </p>
            </div>
            <Link to="/lookbook" className="btn-luxury-secondary text-xs self-start sm:self-auto">
              <span>View Full Lookbook</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
            {lookbookPreviewItems.map((item) => (
              <div
                key={item.id}
                className="group relative bg-ivory border border-ivory-border overflow-hidden flex flex-col"
              >
                <button
                  type="button"
                  onClick={() => openQuickView(item)}
                  className="text-left focus-visible:outline-offset-[-2px]"
                  aria-label={`Open lookbook detail and Reel video for ${item.displayId}`}
                >
                  <ProductImage
                    src={item.images[0]?.publicPath}
                    alt={item.images[0]?.altText || item.title}
                    shortcode={item.shortcode}
                    imgClassName="group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="p-2.5 bg-ivory border-t border-ivory-border">
                    <div className="flex items-center justify-between text-[10px] font-mono text-brass-dark">
                      <span>{item.displayId}</span>
                      {item.hasPlayableVideo && <span>▶ Reel</span>}
                    </div>
                    <p className="text-xs font-serif font-semibold text-ink truncate mt-0.5">
                      {item.visualColorTag || item.title}
                    </p>
                  </div>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 8: INSTAGRAM-ORIGIN DISCOVERY MODULE (Prompt 029) */}
      <section
        aria-labelledby="instagram-origin-heading"
        className="py-12 sm:py-16 bg-ivory-warm border-t border-ivory-border"
      >
        <div className="editorial-container">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 text-brass-dark eyebrow-label">
                <Instagram className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Source Provenance • {BUSINESS_FACTS.verifiedFromSuppliedFiles.instagramHandle}</span>
              </div>
              <h2 id="instagram-origin-heading" className="text-heading-2 font-semibold text-ink mt-1">
                Seen on Instagram, Explored Here
              </h2>
              <p className="text-xs sm:text-sm text-ink-muted mt-1 max-w-2xl">
                This storefront concept reorganizes public Instagram Reels from{' '}
                <a
                  href={BUSINESS_FACTS.verifiedFromSuppliedFiles.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-oxblood font-medium underline underline-offset-2"
                >
                  {BUSINESS_FACTS.verifiedFromSuppliedFiles.instagramHandle}
                </a>{' '}
                into a searchable, reference-coded catalog. Every card below links to both its local detail page and its original Instagram post.
              </p>
            </div>

            <a
              href={BUSINESS_FACTS.verifiedFromSuppliedFiles.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-luxury-secondary text-xs self-start md:self-auto"
            >
              <Instagram className="w-4 h-4 text-oxblood" aria-hidden="true" />
              <span>Open Official Instagram</span>
              <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
            </a>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
            {instagramOriginItems.map((item) => {
              const safePostUrl = sanitizeExternalUrl(item.sourcePostUrl);
              return (
                <div
                  key={item.id}
                  className="bg-ivory border border-ivory-border p-2.5 flex flex-col justify-between gap-2"
                >
                  <Link to={`/product/${item.shortcode}`} className="block group">
                    <ProductImage
                      src={item.images[0]?.publicPath}
                      alt={item.title}
                      shortcode={item.shortcode}
                      className="mb-2"
                    />
                    <span className="text-[10px] font-mono text-brass-dark block">
                      {item.displayId}
                    </span>
                    <span className="font-serif text-sm font-semibold text-ink group-hover:text-oxblood block truncate">
                      {item.title}
                    </span>
                  </Link>

                  <div className="pt-2 border-t border-ivory-border flex items-center justify-between gap-1 text-[11px]">
                    <Link
                      to={`/product/${item.shortcode}`}
                      className="font-semibold text-oxblood hover:underline"
                    >
                      View Design
                    </Link>
                    <a
                      href={safePostUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-0.5 text-ink-muted hover:text-ink"
                    >
                      <span>Original Post</span>
                      <ExternalLink className="w-3 h-3" aria-hidden="true" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 9: RECENTLY VIEWED & CUSTOM SOURCING PROMPT */}
      <RecentlyViewedStrip />
    </div>
  );
};

