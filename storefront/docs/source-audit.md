# Source Archive & Input Inventory Audit (`Prompt 001`)

## 1. Workspace Topology

- **Active Workspace Root:** `/Users/taklatvs/anilshop` (parent directory of `anil_cloth_house/`).
- **Untouched Source Archive:** `/Users/taklatvs/anilshop/anil_cloth_house/` (preserved strictly read-only; no scraping re-run).
- **Standalone Frontend Workspace:** `/Users/taklatvs/anilshop/storefront/`.

## 2. Supplied Source Directories & Files

Inside `/Users/taklatvs/anilshop/anil_cloth_house/`:

| Path | Type | Count / Size | Description |
| :--- | :--- | :--- | :--- |
| `readme about shop.md` | Markdown | 1 file (6.1 KB) | Documentation for the local Instagram business profile content extractor |
| `image/` | Directory | **99 `.jpg` files** | `profile_picture.jpg` (100×100), `C_pknaLv-Hc.jpg` (1025×1025 feed notice image), and **97** Reel cover thumbnails (`<shortcode>_cover.jpg`, 640×1136 portrait, 40:71 aspect ratio) |
| `video/` | Directory | **97 `.mp4` files** | Full downloaded Instagram Reel video files (`<shortcode>_video.mp4`), matching all 97 Reel covers |
| `info about shop/` | Directory | **12 files** | Metadata, manifests, summaries, and reports (corresponds to `info/` in the playbook) |

### Files inside `anil_cloth_house/info about shop/`:
1. `profile.json` — Public profile metadata (`anil_cloth_house_official`, display name `ANIL CLOTH HOUSE`, biography, phone, address, follower/post counts as of extraction timestamp `2026-10-29T07:22:31Z`).
2. `profile_summary.md` — Human-readable summary of profile metadata.
3. `business_summary.md` — Factual summary of contact details, policies, and extraction completeness.
4. `posts.json` & `posts.csv` — 100 extracted public post records (97 reels + 3 feed image posts).
5. `products.json` & `products.csv` — 100 candidate product records derived from the 100 posts (`prod_<shortcode>`).
6. `media_manifest.csv` — 199 rows (header + 198 media entries: 1 profile picture, 3 feed post images, 97 reel covers, 97 reel videos) with dimensions, byte sizes, SHA-256 hashes, and relative paths.
7. `extraction_report.json` — Audit report showing `partial_accessible` status (100 posts processed out of 2,055 total profile posts; Story Highlights restricted behind Instagram login wall).
8. `README_INFO.md` — Overview of the extracted collection.
9. `gallery_demo.html` & `vite_react_demo_bundle.json` — Extractor-generated reference exports.

## 3. Path Resolution & Missing / Inaccessible Media Analysis

In `posts.json`, `products.json`, and `media_manifest.csv`, relative paths are recorded using the extractor's internal layout (`output/anil_cloth_house_official/...`), whereas the supplied archive flattens media into `anil_cloth_house/image/` and `anil_cloth_house/video/`:

- **Profile Picture (`profile_picture.jpg`)**:
  - Manifest path: `output/anil_cloth_house_official/profile/profile_picture.jpg`
  - Actual file: `anil_cloth_house/image/profile_picture.jpg` (100×100 px, 4,018 bytes) — **Verified Present**.
- **97 Reel Posts (`media_type: "reel"`)**:
  - Cover images: `<shortcode>_cover.jpg` in `anil_cloth_house/image/` — **All 97 Verified Present** (640×1136 px).
  - Reel videos: `<shortcode>_video.mp4` in `anil_cloth_house/video/` — **All 97 Verified Present** (local `.mp4` video streams).
- **1 Feed Post (`C_pknaLv-Hc`)**:
  - Image: `C_pknaLv-Hc.jpg` in `anil_cloth_house/image/` (1025×1025 px) — **Verified Present**.
  - Note: Visual inspection confirms this is an informational ordering-policy graphic (`#To order / Watsapp on: +91-8810530298 / #No DM's# No COD`), not a garment photo.
- **2 Missing Feed Images (`DcWRrPfPZkI` and `DcF_q50SRmk`)**:
  - `posts.json` and `media_manifest.csv` reference `DcWRrPfPZkI.webp` (1440×1440) and `DcF_q50SRmk.webp` (1440×1440), which are **missing** from `anil_cloth_house/image/` (only `.jpg` files were packaged into `image/`).
  - These 2 records are logged in `unresolved-assets.json` and excluded from sellable/browsable garment grids so no broken images ever render.

## 4. Metadata Gaps & Guardrails

- **Explicit Prices in JSON**: `explicit_price` and `numeric_price_inr` are `null` across all 100 JSON records. (Many Reel cover images visually display tilted overlay text such as `Wholesale rate ₹2495`, which must be treated as unconfirmed visual reference until confirmed with the store).
- **Sizes, Fabrics, Stock Counts**: `null` / empty across all 100 JSON records.
- **Captions**:
  - 64 posts share a standard store contact caption (`* Take screenshots to order. * WhatsApp no. 8810530298 *Shop address ANIL CLOTH HOUSE Plot no. 1k/6a nit faridabad 121001 , Haryana , Delhi ncr...`).
  - 31 posts have `caption: null`.
  - 3 posts contain YouTube links (`https://youtu.be/-Cdm4guXk6c...` and `https://youtu.be/SK99PSCye0w...`).
  - 2 posts (`DcWRrPfPZkI`, `DcF_q50SRmk`) have shorter store address captions but missing `.webp` files.

