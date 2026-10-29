import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { useStore } from '@/features/store-context';
import { getCuratedGarments } from '@/data/catalog-resolver';
import { ProductCard } from '@/components/commerce/ProductCard';
import { RecentlyViewedStrip } from '@/components/commerce/RecentlyViewedStrip';

/**
 * WishlistPage (`Prompt 051`)
 * Persistent local wishlist with clear-all confirmation, move-all-to-bag, and rich empty state.
 */
export const WishlistPage: React.FC = () => {
  useDocumentMeta({
    title: 'Saved Shortlist & Wishlist',
    description:
      'Review your saved occasionwear design references from ANIL CLOTH HOUSE before preparing a WhatsApp enquiry.',
  });

  const {
    wishlistProducts,
    clearWishlist,
    addToBag,
    showToast,
  } = useStore();

  const [confirmingClear, setConfirmingClear] = useState(false);
  const suggestions = getCuratedGarments().slice(0, 4);

  const handleMoveAllToBag = () => {
    wishlistProducts.forEach((p) => {
      addToBag(p.id, 1);
    });
    showToast(`Added all ${wishlistProducts.length} saved designs to your Enquiry Bag`, 'Open Bag', '/bag');
  };

  return (
    <div>
      {/* Header */}
      <section className="bg-ivory-warm border-b border-ivory-border py-8 sm:py-12">
        <div className="editorial-container flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="eyebrow-label text-brass-dark">Saved References</span>
            <h1 className="text-heading-1 font-semibold text-ink mt-1">
              Your Saved Shortlist ({wishlistProducts.length})
            </h1>
            <p className="text-xs sm:text-sm text-ink-muted mt-1 max-w-xl">
              Designs saved here are stored locally in your browser. Move your top choices into your Enquiry Bag to compose a consolidated WhatsApp message.
            </p>
          </div>

          {wishlistProducts.length > 0 && (
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={handleMoveAllToBag}
                className="btn-luxury-primary text-xs"
              >
                <ShoppingBag className="w-4 h-4 text-brass-light" aria-hidden="true" />
                <span>Add All to Enquiry Bag</span>
              </button>

              {!confirmingClear ? (
                <button
                  type="button"
                  onClick={() => setConfirmingClear(true)}
                  className="btn-luxury-secondary text-xs"
                >
                  <Trash2 className="w-3.5 h-3.5 text-oxblood" aria-hidden="true" />
                  <span>Clear All</span>
                </button>
              ) : (
                <div className="inline-flex items-center gap-1.5 bg-ivory p-1.5 border border-oxblood">
                  <span className="text-xs font-medium text-ink px-1">Confirm clear?</span>
                  <button
                    type="button"
                    onClick={() => {
                      clearWishlist();
                      setConfirmingClear(false);
                    }}
                    className="px-2.5 py-1 bg-oxblood text-ivory text-xs font-semibold"
                  >
                    Yes, Clear
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmingClear(false)}
                    className="px-2.5 py-1 bg-ivory-warm text-ink text-xs"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Wishlist Grid or Empty State */}
      <section className="py-10 sm:py-14">
        <div className="editorial-container">
          {wishlistProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
              {wishlistProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-ivory-warm/70 border border-ivory-border p-8 sm:p-12 text-center space-y-6">
              <div className="w-12 h-12 rounded-full bg-ivory border border-ivory-border mx-auto flex items-center justify-center text-brass-dark">
                <Heart className="w-5 h-5" aria-hidden="true" />
              </div>
              <div className="max-w-md mx-auto space-y-2">
                <h2 className="text-heading-3 font-semibold text-ink">
                  Your wishlist is currently empty
                </h2>
                <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
                  Tap the heart icon on any design card while browsing the collection or watching Reels to keep a shortlist of pieces you want to discuss with the store.
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                <Link to="/shop" className="btn-luxury-primary text-xs">
                  Explore Curated Collection
                </Link>
                <Link to="/lookbook" className="btn-luxury-secondary text-xs">
                  Browse Lookbook &amp; Reels
                </Link>
              </div>

              <div className="pt-8 border-t border-ivory-border text-left">
                <h3 className="font-serif text-lg font-semibold text-ink mb-4 text-center">
                  Curated Pieces to Start Your Shortlist
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {suggestions.map((item) => (
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

