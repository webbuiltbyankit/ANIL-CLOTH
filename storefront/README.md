# ANIL CLOTH HOUSE (`@anil_cloth_house_official`) — Storefront Concept Prototype

> **Unofficial Private Concept Demo**: A luxury North Indian festive & ethnic wear digital storefront and wholesale enquiry experience built in React + TypeScript + Vite + Tailwind CSS using the real extracted Instagram archive in `/Users/taklatvs/anilshop/anil_cloth_house/`.

---

## 1. Quick Start & Commands

Run all commands from `/Users/taklatvs/anilshop/storefront`:

```bash
# Install dependencies
npm install

# Regenerate normalized catalog & sync public/media symlinks from ../anil_cloth_house
npm run normalize

# Run automated content & asset truth audit
npm run audit:content

# Run TypeScript strict typecheck
npm run typecheck

# Run Vitest unit & component integration tests
npm run test

# Build production bundle into dist/
npm run build

# Start local development / preview server
npm run dev
```

---

## 2. Architecture & Truth Guardrails

- **Read-Only Source Archive**: `/Users/taklatvs/anilshop/anil_cloth_house/` is never modified. `scripts/normalize-catalog.mjs` reads `info about shop/profile.json`, `posts.json`, `products.json`, and `media_manifest.csv`, links the 99 `.jpg` images and 97 `.mp4` Reel videos into `public/media/`, and outputs:
  - `src/data/catalog.generated.json` (`97` sellable garments with playable `.mp4` Reels, `38` visually curated designs, `1` non-garment ordering notice card `C_pknaLv-Hc`).
  - `src/data/assets-manifest.json`
  - `src/data/unresolved-assets.json` (`DcWRrPfPZkI.webp` and `DcF_q50SRmk.webp`).
- **Centralized Owner Confirmation Config**: Update `src/data/owner-review.ts` (`OWNER_REVIEW_CONFIG`) when the store owner confirms official vector logos, pricing policies, MOQs, or return rules.
- **WhatsApp-First Conversion (`+91 8810530298`)**: Single-design enquiries, multi-design Enquiry Bag shortlists, Wholesale trade sheets, and Custom Sourcing requests generate clean, pre-filled `https://wa.me/918810530298?text=...` drafts with explicit `NO DM'S NO COD` transparency.

---

## 3. Documentation Index (`docs/`)

- [`docs/source-audit.md`](./docs/source-audit.md) — Prompt 001 Source Asset & Metadata Audit
- [`docs/content-truth.md`](./docs/content-truth.md) — Prompt 002 Verified Facts vs. Owner Confirmation Matrix
- [`docs/media-art-direction.md`](./docs/media-art-direction.md) — Prompt 003 Image & Video Quality Audit
- [`docs/merchandising-review.md`](./docs/merchandising-review.md) — Prompt 006 Visual Curation of 38 Featured Designs
- [`docs/ux-blueprint.md`](./docs/ux-blueprint.md) — Prompt 007 UX & Conversion Blueprint
- [`docs/route-checklist.md`](./docs/route-checklist.md) — Prompt 010 Route & Sitemap Architecture
- [`docs/design-system.md`](./docs/design-system.md) — Prompt 011 North Indian Festive Editorial Design System
- [`docs/catalog-qa.md`](./docs/catalog-qa.md) — Prompt 040 Catalog & Discovery QA
- [`docs/product-page-qa.md`](./docs/product-page-qa.md) — Prompt 050 Product Detail & Quick View QA
- [`docs/owner-content-checklist.md`](./docs/owner-content-checklist.md) — Prompts 067, 070, 095 Owner Sign-Off Checklist
- [`docs/mobile-qa.md`](./docs/mobile-qa.md) — Prompt 080 Mobile & Accessibility QA
- [`docs/technical-qa.md`](./docs/technical-qa.md) — Prompt 090 Technical QA & Security Report
- [`docs/demo-retail-scenario.md`](./docs/demo-retail-scenario.md) — Prompt 091 Retail Demo Walkthrough Script
- [`docs/demo-wholesale-scenario.md`](./docs/demo-wholesale-scenario.md) — Prompt 092 Wholesale Demo Walkthrough Script
- [`docs/final-content-audit.md`](./docs/final-content-audit.md) — Prompt 093 Final Content & Asset Audit
- [`docs/known-limitations.md`](./docs/known-limitations.md) — Prompt 099 Known Limitations & Production Roadmap

