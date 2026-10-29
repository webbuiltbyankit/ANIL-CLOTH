import React, { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Info, Sparkles } from 'lucide-react';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { EDITORIAL_COLLECTIONS, getCollectionBySlug } from '@/data/collections';
import { getProductsByCollection } from '@/data/catalog-resolver';
import { ProductCard } from '@/components/commerce/ProductCard';
import { ProductImage } from '@/components/media/ProductMedia';
import { RecentlyViewedStrip } from '@/components/commerce/RecentlyViewedStrip';
import { useStore } from '@/features/store-context';

/**
 * CollectionPage (`Prompt 035`)
 * Reusable /collections/:slug template with editorial masthead, collection tabs, and prefiltered grid.
 */
export const CollectionPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const collection = getCollectionBySlug(slug);
  const { openSourcingModal } = useStore();
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  useDocumentMeta({
    title: collection ? `${collection.title} — Editorial Collection` : 'Collection Not Found',
    description: collection?.editorialIntro,
  });

  const collectionProducts = useMemo(() => {
    if (!collection) return [];
    return getProductsByCollection(collection.slug, true);
  }, [collection]);

  const availableColors = useMemo(() => {
    const set = new Set<string>();
    collectionProducts.forEach((p) => {
      if (p.visualColorTag) set.add(p.visualColorTag);
    });
    return Array.from(set);
  }, [collectionProducts]);

  const filteredItems = useMemo(() => {
    if (!selectedColor) return collectionProducts;
    return collectionProducts.filter((p) => p.visualColorTag === selectedColor);
  }, [collectionProducts, selectedColor]);

  if (!collection) {
    return (
      <div className="editorial-container py-16 text-center space-y-4">
        <span className="eyebrow-label text-brass-dark">Collection Unavailable</span>
        <h1 className="text-heading-2 font-semibold text-ink">
          We couldn&apos;t find that editorial collection
        </h1>
        <p className="text-sm text-ink-muted max-w-md mx-auto">
          Explore one of our verified visual edits or browse the complete 97-Reel showroom catalog.
        </p>
        <div className="flex justify-center gap-3 pt-2">
          <Link to="/shop" className="btn-luxury-primary text-xs">
            Browse All Designs
          </Link>
          <Link to="/" className="btn-luxury-secondary text-xs">
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Collection Editorial Masthead */}
      <section className="bg-oxblood text-ivory border-b border-brass/30 py-10 sm:py-14">
        <div className="editorial-container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <Link
                to="/shop"
                className="inline-flex items-center gap-1.5 text-xs text-brass-light hover:underline"
              >
                <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Back to Shop All</span>
              </Link>

              <div className="text-xs uppercase tracking-[0.18em] text-brass-light font-semibold">
                {collection.eyebrow} • {collectionProducts.length} Curated Designs
              </div>

              <h1 className="text-heading-1 font-semibold text-ivory">{collection.title}</h1>

              <p className="text-sm sm:text-base text-ivory/85 max-w-2xl leading-relaxed">
                {collection.editorialIntro}
              </p>

              <div className="inline-flex items-start gap-2 bg-oxblood-deep/75 border border-ivory/15 p-3 text-xs text-ivory/80 max-w-xl">
                <Info className="w-4 h-4 text-brass-light shrink-0 mt-0.5" aria-hidden="true" />
                <span>
                  <strong className="text-ivory">Editorial Classification Notice:</strong> Groupings are manually curated from visual inspection of showroom Reels rather than confirmed store SKU taxonomy.
                </span>
              </div>
            </div>

            <div className="lg:col-span-4">
              <div className="max-w-[220px] mx-auto bg-ivory/10 p-2 border border-brass-light/30">
                <ProductImage
                  src={collection.heroImagePublicPath}
                  alt={collection.title}
                  shortcode={collection.heroShortcode}
                  priority={true}
                />
                <p className="text-[10px] font-mono text-brass-light text-center mt-1.5">
                  Lead Reference: ACH-{collection.heroShortcode}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Collection Switcher Tabs */}
      <div className="bg-ivory-warm border-b border-ivory-border">
        <div className="editorial-container py-3 flex items-center justify-between gap-4 overflow-x-auto">
          <div className="flex items-center gap-2">
            {EDITORIAL_COLLECTIONS.map((col) => {
              const active = col.slug === collection.slug;
              return (
                <Link
                  key={col.slug}
                  to={`/collections/${col.slug}`}
                  onClick={() => setSelectedColor(null)}
                  className={`px-3.5 py-2 text-xs font-medium whitespace-nowrap border transition-colors ${
                    active
                      ? 'bg-oxblood text-ivory border-oxblood'
                      : 'bg-ivory text-ink hover:bg-ivory-stone border-ivory-border'
                  }`}
                >
                  {col.title}
                </Link>
              );
            })}
            <Link
              to="/shop?archive=all"
              className="px-3.5 py-2 text-xs font-medium whitespace-nowrap bg-ivory text-oxblood hover:bg-ivory-stone border border-ivory-border"
            >
              All 97 Archive Reels →
            </Link>
          </div>
        </div>
      </div>

      {/* Color Filter Pills & Product Grid */}
      <section className="py-8 sm:py-12">
        <div className="editorial-container">
          {availableColors.length > 1 && (
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted mr-1">
                Filter by Tone:
              </span>
              <button
                type="button"
                onClick={() => setSelectedColor(null)}
                className={`px-3 py-1.5 text-xs font-medium border ${
                  selectedColor === null
                    ? 'bg-oxblood text-ivory border-oxblood'
                    : 'bg-ivory text-ink border-ivory-border hover:bg-ivory-warm'
                }`}
              >
                All Tones ({collectionProducts.length})
              </button>
              {availableColors.map((tone) => (
                <button
                  key={tone}
                  type="button"
                  onClick={() => setSelectedColor(tone === selectedColor ? null : tone)}
                  className={`px-3 py-1.5 text-xs font-medium border ${
                    selectedColor === tone
                      ? 'bg-oxblood text-ivory border-oxblood'
                      : 'bg-ivory text-ink border-ivory-border hover:bg-ivory-warm'
                  }`}
                >
                  {tone}
                </button>
              ))}
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
            {filteredItems.map((product, idx) => (
              <ProductCard key={product.id} product={product} priority={idx < 4} />
            ))}
          </div>

          <div className="mt-12 p-6 bg-ivory-warm border border-ivory-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-serif text-xl font-semibold text-ink">
                Interested in Wholesale Sets from {collection.title}?
              </h2>
              <p className="text-xs sm:text-sm text-ink-muted mt-0.5">
                Add multiple designs to your Enquiry Bag or open our Bulk Inquiry Configurator.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 shrink-0">
              <Link to="/wholesale" className="btn-luxury-primary text-xs">
                Open Wholesale Hub
              </Link>
              <button
                type="button"
                onClick={() => openSourcingModal('wholesale')}
                className="btn-luxury-secondary text-xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-brass-dark" aria-hidden="true" />
                <span>Custom Bulk Request</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <RecentlyViewedStrip />
    </div>
  );
};

