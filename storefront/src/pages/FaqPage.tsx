import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, HelpCircle, MessageCircle } from 'lucide-react';
import { BUSINESS_FACTS } from '@/data/business-facts';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';

interface FaqItem {
  id: string;
  category: 'Ordering' | 'Prices' | 'Wholesale' | 'Shipping' | 'Returns';
  question: string;
  answer: string;
  statusTag: 'Verified Store Rule' | 'Pending Owner Confirmation';
}

const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'ord-1',
    category: 'Ordering',
    question: 'How do I place an order for an outfit shown in the catalog?',
    answer: `All orders are handled directly via WhatsApp at ${BUSINESS_FACTS.verifiedFromSuppliedFiles.whatsappDisplay}. Add your favourite designs to your Enquiry Bag on this website and click "Send on WhatsApp" to share the exact ACH design codes and Instagram shortcodes with the showroom team.`,
    statusTag: 'Verified Store Rule',
  },
  {
    id: 'ord-2',
    category: 'Ordering',
    question: 'Can I place an order via Instagram DM or Cash on Delivery (COD)?',
    answer:
      'No. The store explicitly states "NO DM\'S NO COD" and "We do not hold items" across its public profile and ordering notice card (post C_pknaLv-Hc). All bookings require direct WhatsApp confirmation and prepaid payment.',
    statusTag: 'Verified Store Rule',
  },
  {
    id: 'prc-1',
    category: 'Prices',
    question: 'Why do items show "Price on request" instead of fixed cart prices?',
    answer:
      'Because the public Instagram archive does not publish structured retail prices in post captions, this storefront never invents fake numbers. Where an original Reel cover graphic includes an embedded wholesale rate sticker, we surface that note transparently and prompt you to confirm current lot or single-piece pricing on WhatsApp.',
    statusTag: 'Verified Store Rule',
  },
  {
    id: 'ws-1',
    category: 'Wholesale',
    question: 'Do you supply boutiques, resellers, and bulk trade buyers?',
    answer:
      'Yes. ANIL CLOTH HOUSE is a Manufacturer and Wholesaler of Trending Ethnic Wear based in NIT Faridabad, Delhi NCR. Use our dedicated Wholesale page to configure a multi-design trade inquiry with your boutique name, city/country, and approximate lot quantity.',
    statusTag: 'Verified Store Rule',
  },
  {
    id: 'ws-2',
    category: 'Wholesale',
    question: 'What is the minimum order quantity (MOQ) for wholesale buyers?',
    answer:
      'Exact minimum order quantities and set-wise size ratios vary by design lot and are confirmed directly by the showroom on WhatsApp. We do not publish unverified MOQ slabs on this concept storefront.',
    statusTag: 'Pending Owner Confirmation',
  },
  {
    id: 'shp-1',
    category: 'Shipping',
    question: 'Do you ship outside Delhi NCR and internationally?',
    answer:
      'Yes — the store profile explicitly highlights "Worldwide shipping". Courier partners, transit timelines, and shipping charges depend on your destination pin code or country and are quoted directly on WhatsApp before dispatch.',
    statusTag: 'Verified Store Rule',
  },
  {
    id: 'ret-1',
    category: 'Returns',
    question: 'What is your return, exchange, or alteration policy?',
    answer:
      'Public Instagram records state "We do not hold items" and "NO COD", but do not publish a formal written return or exchange policy document. Before completing payment on WhatsApp, please ask the showroom to confirm their policy on transit damage, parcel-opening video requirements, or size exchanges.',
    statusTag: 'Pending Owner Confirmation',
  },
];

const CATEGORIES: FaqItem['category'][] = [
  'Ordering',
  'Prices',
  'Wholesale',
  'Shipping',
  'Returns',
];

export const FaqPage: React.FC = () => {
  useDocumentMeta({
    title: 'Frequently Asked Questions',
    description:
      'Answers about WhatsApp ordering, price-on-request transparency, wholesale inquiries, worldwide shipping, and store rules for ANIL CLOTH HOUSE.',
  });

  const [activeCategory, setActiveCategory] = useState<FaqItem['category'] | 'All'>('All');
  const [openIds, setOpenIds] = useState<string[]>(['ord-1', 'prc-1']);

  const toggleItem = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const visibleItems =
    activeCategory === 'All'
      ? FAQ_ITEMS
      : FAQ_ITEMS.filter((item) => item.category === activeCategory);

  return (
    <div className="pb-20">
      <section className="bg-ivory-warm border-b border-ivory-border py-12 sm:py-16">
        <div className="editorial-container max-w-4xl text-center">
          <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-oxblood font-semibold">
            <HelpCircle className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Transparent Buyer Guide</span>
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl text-ink mt-2 mb-3">
            Frequently Asked Questions
          </h1>
          <p className="text-sm sm:text-base text-ink-muted max-w-2xl mx-auto">
            Grouped into Ordering, Prices, Wholesale, Shipping, and Returns — clearly distinguishing
            verified showroom rules from details confirmed individually on WhatsApp.
          </p>
        </div>
      </section>

      <section className="editorial-container max-w-4xl py-10">
        {/* Category Filter Pills */}
        <div
          role="tablist"
          aria-label="FAQ Categories"
          className="flex flex-wrap items-center justify-center gap-2 mb-8"
        >
          {(['All', ...CATEGORIES] as const).map((cat) => (
            <button
              key={cat}
              role="tab"
              aria-selected={activeCategory === cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 text-xs font-medium transition-colors ${
                activeCategory === cat
                  ? 'bg-oxblood text-ivory'
                  : 'bg-ivory-warm text-ink hover:bg-ivory-stone border border-ivory-border'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Accessible Accordion */}
        <div className="space-y-3">
          {visibleItems.map((item) => {
            const isOpen = openIds.includes(item.id);
            return (
              <div
                key={item.id}
                className="border border-ivory-border bg-ivory overflow-hidden"
              >
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${item.id}`}
                    id={`faq-trigger-${item.id}`}
                    onClick={() => toggleItem(item.id)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 hover:bg-ivory-warm/50 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-oxblood">
                          {item.category}
                        </span>
                        <span
                          className={`text-[10px] px-2 py-0.5 font-medium ${
                            item.statusTag === 'Verified Store Rule'
                              ? 'bg-emerald-900/10 text-emerald-800'
                              : 'bg-brass/20 text-ink'
                          }`}
                        >
                          {item.statusTag}
                        </span>
                      </div>
                      <p className="font-serif text-lg text-ink">{item.question}</p>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-ink-muted shrink-0 transition-transform ${
                        isOpen ? 'rotate-180 text-oxblood' : ''
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                </h3>
                {isOpen && (
                  <div
                    id={`faq-panel-${item.id}`}
                    role="region"
                    aria-labelledby={`faq-trigger-${item.id}`}
                    className="px-6 pb-5 pt-2 text-sm text-ink-muted leading-relaxed border-t border-ivory-border"
                  >
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-10 p-6 bg-ivory-warm border border-ivory-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-xl text-ink">
              Still have a question about a specific design?
            </h2>
            <p className="text-xs text-ink-muted mt-1">
              Message the NIT Faridabad showroom directly on WhatsApp with your `ACH-` code.
            </p>
          </div>
          <Link to="/contact" className="btn-luxury-primary text-xs shrink-0">
            <MessageCircle className="w-4 h-4" aria-hidden="true" />
            <span>Ask on WhatsApp</span>
          </Link>
        </div>
      </section>
    </div>
  );
};
