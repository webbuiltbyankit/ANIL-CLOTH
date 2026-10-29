import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { CartEntry, EnquiryDraft, EnquiryIntent, ProductCandidate } from '@/types/catalog';
import { getAllSellableGarments, getCuratedGarments, getProductByIdOrShortcode } from '@/data/catalog-resolver';

const STORAGE_KEYS = {
  WISHLIST: 'ach_wishlist_v1',
  BAG: 'ach_enquiry_bag_v1',
  RECENTLY_VIEWED: 'ach_recently_viewed_v1',
  RECENT_SEARCHES: 'ach_recent_searches_v1',
  ENQUIRY_DRAFT: 'ach_enquiry_draft_v1',
  PRESENTATION_MODE: 'ach_presentation_mode_v1',
} as const;

export const MIN_ENQUIRY_QTY = 1;
export const MAX_ENQUIRY_QTY = 500;

export function clampQuantity(val: number): number {
  if (!Number.isFinite(val) || Number.isNaN(val)) return MIN_ENQUIRY_QTY;
  return Math.max(MIN_ENQUIRY_QTY, Math.min(MAX_ENQUIRY_QTY, Math.round(val)));
}

const DEFAULT_DRAFT: EnquiryDraft = {
  intent: 'personal',
  name: '',
  phoneOrEmail: '',
  cityCountry: '',
  businessName: '',
  buyerType: '',
  deliveryPreference: 'discuss_on_whatsapp',
  customNotes: '',
  acknowledgedNoCod: true,
};

function safeReadStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function safeWriteStorage(key: string, value: unknown): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage quota or private browsing errors gracefully
  }
}

export interface ToastItem {
  id: string;
  message: string;
  actionLabel?: string;
  actionHref?: string;
}

interface StoreContextValue {
  // Wishlist
  wishlistIds: string[];
  wishlistProducts: ProductCandidate[];
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  clearWishlist: () => void;

  // Enquiry Bag
  bagEntries: CartEntry[];
  bagItemsWithProduct: Array<{ entry: CartEntry; product: ProductCandidate }>;
  totalBagDesigns: number;
  totalBagUnits: number;
  isInBag: (productId: string) => boolean;
  addToBag: (productId: string, quantity?: number, note?: string) => void;
  updateBagQuantity: (productId: string, quantity: number) => void;
  updateBagNote: (productId: string, note: string) => void;
  removeFromBag: (productId: string) => void;
  clearBag: () => void;

  // Enquiry Draft & Intent
  enquiryDraft: EnquiryDraft;
  setEnquiryIntent: (intent: EnquiryIntent) => void;
  updateEnquiryDraft: (patch: Partial<EnquiryDraft>) => void;

  // Recently Viewed
  recentlyViewedIds: string[];
  recentlyViewedProducts: ProductCandidate[];
  recordProductView: (productId: string) => void;
  removeRecentlyViewed: (productId: string) => void;
  clearRecentlyViewed: () => void;

  // Recent Searches
  recentSearches: string[];
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;

  // Global UI Overlays
  quickViewProduct: ProductCandidate | null;
  openQuickView: (product: ProductCandidate) => void;
  closeQuickView: () => void;
  isSearchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
  isSourcingModalOpen: boolean;
  openSourcingModal: (defaultRole?: EnquiryIntent) => void;
  closeSourcingModal: () => void;
  isDemoTourOpen: boolean;
  openDemoTour: () => void;
  closeDemoTour: () => void;

  // Presentation Mode & Demo Utilities
  isPresentationMode: boolean;
  togglePresentationMode: () => void;
  loadShowcaseSampleState: () => void;
  clearAllDemoData: () => void;

  // Toasts
  toasts: ToastItem[];
  showToast: (message: string, actionLabel?: string, actionHref?: string) => void;
  dismissToast: (id: string) => void;
}

const StoreContext = createContext<StoreContextValue | null>(null);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const validIdsSet = useMemo(
    () => new Set(getAllSellableGarments().map((p) => p.id)),
    []
  );

  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    const saved = safeReadStorage<unknown>(STORAGE_KEYS.WISHLIST, []);
    if (!Array.isArray(saved)) return [];
    const unique = new Set<string>();
    for (const id of saved) {
      if (typeof id === 'string' && validIdsSet.has(id)) {
        unique.add(id);
      }
    }
    return Array.from(unique);
  });

  const [bagEntries, setBagEntries] = useState<CartEntry[]>(() => {
    const saved = safeReadStorage<unknown>(STORAGE_KEYS.BAG, []);
    if (!Array.isArray(saved)) return [];
    const map = new Map<string, CartEntry>();
    for (const raw of saved) {
      if (raw && typeof raw === 'object') {
        const r = raw as Record<string, unknown>;
        const pid = typeof r.productId === 'string' ? r.productId : '';
        const prod = getProductByIdOrShortcode(pid);
        if (prod && validIdsSet.has(prod.id)) {
          const qty = clampQuantity(typeof r.quantity === 'number' ? r.quantity : 1);
          map.set(prod.id, {
            productId: prod.id,
            shortcode: prod.shortcode,
            displayId: prod.displayId,
            quantity: qty,
            note: typeof r.note === 'string' ? r.note.slice(0, 200) : '',
            addedAt: typeof r.addedAt === 'string' ? r.addedAt : new Date().toISOString(),
          });
        }
      }
    }
    return Array.from(map.values());
  });

  const [enquiryDraft, setEnquiryDraft] = useState<EnquiryDraft>(() => {
    const saved = safeReadStorage<Partial<EnquiryDraft>>(STORAGE_KEYS.ENQUIRY_DRAFT, {});
    return {
      ...DEFAULT_DRAFT,
      ...(saved && typeof saved === 'object' ? saved : {}),
      intent: saved?.intent === 'wholesale' ? 'wholesale' : 'personal',
    };
  });

  const [recentlyViewedIds, setRecentlyViewedIds] = useState<string[]>(() => {
    const saved = safeReadStorage<unknown>(STORAGE_KEYS.RECENTLY_VIEWED, []);
    if (!Array.isArray(saved)) return [];
    return saved.filter((id): id is string => typeof id === 'string' && validIdsSet.has(id)).slice(0, 10);
  });

  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    const saved = safeReadStorage<unknown>(STORAGE_KEYS.RECENT_SEARCHES, []);
    if (!Array.isArray(saved)) return [];
    return saved.filter((s): s is string => typeof s === 'string' && s.trim().length > 0).slice(0, 6);
  });

  const [isPresentationMode, setIsPresentationMode] = useState<boolean>(() => {
    return Boolean(safeReadStorage<boolean>(STORAGE_KEYS.PRESENTATION_MODE, false));
  });

  const [quickViewProduct, setQuickViewProduct] = useState<ProductCandidate | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSourcingModalOpen, setIsSourcingModalOpen] = useState(false);
  const [isDemoTourOpen, setIsDemoTourOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  // Sync to localStorage
  useEffect(() => {
    safeWriteStorage(STORAGE_KEYS.WISHLIST, wishlistIds);
  }, [wishlistIds]);

  useEffect(() => {
    safeWriteStorage(STORAGE_KEYS.BAG, bagEntries);
  }, [bagEntries]);

  useEffect(() => {
    safeWriteStorage(STORAGE_KEYS.ENQUIRY_DRAFT, enquiryDraft);
  }, [enquiryDraft]);

  useEffect(() => {
    safeWriteStorage(STORAGE_KEYS.RECENTLY_VIEWED, recentlyViewedIds);
  }, [recentlyViewedIds]);

  useEffect(() => {
    safeWriteStorage(STORAGE_KEYS.RECENT_SEARCHES, recentSearches);
  }, [recentSearches]);

  useEffect(() => {
    safeWriteStorage(STORAGE_KEYS.PRESENTATION_MODE, isPresentationMode);
  }, [isPresentationMode]);

  const showToast = useCallback((message: string, actionLabel?: string, actionHref?: string) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    setToasts((prev) => [...prev.slice(-2), { id, message, actionLabel, actionHref }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Wishlist actions
  const isInWishlist = useCallback(
    (productId: string) => wishlistIds.includes(productId),
    [wishlistIds]
  );

  const toggleWishlist = useCallback(
    (productId: string) => {
      const prod = getProductByIdOrShortcode(productId);
      if (!prod) return;
      setWishlistIds((prev) => {
        const exists = prev.includes(prod.id);
        if (exists) {
          showToast(`Removed ${prod.displayId} from wishlist`);
          return prev.filter((id) => id !== prod.id);
        } else {
          showToast(`Saved ${prod.displayId} to wishlist`, 'View Wishlist', '/wishlist');
          return [prod.id, ...prev];
        }
      });
    },
    [showToast]
  );

  const removeFromWishlist = useCallback(
    (productId: string) => {
      setWishlistIds((prev) => prev.filter((id) => id !== productId));
      showToast('Removed from wishlist');
    },
    [showToast]
  );

  const clearWishlist = useCallback(() => {
    setWishlistIds([]);
    showToast('Cleared saved wishlist');
  }, [showToast]);

  // Bag actions
  const isInBag = useCallback(
    (productId: string) => bagEntries.some((e) => e.productId === productId),
    [bagEntries]
  );

  const addToBag = useCallback(
    (productId: string, quantity = 1, note = '') => {
      const prod = getProductByIdOrShortcode(productId);
      if (!prod) return;
      const safeQty = clampQuantity(quantity);
      setBagEntries((prev) => {
        const existingIndex = prev.findIndex((e) => e.productId === prod.id);
        if (existingIndex >= 0) {
          const updated = [...prev];
          const existing = updated[existingIndex];
          updated[existingIndex] = {
            ...existing,
            quantity: clampQuantity(existing.quantity + safeQty),
            note: note ? note.slice(0, 200) : existing.note,
          };
          return updated;
        }
        return [
          ...prev,
          {
            productId: prod.id,
            shortcode: prod.shortcode,
            displayId: prod.displayId,
            quantity: safeQty,
            note: note.slice(0, 200),
            addedAt: new Date().toISOString(),
          },
        ];
      });
      showToast(`Added ${prod.displayId} to Enquiry Bag`, 'Review Bag', '/bag');
    },
    [showToast]
  );

  const updateBagQuantity = useCallback((productId: string, quantity: number) => {
    const safeQty = clampQuantity(quantity);
    setBagEntries((prev) =>
      prev.map((e) => (e.productId === productId ? { ...e, quantity: safeQty } : e))
    );
  }, []);

  const updateBagNote = useCallback((productId: string, note: string) => {
    setBagEntries((prev) =>
      prev.map((e) => (e.productId === productId ? { ...e, note: note.slice(0, 200) } : e))
    );
  }, []);

  const removeFromBag = useCallback(
    (productId: string) => {
      setBagEntries((prev) => prev.filter((e) => e.productId !== productId));
      showToast('Removed design from Enquiry Bag');
    },
    [showToast]
  );

  const clearBag = useCallback(() => {
    setBagEntries([]);
    showToast('Cleared Enquiry Bag');
  }, [showToast]);

  // Enquiry Draft
  const setEnquiryIntent = useCallback((intent: EnquiryIntent) => {
    setEnquiryDraft((prev) => ({ ...prev, intent }));
  }, []);

  const updateEnquiryDraft = useCallback((patch: Partial<EnquiryDraft>) => {
    setEnquiryDraft((prev) => ({ ...prev, ...patch }));
  }, []);

  // Recently Viewed
  const recordProductView = useCallback((productId: string) => {
    const prod = getProductByIdOrShortcode(productId);
    if (!prod) return;
    setRecentlyViewedIds((prev) => {
      const filtered = prev.filter((id) => id !== prod.id);
      return [prod.id, ...filtered].slice(0, 10);
    });
  }, []);

  const removeRecentlyViewed = useCallback((productId: string) => {
    setRecentlyViewedIds((prev) => prev.filter((id) => id !== productId));
  }, []);

  const clearRecentlyViewed = useCallback(() => {
    setRecentlyViewedIds([]);
  }, []);

  // Recent searches
  const addRecentSearch = useCallback((query: string) => {
    const clean = query.trim().slice(0, 60);
    if (!clean) return;
    setRecentSearches((prev) => {
      const filtered = prev.filter((q) => q.toLowerCase() !== clean.toLowerCase());
      return [clean, ...filtered].slice(0, 6);
    });
  }, []);

  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
  }, []);

  // Overlays
  const openQuickView = useCallback((product: ProductCandidate) => {
    setQuickViewProduct(product);
  }, []);

  const closeQuickView = useCallback(() => {
    setQuickViewProduct(null);
  }, []);

  const openSearch = useCallback(() => setIsSearchOpen(true), []);
  const closeSearch = useCallback(() => setIsSearchOpen(false), []);

  const openSourcingModal = useCallback((defaultRole?: EnquiryIntent) => {
    if (defaultRole) {
      setEnquiryDraft((prev) => ({ ...prev, intent: defaultRole }));
    }
    setIsSourcingModalOpen(true);
  }, []);
  const closeSourcingModal = useCallback(() => setIsSourcingModalOpen(false), []);

  const openDemoTour = useCallback(() => setIsDemoTourOpen(true), []);
  const closeDemoTour = useCallback(() => setIsDemoTourOpen(false), []);

  const togglePresentationMode = useCallback(() => {
    setIsPresentationMode((prev) => {
      const next = !prev;
      showToast(
        next
          ? 'Presentation Mode enabled (technical annotations hidden; demo disclosure preserved)'
          : 'Presentation Mode disabled (all technical annotations visible)'
      );
      return next;
    });
  }, [showToast]);

  const loadShowcaseSampleState = useCallback(() => {
    const curated = getCuratedGarments();
    const sampleWishlist = curated.slice(0, 4).map((p) => p.id);
    const sampleBag: CartEntry[] = curated.slice(0, 3).map((p, idx) => ({
      productId: p.id,
      shortcode: p.shortcode,
      displayId: p.displayId,
      quantity: idx === 0 ? 2 : 1,
      note: idx === 0 ? 'Interested in available colour options & blouse sizing' : '',
      addedAt: new Date().toISOString(),
    }));
    setWishlistIds(sampleWishlist);
    setBagEntries(sampleBag);
    setRecentlyViewedIds(curated.slice(0, 5).map((p) => p.id));
    showToast('Loaded curated showcase sample shortlist & enquiry bag');
  }, [showToast]);

  const clearAllDemoData = useCallback(() => {
    setWishlistIds([]);
    setBagEntries([]);
    setRecentlyViewedIds([]);
    setRecentSearches([]);
    setEnquiryDraft(DEFAULT_DRAFT);
    setIsPresentationMode(false);
    if (typeof window !== 'undefined') {
      try {
        Object.values(STORAGE_KEYS).forEach((k) => window.localStorage.removeItem(k));
      } catch {
        // ignore
      }
    }
    showToast('Cleared all local browser demo data (wishlist, bag, recent views & drafts)');
  }, [showToast]);

  // Derived selectors
  const wishlistProducts = useMemo(
    () =>
      wishlistIds
        .map((id) => getProductByIdOrShortcode(id))
        .filter((p): p is ProductCandidate => p !== undefined),
    [wishlistIds]
  );

  const bagItemsWithProduct = useMemo(
    () =>
      bagEntries
        .map((entry) => {
          const product = getProductByIdOrShortcode(entry.productId);
          return product ? { entry, product } : null;
        })
        .filter((item): item is { entry: CartEntry; product: ProductCandidate } => item !== null),
    [bagEntries]
  );

  const totalBagDesigns = bagItemsWithProduct.length;
  const totalBagUnits = useMemo(
    () => bagItemsWithProduct.reduce((sum, item) => sum + item.entry.quantity, 0),
    [bagItemsWithProduct]
  );

  const recentlyViewedProducts = useMemo(
    () =>
      recentlyViewedIds
        .map((id) => getProductByIdOrShortcode(id))
        .filter((p): p is ProductCandidate => p !== undefined),
    [recentlyViewedIds]
  );

  const value: StoreContextValue = {
    wishlistIds,
    wishlistProducts,
    isInWishlist,
    toggleWishlist,
    removeFromWishlist,
    clearWishlist,
    bagEntries,
    bagItemsWithProduct,
    totalBagDesigns,
    totalBagUnits,
    isInBag,
    addToBag,
    updateBagQuantity,
    updateBagNote,
    removeFromBag,
    clearBag,
    enquiryDraft,
    setEnquiryIntent,
    updateEnquiryDraft,
    recentlyViewedIds,
    recentlyViewedProducts,
    recordProductView,
    removeRecentlyViewed,
    clearRecentlyViewed,
    recentSearches,
    addRecentSearch,
    clearRecentSearches,
    quickViewProduct,
    openQuickView,
    closeQuickView,
    isSearchOpen,
    openSearch,
    closeSearch,
    isSourcingModalOpen,
    openSourcingModal,
    closeSourcingModal,
    isDemoTourOpen,
    openDemoTour,
    closeDemoTour,
    isPresentationMode,
    togglePresentationMode,
    loadShowcaseSampleState,
    clearAllDemoData,
    toasts,
    showToast,
    dismissToast,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
};

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext);
  if (!ctx) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return ctx;
}

