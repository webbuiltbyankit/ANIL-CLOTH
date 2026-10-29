import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import {
  ChevronDown,
  Compass,
  Heart,
  Menu,
  MessageCircle,
  Search,
  ShieldAlert,
  ShoppingBag,
  Sparkles,
  X,
} from 'lucide-react';
import { useStore } from '@/features/store-context';
import { BUSINESS_FACTS } from '@/data/business-facts';
import { EDITORIAL_COLLECTIONS } from '@/data/collections';
import { getProductsByCollection } from '@/data/catalog-resolver';

/**
 * GlobalHeader (`Prompts 016, 017, 020, 068`)
 * Includes top disclosure & service strip, desktop header with accessible Collections Mega Menu,
 * and responsive mobile drawer + bottom navigation bar.
 */
export const GlobalHeader: React.FC = () => {
  const {
    wishlistIds,
    totalBagDesigns,
    openSearch,
    openDemoTour,
    enquiryDraft,
    setEnquiryIntent,
  } = useStore();
  const location = useLocation();

  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isMobileCollectionsExpanded, setIsMobileCollectionsExpanded] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);

  // Close menus on route change
  useEffect(() => {
    setIsMegaMenuOpen(false);
    setIsMobileDrawerOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 16);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!isMobileDrawerOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMobileDrawerOpen(false);
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [isMobileDrawerOpen]);

  const nonEmptyCollections = EDITORIAL_COLLECTIONS.filter(
    (col) => getProductsByCollection(col.slug).length > 0
  );

  return (
    <>
      <header className="sticky top-0 z-40 w-full">
        {/* Top Responsible Demo Disclosure & Sourced Info Strip (Prompts 016, 068) */}
        <div className="bg-oxblood-deep text-ivory/90 border-b border-ivory/15 text-[11px] sm:text-xs">
          <div className="editorial-container py-2 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-brass-light/20 text-brass-light font-semibold tracking-wider uppercase text-[10px] border border-brass-light/30">
                <ShieldAlert className="w-3 h-3" aria-hidden="true" />
                <span>Unofficial Private Concept Demo</span>
              </span>
              <span className="hidden md:inline text-ivory/80">
                Manufacturer &amp; Wholesaler • NIT Faridabad •{' '}
                <strong className="text-brass-light">NO COD</strong>
              </span>
            </div>

            <div className="flex items-center gap-3 sm:gap-4">
              <button
                type="button"
                onClick={openDemoTour}
                className="inline-flex items-center gap-1 text-brass-light hover:underline font-medium"
              >
                <Compass className="w-3.5 h-3.5" aria-hidden="true" />
                <span>View Demo Tour</span>
              </button>
              <Link
                to="/demo-notice"
                className="text-ivory/80 hover:text-ivory underline underline-offset-2"
              >
                Concept Notice
              </Link>
              <a
                href={BUSINESS_FACTS.verifiedFromSuppliedFiles.whatsappBaseUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1 text-ivory hover:text-brass-light font-medium"
              >
                <MessageCircle className="w-3.5 h-3.5 text-brass-light" aria-hidden="true" />
                <span>{BUSINESS_FACTS.verifiedFromSuppliedFiles.whatsappDisplay}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Main Navigation Bar */}
        <div
          className={`bg-ivory/95 backdrop-blur-md border-b border-ivory-border transition-shadow duration-200 ${
            isScrolled ? 'shadow-md' : ''
          }`}
        >
          <div className="editorial-container min-h-[64px] sm:min-h-[80px] py-1.5 flex items-center justify-between gap-1 sm:gap-3">
            {/* Mobile Hamburger Trigger */}
            <div className="flex items-center gap-0 sm:gap-1 lg:hidden shrink-0">
              <button
                type="button"
                onClick={() => setIsMobileDrawerOpen(true)}
                aria-expanded={isMobileDrawerOpen}
                aria-controls="mobile-navigation-drawer"
                aria-label="Open navigation menu"
                className="w-10 h-10 sm:w-11 sm:h-11 inline-flex items-center justify-center text-ink hover:bg-ivory-warm"
              >
                <Menu className="w-5 h-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={openSearch}
                aria-label="Open search"
                className="w-10 h-10 sm:w-11 sm:h-11 inline-flex items-center justify-center text-ink hover:bg-ivory-warm"
              >
                <Search className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            {/* Brand Wordmark (Prompt 016: sophisticated text wordmark instead of blurry 100x100 card) */}
            <Link
              to="/"
              className="flex flex-col items-center lg:items-start text-center lg:text-left group min-w-0 px-0.5"
            >
              <span className="font-serif text-[14px] sm:text-2xl md:text-[26px] font-bold tracking-[0.02em] sm:tracking-[0.08em] text-oxblood leading-tight whitespace-nowrap">
                {BUSINESS_FACTS.verifiedFromSuppliedFiles.brandName}
              </span>
              <span className="hidden sm:block text-[10px] uppercase tracking-[0.18em] text-ink-muted mt-0.5">
                NIT Faridabad • Occasionwear &amp; Wholesale
              </span>
              <span className="sm:hidden text-[8.5px] uppercase tracking-[0.12em] text-ink-muted">
                NIT Faridabad
              </span>
            </Link>

            {/* Desktop Primary Nav */}
            <nav
              aria-label="Primary Navigation"
              className="hidden lg:flex items-center gap-6 text-sm font-medium text-ink"
            >
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `py-2 border-b-2 transition-colors ${
                    isActive
                      ? 'border-oxblood text-oxblood font-semibold'
                      : 'border-transparent hover:text-oxblood'
                  }`
                }
              >
                Home
              </NavLink>

              <NavLink
                to="/shop"
                className={({ isActive }) =>
                  `py-2 border-b-2 transition-colors ${
                    isActive
                      ? 'border-oxblood text-oxblood font-semibold'
                      : 'border-transparent hover:text-oxblood'
                  }`
                }
              >
                Shop
              </NavLink>

              {/* Collections Mega Menu Trigger (Prompt 017) */}
              <div
                className="relative"
                onMouseEnter={() => setIsMegaMenuOpen(true)}
                onMouseLeave={() => setIsMegaMenuOpen(false)}
              >
                <button
                  type="button"
                  onClick={() => setIsMegaMenuOpen((prev) => !prev)}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') setIsMegaMenuOpen(false);
                  }}
                  aria-expanded={isMegaMenuOpen}
                  aria-haspopup="true"
                  className={`inline-flex items-center gap-1 py-2 border-b-2 transition-colors ${
                    location.pathname.startsWith('/collections')
                      ? 'border-oxblood text-oxblood font-semibold'
                      : 'border-transparent hover:text-oxblood'
                  }`}
                >
                  <span>Collections</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isMegaMenuOpen ? 'rotate-180' : ''
                    }`}
                    aria-hidden="true"
                  />
                </button>
              </div>

              <NavLink
                to="/lookbook"
                className={({ isActive }) =>
                  `py-2 border-b-2 transition-colors ${
                    isActive
                      ? 'border-oxblood text-oxblood font-semibold'
                      : 'border-transparent hover:text-oxblood'
                  }`
                }
              >
                Lookbook &amp; Reels
              </NavLink>

              <NavLink
                to="/wholesale"
                className={({ isActive }) =>
                  `py-2 border-b-2 transition-colors ${
                    isActive
                      ? 'border-oxblood text-oxblood font-semibold'
                      : 'border-transparent hover:text-oxblood'
                  }`
                }
              >
                Wholesale
              </NavLink>

              <NavLink
                to="/our-story"
                className={({ isActive }) =>
                  `py-2 border-b-2 transition-colors ${
                    isActive
                      ? 'border-oxblood text-oxblood font-semibold'
                      : 'border-transparent hover:text-oxblood'
                  }`
                }
              >
                Our Story
              </NavLink>

              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  `py-2 border-b-2 transition-colors ${
                    isActive
                      ? 'border-oxblood text-oxblood font-semibold'
                      : 'border-transparent hover:text-oxblood'
                  }`
                }
              >
                Contact
              </NavLink>
            </nav>

            {/* Right Action Icons & Wholesale Entry Point */}
            <div className="flex items-center gap-0 sm:gap-2 shrink-0">
              <button
                type="button"
                onClick={openSearch}
                aria-label="Search catalog by shortcode or style"
                className="hidden lg:inline-flex w-11 h-11 items-center justify-center text-ink hover:text-oxblood hover:bg-ivory-warm transition-colors"
              >
                <Search className="w-5 h-5" aria-hidden="true" />
              </button>

              <Link
                to="/wishlist"
                aria-label={`Saved Wishlist (${wishlistIds.length} items)`}
                className="relative w-10 h-10 sm:w-11 sm:h-11 inline-flex items-center justify-center text-ink hover:text-oxblood hover:bg-ivory-warm transition-colors"
              >
                <Heart className="w-5 h-5" aria-hidden="true" />
                {wishlistIds.length > 0 && (
                  <span className="absolute top-1 right-1 sm:top-1.5 sm:right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-oxblood text-ivory text-[10px] font-bold flex items-center justify-center">
                    {wishlistIds.length}
                  </span>
                )}
              </Link>

              <Link
                to="/bag"
                aria-label={`Your Enquiry Bag (${totalBagDesigns} designs)`}
                className="relative w-10 h-10 sm:w-11 sm:h-11 inline-flex items-center justify-center text-ink hover:text-oxblood hover:bg-ivory-warm transition-colors"
              >
                <ShoppingBag className="w-5 h-5" aria-hidden="true" />
                {totalBagDesigns > 0 && (
                  <span className="absolute top-1 right-1 sm:top-1.5 sm:right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-brass-dark text-ivory text-[10px] font-bold flex items-center justify-center">
                    {totalBagDesigns}
                  </span>
                )}
              </Link>

              <Link
                to="/wholesale"
                className="hidden sm:inline-flex items-center gap-1.5 min-h-[40px] px-3.5 py-2 bg-oxblood hover:bg-oxblood-plum text-ivory text-xs font-medium tracking-wide transition-colors ml-1"
              >
                <Sparkles className="w-3.5 h-3.5 text-brass-light" aria-hidden="true" />
                <span>Trade / Bulk</span>
              </Link>
            </div>
          </div>

          {/* Desktop Collections Mega Menu Panel (Prompt 017) */}
          {isMegaMenuOpen && (
            <div
              onMouseEnter={() => setIsMegaMenuOpen(true)}
              onMouseLeave={() => setIsMegaMenuOpen(false)}
              className="hidden lg:block border-t border-ivory-border bg-ivory shadow-xl"
            >
              <div className="editorial-container py-7 grid grid-cols-12 gap-6">
                <div className="col-span-3 flex flex-col justify-between border-r border-ivory-border pr-6">
                  <div>
                    <span className="eyebrow-label text-brass-dark">Visual Curations</span>
                    <h3 className="font-serif text-2xl font-semibold text-ink mt-1">
                      Editorial Edits
                    </h3>
                    <p className="text-xs text-ink-muted mt-2 leading-relaxed">
                      Organized from real showroom Instagram Reels to help individual shoppers and wholesale buyers explore silhouettes.
                    </p>
                  </div>
                  <div className="space-y-2 pt-4">
                    <Link
                      to="/shop"
                      onClick={() => setIsMegaMenuOpen(false)}
                      className="btn-luxury-primary w-full text-xs py-2.5"
                    >
                      View All Designs (97 Reels)
                    </Link>
                    <Link
                      to="/lookbook"
                      onClick={() => setIsMegaMenuOpen(false)}
                      className="btn-luxury-secondary w-full text-xs py-2"
                    >
                      Open Visual Lookbook
                    </Link>
                  </div>
                </div>

                <div className="col-span-9 grid grid-cols-4 gap-4">
                  {nonEmptyCollections.map((col) => {
                    const count = getProductsByCollection(col.slug).length;
                    return (
                      <Link
                        key={col.slug}
                        to={`/collections/${col.slug}`}
                        onClick={() => setIsMegaMenuOpen(false)}
                        className="group flex flex-col bg-ivory-warm/60 hover:bg-ivory-warm border border-ivory-border p-3 transition-colors"
                      >
                        <div className="aspect-[4/5] overflow-hidden bg-ivory-stone mb-3">
                          <img
                            src={col.heroImagePublicPath}
                            alt={col.title}
                            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-brass-dark font-semibold">
                          <span>Editorial Edit</span>
                          <span>{count} Designs</span>
                        </div>
                        <h4 className="font-serif text-lg font-semibold text-ink group-hover:text-oxblood mt-0.5">
                          {col.title}
                        </h4>
                        <p className="text-xs text-ink-muted line-clamp-2 mt-1 leading-relaxed">
                          {col.shortDescription}
                        </p>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Mobile Navigation Drawer (Prompt 020) */}
      {isMobileDrawerOpen && (
        <div
          id="mobile-navigation-drawer"
          className="fixed inset-0 z-50 lg:hidden bg-oxblood-deep/75 backdrop-blur-sm flex"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation Menu"
          onClick={() => setIsMobileDrawerOpen(false)}
        >
          <div
            className="w-[88vw] max-w-sm bg-ivory h-full overflow-y-auto flex flex-col justify-between shadow-2xl border-r border-ivory-border"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              {/* Drawer Header */}
              <div className="p-4 bg-oxblood text-ivory flex items-center justify-between">
                <div>
                  <span className="font-serif text-lg font-bold tracking-wider block">
                    {BUSINESS_FACTS.verifiedFromSuppliedFiles.brandName}
                  </span>
                  <span className="text-[10px] text-brass-light uppercase tracking-widest">
                    Unofficial Concept Storefront
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMobileDrawerOpen(false)}
                  aria-label="Close mobile menu"
                  className="w-11 h-11 inline-flex items-center justify-center text-ivory border border-ivory/25"
                >
                  <X className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>

              {/* Intent Switcher */}
              <div className="p-4 bg-ivory-warm border-b border-ivory-border">
                <span className="block text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-1.5">
                  Browsing Mode
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setEnquiryIntent('personal')}
                    aria-pressed={enquiryDraft.intent === 'personal'}
                    className={`min-h-[38px] text-xs font-medium border ${
                      enquiryDraft.intent === 'personal'
                        ? 'bg-oxblood text-ivory border-oxblood'
                        : 'bg-ivory text-ink border-ivory-border'
                    }`}
                  >
                    Personal Shopper
                  </button>
                  <button
                    type="button"
                    onClick={() => setEnquiryIntent('wholesale')}
                    aria-pressed={enquiryDraft.intent === 'wholesale'}
                    className={`min-h-[38px] text-xs font-medium border ${
                      enquiryDraft.intent === 'wholesale'
                        ? 'bg-oxblood text-ivory border-oxblood'
                        : 'bg-ivory text-ink border-ivory-border'
                    }`}
                  >
                    Wholesale / Bulk
                  </button>
                </div>
              </div>

              {/* Drawer Links */}
              <nav aria-label="Mobile Navigation" className="p-4 space-y-1 text-base font-medium">
                <Link
                  to="/"
                  className="flex items-center justify-between min-h-[44px] px-2 py-2 text-ink hover:bg-ivory-warm border-b border-ivory-border/60"
                >
                  <span>Home</span>
                </Link>
                <Link
                  to="/shop"
                  className="flex items-center justify-between min-h-[44px] px-2 py-2 text-ink hover:bg-ivory-warm border-b border-ivory-border/60"
                >
                  <span>Shop All Designs</span>
                  <span className="text-xs font-mono text-brass-dark">97 Reels</span>
                </Link>

                {/* Mobile Collections Accordion */}
                <div className="border-b border-ivory-border/60 py-1">
                  <button
                    type="button"
                    onClick={() => setIsMobileCollectionsExpanded((p) => !p)}
                    aria-expanded={isMobileCollectionsExpanded}
                    className="w-full flex items-center justify-between min-h-[44px] px-2 py-2 text-ink hover:bg-ivory-warm font-medium"
                  >
                    <span>Editorial Collections</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        isMobileCollectionsExpanded ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isMobileCollectionsExpanded && (
                    <div className="pl-3 pr-1 pb-2 space-y-1.5">
                      {nonEmptyCollections.map((col) => (
                        <Link
                          key={col.slug}
                          to={`/collections/${col.slug}`}
                          className="flex items-center gap-2.5 p-2 bg-ivory-warm/70 border border-ivory-border text-sm text-ink"
                        >
                          <img
                            src={col.heroImagePublicPath}
                            alt={col.title}
                            className="w-9 h-12 object-cover object-top shrink-0"
                          />
                          <div>
                            <span className="font-serif font-semibold block leading-tight">
                              {col.title}
                            </span>
                            <span className="text-[11px] text-ink-muted line-clamp-1">
                              {col.shortDescription}
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                <Link
                  to="/lookbook"
                  className="flex items-center justify-between min-h-[44px] px-2 py-2 text-ink hover:bg-ivory-warm border-b border-ivory-border/60"
                >
                  <span>Lookbook &amp; Reels Gallery</span>
                </Link>
                <Link
                  to="/wholesale"
                  className="flex items-center justify-between min-h-[44px] px-2 py-2 text-oxblood font-semibold hover:bg-ivory-warm border-b border-ivory-border/60"
                >
                  <span>Wholesale &amp; Bulk Enquiries</span>
                  <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 bg-oxblood text-ivory">
                    B2B
                  </span>
                </Link>
                <Link
                  to="/wishlist"
                  className="flex items-center justify-between min-h-[44px] px-2 py-2 text-ink hover:bg-ivory-warm border-b border-ivory-border/60"
                >
                  <span>Saved Wishlist</span>
                  <span className="text-xs font-mono text-ink-muted">({wishlistIds.length})</span>
                </Link>
                <Link
                  to="/bag"
                  className="flex items-center justify-between min-h-[44px] px-2 py-2 text-ink hover:bg-ivory-warm border-b border-ivory-border/60"
                >
                  <span>Your Enquiry Bag</span>
                  <span className="text-xs font-mono text-oxblood font-bold">
                    ({totalBagDesigns})
                  </span>
                </Link>
                <Link
                  to="/our-story"
                  className="flex items-center justify-between min-h-[44px] px-2 py-2 text-ink hover:bg-ivory-warm border-b border-ivory-border/60"
                >
                  <span>Our Story &amp; Positioning</span>
                </Link>
                <Link
                  to="/contact"
                  className="flex items-center justify-between min-h-[44px] px-2 py-2 text-ink hover:bg-ivory-warm border-b border-ivory-border/60"
                >
                  <span>Contact &amp; Showroom</span>
                </Link>
                <Link
                  to="/faq"
                  className="flex items-center justify-between min-h-[44px] px-2 py-2 text-ink hover:bg-ivory-warm border-b border-ivory-border/60"
                >
                  <span>FAQs &amp; Ordering Rules</span>
                </Link>
              </nav>
            </div>

            {/* Drawer Footer Contact */}
            <div className="p-4 bg-ivory-warm border-t border-ivory-border space-y-2 text-xs">
              <p className="text-ink-muted">
                <strong>Showroom:</strong> {BUSINESS_FACTS.verifiedFromSuppliedFiles.addressDisplay}
              </p>
              <a
                href={BUSINESS_FACTS.verifiedFromSuppliedFiles.whatsappBaseUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-luxury-primary w-full text-xs"
              >
                <MessageCircle className="w-4 h-4 text-brass-light" aria-hidden="true" />
                <span>WhatsApp {BUSINESS_FACTS.verifiedFromSuppliedFiles.whatsappDisplay}</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

