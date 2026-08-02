// script.js
// Handles mobile menu toggle, reveal on scroll, and dynamic year

document.addEventListener('DOMContentLoaded', () => {
  // Mobile menu toggle
  const menuButton = document.querySelector('[data-menu-button]');
  const siteNav = document.querySelector('[data-nav]');
  if (menuButton && siteNav) {
    menuButton.addEventListener('click', () => {
      const expanded = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', !expanded);
      siteNav.classList.toggle('open', !expanded);
    });
  }

  // Reveal elements on scroll using IntersectionObserver
  const revealElements = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  revealElements.forEach(el => observer.observe(el));

  // Insert current year in footer
  const yearSpan = document.querySelector('[data-year]');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
});
