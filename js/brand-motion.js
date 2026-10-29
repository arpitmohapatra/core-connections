/*
  Brand motion: logo animations from the brand motion spec.
  - data-motion="reveal": plays once on load (splash screen marks)
  - data-motion="hover":  plays a short step when the logo's link is hovered/focused (headers)
  Logos are <img> by default. This script fetches the SVG and inlines it so its
  parts can be animated. If that fails (file://, offline) or the visitor prefers
  reduced motion, the static <img> stays, which is the logo's final frame.
*/
(function () {
  'use strict';

  var imgs = Array.prototype.slice.call(document.querySelectorAll('img[data-motion]'));
  if (!imgs.length || !window.fetch || !Element.prototype.animate) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!/^https?:$/.test(location.protocol)) return;

  var SETTLE = 'cubic-bezier(.2,.8,.2,1)';
  var POP = 'cubic-bezier(.3,1.7,.5,1)';
  var DRAW = 'cubic-bezier(.6,0,.2,1)';
  var uid = 0;

  function anim(el, keyframes, opts) {
    return el.animate(keyframes, Object.assign({ fill: 'both', easing: SETTLE }, opts));
  }

  function prepare(svg) {
    var box = { transformBox: 'view-box' };
    svg.querySelectorAll('.ring').forEach(function (c) {
      Object.assign(c.style, box, { transformOrigin: '50px 44px', transform: 'rotate(-90deg)', strokeDasharray: '125.66' });
    });
    svg.querySelectorAll('.rings,.core').forEach(function (c) {
      Object.assign(c.style, box, { transformOrigin: '100px 85px' });
    });
    svg.querySelectorAll('.arc').forEach(function (c) {
      Object.assign(c.style, box, { transformOrigin: '50px 70px' });
    });
  }

  function reveal(svg) {
    svg.querySelectorAll('.rings').forEach(function (g) {
      anim(g, [{ transform: 'rotate(-120deg) scale(.55)' }, { transform: 'none' }], { duration: 1600 });
    });
    ['.r1', '.r2', '.r3'].forEach(function (sel, i) {
      svg.querySelectorAll(sel).forEach(function (e) {
        anim(e, [{ opacity: 0 }, { opacity: 1 }], { duration: 600, delay: i * 120, easing: 'ease-out' });
      });
    });
    svg.querySelectorAll('.core').forEach(function (e) {
      anim(e, [{ transform: 'scale(0)' }, { transform: 'scale(1)' }], { duration: 900, delay: 950, easing: POP });
      anim(e, [{ transform: 'scale(1)' }, { transform: 'scale(1.08)' }, { transform: 'scale(1)' }],
        { duration: 4000, delay: 2400, iterations: Infinity, easing: 'ease-in-out', fill: 'none' });
    });
    svg.querySelectorAll('.arc').forEach(function (e) {
      anim(e, [{ opacity: 0, transform: 'translateY(14px)' }, { opacity: 1, transform: 'none' }], { duration: 1100 });
    });
    svg.querySelectorAll('.ring').forEach(function (e) {
      anim(e, [{ strokeDashoffset: 125.66 }, { strokeDashoffset: 0 }], { duration: 1400, delay: 550, easing: DRAW });
      anim(e, [{ transform: 'rotate(-90deg) scale(1)' }, { transform: 'rotate(-90deg) scale(1.06)' }, { transform: 'rotate(-90deg) scale(1)' }],
        { duration: 8000, delay: 2600, iterations: Infinity, easing: 'ease-in-out', fill: 'none' });
    });
  }

  function hover(svg) {
    svg.querySelectorAll('.rings').forEach(function (g) {
      anim(g, [{ transform: 'rotate(0deg)' }, { transform: 'rotate(120deg)' }], { duration: 700, fill: 'none' });
    });
    svg.querySelectorAll('.core').forEach(function (e) {
      anim(e, [{ transform: 'scale(1)' }, { transform: 'scale(1.12)' }, { transform: 'scale(1)' }],
        { duration: 700, fill: 'none', easing: 'ease-in-out' });
    });
    svg.querySelectorAll('.ring').forEach(function (e) {
      anim(e, [{ transform: 'rotate(-90deg) translateX(0)' }, { transform: 'rotate(-90deg) translateX(3px)' }, { transform: 'rotate(-90deg) translateX(0)' }],
        { duration: 900, fill: 'none', easing: 'ease-in-out' });
    });
  }

  function inline(img) {
    var mode = img.getAttribute('data-motion');
    var id = 'bm' + (++uid) + '-';
    if (mode === 'reveal') img.classList.add('motion-pending');
    return fetch(img.getAttribute('src'))
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.text(); })
      .then(function (text) {
        // Unique mask ids so several inlined logos on one page can't collide
        text = text.replace(/id="(m\d+[abc]?)"/g, 'id="' + id + '$1"')
                   .replace(/url\(#(m\d+[abc]?)\)/g, 'url(#' + id + '$1)');
        var tpl = document.createElement('template');
        tpl.innerHTML = text.trim();
        var svg = tpl.content.querySelector('svg');
        if (!svg) throw new Error('no svg');

        var h = img.getBoundingClientRect().height;
        svg.removeAttribute('width');
        svg.removeAttribute('height');
        svg.setAttribute('class', img.className.replace('motion-pending', '').trim());
        svg.setAttribute('aria-label', img.getAttribute('alt') || svg.getAttribute('aria-label') || '');
        svg.style.cssText = 'display:block;overflow:visible;width:auto;height:' + (h || img.height) + 'px';
        prepare(svg);
        img.replaceWith(svg);

        if (mode === 'reveal') {
          reveal(svg);
        } else if (mode === 'hover') {
          var host = svg.closest('a') || svg;
          var playing = false;
          var play = function () {
            if (playing) return;
            playing = true;
            hover(svg);
            setTimeout(function () { playing = false; }, 900);
          };
          host.addEventListener('mouseenter', play);
          host.addEventListener('focus', play);
        }
      })
      .catch(function () { img.classList.remove('motion-pending'); });
  }

  imgs.forEach(inline);
})();
