/* Carousel behavior for components/carousel.html.
   Works with any number of carousels on the same page. */
(function () {
  "use strict";

  function initCarousel(root) {
    var track = root.querySelector('[data-carousel="track"]');
    var dots = root.querySelector('[data-carousel="dots"]');
    var prev = root.querySelector('[data-carousel="prev"]');
    var next = root.querySelector('[data-carousel="next"]');
    if (!track || !dots || !prev || !next) return;

    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    function maxScroll() {
      return Math.max(0, track.scrollWidth - track.clientWidth);
    }

    function pageCount() {
      if (!track.clientWidth) return 1;
      return Math.max(1, Math.ceil(track.scrollWidth / track.clientWidth));
    }

    /* Scroll position of each page, clamped to the end of the track */
    function targets() {
      var list = [];
      for (var i = 0; i < pageCount(); i++) {
        list.push(Math.min(i * track.clientWidth, maxScroll()));
      }
      return list;
    }

    function currentPage() {
      var list = targets();
      var page = 0;
      for (var i = 1; i < list.length; i++) {
        if (
          Math.abs(list[i] - track.scrollLeft) <
          Math.abs(list[page] - track.scrollLeft)
        ) {
          page = i;
        }
      }
      return page;
    }

    function goTo(page) {
      var list = targets();
      var index = Math.max(0, Math.min(list.length - 1, page));
      track.scrollTo({
        left: list[index],
        behavior: reduceMotion.matches ? "auto" : "smooth",
      });
    }

    function sync() {
      prev.disabled = track.scrollLeft <= 1;
      next.disabled =
        track.scrollLeft + track.clientWidth >= track.scrollWidth - 1;

      var page = currentPage();
      Array.prototype.forEach.call(dots.children, function (dot, index) {
        if (index === page) dot.setAttribute("aria-current", "page");
        else dot.removeAttribute("aria-current");
      });
    }

    function buildDots() {
      dots.innerHTML = "";
      var total = pageCount();
      dots.hidden = total <= 1;

      for (var i = 0; i < total; i++) {
        var dot = document.createElement("button");
        dot.type = "button";
        dot.className = "carousel__dot";
        dot.dataset.page = String(i);
        dot.setAttribute(
          "aria-label",
          "Ir para o grupo " + (i + 1) + " de " + total,
        );
        dots.appendChild(dot);
      }

      sync();
    }

    prev.addEventListener("click", function () {
      goTo(currentPage() - 1);
    });

    next.addEventListener("click", function () {
      goTo(currentPage() + 1);
    });

    dots.addEventListener("click", function (event) {
      var dot = event.target.closest(".carousel__dot");
      if (dot) goTo(Number(dot.dataset.page));
    });

    track.addEventListener("scroll", sync, { passive: true });

    if ("ResizeObserver" in window) {
      new ResizeObserver(buildDots).observe(track);
    } else {
      window.addEventListener("resize", buildDots);
    }

    buildDots();
  }

  function init() {
    Array.prototype.forEach.call(
      document.querySelectorAll("[data-carousel-root]"),
      initCarousel,
    );
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
