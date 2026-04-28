/* ============================================================
   HOUNTER — Main JavaScript
   Interactions: Navbar, Property filter, Search tabs,
   Scroll animations, Favorites toggle
   ============================================================ */

(function () {
  'use strict';

  /* ======================== DOM READY ======================== */
  document.addEventListener('DOMContentLoaded', function () {
    initNavbar();
    initSearchTabs();
    initPropertyFilter();
    initScrollAnimations();
    initFavoriteButtons();
    initSmoothScroll();
  });

  /* ======================== NAVBAR ======================== */
  function initNavbar() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');

    // Scroll effect
    window.addEventListener('scroll', function () {
      if (window.scrollY > 20) {
        navbar.classList.add('navbar--scrolled');
      } else {
        navbar.classList.remove('navbar--scrolled');
      }
    }, { passive: true });

    // Hamburger toggle
    if (hamburger && navMenu) {
      hamburger.addEventListener('click', function () {
        const isOpen = navMenu.classList.toggle('is-open');
        hamburger.classList.toggle('is-active', isOpen);
        hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        document.body.style.overflow = isOpen ? 'hidden' : '';
      });

      // Close menu when a nav link is clicked
      navMenu.querySelectorAll('.navbar__link').forEach(function (link) {
        link.addEventListener('click', function () {
          navMenu.classList.remove('is-open');
          hamburger.classList.remove('is-active');
          document.body.style.overflow = '';
        });
      });

      // Close on outside click
      document.addEventListener('click', function (e) {
        if (!navbar.contains(e.target) && navMenu.classList.contains('is-open')) {
          navMenu.classList.remove('is-open');
          hamburger.classList.remove('is-active');
          document.body.style.overflow = '';
        }
      });
    }

    // Active link highlighting based on scroll position
    const sections = document.querySelectorAll('section[id], header[id]');
    const navLinks = document.querySelectorAll('.navbar__link');

    window.addEventListener('scroll', function () {
      let current = '';
      sections.forEach(function (section) {
        const sectionTop = section.offsetTop - 100;
        if (window.scrollY >= sectionTop) {
          current = section.getAttribute('id');
        }
      });

      navLinks.forEach(function (link) {
        link.classList.remove('navbar__link--active');
        const href = link.getAttribute('href');
        if (href === '#' + current || (current === 'home' && href === '#')) {
          link.classList.add('navbar__link--active');
        }
      });
    }, { passive: true });
  }

  /* ======================== SEARCH TABS ======================== */
  function initSearchTabs() {
    const tabs = document.querySelectorAll('.search-bar__tab');
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        tabs.forEach(function (t) { t.classList.remove('search-bar__tab--active'); });
        tab.classList.add('search-bar__tab--active');
      });
    });
  }

  /* ======================== PROPERTY FILTER ======================== */
  function initPropertyFilter() {
    const tabs = document.querySelectorAll('.properties__tab');
    const cards = document.querySelectorAll('.property-card');

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        const filter = tab.getAttribute('data-filter');

        // Update active tab
        tabs.forEach(function (t) { t.classList.remove('properties__tab--active'); });
        tab.classList.add('properties__tab--active');

        // Filter cards with animation
        cards.forEach(function (card) {
          const category = card.getAttribute('data-category');

          if (filter === 'all' || category === filter) {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.95)';
            card.classList.remove('hidden');
            requestAnimationFrame(function () {
              requestAnimationFrame(function () {
                card.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
                card.style.opacity = '1';
                card.style.transform = 'scale(1)';
              });
            });
          } else {
            card.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
            card.style.opacity = '0';
            card.style.transform = 'scale(0.95)';
            setTimeout(function () {
              card.classList.add('hidden');
            }, 250);
          }
        });
      });
    });
  }

  /* ======================== SCROLL ANIMATIONS ======================== */
  function initScrollAnimations() {
    // Add reveal classes to elements
    const animateTargets = [
      { selector: '.stats__item', cls: 'reveal', delays: true },
      { selector: '.property-card', cls: 'reveal', delays: true },
      { selector: '.step', cls: 'reveal', delays: true },
      { selector: '.testimonial-card', cls: 'reveal', delays: true },
      { selector: '.hero__content', cls: 'reveal-left', delays: false },
      { selector: '.hero__visual', cls: 'reveal-right', delays: false },
      { selector: '.how-it-works__visual', cls: 'reveal-left', delays: false },
      { selector: '.how-it-works__content', cls: 'reveal-right', delays: false },
      { selector: '.cta-banner__content', cls: 'reveal-left', delays: false },
      { selector: '.section-header', cls: 'reveal', delays: false },
    ];

    animateTargets.forEach(function (target) {
      const elements = document.querySelectorAll(target.selector);
      elements.forEach(function (el, i) {
        el.classList.add(target.cls);
        if (target.delays) {
          el.classList.add('reveal-delay-' + ((i % 5) + 1));
        }
      });
    });

    // Intersection Observer
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ======================== FAVORITE BUTTONS ======================== */
  function initFavoriteButtons() {
    const favButtons = document.querySelectorAll('.property-card__fav');

    favButtons.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        const isActive = btn.classList.toggle('property-card__fav--active');

        // Swap SVG fill
        const svg = btn.querySelector('path');
        if (svg) {
          svg.setAttribute('fill', isActive ? 'currentColor' : 'none');
        }

        // Micro-animation
        btn.style.transform = 'scale(1.35)';
        setTimeout(function () {
          btn.style.transform = 'scale(1)';
          btn.style.transition = 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
        }, 10);
        setTimeout(function () {
          btn.style.transform = '';
          btn.style.transition = '';
        }, 350);
      });
    });
  }

  /* ======================== SMOOTH SCROLL ======================== */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        const href = anchor.getAttribute('href');
        if (href === '#') return;

        const target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();
        const navbarHeight = parseInt(getComputedStyle(document.documentElement)
          .getPropertyValue('--navbar-height'), 10) || 76;

        window.scrollTo({
          top: target.offsetTop - navbarHeight,
          behavior: 'smooth'
        });
      });
    });
  }

  /* ======================== COUNTER ANIMATION ======================== */
  function animateCounter(el, target, suffix) {
    const duration = 1800;
    const start = performance.now();
    const from = 0;

    function update(time) {
      const elapsed = time - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(from + (target - from) * eased);
      el.textContent = current.toLocaleString() + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }
    requestAnimationFrame(update);
  }

  // Trigger counters when stats section is visible
  function initCounters() {
    const statNumbers = document.querySelectorAll('.stats__number');
    if (!statNumbers.length) return;

    const targets = [7500, 3200, 2100];
    const suffixes = ['+', '+', '+'];

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          statNumbers.forEach(function (el, i) {
            animateCounter(el, targets[i], suffixes[i]);
          });
          observer.disconnect();
        }
      });
    }, { threshold: 0.5 });

    if (statNumbers[0]) {
      observer.observe(statNumbers[0].closest('.stats'));
    }
  }

  document.addEventListener('DOMContentLoaded', initCounters);

})();
