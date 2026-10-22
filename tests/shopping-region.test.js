const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const data = require('../data/data.json');
const script = fs.readFileSync(require.resolve('../public/js/shopping-region.js'), 'utf8');

function setup({ saved, storageBlocked = false } = {}) {
  const listeners = {};
  const toggle = { setAttribute() {}, focus() {} };
  const flag = {};
  const options = ['US', 'CA'].map(region => ({
    dataset: { region },
    setAttribute() {},
    addEventListener(name, listener) { this[name] = listener; },
  }));
  const selector = {
    querySelector: query => query === 'summary' ? toggle : flag,
    querySelectorAll: () => options,
    contains: () => false,
    dataset: { usUrl: data.product.amazonUrl, caUrl: data.product.amazonCanadaUrl },
    addEventListener: (name, listener) => { listeners[name] = listener; },
  };
  const links = Array.from({ length: 3 }, () => ({
    href: data.product.amazonUrl, dataset: {},
    addEventListener(name, listener) { this[name] = listener; },
  }));
  const writes = [];
  let resolveFetch, rejectFetch, fetchOptions, calls = 0, timeout;
  vm.runInNewContext(script, {
    document: {
      getElementById: () => selector,
      addEventListener() {},
      querySelectorAll: (query) => {
        assert.equal(query, '[data-analytics-event="amazon_buy_click"]');
        return links;
      },
    },
    localStorage: {
      getItem() { if (storageBlocked) throw new Error('Blocked'); return saved; },
      setItem(key, value) { if (storageBlocked) throw new Error('Blocked'); writes.push([key, value]); },
    },
    AbortController,
    setTimeout: (callback) => { timeout = callback; return 1; },
    clearTimeout() {},
    fetch: (url, options) => {
      assert.equal(url, 'https://api.country.is/');
      calls++;
      fetchOptions = options;
      return new Promise((resolve, reject) => { resolveFetch = resolve; rejectFetch = reject; });
    },
  });
  return {
    selector, links, writes, calls,
    choose(region) { options.find(option => option.dataset.region === region).click(); },
    async respond(country, ok = true) {
      resolveFetch({ ok, json: async () => ({ country }) });
      await new Promise(setImmediate);
    },
    async fail() { rejectFetch(new Error('Offline')); await new Promise(setImmediate); },
    expire() { timeout(); },
    aborted() { return fetchOptions.signal.aborted; },
  };
}

test('saved region skips geo lookup and updates every purchase link', () => {
  for (const region of ['US', 'CA']) {
    const app = setup({ saved: region });
    assert.equal(app.calls, 0);
    assert.equal(app.selector.dataset.region, region);
    for (const link of app.links) {
      assert.equal(link.href, region === 'CA' ? data.product.amazonCanadaUrl : data.product.amazonUrl);
      assert.equal(link.dataset.shoppingRegion, region);
    }
    app.choose(region === 'US' ? 'CA' : 'US');
    assert.equal(app.writes.length, 1);
  }
});

test('geo lookup uses USA immediately, then saves Canada or USA for other countries', async () => {
  for (const country of ['CA', 'US', 'DE']) {
    const app = setup({ saved: 'invalid' });
    assert.equal(app.selector.dataset.region, 'US');
    assert.equal(app.links[0].href, data.product.amazonUrl);
    await app.respond(country);
    const expected = country === 'CA' ? 'CA' : 'US';
    assert.equal(app.selector.dataset.region, expected);
    assert.deepEqual(app.writes, [['chirolife.shoppingRegion', expected]]);
  }
});

test('manual selection takes precedence over a late geolocation response', async () => {
  const app = setup();
  app.choose('CA');
  assert(app.aborted());
  await app.respond('US');
  assert.equal(app.selector.dataset.region, 'CA');
  assert(app.links.every(link => link.href === data.product.amazonCanadaUrl));
  assert.deepEqual(app.writes, [['chirolife.shoppingRegion', 'CA']]);
});

test('offline, HTTP errors, invalid responses and timeouts keep working USA links', async () => {
  for (const failure of ['offline', 'http', 'invalid', 'timeout']) {
    const app = setup();
    if (failure === 'offline') await app.fail();
    if (failure === 'http') await app.respond('CA', false);
    if (failure === 'invalid') await app.respond(null);
    if (failure === 'timeout') { app.expire(); await app.respond('CA'); }
    assert.equal(app.selector.dataset.region, 'US');
    assert.equal(app.links[0].href, data.product.amazonUrl);
    assert.equal(app.writes.length, 0);
  }
});

test('blocked localStorage does not prevent manual or automatic selection', async () => {
  const app = setup({ storageBlocked: true });
  await app.respond('CA');
  assert.equal(app.selector.dataset.region, 'CA');
  app.choose('US');
  assert.equal(app.links[0].href, data.product.amazonUrl);
});

test('starting a purchase prevents a late geo result from changing its destination', async () => {
  const app = setup();
  app.links[0].click();
  await app.respond('CA');
  assert.equal(app.links[0].href, data.product.amazonUrl);
  assert.equal(app.selector.dataset.region, 'US');
});
