import React from 'react';
import { getCuratedGarments } from '@/data/catalog-resolver';
import { ProductImage } from '@/components/media/ProductMedia';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';

export const DesignSystemPage: React.FC = () => {
  useDocumentMeta({
    title: 'Design System & Token Showcase',
    description:
      'North Indian Festive Editorial design tokens, typography scale, buttons, badges, and real garment media ratios.',
  });

  const sampleProducts = getCuratedGarments().slice(0, 4);

  const colors = [
    { name: 'Warm Ivory (Primary Canvas)', hex: '#FBF7F0', className: 'bg-ivory text-ink' },
    { name: 'Warm Sand (Secondary Surface)', hex: '#F5EFE4', className: 'bg-ivory-warm text-ink' },
    { name: 'Deep Charcoal (Primary Ink)', hex: '#1E1614', className: 'bg-ink text-ivory' },
    { name: 'Muted Smoke (Secondary Ink)', hex: '#5C4E4A', className: 'bg-ink-muted text-ivory' },
    { name: 'Oxblood Maroon (Primary Accent)', hex: '#4A121A', className: 'bg-oxblood text-ivory' },
    { name: 'Antique Zari Brass (Highlight)', hex: '#B8893A', className: 'bg-brass text-ink' },
  ];

  return (
    <div className="editorial-container py-12 sm:py-16 space-y-14">
      <header className="border-b border-ivory-border pb-8">
        <span className="eyebrow-label">Phase 02 Architecture • Prompts 011–015</span>
        <h1 className="font-serif text-3xl sm:text-5xl text-ink mt-1">
          North Indian Festive Editorial Design System
        </h1>
        <p className="text-sm sm:text-base text-ink-muted mt-2 max-w-2xl">
          Crafted specifically around the jewel-toned archival photography and 9:16 vertical Reel
          covers of ANIL CLOTH HOUSE.
        </p>
      </header>

      {/* Color Palette */}
      <section className="space-y-4">
        <h2 className="font-serif text-2xl text-ink">1. Color Tokens</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {colors.map((c) => (
            <div
              key={c.hex}
              className={`p-6 border border-ivory-border flex flex-col justify-between h-32 ${c.className}`}
            >
              <span className="font-serif text-lg font-medium">{c.name}</span>
              <span className="font-mono text-xs opacity-85">{c.hex}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Typography Scale */}
      <section className="space-y-4">
        <h2 className="font-serif text-2xl text-ink">2. Typography Scale</h2>
        <div className="p-6 sm:p-8 bg-ivory-warm border border-ivory-border space-y-5">
          <div>
            <span className="text-xs font-mono text-ink-muted">
              Display Serif (Cormorant Garamond / Georgia)
            </span>
            <p className="font-serif text-4xl sm:text-5xl text-ink">
              Handcrafted Zari &amp; Festive Ensembles
            </p>
          </div>
          <div>
            <span className="text-xs font-mono text-ink-muted">Section Heading (H2)</span>
            <p className="font-serif text-2xl sm:text-3xl text-ink">
              Curated Edit from NIT Faridabad
            </p>
          </div>
          <div>
            <span className="text-xs font-mono text-ink-muted">
              Body Copy (Plus Jakarta Sans / System Sans)
            </span>
            <p className="text-base text-ink max-w-2xl leading-relaxed">
              Every silhouette is photographed directly by the showroom. Because captions do not list
              fixed retail prices, our interface pairs high-craft editorial typography with immediate
              WhatsApp enquiry handoffs.
            </p>
          </div>
          <div>
            <span className="text-xs font-mono text-ink-muted">Monospace Reference Token</span>
            <p className="font-mono text-sm text-oxblood">
              ACH-DfC6hNDTwrJ • IG Shortcode: DfC6hNDTwrJ • +91 8810530298
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Controls & Badges */}
      <section className="space-y-4">
        <h2 className="font-serif text-2xl text-ink">3. Buttons, Chips &amp; Status Badges</h2>
        <div className="p-6 sm:p-8 bg-ivory border border-ivory-border flex flex-wrap items-center gap-4">
          <button type="button" className="btn-luxury-primary text-xs">
            Primary WhatsApp CTA
          </button>
          <button type="button" className="btn-luxury-brass text-xs">
            Secondary Brass Action
          </button>
          <button type="button" className="btn-luxury-outline text-xs">
            Ghost Outline Action
          </button>
          <span className="px-3 py-1 bg-brass/20 border border-brass/40 text-ink text-xs font-medium">
            Price on request
          </span>
          <span className="px-3 py-1 bg-oxblood/10 text-oxblood font-mono text-xs font-semibold">
            ACH-DfC6hNDTwrJ
          </span>
        </div>
      </section>

      {/* Real Catalog Aspect Ratios */}
      <section className="space-y-4">
        <h2 className="font-serif text-2xl text-ink">
          4. Real Garment Media Treatments (9:16 Vertical Reel Cover Preservation)
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {sampleProducts.map((p) => {
            const img = p.images[0];
            return (
              <div key={p.id} className="space-y-2">
                <div className="overflow-hidden border border-ivory-border bg-ivory-warm">
                  <ProductImage
                    src={img?.publicPath}
                    alt={p.title}
                    shortcode={p.shortcode}
                  />
                </div>
                <p className="text-xs font-mono text-ink-muted">
                  {p.displayId} ({img?.width ?? 640}×{img?.height ?? 1136}px)
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
