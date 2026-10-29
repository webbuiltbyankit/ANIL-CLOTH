# Merchandising Curation & Uncertainty Review (`Prompt 006`)

## 1. Curation Philosophy & Guardrails

1. **Zero Fabricated Inventory or Pricing**:
   - All 97 Reel-backed designs have `price: null` in the structured JSON metadata (`explicit_price: null`).
   - While the showroom Reel cover thumbnails visually display tilted overlay stickers (e.g., `Wholesale rate ₹2495`), we never treat unverified graphic text as a live checkout price. Every product displays **`Price on request`** (with a transparent note: *"Wholesale rate shown on reel cover — confirm current rate & MOQ on WhatsApp"*).
2. **Neutral Presentation Naming**:
   - Until the business owner approves official product names, every item uses a clean, deterministic presentation title: **`Design / [shortcode]`** (e.g., `Design / DfC6hNDTwrJ`) and a human-friendly demo reference ID **`ACH-[shortcode]`** (`ACH-DfC6hNDTwrJ`).
   - Visually verified items also carry a cautious editorial descriptor (e.g., *Lilac Cape-Sleeve Embellished Blouse & Draped Set*) clearly marked as an editorial visual description rather than a factory SKU specification.
3. **36 Visually Curated Featured Designs + Full 97-Item Archive Switch**:
   - We manually inspected 38+ images from `anil_cloth_house/image/` and selected **36 high-visibility, visually distinct garment designs** as the default curated showcase (`isCurated: true`).
   - All **97 valid media-backed garment posts** remain accessible via the **"Show All 97 Archive Designs"** toggle on `/shop`, `/wholesale`, and `/search` so no real media-backed post is lost.
4. **Excluded Non-Garment / Missing-Media Records**:
   - `C_pknaLv-Hc` (`C_pknaLv-Hc.jpg`): Visually verified as a blue text notice card (`#To order / Watsapp on: +91-8810530298 / #No DM's# No COD`). Marked `isSellableGarment: false` and `editorialGroup: "Store Notice"` so it does not pollute clothing grids.
   - `DcWRrPfPZkI` & `DcF_q50SRmk`: Reference `.webp` files not included in `anil_cloth_house/image/`. Logged in `unresolved-assets.json` and excluded from storefront product grids.

## 2. Editorial Groupings (Merchandising Collections)

Rather than claiming confirmed SKU taxonomy (like "100% Pure Silk Sarees"), we organize the catalog into defensible editorial edits:

1. **`embroidered-edit` (`The Embroidered Edit`)**:
   - Intricate beadwork, cutdana, mirror-effect, and floral threadwork blouses paired with coordinated skirts and drapes.
2. **`festive-selections` (`Festive Selections`)**:
   - Celebratory pastel, champagne, gold, teal, and jewel-toned occasion ensembles suited for wedding guests and festive gatherings.
3. **`statement-details` (`Statement Details`)**:
   - Architectural necklines, pearl-fringe hems, cape sleeves, choker-style dupattas, and high-contrast evening silhouettes.
4. **`draped-silhouettes` (`Draped & Ready-to-Wear Edits`)**:
   - Pre-draped saree silhouettes and fluid shimmer drapes paired with structured embellished bodices.
5. **`uncategorized` (`Extended Reel Archive`)**:
   - The remaining 61 valid Reel-backed designs from the 97-post extraction, available when toggling **"All 97 Archive Designs"** in the catalog.

