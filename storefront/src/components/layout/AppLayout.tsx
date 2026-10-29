import React, { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { ArrowUp, X } from 'lucide-react';
import { GlobalHeader } from './GlobalHeader';
import { GlobalFooter } from './GlobalFooter';
import { SearchOverlay } from './SearchOverlay';
import { QuickViewModal } from '@/components/commerce/QuickViewModal';
import { SourcingModal } from '@/components/commerce/SourcingModal';
import { DemoTourModal } from '@/components/commerce/DemoTourModal';
import { useStore } from '@/features/store-context';

export const ToastViewport: React.FC = () => {
  const { toasts, dismissToast } = useStore();

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="fixed bottom-20 lg:bottom-6 right-4 z-50 flex flex-col gap-2 max-w-sm w-[calc(100vw-2rem)] pointer-events-none"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto bg-oxblood-deep text-ivory border border-brass-light/40 shadow-xl px-4 py-3 flex items-center justify-between gap-3 text-xs sm:text-sm"
          role="status"
        >
          <span className="leading-snug">{toast.message}</span>
          <div className="flex items-center gap-2 shrink-0">
            {toast.actionLabel && toast.actionHref && (
              <Link
                to={toast.actionHref}
                onClick={() => dismissToast(toast.id)}
                className="text-brass-light font-semibold underline underline-offset-2 whitespace-nowrap"
              >
                {toast.actionLabel}
              </Link>
            )}
            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              aria-label="Dismiss notification"
              className="p-1 text-ivory/70 hover:text-ivory"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export const AppLayout: React.FC = () => {
  const location = useLocation();
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Scroll restoration on route change (Prompt 010)
  useEffect(() => {
    if (location.hash) {
      const targetId = location.hash.replace('#', '');
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }, [location.pathname, location.hash]);

  useEffect(() => {
    const onScroll = () => {
      setShowBackToTop(window.scrollY > 450);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-ivory text-ink">
      {/* Accessible Skip Link (Prompt 081) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-oxblood focus:text-ivory focus:text-sm focus:font-semibold"
      >
        Skip to main content
      </a>

      <GlobalHeader />

      <main id="main-content" className="flex-1 focus:outline-none" tabIndex={-1}>
        <Outlet />
      </main>

      <GlobalFooter />

      {/* Accessible Back-to-Top Control */}
      {showBackToTop && (
        <button
          type="button"
          onClick={handleBackToTop}
          aria-label="Scroll back to top"
          className="fixed bottom-20 lg:bottom-6 left-4 z-30 w-11 h-11 bg-oxblood/90 hover:bg-oxblood text-ivory border border-brass-light/40 shadow-lg inline-flex items-center justify-center transition-colors"
        >
          <ArrowUp className="w-4 h-4 text-brass-light" aria-hidden="true" />
        </button>
      )}

      {/* Global Overlays */}
      <SearchOverlay />
      <QuickViewModal />
      <SourcingModal />
      <DemoTourModal />
      <ToastViewport />
    </div>
  );
};
