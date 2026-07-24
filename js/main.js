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
  var revealEls = document.querySelectorAll(".reveal, .reveal-zoom");

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
});
