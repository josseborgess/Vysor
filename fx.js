// Micro-interacciones de VISORS (estilo 21st.dev): foco de luz que sigue el cursor, inclinación 3D,
// botones magnéticos, ondas al tocar, aparición al hacer scroll y rebote del carrito.
(function () {
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var SPOT = ".pcard,.glow,.detbox,.cta,.ghost,.thumb,.citem";
  var TILT = ".pcard,.glow";
  var MAG = ".cta,.ghost";

  if (fine && !reduce) {
    document.addEventListener("pointermove", function (e) {
      var el = e.target.closest && e.target.closest(SPOT);
      if (!el) return;
      var r = el.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
      el.style.setProperty("--mx", x + "px"); el.style.setProperty("--my", y + "px");
      if (el.matches(TILT)) {
        var px = x / r.width - .5, py = y / r.height - .5;
        el.style.setProperty("--ry", (px * 7).toFixed(2) + "deg");
        el.style.setProperty("--rx", (-py * 7).toFixed(2) + "deg");
        el.classList.add("tilting");
      }
      if (el.matches(MAG) && !el.disabled) {
        el.style.setProperty("--tx", ((x - r.width / 2) * .12).toFixed(1) + "px");
        el.style.setProperty("--ty", ((y - r.height / 2) * .22).toFixed(1) + "px");
      }
    }, { passive: true });
    document.addEventListener("pointerout", function (e) {
      var el = e.target.closest && e.target.closest(SPOT);
      if (!el || (e.relatedTarget && el.contains(e.relatedTarget))) return;
      el.classList.remove("tilting");
      ["--rx", "--ry", "--tx", "--ty"].forEach(function (p) { el.style.removeProperty(p); });
    }, { passive: true });
  }

  // Onda al tocar
  document.addEventListener("pointerdown", function (e) {
    if (reduce) return;
    var el = e.target.closest && e.target.closest(".cta,.ghost,.tab,.navbtn,.qty,.thumb");
    if (!el || el.disabled) return;
    var r = el.getBoundingClientRect(), s = Math.max(r.width, r.height) * 2.2;
    var w = document.createElement("span");
    w.className = "rpl";
    w.style.cssText = "width:" + s + "px;height:" + s + "px;left:" + (e.clientX - r.left - s / 2) + "px;top:" + (e.clientY - r.top - s / 2) + "px";
    el.appendChild(w);
    setTimeout(function () { w.remove(); }, 650);
  }, { passive: true });

  // Aparición al hacer scroll
  var io = ("IntersectionObserver" in window && !reduce) ? new IntersectionObserver(function (es) {
    es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
  }, { rootMargin: "0px 0px -8% 0px", threshold: .08 }) : null;
  var seen = new WeakSet();
  function scan() {
    if (!io) return;
    document.querySelectorAll("#inicio section h2, #inicio section > div > p, .glow, .pnl, .detbox").forEach(function (el) {
      if (seen.has(el)) return; seen.add(el);
      var r = el.getBoundingClientRect();
      if (r.top < innerHeight && r.bottom > 0) return; // ya visible: no lo escondemos
      el.classList.add("rv"); io.observe(el);
    });
  }

  // Rebote del contador del carrito
  var lastCount = null;
  function bump() {
    var b = document.querySelector(".cbadge"); if (!b) return;
    var n = b.textContent;
    if (lastCount !== null && n !== lastCount && !reduce) { b.classList.remove("bump"); void b.offsetWidth; b.classList.add("bump"); }
    lastCount = n;
  }

  var pending = false;
  var mo = new MutationObserver(function () {
    if (pending) return; pending = true;
    requestAnimationFrame(function () { pending = false; scan(); bump(); });
  });
  function start() {
    var root = document.getElementById("app"); if (!root) return;
    mo.observe(root, { subtree: true, childList: true, characterData: true });
    scan(); bump();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
