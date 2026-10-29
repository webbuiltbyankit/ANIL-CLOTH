import React, { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Info, RotateCcw, Search, Sparkles } from 'lucide-react';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import {
  filterAndSortCatalog,
  getAvailableColorTags,
  getCuratedGarments,
} from '@/data/catalog-resolver';
import { normalizeSearchQuery } from '@/lib/security';
import { ProductCard } from '@/components/commerce/ProductCard';
import { RecentlyViewedStrip } from '@/components/commerce/RecentlyViewedStrip';
import { useStore } from '@/features/store-context';

/**
 * SearchPage (`Prompt 038`)
 * Dedicated /search?q= route with shortcode search tip, normalized query matching, and recovery states.
 */
export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const rawQuery = searchParams.get('q') || '';
  const cleanQuery = normalizeSearchQuery(rawQuery);
  const selectedColor = searchParams.get('color') || '';

  const [inputValue, setInputValue] = useState(cleanQuery);
  const { addRecentSearch, openSourcingModal } = useStore();

  useDocumentMeta({
    title: cleanQuery ? `Search: "${cleanQuery}"` : 'Search Catalogue by Shortcode or Style',
  });

  const matchingProducts = useMemo(() => {
    return filterAndSortCatalog({
      includeFullArchive: true,
      searchQuery: cleanQuery,
      colorTags: selectedColor ? [selectedColor] : [],
      sortBy: 'curated',
    });
  }, [cleanQuery, selectedColor]);

  const colorTags = useMemo(() => getAvailableColorTags(), []);
  const curatedSuggestions = useMemo(() => getCuratedGarments().slice(0, 4), []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = normalizeSearchQuery(inputValue);
    const next = new URLSearchParams(searchParams);
    if (trimmed) {
      next.set('q', trimmed);
      addRecentSearch(trimmed);
    } else {
      next.delete('q');
    }
    setSearchParams(next);
  };

  const handleSelectSample = (sample: string) => {
    setInputValue(sample);
    const next = new URLSearchParams(searchParams);
    next.set('q', sample);
    setSearchParams(next);
  };

  return (
    <div>
      {/* Search Header */}
      <section className="bg-ivory-warm border-b border-ivory-border py-8 sm:py-12">
        <div className="editorial-container">
          <div className="max-w-3xl space-y-4">
            <span className="eyebrow-label text-brass-dark">Catalogue Reference Lookup</span>
            <h1 className="text-heading-1 font-semibold text-ink">
              {cleanQuery ? (
                <>
                  Search Results for <span className="italic text-oxblood">&ldquo;{cleanQuery}&rdquo;</span>
                </>
              ) : (
                'Search by Reel Shortcode, ACH-ID, or Silhouette'
              )}
            </h1>

            <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2 pt-1">
              <div className="relative flex-1">
                <Search
                  className="w-5 h-5 text-brass-dark absolute left-3.5 top-1/2 -translate-y-1/2"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Enter Instagram shortcode (e.g., DfC6hNDTwrJ), ACH-ID, colour, or keyword..."
                  aria-label="Search query"
                  className="w-full min-h-[46px] pl-11 pr-4 py-2.5 bg-ivory border border-oxblood/40 text-sm text-ink placeholder:text-ink-subtle"
                />
              </div>
              <button type="submit" className="btn-luxury-primary text-xs">
                Search Catalogue
              </button>
            </form>

            {/* Shortcode Search Tip (Prompt 038) */}
            <div className="flex items-start gap-2.5 bg-ivory p-3.5 border border-ivory-border text-xs text-ink-muted">
              <Info className="w-4 h-4 text-brass-dark shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <strong className="text-ink">Tip for Instagram Reel Shoppers:</strong> Paste any Reel shortcode from an Instagram link (e.g., <code className="font-mono text-oxblood">DfC6hNDTwrJ</code> from <code className="font-mono">instagram.com/reel/DfC6hNDTwrJ/</code>) or its <code className="font-mono">ACH-</code> display ID to jump straight to that design.
                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                  <span>Try:</span>
                  {['DfC6hNDTwrJ', 'DfC5XpkTzsZ', 'De5vI8aTSed', 'Lilac', 'Pre-draped', 'Choker'].map(
                    (sample) => (
                      <button
                        key={sample}
                        type="button"
                        onClick={() => handleSelectSample(sample)}
                        className="px-2 py-0.5 bg-ivory-warm hover:bg-oxblood hover:text-ivory border border-ivory-border font-mono text-[11px] text-ink transition-colors"
                      >
                        {sample}
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Bar & Results */}
      <section className="py-8 sm:py-12">
        <div className="editorial-container">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-ivory-border">
            <p className="text-xs sm:text-sm text-ink-muted">
              Found <strong className="text-ink">{matchingProducts.length}</strong> matching design reference
              {matchingProducts.length === 1 ? '' : 's'}
              {cleanQuery ? ` for "${cleanQuery}"` : ' across all 97 Showroom Reels'}
            </p>

            {/* Colour Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  const next = new URLSearchParams(searchParams);
                  next.delete('color');
                  setSearchParams(next);
                }}
                className={`px-2.5 py-1 text-xs border ${
                  !selectedColor
                    ? 'bg-oxblood text-ivory border-oxblood'
                    : 'bg-ivory text-ink border-ivory-border'
                }`}
              >
                All Tones
              </button>
              {colorTags.map((c) => (
                <button
                  key={c.tag}
                  type="button"
                  onClick={() => {
                    const next = new URLSearchParams(searchParams);
                    if (selectedColor === c.tag) next.delete('color');
                    else next.set('color', c.tag);
                    setSearchParams(next);
                  }}
                  className={`px-2.5 py-1 text-xs border ${
                    selectedColor === c.tag
                      ? 'bg-oxblood text-ivory border-oxblood'
                      : 'bg-ivory text-ink border-ivory-border'
                  }`}
                >
                  {c.tag}
                </button>
              ))}
            </div>
          </div>

          {matchingProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
              {matchingProducts.map((product, idx) => (
                <ProductCard key={product.id} product={product} priority={idx < 4} />
              ))}
            </div>
          ) : (
            <div className="bg-ivory-warm border border-ivory-border p-8 text-center space-y-5">
              <div className="max-w-md mx-auto space-y-2">
                <h2 className="text-heading-3 font-semibold text-ink">
                  No catalog records matched &ldquo;{cleanQuery}&rdquo;
                </h2>
                <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
                  Only 97 accessible public Reels are indexed in this offline demo archive (out of 2,055+ total profile posts). Clear your query or ask the showroom on WhatsApp.
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setInputValue('');
                    setSearchParams(new URLSearchParams());
                  }}
                  className="btn-luxury-primary text-xs"
                >
                  <RotateCcw className="w-4 h-4" aria-hidden="true" />
                  <span>Reset Search</span>
                </button>

                <button
                  type="button"
                  onClick={() => openSourcingModal()}
                  className="btn-luxury-secondary text-xs"
                >
                  <Sparkles className="w-4 h-4 text-brass-dark" aria-hidden="true" />
                  <span>Ask Store About This Design</span>
                </button>

                <Link to="/shop" className="btn-luxury-secondary text-xs">
                  Browse Full Catalogue
                </Link>
              </div>

              <div className="pt-6 border-t border-ivory-border text-left">
                <h3 className="font-serif text-lg font-semibold text-ink mb-4 text-center">
                  Curated Designs Available to Browse
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                  {curatedSuggestions.map((item) => (
                    <ProductCard key={item.id} product={item} compact={true} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <RecentlyViewedStrip />
    </div>
  );
};

