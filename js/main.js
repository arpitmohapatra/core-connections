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

  // Clinic chooser: a first-visit dialog ("which clinic are you looking for?").
  // Built here so any page with the ribbon's [data-open-chooser] button can open
  // it. Remembering a choice only suppresses the prompt; it never redirects,
  // since the pessary site links back here.
  const CHOICE_KEY = 'cc-clinic';
  const safeGet = (store, key) => {
    try { return window[store].getItem(key); } catch (e) { return null; }
  };
  const safeSet = (store, key, value) => {
    try { window[store].setItem(key, value); } catch (e) { /* storage unavailable */ }
  };

  let chooser = null;
  const getChooser = () => {
    if (chooser) return chooser;
    if (typeof HTMLDialogElement === 'undefined') return null;
    chooser = document.createElement('dialog');
    chooser.className = 'clinic-chooser';
    chooser.setAttribute('aria-labelledby', 'clinic-chooser-title');
    chooser.innerHTML =
      '<button type="button" class="clinic-chooser__close" aria-label="Close">&times;</button>' +
      '<h2 id="clinic-chooser-title">Which clinic are you looking for?</h2>' +
      '<p class="clinic-chooser__lede">Choose where you would like to start. You can switch at any time.</p>' +
      '<div class="clinic-chooser__grid">' +
        '<button type="button" class="clinic-card" data-clinic="core">' +
          '<span class="clinic-card__logo"><img src="images/logo.jpg" alt="" width="144" height="30"></span>' +
          '<span class="clinic-card__name">Core Connections Physiotherapy</span>' +
          '<span class="clinic-card__desc">Pelvic health, pre &amp; postnatal and orthopedic physiotherapy in Westboro, Ottawa.</span>' +
          '<span class="clinic-card__go">Continue to this site &rarr;</span>' +
        '</button>' +
        '<a class="clinic-card clinic-card--pessary" href="pessary/index.html" data-clinic="pessary">' +
          '<span class="clinic-card__logo"><img src="pessary/logo-mark.svg" alt="" width="52" height="52"></span>' +
          '<span class="clinic-card__name">Ottawa Pessary Clinic</span>' +
          '<span class="clinic-card__desc">Pessary fitting and care. Officially opening January 2027.</span>' +
          '<span class="clinic-card__go">Go to the clinic &rarr;</span>' +
        '</a>' +
      '</div>';
    document.body.appendChild(chooser);

    chooser.querySelector('.clinic-chooser__close').addEventListener('click', () => chooser.close());
    chooser.querySelector('[data-clinic="core"]').addEventListener('click', () => {
      safeSet('localStorage', CHOICE_KEY, 'core');
      chooser.close();
    });
    chooser.querySelector('[data-clinic="pessary"]').addEventListener('click', () => {
      safeSet('localStorage', CHOICE_KEY, 'pessary');
    });
    // Clicking the dimmed backdrop dismisses, like Esc
    chooser.addEventListener('click', (event) => {
      if (event.target === chooser) chooser.close();
    });
    chooser.addEventListener('close', () => {
      document.documentElement.classList.remove('chooser-open');
      // A plain dismissal asks again next session, not on every page view
      if (!safeGet('localStorage', CHOICE_KEY)) safeSet('sessionStorage', CHOICE_KEY, 'dismissed');
    });
    return chooser;
  };

  const openChooser = () => {
    const dialog = getChooser();
    if (!dialog || dialog.open) return;
    document.documentElement.classList.add('chooser-open');
    dialog.showModal();
  };

  document.querySelectorAll('[data-open-chooser]').forEach((btn) => {
    btn.addEventListener('click', openChooser);
  });

  if (document.body.dataset.clinicChooser === 'auto') {
    const forced = new URLSearchParams(window.location.search).has('choose');
    const answered = safeGet('localStorage', CHOICE_KEY) || safeGet('sessionStorage', CHOICE_KEY);
    if (forced || !answered) openChooser();
  }
});
