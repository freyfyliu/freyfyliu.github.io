// Lightweight behavior for the static CV website.
// This file keeps the site dependency-free and GitHub Pages friendly.

(function () {
  const year = new Date().getFullYear();
  document.querySelectorAll("[data-current-year]").forEach((node) => {
    node.textContent = year;
  });
})();