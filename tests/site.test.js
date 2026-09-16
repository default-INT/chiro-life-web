const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..', 'dist');
const data = require('../data/data.json');
const pages = require('../data/pages');
const routes = ['/', data.product.path, ...pages.map(page => page.path), '/guides/'];
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
