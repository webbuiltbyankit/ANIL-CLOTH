import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Check,
  Copy,
  ExternalLink,
  Film,
  Heart,
  Image as ImageIcon,
  MessageCircle,
  ShoppingBag,
  X,
} from 'lucide-react';
import { useStore } from '@/features/store-context';
import { ProductImage, ReelVideoPlayer } from '@/components/media/ProductMedia';
import { buildSingleProductWhatsAppMessage, buildWhatsAppUrl } from '@/lib/whatsapp';
import { sanitizeExternalUrl } from '@/lib/security';

export const QuickViewModal: React.FC = () => {
  const {
    quickViewProduct,
    closeQuickView,
    isInWishlist,
    toggleWishlist,
    isInBag,
    addToBag,
    enquiryDraft,
    showToast,
  } = useStore();

  const [mediaTab, setMediaTab] = useState<'image' | 'video'>('image');
  const [copiedId, setCopiedId] = useState(false);

  useEffect(() => {
    if (quickViewProduct) {
      setMediaTab('image');
      setCopiedId(false);
    }
  }, [quickViewProduct]);

  useEffect(() => {
    if (!quickViewProduct) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeQuickView();
      }
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [quickViewProduct, closeQuickView]);

  if (!quickViewProduct) return null;

  const saved = isInWishlist(quickViewProduct.id);
  const inBag = isInBag(quickViewProduct.id);
  const primaryImage = quickViewProduct.images[0]?.publicPath || null;
  const primaryVideo = quickViewProduct.videos[0]?.publicPath || null;
  const whatsappUrl = buildWhatsAppUrl(
    buildSingleProductWhatsAppMessage(quickViewProduct, enquiryDraft.intent)
  );
  const safePostUrl = sanitizeExternalUrl(quickViewProduct.sourcePostUrl);

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(quickViewProduct.displayId);
      setCopiedId(true);
      showToast(`Copied ${quickViewProduct.displayId} to clipboard`);
      setTimeout(() => setCopiedId(false), 2000);
    } catch {
      showToast(`Design ID: ${quickViewProduct.displayId}`);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-oxblood-deep/75 backdrop-blur-sm p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="quickview-title"
      onClick={closeQuickView}
    >
      <div
        className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto bg-ivory border border-ivory-border shadow-2xl grid grid-cols-1 md:grid-cols-12"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={closeQuickView}
          aria-label="Close quick view"
          className="absolute top-3 right-3 z-30 w-11 h-11 inline-flex items-center justify-center bg-ivory/95 hover:bg-oxblood hover:text-ivory text-ink border border-ivory-border transition-colors"
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>

        {/* Left Media Column */}
        <div className="md:col-span-6 bg-ivory-warm flex flex-col">
          {quickViewProduct.hasPlayableVideo && (
            <div className="flex border-b border-ivory-border bg-ivory">
              <button
                type="button"
                onClick={() => setMediaTab('image')}
                className={`flex-1 min-h-[42px] text-xs font-medium inline-flex items-center justify-center gap-1.5 transition-colors ${
                  mediaTab === 'image'
                    ? 'bg-oxblood text-ivory'
                    : 'text-ink-muted hover:text-ink bg-ivory'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Garment Still</span>
              </button>
              <button
                type="button"
                onClick={() => setMediaTab('video')}
                className={`flex-1 min-h-[42px] text-xs font-medium inline-flex items-center justify-center gap-1.5 transition-colors ${
                  mediaTab === 'video'
                    ? 'bg-oxblood text-ivory'
                    : 'text-ink-muted hover:text-ink bg-ivory'
                }`}
              >
                <Film className="w-3.5 h-3.5 text-brass-dark" aria-hidden="true" />
                <span>Play Reel (.mp4)</span>
              </button>
            </div>
          )}

          <div className="flex-1 flex items-center justify-center">
            {mediaTab === 'video' && primaryVideo ? (
              <ReelVideoPlayer
                videoSrc={primaryVideo}
                posterSrc={primaryImage}
                alt={quickViewProduct.title}
                shortcode={quickViewProduct.shortcode}
                autoPlayMuted={true}
              />
            ) : (
              <ProductImage
                src={primaryImage}
                alt={quickViewProduct.images[0]?.altText || quickViewProduct.title}
                shortcode={quickViewProduct.shortcode}
                fitMode="contain-matte"
              />
            )}
          </div>
        </div>

        {/* Right Info Column */}
        <div className="md:col-span-6 p-5 sm:p-6 flex flex-col justify-between gap-5">
          <div className="space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-1 bg-ivory-warm border border-ivory-border text-xs font-mono font-medium text-ink">
                {quickViewProduct.displayId}
              </span>
              <button
                type="button"
                onClick={handleCopyId}
                className="inline-flex items-center gap-1 text-xs text-brass-dark hover:text-oxblood font-medium min-h-[36px] px-2"
              >
                {copiedId ? (
                  <>
                    <Check className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Copy ID</span>
                  </>
                )}
              </button>
            </div>

            <h2 id="quickview-title" className="text-heading-3 text-ink font-semibold">
              {quickViewProduct.title}
            </h2>

            <p className="text-sm text-ink-muted leading-relaxed">
              {quickViewProduct.editorialSubtitle}
            </p>

            {quickViewProduct.visualCraftNote && (
              <p className="text-xs text-ink-muted bg-ivory-warm p-3 border-l-2 border-brass">
                <strong className="text-ink">Observed Detail:</strong> {quickViewProduct.visualCraftNote}
              </p>
            )}

            <div className="pt-2 border-t border-ivory-border space-y-1.5">
              <div className="flex items-baseline justify-between">
                <span className="text-xs uppercase tracking-wider text-ink-muted">Pricing Status</span>
                <span className="text-sm font-semibold text-oxblood">
                  {quickViewProduct.priceStatusLabel}
                </span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-xs uppercase tracking-wider text-ink-muted">Availability</span>
                <span className="text-xs text-ink">Confirm directly with store</span>
              </div>
              {quickViewProduct.visualColorTag && (
                <div className="flex items-baseline justify-between">
                  <span className="text-xs uppercase tracking-wider text-ink-muted">Visual Tone</span>
                  <span className="text-xs text-ink font-medium">{quickViewProduct.visualColorTag}</span>
                </div>
              )}
              <div className="flex items-baseline justify-between">
                <span className="text-xs uppercase tracking-wider text-ink-muted">Sizes & Fabric</span>
                <span className="text-xs text-ink-muted italic">Details on request</span>
              </div>
            </div>

            {quickViewProduct.onImageOverlayNote && (
              <p className="text-[11px] text-ink-muted leading-relaxed">
                Note: {quickViewProduct.onImageOverlayNote}
              </p>
            )}
          </div>

          <div className="space-y-2.5 pt-3 border-t border-ivory-border">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-luxury-primary w-full"
            >
              <MessageCircle className="w-4 h-4 text-brass-light" aria-hidden="true" />
              <span>Ask About This Design on WhatsApp</span>
            </a>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => addToBag(quickViewProduct.id, 1)}
                className="btn-luxury-secondary w-full text-xs px-3"
              >
                <ShoppingBag className="w-4 h-4 text-oxblood" aria-hidden="true" />
                <span>{inBag ? 'Add Another to Bag' : 'Add to Enquiry Bag'}</span>
              </button>

              <button
                type="button"
                onClick={() => toggleWishlist(quickViewProduct.id)}
                aria-pressed={saved}
                className="btn-luxury-secondary w-full text-xs px-3"
              >
                <Heart
                  className={`w-4 h-4 ${saved ? 'fill-oxblood text-oxblood' : ''}`}
                  aria-hidden="true"
                />
                <span>{saved ? 'Saved in Wishlist' : 'Save to Wishlist'}</span>
              </button>
            </div>

            <div className="flex items-center justify-between pt-2 text-xs">
              <Link
                to={`/product/${quickViewProduct.shortcode}`}
                onClick={closeQuickView}
                className="font-semibold text-oxblood hover:underline underline-offset-4 py-1"
              >
                View Full Product Details →
              </Link>

              <a
                href={safePostUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-ink-muted hover:text-ink py-1"
              >
                <span>Original Post</span>
                <ExternalLink className="w-3 h-3" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

