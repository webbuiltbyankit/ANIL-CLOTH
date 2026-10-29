# Local Instagram Business Profile Content Extractor

A production-quality local web dashboard and extraction pipeline for collecting legitimately accessible public Instagram business profile information and media inside this workspace. Built to prepare **unofficial, private website concept demos** for saree boutiques, clothing shops, and retail businesses while strictly respecting Instagram's terms of service, rate limits, and access controls.

---

## 1. Quick Start & Launching the Dashboard

All dependencies are installed inside the workspace-local virtual environment (`.venv`).

### Launch the Streamlit Local Dashboard

```bash
./.venv/bin/streamlit run app.py
```

Once launched, open the local URL shown in the terminal (typically **http://localhost:8501**).

### Run from the Command Line (Optional)

```bash
./.venv/bin/python cli.py https://www.instagram.com/anil_cloth_house_official/ --mode full --max-posts 20
```

### Run Automated Tests

```bash
./.venv/bin/pytest -v
```

---

## 2. Workspace Directory Structure

Every source file, downloaded image, video, metadata record, report, and export is stored strictly inside this workspace root:

```text
.
├── app.py                          # Streamlit Local Web Dashboard
├── cli.py                          # Command-line runner
├── requirements.txt                # Python dependencies
├── pytest.ini                      # Test configuration
├── README.md                       # Documentation
├── extractor/                      # Modular extraction & export package
│   ├── __init__.py
│   ├── validators.py               # Instagram URL & username validator
│   ├── models.py                   # Strict dataclasses (defaults missing fields to null)
│   ├── storage.py                  # Workspace folder manager, SHA-256 deduplication, Pillow inspection
│   ├── business_parser.py          # Boutique, saree/fabric, SKU, price & policy parser
│   ├── providers.py                # Public Instaloader/Web provider + Official Graph API provider
│   ├── pipeline.py                 # Resumable extraction orchestrator
│   ├── exporters.py                # JSON, CSV, Markdown, HTML Gallery, Vite bundle & ZIP exporters
│   └── fallback_importer.py        # Drag-and-drop media/CSV/JSON importer & manual editor
├── tests/
│   └── test_extractor.py           # Automated tests for URL validation, parser, storage & exports
└── output/
    └── <username>/
        ├── checkpoint.json         # Resumable state tracking processed shortcodes
        ├── demo_selection.json     # Curated image list for private website concept demo
        ├── profile/
        │   ├── profile.json
        │   ├── profile_summary.md
        │   └── profile_picture.jpg
        ├── posts/
        │   ├── images/
        │   ├── posts.json
        │   └── posts.csv
        ├── carousels/              # Individual ordered carousel slides
        ├── reels/
        │   ├── videos/             # Downloaded .mp4 reel/video files
        │   └── covers/             # Video cover thumbnails
        ├── highlights/             # Public highlight covers/media (when accessible)
        ├── product_candidates/
        │   ├── products.json
        │   └── products.csv
        ├── reports/
        │   ├── extraction_report.json
        │   ├── business_summary.md
        │   └── media_manifest.csv
        ├── exports/
        │   ├── gallery_demo.html
        │   ├── vite_react_demo_bundle.json
        │   └── <username>_complete_export.zip
        └── logs/
            └── extraction.log
```

---

## 3. Core Capabilities

1. **Single-URL Input & Validation**: Accepts full profile URLs (`https://www.instagram.com/anil_cloth_house_official/`), URLs with query parameters, or `@username` handles. Rejects invalid domains or non-profile paths.
2. **Download Modes**:
   - *Profile information only*
   - *Profile information + images*
   - *Full accessible media and metadata*
   - *Resume previous extraction*
3. **Original-Quality Media & Deduplication**:
   - Saves original image and video bytes directly without upscaling or re-compression, preserving exact aspect ratios.
   - Computes SHA-256 hashes and tracks checkpoints so rerunning or resuming never downloads duplicate files.
4. **Factual Business & Product Candidate Parser**:
   - Inspects the profile biography and post captions for saree/clothing categories, fabrics, explicit prices (`₹` / `Rs.` / `INR`), SKUs/style codes, sizes, colors, WhatsApp links/numbers, store addresses, delivery info, return/exchange policies, and opening hours.
   - **Zero Fabrication Policy**: Missing fields remain `null`. Posts stating *"DM for price"* record `explicit_price: null` with an explanatory note.
5. **Fallback Importer Workflow**:
   - When Instagram restricts unauthenticated access with a login wall or rate limit, the **Fallback Importer & Manual Editor** tab lets you enter missing profile details and drag-and-drop owner-supplied images, videos, captions, or CSV/JSON catalogs.
6. **Website Concept Demo Readiness**:
   - Generates `product_candidates/products.json`, `exports/vite_react_demo_bundle.json`, and a standalone local `exports/gallery_demo.html` marked with `<meta name="robots" content="noindex, nofollow">` and an **UNOFFICIAL PRIVATE CONCEPT DEMO** disclaimer.

---

## 4. Responsible Access & Legal Notice

- This tool respects Instagram's access restrictions and rate limits. It does **not** bypass logins, CAPTCHAs, or privacy controls, never asks for an Instagram password, and does not collect follower lists or commenter identities.
- Any concept website or gallery generated from extracted content is strictly an **unofficial, non-public concept demo**. Obtain explicit permission from the business owner before publicly displaying or commercially reusing their photographs, videos, or brand assets.

