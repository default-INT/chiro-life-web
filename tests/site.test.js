const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..', 'dist');
const data = require('../data/data.json');
const pages = require('../data/pages');
const routes = ['/', data.product.path, ...pages.map(page => page.path), '/guides/'];
const strategyRoutes = [
  '/beef-tallow-balm-for-face/', '/faq/',
  '/beef-tallow-for-skin/', '/how-to-use-tallow-balm/',
  '/tallow-balm-for-dry-skin/', '/tallow-balm-vs-lotion/',
  '/why-beeswax-in-skin-balm/', '/does-tallow-balm-smell/',
  '/how-much-tallow-balm-to-use/', '/how-to-store-tallow-balm/',
];
const read = route => fs.readFileSync(path.join(root, route, 'index.html'), 'utf8');
const unescape = text => text.replace(/&amp;/g, '&').replace(/&#x3D;/g, '=').replace(/&#x27;/g, "'").replace(/&quot;/g, '"');

test('every indexable route has unique SEO metadata and valid JSON-LD', () => {
  const titles = new Set();
  const descriptions = new Set();
  const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
  for (const route of routes) {
    const html = read(route);
    assert.equal((html.match(/<h1\b/g) || []).length, 1, route);
    const title = html.match(/<title>(.*?)<\/title>/s)?.[1];
    const description = html.match(/<meta name="description" content="([^"]+)"/)?.[1];
    assert(title && description, route);
    assert(!titles.has(title), `Duplicate title: ${route}`);
    assert(!descriptions.has(description), `Duplicate description: ${route}`);
    titles.add(title); descriptions.add(description);
    assert(html.includes(`<link rel="canonical" href="https://chirolife.store${route}">`), route);
    assert(sitemap.includes(`<loc>https://chirolife.store${route}</loc>`), route);
    const schema = JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);
    assert.equal(schema['@context'], 'https://schema.org');
    assert(!JSON.stringify(schema).match(/"offers"|"aggregateRating"|"review"/), route);
    if (pages.find(page => page.path === route)?.isArticle) {
      const article = schema['@graph'].find(item => item['@type'] === 'Article');
      assert(article?.headline && article?.dateModified && article?.author?.name, route);
      assert(article.citation.length > 0, route);
      assert(html.includes('<time datetime='), route);
    }
    assert(!html.includes('{{'), `Unrendered template: ${route}`);
  }
  assert.equal((sitemap.match(/<loc>/g) || []).length, routes.length);
});

test('local links, fragment targets and assets resolve from nested routes', () => {
  for (const route of routes) {
    const html = read(route);
    for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
      const url = new URL(unescape(match[1]), `https://chirolife.store${route}`);
      if (url.origin !== 'https://chirolife.store') continue;
      const file = path.join(root, url.pathname, url.pathname.endsWith('/') ? 'index.html' : '');
      assert(fs.existsSync(file), `${route} links to missing ${url.pathname}`);
      if (url.hash) {
        const target = fs.readFileSync(file, 'utf8');
        assert(target.includes(`id="${url.hash.slice(1)}"`), `${route}: broken fragment ${url.href}`);
      }
    }
    const stylesheets = [...html.matchAll(/<link[^>]+rel="stylesheet"/g)];
    assert.equal(stylesheets.length, 2, 'One local CSS bundle plus Google Fonts');
  }
});

test('404 is not indexed and seller feedback is identified accurately', () => {
  const html = fs.readFileSync(path.join(root, '404.html'), 'utf8');
  assert(html.includes('noindex, follow'));
  assert(!html.includes('rel="canonical"'));
  assert(!fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8').includes('404'));
  const product = read(data.product.path);
  assert(product.includes('These are seller reviews'));
  assert(unescape(product).includes(data.seller.sourceUrl));
  assert(!product.includes('Verified Purchase'));
});

test('remaining strategy pages, social metadata and trust signals are present', () => {
  const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
  for (const route of strategyRoutes) {
    assert(routes.includes(route), `Missing strategy route ${route}`);
    assert(sitemap.includes(`<loc>https://chirolife.store${route}</loc>`), route);
  }

  const home = read('/');
  assert(home.includes('<meta property="og:title" content="ChiroLife Grass-Fed Beef Tallow Balm">'));
  assert(home.includes('<meta property="og:description" content="Three simple ingredients. Whipped, unscented moisture for face, hands and body.">'));

  const schema = JSON.parse(home.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);
  const organization = schema['@graph'].find(item => item['@type'] === 'Organization');
  assert.deepEqual(organization.sameAs, [data.seller.sourceUrl]);

  for (const route of [...routes, '/404.html']) {
    const html = route === '/404.html' ? fs.readFileSync(path.join(root, '404.html'), 'utf8') : read(route);
    for (const image of html.matchAll(/<img\b([^>]*)>/g)) {
      assert(/\bwidth="\d+"/.test(image[1]), `${route} image lacks width: ${image[0]}`);
      assert(/\bheight="\d+"/.test(image[1]), `${route} image lacks height: ${image[0]}`);
    }
  }
});

test('Core Web Vitals are collected and sent to GA4 on production', () => {
  const home = read('/');
  const analytics = fs.readFileSync(path.join(root, 'js', 'index.js'), 'utf8');

  assert(home.includes('<script src="/libs/web-vitals/dist/web-vitals.iife.js"></script>'));
  assert(home.includes('<script src="/js/index.js"></script>'));
  assert(
    home.indexOf('/libs/web-vitals/dist/web-vitals.iife.js') < home.indexOf('/js/index.js'),
    'web-vitals must load before the analytics initialization',
  );
  assert(analytics.includes("window.webVitals.onCLS(sendWebVitalToGoogleAnalytics)"));
  assert(analytics.includes("window.webVitals.onINP(sendWebVitalToGoogleAnalytics)"));
  assert(analytics.includes("window.webVitals.onLCP(sendWebVitalToGoogleAnalytics)"));
  assert(analytics.includes("window.gtag('event', name"));
});

test('preview HTTP statuses and trailing-slash redirects', { skip: !process.env.SITE_TEST_ORIGIN }, async () => {
  const origin = process.env.SITE_TEST_ORIGIN;
  for (const route of routes) {
    assert.equal((await fetch(origin + route)).status, 200, route);
  }
  const missing = await fetch(origin + '/missing-seo-check-page');
  assert.equal(missing.status, 404);
  assert((await missing.text()).includes('A Little Off the Beaten Path.'));
  const redirect = await fetch(origin + '/ingredients', { redirect: 'manual' });
  assert.equal(redirect.status, 301);
  assert.equal(redirect.headers.get('location'), '/ingredients/');
});
