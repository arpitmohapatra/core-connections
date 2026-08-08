// Mobile nav toggle + scroll-reveal utility, shared across every page.

document.addEventListener('DOMContentLoaded', () => {
  // Mobile nav toggle
  const toggle = document.querySelector('.nav__toggle');
  const menu = document.querySelector('.nav__menu');

  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const isOpen = menu.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });

    menu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        menu.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Scroll-reveal: elements with [data-reveal] fade/slide in on first view
  const revealEls = document.querySelectorAll('[data-reveal]');
  if (revealEls.length && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach((el) => revealObserver.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  // Signature moment: the spine-curve divider draws itself in on scroll,
  // echoing the spine model two clinicians are photographed holding —
  // "Core Connections" as a literal line, not a stock icon.
  const spineEls = document.querySelectorAll('.spine-divider');
  if (spineEls.length && 'IntersectionObserver' in window) {
    const spineObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            spineObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    spineEls.forEach((el) => spineObserver.observe(el));
  } else {
    spineEls.forEach((el) => el.classList.add('is-visible'));
  }
});
