import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { StoreProvider } from './features/store-context';
import { AppLayout } from './components/layout/AppLayout';
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { CollectionPage } from './pages/CollectionPage';
import { LookbookPage } from './pages/LookbookPage';
import { SearchPage } from './pages/SearchPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { WishlistPage } from './pages/WishlistPage';
import { EnquiryBagPage } from './pages/EnquiryBagPage';
import { CheckoutConceptPage } from './pages/CheckoutConceptPage';
import { WholesalePage } from './pages/WholesalePage';
import { OurStoryPage } from './pages/OurStoryPage';
import { ContactPage } from './pages/ContactPage';
import { FaqPage } from './pages/FaqPage';
import { DemoNoticePage, ReturnsPage, ShippingPage } from './pages/PolicyPages';
import { DesignSystemPage } from './pages/DesignSystemPage';
import { NotFoundPage } from './pages/NotFoundPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/collections" element={<Navigate to="/collections/embroidered-edit" replace />} />
        <Route path="/collections/:slug" element={<CollectionPage />} />
        <Route path="/lookbook" element={<LookbookPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/enquiry-bag" element={<EnquiryBagPage />} />
        <Route path="/bag" element={<Navigate to="/enquiry-bag" replace />} />
        <Route path="/checkout-concept" element={<CheckoutConceptPage />} />
        <Route path="/checkout" element={<CheckoutConceptPage />} />
        <Route path="/wholesale" element={<WholesalePage />} />
        <Route path="/our-story" element={<OurStoryPage />} />
        <Route path="/about" element={<OurStoryPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/shipping" element={<ShippingPage />} />
        <Route path="/returns" element={<ReturnsPage />} />
        <Route path="/demo-notice" element={<DemoNoticePage />} />
        <Route path="/design-system" element={<DesignSystemPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <StoreProvider>
        <AppRoutes />
      </StoreProvider>
    </BrowserRouter>
  );
};

export default App;
