import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Compass, Search } from 'lucide-react';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';

export const NotFoundPage: React.FC = () => {
  useDocumentMeta({
    title: 'Page Not Found (404)',
    description: 'The requested page or garment route could not be found.',
  });

  return (
    <div className="editorial-container max-w-3xl py-20 text-center">
      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-oxblood/10 text-oxblood text-xs font-mono uppercase tracking-widest mb-4">
        404 • Route Not Found
      </span>
      <h1 className="font-serif text-3xl sm:text-5xl text-ink mb-3">
        This Archive Page Could Not Be Found
      </h1>
      <p className="text-sm sm:text-base text-ink-muted max-w-xl mx-auto mb-8">
        The link you followed may refer to an older shortcode or a page that has moved. Explore our
        97 verified ethnic wear designs or search by `ACH-` reference code below.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link to="/" className="btn-luxury-primary text-xs">
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>Return to Homepage</span>
        </Link>
        <Link to="/shop" className="btn-luxury-secondary text-xs">
          <Compass className="w-4 h-4" aria-hidden="true" />
          <span>Browse All 97 Designs</span>
        </Link>
        <Link to="/search" className="btn-luxury-outline text-xs">
          <Search className="w-4 h-4" aria-hidden="true" />
          <span>Search by ACH Code</span>
        </Link>
      </div>
    </div>
  );
};
