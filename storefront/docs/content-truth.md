# Source-of-Truth Facts Registry (`Prompt 002`)

Every public-facing business claim displayed in the **ANIL CLOTH HOUSE** storefront concept is traced to a specific supplied file inside `anil_cloth_house/info about shop/` and `anil_cloth_house/image/`.

## 1. Verified From Supplied Files (`verifiedFromSuppliedFiles`)

| Fact Field | Value | Source File & Field |
| :--- | :--- | :--- |
| **Display Name** | `ANIL CLOTH HOUSE` | `info about shop/profile.json` → `display_name` |
| **Instagram Username** | `@anil_cloth_house_official` | `info about shop/profile.json` → `username` |
| **Instagram Profile URL** | `https://www.instagram.com/anil_cloth_house_official/` | `info about shop/profile.json` → `profile_url` |
| **Primary WhatsApp / Phone** | `+91 8810530298` (`918810530298`) | `info about shop/profile.json` → `business_phone` & post captions |
| **Positioning (Bio)** | `Manufacturer and wholesaler • CLOTHING BRAND` | `info about shop/profile.json` → `biography` |
| **Positioning (Captions)** | `Export and Manufacturing ethnic wear store` | `info about shop/posts.json` → 64 post captions |
| **Ordering Policy** | `NO DM'S NO COD` (No Cash on Delivery; order via WhatsApp) | `info about shop/profile.json` → `biography` & `C_pknaLv-Hc.jpg` |
| **Hold Policy** | `We do not hold items; instant confirmation required` | `image/C_pknaLv-Hc.jpg` feed notice post |
| **Stated Shipping Claim** | `Worldwide shipping` (destinations, rates & timing require store confirmation) | `info about shop/profile.json` → `biography` |
| **Bio Address Wording** | `Delhi, 1k/6a NIT. Faridabad` | `info about shop/profile.json` → `business_address` |
| **Caption Address Wording** | `Plot no. 1k/6a NIT Faridabad 121001, Haryana, Delhi NCR` | `info about shop/posts.json` → 64 post captions |
| **Profile Card Sub-brand & Landmark** | `Adinya® By Anil Cloth House — Shop No. 1K/6A, Near Kalyan Singh Chowk, N.I.T. Faridabad, Haryana - 121001` | `image/profile_picture.jpg` visual business card |
| **External Video Links** | `https://youtu.be/-Cdm4guXk6c?si=m_GSuOiOfBdPAxvq`, `https://youtu.be/SK99PSCye0w?si=fdz9VUUGwffsOXSp` | `info about shop/business_summary.md` & `posts.json` (`DfC4sHlzyUc`, `Deyf5s_TRef`, `Deyc2NdTy14`) |
| **Snapshot Public Stats** | `8,972 Followers • 19 Following • 2,055 Posts` *(Snapshot captured 29 Oct 2026; never presented as live/timeless)* | `info about shop/profile.json` → `followers_count`, `post_count`, `extracted_at` |

## 2. Needs Owner Confirmation (`needsOwnerConfirmation`)

These attributes are either absent from the public JSON metadata, vary slightly across captions/business-card imagery, or appear only as on-image Reel text overlays:

1. **Official High-Resolution Brand Logo & Sub-brand (`Adinya®`) Usage**: `profile_picture.jpg` is 100×100 px and shows `Adinya® By Anil Cloth House`. We use a refined typographic wordmark (`ANIL CLOTH HOUSE`) until vector artwork is supplied.
2. **Confirmed Retail vs. Wholesale Pricing**: JSON records have `explicit_price: null`. While Reel covers show baked-in graphic text such as `Wholesale rate ₹2495`, final current prices for single-piece vs. bulk orders must be confirmed directly on WhatsApp.
3. **Minimum Order Quantity (MOQ) & Trade Terms**: Not stated in bio or captions; must be confirmed with the store.
4. **Available Sizes, Custom Alterations & Color Variants**: Some Reel covers mention `2 colours shown` / `4 colours shown` on-image, but current stock and size grading require confirmation.
5. **Fabric Composition & Craftsmanship Specifications**: Visuals show heavy sequin, bead, stone, pearl, cutdana, and zari-style embroidery on blouses, lehengas, and draped sarees, but exact base fabrics (e.g., georgette, organza, tissue, silk blend) are not stated in captions.
6. **Shipping Charges, Eligible Countries, Couriers & Dispatch Lead Times**: Bio states `Worldwide shipping`, but rates and timelines are unconfirmed.
7. **Returns, Exchanges, Defective-Item Claims & Opening Hours**: Not stated in public metadata.
8. **Exact Map Pin & Alternate Phone Numbers**: `profile_picture.jpg` shows secondary numbers (`9654362825`, `9582451288`) and GSTIN at low resolution; only `+91 8810530298` is verified in structured text.

## 3. Demo-Only Prototype Elements (`demoOnly`)

- **Display Reference IDs (`ACH-<shortcode>`)**: Deterministically generated from Instagram post shortcodes (e.g., `ACH-DfC6hNDTwrJ`) so buyers and staff can reference specific designs cleanly.
- **Editorial Collections (`The Embroidered Edit`, `Festive Selections`, `Statement Details`, `Draped & Cape Silhouettes`)**: Visually curated merchandising groupings for browsing convenience, not confirmed store SKU departments.
- **Enquiry Bag & 4-Step Order Enquiry / Checkout Concept**: Client-side preparation tools that compose a structured WhatsApp message; no backend order, inventory reservation, or payment processing exists.

