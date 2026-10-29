# Luxury Art Direction & Design System (`Prompts 011–015`)

## 1. Visual Identity Rationale

**ANIL CLOTH HOUSE** showcases heavily embellished women's festivewear, bridal-guest blouses, lehenga sets, and pre-draped sarees filmed inside their NIT Faridabad showroom. Because the raw Instagram Reel covers (`640×1136`) have casual showroom backgrounds and bright blue/pink wholesale-rate text stickers, a generic stark-white tech template makes the photos feel out of place.

Instead, we frame the photography within a **warm, tactile Indian couture editorial palette**:
- **Warm Ivory & Alabaster Surfaces (`#FAF6F0`, `#F3ECE2`)** soften the transition around showroom lighting and provide a refined matte gallery frame (`#EFE7DC`) for portrait cards.
- **Deep Oxblood / Royal Plum (`#3A131F`, `#260B13`)** anchors the hero, wholesale showcase, and footer—echoing the wine, plum, and berry tones prominent in the collection (`DfC5XpkTzsZ`, `De1R96vzHsD`) while providing AAA text contrast with warm cream (`#FAF6F0`).
- **Rich Ink (`#1C1618`) & Warm Charcoal (`#4A3F42`)** deliver crisp editorial readability without harsh pure black.
- **Muted Antique Brass / Champagne (`#9A7432` for text/icons on light, `#D4AF6A` on dark oxblood)** accents fine rules, badges, and focus rings—satisfying WCAG AA contrast while avoiding gaudy metallic gradients.

## 2. Color Tokens & Contrast Compliance

| Token | Hex | Usage & Contrast Note |
| :--- | :--- | :--- |
| `--bg-ivory` | `#FAF6F0` | Primary page canvas |
| `--bg-parchment` | `#F3ECE2` | Secondary alternating section surface & card matting |
| `--bg-stone` | `#E8DFD1` | Subtle borders, skeleton placeholders & chip backgrounds |
| `--bg-oxblood` | `#2D1018` | Hero split panel, Wholesale banner, Footer & primary buttons |
| `--bg-oxblood-deep` | `#1E0A10` | Deepest dark surface for footer bottom bar & modal headers |
| `--text-ink` | `#1C1517` | Primary body & heading text on ivory (`16.8:1` contrast) |
| `--text-muted` | `#574A4D` | Secondary copy & labels on ivory (`7.4:1` contrast — WCAG AAA) |
| `--text-brass-dark` | `#7A5820` | Accessible gold/brass accent text on light backgrounds (`5.9:1` contrast — WCAG AA+) |
| `--text-brass-light` | `#E2C285` | Champagne accent text on `#2D1018` dark oxblood (`8.6:1` contrast — WCAG AAA) |
| `--border-hairline` | `#DED3C3` | `1px` editorial rules and table dividers |

## 3. Editorial Typography Hierarchy (`Prompt 012`)

- **Display & Headings (`--font-serif`)**: `'Cormorant Garamond', 'Playfair Display', Georgia, serif`
  - High-contrast editorial serif with graceful italics and generous vertical proportions suited to couture lookbooks.
- **Interface, Specs & Microcopy (`--font-sans`)**: `'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`
  - Clean geometric humanist sans-serif for prices/status, filter controls, WhatsApp drafts, and shortcode references (`ACH-DfC6hNDTwrJ`).
- **Fluid Responsive Scales (`clamp()`)**:
  - `Display`: `clamp(2.25rem, 4.5vw + 1rem, 4.25rem)` (line-height `1.08`, tracking `-0.02em`)
  - `H1`: `clamp(1.875rem, 3.2vw + 0.8rem, 3.25rem)` (line-height `1.12`)
  - `H2`: `clamp(1.5rem, 2.4vw + 0.6rem, 2.5rem)` (line-height `1.18`)
  - `H3`: `clamp(1.25rem, 1.5vw + 0.5rem, 1.75rem)` (line-height `1.25`)
  - `Body`: `clamp(0.95rem, 0.25vw + 0.9rem, 1.0625rem)` (line-height `1.65`, max measure `65ch`)
  - `Eyebrow / Label`: `0.75rem` (`12px`), uppercase, letter-spacing `0.14em`, font-weight `600`.

## 4. Spacing, Grids & Touch Targets (`Prompt 013`)

- **Container Max-Width**: `1380px` with responsive horizontal padding (`1rem` at `320px–390px`, `1.5rem` at `768px`, `2.5rem` at `1280px+`).
- **Product Grids**:
  - `320px`: 1 or 2 columns (configurable compact density; 2 columns from `360px+` with `12px` gap).
  - `768px`: 3 columns (`20px` gap).
  - `1280px+`: 4 columns (`24px` gap).
- **Interactive Hit Targets**: Minimum `44×44px` touch area on all icon buttons, wishlist hearts, quantity steppers, drawer triggers, and filter checkboxes.

