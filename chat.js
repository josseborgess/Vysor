// Asistente de VISORS: responde dudas frecuentes y de cada modelo, y pasa a soporte.
// Funciona 100% en el navegador: no envía la conversación a ningún servidor ni la guarda.
// Lo que el cliente escribe nunca se inserta como HTML (solo texto), para evitar inyecciones.
(function () {
  "use strict";

  // ===================== CONFIGURACIÓN (editar aquí) =====================
  var SUPPORT = {
    whatsapp: "",            // Número de soporte con código de país, solo dígitos. Ej: "13055551234"
    email: "",               // Correo de soporte. Ej: "soporte@vysor.shop"
    hours: { es: "Lunes a sábado, 9:00 a 18:00 (hora de Miami)", en: "Monday to Saturday, 9am to 6pm (Miami time)" }
  };
  // Textos de políticas: CONFIRMAR CON CÉSAR antes de vender en modo real.
  var POLICY = {
    shipping: {
      es: "Enviamos a Estados Unidos y Ecuador. Al confirmar tu pago te escribimos para coordinar la entrega y te enviamos el número de guía para que sigas tu paquete.",
      en: "We ship to the United States and Ecuador. Once your payment is confirmed we contact you to coordinate delivery and send you a tracking number."
    },
    returns: {
      es: "Si tu producto llega con un defecto o no es lo que pediste, escríbenos con tu número de pedido y lo revisamos contigo. Los productos de marca tienen la garantía de su fabricante.",
      en: "If your product arrives defective or isn't what you ordered, contact us with your order number and we'll sort it out with you. Branded products carry their manufacturer's warranty."
    }
  };
  // ======================================================================

  var lang = (window.VYSOR_LANG || document.documentElement.lang || "en").slice(0, 2) === "es" ? "es" : "en";
  var prices = {};
  var flow = null; // flujo de soporte en curso

  var T = {
    es: {
      open: "¿Dudas? Pregúntame", title: "Asistente VISORS", sub: "Respuestas al instante · soporte humano si lo necesitas",
      hello: "¡Hola! Soy el asistente de VISORS. Puedo ayudarte con envíos, pagos, garantías o cualquier modelo. ¿Qué necesitas?",
      ph: "Escribe tu pregunta…", send: "Enviar", close: "Cerrar",
      chips: ["Envíos", "Formas de pago", "Garantía y cambios", "¿Cuál me recomiendas?", "Tengo un problema con mi producto"],
      pay: "Pagas en la página segura de Stripe, la misma plataforma que usan Amazon y Shopify. Aceptamos tarjetas de crédito y débito, Apple Pay y Google Pay. Los datos de tu tarjeta van directo a Stripe: nosotros nunca los vemos ni los guardamos.",
      safe: "Tu compra es segura: el pago se procesa en Stripe con cifrado de nivel bancario, tu banco puede pedirte confirmación extra (3D Secure) y recibes el recibo de Stripe en tu correo.",
      order: "Al pagar, Stripe te envía el recibo a tu correo. Después te contactamos con el número de guía. Si quieres saber el estado de tu pedido, te paso con soporte; ten a mano el correo con el que compraste.",
      rx: "Algunos modelos aceptan lentes con graduación: Even Realities G2 (graduación a medida), Tifosi Moab XC (adaptador RX) y los Rudy Project (inserto óptico). Para las Meta y Ray-Ban Meta la graduación se hace con ópticas autorizadas. ¿Quieres que soporte te confirme tu caso?",
      compat: "Las gafas inteligentes funcionan con iPhone y Android mediante la app de cada marca (Meta AI para Ray-Ban Meta y Meta; Even para las G2; Samsung con Galaxy). Las de running y deporte no necesitan app.",
      price: function (lo, hi) { return "Tenemos modelos desde " + lo + " hasta " + hi + ". Dime para qué los quieres (correr, ciclismo, nieve o inteligentes) y te recomiendo."; },
      recIntro: "Te recomiendo estos para ", recNames: { smart: "uso diario con IA", running: "correr", sport: "ciclismo y nieve" },
      ask: "¿Para qué las quieres usar? Elige una opción:", recChips: ["Gafas inteligentes", "Para correr", "Ciclismo o nieve"],
      view: "Ver modelo", from: "Precio", launch: "Lanzamiento",
      fallback: "No estoy seguro de haber entendido. Puedo ayudarte con envíos, pagos, garantía, graduación o con cualquier modelo. Si prefieres, te paso con una persona de soporte.",
      human: "Hablar con soporte",
      trouble: "Siento el inconveniente. Antes de pasarte con soporte, prueba esto:\n1. Carga las gafas en su estuche al menos 30 minutos.\n2. Cierra y abre la app de la marca, y revisa que el Bluetooth esté activado.\n3. Reinicia las gafas siguiendo el manual del fabricante.\n¿Se solucionó?",
      solved: "Sí, se solucionó", notSolved: "No, necesito soporte",
      glad: "¡Qué bueno! Si necesitas algo más, aquí estoy.",
      s1: "Te paso con soporte técnico. Primero unos datos para atenderte rápido. ¿Cuál es tu nombre?",
      s2: "Gracias. ¿Con qué correo hiciste la compra? (o tu número de pedido)",
      s3: "¿Qué modelo tienes?",
      s4: "Cuéntame qué está pasando con el producto (lo más detallado posible).",
      sDone: "Listo. Envía este resumen a soporte y te responderemos lo antes posible.",
      sWa: "Enviar por WhatsApp", sMail: "Enviar por correo", sHours: "Horario de soporte: ",
      sNone: "El canal de soporte aún no está activo. Guarda este resumen y escríbenos cuando esté disponible.",
      sCancel: "Cancelar", sCancelled: "Listo, cancelé la solicitud. ¿Te ayudo con algo más?",
      sum: { title: "Solicitud de soporte VISORS", name: "Nombre", contact: "Correo o pedido", product: "Producto", issue: "Problema" },
      bad: "Ese dato parece incompleto, ¿me lo escribes de nuevo?"
    },
    en: {
      open: "Questions? Ask me", title: "VISORS Assistant", sub: "Instant answers · human support when you need it",
      hello: "Hi! I'm the VISORS assistant. I can help with shipping, payments, warranty or any model. What do you need?",
      ph: "Type your question…", send: "Send", close: "Close",
      chips: ["Shipping", "Payment options", "Warranty & returns", "What do you recommend?", "I have a problem with my product"],
      pay: "You pay on Stripe's secure checkout, the same platform used by Amazon and Shopify. We accept credit and debit cards, Apple Pay and Google Pay. Your card details go straight to Stripe: we never see or store them.",
      safe: "Your purchase is safe: payment is processed by Stripe with bank-grade encryption, your bank may ask for extra confirmation (3D Secure), and you get Stripe's receipt by email.",
      order: "When you pay, Stripe emails you a receipt. Then we contact you with your tracking number. To check your order status I can connect you with support; have the email you used at checkout handy.",
      rx: "Some models take prescription lenses: Even Realities G2 (custom prescription), Tifosi Moab XC (RX adapter) and Rudy Project models (optical insert). For Meta and Ray-Ban Meta, prescriptions are done by authorized opticians. Want support to confirm your case?",
      compat: "Smart glasses work with iPhone and Android through each brand's app (Meta AI for Ray-Ban Meta and Meta; Even for G2; Samsung with Galaxy). Running and sport models need no app.",
      price: function (lo, hi) { return "Our models range from " + lo + " to " + hi + ". Tell me what you need them for (running, cycling, snow or smart) and I'll recommend some."; },
      recIntro: "I recommend these for ", recNames: { smart: "everyday AI use", running: "running", sport: "cycling and snow" },
      ask: "What will you use them for? Pick one:", recChips: ["Smart glasses", "Running", "Cycling or snow"],
      view: "View model", from: "Price", launch: "Launch",
      fallback: "I'm not sure I understood. I can help with shipping, payments, warranty, prescriptions or any model. Or I can connect you with a support person.",
      human: "Talk to support",
      trouble: "Sorry about that. Before I connect you with support, try this:\n1. Charge the glasses in their case for at least 30 minutes.\n2. Close and reopen the brand's app and check Bluetooth is on.\n3. Restart the glasses following the manufacturer's manual.\nDid that fix it?",
      solved: "Yes, it's fixed", notSolved: "No, I need support",
      glad: "Great! If you need anything else, I'm here.",
      s1: "I'll connect you with technical support. First a few details so we can help you fast. What's your name?",
      s2: "Thanks. What email did you use to buy? (or your order number)",
      s3: "Which model do you have?",
      s4: "Tell me what's happening with the product (as much detail as possible).",
      sDone: "Done. Send this summary to support and we'll get back to you as soon as possible.",
      sWa: "Send via WhatsApp", sMail: "Send by email", sHours: "Support hours: ",
      sNone: "The support channel isn't active yet. Keep this summary and contact us once it's available.",
      sCancel: "Cancel", sCancelled: "OK, I cancelled the request. Anything else I can help with?",
      sum: { title: "VISORS support request", name: "Name", contact: "Email or order", product: "Product", issue: "Issue" },
      bad: "That looks incomplete, could you type it again?"
    }
  };

  // ---------- utilidades ----------
  function norm(s) { return String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim(); }
  function has(q, words) { for (var i = 0; i < words.length; i++) { var w = words[i]; if ((" " + q + " ").indexOf(" " + w) >= 0) return true; } return false; }
  function money(n) { return "$" + Number(n).toLocaleString("en-US"); }
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function products() { return window.VYSOR_PRODUCTS || []; }
  function t() { return T[lang]; }

  // ---------- interfaz ----------
  var root = el("div", "vc-root");
  var fab = el("button", "vc-fab");
  fab.type = "button";
  var orb = el("span", "vc-orb"); orb.setAttribute("aria-hidden", "true");
  ["vc-swirl", "vc-blob vc-b1", "vc-blob vc-b2", "vc-blob vc-b3", "vc-glass"].forEach(function (c) { orb.appendChild(el("span", c)); });
  var fabTxt = el("span", "vc-tip");
  fab.appendChild(orb); fab.appendChild(fabTxt);
  var panel = el("section", "vc-panel");
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-modal", "false");
  panel.hidden = true;
  var head = el("header", "vc-head");
  var hTitle = el("div", "vc-title"), hSub = el("div", "vc-sub");
  var hText = el("div"); hText.appendChild(hTitle); hText.appendChild(hSub);
  var xBtn = el("button", "vc-x", "×"); xBtn.type = "button";
  head.appendChild(hText); head.appendChild(xBtn);
  var log = el("div", "vc-log"); log.setAttribute("aria-live", "polite");
  var form = el("form", "vc-form");
  var input = el("input", "vc-in"); input.maxLength = 500; input.autocomplete = "off";
  var sendBtn = el("button", "vc-send"); sendBtn.type = "submit";
  form.appendChild(input); form.appendChild(sendBtn);
  panel.appendChild(head); panel.appendChild(log); panel.appendChild(form);
  root.appendChild(panel); root.appendChild(fab);

  function labels() {
    fabTxt.textContent = t().open; fab.setAttribute("aria-label", t().open);
    hTitle.textContent = t().title; hSub.textContent = t().sub;
    xBtn.setAttribute("aria-label", t().close);
    input.placeholder = t().ph; sendBtn.textContent = t().send;
    panel.setAttribute("aria-label", t().title);
  }

  function scroll() { log.scrollTop = log.scrollHeight; }
  function bot(text) { var m = el("div", "vc-msg vc-bot"); String(text).split("\n").forEach(function (line, i) { if (i) m.appendChild(document.createElement("br")); m.appendChild(document.createTextNode(line)); }); log.appendChild(m); scroll(); return m; }
  function me(text) { log.appendChild(el("div", "vc-msg vc-me", text)); scroll(); }
  function chips(list) {
    var wrap = el("div", "vc-chips");
    list.forEach(function (c) {
      var b = el("button", "vc-chip", c.label || c); b.type = "button";
      b.onclick = function () { wrap.remove(); if (c.action) c.action(); else handle(c.label || c); };
      wrap.appendChild(b);
    });
    log.appendChild(wrap); scroll();
  }
  function productCard(p) {
    var c = el("div", "vc-card");
    var img = el("img"); img.src = p.img; img.alt = ""; img.loading = "lazy";
    var info = el("div", "vc-cinfo");
    info.appendChild(el("div", "vc-cname", p.name));
    info.appendChild(el("div", "vc-cshort", p.short || ""));
    var meta = [];
    if (prices[p.i] != null) meta.push(t().from + ": " + money(prices[p.i]));
    if (p.date) meta.push(t().launch + ": " + p.date);
    info.appendChild(el("div", "vc-cmeta", meta.join(" · ")));
    var b = el("button", "vc-cbtn", t().view); b.type = "button";
    b.onclick = function () { window.dispatchEvent(new CustomEvent("vysor:open", { detail: p.i })); if (window.matchMedia("(max-width: 640px)").matches) toggle(false); };
    info.appendChild(b);
    c.appendChild(img); c.appendChild(info);
    log.appendChild(c); scroll();
  }

  // ---------- conocimiento ----------
  var ALIASES = [
    [0, ["gen 3", "gen3", "ray ban meta gen"]], [1, ["meta audio", "ray ban audio", "sin camara", "no camera"]], [2, ["capri", "nova", "meta glasses"]],
    [3, ["adventurer"]], [4, ["samsung", "galaxy"]], [5, ["snap", "specs"]], [6, ["even", "g2", "realities"]],
    [7, ["sungod", "ultras"]], [8, ["cybr", "lightning"]], [9, ["astral"]], [10, ["bolle", "trailchaser"]], [11, ["adidas", "kentro"]],
    [12, ["tifosi", "moab"]], [13, ["eye jacket", "redux"]], [14, ["radar", "heater"]], [15, ["bisphaera"]], [16, ["sphaera strike", "strike"]],
    [17, ["rslv"]], [18, ["performance 40", "titanio", "titanium"]], [19, ["poc", "ciasma"]], [20, ["spy", "crosspoint"]]
  ];
  function findProducts(q) {
    var out = [];
    ALIASES.forEach(function (a) { if (has(q, a[1])) out.push(a[0]); });
    if (!out.length && has(q, ["ray ban", "rayban"])) out = [0, 1];
    if (!out.length && has(q, ["oakley"])) out = [8, 14, 15, 16, 17];
    if (!out.length && has(q, ["rudy"])) out = [9, 18];
    return out.slice(0, 3);
  }
  function recommend(k) {
    var ps = products().filter(function (p) { return p.k === k; });
    bot(t().recIntro + t().recNames[k] + ":");
    var pick = { smart: [0, 6, 3], running: [7, 8, 12], sport: [14, 17, 19] }[k];
    pick.forEach(function (i) { var p = products()[i]; if (p) productCard(p); });
    if (!ps.length) bot(t().fallback);
  }

  function support() {
    flow = { step: 1, data: {} };
    bot(t().s1);
    chips([{ label: t().sCancel, action: cancelFlow }]);
  }
  function cancelFlow() { flow = null; bot(t().sCancelled); }
  function flowAnswer(text) {
    var v = text.trim();
    if (v.length < 2) { bot(t().bad); return; }
    if (flow.step === 1) { flow.data.name = v.slice(0, 80); flow.step = 2; bot(t().s2); return; }
    if (flow.step === 2) { flow.data.contact = v.slice(0, 120); flow.step = 3; bot(t().s3); chips(products().map(function (p) { return { label: p.name, action: function () { me(p.name); flowAnswer(p.name); } }; }).slice(0, 21)); return; }
    if (flow.step === 3) { flow.data.product = v.slice(0, 80); flow.step = 4; bot(t().s4); return; }
    if (flow.step === 4) { flow.data.issue = v.slice(0, 600); finishFlow(); }
  }
  function finishFlow() {
    var d = flow.data, s = t().sum; flow = null;
    var text = s.title + "\n" + s.name + ": " + d.name + "\n" + s.contact + ": " + d.contact + "\n" + s.product + ": " + d.product + "\n" + s.issue + ": " + d.issue;
    bot(t().sDone);
    var box = el("div", "vc-summary", text); log.appendChild(box);
    var acts = el("div", "vc-chips");
    var any = false;
    if (/^\d{8,15}$/.test(SUPPORT.whatsapp)) {
      var a = el("a", "vc-chip vc-primary", t().sWa); a.href = "https://wa.me/" + SUPPORT.whatsapp + "?text=" + encodeURIComponent(text); a.target = "_blank"; a.rel = "noopener noreferrer"; acts.appendChild(a); any = true;
    }
    if (/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(SUPPORT.email)) {
      var m = el("a", "vc-chip", t().sMail); m.href = "mailto:" + SUPPORT.email + "?subject=" + encodeURIComponent(s.title) + "&body=" + encodeURIComponent(text); acts.appendChild(m); any = true;
    }
    if (any) { log.appendChild(acts); bot(t().sHours + SUPPORT.hours[lang]); } else bot(t().sNone);
    scroll();
  }

  function handle(raw) {
    var text = String(raw || "").slice(0, 500);
    if (!text.trim()) return;
    me(text);
    if (flow) { flowAnswer(text); return; }
    var q = norm(text);

    if (has(q, ["problema", "falla", "fallo", "no funciona", "no enciende", "no prende", "no carga", "no conecta", "roto", "rota", "dano", "danado", "defect", "broken", "not working", "doesn t work", "wont", "won t", "issue", "problem", "repair", "reparar"])) {
      bot(t().trouble);
      chips([{ label: t().solved, action: function () { me(t().solved); bot(t().glad); } }, { label: t().notSolved, action: function () { me(t().notSolved); support(); } }]);
      return;
    }
    if (has(q, ["soporte", "humano", "persona", "asesor", "agente", "hablar con", "contacto", "contactar", "support", "human", "agent", "someone", "talk to", "contact"])) { support(); return; }

    var found = findProducts(q);
    if (found.length) { found.forEach(function (i) { var p = products()[i]; if (p) productCard(p); }); return; }

    if (has(q, ["envio", "envios", "enviar", "entrega", "llega", "demora", "tarda", "shipping", "ship", "deliver", "delivery", "arrive"])) { bot(POLICY.shipping[lang]); return; }
    if (has(q, ["devolu", "devolver", "garantia", "cambio", "reembolso", "return", "refund", "warranty", "exchange"])) { bot(POLICY.returns[lang]); chips([t().human]); return; }
    if (has(q, ["pedido", "orden", "guia", "rastreo", "seguimiento", "estado de mi", "order", "tracking", "track", "where is"])) { bot(t().order); chips([t().human]); return; }
    if (has(q, ["pago", "pagar", "tarjeta", "apple pay", "google pay", "paypal", "cuotas", "credito", "debito", "payment", "pay", "card", "credit", "debit", "forma"])) { bot(t().pay); return; }
    if (has(q, ["seguro", "segura", "confiable", "fraude", "estafa", "safe", "secure", "trust", "scam", "legit"])) { bot(t().safe); return; }
    if (has(q, ["graduacion", "graduadas", "receta", "medida", "optica", "prescription", "rx", "optical"])) { bot(t().rx); chips([t().human]); return; }
    if (has(q, ["iphone", "android", "app", "compatib", "celular", "telefono", "phone"])) { bot(t().compat); return; }
    if (has(q, ["inteligente", "smart", "ia ", "ai ", "meta", "camara", "camera"])) { recommend("smart"); return; }
    if (has(q, ["correr", "running", "run", "runner", "trail", "maraton", "marathon"])) { recommend("running"); return; }
    if (has(q, ["ciclismo", "bici", "bicicleta", "cycling", "bike", "nieve", "esqui", "ski", "snow", "deporte", "sport", "goggle", "mascara"])) { recommend("sport"); return; }
    if (has(q, ["precio", "cuesta", "cuanto", "barato", "caro", "price", "cost", "cheap", "expensive", "how much"])) {
      var v = Object.keys(prices).map(function (k) { return prices[k]; });
      if (v.length) bot(t().price(money(Math.min.apply(null, v)), money(Math.max.apply(null, v)))); else bot(t().fallback);
      chips(t().recChips); return;
    }
    if (has(q, ["recomienda", "recomiendas", "recomendar", "cual", "cuales", "mejor", "recommend", "which", "best", "suggest"])) { bot(t().ask); chips(t().recChips); return; }
    if (has(q, ["hola", "buenas", "buenos", "hi", "hello", "hey"])) { bot(t().hello); chips(t().chips); return; }
    if (has(q, ["gracias", "thanks", "thank"])) { bot(t().glad); return; }

    bot(t().fallback);
    chips([t().human]);
  }

  // Botones rápidos con texto fijo -> intenciones directas
  var CHIP_MAP = {
    "Gafas inteligentes": function () { recommend("smart"); }, "Smart glasses": function () { recommend("smart"); },
    "Para correr": function () { recommend("running"); }, "Running": function () { recommend("running"); },
    "Ciclismo o nieve": function () { recommend("sport"); }, "Cycling or snow": function () { recommend("sport"); },
    "Hablar con soporte": support, "Talk to support": support
  };
  var _handle = handle;
  handle = function (raw) { if (CHIP_MAP[raw]) { me(raw); CHIP_MAP[raw](); return; } _handle(raw); };

  var started = false;
  function toggle(open) {
    panel.hidden = !open; fab.setAttribute("aria-expanded", String(open)); root.classList.toggle("vc-open", open);
    if (open && !started) { started = true; bot(t().hello); chips(t().chips); }
    if (open) setTimeout(function () { input.focus(); }, 50);
  }
  fab.onclick = function () { toggle(panel.hidden); };
  xBtn.onclick = function () { toggle(false); };
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !panel.hidden) toggle(false); });
  form.addEventListener("submit", function (e) { e.preventDefault(); var v = input.value; input.value = ""; handle(v); });

  window.addEventListener("vysor:lang", function (e) { lang = e.detail === "es" ? "es" : "en"; labels(); });

  // Colores del orbe: toma los del modelo que se está mostrando en la web.
  function hexes(g) { return (String(g || "").match(/#[0-9a-fA-F]{6}/g) || []); }
  function _mixWhite(h, k) { var n = parseInt(h.slice(1), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255; var f = function (v) { return Math.round(v + (255 - v) * k); }; return "#" + [f(r), f(g), f(b)].map(function (v) { return v.toString(16).padStart(2, "0"); }).join(""); }
  function lum(h) { var n = parseInt(h.slice(1), 16); return 0.2126 * (n >> 16) + 0.7152 * ((n >> 8) & 255) + 0.0722 * (n & 255); }
  function toHsl(h) { var n = parseInt(h.slice(1), 16), r = (n >> 16) / 255, g = ((n >> 8) & 255) / 255, b = (n & 255) / 255; var mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, d = mx - mn, s = 0, hh = 0; if (d) { s = d / (1 - Math.abs(2 * l - 1)); hh = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; hh *= 60; if (hh < 0) hh += 360; } return [hh, s, l]; }
  function hsl(h, s, l) { return "hsl(" + Math.round((h + 360) % 360) + " " + Math.round(s * 100) + "% " + Math.round(l * 100) + "%)"; }
  function theme(g) {
    var hs = hexes(g); if (!hs.length) return;
    // El color más saturado del modelo es la base; los otros dos son vecinos de tono, como los colores de Siri.
    var best = hs.map(toHsl).sort(function (a, b) { return (b[1] * (1 - Math.abs(b[2] - 0.55))) - (a[1] * (1 - Math.abs(a[2] - 0.55))); })[0];
    var h = best[0], s = Math.max(0.65, best[1]);
    root.style.setProperty("--vc-1", hsl(h, s, 0.58));
    root.style.setProperty("--vc-2", hsl(h + 55, s, 0.62));
    root.style.setProperty("--vc-3", hsl(h - 45, s, 0.7));
  }
  window.addEventListener("vysor:theme", function (e) { theme(e.detail); });
  if (window.__vysorG) theme(window.__vysorG);

  fetch("/catalog.json").then(function (r) { return r.json(); }).then(function (c) {
    c.forEach(function (x, i) { if (typeof x.price === "number") prices[i] = x.price; });
  }).catch(function () {});

  labels();
  document.body.appendChild(root);
})();
