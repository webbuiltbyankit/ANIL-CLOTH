import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const STOREFRONT_ROOT = path.resolve(__dirname, '..');
const WORKSPACE_ROOT = path.resolve(STOREFRONT_ROOT, '..');
const SOURCE_ROOT = path.join(WORKSPACE_ROOT, 'anil_cloth_house');
const INFO_DIR = path.join(SOURCE_ROOT, 'info about shop');
const IMAGE_DIR = path.join(SOURCE_ROOT, 'image');
const VIDEO_DIR = path.join(SOURCE_ROOT, 'video');

const PUBLIC_MEDIA_IMAGES = path.join(STOREFRONT_ROOT, 'public', 'media', 'images');
const PUBLIC_MEDIA_VIDEOS = path.join(STOREFRONT_ROOT, 'public', 'media', 'videos');
const DATA_OUT_DIR = path.join(STOREFRONT_ROOT, 'src', 'data');

fs.mkdirSync(PUBLIC_MEDIA_IMAGES, { recursive: true });
fs.mkdirSync(PUBLIC_MEDIA_VIDEOS, { recursive: true });
fs.mkdirSync(DATA_OUT_DIR, { recursive: true });

// Visually verified curation metadata from manual inspection of the actual JPG files in anil_cloth_house/image/
const VISUAL_CURATION_MAP = {
  DfC6hNDTwrJ: {
    curatedRank: 1,
    editorialCollections: ['embroidered-edit', 'draped-silhouettes', 'statement-details'],
    visualColorTag: 'Lilac & Lavender',
    visualSilhouetteNote: 'Embellished cape-sleeve sweetheart bodice with shimmer draped skirt',
    visualCraftNote: 'Silver crystal, pearl & tonal floral beadwork on pastel lilac',
    onImageOverlayNote: 'Reel cover graphic displays: Wholesale rate ₹2495 • 4 colours shown (confirm current pricing with store)',
    isHeroCandidate: true,
    lookbookStory: 'Pastel Couture & Shimmer Drapes',
  },
  DfC5XpkTzsZ: {
    curatedRank: 2,
    editorialCollections: ['statement-details', 'draped-silhouettes', 'festive-selections'],
    visualColorTag: 'Wine & Oxblood',
    visualSilhouetteNote: 'Strappy sweetheart crystal-leaf corset blouse with pre-draped saree silhouette',
    visualCraftNote: 'High-contrast silver & rose crystal leaf motifs on deep wine-plum fabric',
    onImageOverlayNote: 'Reel cover graphic displays: Wholesale rate ₹1695 • 3 colours (confirm current pricing with store)',
    isHeroCandidate: true,
    lookbookStory: 'Regal Wine & Evening Statements',
  },
  'De-7aBHTYcS': {
    curatedRank: 3,
    editorialCollections: ['embroidered-edit', 'festive-selections'],
    visualColorTag: 'Mauve & Rose',
    visualSilhouetteNote: 'Full-sleeve V-neck embellished blouse with pearl-drop border & vertical sequin lehenga',
    visualCraftNote: 'Dense pearl, sequin & emerald-ruby stone accents on mauve-pink net',
    onImageOverlayNote: 'Reel cover graphic displays: Wholesale rate ₹6395 (confirm current pricing with store)',
    isHeroCandidate: true,
    lookbookStory: 'Bridal-Guest & Festive Ensembles',
  },
  'De-5_dRTcdi': {
    curatedRank: 4,
    editorialCollections: ['embroidered-edit', 'festive-selections', 'statement-details'],
    visualColorTag: 'Blush & Champagne',
    visualSilhouetteNote: 'Scalloped floral cutwork full-sleeve blouse with matching panelled lehenga',
    visualCraftNote: '3D-effect floral resham, pearl & gold zari-style embroidery on soft blush',
    onImageOverlayNote: 'Reel cover graphic displays: Wholesale rate ₹7295 (confirm current pricing with store)',
    isHeroCandidate: true,
    lookbookStory: 'Bridal-Guest & Festive Ensembles',
  },
  De5vI8aTSed: {
    curatedRank: 5,
    editorialCollections: ['festive-selections', 'embroidered-edit'],
    visualColorTag: 'Teal & Emerald',
    visualSilhouetteNote: 'Deep V-neck full-sleeve teal blouse with multi-colour floral border & shimmer lehenga',
    visualCraftNote: ' Vibrant lime, coral & antique gold floral embroidery with pearl hangings',
    onImageOverlayNote: 'Reel cover graphic displays: Wholesale rate ₹5995 (confirm current pricing with store)',
    isHeroCandidate: true,
    lookbookStory: 'Jewel Tones & Heritage Motifs',
  },
  'De-6uVATb2e': {
    curatedRank: 6,
    editorialCollections: ['statement-details', 'draped-silhouettes'],
    visualColorTag: 'Ice Silver & Ivory',
    visualSilhouetteNote: 'Angular sweetheart bustier blouse with cascading pearl fringe & sheer organza drape',
    visualCraftNote: 'All-over silver micro-sequin mesh with pearl tassel hem',
    onImageOverlayNote: 'Reel cover graphic displays: Wholesale rate ₹3795 (confirm current pricing with store)',
    isHeroCandidate: false,
    lookbookStory: 'Pastel Couture & Shimmer Drapes',
  },
  DfC41spT7l3: {
    curatedRank: 7,
    editorialCollections: ['draped-silhouettes', 'festive-selections'],
    visualColorTag: 'Mustard & Gold',
    visualSilhouetteNote: 'Mustard-gold pre-draped saree with intricate peacock pallu border & geometric blouse',
    visualCraftNote: 'White & silver thread/bead peacock motif along the scalloped shoulder drape',
    onImageOverlayNote: 'Reel cover graphic displays: Wholesale rate ₹1195 (confirm current pricing with store)',
    isHeroCandidate: false,
    lookbookStory: 'Jewel Tones & Heritage Motifs',
  },
  De5vvzvTSF2: {
    curatedRank: 8,
    editorialCollections: ['embroidered-edit', 'festive-selections'],
    visualColorTag: 'Gold & Champagne',
    visualSilhouetteNote: 'Sleeveless V-neck apricot-gold geometric lattice blouse & matching lehenga skirt',
    visualCraftNote: 'Silver & champagne cutdana lattice with floral medallions',
    onImageOverlayNote: 'Reel cover graphic displays: Wholesale rate ₹2895 • 2 colours shown (confirm current pricing with store)',
    isHeroCandidate: false,
    lookbookStory: 'Bridal-Guest & Festive Ensembles',
  },
  'De-7IkczBi5': {
    curatedRank: 9,
    editorialCollections: ['statement-details', 'festive-selections'],
    visualColorTag: 'Gold & Champagne',
    visualSilhouetteNote: 'Asymmetric jewel-encrusted bustier with matching embroidered choker band & ivory drape',
    visualCraftNote: 'Ruby, emerald & kundan-style stone work with multi-colour bead tassels',
    onImageOverlayNote: 'Reel cover graphic displays: Wholesale rate ₹4895 (confirm current pricing with store)',
    isHeroCandidate: false,
    lookbookStory: 'Bridal-Guest & Festive Ensembles',
  },
  De1SoaozaHp: {
    curatedRank: 10,
    editorialCollections: ['statement-details', 'embroidered-edit'],
    visualColorTag: 'Navy & Royal Blue',
    visualSilhouetteNote: 'Midnight-blue full-sleeve V-neck blouse with tonal sequin floral lehenga',
    visualCraftNote: 'Tonal sapphire & silver sequin lattice and floral motifs',
    onImageOverlayNote: 'Reel cover graphic displays: Wholesale rate ₹5295 (confirm current pricing with store)',
    isHeroCandidate: false,
    lookbookStory: 'Regal Wine & Evening Statements',
  },
  De5uWxzTUVB: {
    curatedRank: 11,
    editorialCollections: ['embroidered-edit', 'festive-selections'],
    visualColorTag: 'Ice Silver & Ivory',
    visualSilhouetteNote: 'Ivory-cream full-sleeve V-neck blouse with emerald stone accents & matching skirt',
    visualCraftNote: 'Antique gold & silver floral vine embroidery with emerald-green cabochon highlights',
    onImageOverlayNote: 'Reel cover graphic displays: Wholesale rate ₹5795 (confirm current pricing with store)',
    isHeroCandidate: false,
    lookbookStory: 'Bridal-Guest & Festive Ensembles',
  },
  De5t8z7zPfm: {
    curatedRank: 12,
    editorialCollections: ['festive-selections', 'embroidered-edit'],
    visualColorTag: 'Teal & Emerald',
    visualSilhouetteNote: 'Seafoam-turquoise wide sweetheart blouse with silver mirror/beadwork & pleated skirt',
    visualCraftNote: 'Dense silver-champagne geometric & floral beadwork on seafoam base',
    onImageOverlayNote: 'Reel cover graphic displays: Wholesale rate ₹2695 (confirm current pricing with store)',
    isHeroCandidate: false,
    lookbookStory: 'Pastel Couture & Shimmer Drapes',
  },
  'De-7eqATd8U': {
    curatedRank: 13,
    editorialCollections: ['embroidered-edit', 'festive-selections'],
    visualColorTag: 'Gold & Champagne',
    visualSilhouetteNote: 'Taupe-gold full-sleeve V-neck floral blouse with heavily embroidered kali lehenga',
    visualCraftNote: 'Antique gold zari-style & sequin floral scrollwork',
    onImageOverlayNote: 'Reel cover graphic displays: Wholesale rate ₹4495 (confirm current pricing with store)',
    isHeroCandidate: false,
    lookbookStory: 'Bridal-Guest & Festive Ensembles',
  },
  De1R96vzHsD: {
    curatedRank: 14,
    editorialCollections: ['embroidered-edit', 'draped-silhouettes'],
    visualColorTag: 'Mauve & Rose',
    visualSilhouetteNote: 'Dusty plum-rose scoop-neck half-sleeve blouse with mirror-effect lattice & net skirt',
    visualCraftNote: 'Rose-gold foil/mirror-style diamond lattice with floral appliqué borders',
    onImageOverlayNote: 'Reel cover graphic displays: Wholesale rate ₹2495 (confirm current pricing with store)',
    isHeroCandidate: false,
    lookbookStory: 'Pastel Couture & Shimmer Drapes',
  },
  De1SEFrzmqg: {
    curatedRank: 15,
    editorialCollections: ['embroidered-edit', 'statement-details'],
    visualColorTag: 'Gold & Champagne',
    visualSilhouetteNote: 'Espresso-bronze V-neck full-sleeve blouse with linear sequin & floral lehenga',
    visualCraftNote: 'Champagne-gold floral cluster embroidery over chocolate-bronze base',
    onImageOverlayNote: 'Reel cover graphic displays: Wholesale rate (partially obscured on cover; confirm with store)',
    isHeroCandidate: false,
    lookbookStory: 'Regal Wine & Evening Statements',
  },
  De5vEgYTl7y: {
    curatedRank: 16,
    editorialCollections: ['statement-details', 'draped-silhouettes'],
    visualColorTag: 'Teal & Emerald',
    visualSilhouetteNote: 'Aqua-turquoise asymmetric one-shoulder crystal-encrusted blouse & shimmer drape',
    visualCraftNote: 'Multi-colour jewel stones (emerald, ruby, citrine) set in silver beadwork',
    onImageOverlayNote: 'Reel cover graphic displays: Wholesale rate ₹3895 (confirm current pricing with store)',
    isHeroCandidate: false,
    lookbookStory: 'Jewel Tones & Heritage Motifs',
  },
  Deli4kSTSYy: {
    curatedRank: 17,
    editorialCollections: ['statement-details', 'draped-silhouettes'],
    visualColorTag: 'Noir & Charcoal',
    visualSilhouetteNote: 'Jet-black sleeveless U-neck blouse with bold antique-gold floral embroidery & black drape',
    visualCraftNote: 'Oversized gold & silver cutdana floral motifs on matte black',
    onImageOverlayNote: 'Reel cover graphic displays: Wholesale rate ₹1795 (confirm current pricing with store)',
    isHeroCandidate: false,
    lookbookStory: 'Regal Wine & Evening Statements',
  },
  'Dey-ZKAzjc6': {
    curatedRank: 18,
    editorialCollections: ['statement-details', 'embroidered-edit'],
    visualColorTag: 'Navy & Royal Blue',
    visualSilhouetteNote: 'Deep navy sweetheart full-sleeve blouse with silver crystal & bead lehenga',
    visualCraftNote: 'Radiating silver crystal bursts and geometric border on deep teal-navy',
    onImageOverlayNote: 'Reel cover graphic displays: Wholesale rate ₹3795 (confirm current pricing with store)',
    isHeroCandidate: false,
    lookbookStory: 'Regal Wine & Evening Statements',
  },
  'DezH-OlzMaz': {
    curatedRank: 19,
    editorialCollections: ['embroidered-edit', 'statement-details'],
    visualColorTag: 'Noir & Charcoal',
    visualSilhouetteNote: 'Deep plum-charcoal V-neck full-sleeve blouse with antique gold floral jaal lehenga',
    visualCraftNote: 'Dense antique gold & silver floral vine work with pearl edging',
    onImageOverlayNote: 'Reel cover graphic displays: Wholesale rate ₹4495 (confirm current pricing with store)',
    isHeroCandidate: false,
    lookbookStory: 'Regal Wine & Evening Statements',
  },
  'DfC4_QgTjq-': {
    curatedRank: 20,
    editorialCollections: ['draped-silhouettes', 'festive-selections'],
    visualColorTag: 'Teal & Emerald',
    visualSilhouetteNote: 'Sage-seafoam pre-draped saree with silver peacock-feather embroidered pallu & blouse',
    visualCraftNote: 'Silver & white thread/sequin peacock motif on soft sage drape',
    onImageOverlayNote: 'Reel cover graphic displays: Wholesale rate ₹1195 (confirm current pricing with store)',
    isHeroCandidate: false,
    lookbookStory: 'Pastel Couture & Shimmer Drapes',
  },
  DfC4sHlzyUc: {
    curatedRank: 21,
    editorialCollections: ['statement-details', 'draped-silhouettes'],
    visualColorTag: 'Wine & Oxblood',
    visualSilhouetteNote: 'Asymmetric halter-strap wine blouse with rose-gold floral rosette embroidery & drape',
    visualCraftNote: 'Swirling rose-gold & silver beadwork rosettes with crystal border',
    onImageOverlayNote: 'Reel cover graphic displays: Wholesale rate ₹1295 • 4 colours shown (confirm current pricing with store)',
    isHeroCandidate: false,
    lookbookStory: 'Regal Wine & Evening Statements',
  },
  'De-7b_ATyk2': {
    curatedRank: 22,
    editorialCollections: ['embroidered-edit', 'festive-selections'],
    visualColorTag: 'Mauve & Rose',
    visualSilhouetteNote: 'Dusty mauve V-neck sheer-sleeve blouse with antique-gold floral border & net dupatta',
    visualCraftNote: 'Gold zari-style & pearl floral embroidery with crystal drop fringe',
    onImageOverlayNote: 'Reel cover graphic displays: Wholesale rate ₹4595 (confirm current pricing with store)',
    isHeroCandidate: false,
    lookbookStory: 'Bridal-Guest & Festive Ensembles',
  },
  'De-5ykKTuwy': {
    curatedRank: 23,
    editorialCollections: ['embroidered-edit', 'festive-selections'],
    visualColorTag: 'Ice Silver & Ivory',
    visualSilhouetteNote: 'Pastel mint-ivory honeycomb lattice blouse with pastel floral threadwork & matching skirt',
    visualCraftNote: 'Iridescent pastel pink/mint resham & silver sequin hexagonal lattice',
    onImageOverlayNote: 'Reel cover graphic displays: Wholesale rate ₹4895 (confirm current pricing with store)',
    isHeroCandidate: false,
    lookbookStory: 'Pastel Couture & Shimmer Drapes',
  },
  'De-6CqkzXMt': {
    curatedRank: 24,
    editorialCollections: ['statement-details', 'draped-silhouettes'],
    visualColorTag: 'Lilac & Lavender',
    visualSilhouetteNote: 'Lavender-mauve strappy sweetheart bustier with pearl tassels & ruffled organza drape',
    visualCraftNote: 'Micro-sequin shimmer bustier with tiered white pearl fringe',
    onImageOverlayNote: 'Reel cover graphic displays: Wholesale rate ₹3795 (confirm current pricing with store)',
    isHeroCandidate: false,
    lookbookStory: 'Pastel Couture & Shimmer Drapes',
  },
  De5vkYQzOi1: {
    curatedRank: 25,
    editorialCollections: ['statement-details', 'embroidered-edit'],
    visualColorTag: 'Navy & Royal Blue',
    visualSilhouetteNote: 'Royal cobalt-indigo full-sleeve V-neck blouse with tonal crystal & bead lehenga',
    visualCraftNote: 'Tonal midnight-blue beadwork over shimmering cobalt net',
    onImageOverlayNote: 'Reel cover graphic displays: Wholesale rate ₹6595 (confirm current pricing with store)',
    isHeroCandidate: false,
    lookbookStory: 'Regal Wine & Evening Statements',
  },
  'De5vb0qz-BE': {
    curatedRank: 26,
    editorialCollections: ['festive-selections', 'statement-details'],
    visualColorTag: 'Ice Silver & Ivory',
    visualSilhouetteNote: 'Ivory strappy sweetheart bralette blouse with daisy floral motif & champagne tissue skirt',
    visualCraftNote: 'White, yellow & coral beadwork daisy motifs with chevron pearl border',
    onImageOverlayNote: 'Reel cover graphic displays: Wholesale rate ₹4595 (confirm current pricing with store)',
    isHeroCandidate: false,
    lookbookStory: 'Pastel Couture & Shimmer Drapes',
  },
  'De1RfBmTp-6': {
    curatedRank: 27,
    editorialCollections: ['embroidered-edit', 'statement-details'],
    visualColorTag: 'Mauve & Rose',
    visualSilhouetteNote: 'Deep plum-taupe full-sleeve V-neck blouse with intricate tonal beadwork & gridded lehenga',
    visualCraftNote: 'Dense plum & silver cutdana floral bodice over geometric net skirt',
    onImageOverlayNote: 'Reel cover graphic displays: Wholesale rate ₹5295 (confirm current pricing with store)',
    isHeroCandidate: false,
    lookbookStory: 'Regal Wine & Evening Statements',
  },
  De1SA6mzPnz: {
    curatedRank: 28,
    editorialCollections: ['festive-selections', 'embroidered-edit'],
    visualColorTag: 'Teal & Emerald',
    visualSilhouetteNote: 'Pistachio-mint V-neck bell-sleeve blouse with rose & maroon floral embroidery & net flare',
    visualCraftNote: 'Zari-style gold & crimson floral motifs on soft pistachio net',
    onImageOverlayNote: 'Reel cover graphic displays: Wholesale rate ₹2795 (confirm current pricing with store)',
    isHeroCandidate: false,
    lookbookStory: 'Pastel Couture & Shimmer Drapes',
  },
  De1SF6CTAyt: {
    curatedRank: 29,
    editorialCollections: ['embroidered-edit', 'festive-selections'],
    visualColorTag: 'Navy & Royal Blue',
    visualSilhouetteNote: 'Teal-navy V-neck full-sleeve blouse with gold leaf vine embroidery & panelled lehenga',
    visualCraftNote: 'Champagne-gold botanical vine work on deep Prussian blue silk-look base',
    onImageOverlayNote: 'Reel cover graphic displays: Wholesale rate ₹5995 (confirm current pricing with store)',
    isHeroCandidate: false,
    lookbookStory: 'Jewel Tones & Heritage Motifs',
  },
  De1SI6jTTYu: {
    curatedRank: 30,
    editorialCollections: ['embroidered-edit', 'draped-silhouettes'],
    visualColorTag: 'Gold & Champagne',
    visualSilhouetteNote: 'Champagne-gold sleeveless V-neck blouse with silver leaf beadwork & tissue-style skirt',
    visualCraftNote: 'Silver & pearl botanical leaf lattice on beige-gold base',
    onImageOverlayNote: 'Reel cover graphic displays: Wholesale rate ₹2695 (confirm current pricing with store)',
    isHeroCandidate: false,
    lookbookStory: 'Pastel Couture & Shimmer Drapes',
  },
  De1SoroTlzG: {
    curatedRank: 31,
    editorialCollections: ['embroidered-edit', 'festive-selections'],
    visualColorTag: 'Gold & Champagne',
    visualSilhouetteNote: 'Warm sand-beige full-sleeve blouse with white floral motifs & teal-checked lehenga',
    visualCraftNote: 'Contrasting beige floral bodice paired with peacock-blue zari-check skirt',
    onImageOverlayNote: 'Reel cover graphic displays: Wholesale rate ₹2295 (confirm current pricing with store)',
    isHeroCandidate: false,
    lookbookStory: 'Jewel Tones & Heritage Motifs',
  },
  De1TLljTWNH: {
    curatedRank: 32,
    editorialCollections: ['embroidered-edit', 'statement-details'],
    visualColorTag: 'Ice Silver & Ivory',
    visualSilhouetteNote: 'Silver-champagne sleeveless V-neck blouse with concentric pearl arch work & central medallion',
    visualCraftNote: 'Structured silver cutdana & pearl arch pattern with central brooch motif',
    onImageOverlayNote: 'Reel cover graphic displays: Wholesale rate ₹1695 (confirm current pricing with store)',
    isHeroCandidate: false,
    lookbookStory: 'Pastel Couture & Shimmer Drapes',
  },
  De1TXiRTlPh: {
    curatedRank: 33,
    editorialCollections: ['statement-details', 'festive-selections'],
    visualColorTag: 'Noir & Charcoal',
    visualSilhouetteNote: 'Black sleeveless blouse with vibrant yellow/pink geometric & floral beadwork over floral pleated skirt',
    visualCraftNote: 'Multi-colour neon-yellow, coral & lilac beadwork over black and red-floral satin',
    onImageOverlayNote: 'Reel cover graphic displays: Wholesale rate ₹1795 (confirm current pricing with store)',
    isHeroCandidate: false,
    lookbookStory: 'Jewel Tones & Heritage Motifs',
  },
  De1T_9GTrtS: {
    curatedRank: 34,
    editorialCollections: ['statement-details'],
    visualColorTag: 'Noir & Charcoal',
    visualSilhouetteNote: 'Monochrome jet-black V-neck full-sleeve sequin & beadwork blouse with black shimmer lehenga',
    visualCraftNote: 'Tonal black-on-black cutdana, sequin & bead lattice with tassel trim',
    onImageOverlayNote: 'Reel cover graphic displays: Wholesale rate ₹5995 (confirm current pricing with store)',
    isHeroCandidate: false,
    lookbookStory: 'Regal Wine & Evening Statements',
  },
  De5uyG4TsfB: {
    curatedRank: 35,
    editorialCollections: ['embroidered-edit', 'festive-selections'],
    visualColorTag: 'Teal & Emerald',
    visualSilhouetteNote: 'Sage-olive sheer full-sleeve V-neck blouse with blush-gold floral embroidery & lehenga',
    visualCraftNote: 'Delicate antique gold & pastel rose floral thread and sequin work on sage net',
    onImageOverlayNote: 'Reel cover graphic displays: Wholesale rate ₹4895 (confirm current pricing with store)',
    isHeroCandidate: false,
    lookbookStory: 'Bridal-Guest & Festive Ensembles',
  },
  De5uc43z84i: {
    curatedRank: 36,
    editorialCollections: ['statement-details', 'draped-silhouettes'],
    visualColorTag: 'Lilac & Lavender',
    visualSilhouetteNote: 'Orchid-violet asymmetric one-shoulder jewel-encrusted blouse & matching shimmer drape',
    visualCraftNote: 'Multi-colour gemstone & gold bead encrustation on vibrant violet',
    onImageOverlayNote: 'Reel cover graphic displays: Wholesale rate ₹3895 (confirm current pricing with store)',
    isHeroCandidate: false,
    lookbookStory: 'Pastel Couture & Shimmer Drapes',
  },
  De5tDFuTFXz: {
    curatedRank: 37,
    editorialCollections: ['embroidered-edit', 'festive-selections'],
    visualColorTag: 'Ice Silver & Ivory',
    visualSilhouetteNote: 'Pearl-grey sheer full-sleeve V-neck blouse with rose-gold floral beadwork & net lehenga',
    visualCraftNote: 'Champagne & rose-gold 3D floral sequin clusters on mist-grey net',
    onImageOverlayNote: 'Reel cover graphic displays: Wholesale rate ₹6495 (confirm current pricing with store)',
    isHeroCandidate: false,
    lookbookStory: 'Pastel Couture & Shimmer Drapes',
  },
  De5t1eMzaT3: {
    curatedRank: 38,
    editorialCollections: ['embroidered-edit', 'festive-selections'],
    visualColorTag: 'Ice Silver & Ivory',
    visualSilhouetteNote: 'Ivory-white V-neck full-sleeve bridal-guest blouse with gold leaf embroidery & lehenga',
    visualCraftNote: 'Fine antique-gold sequin and thread botanical motifs on luminous ivory',
    onImageOverlayNote: 'Reel cover graphic displays: Wholesale rate ₹5995 (confirm current pricing with store)',
    isHeroCandidate: false,
    lookbookStory: 'Bridal-Guest & Festive Ensembles',
  },
};

function parseCsvLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
    } else if (ch === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  result.push(current);
  return result;
}

function linkOrCopyAsset(srcPath, destPath) {
  if (fs.existsSync(destPath)) {
    return;
  }
  try {
    fs.copyFileSync(srcPath, destPath);
  } catch {
    fs.symlinkSync(srcPath, destPath);
  }
}

function main() {
  const postsRaw = JSON.parse(fs.readFileSync(path.join(INFO_DIR, 'posts.json'), 'utf8'));
  const productsRaw = JSON.parse(fs.readFileSync(path.join(INFO_DIR, 'products.json'), 'utf8'));
  const profileRaw = JSON.parse(fs.readFileSync(path.join(INFO_DIR, 'profile.json'), 'utf8'));
  const manifestLines = fs
    .readFileSync(path.join(INFO_DIR, 'media_manifest.csv'), 'utf8')
    .split(/\r?\n/)
    .filter(Boolean);

  const manifestHeaders = parseCsvLine(manifestLines[0]);
  const manifestRecords = manifestLines.slice(1).map((line) => {
    const cols = parseCsvLine(line);
    const obj = {};
    manifestHeaders.forEach((h, idx) => {
      obj[h] = cols[idx] ?? '';
    });
    return obj;
  });

  const existingImages = new Set(
    fs.readdirSync(IMAGE_DIR).filter((f) => !f.startsWith('.'))
  );
  const existingVideos = new Set(
    fs.existsSync(VIDEO_DIR)
      ? fs.readdirSync(VIDEO_DIR).filter((f) => !f.startsWith('.'))
      : []
  );

  // Copy/link profile picture
  if (existingImages.has('profile_picture.jpg')) {
    linkOrCopyAsset(
      path.join(IMAGE_DIR, 'profile_picture.jpg'),
      path.join(PUBLIC_MEDIA_IMAGES, 'profile_picture.jpg')
    );
  }

  const productsByShortcode = new Map();
  for (const prod of productsRaw) {
    productsByShortcode.set(prod.source_shortcode, prod);
  }

  const manifestByFilename = new Map();
  for (const m of manifestRecords) {
    if (m.saved_filename) {
      manifestByFilename.set(m.saved_filename, m);
    }
  }

  const resolvedAssets = [];
  const unresolvedAssets = [];
  const catalogCandidates = [];

  for (const post of postsRaw) {
    const shortcode = post.shortcode;
    const prod = productsByShortcode.get(shortcode) || {};
    const curation = VISUAL_CURATION_MAP[shortcode] || null;

    // Resolve images
    const candidateImageFiles = [
      ...(post.image_filenames || []),
      post.cover_filename,
      `${shortcode}_cover.jpg`,
      `${shortcode}.jpg`,
    ].filter(Boolean);

    const uniqueCandidateImages = [...new Set(candidateImageFiles)];
    const validImages = [];

    for (const imgName of uniqueCandidateImages) {
      if (existingImages.has(imgName)) {
        const srcImg = path.join(IMAGE_DIR, imgName);
        const destImg = path.join(PUBLIC_MEDIA_IMAGES, imgName);
        linkOrCopyAsset(srcImg, destImg);

        const mInfo = manifestByFilename.get(imgName);
        const width = mInfo && mInfo.width ? Number(mInfo.width) : 640;
        const height = mInfo && mInfo.height ? Number(mInfo.height) : 1136;
        const aspectRatio = mInfo && mInfo.aspect_ratio ? mInfo.aspect_ratio : '40:71';

        const imgRecord = {
          id: `img_${shortcode}_${validImages.length + 1}`,
          filename: imgName,
          publicPath: `/media/images/${imgName}`,
          originalRelativePath: `anil_cloth_house/image/${imgName}`,
          width,
          height,
          aspectRatio,
          mediaCategory: mInfo?.media_category || (imgName.endsWith('_cover.jpg') ? 'reel_cover' : 'post_image'),
          sha256: mInfo?.sha256 || null,
          hasEmbeddedOverlayText: imgName.endsWith('_cover.jpg') || shortcode === 'C_pknaLv-Hc',
          altText: curation
            ? `ANIL CLOTH HOUSE Design / ${shortcode} — ${curation.visualSilhouetteNote} (${curation.visualColorTag})`
            : shortcode === 'C_pknaLv-Hc'
              ? 'ANIL CLOTH HOUSE Ordering Policy Notice — WhatsApp +91-8810530298, No DMs, No COD'
              : `ANIL CLOTH HOUSE Design / ${shortcode} — Embroidered women's occasionwear from Instagram Reel ${shortcode}`,
        };
        validImages.push(imgRecord);
        resolvedAssets.push({
          shortcode,
          type: 'image',
          filename: imgName,
          publicPath: imgRecord.publicPath,
          width,
          height,
        });
      }
    }

    if (validImages.length === 0) {
      const expectedFiles = post.image_filenames || [];
      unresolvedAssets.push({
        shortcode,
        postUrl: post.post_url,
        expectedFiles,
        reason: 'Referenced .webp feed image was not included in anil_cloth_house/image/ archive',
      });
    }

    // Resolve videos
    const candidateVideoFiles = [
      ...(post.video_filenames || []),
      post.is_reel ? `${shortcode}_video.mp4` : null,
    ].filter(Boolean);

    const uniqueCandidateVideos = [...new Set(candidateVideoFiles)];
    const validVideos = [];

    for (const vidName of uniqueCandidateVideos) {
      if (existingVideos.has(vidName)) {
        const srcVid = path.join(VIDEO_DIR, vidName);
        const destVid = path.join(PUBLIC_MEDIA_VIDEOS, vidName);
        const realCopyShortcodes = new Set(['DfC6hNDTwrJ', 'DfC5XpkTzsZ', 'De-7aBHTYcS']);
        try {
          const lstat = fs.lstatSync(destVid, { throwIfNoEntry: false });
          if (lstat) {
            fs.unlinkSync(destVid);
          }
        } catch {
          // ignore
        }
        if (realCopyShortcodes.has(shortcode)) {
          fs.copyFileSync(srcVid, destVid);
        } else {
          try {
            const relTarget = path.relative(path.dirname(destVid), srcVid);
            fs.symlinkSync(relTarget, destVid);
          } catch {
            fs.copyFileSync(srcVid, destVid);
          }
        }
        const mInfo = manifestByFilename.get(vidName);
        const vidRecord = {
          id: `vid_${shortcode}_1`,
          filename: vidName,
          publicPath: `/media/videos/${vidName}`,
          originalRelativePath: `anil_cloth_house/video/${vidName}`,
          fileSizeBytes: mInfo?.file_size_bytes ? Number(mInfo.file_size_bytes) : null,
          sha256: mInfo?.sha256 || null,
          posterPublicPath: validImages[0]?.publicPath || null,
        };
        validVideos.push(vidRecord);
        resolvedAssets.push({
          shortcode,
          type: 'video',
          filename: vidName,
          publicPath: vidRecord.publicPath,
        });
      } else if (post.is_reel) {
        unresolvedAssets.push({
          shortcode,
          postUrl: post.post_url,
          expectedFiles: [vidName],
          reason: 'Reel MP4 file missing from anil_cloth_house/video/',
        });
      }
    }

    const isNoticeGraphic = shortcode === 'C_pknaLv-Hc';
    const hasValidImage = validImages.length > 0;
    const isSellableGarment = hasValidImage && !isNoticeGraphic;

    // Clean caption text (never mutate raw caption, but provide sanitized plain text)
    const rawCaption = typeof post.caption === 'string' ? post.caption : null;

    const editorialCollections = isNoticeGraphic
      ? []
      : curation
        ? curation.editorialCollections
        : isSellableGarment
          ? ['uncategorized']
          : [];

    const candidate = {
      id: prod.product_id || `prod_${shortcode}`,
      shortcode,
      displayId: `ACH-${shortcode}`,
      sourcePostUrl: post.post_url || `https://www.instagram.com/reel/${shortcode}/`,
      publishedAt: post.published_at || null,
      mediaType: post.media_type === 'reel' ? 'reel' : 'image',
      isReel: Boolean(post.is_reel),
      images: validImages,
      videos: validVideos,
      hasPlayableVideo: validVideos.length > 0,
      hasLocalImage: hasValidImage,
      isSellableGarment,
      isNoticeGraphic,
      isCurated: Boolean(curation),
      curatedRank: curation ? curation.curatedRank : null,
      isHeroCandidate: Boolean(curation?.isHeroCandidate),
      lookbookStory: curation?.lookbookStory || null,
      typeConfidence: curation
        ? 'visually_reviewed_editorial'
        : isNoticeGraphic
          ? 'non_product_notice'
          : hasValidImage
            ? 'unreviewed_reel_capture'
            : 'missing_media_excluded',
      title: isNoticeGraphic ? `Store Notice / ${shortcode}` : `Design / ${shortcode}`,
      editorialSubtitle: curation
        ? curation.visualSilhouetteNote
        : isNoticeGraphic
          ? 'Official Ordering & No-COD Notice Graphic'
          : 'Embroidered Occasionwear Ensemble (Reel Capture)',
      visualCraftNote: curation?.visualCraftNote || null,
      onImageOverlayNote:
        curation?.onImageOverlayNote ||
        (post.is_reel
          ? 'Reel cover may contain embedded wholesale rate text; confirm current pricing and terms directly with the store.'
          : null),
      price: null, // Explicitly null in JSON source
      numericPriceInr: null,
      priceStatusLabel: 'Price on request',
      sizes: null, // Explicitly null
      colors: curation?.visualColorTag ? [curation.visualColorTag] : null,
      visualColorTag: curation?.visualColorTag || null,
      materials: null, // Explicitly null — requires owner confirmation
      availability: 'confirm_with_store',
      editorialCollections,
      rawCaption,
      hashtags: Array.isArray(post.hashtags) ? post.hashtags : [],
      externalLinks: Array.isArray(prod.website_links) ? prod.website_links : [],
      likesCount: typeof post.likes_count === 'number' ? post.likes_count : null,
      commentsCount: typeof post.comments_count === 'number' ? post.comments_count : null,
      sellerNotes: prod.delivery_information || "🌍Worldwide shipping | NO DM'S NO COD",
      extractionNotes: prod.extraction_notes || null,
      needsVerification: true,
      sourceReference: {
        shortcode,
        postUrl: post.post_url,
        extractedAt: post.extracted_at,
        sourceProvider: post.source_provider,
      },
    };

    catalogCandidates.push(candidate);
  }

  // Sort candidates so curated rank comes first when appropriate, preserving publishedAt info
  const outputCatalog = {
    generatedAt: '2026-10-29T08:30:00.000Z',
    sourceProfile: {
      username: profileRaw.username,
      displayName: profileRaw.display_name,
      profileUrl: profileRaw.profile_url,
      profilePicturePublicPath: existingImages.has('profile_picture.jpg')
        ? '/media/images/profile_picture.jpg'
        : null,
      biography: profileRaw.biography,
      businessAddress: profileRaw.business_address,
      businessPhone: profileRaw.business_phone,
      followersCountSnapshot: profileRaw.followers_count,
      followingCountSnapshot: profileRaw.following_count,
      postCountSnapshot: profileRaw.post_count,
      extractedAt: profileRaw.extracted_at,
    },
    stats: {
      totalSourcePosts: postsRaw.length,
      totalSellableGarments: catalogCandidates.filter((c) => c.isSellableGarment).length,
      totalCuratedDesigns: catalogCandidates.filter((c) => c.isCurated).length,
      totalWithPlayableVideo: catalogCandidates.filter((c) => c.hasPlayableVideo).length,
      totalNoticeGraphics: catalogCandidates.filter((c) => c.isNoticeGraphic).length,
      totalExcludedMissingMedia: unresolvedAssets.length,
    },
    items: catalogCandidates,
  };

  fs.writeFileSync(
    path.join(DATA_OUT_DIR, 'catalog.generated.json'),
    JSON.stringify(outputCatalog, null, 2) + '\n',
    'utf8'
  );

  fs.writeFileSync(
    path.join(DATA_OUT_DIR, 'assets-manifest.json'),
    JSON.stringify(
      {
        generatedAt: outputCatalog.generatedAt,
        totalResolvedImages: resolvedAssets.filter((a) => a.type === 'image').length,
        totalResolvedVideos: resolvedAssets.filter((a) => a.type === 'video').length,
        assets: resolvedAssets,
      },
      null,
      2
    ) + '\n',
    'utf8'
  );

  fs.writeFileSync(
    path.join(DATA_OUT_DIR, 'unresolved-assets.json'),
    JSON.stringify(
      {
        generatedAt: outputCatalog.generatedAt,
        totalUnresolved: unresolvedAssets.length,
        unresolved: unresolvedAssets,
      },
      null,
      2
    ) + '\n',
    'utf8'
  );

  console.log('Normalized catalog generated successfully:', outputCatalog.stats);
}

main();

