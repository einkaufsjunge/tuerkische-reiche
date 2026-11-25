/* Bewegung für alle Seiten. Läuft nicht bei "reduzierte Bewegung". Ohne dieses Skript bleibt alles sichtbar. */
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var root = document.documentElement;
  root.classList.add('js');

  var h1 = document.querySelector('.hero h1');
  if (h1) {
    var text = h1.textContent.trim();
    h1.setAttribute('aria-label', text);
    h1.textContent = '';
    text.split(' ').forEach(function (word, i, all) {
      var w = document.createElement('span');
      w.className = 'w'; w.setAttribute('aria-hidden', 'true');
      var inner = document.createElement('span');
      inner.style.setProperty('--i', i);
      inner.textContent = word + (i < all.length - 1 ? ' ' : '');
      w.appendChild(inner); h1.appendChild(w);
    });
  }
  requestAnimationFrame(function () { requestAnimationFrame(function () { root.classList.add('ready'); }); });

  var targets = document.querySelectorAll('main h2:not(.entry h2), main .lead, main .timeline li, .stars-text, .tile, .entry, .sultan, .table-wrap');
  targets.forEach(function (el) { el.classList.add('reveal'); });
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      var n = 0;
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.style.transitionDelay = Math.min(n++, 5) * 45 + 'ms';
        e.target.classList.add('in');
        io.unobserve(e.target);
        setTimeout(function (t) { t.style.transitionDelay = ''; }, 800, e.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    targets.forEach(function (el) { io.observe(el); });
  } else {
    targets.forEach(function (el) { el.classList.add('in'); });
  }

  var tl = document.querySelector('.timeline');
  if (tl) {
    var fill = document.createElement('span');
    fill.className = 'tl-fill'; fill.setAttribute('aria-hidden', 'true');
    tl.appendChild(fill);
    var items = Array.prototype.slice.call(tl.querySelectorAll('li'));
    var ticking = false;
    var update = function () {
      ticking = false;
      var line = window.innerHeight * 0.55;
      var r = tl.getBoundingClientRect();
      fill.style.transform = 'scaleY(' + Math.max(0, Math.min(1, (line - r.top) / r.height)).toFixed(4) + ')';
      var active = null;
      items.forEach(function (li) { if (li.getBoundingClientRect().top < line) active = li; });
      items.forEach(function (li) { li.classList.toggle('active', li === active); });
    };
    var onScroll = function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
  }
})();
