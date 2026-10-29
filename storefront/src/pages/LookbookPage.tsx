import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Eye, Film, MessageCircle, Sparkles } from 'lucide-react';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { getAllSellableGarments, getCuratedGarments } from '@/data/catalog-resolver';
import { ProductImage } from '@/components/media/ProductMedia';
import { useStore } from '@/features/store-context';
import { buildSingleProductWhatsAppMessage, buildWhatsAppUrl } from '@/lib/whatsapp';
import { sanitizeExternalUrl } from '@/lib/security';

const LOOKBOOK_STORIES = [
  'All Stories',
  'Pastel Couture & Shimmer Drapes',
  'Regal Wine & Evening Statements',
  'Bridal-Guest & Festive Ensembles',
  'Jewel Tones & Heritage Motifs',
] as const;

/**
 * LookbookPage (`Prompt 037`)
 * Visual gallery & Reel showcase organized by manually inspected visual stories.
 */
export const LookbookPage: React.FC = () => {
  useDocumentMeta({
    title: 'Editorial Lookbook & Showroom Reels Gallery',
    description:
      'Visual lookbook and playable Instagram Reel gallery of embroidered women’s occasionwear from ANIL CLOTH HOUSE, NIT Faridabad.',
  });

  const { openQuickView, enquiryDraft } = useStore();
  const [selectedStory, setSelectedStory] = useState<string>('All Stories');
  const [showAll97Reels, setShowAll97Reels] = useState(false);

  const items = useMemo(() => {
    const base = showAll97Reels ? getAllSellableGarments() : getCuratedGarments();
    if (selectedStory === 'All Stories') return base;
    return base.filter((p) => p.lookbookStory === selectedStory);
  }, [selectedStory, showAll97Reels]);

  return (
    <div>
      {/* Masthead */}
      <section className="bg-oxblood text-ivory py-10 sm:py-14 border-b border-brass/30">
        <div className="editorial-container">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-1.5 text-brass-light eyebrow-label">
              <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Visual Stories &amp; Playable Reels</span>
            </div>
            <h1 className="text-heading-1 font-semibold text-ivory">
              Showroom Lookbook &amp; Reel Archive
            </h1>
            <p className="text-sm sm:text-base text-ivory/85 leading-relaxed">
              Every frame below is an authentic showroom capture from{' '}
              <strong className="text-ivory">ANIL CLOTH HOUSE</strong>. Select any tile to open the zoomable viewer and play its original `.mp4` Instagram Reel video, inspect its `ACH-` reference ID, or enquire directly on WhatsApp.
            </p>
          </div>
        </div>
      </section>

      {/* Story Filter Bar */}
      <div className="sticky top-16 sm:top-20 z-30 bg-ivory/95 backdrop-blur-md border-b border-ivory-border">
        <div className="editorial-container py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {LOOKBOOK_STORIES.map((story) => (
              <button
                key={story}
                type="button"
                onClick={() => setSelectedStory(story)}
                className={`px-3.5 py-2 text-xs font-medium whitespace-nowrap border transition-colors ${
                  selectedStory === story
                    ? 'bg-oxblood text-ivory border-oxblood'
                    : 'bg-ivory text-ink hover:bg-ivory-warm border-ivory-border'
                }`}
              >
                {story}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setShowAll97Reels((p) => !p)}
            aria-pressed={showAll97Reels}
            className="px-3.5 py-2 text-xs font-semibold border border-oxblood/40 bg-ivory-warm hover:bg-ivory-stone text-ink"
          >
            {showAll97Reels ? 'Showing All 97 Reels' : 'Expand to All 97 Reels'}
          </button>
        </div>
      </div>

      {/* Lookbook Gallery Grid */}
      <section className="py-10 sm:py-14">
        <div className="editorial-container">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {items.map((item, idx) => {
              const whatsappUrl = buildWhatsAppUrl(
                buildSingleProductWhatsAppMessage(item, enquiryDraft.intent)
              );
              const safePostUrl = sanitizeExternalUrl(item.sourcePostUrl);

              return (
                <article
                  key={item.id}
                  className="bg-ivory border border-ivory-border flex flex-col justify-between group hover:border-oxblood transition-colors"
                >
                  <div>
                    <div className="relative overflow-hidden bg-ivory-warm">
                      <button
                        type="button"
                        onClick={() => openQuickView(item)}
                        className="w-full text-left block"
                        aria-label={`Open zoomable viewer and play Reel for ${item.displayId}`}
                      >
                        <ProductImage
                          src={item.images[0]?.publicPath}
                          alt={item.images[0]?.altText || item.title}
                          shortcode={item.shortcode}
                          priority={idx < 4}
                          imgClassName="group-hover:scale-[1.03] transition-transform duration-500"
                        />
                      </button>

                      <div className="absolute top-2.5 left-2.5 z-20 flex items-center gap-1.5 pointer-events-none">
                        <span className="px-2 py-0.5 bg-ivory/95 text-ink text-[10px] font-mono font-semibold border border-ivory-border">
                          {item.displayId}
                        </span>
                        {item.hasPlayableVideo && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-oxblood-deep/90 text-ivory text-[10px] font-medium uppercase">
                            <Film className="w-3 h-3 text-brass-light" aria-hidden="true" />
                            <span>Reel .mp4</span>
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => openQuickView(item)}
                        className="absolute bottom-2.5 right-2.5 z-20 min-h-[38px] px-3 py-1.5 bg-oxblood-deep/90 hover:bg-oxblood text-ivory text-xs font-medium inline-flex items-center gap-1.5 border border-ivory/25 backdrop-blur-sm"
                      >
                        <Eye className="w-3.5 h-3.5 text-brass-light" aria-hidden="true" />
                        <span>Inspect &amp; Play</span>
                      </button>
                    </div>

                    <div className="p-4">
                      {item.lookbookStory && (
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-brass-dark block">
                          {item.lookbookStory}
                        </span>
                      )}
                      <h2 className="font-serif text-lg font-semibold text-ink mt-0.5">
                        <Link to={`/product/${item.shortcode}`} className="hover:text-oxblood">
                          {item.title}
                        </Link>
                      </h2>
                      <p className="text-xs text-ink-muted mt-1 leading-relaxed">
                        {item.editorialSubtitle}
                      </p>
                    </div>
                  </div>

                  <div className="px-4 pb-4 pt-2 border-t border-ivory-border/70 space-y-2">
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-luxury-primary w-full text-xs py-2.5"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-brass-light" aria-hidden="true" />
                      <span>Enquire About This Design</span>
                    </a>

                    <div className="flex items-center justify-between text-[11px] pt-0.5">
                      <Link
                        to={`/product/${item.shortcode}`}
                        className="font-semibold text-oxblood hover:underline"
                      >
                        Full Product Sheet →
                      </Link>
                      <a
                        href={safePostUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-ink-muted hover:text-ink"
                      >
                        <span>Instagram Source</span>
                        <ExternalLink className="w-3 h-3" aria-hidden="true" />
                      </a>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

