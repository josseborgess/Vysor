// Indicador "liquid glass": se estira entre el botón anterior y el nuevo y rebota al llegar.
(function () {
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var state = new WeakMap();
  function geo(bar, el) { return { x: el.offsetLeft, w: el.offsetWidth }; }
  function place(bar) {
    var lq = bar.querySelector(":scope > .lq");
    var on = bar.querySelector(":scope > .on");
    if (!lq) return;
    if (!on) { lq.style.opacity = "0"; state.delete(bar); return; }
    var g = geo(bar, on), prev = state.get(bar);
    lq.style.opacity = "1";
    if (!prev || prev.el === on) {
      if (!prev || prev.x !== g.x || prev.w !== g.w) { lq.style.left = g.x + "px"; lq.style.width = g.w + "px"; }
      state.set(bar, { el: on, x: g.x, w: g.w });
      return;
    }
    var a = prev, left = Math.min(a.x, g.x), right = Math.max(a.x + a.w, g.x + g.w);
    var dir = g.x > a.x ? 1 : -1;
    lq.style.left = g.x + "px"; lq.style.width = g.w + "px";
    if (!reduce && lq.animate) {
      lq.animate([
        { left: a.x + "px", width: a.w + "px", transform: "scale(1,1)" },
        { left: left + "px", width: (right - left) + "px", transform: "scale(1,.78)", offset: .42 },
        { left: (g.x + dir * 6) + "px", width: (g.w - 4) + "px", transform: "scale(1,1.08)", offset: .75 },
        { left: g.x + "px", width: g.w + "px", transform: "scale(1,1)" }
      ], { duration: 620, easing: "cubic-bezier(.3,.7,.2,1)" });
      var ic = on.querySelector(".ic");
      if (ic) { ic.classList.remove("pop"); void ic.offsetWidth; ic.classList.add("pop"); }
    }
    state.set(bar, { el: on, x: g.x, w: g.w });
  }
  function all() { document.querySelectorAll(".lqbar").forEach(place); }
  var mo = new MutationObserver(function () { requestAnimationFrame(all); });
  function start() {
    var root = document.getElementById("app");
    if (!root) return;
    mo.observe(root, { subtree: true, childList: true, attributes: true, attributeFilter: ["class"] });
    all();
  }
  window.addEventListener("resize", function () { document.querySelectorAll(".lqbar").forEach(function (b) { state.delete(b); }); all(); });
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { document.querySelectorAll(".lqbar").forEach(function (b) { state.delete(b); }); all(); });
})();
