import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Check,
  ChevronDown,
  Copy,
  ExternalLink,
  Film,
  Heart,
  Image as ImageIcon,
  Instagram,
  Maximize2,
  MessageCircle,
  Minus,
  Plus,
  Share2,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  X,
} from 'lucide-react';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import {
  getCuratedGarments,
  getProductByIdOrShortcode,
  getRelatedDesigns,
} from '@/data/catalog-resolver';
import { EDITORIAL_COLLECTIONS } from '@/data/collections';
import { BUSINESS_FACTS } from '@/data/business-facts';
import { ProductImage, ReelVideoPlayer } from '@/components/media/ProductMedia';
import { ProductCard } from '@/components/commerce/ProductCard';
import { RecentlyViewedStrip } from '@/components/commerce/RecentlyViewedStrip';
import { clampQuantity, useStore } from '@/features/store-context';
import { buildSingleProductWhatsAppMessage, buildWhatsAppUrl } from '@/lib/whatsapp';
import { sanitizeExternalUrl, sanitizePlainText } from '@/lib/security';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const product = getProductByIdOrShortcode(id);

  const {
    isInWishlist,
    toggleWishlist,
    isInBag,
    addToBag,
    recordProductView,
    enquiryDraft,
    setEnquiryIntent,
    showToast,
    isPresentationMode,
  } = useStore();

  const [activeMediaMode, setActiveMediaMode] = useState<'image' | 'video'>('image');
  const [fitMode, setFitMode] = useState<'cover' | 'contain-matte'>('contain-matte');
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [customQuestion, setCustomQuestion] = useState('');
  const [copiedId, setCopiedId] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<'ordering' | 'caption' | null>('ordering');

  useDocumentMeta({
    title: product
      ? `${product.title} (${product.displayId}) — Occasionwear Reference`
      : 'Design Reference Not Found',
    description: product
      ? `${product.displayId}: ${product.editorialSubtitle}. Enquire on WhatsApp (+91 8810530298) with ANIL CLOTH HOUSE.`
      : undefined,
  });

  useEffect(() => {
    if (product) {
      recordProductView(product.id);
      setActiveMediaMode('image');
      setQuantity(1);
      setCustomQuestion('');
      setIsZoomOpen(false);
    }
  }, [product, recordProductView]);

  useEffect(() => {
    if (!isZoomOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsZoomOpen(false);
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [isZoomOpen]);

  // Helpful 404 / Product-Not-Found Recovery State (Prompt 041)
  if (!product) {
    const fallbackSuggestions = getCuratedGarments().slice(0, 4);
    return (
      <div className="editorial-container py-14 sm:py-20 space-y-10">
        <div className="max-w-xl mx-auto text-center space-y-4 bg-ivory-warm border border-ivory-border p-8">
          <span className="eyebrow-label text-brass-dark">Design Reference Not Found</span>
          <h1 className="text-heading-2 font-semibold text-ink">
            We couldn&apos;t locate design &ldquo;{id}&rdquo;
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
            The design code or shortcode you entered does not match any of the 97 media-backed Reels in this local demo archive. Check the shortcode spelling or browse our curated collection.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Link to="/shop" className="btn-luxury-primary text-xs">
              Browse Shop Catalogue
            </Link>
            <Link to="/search" className="btn-luxury-secondary text-xs">
              Search by Shortcode
            </Link>
          </div>
        </div>

        <div>
          <h2 className="font-serif text-2xl font-semibold text-ink mb-5 text-center">
            Explore Verified Showroom Designs
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {fallbackSuggestions.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const saved = isInWishlist(product.id);
  const inBag = isInBag(product.id);
  const primaryImage = product.images[0]?.publicPath || null;
  const primaryVideo = product.videos[0]?.publicPath || null;
  const relatedDesigns = getRelatedDesigns(product, 4);
  const safePostUrl = sanitizeExternalUrl(product.sourcePostUrl);

  const primaryCollectionSlug = product.editorialCollections.find((c) => c !== 'uncategorized');
  const primaryCollection = EDITORIAL_COLLECTIONS.find((c) => c.slug === primaryCollectionSlug);

  const whatsappMessage = buildSingleProductWhatsAppMessage(
    product,
    enquiryDraft.intent,
    customQuestion
  );
  const whatsappUrl = buildWhatsAppUrl(whatsappMessage);

  const handleCopyDesignId = async () => {
    try {
      await navigator.clipboard.writeText(product.displayId);
      setCopiedId(true);
      showToast(`Copied Design ID ${product.displayId}`);
      setTimeout(() => setCopiedId(false), 2000);
    } catch {
      showToast(`Design ID: ${product.displayId}`);
    }
  };

  const handleShareOrCopyLink = async () => {
    const shareUrl = window.location.href;
    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({
          title: `${product.title} (${product.displayId}) — ANIL CLOTH HOUSE`,
          text: `Check out ${product.displayId} (${product.editorialSubtitle}) from ANIL CLOTH HOUSE`,
          url: shareUrl,
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      showToast('Copied product page link to clipboard');
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      showToast('Copy URL from browser address bar');
    }
  };

  const cleanCaption = sanitizePlainText(product.rawCaption, 1000);

  return (
    <div className="pb-20 lg:pb-0">
      {/* Top Breadcrumb & Back Navigation Bar (Prompts 041, 079) */}
      <div className="bg-ivory-warm border-b border-ivory-border">
        <div className="editorial-container py-3 flex flex-wrap items-center justify-between gap-2 text-xs">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-ink-muted flex-wrap">
            <Link to="/" className="hover:text-oxblood">
              Home
            </Link>
            <span>/</span>
            <Link to="/shop" className="hover:text-oxblood">
              Shop
            </Link>
            {primaryCollection && (
              <>
                <span>/</span>
                <Link to={`/collections/${primaryCollection.slug}`} className="hover:text-oxblood">
                  {primaryCollection.title}
                </Link>
              </>
            )}
            <span>/</span>
            <span className="font-mono font-semibold text-ink" aria-current="page">
              {product.displayId}
            </span>
          </nav>

          <button
            type="button"
            onClick={() => {
              if (window.history.length > 2) navigate(-1);
              else navigate('/shop');
            }}
            className="inline-flex items-center gap-1 font-medium text-oxblood hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Back to Results</span>
          </button>
        </div>
      </div>

      {/* Main Two-Column PDP Layout (Prompts 041, 042) */}
      <section className="py-8 sm:py-12">
        <div className="editorial-container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* LEFT COLUMN: Gallery (Still Portrait + Local .mp4 Reel Video) */}
            <div className="lg:col-span-6 lg:sticky lg:top-28 space-y-3">
              {/* Media Mode Selector Tabs */}
              <div className="flex flex-wrap items-center justify-between gap-2 bg-ivory-warm p-1.5 border border-ivory-border">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setActiveMediaMode('image')}
                    aria-pressed={activeMediaMode === 'image'}
                    className={`min-h-[38px] px-3.5 py-1.5 text-xs font-medium inline-flex items-center gap-1.5 transition-colors ${
                      activeMediaMode === 'image'
                        ? 'bg-oxblood text-ivory'
                        : 'bg-ivory text-ink hover:bg-ivory-stone'
                    }`}
                  >
                    <ImageIcon className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Portrait Still (640×1136)</span>
                  </button>

                  {product.hasPlayableVideo && (
                    <button
                      type="button"
                      onClick={() => setActiveMediaMode('video')}
                      aria-pressed={activeMediaMode === 'video'}
                      className={`min-h-[38px] px-3.5 py-1.5 text-xs font-medium inline-flex items-center gap-1.5 transition-colors ${
                        activeMediaMode === 'video'
                          ? 'bg-oxblood text-ivory'
                          : 'bg-ivory text-ink hover:bg-ivory-stone'
                      }`}
                    >
                      <Film className="w-3.5 h-3.5 text-brass-dark" aria-hidden="true" />
                      <span>Play Showroom Reel (.mp4)</span>
                    </button>
                  )}
                </div>

                {activeMediaMode === 'image' && (
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() =>
                        setFitMode((m) => (m === 'contain-matte' ? 'cover' : 'contain-matte'))
                      }
                      className="min-h-[38px] px-2.5 py-1 bg-ivory border border-ivory-border text-[11px] text-ink hover:bg-ivory-stone"
                    >
                      {fitMode === 'contain-matte' ? 'Matte Frame' : 'Full Crop'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsZoomOpen(true)}
                      aria-label="Open full-screen zoom view"
                      className="min-h-[38px] px-2.5 py-1 bg-ivory border border-ivory-border text-[11px] text-ink hover:bg-oxblood hover:text-ivory inline-flex items-center gap-1 transition-colors"
                    >
                      <Maximize2 className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Zoom</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Active Media Stage */}
              <div className="max-w-md mx-auto border border-ivory-border bg-ivory-warm shadow-sm">
                {activeMediaMode === 'video' && primaryVideo ? (
                  <ReelVideoPlayer
                    videoSrc={primaryVideo}
                    posterSrc={primaryImage}
                    alt={product.title}
                    shortcode={product.shortcode}
                    autoPlayMuted={true}
                    onExpandZoom={() => setIsZoomOpen(true)}
                  />
                ) : (
                  <div
                    onClick={() => setIsZoomOpen(true)}
                    className="cursor-zoom-in relative group"
                    role="button"
                    tabIndex={0}
                    aria-label="Inspect full-resolution garment image"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setIsZoomOpen(true);
                      }
                    }}
                  >
                    <ProductImage
                      src={primaryImage}
                      alt={product.images[0]?.altText || product.title}
                      shortcode={product.shortcode}
                      fitMode={fitMode}
                      priority={true}
                    />
                    <span className="absolute bottom-3 right-3 z-20 px-3 py-1.5 bg-oxblood-deep/85 text-ivory text-xs font-medium inline-flex items-center gap-1.5 border border-ivory/20">
                      <Maximize2 className="w-3.5 h-3.5 text-brass-light" aria-hidden="true" />
                      <span>Click to Zoom</span>
                    </span>
                  </div>
                )}
              </div>

              {/* Honest Single-Image & Overlay Note (Prompt 042) */}
              <div className="max-w-md mx-auto flex items-center justify-between text-[11px] text-ink-muted px-1">
                <span>
                  1 portrait cover + {product.hasPlayableVideo ? '1 playable .mp4 Reel' : '0 videos'} (no synthetic duplicate angles)
                </span>
                {!isPresentationMode && (
                  <span className="font-mono">SHA-verified local asset</span>
                )}
              </div>
            </div>

            {/* RIGHT COLUMN: Product Information, WhatsApp Conversion & Specs */}
            <div className="lg:col-span-6 space-y-6">
              {/* Header Badges & Utility Actions (Prompt 048, 079) */}
              <div className="space-y-3 border-b border-ivory-border pb-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-1 bg-oxblood text-ivory text-xs font-mono font-semibold tracking-wider">
                      {product.displayId}
                    </span>
                    <span className="px-2.5 py-1 bg-ivory-warm border border-brass/40 text-brass-dark text-xs font-medium">
                      Details on request
                    </span>
                    {product.isCurated && (
                      <span className="px-2.5 py-1 bg-ivory-warm border border-ivory-border text-ink text-xs">
                        Visually Reviewed
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handleCopyDesignId}
                      className="min-h-[36px] px-2.5 py-1 bg-ivory hover:bg-ivory-warm border border-ivory-border text-xs font-medium text-ink inline-flex items-center gap-1"
                    >
                      {copiedId ? (
                        <Check className="w-3.5 h-3.5 text-brass-dark" aria-hidden="true" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-brass-dark" aria-hidden="true" />
                      )}
                      <span>{copiedId ? 'Copied ID' : 'Copy Design ID'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleShareOrCopyLink}
                      className="min-h-[36px] px-2.5 py-1 bg-ivory hover:bg-ivory-warm border border-ivory-border text-xs font-medium text-ink inline-flex items-center gap-1"
                    >
                      {copiedLink ? (
                        <Check className="w-3.5 h-3.5 text-brass-dark" aria-hidden="true" />
                      ) : (
                        <Share2 className="w-3.5 h-3.5 text-brass-dark" aria-hidden="true" />
                      )}
                      <span>{copiedLink ? 'Link Copied' : 'Share'}</span>
                    </button>
                  </div>
                </div>

                <h1 className="text-heading-1 font-semibold text-ink">{product.title}</h1>

                <p className="text-sm sm:text-base text-ink-muted leading-relaxed">
                  {product.editorialSubtitle}
                </p>

                {/* Honest Price & Availability Banner */}
                <div className="pt-2 flex flex-wrap items-baseline justify-between gap-2 bg-ivory-warm/80 p-4 border border-ivory-border">
                  <div>
                    <span className="text-xs uppercase tracking-wider text-ink-muted block">
                      Pricing Status
                    </span>
                    <span className="font-serif text-2xl font-bold text-oxblood">
                      {product.priceStatusLabel}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs uppercase tracking-wider text-ink-muted block">
                      Availability &amp; Terms
                    </span>
                    <span className="text-xs font-semibold text-ink">
                      Confirm directly on WhatsApp • <strong className="text-oxblood">NO COD</strong>
                    </span>
                  </div>
                </div>

                {product.onImageOverlayNote && (
                  <p className="text-xs text-ink-muted leading-relaxed">
                    <strong className="text-ink">Reel Cover Overlay Note:</strong>{' '}
                    {product.onImageOverlayNote}
                  </p>
                )}
              </div>

              {/* Conversion Control Panel: Personal vs. Wholesale Intent + WhatsApp + Enquiry Bag (Prompts 044, 045) */}
              <div className="bg-ivory-warm/60 border border-ivory-border p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-ink">
                    1. Select Enquiry Mode
                  </span>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={() => setEnquiryIntent('personal')}
                      aria-pressed={enquiryDraft.intent === 'personal'}
                      className={`min-h-[36px] px-3 py-1 text-xs font-medium border ${
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
                      className={`min-h-[36px] px-3 py-1 text-xs font-medium border ${
                        enquiryDraft.intent === 'wholesale'
                          ? 'bg-oxblood text-ivory border-oxblood'
                          : 'bg-ivory text-ink border-ivory-border'
                      }`}
                    >
                      Wholesale / Bulk
                    </button>
                  </div>
                </div>

                {/* Quantity of Interest Stepper */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-ivory-border/70">
                  <div>
                    <label
                      htmlFor="pdp-qty-input"
                      className="text-xs font-semibold uppercase tracking-wider text-ink block"
                    >
                      2. Units of Interest (For Quote)
                    </label>
                    <span className="text-[11px] text-ink-muted">
                      Indicates enquiry interest only; does not reserve stock.
                    </span>
                  </div>

                  <div className="inline-flex items-center border border-ivory-border bg-ivory">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => clampQuantity(q - 1))}
                      aria-label="Decrease units of interest"
                      className="w-10 h-10 inline-flex items-center justify-center text-ink hover:bg-ivory-warm"
                    >
                      <Minus className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                    <input
                      id="pdp-qty-input"
                      type="number"
                      min={1}
                      max={500}
                      value={quantity}
                      onChange={(e) => setQuantity(clampQuantity(Number(e.target.value)))}
                      className="w-14 h-10 text-center text-sm font-semibold text-ink bg-transparent focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => clampQuantity(q + 1))}
                      aria-label="Increase units of interest"
                      className="w-10 h-10 inline-flex items-center justify-center text-ink hover:bg-ivory-warm"
                    >
                      <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </div>

                {/* Optional note for WhatsApp / Enquiry Bag */}
                <div>
                  <label
                    htmlFor="pdp-custom-note"
                    className="block text-xs font-semibold uppercase tracking-wider text-ink mb-1"
                  >
                    Optional Question (Sizes, Colours, MOQ, Shipping)
                  </label>
                  <input
                    id="pdp-custom-note"
                    type="text"
                    value={customQuestion}
                    onChange={(e) => setCustomQuestion(e.target.value)}
                    placeholder="e.g., Please share available colours and dispatch time to Mumbai"
                    className="w-full min-h-[40px] px-3 py-1.5 bg-ivory border border-ivory-border text-xs text-ink placeholder:text-ink-subtle"
                  />
                </div>

                {/* Primary & Secondary Action Buttons */}
                <div className="space-y-2.5 pt-1">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-luxury-primary w-full text-sm"
                  >
                    <MessageCircle className="w-4 h-4 text-brass-light" aria-hidden="true" />
                    <span>
                      Ask About This Design on WhatsApp ({BUSINESS_FACTS.verifiedFromSuppliedFiles.whatsappDisplay})
                    </span>
                  </a>
                  <p className="text-[11px] text-ink-muted text-center">
                    Opens WhatsApp externally with prefilled reference <code className="font-mono">{product.displayId}</code>; nothing is sent automatically.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    <button
                      type="button"
                      onClick={() => addToBag(product.id, quantity, customQuestion)}
                      className="btn-luxury-secondary w-full text-xs"
                    >
                      <ShoppingBag className="w-4 h-4 text-oxblood" aria-hidden="true" />
                      <span>
                        {inBag ? 'Add More to Enquiry Bag' : 'Add to Enquiry Bag'}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleWishlist(product.id)}
                      aria-pressed={saved}
                      className="btn-luxury-secondary w-full text-xs"
                    >
                      <Heart
                        className={`w-4 h-4 ${saved ? 'fill-oxblood text-oxblood' : ''}`}
                        aria-hidden="true"
                      />
                      <span>{saved ? 'Saved in Wishlist' : 'Save to Wishlist'}</span>
                    </button>
                  </div>
                </div>

                {/* Microcopy clarifying Enquiry Bag (Prompt 045) */}
                <div className="pt-2 border-t border-ivory-border/70 flex items-center justify-between text-xs text-ink-muted">
                  <span>
                    Enquiry Bag saves multiple designs for a single consolidated WhatsApp question (not a paid order).
                  </span>
                  <Link
                    to="/bag"
                    className="font-semibold text-oxblood hover:underline shrink-0 ml-2"
                  >
                    Review Bag →
                  </Link>
                </div>
              </div>

              {/* Structured Product Facts Specification Table (Prompt 043) */}
              <div className="border border-ivory-border bg-ivory p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-ivory-border pb-2.5">
                  <h2 className="font-serif text-lg font-semibold text-ink">
                    Honest Product Specifications
                  </h2>
                  <span className="text-[11px] text-brass-dark font-medium">
                    Zero Hallucinated Attributes
                  </span>
                </div>

                <dl className="divide-y divide-ivory-border/70 text-xs">
                  <div className="py-2.5 grid grid-cols-3 gap-2">
                    <dt className="text-ink-muted font-medium">Design Reference</dt>
                    <dd className="col-span-2 font-mono font-semibold text-ink">
                      {product.displayId} (Shortcode: {product.shortcode})
                    </dd>
                  </div>

                  <div className="py-2.5 grid grid-cols-3 gap-2">
                    <dt className="text-ink-muted font-medium">Editorial Grouping</dt>
                    <dd className="col-span-2 text-ink">
                      {primaryCollection ? (
                        <Link
                          to={`/collections/${primaryCollection.slug}`}
                          className="text-oxblood underline underline-offset-2"
                        >
                          {primaryCollection.title}
                        </Link>
                      ) : (
                        'Extended Showroom Reel Archive'
                      )}{' '}
                      <span className="text-ink-muted">(Visual curation)</span>
                    </dd>
                  </div>

                  {product.visualColorTag && (
                    <div className="py-2.5 grid grid-cols-3 gap-2">
                      <dt className="text-ink-muted font-medium">Observed Colour Tone</dt>
                      <dd className="col-span-2 text-ink font-medium">{product.visualColorTag}</dd>
                    </div>
                  )}

                  {product.visualCraftNote && (
                    <div className="py-2.5 grid grid-cols-3 gap-2">
                      <dt className="text-ink-muted font-medium">Observed Surface Detail</dt>
                      <dd className="col-span-2 text-ink leading-relaxed">
                        {product.visualCraftNote}
                      </dd>
                    </div>
                  )}

                  <div className="py-2.5 grid grid-cols-3 gap-2">
                    <dt className="text-ink-muted font-medium">Available Sizes</dt>
                    <dd className="col-span-2 text-ink-muted italic">
                      To be confirmed — ask the store on WhatsApp
                    </dd>
                  </div>

                  <div className="py-2.5 grid grid-cols-3 gap-2">
                    <dt className="text-ink-muted font-medium">Fabric Composition</dt>
                    <dd className="col-span-2 text-ink-muted italic">
                      To be confirmed — ask the store on WhatsApp
                    </dd>
                  </div>

                  <div className="py-2.5 grid grid-cols-3 gap-2">
                    <dt className="text-ink-muted font-medium">Store Policies</dt>
                    <dd className="col-span-2 text-ink">
                      <strong>NO COD</strong> • Worldwide shipping stated in bio (confirm charges &amp; timeline with store)
                    </dd>
                  </div>
                </dl>

                <p className="text-[11px] text-ink-muted pt-1">
                  Final specifications, shade variations under showroom lighting, and current stock are confirmed directly by{' '}
                  <strong className="text-ink">ANIL CLOTH HOUSE</strong>.
                </p>
              </div>

              {/* Source Provenance Row (Prompt 048) */}
              <div className="bg-ivory-warm border border-ivory-border p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <Instagram className="w-4 h-4 text-brass-dark shrink-0 mt-0.5" aria-hidden="true" />
                  <div className="text-xs">
                    <span className="font-semibold text-ink block">
                      Originally featured on Instagram ({BUSINESS_FACTS.verifiedFromSuppliedFiles.instagramHandle})
                    </span>
                    <span className="text-ink-muted text-[11px]">
                      This site is a private design concept; the original post is reference material, not proof of live stock.
                    </span>
                  </div>
                </div>

                <a
                  href={safePostUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-luxury-secondary text-xs py-2 px-3 shrink-0"
                >
                  <span>View Source Post</span>
                  <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                </a>
              </div>

              {/* How Ordering Works & Source Caption Accordions (Prompt 046) */}
              <div className="border border-ivory-border divide-y divide-ivory-border bg-ivory">
                <div>
                  <button
                    type="button"
                    onClick={() =>
                      setOpenAccordion((p) => (p === 'ordering' ? null : 'ordering'))
                    }
                    aria-expanded={openAccordion === 'ordering'}
                    className="w-full min-h-[48px] px-4 py-3 flex items-center justify-between text-left text-xs font-semibold uppercase tracking-wider text-ink hover:bg-ivory-warm"
                  >
                    <span className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-brass-dark" aria-hidden="true" />
                      <span>How Ordering Works &amp; Store Rules</span>
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        openAccordion === 'ordering' ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {openAccordion === 'ordering' && (
                    <div className="p-4 text-xs text-ink-muted space-y-2.5 bg-ivory-warm/40 leading-relaxed">
                      <ol className="list-decimal list-inside space-y-1.5 text-ink">
                        <li>
                          <strong>Choose a Design Reference:</strong> Note the code{' '}
                          <code className="font-mono">{product.displayId}</code> or add multiple pieces to your Enquiry Bag.
                        </li>
                        <li>
                          <strong>Ask the Store on WhatsApp:</strong> Send your prefilled inquiry to{' '}
                          <strong>+91 8810530298</strong> to confirm current price, available colours, and sizes.
                        </li>
                        <li>
                          <strong>Agree Terms Directly:</strong> Follow the showroom&apos;s confirmed payment and dispatch instructions.
                        </li>
                      </ol>
                      <p className="pt-1 border-t border-ivory-border">
                        <strong className="text-oxblood">Payment &amp; Shipping Note:</strong> Cash on Delivery (COD) is not offered because the supplied profile explicitly states{' '}
                        <code className="font-mono">NO DM&apos;S NO COD</code>. Worldwide shipping is mentioned on the public profile, with destination eligibility, courier charges, and delivery timing confirmed directly by the store.
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <button
                    type="button"
                    onClick={() =>
                      setOpenAccordion((p) => (p === 'caption' ? null : 'caption'))
                    }
                    aria-expanded={openAccordion === 'caption'}
                    className="w-full min-h-[48px] px-4 py-3 flex items-center justify-between text-left text-xs font-semibold uppercase tracking-wider text-ink hover:bg-ivory-warm"
                  >
                    <span>Supplied Source Post Caption &amp; Metadata</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        openAccordion === 'caption' ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {openAccordion === 'caption' && (
                    <div className="p-4 text-xs text-ink-muted space-y-2 bg-ivory-warm/40">
                      {cleanCaption ? (
                        <pre className="whitespace-pre-wrap font-sans text-xs text-ink bg-ivory p-3 border border-ivory-border">
                          {cleanCaption}
                        </pre>
                      ) : (
                        <p className="italic">
                          Source Instagram Reel was published without a text caption; visual media and post metadata were extracted directly.
                        </p>
                      )}
                      {product.publishedAt && (
                        <p className="text-[11px]">
                          <strong>Published Timestamp:</strong>{' '}
                          {new Date(product.publishedAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Designs Section (Prompt 047) */}
      <section className="py-12 bg-ivory-warm/60 border-t border-ivory-border">
        <div className="editorial-container">
          <div className="flex items-end justify-between gap-4 mb-6">
            <div>
              <span className="eyebrow-label text-brass-dark">Visual Curation</span>
              <h2 className="text-heading-2 font-semibold text-ink mt-1">
                You May Also Like
              </h2>
              <p className="text-xs text-ink-muted mt-0.5">
                Selected from the same editorial grouping and colour palette.
              </p>
            </div>
            <Link to="/shop" className="text-xs font-semibold text-oxblood hover:underline">
              Browse All →
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-6">
            {relatedDesigns.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </div>
      </section>

      <RecentlyViewedStrip excludeProductId={product.id} />

      {/* Mobile Sticky Bottom Action Bar (Prompt 073) */}
      <div className="fixed bottom-0 inset-x-0 z-30 lg:hidden bg-ivory/95 backdrop-blur-md border-t border-ivory-border px-3 py-2.5 pb-safe shadow-lg">
        <div className="flex items-center gap-2 max-w-lg mx-auto">
          <button
            type="button"
            onClick={() => toggleWishlist(product.id)}
            aria-pressed={saved}
            aria-label={saved ? 'Remove from wishlist' : 'Save to wishlist'}
            className="w-11 h-11 shrink-0 inline-flex items-center justify-center border border-ivory-border bg-ivory text-ink"
          >
            <Heart
              className={`w-4 h-4 ${saved ? 'fill-oxblood text-oxblood' : ''}`}
              aria-hidden="true"
            />
          </button>

          <button
            type="button"
            onClick={() => addToBag(product.id, quantity, customQuestion)}
            className="min-h-[44px] px-3.5 bg-ivory-warm border border-oxblood/40 text-ink text-xs font-semibold inline-flex items-center justify-center gap-1.5 shrink-0"
          >
            <ShoppingBag className="w-4 h-4 text-oxblood" aria-hidden="true" />
            <span>+ Enquiry</span>
          </button>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 min-h-[44px] px-4 bg-oxblood text-ivory text-xs font-semibold inline-flex items-center justify-center gap-1.5"
          >
            <MessageCircle className="w-4 h-4 text-brass-light" aria-hidden="true" />
            <span>Ask on WhatsApp</span>
          </a>
        </div>
      </div>

      {/* Full-Screen Accessible Zoom Modal (Prompt 042) */}
      {isZoomOpen && (
        <div
          className="fixed inset-0 z-50 bg-oxblood-deep/90 backdrop-blur-md flex flex-col items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`Full-resolution view of ${product.displayId}`}
          onClick={() => setIsZoomOpen(false)}
        >
          <div className="w-full max-w-2xl flex items-center justify-between text-ivory mb-3">
            <div>
              <span className="font-mono text-xs text-brass-light">{product.displayId}</span>
              <h2 className="font-serif text-lg font-semibold">{product.title}</h2>
            </div>
            <button
              type="button"
              onClick={() => setIsZoomOpen(false)}
              aria-label="Close zoom view"
              className="w-11 h-11 inline-flex items-center justify-center border border-ivory/30 text-ivory hover:bg-ivory/15"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>

          <div
            className="max-h-[82vh] overflow-auto border border-ivory/20 bg-oxblood-deep"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={primaryImage ? `${import.meta.env.BASE_URL.replace(/\/$/, '')}${primaryImage}` : ''}
              alt={product.images[0]?.altText || product.title}
              className="max-h-[80vh] w-auto mx-auto object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};

