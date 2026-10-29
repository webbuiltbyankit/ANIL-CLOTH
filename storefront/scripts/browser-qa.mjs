#!/usr/bin/env node
/**
 * Real Headless Google Chrome QA & Responsive Audit Script (Phases 2, 4, 5, 6, 7, 9)
 * Drives Google Chrome via Chrome DevTools Protocol (CDP) using native Node 26 fetch + WebSocket,
 * with a self-contained Vite server so all 19 routes and 14 viewport widths are genuinely rendered.
 */

import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STOREFRONT_ROOT = path.resolve(__dirname, '..');
const SCREENSHOT_DIR = path.join(STOREFRONT_ROOT, 'qa-screenshots');
fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

const CHROME_BIN = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const CDP_PORT = 9229;

const ROUTES = [
  { path: '/', name: 'home' },
  { path: '/shop', name: 'shop' },
  { path: '/collections/embroidered-edit', name: 'collection-embroidered' },
  { path: '/collections/festive-selections', name: 'collection-festive' },
  { path: '/lookbook', name: 'lookbook' },
  { path: '/search?q=Ruby', name: 'search' },
  { path: '/product/DfC6hNDTwrJ', name: 'pdp' },
  { path: '/wishlist', name: 'wishlist' },
  { path: '/enquiry-bag', name: 'enquiry-bag' },
  { path: '/checkout', name: 'checkout-concept' },
  { path: '/wholesale', name: 'wholesale' },
  { path: '/our-story', name: 'our-story' },
  { path: '/contact', name: 'contact' },
  { path: '/faq', name: 'faq' },
  { path: '/shipping', name: 'shipping' },
  { path: '/returns', name: 'returns' },
  { path: '/demo-notice', name: 'demo-notice' },
  { path: '/design-system', name: 'design-system' },
  { path: '/non-existent-route-404', name: 'not-found-404' },
];

const VIEWPORT_WIDTHS = [
  320, 360, 375, 390, 414, 480, 600, 768, 820, 1024, 1280, 1440, 1920, 2560,
];

const SPECIAL_VIEWPORTS = [
  { label: 'mobile-landscape-667x375', width: 667, height: 375, mobile: true },
  { label: 'tablet-landscape-1024x768', width: 1024, height: 768, mobile: false },
  { label: 'short-desktop-1280x540', width: 1280, height: 540, mobile: false },
];

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

class CDPClient {
  constructor(wsUrl) {
    this.ws = new WebSocket(wsUrl);
    this.seq = 1;
    this.pending = new Map();
    this.consoleErrors = [];
    this.pageExceptions = [];
  }

  async connect() {
    await new Promise((resolve, reject) => {
      this.ws.addEventListener('open', resolve);
      this.ws.addEventListener('error', reject);
    });

    this.ws.addEventListener('message', (event) => {
      const msg = JSON.parse(String(event.data));
      if (msg.id && this.pending.has(msg.id)) {
        const { resolve, reject } = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        if (msg.error) reject(new Error(msg.error.message));
        else resolve(msg.result);
      } else if (msg.method === 'Runtime.consoleAPICalled') {
        if (msg.params.type === 'error') {
          const text = msg.params.args.map((a) => a.value ?? a.description ?? '').join(' ');
          this.consoleErrors.push(text);
        }
      } else if (msg.method === 'Runtime.exceptionThrown') {
        this.pageExceptions.push(
          msg.params.exceptionDetails?.text || 'Uncaught exception'
        );
      }
    });
  }

  send(method, params = {}) {
    const id = this.seq++;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async evalJs(expression) {
    const res = await this.send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true,
    });
    return res?.result?.value;
  }

  close() {
    this.ws.close();
  }
}

async function runAudit() {
  process.chdir(STOREFRONT_ROOT);
  // Start embedded Vite server on port 5179
  const viteServer = await createServer({
    root: STOREFRONT_ROOT,
    server: { host: '127.0.0.1', port: 5179, strictPort: false },
    logLevel: 'silent',
  });
  await viteServer.listen();
  const address = viteServer.httpServer.address();
  const baseUrl = `http://127.0.0.1:${address.port}`;

  const userDataDir = '/tmp/ach-chrome-qa-' + Date.now();
  const chromeProc = spawn(
    CHROME_BIN,
    [
      '--headless=new',
      '--disable-gpu',
      '--no-first-run',
      '--no-default-browser-check',
      `--user-data-dir=${userDataDir}`,
      `--remote-debugging-port=${CDP_PORT}`,
      'about:blank',
    ],
    { stdio: 'ignore' }
  );

  try {
    let wsUrl = null;
    for (let i = 0; i < 40; i++) {
      try {
        const res = await fetch(`http://127.0.0.1:${CDP_PORT}/json/list`);
        const pages = await res.json();
        const page = pages.find((p) => p.type === 'page');
        if (page?.webSocketDebuggerUrl) {
          wsUrl = page.webSocketDebuggerUrl;
          break;
        }
      } catch {
        // wait
      }
      await sleep(200);
    }

    if (!wsUrl) {
      throw new Error('Could not connect to Chrome DevTools Protocol');
    }

    const cdp = new CDPClient(wsUrl);
    await cdp.connect();
    await cdp.send('Page.enable');
    await cdp.send('Runtime.enable');
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 1280,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    });

    const report = {
      timestamp: new Date().toISOString(),
      routesTested: [],
      viewportMatrixIssues: [],
      brokenImages: [],
      consoleErrors: [],
      pageExceptions: [],
      screenshotsSaved: [],
      zoomAudit: [],
    };

    await cdp.send('Page.navigate', { url: baseUrl });
    await sleep(700);
    await cdp.evalJs(`
      (() => {
        window.localStorage.setItem('ach_wishlist_v1', JSON.stringify(['prod_DfC6hNDTwrJ', 'prod_DGTafF6z2H4']));
        window.localStorage.setItem('ach_enquiry_bag_v1', JSON.stringify([
          { productId: 'prod_DfC6hNDTwrJ', shortcode: 'DfC6hNDTwrJ', displayId: 'ACH-DfC6hNDTwrJ', quantity: 2, note: 'Bridal guest ensemble', addedAt: new Date().toISOString() },
          { productId: 'prod_DGTafF6z2H4', shortcode: 'DGTafF6z2H4', displayId: 'ACH-DGTafF6z2H4', quantity: 5, note: 'Boutique trial lot', addedAt: new Date().toISOString() }
        ]));
        return true;
      })()
    `);

    for (const route of ROUTES) {
      const targetUrl = `${baseUrl}${route.path}`;
      await cdp.send('Page.navigate', { url: targetUrl });
      await sleep(450);

      const widthsToTest = ['home', 'shop', 'pdp', 'wholesale', 'enquiry-bag', 'checkout-concept'].includes(route.name)
        ? VIEWPORT_WIDTHS
        : [320, 375, 768, 1024, 1440, 1920];

      for (const w of widthsToTest) {
        const h = w < 768 ? 812 : 900;
        await cdp.send('Emulation.setDeviceMetricsOverride', {
          width: w,
          height: h,
          deviceScaleFactor: 1,
          mobile: w < 768,
        });
        await sleep(100);

        const metrics = await cdp.evalJs(`
          (() => {
            const docEl = document.documentElement;
            const scrollWidth = docEl.scrollWidth;
            const innerWidth = window.innerWidth;
            const hasHorizontalOverflow = scrollWidth > innerWidth + 1;
            const h1Count = document.querySelectorAll('h1').length;
            const imgs = Array.from(document.querySelectorAll('img'));
            const broken = imgs
              .filter((img) => img.complete && img.naturalWidth === 0 && img.getAttribute('src'))
              .map((img) => img.getAttribute('src'));
            return {
              scrollWidth,
              innerWidth,
              hasHorizontalOverflow,
              h1Count,
              broken,
              title: document.title,
            };
          })()
        `);

        if (metrics?.hasHorizontalOverflow) {
          report.viewportMatrixIssues.push({
            route: route.path,
            width: w,
            scrollWidth: metrics.scrollWidth,
            innerWidth: metrics.innerWidth,
          });
        }

        if (metrics?.broken?.length > 0) {
          report.brokenImages.push({
            route: route.path,
            width: w,
            broken: metrics.broken,
          });
        }

        if (
          [375, 768, 1440].includes(w) &&
          ['home', 'shop', 'pdp', 'wholesale', 'enquiry-bag', 'checkout-concept', 'our-story', 'contact'].includes(route.name)
        ) {
          const shot = await cdp.send('Page.captureScreenshot', { format: 'png' });
          const filename = `${route.name}-${w}px.png`;
          const outPath = path.join(SCREENSHOT_DIR, filename);
          fs.writeFileSync(outPath, Buffer.from(shot.data, 'base64'));
          report.screenshotsSaved.push(outPath);
        }
      }

      report.routesTested.push({
        route: route.path,
        name: route.name,
        widthsVerified: widthsToTest,
      });
    }

    await cdp.send('Page.navigate', { url: `${baseUrl}/shop` });
    await sleep(400);

    for (const sv of SPECIAL_VIEWPORTS) {
      await cdp.send('Emulation.setDeviceMetricsOverride', {
        width: sv.width,
        height: sv.height,
        deviceScaleFactor: 1,
        mobile: sv.mobile,
      });
      await sleep(150);
      const check = await cdp.evalJs(`
        ({
          scrollWidth: document.documentElement.scrollWidth,
          innerWidth: window.innerWidth,
          overflow: document.documentElement.scrollWidth > window.innerWidth + 1
        })
      `);
      if (check?.overflow) {
        report.viewportMatrixIssues.push({
          route: '/shop',
          viewport: sv.label,
          scrollWidth: check.scrollWidth,
          innerWidth: check.innerWidth,
        });
      }
    }

    for (const zoomPct of [200, 400]) {
      const effectiveWidth = Math.round(1280 / (zoomPct / 100));
      await cdp.send('Emulation.setDeviceMetricsOverride', {
        width: effectiveWidth,
        height: Math.round(800 / (zoomPct / 100)),
        deviceScaleFactor: zoomPct / 100,
        mobile: false,
      });
      await sleep(150);
      const zCheck = await cdp.evalJs(`
        ({
          zoomPct: ${zoomPct},
          scrollWidth: document.documentElement.scrollWidth,
          innerWidth: window.innerWidth,
          overflow: document.documentElement.scrollWidth > window.innerWidth + 1
        })
      `);
      report.zoomAudit.push(zCheck);
    }

    report.consoleErrors = cdp.consoleErrors;
    report.pageExceptions = cdp.pageExceptions;

    const outReportPath = path.join(STOREFRONT_ROOT, 'src/data/browser-qa-results.json');
    fs.writeFileSync(outReportPath, JSON.stringify(report, null, 2));

    console.log(`✅ Tested ${report.routesTested.length} routes in real Google Chrome.`);
    console.log(`✅ Saved ${report.screenshotsSaved.length} screenshots to ${SCREENSHOT_DIR}`);
    console.log(`• Horizontal overflow issues: ${report.viewportMatrixIssues.length}`);
    console.log(`• Broken images: ${report.brokenImages.length}`);
    console.log(`• Console errors: ${report.consoleErrors.length}`);
    console.log(`• Page exceptions: ${report.pageExceptions.length}`);

    if (report.viewportMatrixIssues.length > 0) {
      console.log('Overflow details:', JSON.stringify(report.viewportMatrixIssues, null, 2));
    }
    if (report.brokenImages.length > 0) {
      console.log('Broken image details:', JSON.stringify(report.brokenImages, null, 2));
    }
    if (report.consoleErrors.length > 0) {
      console.log('Console errors:', JSON.stringify(report.consoleErrors, null, 2));
    }

    cdp.close();
  } finally {
    chromeProc.kill('SIGKILL');
    await viteServer.close();
  }
}

runAudit().catch((err) => {
  console.error('Browser QA script failed:', err);
  process.exit(1);
});
