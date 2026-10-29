# Known Limitations & Post-Demo Production Roadmap (Prompt 099)

## 1. Intentional Concept Demo Boundaries
1. **Frontend-Only Architecture (No Backend / No Live Payment Gateway)**:
   - By design, this prototype does not process credit cards, UPI, Razorpay, or Stripe payments, nor does it display a fake `"Order Confirmed"` screen. All enquiries hand off to **ANIL CLOTH HOUSE** on WhatsApp (`+91 8810530298`).
2. **Price-on-Request Dataset**:
   - Because structured retail/wholesale prices are `null` across `products.json`, the storefront displays `"Price on request"` and prompts buyers to confirm current single-piece vs. bulk lot pricing on WhatsApp.
3. **Static Snapshot Archive (29 Oct 2026)**:
   - The catalog reflects the 100-post local extraction snapshot (`97` media-backed Reels, `1` policy graphic, `2` excluded missing `.webp` posts) and does not pull live posts from the Instagram Graph API at runtime.
4. **Profile Picture Resolution (`100×100px`)**:
   - `profile_picture.jpg` is a 100×100px image of the store's visiting card (`Adinya® By Anil Cloth House`). It is rendered only at small thumbnail dimensions (`≤72px`) while the header uses a sharp typographic wordmark until a vector logo is supplied.

## 2. Recommended Next Steps After Owner Sign-Off
- Complete the 8-point **Owner Content Checklist** (`docs/owner-content-checklist.md`) and update `src/data/owner-review.ts`.
- Optional Phase 2 production enhancements: CMS/spreadsheet sync for live pricing and stock status, official custom domain setup, and removal of `noindex, nofollow` once approved by the store owner.

