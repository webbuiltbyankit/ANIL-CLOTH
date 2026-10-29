import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, Film, Heart, MessageCircle, ShoppingBag, Check } from 'lucide-react';
import { ProductCandidate } from '@/types/catalog';
import { ProductImage } from '@/components/media/ProductMedia';
import { useStore } from '@/features/store-context';
import { buildSingleProductWhatsAppMessage, buildWhatsAppUrl } from '@/lib/whatsapp';

interface ProductCardProps {
  product: ProductCandidate;
  priority?: boolean;
  fitMode?: 'cover' | 'contain-matte';
  compact?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  priority = false,
  fitMode = 'cover',
  compact = false,
}) => {
  const {
    isInWishlist,
    toggleWishlist,
    isInBag,
    addToBag,
    openQuickView,
    enquiryDraft,
    isPresentationMode,
  } = useStore();

  const saved = isInWishlist(product.id);
  const inBag = isInBag(product.id);
  const primaryImage = product.images[0]?.publicPath || null;
  const primaryAlt = product.images[0]?.altText || `${product.title} — ${product.editorialSubtitle}`;
  const whatsappUrl = buildWhatsAppUrl(
    buildSingleProductWhatsAppMessage(product, enquiryDraft.intent)
  );

  return (
    <article
      className="group relative flex flex-col bg-ivory border border-ivory-border/80 hover:border-brass/50 transition-colors duration-200"
      data-testid={`product-card-${product.shortcode}`}
    >
      {/* Portrait Media Area */}
      <div className="relative overflow-hidden bg-ivory-warm">
        <Link
          to={`/product/${product.shortcode}`}
          className="block focus-visible:outline-offset-[-2px]"
          aria-label={`View details for ${product.title} (${product.displayId})`}
        >
          <ProductImage
            src={primaryImage}
            alt={primaryAlt}
            shortcode={product.shortcode}
            fitMode={fitMode}
            priority={priority}
            imgClassName="group-hover:scale-[1.02] transition-transform duration-500 ease-out"
          />
        </Link>

        {/* Top-left subtle reference & Reel indicator */}
        <div className="absolute top-2.5 left-2.5 z-20 flex flex-wrap items-center gap-1.5 pointer-events-none">
          <span className="px-2 py-0.5 bg-ivory/95 backdrop-blur-sm text-ink text-[10px] font-mono font-medium tracking-wider border border-ivory-border">
            {product.displayId}
          </span>
          {product.hasPlayableVideo && (
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 bg-oxblood-deep/90 text-ivory text-[10px] font-medium tracking-wider uppercase"
              title="Includes original Instagram Reel video"
            >
              <Film className="w-3 h-3 text-brass-light" aria-hidden="true" />
              <span className="hidden sm:inline">Reel</span>
            </span>
          )}
        </div>

        {/* Top-right Wishlist Heart (44x44px hit target) */}
        <button
          type="button"
          onClick={() => toggleWishlist(product.id)}
          aria-pressed={saved}
          aria-label={
            saved
              ? `Remove ${product.displayId} from wishlist`
              : `Save ${product.displayId} to wishlist`
          }
          className={`absolute top-1.5 right-1.5 z-20 w-11 h-11 inline-flex items-center justify-center rounded-full transition-colors ${
            saved
              ? 'bg-oxblood text-ivory shadow-sm'
              : 'bg-ivory/90 hover:bg-ivory text-ink border border-ivory-border/70'
          }`}
        >
          <Heart
            className={`w-4 h-4 ${saved ? 'fill-brass-light text-brass-light' : ''}`}
            aria-hidden="true"
          />
        </button>

        {/* Quick View / Watch Reel button — always reachable, positioned at top-right below heart so it doesn't obscure garment bodice */}
        <button
          type="button"
          onClick={() => openQuickView(product)}
          aria-label={`Quick view and watch Reel for ${product.displayId}`}
          className="absolute top-14 right-1.5 z-20 w-11 h-11 inline-flex items-center justify-center rounded-full bg-ivory/90 hover:bg-oxblood hover:text-ivory text-ink border border-ivory-border/70 transition-colors"
          title="Quick View & Watch Reel"
        >
          <Eye className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>

      {/* Card Body */}
      <div className="flex flex-col flex-1 p-3 sm:p-4 justify-between gap-3">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1">
            {product.visualColorTag ? (
              <span className="text-[11px] font-medium text-brass-dark tracking-wide truncate">
                {product.visualColorTag}
              </span>
            ) : (
              <span className="text-[11px] text-ink-muted tracking-wide truncate">
                Occasionwear Edit
              </span>
            )}
            {!isPresentationMode && (
              <span className="text-[10px] text-ink-muted font-mono shrink-0">
                #{product.shortcode}
              </span>
            )}
          </div>

          <h3 className="font-serif text-base sm:text-lg font-semibold text-ink leading-snug">
            <Link
              to={`/product/${product.shortcode}`}
              className="hover:text-oxblood transition-colors"
            >
              {product.title}
            </Link>
          </h3>

          <p className="text-xs text-ink-muted line-clamp-2 mt-1 leading-relaxed">
            {product.editorialSubtitle}
          </p>
        </div>

        {/* Honest Price Status & Conversion Actions */}
        <div className="pt-2.5 border-t border-ivory-border/80 flex flex-col gap-2">
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-oxblood">
              {product.priceStatusLabel}
            </span>
            <span className="text-[11px] text-ink-muted">Confirm on WhatsApp</span>
          </div>

          {!compact && (
            <div className="grid grid-cols-2 gap-1.5 pt-0.5">
              <button
                type="button"
                onClick={() => addToBag(product.id, 1)}
                className={`min-h-[40px] sm:min-h-[42px] px-2.5 py-1.5 text-xs font-medium inline-flex items-center justify-center gap-1.5 border transition-colors ${
                  inBag
                    ? 'bg-ivory-warm border-brass text-ink'
                    : 'bg-ivory hover:bg-ivory-warm border-ivory-border text-ink'
                }`}
                aria-label={`Add ${product.displayId} to Enquiry Bag`}
              >
                {inBag ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-brass-dark shrink-0" aria-hidden="true" />
                    <span className="truncate">In Bag</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-3.5 h-3.5 text-oxblood shrink-0" aria-hidden="true" />
                    <span className="truncate">+ Enquiry</span>
                  </>
                )}
              </button>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[40px] sm:min-h-[42px] px-2.5 py-1.5 bg-oxblood hover:bg-oxblood-plum text-ivory text-xs font-medium inline-flex items-center justify-center gap-1.5 transition-colors"
                aria-label={`Ask price for ${product.displayId} on WhatsApp (opens external link)`}
              >
                <MessageCircle className="w-3.5 h-3.5 text-brass-light shrink-0" aria-hidden="true" />
                <span className="truncate">Ask Price</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

