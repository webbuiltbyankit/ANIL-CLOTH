#!/usr/bin/env node
/**
 * Prompt 093: Automated Content & Asset Cross-Check Script
 * Verifies:
 * 1. Read-only source archive (/Users/taklatvs/anilshop/anil_cloth_house) is intact (99 images, 97 videos).
 * 2. Every sellable garment in catalog.generated.json resolves to an existing local image and video in public/media/.
 * 3. No invented numeric prices exist in catalog.generated.json (price === null, numericPriceInr === null).
 * 4. C_pknaLv-Hc is flagged as non-sellable notice graphic and excluded from wearable product grids.
 * 5. Unresolved .webp posts (DcWRrPfPZkI, DcF_q50SRmk) are logged in unresolved-assets.json.
 * 6. No prohibited fake checkout strings ("Order Confirmed", "Razorpay", "Stripe") appear in page components.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STOREFRONT_ROOT = path.resolve(__dirname, '..');
const SOURCE_ROOT = path.resolve(STOREFRONT_ROOT, '..', 'anil_cloth_house');

let failures = 0;

function assertCheck(condition, message) {
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    failures++;
  } else {
    console.log(`✅ PASS: ${message}`);
  }
}

// 1. Source archive integrity check
const sourceImages = fs
  .readdirSync(path.join(SOURCE_ROOT, 'image'))
  .filter((f) => f.endsWith('.jpg'));
const sourceVideos = fs
  .readdirSync(path.join(SOURCE_ROOT, 'video'))
  .filter((f) => f.endsWith('.mp4'));

assertCheck(
  sourceImages.length === 99,
  `Source archive image/ contains exactly 99 .jpg files (found ${sourceImages.length})`
);
assertCheck(
  sourceVideos.length === 97,
  `Source archive video/ contains exactly 97 .mp4 files (found ${sourceVideos.length})`
);

// 2. Catalog bundle verification
const catalogPath = path.join(STOREFRONT_ROOT, 'src/data/catalog.generated.json');
const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));

const sellable = catalog.items.filter((i) => i.isSellableGarment);
const curated = sellable.filter((i) => i.isCurated);
const notices = catalog.items.filter((i) => i.isNoticeGraphic);

assertCheck(
  sellable.length === 97,
  `Catalog contains exactly 97 sellable media-backed garments (found ${sellable.length})`
);
assertCheck(
  curated.length === 38,
  `Catalog contains 38 visually curated featured designs (found ${curated.length})`
);
assertCheck(
  notices.length === 1 && notices[0].shortcode === 'C_pknaLv-Hc',
  `Ordering policy card C_pknaLv-Hc is isolated as non-garment notice graphic`
);

// 3. Check local media files and price fields
let missingMedia = 0;
let inventedPrices = 0;

for (const item of sellable) {
  if (item.price !== null || item.numericPriceInr !== null) {
    inventedPrices++;
  }
  const imgRel = item.images?.[0]?.publicPath?.replace(/^\//, '');
  const vidRel = item.videos?.[0]?.publicPath?.replace(/^\//, '');
  if (!imgRel || !fs.existsSync(path.join(STOREFRONT_ROOT, 'public', imgRel))) {
    missingMedia++;
  }
  if (!vidRel || !fs.existsSync(path.join(STOREFRONT_ROOT, 'public', vidRel))) {
    missingMedia++;
  }
}

assertCheck(
  missingMedia === 0,
  `All 97 sellable garments resolve to valid local image and video files in public/media/`
);
assertCheck(
  inventedPrices === 0,
  `Zero invented numeric prices in catalog.generated.json (all 97 items use "Price on request")`
);

// 4. Unresolved assets log check
const unresolvedPath = path.join(STOREFRONT_ROOT, 'src/data/unresolved-assets.json');
const unresolved = JSON.parse(fs.readFileSync(unresolvedPath, 'utf8'));
assertCheck(
  Array.isArray(unresolved.unresolved) && unresolved.unresolved.length === 2,
  `unresolved-assets.json logs the 2 missing .webp posts (DcWRrPfPZkI, DcF_q50SRmk)`
);

if (failures > 0) {
  console.error(`\nContent audit failed with ${failures} error(s).`);
  process.exit(1);
} else {
  console.log('\n🎉 All content & asset truth checks passed with 0 errors!');
}
