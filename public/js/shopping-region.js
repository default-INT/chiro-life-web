(() => {
  const selector = document.getElementById('shopping-region');
  if (!selector) return;

  const storageKey = 'chirolife.shoppingRegion';
  const links = document.querySelectorAll('[data-analytics-event="amazon_buy_click"]');
  const urls = { US: selector.dataset.usUrl, CA: selector.dataset.caUrl };
  let manuallySelected = false;
  const controller = new AbortController();
  const toggle = selector.querySelector('summary');
  const flag = selector.querySelector('[data-region-flag]');
  const options = selector.querySelectorAll('[data-region]');
  const regions = { US: { flag: '🇺🇸', name: 'USA' }, CA: { flag: '🇨🇦', name: 'Canada' } };

  const applyRegion = (region) => {
    selector.dataset.region = region;
    flag.textContent = regions[region].flag;
    toggle.setAttribute('aria-label', `Shopping region: ${regions[region].name}`);
    toggle.title = `Shopping region: ${regions[region].name}`;
    options.forEach(option => option.setAttribute('aria-pressed', String(option.dataset.region === region)));
    links.forEach((link) => {
      link.href = urls[region];
      link.dataset.shoppingRegion = region;
    });
  };

  const saveRegion = (region) => {
    try {
      localStorage.setItem(storageKey, region);
    } catch {
      // The selection still works when browser storage is unavailable.
    }
  };

  options.forEach(option => option.addEventListener('click', () => {
    const region = option.dataset.region;
    if (!Object.hasOwn(urls, region)) return;
    manuallySelected = true;
    controller.abort();
    applyRegion(region);
    saveRegion(region);
    selector.open = false;
    toggle.focus();
  }));

  document.addEventListener('click', (event) => {
    if (!selector.contains(event.target)) selector.open = false;
  });
  selector.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      selector.open = false;
      toggle.focus();
    }
  });
  selector.addEventListener('focusout', (event) => {
    if (!selector.contains(event.relatedTarget)) selector.open = false;
  });

  let savedRegion;
  try {
    savedRegion = localStorage.getItem(storageKey);
  } catch {
    // Private browsing or storage restrictions must not block shopping.
  }

  if (Object.hasOwn(urls, savedRegion)) {
    applyRegion(savedRegion);
    return;
  }

  applyRegion('US');

  // Keep the destination stable if a purchase starts before geolocation finishes.
  links.forEach((link) => link.addEventListener('click', () => {
    manuallySelected = true;
    controller.abort();
  }, { once: true }));

  const timeout = setTimeout(() => controller.abort(), 3000);
  fetch('https://api.country.is/', {
    signal: controller.signal,
    credentials: 'omit',
    referrerPolicy: 'no-referrer',
  })
    .then((response) => {
      if (!response.ok) throw new Error('Country lookup failed');
      return response.json();
    })
    .then((result) => {
      if (manuallySelected || controller.signal.aborted || !/^[A-Z]{2}$/.test(result?.country)) return;
      const region = result.country === 'CA' ? 'CA' : 'US';
      applyRegion(region);
      saveRegion(region);
    })
    .catch(() => {
      // Keep USA as the working fallback; allow another lookup on a later visit.
    })
    .finally(() => clearTimeout(timeout));
})();
