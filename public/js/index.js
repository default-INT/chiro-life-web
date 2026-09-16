document.getElementById('footerYear').innerHTML = new Date().getFullYear();
SVGInject(document.querySelectorAll('.injectable-svg'));

document.querySelectorAll('[data-analytics-event]').forEach((element) => {
  element.addEventListener('click', () => {
    if (typeof window.gtag !== 'function') {
      return;
    }

    window.gtag('event', element.dataset.analyticsEvent, {
      link_url: element.href,
      link_text: element.textContent.trim(),
      transport_type: 'beacon',
    });
  });
});

const header = document.querySelector('.header');
const menuToggle = document.querySelector('.header-menu-toggle');
const navigationLinks = document.querySelectorAll('.header-navigation-link');

if (header && menuToggle) {
  menuToggle.addEventListener('click', () => {
    const isOpen = header.classList.toggle('header-menu-open');

    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navigationLinks.forEach((link) => {
    link.addEventListener('click', () => {
      header.classList.remove('header-menu-open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const editorialTocLinks = Array.from(document.querySelectorAll('.editorial-toc a[href^="#"]'));

if (editorialTocLinks.length) {
  const tocItems = editorialTocLinks.map((link) => ({
    link,
    section: document.getElementById(decodeURIComponent(link.hash.slice(1))),
  })).filter((item) => item.section);
  let activeTocLink;
  let tocFrame;

  const setActiveTocLink = (link) => {
    if (!link || link === activeTocLink) return;

    tocItems.forEach((item) => {
      const isActive = item.link === link;
      item.link.classList.toggle('is-active', isActive);
      if (isActive) item.link.setAttribute('aria-current', 'location');
      else item.link.removeAttribute('aria-current');
    });
    activeTocLink = link;
  };

  const updateEditorialToc = () => {
    tocFrame = null;
    const marker = window.scrollY + Math.min(window.innerHeight * 0.28, 240) + (header?.offsetHeight || 0);
    let current = tocItems[0];

    tocItems.forEach((item) => {
      if (item.section.getBoundingClientRect().top + window.scrollY <= marker) current = item;
    });

    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
      current = tocItems[tocItems.length - 1];
    }

    setActiveTocLink(current?.link);
  };

  const requestTocUpdate = () => {
    if (!tocFrame) tocFrame = window.requestAnimationFrame(updateEditorialToc);
  };

  tocItems.forEach(({ link }) => {
    link.addEventListener('click', () => setActiveTocLink(link));
  });
  window.addEventListener('scroll', requestTocUpdate, { passive: true });
  window.addEventListener('resize', requestTocUpdate);
  window.addEventListener('hashchange', requestTocUpdate);
  updateEditorialToc();
}

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

// Keep native details semantics; animate the measured height in both directions.
document.querySelectorAll('.faq-list details').forEach((details) => {
  const summary = details.querySelector('summary');
  const answer = details.querySelector('p');
  let desiredOpen = details.open;
  let animation;
  let answerAnimation;

  const finish = () => {
    details.open = desiredOpen;
    details.style.overflow = '';
    details.removeAttribute('data-closing');
    animation?.cancel();
    answerAnimation?.cancel();
    animation = answerAnimation = null;
    summary.setAttribute('aria-expanded', String(desiredOpen));
  };

  summary.addEventListener('click', (event) => {
    event.preventDefault();
    const startHeight = details.getBoundingClientRect().height;
    const startOpacity = details.open ? getComputedStyle(answer).opacity : '0';
    desiredOpen = animation ? !desiredOpen : !details.open;
    animation?.cancel();
    answerAnimation?.cancel();
    summary.setAttribute('aria-expanded', String(desiredOpen));
    if (prefersReducedMotion.matches || typeof details.animate !== 'function') {
      finish();
      return;
    }
    details.open = true;
    details.toggleAttribute('data-closing', !desiredOpen);
    details.style.overflow = 'hidden';
    const endHeight = desiredOpen ? details.getBoundingClientRect().height : summary.getBoundingClientRect().height + parseFloat(getComputedStyle(details).borderBottomWidth);
    const timing = { duration: 380, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' };
    animation = details.animate({ height: [`${startHeight}px`, `${endHeight}px`] }, timing);
    answerAnimation = answer.animate({ opacity: [startOpacity, desiredOpen ? '1' : '0'] }, timing);
    animation.onfinish = finish;
  });

  prefersReducedMotion.addEventListener('change', () => { if (prefersReducedMotion.matches) finish(); });
});

const motionGroups = [
  // Interior pages use the same restrained reveal language as the homepage:
  // short vertical travel, generous easing and small content staggers.
  { selector: '.editorial-hero .breadcrumb', type: 'reveal' },
  { selector: '.editorial-intro > div > *', type: 'reveal', delay: 85 },
  { selector: '.editorial-image', type: 'scale' },
  { selector: '.editorial-toc', type: 'reveal' },
  { selector: '.editorial-section', type: 'reveal', delay: 55 },
  { selector: '.guide-grid .guide-card', type: 'scale', delay: 70 },
  { selector: '.related-section .section-heading', type: 'reveal' },
  { selector: '.product-callout .page-container > *', type: 'reveal', delay: 80 },
  { selector: '.seller-feedback .section-heading', type: 'reveal' },
  { selector: '.seller-feedback .feedback-note', type: 'reveal' },
  { selector: '.product-use .product-detail-image', type: 'scale' },
  { selector: '.product-use .product-detail-copy > *', type: 'reveal', delay: 70 },
  { selector: '.product-page .support-links > *', type: 'reveal', delay: 55 },
  { selector: '.ingredients-section .section-heading', type: 'reveal' },
  { selector: '.ingredients-image-card', type: 'scale' },
  { selector: '.ingredient-card', type: 'reveal', delay: 90 },
  { selector: '.origin-title, .origin-copy p', type: 'reveal', delay: 100 },
  { selector: '.origin-image', type: 'scale' },
  { selector: '.benefits-copy .section-title, .benefits-description', type: 'reveal', delay: 100 },
  { selector: '.benefit-item', type: 'reveal', delay: 90 },
  { selector: '.benefits-visual', type: 'scale' },
  { selector: '.purpose-copy > .eyebrow, .purpose-title, .purpose-description > p, .purpose-promise', type: 'reveal', delay: 90 },
  { selector: '.purpose-image', type: 'scale' },
  { selector: '.results-section .section-heading', type: 'reveal' },
  { selector: '.result-card', type: 'reveal', delay: 90 },
  { selector: '.results-action', type: 'reveal' },
  { selector: '.product-faq .section-heading', type: 'reveal', repeat: true },
  { selector: '.faq-list details', type: 'reveal', delay: 35, repeat: true },
  { selector: '.product-faq .product-closing', type: 'reveal', repeat: true },
];

const motionElements = motionGroups.flatMap((group) => {
  const elements = Array.from(document.querySelectorAll(group.selector));

  elements.forEach((element, index) => {
    const motionClass = group.type === 'scale' ? 'motion-reveal-scale' : 'motion-reveal';

    element.classList.add(motionClass);
    element.style.setProperty('--motion-delay', `${index * (group.delay || 0)}ms`);
    if (group.repeat) element.dataset.motionRepeat = 'true';
  });

  return elements;
});

const showMotionElement = (element) => {
  element.classList.add('is-visible');

  element.addEventListener('transitionend', () => {
    element.classList.add('motion-complete');
  }, { once: true });
};

if (prefersReducedMotion.matches || !('IntersectionObserver' in window)) {
  motionElements.forEach(showMotionElement);
} else {
  header.classList.add('motion-header-enter');

  const motionRootMargin = window.matchMedia('(max-width: 767px)').matches
    ? '0px'
    : '0px 0px -8% 0px';

  const motionObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        if (entry.target.dataset.motionRepeat && !entry.target.matches(':focus-within')) {
          entry.target.classList.remove('is-visible', 'motion-complete');
        }
        return;
      }

      showMotionElement(entry.target);
      if (!entry.target.dataset.motionRepeat) observer.unobserve(entry.target);
    });
  }, {
    rootMargin: motionRootMargin,
    threshold: 0.12,
  });

  motionElements.forEach((element) => motionObserver.observe(element));
}
