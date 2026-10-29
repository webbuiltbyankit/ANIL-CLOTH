# Final Content & Asset Truth Audit Report (Prompt 093)

## 1. Automated Cross-Check Summary (`npm run audit:content`)
Executed via `storefront/scripts/audit-content.mjs`:
- **Source Folder Integrity**: `/Users/taklatvs/anilshop/anil_cloth_house/` remains 100% untouched and read-only (`99` `.jpg` images in `image/`, `97` `.mp4` videos in `video/`).
- **Sellable Garment Count**: `97` valid media-backed garment Reels, each linked to a real local `.jpg` cover and `.mp4` video under `public/media/`.
- **Visually Curated Edit**: `38` manually inspected designs with verified visual colour tags, silhouettes, and craft notes.
- **Non-Garment Policy Graphic Isolation**: Post `C_pknaLv-Hc` (`C_pknaLv-Hc.jpg`, blue ordering notice card) is flagged `isNoticeGraphic: true, isSellableGarment: false` and rendered exclusively on provenance/policy pages (`/our-story`).
- **Unresolved Assets Transparency**: Missing `.webp` posts `DcWRrPfPZkI` and `DcF_q50SRmk` are logged in `src/data/unresolved-assets.json` and excluded from UI grids.
- **Price Integrity**: `0` invented numeric prices exist in `catalog.generated.json`. All 97 garments carry `price: null` and `priceStatusLabel: "Price on request"`, with explicit caveats where original Reel covers contain embedded wholesale rate stickers.
- **Contact & Policy Accuracy**:
  - WhatsApp: `+91 8810530298` (`https://wa.me/918810530298`)
  - Instagram: `@anil_cloth_house_official`
  - Ordering rules: `NO DM'S NO COD` and `We do not hold items`
  - Address transparency: Both the caption address (`Plot no. 1k/6a nit faridabad 121001, Haryana, Delhi ncr`) and profile bio line (`Delhi, 1k/6a NIT. Faridabad`) are displayed transparently with no guessed map pin.

