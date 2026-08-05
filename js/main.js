// Shared site-wide behavior: mobile nav toggle + footer year.

document.addEventListener("DOMContentLoaded", function () {
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".main-nav");

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  }

  var yearEl = document.querySelector("[data-current-year]");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  var prefersMotion = window.matchMedia("(prefers-reduced-motion: no-preference)").matches;
  var revealEls = document.querySelectorAll(".reveal, .reveal-zoom, .reveal-left, .reveal-right, .reveal-pop");

  if (prefersMotion && "IntersectionObserver" in window && revealEls.length) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  if (prefersMotion) {
    var parallaxEl = document.querySelector(".hero-parallax");
    if (parallaxEl) {
      var ticking = false;
      window.addEventListener(
        "scroll",
        function () {
          if (!ticking) {
            window.requestAnimationFrame(function () {
              var offset = Math.min(window.scrollY * 0.15, 50);
              parallaxEl.style.transform = "translateY(" + offset + "px)";
              ticking = false;
            });
            ticking = true;
          }
        },
        { passive: true }
      );
    }
  }

  // ---- Scroll progress bar -------------------------------------------------
  var progress = document.querySelector(".scroll-progress span");
  if (progress) {
    var progTicking = false;
    var updateProgress = function () {
      var doc = document.documentElement;
      var scrollable = doc.scrollHeight - window.innerHeight;
      var pct = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
      progress.style.width = Math.min(Math.max(pct, 0), 100) + "%";
      progTicking = false;
    };
    window.addEventListener("scroll", function () {
      if (!progTicking) {
        window.requestAnimationFrame(updateProgress);
        progTicking = true;
      }
    }, { passive: true });
    window.addEventListener("resize", updateProgress, { passive: true });
    updateProgress();
  }

  // ---- Count-up stats ------------------------------------------------------
  // Each [data-count-to] animates from 0 the first time it scrolls into view.
  var counters = document.querySelectorAll("[data-count-to]");
  if (counters.length) {
    var runCount = function (el) {
      var target = parseFloat(el.getAttribute("data-count-to")) || 0;
      var suffix = el.getAttribute("data-count-suffix") || "";
      if (!prefersMotion) {
        el.textContent = target + suffix;
        return;
      }
      var dur = 1400;
      var start = null;
      var step = function (ts) {
        if (start === null) { start = ts; }
        var t = Math.min((ts - start) / dur, 1);
        var eased = 1 - Math.pow(1 - t, 3);
        el.textContent = Math.round(target * eased) + suffix;
        if (t < 1) { window.requestAnimationFrame(step); }
      };
      window.requestAnimationFrame(step);
    };

    if ("IntersectionObserver" in window) {
      var countObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            runCount(entry.target);
            countObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.4 });
      Array.prototype.forEach.call(counters, function (el) { countObserver.observe(el); });
    } else {
      Array.prototype.forEach.call(counters, runCount);
    }
  }

  // ---- Color name marquee --------------------------------------------------
  // Track is duplicated so the -50% translate loops seamlessly.
  var track = document.querySelector(".color-marquee__track");
  if (track) {
    var chips = document.querySelectorAll(".color-chip");
    var entries = [];
    Array.prototype.forEach.call(chips, function (chip) {
      var dot = chip.querySelector(".color-chip__dot");
      var nameEl = chip.querySelector(".color-chip__name");
      if (dot && nameEl) {
        entries.push({ name: nameEl.textContent, style: dot.getAttribute("style") || "" });
      }
    });
    if (entries.length) {
      var buildRun = function () {
        var frag = document.createDocumentFragment();
        entries.forEach(function (e) {
          var item = document.createElement("span");
          item.className = "color-marquee__item";
          var swatch = document.createElement("i");
          swatch.setAttribute("style", e.style);
          item.appendChild(swatch);
          item.appendChild(document.createTextNode(e.name));
          frag.appendChild(item);
        });
        return frag;
      };
      track.appendChild(buildRun());
      track.appendChild(buildRun());
    }
  }
});
