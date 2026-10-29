import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Filter,
  Frame,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Sparkles,
  X,
} from 'lucide-react';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import {
  CatalogSortOption,
  filterAndSortCatalog,
  getAllSellableGarments,
  getAvailableColorTags,
  getCuratedGarments,
} from '@/data/catalog-resolver';
import { EDITORIAL_COLLECTIONS } from '@/data/collections';
import { EditorialCollectionSlug } from '@/types/catalog';
import { ProductCard } from '@/components/commerce/ProductCard';
import { RecentlyViewedStrip } from '@/components/commerce/RecentlyViewedStrip';
import { useStore } from '@/features/store-context';

export const ShopPage: React.FC = () => {
  useDocumentMeta({
    title: 'Shop Collection & 97-Reel Catalogue',
    description:
      'Browse 38 visually curated occasionwear ensembles or explore all 97 Instagram Reel designs from ANIL CLOTH HOUSE, NIT Faridabad.',
  });

  const { openSourcingModal } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();

  // Read initial state from URL query params (Prompt 032)
  const includeFullArchive = searchParams.get('archive') === 'all';
  const selectedCollections = useMemo(() => {
    const raw = searchParams.get('collection');
    if (!raw) return [] as EditorialCollectionSlug[];
    return raw.split(',').filter(Boolean) as EditorialCollectionSlug[];
  }, [searchParams]);

  const selectedColors = useMemo(() => {
    const raw = searchParams.get('color');
    if (!raw) return [] as string[];
    return raw.split(',').filter(Boolean);
  }, [searchParams]);

  const sortBy = (searchParams.get('sort') as CatalogSortOption) || 'curated';
  const filterQuery = searchParams.get('q') || '';

  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [fitMode, setFitMode] = useState<'cover' | 'contain-matte'>('cover');
  const [visibleCount, setVisibleCount] = useState(24);

  // Lock body scroll when mobile filter drawer is open (Prompt 033)
  useEffect(() => {
    if (!isMobileFilterOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMobileFilterOpen(false);
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [isMobileFilterOpen]);

  const colorOptions = useMemo(() => getAvailableColorTags(), []);
  const curatedFallback = useMemo(() => getCuratedGarments().slice(0, 4), []);

  const filteredProducts = useMemo(() => {
    return filterAndSortCatalog({
      includeFullArchive,
      collections: selectedCollections,
      colorTags: selectedColors,
      searchQuery: filterQuery,
      sortBy,
    });
  }, [includeFullArchive, selectedCollections, selectedColors, filterQuery, sortBy]);

  const displayedProducts = filteredProducts.slice(0, visibleCount);

  const updateParam = (key: string, value: string | null) => {
    const next = new URLSearchParams(searchParams);
    if (!value) {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    setSearchParams(next, { replace: true });
    setVisibleCount(24);
  };

  const toggleCollection = (slug: EditorialCollectionSlug) => {
    const exists = selectedCollections.includes(slug);
    const next = exists
      ? selectedCollections.filter((c) => c !== slug)
      : [...selectedCollections, slug];
    updateParam('collection', next.length > 0 ? next.join(',') : null);
  };

  const toggleColor = (tag: string) => {
    const exists = selectedColors.includes(tag);
    const next = exists
      ? selectedColors.filter((c) => c !== tag)
      : [...selectedColors, tag];
    updateParam('color', next.length > 0 ? next.join(',') : null);
  };

  const clearAllFilters = () => {
    setSearchParams(new URLSearchParams(), { replace: true });
    setVisibleCount(24);
  };

  const activeFilterCount =
    selectedCollections.length +
    selectedColors.length +
    (filterQuery.trim() ? 1 : 0) +
    (includeFullArchive ? 1 : 0);

  const renderFilterControls = () => (
    <div className="space-y-6">
      {/* Catalog Scope Switch (Prompt 006 & 031) */}
      <fieldset className="border-b border-ivory-border pb-5">
        <legend className="text-xs font-semibold uppercase tracking-wider text-ink mb-2.5">
          Catalog View Scope
        </legend>
        <div className="space-y-2">
          <label className="flex items-start gap-2.5 cursor-pointer text-xs text-ink">
            <input
              type="radio"
              name="catalog-scope"
              checked={!includeFullArchive}
              onChange={() => updateParam('archive', null)}
              className="mt-0.5 accent-oxblood"
            />
            <span>
              <strong className="block font-medium">Curated Showroom Edit (38)</strong>
              <span className="text-ink-muted text-[11px]">
                Visually reviewed highlights with colour &amp; silhouette tags
              </span>
            </span>
          </label>
          <label className="flex items-start gap-2.5 cursor-pointer text-xs text-ink">
            <input
              type="radio"
              name="catalog-scope"
              checked={includeFullArchive}
              onChange={() => updateParam('archive', 'all')}
              className="mt-0.5 accent-oxblood"
            />
            <span>
              <strong className="block font-medium">All Supplied Reels ({getAllSellableGarments().length})</strong>
              <span className="text-ink-muted text-[11px]">
                Complete media-backed Instagram Reel archive
              </span>
            </span>
          </label>
        </div>
      </fieldset>

      {/* Editorial Collection Filter */}
      <fieldset className="border-b border-ivory-border pb-5">
        <legend className="text-xs font-semibold uppercase tracking-wider text-ink mb-2.5">
          Editorial Collections
        </legend>
        <div className="space-y-2">
          {EDITORIAL_COLLECTIONS.map((col) => {
            const checked = selectedCollections.includes(col.slug);
            return (
              <label
                key={col.slug}
                className="flex items-center justify-between gap-2 cursor-pointer text-xs text-ink py-1"
              >
                <span className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleCollection(col.slug)}
                    className="w-4 h-4 accent-oxblood"
                  />
                  <span>{col.title}</span>
                </span>
              </label>
            );
          })}
        </div>
        <p className="text-[11px] text-ink-muted mt-2 italic">
          Editorial groupings for browsing; not source-confirmed SKU categories.
        </p>
      </fieldset>

      {/* Visually Verified Colour Tone Filter */}
      <fieldset className="border-b border-ivory-border pb-5">
        <legend className="text-xs font-semibold uppercase tracking-wider text-ink mb-2.5">
          Observed Colour Palette
        </legend>
        <div className="space-y-1.5">
          {colorOptions.map((c) => {
            const checked = selectedColors.includes(c.tag);
            return (
              <label
                key={c.tag}
                className="flex items-center justify-between gap-2 cursor-pointer text-xs text-ink py-1"
              >
                <span className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleColor(c.tag)}
                    className="w-4 h-4 accent-oxblood"
                  />
                  <span>{c.tag}</span>
                </span>
                <span className="text-[11px] font-mono text-ink-muted">({c.count})</span>
              </label>
            );
          })}
        </div>
      </fieldset>

      {/* Quick Shortcode Filter */}
      <div>
        <label
          htmlFor="shop-inline-search"
          className="block text-xs font-semibold uppercase tracking-wider text-ink mb-2"
        >
          Filter by Shortcode or Keyword
        </label>
        <div className="relative">
          <Search
            className="w-4 h-4 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2"
            aria-hidden="true"
          />
          <input
            id="shop-inline-search"
            type="search"
            value={filterQuery}
            onChange={(e) => updateParam('q', e.target.value || null)}
            placeholder="e.g., DfC6hNDTwrJ or cape"
            className="w-full min-h-[40px] pl-9 pr-3 py-1.5 bg-ivory border border-ivory-border text-xs text-ink placeholder:text-ink-subtle"
          />
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {/* Editorial Masthead */}
      <section className="bg-ivory-warm border-b border-ivory-border py-8 sm:py-12">
        <div className="editorial-container">
          <div className="max-w-3xl">
            <span className="eyebrow-label text-brass-dark">
              Showroom Reference Catalogue • NIT Faridabad
            </span>
            <h1 className="text-heading-1 font-semibold text-ink mt-1">
              {includeFullArchive
                ? 'Complete 97-Reel Showroom Archive'
                : 'Curated Occasionwear & Embellished Edits'}
            </h1>
            <p className="text-xs sm:text-sm text-ink-muted mt-2 leading-relaxed">
              Every item below is backed by a local portrait image (`640×1136`) and playable `.mp4` Instagram Reel video from{' '}
              <strong className="text-ink">@anil_cloth_house_official</strong>. Save references to your Enquiry Bag or click{' '}
              <strong className="text-oxblood">Ask Price</strong> to confirm current rates and availability on WhatsApp.
            </p>
          </div>
        </div>
      </section>

      {/* Sticky Catalog Toolbar */}
      <div className="sticky top-16 sm:top-20 z-30 bg-ivory/95 backdrop-blur-md border-b border-ivory-border">
        <div className="editorial-container py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {/* Desktop Filter Rail Toggle */}
            <button
              type="button"
              onClick={() => setIsDesktopSidebarOpen((p) => !p)}
              aria-expanded={isDesktopSidebarOpen}
              className="hidden lg:inline-flex items-center gap-2 min-h-[40px] px-3.5 py-1.5 border border-ivory-border bg-ivory hover:bg-ivory-warm text-xs font-medium text-ink"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-brass-dark" aria-hidden="true" />
              <span>{isDesktopSidebarOpen ? 'Hide Filters' : 'Show Filters'}</span>
            </button>

            {/* Mobile Filter Sheet Trigger */}
            <button
              type="button"
              onClick={() => setIsMobileFilterOpen(true)}
              aria-expanded={isMobileFilterOpen}
              className="lg:hidden inline-flex items-center gap-2 min-h-[42px] px-3.5 py-1.5 border border-oxblood/40 bg-ivory hover:bg-ivory-warm text-xs font-semibold text-ink"
            >
              <Filter className="w-3.5 h-3.5 text-oxblood" aria-hidden="true" />
              <span>Filters &amp; Scope</span>
              {activeFilterCount > 0 && (
                <span className="px-1.5 py-0.5 bg-oxblood text-ivory text-[10px] rounded-full">
                  {activeFilterCount}
                </span>
              )}
            </button>

            <span className="text-xs text-ink-muted font-medium">
              Showing <strong className="text-ink">{filteredProducts.length}</strong> design
              {filteredProducts.length === 1 ? '' : 's'}
            </span>
          </div>

          {/* Right Toolbar Controls: Framing Preset & Sort */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Image Framing Toggle (Prompt 078) */}
            <button
              type="button"
              onClick={() =>
                setFitMode((m) => (m === 'cover' ? 'contain-matte' : 'cover'))
              }
              className="hidden sm:inline-flex items-center gap-1.5 min-h-[40px] px-3 py-1.5 border border-ivory-border bg-ivory hover:bg-ivory-warm text-xs text-ink"
              title="Switch between full-bleed portrait and neutral matte framing"
            >
              <Frame className="w-3.5 h-3.5 text-brass-dark" aria-hidden="true" />
              <span>Frame: {fitMode === 'cover' ? 'Portrait Fill' : 'Neutral Matte'}</span>
            </button>

            <div className="flex items-center gap-1.5">
              <label htmlFor="catalog-sort-select" className="text-xs text-ink-muted hidden sm:inline">
                Sort:
              </label>
              <select
                id="catalog-sort-select"
                value={sortBy}
                onChange={(e) => updateParam('sort', e.target.value)}
                aria-label="Sort catalog designs"
                className="min-h-[40px] px-3 py-1.5 bg-ivory border border-ivory-border text-xs font-medium text-ink"
              >
                <option value="curated">Curated Highlights</option>
                <option value="recent">Recently Posted (Source Timestamp)</option>
                <option value="alphabetical">Alphabetical (ACH-ID)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Applied Filter Chips Bar (Prompt 032) */}
        {activeFilterCount > 0 && (
          <div className="editorial-container py-2 border-t border-ivory-border/60 flex flex-wrap items-center gap-2">
            <span className="text-[11px] text-ink-muted uppercase tracking-wider">Active:</span>

            {includeFullArchive && (
              <button
                type="button"
                onClick={() => updateParam('archive', null)}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-ivory-warm border border-ivory-border text-xs text-ink"
              >
                <span>All 97 Archive Reels</span>
                <X className="w-3 h-3" aria-hidden="true" />
              </button>
            )}

            {selectedCollections.map((slug) => {
              const col = EDITORIAL_COLLECTIONS.find((c) => c.slug === slug);
              return (
                <button
                  key={slug}
                  type="button"
                  onClick={() => toggleCollection(slug)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-ivory-warm border border-ivory-border text-xs text-ink"
                >
                  <span>{col?.title || slug}</span>
                  <X className="w-3 h-3" aria-hidden="true" />
                </button>
              );
            })}

            {selectedColors.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => toggleColor(color)}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-ivory-warm border border-ivory-border text-xs text-ink"
              >
                <span>{color}</span>
                <X className="w-3 h-3" aria-hidden="true" />
              </button>
            ))}

            {filterQuery.trim() && (
              <button
                type="button"
                onClick={() => updateParam('q', null)}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-ivory-warm border border-ivory-border text-xs text-ink"
              >
                <span>Query: &ldquo;{filterQuery}&rdquo;</span>
                <X className="w-3 h-3" aria-hidden="true" />
              </button>
            )}

            <button
              type="button"
              onClick={clearAllFilters}
              className="inline-flex items-center gap-1 text-xs font-semibold text-oxblood hover:underline ml-1"
            >
              <RotateCcw className="w-3 h-3" aria-hidden="true" />
              <span>Clear all</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Catalog Content Area */}
      <div className="editorial-container py-8 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Desktop Collapsible Filter Sidebar */}
          {isDesktopSidebarOpen && (
            <aside
              aria-label="Catalog Filters"
              className="hidden lg:block lg:col-span-3 sticky top-36 bg-ivory-warm/40 border border-ivory-border p-5"
            >
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-ivory-border">
                <h2 className="font-serif text-lg font-semibold text-ink">Refine Catalogue</h2>
                {activeFilterCount > 0 && (
                  <button
                    type="button"
                    onClick={clearAllFilters}
                    className="text-xs text-oxblood hover:underline font-medium"
                  >
                    Reset ({activeFilterCount})
                  </button>
                )}
              </div>
              {renderFilterControls()}
            </aside>
          )}

          {/* Product Grid */}
          <div className={isDesktopSidebarOpen ? 'lg:col-span-9' : 'lg:col-span-12'}>
            {displayedProducts.length > 0 ? (
              <>
                <div
                  className={`grid grid-cols-2 ${
                    isDesktopSidebarOpen
                      ? 'md:grid-cols-3 gap-3.5 sm:gap-5'
                      : 'md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6'
                  }`}
                >
                  {displayedProducts.map((product, index) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      priority={index < 4}
                      fitMode={fitMode}
                    />
                  ))}
                </div>

                {/* Pagination / Load More + Archive Toggle */}
                <div className="mt-10 pt-8 border-t border-ivory-border flex flex-col items-center text-center gap-4">
                  <p className="text-xs text-ink-muted">
                    Showing {displayedProducts.length} of {filteredProducts.length} matching designs
                  </p>

                  <div className="flex flex-wrap items-center justify-center gap-3">
                    {visibleCount < filteredProducts.length && (
                      <button
                        type="button"
                        onClick={() => setVisibleCount((prev) => prev + 24)}
                        className="btn-luxury-primary text-xs"
                      >
                        Load More Designs ({filteredProducts.length - visibleCount} remaining)
                      </button>
                    )}

                    {!includeFullArchive && (
                      <button
                        type="button"
                        onClick={() => {
                          updateParam('archive', 'all');
                          setVisibleCount(48);
                        }}
                        className="btn-luxury-secondary text-xs"
                      >
                        Reveal All 97 Showroom Reel Designs
                      </button>
                    )}
                  </div>
                </div>
              </>
            ) : (
              /* Zero-Results Recovery State (Prompt 036) */
              <div className="bg-ivory-warm border border-ivory-border p-6 sm:p-10 text-center space-y-6">
                <div className="max-w-md mx-auto space-y-2">
                  <span className="eyebrow-label text-brass-dark">No Exact Filter Matches</span>
                  <h2 className="text-heading-3 font-semibold text-ink">
                    No designs matched your combined filter selection
                  </h2>
                  <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
                    Because public Instagram metadata is sparse, combining multiple narrow filters may hide available designs. Clear your filters or ask the NIT Faridabad showroom directly.
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={clearAllFilters}
                    className="btn-luxury-primary text-xs"
                  >
                    <RotateCcw className="w-4 h-4" aria-hidden="true" />
                    <span>Clear Filters &amp; Show Curated Edit</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => openSourcingModal()}
                    className="btn-luxury-secondary text-xs"
                  >
                    <Sparkles className="w-4 h-4 text-brass-dark" aria-hidden="true" />
                    <span>Can&apos;t Find a Design? Ask Store</span>
                  </button>
                </div>

                {/* Alternative Curated Designs */}
                <div className="pt-6 border-t border-ivory-border text-left">
                  <h3 className="font-serif text-lg font-semibold text-ink mb-4 text-center">
                    Explore Curated Highlights Instead
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                    {curatedFallback.map((item) => (
                      <ProductCard key={item.id} product={item} compact={true} />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Slide-Up Filter Sheet (Prompt 033) */}
      {isMobileFilterOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden bg-oxblood-deep/75 backdrop-blur-sm flex items-end"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Filter Sheet"
          onClick={() => setIsMobileFilterOpen(false)}
        >
          <div
            className="w-full max-h-[88vh] bg-ivory flex flex-col shadow-2xl border-t border-ivory-border"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 bg-oxblood text-ivory flex items-center justify-between">
              <h2 className="font-serif text-lg font-semibold">
                Filter &amp; Scope ({filteredProducts.length} results)
              </h2>
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(false)}
                aria-label="Close filter sheet"
                className="w-10 h-10 inline-flex items-center justify-center text-ivory border border-ivory/25"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto flex-1">{renderFilterControls()}</div>

            <div className="p-4 bg-ivory-warm border-t border-ivory-border grid grid-cols-2 gap-3 pb-safe">
              <button
                type="button"
                onClick={clearAllFilters}
                className="btn-luxury-secondary text-xs py-2.5"
              >
                Clear All
              </button>
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(false)}
                className="btn-luxury-primary text-xs py-2.5"
              >
                Show {filteredProducts.length} Designs
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Sourcing Prompt Strip (Prompt 069) */}
      <section className="py-10 bg-ivory-warm border-t border-ivory-border">
        <div className="editorial-container flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-xl font-semibold text-ink">
              Can&apos;t find a specific colour or silhouette in these 97 Reels?
            </h2>
            <p className="text-xs sm:text-sm text-ink-muted mt-0.5">
              Describe the blouse, lehenga, or saree look you need and prepare a personal or wholesale WhatsApp inquiry.
            </p>
          </div>
          <button
            type="button"
            onClick={() => openSourcingModal()}
            className="btn-luxury-primary text-xs shrink-0"
          >
            <Sparkles className="w-4 h-4 text-brass-light" aria-hidden="true" />
            <span>Describe a Look on WhatsApp</span>
          </button>
        </div>
      </section>

      <RecentlyViewedStrip />
    </div>
  );
};

