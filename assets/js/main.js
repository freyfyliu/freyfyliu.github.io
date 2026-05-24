// Static-site utility hooks. No dependencies; safe for GitHub Pages.
(function () {
  const year = new Date().getFullYear();
  document.querySelectorAll("[data-current-year]").forEach((node) => {
    node.textContent = year;
  });
})();
