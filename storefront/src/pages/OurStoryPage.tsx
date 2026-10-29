import React from 'react';
import { Link } from 'react-router-dom';
import {
  Award,
  Building,
  CheckCircle2,
  FileQuestion,
  Globe,
  MessageCircle,
  Sparkles,
} from 'lucide-react';
import { BUSINESS_FACTS } from '@/data/business-facts';
import { OWNER_REVIEW_CONFIG } from '@/data/owner-review';
import { getStoreNoticePost } from '@/data/catalog-resolver';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';

export const OurStoryPage: React.FC = () => {
  useDocumentMeta({
    title: 'Our Story & Showroom Provenance',
    description:
      'Sourced brand profile and NIT Faridabad showroom heritage for ANIL CLOTH HOUSE (@anil_cloth_house_official).',
  });

  const noticePost = getStoreNoticePost();
  const noticeImage = noticePost?.images[0]?.publicPath;

  const pendingItems = Object.entries(BUSINESS_FACTS.needsOwnerConfirmation);

  return (
    <div className="pb-20">
      {/* Editorial Hero */}
      <section className="bg-ivory-warm border-b border-ivory-border py-14 sm:py-20">
        <div className="editorial-container text-center max-w-4xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-oxblood/10 text-oxblood text-xs font-semibold uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Verified Source Profile • NIT Faridabad, Delhi NCR</span>
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl text-ink leading-tight mb-4">
            {BUSINESS_FACTS.verifiedFromSuppliedFiles.brandName}
          </h1>
          <p className="text-base sm:text-lg text-ink-muted max-w-2xl mx-auto leading-relaxed">
            Positioned in public showroom records as a{' '}
            <strong className="text-ink font-medium">
              &ldquo;{BUSINESS_FACTS.verifiedFromSuppliedFiles.positioningHeadline}&rdquo;
            </strong>{' '}
            and{' '}
            <strong className="text-ink font-medium">
              &ldquo;{BUSINESS_FACTS.verifiedFromSuppliedFiles.captionPositioning}&rdquo;
            </strong>
            , serving boutique buyers and personal shoppers from NIT Faridabad across India and
            worldwide via direct WhatsApp consultation.
          </p>
        </div>
      </section>

      {/* Sourced Identity & Provenance Cards */}
      <section className="editorial-container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-7 space-y-6">
            <h2 className="font-serif text-2xl sm:text-3xl text-ink">
              Showroom Heritage &amp; Direct-to-Buyer Model
            </h2>
            <p className="text-sm sm:text-base text-ink/85 leading-relaxed">
              Every garment featured in this digital lookbook originates from the official Instagram
              archive of{' '}
              <span className="font-mono text-oxblood">
                {BUSINESS_FACTS.verifiedFromSuppliedFiles.instagramHandle}
              </span>{' '}
              ({BUSINESS_FACTS.verifiedFromSuppliedFiles.snapshotMetrics.followersCount.toLocaleString()}{' '}
              followers,{' '}
              {BUSINESS_FACTS.verifiedFromSuppliedFiles.snapshotMetrics.postCount.toLocaleString()}{' '}
              public posts as of{' '}
              {BUSINESS_FACTS.verifiedFromSuppliedFiles.snapshotMetrics.capturedDateLabel}). Rather
              than operating an anonymous cart checkout, the showroom conducts all sizing, fabric,
              and bulk lot consultations directly over WhatsApp at{' '}
              <strong>{BUSINESS_FACTS.verifiedFromSuppliedFiles.whatsappDisplay}</strong>.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-5 bg-ivory border border-ivory-border">
                <Building className="w-5 h-5 text-oxblood mb-2" aria-hidden="true" />
                <h3 className="font-serif text-lg text-ink mb-1">
                  Visiting Card Identity
                </h3>
                <p className="text-xs text-ink-muted leading-relaxed">
                  {OWNER_REVIEW_CONFIG.subBrandLabel}. The visiting card lists{' '}
                  <strong>{OWNER_REVIEW_CONFIG.confirmedStoreAddress.visitingCardLine}</strong>.
                </p>
              </div>

              <div className="p-5 bg-ivory border border-ivory-border">
                <Globe className="w-5 h-5 text-oxblood mb-2" aria-hidden="true" />
                <h3 className="font-serif text-lg text-ink mb-1">
                  Delhi NCR to Worldwide
                </h3>
                <p className="text-xs text-ink-muted leading-relaxed">
                  Repeatedly affirmed across public post captions: physical showroom at{' '}
                  <strong>{BUSINESS_FACTS.verifiedFromSuppliedFiles.addressCaption}</strong> with{' '}
                  <strong>{BUSINESS_FACTS.verifiedFromSuppliedFiles.statedShippingClaim}</strong>.
                </p>
              </div>
            </div>

            {/* Verified Facts Table */}
            <div className="bg-ivory border border-ivory-border p-6 mt-6">
              <div className="flex items-center gap-2 text-oxblood text-xs font-semibold uppercase tracking-wider mb-4">
                <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                <span>Verified Facts From Supplied Store Archive</span>
              </div>
              <dl className="divide-y divide-ivory-border text-xs sm:text-sm">
                <div className="py-2.5 flex flex-col sm:flex-row sm:justify-between gap-1">
                  <dt className="text-ink-muted">Store Name</dt>
                  <dd className="font-medium text-ink">
                    {BUSINESS_FACTS.verifiedFromSuppliedFiles.brandName}
                  </dd>
                </div>
                <div className="py-2.5 flex flex-col sm:flex-row sm:justify-between gap-1">
                  <dt className="text-ink-muted">Public Bio Statement</dt>
                  <dd className="font-medium text-ink">
                    {BUSINESS_FACTS.verifiedFromSuppliedFiles.positioningHeadline}
                  </dd>
                </div>
                <div className="py-2.5 flex flex-col sm:flex-row sm:justify-between gap-1">
                  <dt className="text-ink-muted">Caption Address</dt>
                  <dd className="font-medium text-ink">
                    {BUSINESS_FACTS.verifiedFromSuppliedFiles.addressCaption}
                  </dd>
                </div>
                <div className="py-2.5 flex flex-col sm:flex-row sm:justify-between gap-1">
                  <dt className="text-ink-muted">Ordering Channel</dt>
                  <dd className="font-medium text-ink">
                    WhatsApp {BUSINESS_FACTS.verifiedFromSuppliedFiles.whatsappDisplay}
                  </dd>
                </div>
                <div className="py-2.5 flex flex-col sm:flex-row sm:justify-between gap-1">
                  <dt className="text-ink-muted">Explicit Ordering Rules</dt>
                  <dd className="font-medium text-oxblood">
                    {BUSINESS_FACTS.verifiedFromSuppliedFiles.noCodPolicy} • We do not hold items
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Right 5 cols: Archival Provenance Exhibits */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-ivory-warm border border-ivory-border p-5">
              <span className="text-[11px] uppercase tracking-widest text-oxblood font-semibold">
                Archival Exhibit A • Visiting Card Emblem
              </span>
              <div className="mt-3 flex items-center gap-4 bg-ivory p-4 border border-ivory-border">
                <img
                  src="/media/images/profile_picture.jpg"
                  alt="Adinya by Anil Cloth House visiting card thumbnail"
                  width={72}
                  height={72}
                  className="w-16 h-16 object-cover border border-ivory-border shrink-0"
                />
                <div className="text-xs">
                  <p className="font-serif text-sm text-ink font-semibold">
                    Adinya® By Anil Cloth House
                  </p>
                  <p className="text-ink-muted mt-0.5">
                    Original 100×100px profile picture asset (`profile_picture.jpg`). Preserved at
                    true resolution without artificial upscaling.
                  </p>
                </div>
              </div>
            </div>

            {noticePost && noticeImage && (
              <div className="bg-ivory-warm border border-ivory-border p-5">
                <span className="text-[11px] uppercase tracking-widest text-oxblood font-semibold">
                  Archival Exhibit B • Official Ordering Policy Card ({noticePost.shortcode})
                </span>
                <div className="mt-3 overflow-hidden border border-ivory-border bg-ivory">
                  <img
                    src={noticeImage}
                    alt="Store Ordering Policy Notice Graphic C_pknaLv-Hc"
                    className="w-full h-auto object-contain max-h-72 bg-oxblood-deep"
                  />
                  <div className="p-3.5 text-xs text-ink-muted">
                    <p className="font-medium text-ink mb-1">
                      Why this post is shown here instead of the Shop grid:
                    </p>
                    <p>
                      Post <code className="text-oxblood">{noticePost.shortcode}</code> is an
                      official text notice card stating{' '}
                      <em>
                        &ldquo;#To order / Watsapp on: +91-8810530298 / #No DM&apos;s# No COD / We
                        do not hold items&rdquo;
                      </em>
                      . Our catalog pipeline separates it from wearable garments and surfaces it here
                      as primary policy provenance.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Brand Details Pending Owner Confirmation */}
      <section className="editorial-container pt-4">
        <div className="bg-ivory border border-brass/40 p-6 sm:p-8">
          <div className="flex items-center gap-2 text-ink font-serif text-xl mb-2">
            <FileQuestion className="w-5 h-5 text-oxblood" aria-hidden="true" />
            <h2>Brand Details Pending Store Owner Confirmation</h2>
          </div>
          <p className="text-xs sm:text-sm text-ink-muted mb-5">
            In strict compliance with our truth-first architecture, we do not invent founding years,
            factory headcount, or unverified legal policies. The following items are reserved for
            store owner confirmation before a public production launch:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {pendingItems.map(([key, note]) => (
              <div
                key={key}
                className="p-3.5 bg-ivory-warm border border-ivory-border text-xs"
              >
                <p className="font-semibold text-ink uppercase tracking-wider text-[11px]">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </p>
                <p className="text-ink-muted mt-1">{note}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-5 border-t border-ivory-border flex flex-wrap items-center justify-between gap-4">
            <p className="text-xs text-ink-muted">
              Concept Notice: {BUSINESS_FACTS.demoOnly.conceptLabel}
            </p>
            <div className="flex items-center gap-3">
              <Link to="/contact" className="btn-luxury-primary text-xs">
                <MessageCircle className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Contact Showroom</span>
              </Link>
              <Link to="/shop?archive=all" className="btn-luxury-outline text-xs">
                <Award className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Explore 97 Archival Designs</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
