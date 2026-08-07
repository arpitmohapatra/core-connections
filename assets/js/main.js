/**
 * Core Connections Physiotherapy — site-wide behaviour.
 * No dependencies, no build step. Everything here degrades gracefully:
 * if JS fails to load, the mobile nav panel and accordions are still
 * present in the DOM (just always "open"), and nothing else on the page
 * depends on script running.
 */
(function () {
  "use strict";

  /* ---- Mobile nav toggle ------------------------------------------------ */
  var navToggle = document.querySelector("[data-nav-toggle]");
  var navMobile = document.querySelector("[data-nav-mobile]");

  if (navToggle && navMobile) {
    navToggle.addEventListener("click", function () {
      var isOpen = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!isOpen));
      navMobile.classList.toggle("is-open", !isOpen);
      document.body.style.overflow = !isOpen ? "hidden" : "";
    });

    // Close the mobile panel on nav (helps back/forward + same-page anchors).
    navMobile.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        navToggle.setAttribute("aria-expanded", "false");
        navMobile.classList.remove("is-open");
        document.body.style.overflow = "";
      });
    });
  }

  /* ---- Accordion (policies page) ---------------------------------------- */
  document.querySelectorAll("[data-accordion-trigger]").forEach(function (trigger) {
    var panel = document.getElementById(trigger.getAttribute("aria-controls"));
    if (!panel) return;
    var inner = panel.querySelector(".accordion-panel-inner");

    trigger.addEventListener("click", function () {
      var isOpen = trigger.getAttribute("aria-expanded") === "true";
      trigger.setAttribute("aria-expanded", String(!isOpen));
      if (!isOpen) {
        panel.style.setProperty("--panel-height", inner.offsetHeight + "px");
        panel.classList.add("is-open");
      } else {
        panel.classList.remove("is-open");
      }
    });
  });

  // Open an accordion item automatically if the page was loaded with a
  // matching #hash (e.g. a footer link to policies.html#cancellation).
  if (window.location.hash) {
    var target = document.querySelector(
      '[data-accordion-trigger][aria-controls="' + window.location.hash.slice(1) + '"]'
    );
    if (target) target.click();
  }

  /* ---- Scroll-reveal (IntersectionObserver, not a scroll listener) ------ */
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var revealEls = document.querySelectorAll(".reveal");

  if (!reduceMotion && "IntersectionObserver" in window && revealEls.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---- Current-year footer stamp ---------------------------------------- */
  var yearEl = document.querySelector("[data-current-year]");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
