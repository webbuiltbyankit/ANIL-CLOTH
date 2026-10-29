import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Trash2, X } from 'lucide-react';
import { useStore } from '@/features/store-context';
import { ProductImage } from '@/components/media/ProductMedia';

interface RecentlyViewedStripProps {
  excludeProductId?: string;
  title?: string;
}

/**
 * RecentlyViewedStrip (`Prompt 039`)
 * Bounded localStorage list of unique product IDs with individual remove and clear-all controls.
 */
export const RecentlyViewedStrip: React.FC<RecentlyViewedStripProps> = ({
  excludeProductId,
  title = 'Recently Viewed Designs',
}) => {
  const { recentlyViewedProducts, removeRecentlyViewed, clearRecentlyViewed } = useStore();

  const items = recentlyViewedProducts
    .filter((p) => p.id !== excludeProductId)
    .slice(0, 6);

  if (items.length === 0) return null;

  return (
    <section
      aria-label={title}
      className="py-10 border-t border-ivory-border"
    >
      <div className="editorial-container">
        <div className="flex items-center justify-between gap-4 mb-5">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-brass-dark" aria-hidden="true" />
            <h2 className="font-serif text-xl sm:text-2xl font-semibold text-ink">{title}</h2>
            <span className="text-xs text-ink-muted">({items.length})</span>
          </div>

          <button
            type="button"
            onClick={clearRecentlyViewed}
            className="inline-flex items-center gap-1.5 text-xs text-ink-muted hover:text-oxblood min-h-[36px] px-2 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Clear History</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="group relative bg-ivory border border-ivory-border p-2 flex flex-col justify-between"
            >
              <button
                type="button"
                onClick={() => removeRecentlyViewed(item.id)}
                aria-label={`Remove ${item.displayId} from recently viewed`}
                className="absolute top-3 right-3 z-20 w-7 h-7 inline-flex items-center justify-center rounded-full bg-ivory/90 hover:bg-oxblood hover:text-ivory text-ink-muted border border-ivory-border transition-colors"
              >
                <X className="w-3.5 h-3.5" aria-hidden="true" />
              </button>

              <Link to={`/product/${item.shortcode}`} className="block">
                <ProductImage
                  src={item.images[0]?.publicPath}
                  alt={item.title}
                  shortcode={item.shortcode}
                  className="mb-2"
                />
                <p className="text-[11px] font-mono text-brass-dark truncate">{item.displayId}</p>
                <p className="text-xs font-serif font-semibold text-ink truncate group-hover:text-oxblood">
                  {item.title}
                </p>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

