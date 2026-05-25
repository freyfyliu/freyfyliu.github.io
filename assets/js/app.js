/* ==========================================================================
   app.js — tiny dependency-free router for the left-master / right-detail site.

   Behaviour mandated by the design spec:
     · "#/"  (home)      → body[data-view="home"]; the interactive deep field is
                            shown and the two columns share ONE document scroll.
     · "#/<page>"        → body[data-view="page"]; the matching view is cloned
                            into the right pane, which scrolls INDEPENDENTLY of
                            the persistent left column.
   No build step, no dependencies — GitHub-Pages friendly.
   ========================================================================== */
(function () {
  "use strict";

  var ROUTES = {
    thistle:  { tpl: "tpl-thistle",  title: "The THISTLE survey" },
    cv:       { tpl: "tpl-cv",       title: "Academic CV", cv: true },
    gallery:  { tpl: "tpl-gallery",  title: "Gallery" },
    students: { tpl: "tpl-students", title: "Students" }
  };
  var SITE = "Feng-Yuan \u201CFrey\u201D Liu";

  var body   = document.body;
  var detail = document.getElementById("detail");
  var master = document.querySelector(".master");

  var deepfieldMounted = false;

  /* Mount the interactive image lazily the first time the home view is shown
     (so a deep-linked sub-page on first load doesn't measure a hidden panel). */
  function ensureDeepfield() {
    if (deepfieldMounted) return;
    var el = document.getElementById("deepfield");
    if (el && window.DeepField && typeof window.DeepField.mount === "function") {
      try {
        window.DeepField.mount(el, { base: "assets/img/deepfield/" });
        deepfieldMounted = true;
      } catch (e) { /* leave the dark panel in place if it can't start */ }
    }
  }

  /* Swap broken images for their bundled placeholder (img_thistle / img0…3 /
     student photos are optional drop-ins). */
  function wireFallbacks(scope) {
    var imgs = scope.querySelectorAll("img[data-fallback]");
    Array.prototype.forEach.call(imgs, function (img) {
      img.addEventListener("error", function handle() {
        img.removeEventListener("error", handle);
        var fb = img.getAttribute("data-fallback");
        if (fb && img.src.indexOf(fb) === -1) img.src = fb;
      });
      // If the browser already errored before the listener attached, re-test.
      if (img.complete && img.naturalWidth === 0) {
        var fb = img.getAttribute("data-fallback");
        if (fb) img.src = fb;
      }
    });
  }

  function parseHash() {
    var h = (location.hash || "").replace(/^#\/?/, "").trim().toLowerCase();
    h = h.replace(/\/+$/, "");           // tolerate a trailing slash
    return h;                            // "" → home
  }

  function showHome() {
    detail.innerHTML = "";
    detail.className = "detail";
    body.setAttribute("data-view", "home");
    document.title = SITE + " \u2014 Extragalactic astronomer";
    ensureDeepfield();
    // single-document scroll back to the top
    window.scrollTo(0, 0);
  }

  function showPage(key) {
    var route = ROUTES[key];
    var is404 = !route;
    var tplId = is404 ? "tpl-404" : route.tpl;
    var tpl = document.getElementById(tplId);

    detail.className = "detail" + (route && route.cv ? " cv" : "");
    detail.innerHTML = "";
    if (tpl && "content" in tpl) {
      detail.appendChild(tpl.content.cloneNode(true));
    }
    wireFallbacks(detail);

    body.setAttribute("data-view", "page");
    document.title = (is404 ? "Not found" : route.title) + " \u2014 " + SITE;

    // independent panes: reset each to the top
    if (master) master.scrollTop = 0;
    detail.scrollTop = 0;
  }

  function render() {
    var key = parseHash();
    if (key === "" ) { showHome(); return; }
    if (key === "404") { showPage("404"); return; }
    showPage(key);            // unknown keys fall through to the 404 view
  }

  window.addEventListener("hashchange", render);
  // Smoothly scroll links that target the current view are no-ops; fine.
  render();
})();
