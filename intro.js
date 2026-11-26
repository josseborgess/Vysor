// Intro de VISORS: el isotipo se dibuja, las letras aparecen una a una y con un toque se entra a la tienda.
(function () {
  var el = document.getElementById("intro");
  if (!el) return;
  var seen = false;
  try { seen = sessionStorage.getItem("visors_intro") === "1"; } catch (e) {}
  if (seen) { el.remove(); return; }
  document.documentElement.classList.add("intro-on");
  var ready = false, gone = false;
  setTimeout(function () { ready = true; el.classList.add("ready"); }, 1200);
  function enter() {
    if (gone) return; gone = true;
    try { sessionStorage.setItem("visors_intro", "1"); } catch (e) {}
    el.classList.add("out");
    try { window.dispatchEvent(new Event("vysor:introdone")); } catch (e) {}
    document.documentElement.classList.remove("intro-on");
    setTimeout(function () { el.remove(); }, 1300);
  }
  el.addEventListener("click", enter);
  el.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " " || e.key === "Tab" || e.key === "Escape") { e.preventDefault(); enter(); } });
  try { el.focus({ preventScroll: true }); } catch (e) { el.focus(); }
})();
