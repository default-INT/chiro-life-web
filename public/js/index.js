document.getElementById('footerYear').innerHTML = new Date().getFullYear();
SVGInject(document.querySelectorAll('.injectable-svg'));

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

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const motionGroups = [
  { selector: '.hero-copy > *', type: 'reveal', delay: 90 },
  { selector: '.hero-product', type: 'scale', delay: 120 },
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
  { selector: '.footer-content > div', type: 'reveal' },
];

const motionElements = motionGroups.flatMap((group) => {
  const elements = Array.from(document.querySelectorAll(group.selector));

  elements.forEach((element, index) => {
    const motionClass = group.type === 'scale' ? 'motion-reveal-scale' : 'motion-reveal';

    element.classList.add(motionClass);
    element.style.setProperty('--motion-delay', `${index * (group.delay || 0)}ms`);
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
        return;
      }

      showMotionElement(entry.target);
      observer.unobserve(entry.target);
    });
  }, {
    rootMargin: motionRootMargin,
    threshold: 0.12,
  });

  motionElements.forEach((element) => motionObserver.observe(element));
}
