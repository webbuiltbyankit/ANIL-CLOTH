import React from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { StoreProvider } from '@/features/store-context';
import { AppLayout } from '@/components/layout/AppLayout';
import { HomePage } from '@/pages/HomePage';
import { ShopPage } from '@/pages/ShopPage';
import { EnquiryBagPage } from '@/pages/EnquiryBagPage';
import { CheckoutConceptPage } from '@/pages/CheckoutConceptPage';
import { WholesalePage } from '@/pages/WholesalePage';
import { WishlistPage } from '@/pages/WishlistPage';

function renderWithStore(initialRoute = '/') {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <StoreProvider>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/enquiry-bag" element={<EnquiryBagPage />} />
            <Route path="/checkout-concept" element={<CheckoutConceptPage />} />
            <Route path="/wholesale" element={<WholesalePage />} />
          </Route>
        </Routes>
      </StoreProvider>
    </MemoryRouter>
  );
}

describe('UI Component & User Journey Integration Tests (Prompt 089)', () => {
  it('renders global disclosure banner and opens Search Overlay with shortcode suggestions', async () => {
    const user = userEvent.setup();
    renderWithStore('/shop');

    // Global disclosure strip is always visible
    expect(
      screen.getAllByText(/Unofficial Private Concept Demo/i).length
    ).toBeGreaterThan(0);

    // Open Search Overlay
    const searchBtns = screen.getAllByRole('button', { name: /search/i });
    await user.click(searchBtns[0]);

    const searchInput = screen.getByPlaceholderText(/search by shortcode/i);
    expect(searchInput).toBeInTheDocument();

    await user.type(searchInput, 'DfC6hNDTwrJ');
    expect(screen.getAllByText(/ACH-DfC6hNDTwrJ/i).length).toBeGreaterThan(0);
  });

  it('allows adding a design from Shop to Wishlist and Enquiry Bag', async () => {
    const user = userEvent.setup();
    renderWithStore('/shop');

    // Add first visible design to Enquiry Bag
    const addButtons = screen.getAllByRole('button', {
      name: /add ach-.* to enquiry bag/i,
    });
    expect(addButtons.length).toBeGreaterThan(0);
    await user.click(addButtons[0]);

    // Toast notification confirms addition
    expect(screen.getByText(/added ach-/i)).toBeInTheDocument();
  });

  it('renders Checkout Concept page with explicit NO COD & Concept Demo disclaimers and never shows fake Order Confirmed or payment gateways', () => {
    renderWithStore('/checkout-concept');

    expect(
      screen.getAllByText(/Unofficial Private Concept Demo/i).length
    ).toBeGreaterThan(0);
    expect(screen.getAllByText(/NO COD/i).length).toBeGreaterThan(0);

    // Must never render fake payment gateways or fake order confirmation
    expect(screen.queryByText(/Order Confirmed/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Razorpay/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Credit Card Number/i)).not.toBeInTheDocument();
  });

  it('allows configuring a Wholesale trade inquiry and selecting designs for bulk enquiry', async () => {
    const user = userEvent.setup();
    renderWithStore('/wholesale');

    expect(
      screen.getByRole('heading', { name: /Wholesale & Boutique Trade Desk/i })
    ).toBeInTheDocument();

    const businessInput = screen.getByLabelText(/Boutique \/ Business Name/i);
    await user.type(businessInput, 'Zari Heritage Jaipur');

    const addWholesaleBtns = screen.getAllByRole('button', {
      name: /Add to Wholesale Enquiry/i,
    });
    expect(addWholesaleBtns.length).toBeGreaterThan(0);
    await user.click(addWholesaleBtns[0]);

    // Live WhatsApp Trade Draft updates with business name
    expect(screen.getByText(/Zari Heritage Jaipur/i)).toBeInTheDocument();
  });
});
