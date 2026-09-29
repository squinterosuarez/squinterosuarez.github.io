(function () {
  "use strict";

  /* ---------- theme toggle ---------- */
  var root = document.documentElement;
  var stored = null;
  try { stored = localStorage.getItem("sq-theme"); } catch (e) {}
  if (stored === "dark" || stored === "light") {
    root.setAttribute("data-theme", stored);
  }

  function currentTheme() {
    var attr = root.getAttribute("data-theme");
    if (attr) return attr;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  function updateToggleLabel(btn) {
    if (!btn) return;
    var t = currentTheme();
    btn.textContent = t === "dark" ? "☀" : "☾";
    btn.setAttribute("aria-label", t === "dark" ? "Switch to light mode" : "Switch to dark mode");
  }

  document.querySelectorAll("[data-theme-toggle]").forEach(function (btn) {
    updateToggleLabel(btn);
    btn.addEventListener("click", function () {
      var next = currentTheme() === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("sq-theme", next); } catch (e) {}
      document.querySelectorAll("[data-theme-toggle]").forEach(updateToggleLabel);
    });
  });

  /* ---------- mobile nav ---------- */
  var burger = document.querySelector("[data-nav-burger]");
  var mobileNav = document.querySelector("[data-nav-mobile]");
  if (burger && mobileNav) {
    burger.addEventListener("click", function () {
      var isOpen = mobileNav.classList.toggle("is-open");
      burger.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
    mobileNav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        mobileNav.classList.remove("is-open");
        burger.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- expandable cards (publications) ---------- */
  document.querySelectorAll("[data-toggle]").forEach(function (head) {
    var bodyId = head.getAttribute("aria-controls");
    var body = bodyId ? document.getElementById(bodyId) : null;
    if (!body) return;
    var inner = body.querySelector(".pub-card__body-inner");

    head.addEventListener("click", function () {
      var expanded = head.getAttribute("aria-expanded") === "true";
      if (expanded) {
        body.style.maxHeight = body.scrollHeight + "px";
        requestAnimationFrame(function () {
          body.style.maxHeight = "0px";
        });
        body.classList.remove("is-open");
        head.setAttribute("aria-expanded", "false");
      } else {
        body.classList.add("is-open");
        head.setAttribute("aria-expanded", "true");
        var h = inner ? inner.offsetHeight : body.scrollHeight;
        body.style.maxHeight = h + "px";
      }
    });

    body.addEventListener("transitionend", function () {
      if (head.getAttribute("aria-expanded") === "true") {
        body.style.maxHeight = "none";
      }
    });
  });

  window.addEventListener("resize", function () {
    document.querySelectorAll('[data-toggle][aria-expanded="true"]').forEach(function (head) {
      var body = document.getElementById(head.getAttribute("aria-controls"));
      if (body) body.style.maxHeight = "none";
    });
  });

  /* ---------- publication filter chips ---------- */
  var filterRow = document.querySelector("[data-filter-row]");
  if (filterRow) {
    var chips = Array.prototype.slice.call(filterRow.querySelectorAll(".filter-chip"));
    var cards = Array.prototype.slice.call(document.querySelectorAll("[data-category]"));

    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        chips.forEach(function (c) { c.setAttribute("aria-pressed", "false"); });
        chip.setAttribute("aria-pressed", "true");
        var target = chip.getAttribute("data-filter");
        cards.forEach(function (card) {
          var match = target === "all" || card.getAttribute("data-category") === target;
          card.style.display = match ? "" : "none";
        });
        document.querySelectorAll(".group-header").forEach(function (gh) {
          var groupCat = gh.getAttribute("data-group");
          var anyVisible = target === "all" || target === groupCat;
          gh.style.display = anyVisible ? "" : "none";
        });
      });
    });
  }
})();
