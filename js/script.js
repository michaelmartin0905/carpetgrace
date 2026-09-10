/* =========================================================
   CARPETGRACE — Vanilla JavaScript
   Mobile nav, active states, filtering, reveal animation.
   ========================================================= */
(function () {
  'use strict';

  /* ---------- Mobile Navigation ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var navList = document.querySelector('.nav-list');

  if (toggle && navList) {
    toggle.addEventListener('click', function () {
      var isOpen = navList.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    navList.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navList.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 900) {
        navList.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  /* ---------- Active Navigation State ---------- */
  var currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-list a, .footer-nav a').forEach(function (link) {
    var href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.setAttribute('aria-current', 'page');
    }
  });

  /* ---------- Scroll Reveal ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- Carpet Collection Filtering ---------- */
  var filterBar = document.querySelector('.filter-list');
  var pieces = document.querySelectorAll('.piece');
  var noResults = document.querySelector('.no-results');
  var filterCount = document.querySelector('.filter-count');

  function applyFilter(category) {
    var visibleCount = 0;
    pieces.forEach(function (piece) {
      var matches = category === 'all' || piece.getAttribute('data-category') === category;
      if (matches) {
        piece.classList.remove('is-hidden');
        visibleCount++;
      } else {
        piece.classList.add('is-hidden');
      }
    });

    if (noResults) {
      noResults.classList.toggle('is-visible', visibleCount === 0);
    }
    if (filterCount) {
      filterCount.textContent = visibleCount + (visibleCount === 1 ? ' carpet' : ' carpets');
    }
  }

  if (filterBar && pieces.length) {
    filterBar.addEventListener('click', function (e) {
      var btn = e.target.closest('.filter-btn');
      if (!btn) return;

      filterBar.querySelectorAll('.filter-btn').forEach(function (b) {
        b.classList.remove('is-active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('is-active');
      btn.setAttribute('aria-pressed', 'true');

      applyFilter(btn.getAttribute('data-filter'));
    });

    applyFilter('all');
  }

  /* ---------- Smooth Scroll for in-page anchors ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId.length < 2) return;
      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      }
    });
  });

  /* ---------- Video: pause offscreen videos to save resources ---------- */
  var videos = document.querySelectorAll('video[data-autopause]');
  if ('IntersectionObserver' in window && videos.length) {
    var vio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var v = entry.target;
        if (!entry.isIntersecting && !v.paused) {
          v.pause();
        }
      });
    }, { threshold: 0.2 });
    videos.forEach(function (v) { vio.observe(v); });
  }

})();
