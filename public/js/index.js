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
