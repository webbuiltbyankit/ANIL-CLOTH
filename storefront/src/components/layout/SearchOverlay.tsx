import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Clock, Film, Search, Sparkles, Trash2, X } from 'lucide-react';
import { useStore } from '@/features/store-context';
import { filterAndSortCatalog, getAvailableColorTags } from '@/data/catalog-resolver';
import { EDITORIAL_COLLECTIONS } from '@/data/collections';

/**
 * SearchOverlay (`Prompt 018`)
 * Global instant search with autofocus, Escape-to-close, recent searches, and shortcode/color/title matching.
 */
export const SearchOverlay: React.FC = () => {
  const {
    isSearchOpen,
    closeSearch,
    recentSearches,
    addRecentSearch,
    clearRecentSearches,
    openSourcingModal,
  } = useStore();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!isSearchOpen) return;
    const timer = window.setTimeout(() => {
      inputRef.current?.focus();
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeSearch();
      }
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.clearTimeout(timer);
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isSearchOpen, closeSearch]);

  const matchingProducts = useMemo(() => {
    if (!query.trim()) return [];
    return filterAndSortCatalog({
      includeFullArchive: true,
      searchQuery: query,
      sortBy: 'curated',
    }).slice(0, 6);
  }, [query]);

  const colorTags = useMemo(() => getAvailableColorTags().slice(0, 6), []);

  if (!isSearchOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = query.trim();
    if (!clean) return;
    addRecentSearch(clean);
    closeSearch();
    navigate(`/search?q=${encodeURIComponent(clean)}`);
  };

  const handleSelectChip = (term: string) => {
    setQuery(term);
    addRecentSearch(term);
    inputRef.current?.focus();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-oxblood-deep/75 backdrop-blur-sm flex flex-col"
      role="dialog"
      aria-modal="true"
      aria-label="Instant Catalog Search"
      onClick={closeSearch}
    >
      <div
        className="w-full bg-ivory border-b border-ivory-border shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="editorial-container py-5 sm:py-7">
          {/* Search Input Form */}
          <form onSubmit={handleSubmit} className="relative flex items-center gap-2">
            <Search className="w-5 h-5 text-brass-dark shrink-0" aria-hidden="true" />
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by shortcode (e.g., DfC6hNDTwrJ), ACH-ID, colour (Lilac, Wine, Gold), or silhouette..."
              aria-label="Search designs by shortcode, ID, or style"
              className="flex-1 min-h-[48px] px-3 py-2 bg-transparent text-base sm:text-lg font-serif text-ink placeholder:text-ink-subtle border-b border-oxblood/30 focus:border-oxblood focus:outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                aria-label="Clear search text"
                className="w-10 h-10 inline-flex items-center justify-center text-ink-muted hover:text-ink"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            )}
            <button
              type="submit"
              className="btn-luxury-primary text-xs px-4 py-2.5 min-h-[44px]"
            >
              Search
            </button>
            <button
              type="button"
              onClick={closeSearch}
              aria-label="Close search overlay"
              className="w-11 h-11 inline-flex items-center justify-center border border-ivory-border text-ink hover:bg-ivory-warm ml-1"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </form>

          {/* Quick Suggested Filters & Recent Searches when query is empty */}
          {!query.trim() ? (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-5 space-y-4">
                {recentSearches.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Recent Searches</span>
                      </span>
                      <button
                        type="button"
                        onClick={clearRecentSearches}
                        className="text-xs text-ink-muted hover:text-oxblood inline-flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" aria-hidden="true" />
                        <span>Clear</span>
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {recentSearches.map((term) => (
                        <button
                          key={term}
                          type="button"
                          onClick={() => handleSelectChip(term)}
                          className="px-3 py-1.5 bg-ivory-warm hover:bg-ivory-stone border border-ivory-border text-xs text-ink transition-colors"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <span className="block text-xs font-semibold uppercase tracking-wider text-ink-muted mb-2">
                    Observed Visual Colour Tones
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {colorTags.map((c) => (
                      <button
                        key={c.tag}
                        type="button"
                        onClick={() => handleSelectChip(c.tag)}
                        className="px-3 py-1.5 bg-ivory hover:bg-ivory-warm border border-ivory-border text-xs text-ink transition-colors"
                      >
                        {c.tag} <span className="text-ink-muted">({c.count})</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="block text-xs font-semibold uppercase tracking-wider text-ink-muted mb-2">
                    Sample Shortcode Lookup
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {['DfC6hNDTwrJ', 'DfC5XpkTzsZ', 'De5vI8aTSed', 'De-5_dRTcdi'].map((code) => (
                      <button
                        key={code}
                        type="button"
                        onClick={() => handleSelectChip(code)}
                        className="px-2.5 py-1 bg-ivory-warm hover:bg-oxblood hover:text-ivory font-mono text-xs border border-ivory-border transition-colors"
                      >
                        ACH-{code}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="md:col-span-7">
                <span className="block text-xs font-semibold uppercase tracking-wider text-ink-muted mb-2.5">
                  Browse Editorial Collections
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {EDITORIAL_COLLECTIONS.map((col) => (
                    <Link
                      key={col.slug}
                      to={`/collections/${col.slug}`}
                      onClick={closeSearch}
                      className="flex items-center gap-3 p-2.5 bg-ivory-warm/70 hover:bg-ivory-warm border border-ivory-border transition-colors"
                    >
                      <img
                        src={col.heroImagePublicPath}
                        alt={col.title}
                        className="w-12 h-16 object-cover object-top shrink-0 border border-ivory-border"
                      />
                      <div>
                        <p className="font-serif font-semibold text-base text-ink">{col.title}</p>
                        <p className="text-xs text-ink-muted line-clamp-1">{col.shortDescription}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Live Instant Results */
            <div className="mt-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs uppercase tracking-wider font-semibold text-ink-muted">
                  Matching Catalog References ({matchingProducts.length} shown)
                </span>
                {matchingProducts.length > 0 && (
                  <Link
                    to={`/search?q=${encodeURIComponent(query.trim())}`}
                    onClick={() => {
                      addRecentSearch(query.trim());
                      closeSearch();
                    }}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-oxblood hover:underline"
                  >
                    <span>See all results for &ldquo;{query.trim()}&rdquo;</span>
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </Link>
                )}
              </div>

              {matchingProducts.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                  {matchingProducts.map((item) => (
                    <Link
                      key={item.id}
                      to={`/product/${item.shortcode}`}
                      onClick={() => {
                        addRecentSearch(query.trim());
                        closeSearch();
                      }}
                      className="group bg-ivory border border-ivory-border hover:border-oxblood p-2 transition-colors flex flex-col"
                    >
                      <div className="relative aspect-[9/16] bg-ivory-warm overflow-hidden mb-2">
                        <img
                          src={item.images[0]?.publicPath}
                          alt={item.title}
                          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                        />
                        {item.hasPlayableVideo && (
                          <span className="absolute top-1.5 right-1.5 p-1 bg-oxblood-deep/85 text-ivory">
                            <Film className="w-3 h-3 text-brass-light" aria-hidden="true" />
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-mono text-brass-dark">{item.displayId}</span>
                      <span className="font-serif text-sm font-semibold text-ink truncate">
                        {item.title}
                      </span>
                      <span className="text-[11px] text-ink-muted truncate">
                        {item.editorialSubtitle}
                      </span>
                      <span className="text-[10px] font-medium text-oxblood mt-1">
                        {item.priceStatusLabel} (Confirm with store)
                      </span>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="bg-ivory-warm border border-ivory-border p-6 text-center space-y-3">
                  <p className="font-serif text-lg text-ink">
                    No catalog items matched &ldquo;{query.trim()}&rdquo;
                  </p>
                  <p className="text-xs text-ink-muted max-w-md mx-auto">
                    Try searching a shortcode like <code className="font-mono">DfC6hNDTwrJ</code>, a colour tone like <strong className="text-ink">Wine</strong> or <strong className="text-ink">Lilac</strong>, or send a direct sourcing inquiry to the showroom.
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
                    <Link
                      to="/shop"
                      onClick={closeSearch}
                      className="btn-luxury-secondary text-xs py-2 px-4"
                    >
                      Browse All Designs
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        closeSearch();
                        openSourcingModal();
                      }}
                      className="btn-luxury-primary text-xs py-2 px-4"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-brass-light" aria-hidden="true" />
                      <span>Can&apos;t Find a Design? Ask Store</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

