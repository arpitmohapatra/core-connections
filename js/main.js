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

  // Kinetic: headlines rise word by word; stats count up on first view.
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!reduceMotion) {
    document.querySelectorAll('.hero h1, .page-header h1').forEach((h1) => {
      if (h1.children.length) return;
      const words = h1.textContent.trim().split(/\s+/);
      h1.setAttribute('aria-label', words.join(' '));
      h1.textContent = '';
      words.forEach((word, i) => {
        const span = document.createElement('span');
        span.className = 'rise-word' + (i === words.length - 1 ? ' rise-word--hl' : '');
        span.style.setProperty('--i', i);
        span.setAttribute('aria-hidden', 'true');
        span.textContent = word;
        h1.appendChild(span);
        if (i < words.length - 1) h1.appendChild(document.createTextNode(' '));
      });
    });

    const statEls = document.querySelectorAll('.stat-row .stat b');
    if (statEls.length && 'IntersectionObserver' in window) {
      const statObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            statObserver.unobserve(entry.target);
            const el = entry.target;
            const target = parseInt(el.textContent, 10);
            if (!target) return;
            const t0 = performance.now();
            const tick = (t) => {
              const x = Math.min(1, (t - t0) / 1600);
              el.textContent = String(Math.round(target * (1 - Math.pow(1 - x, 3))));
              if (x < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
          });
        },
        { threshold: 0.6 }
      );
      statEls.forEach((el) => statObserver.observe(el));
    }
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
