import { h, render, Component } from "https://esm.sh/preact@10.24.3";
import htm from "https://esm.sh/htm@3.1.1";
const html = htm.bind(h);
class App extends Component {
  constructor(p){ super(p); this.state = { items: [], cartOpen: false, prices: {}, busy: false, checkoutErr: "", lang: "en", page: "home", deck: "smart", sel: 3, prevSel: 3, dealt: false, cart: 0, toast: false, hold: false }; }
  _deal(){ var self = this; clearTimeout(this._dt); this._dt = setTimeout(function () { self.setState({ dealt: true }); }, 2700); }
  _setSel(i){ this.setState({ prevSel: this.state.sel, sel: i }); }
  componentDidMount(){ var self = this; this._deal(); try { fetch("/catalog.json").then(function (r) { return r.json(); }).then(function (c) { var m = {}; c.forEach(function (x, i) { if (typeof x.price === "number") m[i] = x.price; }); self.setState({ prices: m }); }).catch(function () {}); } catch (e) {} if (/[?&]cancel=1/.test(location.search)) { try { var sv = JSON.parse(localStorage.getItem("vysor_cart") || "[]"); if (sv.length) self.setState({ items: sv, cartOpen: true }); } catch (e) {} } this._iv = setInterval(function () { var st = self.state; if (st.hold || !st.dealt || st.page !== "home") return; self._setSel(self._nextSel(st)); }, 3800); }
  componentWillUnmount(){ clearTimeout(this._t); clearInterval(this._iv); clearTimeout(this._dt); }
  _nextSel(st){ var ids = (this._deckIds && this._deckIds[st.deck]) || []; var k = ids.indexOf(st.sel); return ids.length ? ids[(k + 1) % ids.length] : st.sel; }
  renderVals() {
    var self = this;
    var s = this.state;
    var G = {
      smart: ["linear-gradient(160deg,#1A0B33 0%,#7B5CFF 100%)", "linear-gradient(160deg,#071A3A 0%,#2E6EFF 100%)", "linear-gradient(180deg,#DCEBF5 0%,#33507A 55%,#0A1220 100%)", "linear-gradient(160deg,#2A0F3D 0%,#C04DFF 100%)", "linear-gradient(160deg,#04202E 0%,#1FA3C9 100%)", "linear-gradient(160deg,#141414 0%,#5C5C6E 100%)", "linear-gradient(160deg,#0B2433 0%,#5EE7FF 100%)"],
      run: ["linear-gradient(160deg,#04262A 0%,#1FB5A3 100%)", "linear-gradient(160deg,#3A1405 0%,#FF6B2C 100%)", "linear-gradient(160deg,#06220F 0%,#3DDC97 100%)", "linear-gradient(160deg,#2B1A04 0%,#E0A526 100%)", "linear-gradient(160deg,#0A0F1F 0%,#3B5BDB 100%)", "linear-gradient(160deg,#1C2414 0%,#8FB339 100%)", "linear-gradient(160deg,#2B0A18 0%,#E0457B 100%)"],
      sport: ["linear-gradient(160deg,#5A0E0E 0%,#FF4A3D 100%)", "linear-gradient(160deg,#3A1405 0%,#FF8A4C 100%)", "linear-gradient(160deg,#2B0A18 0%,#B0204F 100%)", "linear-gradient(160deg,#141414 0%,#C8A15A 100%)", "linear-gradient(170deg,#C9D6E6 0%,#5B6B86 60%,#141A26 100%)", "linear-gradient(170deg,#E8F1F8 0%,#7EA6C8 55%,#0E1A2A 100%)", "linear-gradient(160deg,#1A1A1A 0%,#FF5E3A 100%)"]
    };
    var P = [
      { k: "smart", name: "Ray-Ban Meta Gen 3", cat: "SMART · META AI", shape: "frame", word: "GEN 3", date: "SEP 2026", ref: "$449", short: "Más delgadas, botón de acción y hasta 9 h.", desc: "La tercera generación de Ray-Ban Meta: diseño más delgado, nuevo botón de acción y hasta nueve horas de batería, con la cámara de 12 MP y video 3K.", feats: ["Cámara 12 MP · video 3K", "Hasta 9 h de batería", "Nuevo botón de acción"] },
      { k: "smart", name: "Ray-Ban Meta Audio", cat: "SMART · AUDIO", shape: "frame", word: "AUDIO", date: "OCT 2026", ref: "$349", short: "Las primeras Meta sin cámara.", desc: "Las primeras gafas con IA de Meta sin cámara: conservan micrófonos, audio abierto y la conexión a la IA de Meta.", feats: ["Sin cámara", "Audio abierto", "IA de Meta por voz"] },
      { k: "smart", name: "Meta Glasses", cat: "SMART · ENTRADA", shape: "frame", word: "META", date: "JUN 2026", ref: "desde $299", short: "La línea propia de Meta, nuevos estilos Capri y Nova.", desc: "La línea de gafas propias de Meta, más accesible que Ray-Ban Meta. En Connect 2026 sumó los estilos Capri y Nova y una colaboración con LISA.", feats: ["Estilos Capri y Nova", "Ediciones Kylie Jenner y LISA", "Entrada a la familia Meta"] },
      { k: "smart", name: "Meta Adventurer", cat: "SMART · BÁSICAS", shape: "frame", word: "ADVENT", date: "SEP 2026", ref: "$249", short: "Las gafas inteligentes más económicas de Meta.", desc: "El modelo de entrada de Meta, presentado en Connect 2026 como sus gafas inteligentes más accesibles.", feats: ["Precio de entrada", "IA de Meta", "Uso diario"] },
      { k: "smart", name: "Samsung Galaxy Glasses", cat: "SMART · GEMINI", shape: "frame", word: "GALAXY", date: "JUL 2026", ref: "Por confirmar", short: "Gemini, cámara 12 MP, marcos Warby Parker y Gentle Monster.", desc: "Las primeras gafas de Samsung con Android XR: Gemini integrado, cámara de 12 MP y diseños con Warby Parker y Gentle Monster.", feats: ["Gemini integrado", "Cámara 12 MP", "Marcos Warby Parker / Gentle Monster"] },
      { k: "smart", name: "Snap Specs", cat: "SMART · AR", shape: "frame", word: "SPECS", date: "SEP 2026", ref: "$2,195", short: "Realidad aumentada completa, independientes.", desc: "Gafas de realidad aumentada independientes de Snap, con contenido digital sobre el mundo real y asistente de IA.", feats: ["Realidad aumentada", "Funcionan solas", "Asistente con IA"] },
      { k: "smart", name: "Even Realities G2", cat: "SMART · DISPLAY", shape: "frame", word: "G2", date: "ENE 2026", ref: "Consultar", short: "Pantalla discreta: rutas, traducción y avisos.", desc: "Gafas con pantalla discreta: indicaciones paso a paso, subtítulos de traducción en tiempo real y notificaciones. Premio a la Innovación en CES 2026 y aceptan lentes con medida.", feats: ["Pantalla en el lente", "Traducción en vivo", "Aceptan graduación"] },
      { k: "run", name: "SunGod Ultras Air", cat: "RUNNING · ROAD", shape: "shield", word: "ULTRAS", date: "ABR 2026", ref: "Consultar", short: "Evolución más delgada de las Ultras.", desc: "Evolución más delgada de las Ultras, pensada para runners. Debutó en el Maratón de Londres 2026 con atletas élite de SunGod.", feats: ["Diseño más delgado", "Línea Pace", "Probadas en maratón"] },
      { k: "run", name: "Oakley Cybr Lightning", cat: "RUNNING · RIMLESS", shape: "shield", word: "CYBR", date: "SEP 2026", ref: "Consultar", short: "Sin marco y ventiladas, diseñadas para correr.", desc: "Nuevo miembro de la familia Cybr: sin marco y con lente ventilada, diseñado para running y también apto para ciclismo.", feats: ["Sin marco", "Lente ventilada", "Running y ciclismo"] },
      { k: "run", name: "Rudy Project Astral Arc", cat: "RUNNING · TRAIL", shape: "shield", word: "ASTRAL", date: "SEP 2026", ref: "Consultar", short: "Lente cilíndrica base 6, casi sin marco.", desc: "Lente cilíndrica base 6 casi sin marco, nariz ajustable y patillas flexibles, para trail running, triatlón y ciclismo.", feats: ["Lente cilíndrica base 6", "Puente ajustable", "Trail · triatlón · ciclismo"] },
      { k: "run", name: "Bollé Trailchaser", cat: "RUNNING · EDICIÓN LIMITADA", shape: "shield", word: "TRAIL", date: "ABR 2026", ref: "Consultar", short: "La entrada de Bollé al trail: solo 300 pares.", desc: "El primer modelo de Bollé para trail running: escudo cilíndrico de media montura, limitado a 300 pares.", feats: ["Escudo cilíndrico", "Media montura", "Solo 300 pares"] },
      { k: "run", name: "adidas Kentro SP0123", cat: "RUNNING · MONTAÑA", shape: "shield", word: "KENTRO", date: "MAY 2026", ref: "$154", short: "TR90 y lentes Powervizn para trail.", desc: "Montura de TR90 ligera y flexible con el sistema de lentes Powervizn, hecha para trail y montaña.", feats: ["Montura TR90", "Lentes Powervizn", "Para trail y montaña"] },
      { k: "run", name: "Tifosi Moab XC", cat: "RUNNING · MULTIDEPORTE", shape: "shield", word: "MOAB", date: "MAR 2026", ref: "Consultar", short: "Escudo sin marco y lente intercambiable.", desc: "Escudo sin marco con cambio de lente y compatibilidad con el nuevo adaptador para lentes con medida de Tifosi.", feats: ["Sin marco", "Lente intercambiable", "Adaptador para graduación"] },
      { k: "run", name: "Oakley Eye Jacket Redux", cat: "RUNNING · COLAB", shape: "frame", word: "REDUX", date: "ABR 2026", ref: "$200", short: "Colab CNCPTS × Heartbreak para Boston.", desc: "Edición de la colaboración CNCPTS × Oakley × Heartbreak Hill Running Company, lanzada para el fin de semana del Maratón de Boston.", feats: ["Colaboración especial", "Herencia Oakley", "Edición de temporada"] },
      { k: "sport", name: "Oakley Radar EV Heater", cat: "CICLISMO · RUTA", shape: "shield", word: "HEATER", date: "SEP 2026", ref: "$244", short: "La Radar con la lente más alta y ancha.", desc: "La nueva Radar con lente más alta y extendida hacia los lados para una visión sin obstáculos. Prizm, O-Matter y Unobtainium, talla XL.", feats: ["Lente más alta y ancha", "Prizm · 2 polarizadas", "Talla XL"] },
      { k: "sport", name: "Oakley Bisphaera Speed", cat: "CICLISMO · DOBLE LENTE", shape: "frame", word: "SPEED", date: "MAR 2026", ref: "Consultar", short: "Doble lente tórica para ruta.", desc: "Gafa de ciclismo con diseño de doble lente tórica, parte del lanzamiento de temporada 2026 de Oakley.", feats: ["Doble lente tórica", "Ciclismo de ruta", "Prizm"] },
      { k: "sport", name: "Oakley Sphaera Strike", cat: "CICLISMO · ESCUDO", shape: "shield", word: "STRIKE", date: "MAR 2026", ref: "Consultar", short: "Lente escudo Sphaera con nuevo corte.", desc: "Usa la misma lente escudo tórica 6x4 de la familia Sphaera, con un corte nuevo para otro estilo.", feats: ["Lente escudo 6x4", "Nuevo corte", "Prizm"] },
      { k: "sport", name: "Oakley RSLV Lite", cat: "CICLISMO · VISIÓN AMPLIA", shape: "shield", word: "RSLV", date: "MAR 2026", ref: "Consultar", short: "Campo de visión extendido.", desc: "Modelo ligero de ciclismo con campo de visión extendido, presentado junto a Bisphaera Speed y Sphaera Strike.", feats: ["Campo de visión extendido", "Ligera", "Ciclismo"] },
      { k: "sport", name: "Rudy Project Performance 40", cat: "CICLISMO · EDICIÓN DE COLECCIÓN", shape: "shield", word: "40", date: "ENE 2026", ref: "€950", short: "Titanio impreso en 3D. Solo 100 pares.", desc: "Edición por el 40 aniversario de la Super Performance: montura de titanio impresa en 3D, limitada a 100 pares.", feats: ["Titanio impreso en 3D", "Solo 100 pares", "Pieza de colección"] },
      { k: "sport", name: "POC Ciasma", cat: "NIEVE · MÁSCARA", shape: "shield", word: "CIASMA", date: "OCT 2026", ref: "Consultar", short: "Cambio de lente con una mano, puesta.", desc: "Nueva máscara de esquí y snowboard de la colección 26/27 de POC, con sistema de cambio de lente que se opera con una mano sin quitártela.", feats: ["Cambio de lente con una mano", "Esquí y snowboard", "Temporada 26/27"] },
      { k: "sport", name: "SPY Crosspoint", cat: "NIEVE · MÁSCARA", shape: "shield", word: "CROSS", date: "NOV 2026", ref: "Consultar", short: "Su visión más amplia: 194,5°.", desc: "Máscara cilíndrica de SPY para la temporada 26/27 con un campo de visión de 194,5°, el más amplio de la marca.", feats: ["Campo de visión 194,5°", "Lente cilíndrica", "Temporada 26/27"] }
    ];
    var IMG = ["/img/g01.webp","/img/g02.webp","/img/g03.webp","/img/g04.webp","/img/g05.webp","/img/g06.webp","/img/g07.webp","/img/g08.webp","/img/g09.webp","/img/g10.webp","/img/g11.webp","/img/g12.webp","/img/g13.webp","/img/g14.webp","/img/g15.webp","/img/g16.webp","/img/g17.webp","/img/g18.webp","/img/g19.webp","/img/g20.webp","/img/g21.webp"];
    var frames = { smart: "#14161C", run: "#101418", sport: "#16121A" };
    var idx = { smart: 0, run: 0, sport: 0 };
    P.forEach(function (p, i) { p.i = i; p.isFrame = p.shape === "frame"; p.isShield = p.shape === "shield"; p.g = G[p.k][idx[p.k]++]; p.frame = frames[p.k]; p.img = IMG[i]; });
    var L = s.lang === "es" ? "es" : "en";
    var EN = [
      { cat: "SMART · META AI", short: "Slimmer, new action button, up to 9 h.", desc: "The third generation of Ray-Ban Meta: a slimmer design, a new action button and up to nine hours of battery, with the 12 MP camera and 3K video.", feats: ["12 MP camera · 3K video", "Up to 9 h battery", "New action button"] },
      { cat: "SMART · AUDIO", short: "Meta's first camera-free glasses.", desc: "Meta's first AI glasses without a camera: they keep the microphones, open-ear audio and the connection to Meta AI.", feats: ["No camera", "Open-ear audio", "Meta AI by voice"] },
      { cat: "SMART · ENTRY", short: "Meta's own line, new Capri and Nova styles.", desc: "Meta's own glasses line, more affordable than Ray-Ban Meta. Connect 2026 added the Capri and Nova styles and a LISA collaboration.", feats: ["Capri and Nova styles", "Kylie Jenner and LISA editions", "Entry to the Meta family"] },
      { cat: "SMART · ESSENTIALS", short: "Meta's most affordable smart glasses.", desc: "Meta's entry model, introduced at Connect 2026 as its most affordable smart glasses.", feats: ["Entry price", "Meta AI", "Everyday wear"] },
      { cat: "SMART · GEMINI", short: "Gemini, 12 MP camera, Warby Parker and Gentle Monster frames.", desc: "Samsung's first Android XR glasses: built-in Gemini, a 12 MP camera and designs with Warby Parker and Gentle Monster.", feats: ["Built-in Gemini", "12 MP camera", "Warby Parker / Gentle Monster frames"] },
      { cat: "SMART · AR", short: "Full augmented reality, standalone.", desc: "Snap's standalone augmented reality glasses, with digital content over the real world and an AI assistant.", feats: ["Augmented reality", "Fully standalone", "AI assistant"] },
      { cat: "SMART · DISPLAY", short: "Discreet display: directions, translation, alerts.", desc: "Glasses with a discreet display: turn-by-turn directions, live translation captions and notifications. CES 2026 Innovation Award and prescription-ready.", feats: ["In-lens display", "Live translation", "Prescription-ready"] },
      { cat: "RUNNING · ROAD", short: "A slimmer evolution of the Ultras.", desc: "A slimmer evolution of the Ultras, built for runners. It debuted at the 2026 London Marathon on SunGod's elite athletes.", feats: ["Slimmer design", "Pace range", "Marathon-proven"] },
      { cat: "RUNNING · RIMLESS", short: "Rimless and vented, made for running.", desc: "A new member of the Cybr family: rimless with a vented lens, designed for running and great for cycling too.", feats: ["Rimless", "Vented lens", "Running and cycling"] },
      { cat: "RUNNING · TRAIL", short: "Base 6 cylindrical lens, nearly frameless.", desc: "A nearly frameless base 6 cylindrical lens, adjustable nosepiece and flexible temples, for trail running, triathlon and cycling.", feats: ["Base 6 cylindrical lens", "Adjustable nosepiece", "Trail · triathlon · cycling"] },
      { cat: "RUNNING · LIMITED EDITION", short: "Bollé's trail debut: only 300 pairs.", desc: "Bollé's first trail running model: a half-rim cylindrical shield, limited to 300 pairs.", feats: ["Cylindrical shield", "Half rim", "Only 300 pairs"] },
      { cat: "RUNNING · MOUNTAIN", short: "TR90 frame and Powervizn lenses for trail.", desc: "A light, flexible TR90 frame with the Powervizn lens system, made for trail and mountain running.", feats: ["TR90 frame", "Powervizn lenses", "Trail and mountain"] },
      { cat: "RUNNING · MULTISPORT", short: "Rimless shield, interchangeable lens.", desc: "A rimless shield with lens swap and compatibility with Tifosi's new prescription adapter.", feats: ["Rimless", "Interchangeable lens", "Prescription adapter"] },
      { cat: "RUNNING · COLLAB", short: "CNCPTS × Heartbreak collab for Boston.", desc: "From the CNCPTS × Oakley × Heartbreak Hill Running Company collaboration, released for Boston Marathon weekend.", feats: ["Special collaboration", "Oakley heritage", "Seasonal edition"] },
      { cat: "CYCLING · ROAD", short: "The Radar with the tallest, widest lens.", desc: "The new Radar with a taller lens that extends to the sides for unobstructed vision. Prizm, O-Matter and Unobtainium, XL size.", feats: ["Taller, wider lens", "Prizm · 2 polarized", "XL size"] },
      { cat: "CYCLING · DUAL LENS", short: "Dual toric lens for the road.", desc: "A cycling frame with a dual toric lens design, part of Oakley's 2026 season launch.", feats: ["Dual toric lens", "Road cycling", "Prizm"] },
      { cat: "CYCLING · SHIELD", short: "Sphaera shield lens with a new cut.", desc: "Uses the same 6x4 toric shield lens as the Sphaera family, with a new cut for a different style.", feats: ["6x4 shield lens", "New cut", "Prizm"] },
      { cat: "CYCLING · WIDE VIEW", short: "Extended field of view.", desc: "A light cycling model with an extended field of view, launched alongside Bisphaera Speed and Sphaera Strike.", feats: ["Extended field of view", "Lightweight", "Cycling"] },
      { cat: "CYCLING · COLLECTOR'S EDITION", short: "3D-printed titanium. Only 100 pairs.", desc: "A 40th-anniversary edition of the Super Performance: a 3D-printed titanium frame, limited to 100 pairs.", feats: ["3D-printed titanium", "Only 100 pairs", "Collector's piece"] },
      { cat: "SNOW · GOGGLE", short: "One-hand lens change, goggle on.", desc: "A new ski and snowboard goggle from POC's 26/27 collection, with a lens change system you operate with one hand without taking it off.", feats: ["One-hand lens change", "Ski and snowboard", "26/27 season"] },
      { cat: "SNOW · GOGGLE", short: "Its widest view yet: 194.5°.", desc: "SPY's cylindrical goggle for the 26/27 season with a 194.5° field of view, the widest in the brand's range.", feats: ["194.5° field of view", "Cylindrical lens", "26/27 season"] }
    ];
    var MON = { ENE: "JAN", ABR: "APR" };
    var REFEN = function (r) { return r.replace("desde", "from").replace("Por confirmar", "TBA").replace("Consultar", "Ask us"); };
    if (L === "en") P.forEach(function (p, i) { Object.assign(p, EN[i]); p.date = p.date.replace(/^[A-Z]+/, function (m) { return MON[m] || m; }); p.ref = REFEN(p.ref); });
    var SPECS = [
      { ref: "$449", rows: [["Cámara", "Camera", "12 MP ultra gran angular", "12 MP ultra-wide"], ["Video", "Video", "3K"], ["Batería", "Battery", "Hasta 9 h", "Up to 9 h"], ["Estuche de carga", "Charging case", "+50 h"], ["Peso", "Weight", "51,5 g (Standard)", "51.5 g (Standard)"], ["Estilos", "Styles", "Aviator, Wayfarer, Zena"], ["Controles", "Controls", "Botón de acción, táctil y voz", "Action button, touch and voice"]] },
      { ref: "$349", rows: [["Cámara", "Camera", "Sin cámara", "No camera"], ["Batería", "Battery", "Hasta 12 h", "Up to 12 h"], ["Estuche de carga", "Charging case", "+48 h"], ["Peso", "Weight", "43 g"], ["Audio", "Audio", "Altavoces abiertos", "Open-ear speakers"], ["Estilos", "Styles", "Clubmaster, Burbank (23 combinaciones)", "Clubmaster, Burbank (23 combos)"], ["Graduación", "Prescription", "Compatible", "Compatible"]] },
      { ref: null, rows: [["Cámara", "Camera", "12 MP, campo de 100°", "12 MP, 100° field of view"], ["Video", "Video", "3K"], ["Batería", "Battery", "Más de 8 h", "8+ h"], ["Estuche de carga", "Charging case", "+40 h (plegable)", "+40 h (foldable)"], ["Peso", "Weight", "~54 g"], ["Lentes", "Lenses", "Sol, polarizadas, Transitions", "Sun, polarized, Transitions"], ["Graduación", "Prescription", "−6.00 a +2.25", "−6.00 to +2.25"]] },
      { ref: null, rows: [["Cámara", "Camera", "12 MP, campo de 100°", "12 MP, 100° field of view"], ["Video", "Video", "3K a 30 fps", "3K at 30 fps"], ["Batería", "Battery", "Hasta 8 h (versión con estuche plegable)", "Up to 8 h (foldable-case version)"], ["Peso", "Weight", "53,8 g", "53.8 g"], ["Memoria", "Storage", "32 GB"], ["Conectividad", "Connectivity", "Wi-Fi 6, Bluetooth 5.3"], ["Graduación", "Prescription", "−12.00 a +2.25", "−12.00 to +2.25"], ["Versiones", "Versions", "$249 (estuche enchufable) · $299 (estuche plegable)", "$249 (plug-in case) · $299 (foldable case)"]] },
      { ref: null, rows: [["Chip", "Chip", "Snapdragon AR1 Gen 1"], ["Asistente", "Assistant", "Gemini (Android XR)"], ["Cámara", "Camera", "12 MP"], ["Batería", "Battery", "~9 h"], ["Peso", "Weight", "~50 g"], ["Monturas", "Frames", "Warby Parker, Gentle Monster"], ["Precio", "Price", "Por confirmar por Samsung", "TBA by Samsung"]] },
      { ref: null, rows: [["Tipo", "Type", "Realidad aumentada independiente", "Standalone augmented reality"], ["Campo de visión", "Field of view", "51°"], ["Batería", "Battery", "~4 h"], ["Asistente", "Assistant", "SPECS Intelligence"], ["Precio", "Price", "$2,195"]] },
      { ref: null, rows: [["Pantalla", "Display", "En el lente, discreta", "In-lens, discreet"], ["Funciones", "Features", "Navegación, traducción en vivo, notificaciones", "Navigation, live translation, notifications"], ["Peso", "Weight", "~36 g"], ["Batería", "Battery", "~2 días", "~2 days"], ["Graduación", "Prescription", "Compatible"], ["Reconocimiento", "Award", "Premio a la Innovación CES 2026", "CES 2026 Innovation Award"]] },
      { ref: null, rows: [["Peso", "Weight", "24,5 g", "24.5 g"], ["Lente", "Lens", "8KO® nylon 2 mm, esférica", "8KO® 2 mm nylon, spherical"], ["Filtro", "Filter", "Cat. 3 · VLT 14% (Smoke)"], ["Lente intercambiable", "Interchangeable lens", "Sí", "Yes"], ["Bisagras", "Hinges", "Pop-Lock™ sin tornillos", "Pop-Lock™ screwless"], ["Medidas", "Size", "148 × 59 mm · patilla 122 mm", "148 × 59 mm · 122 mm temple"], ["Garantía", "Warranty", "De por vida", "Lifetime"]] },
      { ref: "$214", rows: [["Peso", "Weight", "~24,3 g", "~24.3 g"], ["Montura", "Frame", "O-Matter™ sin marco", "Rimless O-Matter™"], ["Lente", "Lens", "Prizm™ con Iridium, ventilada", "Vented Prizm™ with Iridium"], ["Filtro", "Filter", "Cat. 3 · VLT ~13% (Prizm Black)"], ["Ajuste", "Fit", "Wide · Low Bridge · L (134 mm)"], ["Agarre", "Grip", "Unobtainium® en nariz y patillas", "Unobtainium® nosepads and earsocks"]] },
      { ref: "€149.90", rows: [["Peso", "Weight", "31 g"], ["Lente", "Lens", "Cilíndrica base 6, policarbonato espejado", "Base 6 cylindrical, mirrored polycarbonate"], ["Filtro", "Filter", "Cat. 3"], ["Montura", "Frame", "Rilsan Clear de origen biológico", "Bio-based Rilsan Clear"], ["Ajuste", "Fit", "Puente nasal ajustable, patillas flexibles", "Adjustable nosepiece, flexible temples"], ["Colores", "Colorways", "7 + 1 edición limitada", "7 + 1 limited edition"]] },
      { ref: "$300", rows: [["Peso", "Weight", "31 g"], ["Lente", "Lens", "Phantom fotocromática, cilíndrica, base 6", "Phantom photochromic, cylindrical, base 6"], ["Filtro", "Filter", "Cat. 0–3 o 1–3 según lente", "Cat. 0–3 or 1–3 by lens"], ["Montura", "Frame", "Media montura, Rilsan G850 Nylon", "Half rim, Rilsan G850 Nylon"], ["Ajuste", "Fit", "Patillas FIT-TEC de 3 ejes, nariz Thermogrip®", "3-axis FIT-TEC temples, Thermogrip® nosepiece"], ["Edición", "Edition", "300 pares numerados", "300 numbered pairs"]] },
      { ref: "$154", rows: [["Montura", "Frame", "TR90 ligera y flexible", "Light, flexible TR90"], ["Lente", "Lens", "Sistema Powervizn", "Powervizn lens system"], ["Uso", "Use", "Trail y montaña", "Trail and mountain"], ["Peso", "Weight", "Por confirmar", "TBC"]] },
      { ref: "$79.95", rows: [["Peso", "Weight", "29 g"], ["Montura", "Frame", "Grilamid TR-90 sin marco", "Rimless Grilamid TR-90"], ["Lente", "Lens", "Escudo intercambiable (Interchange)", "Interchangeable shield (Interchange)"], ["Incluye", "Includes", "3 lentes (versión estándar)", "3 lenses (standard version)"], ["Opción", "Option", "Fototec fotocromática ($89.95)", "Fototec photochromic ($89.95)"], ["Graduación", "Prescription", "Compatible con adaptador RX", "RX adapter compatible"]] },
      { ref: "$200", rows: [["Colaboración", "Collaboration", "CNCPTS × Oakley × Heartbreak Hill Running Co."], ["Lanzamiento", "Release", "10 abr 2026, fin de semana del Maratón de Boston", "Apr 10, 2026, Boston Marathon weekend"], ["Estilo", "Style", "Envolvente años 90 (familia Jacket)", "90s wrap (Jacket family)"], ["Precio", "Price", "$200"]] },
      { ref: "$244", rows: [["Lente", "Lens", "Prizm™ extra alta y ancha", "Extra tall and wide Prizm™"], ["Talla", "Size", "XL"], ["Montura", "Frame", "O-Matter™"], ["Agarre", "Grip", "Unobtainium®"], ["Ajuste", "Fit", "Wide · Universal"], ["Opciones", "Options", "Hasta 9 colores, 2 polarizadas", "Up to 9 colorways, 2 polarized"]] },
      { ref: "$214", rows: [["Lente", "Lens", "Doble lente tórica 6x4", "6x4 twin-toric dual lens"], ["Medidas", "Size", "Lente 68 × 40 mm · puente 6 · patilla 136 mm", "Lens 68 × 40 mm · bridge 6 · temple 136 mm"], ["Montura", "Frame", "O-Matter™ semi sin marco", "Semi-rimless O-Matter™"], ["Filtro", "Filter", "Prizm Road · VLT ~20%"], ["Graduación", "Prescription", "Compatible", "Compatible"]] },
      { ref: "$244", rows: [["Peso", "Weight", "33 g"], ["Lente", "Lens", "Escudo tórico 6x4, 160 × 50 mm", "6x4 toric shield, 160 × 50 mm"], ["Montura", "Frame", "O-Matter™ semi sin marco", "Semi-rimless O-Matter™"], ["Tratamientos", "Coatings", "Hidrofóbico, oleofóbico, antirrayas, 100% UV", "Hydrophobic, oleophobic, scratch-resistant, 100% UV"], ["Ajuste", "Fit", "3 puntos, Unobtainium®", "Three-point, Unobtainium®"]] },
      { ref: null, rows: [["Lente", "Lens", "Escudo cilíndrico base 5", "Base 5 cylindrical shield"], ["Montura", "Frame", "Media montura sin borde inferior, O-Matter™", "Half frame, no lower rim, O-Matter™"], ["Agarre", "Grip", "Unobtainium®"], ["Lentes", "Lenses", "Prizm Road, Prizm Black, Low Light, Trail Torch"]] },
      { ref: "€950", rows: [["Montura", "Frame", "Titanio impreso en 3D, estructura calada", "3D-printed titanium, open structure"], ["Edición", "Edition", "100 piezas", "100 pieces"], ["Motivo", "Occasion", "40 años de la Super Performance", "40 years of the Super Performance"], ["Precio", "Price", "€950"]] },
      { ref: "€300", rows: [["Cambio de lente", "Lens change", "Magnético, con una mano", "Magnetic, one-handed"], ["Lentes", "Lenses", "Clarity by POC™, Cat. 1–3 (~8–80% VLT)"], ["Incluye", "Includes", "Lente extra con bumper (Cat. 1)", "Extra lens with bumper (Cat. 1)"], ["Material", "Material", "TPU"], ["Interior", "Inner lens", "Tratamiento antivaho", "Anti-fog treatment"]] },
      { ref: "$235", rows: [["Campo de visión", "Field of view", "194,5°", "194.5°"], ["Lente", "Lens", "Cilíndrica doble, HAPPY BOOST™", "Cylindrical double lens, HAPPY BOOST™"], ["Cambio de lente", "Lens change", "Magnético", "Magnetic"], ["Incluye", "Includes", "Lente extra Low Light Coral", "Extra Low Light Coral lens"], ["Ajuste", "Fit", "Medio–grande", "Medium–large"], ["Colores", "Colorways", "7"]] }
    ];
    P.forEach(function (p, i) {
      var sp = SPECS[i];
      if (sp.ref) p.ref = sp.ref;
      p.specs = sp.rows.map(function (r) { return { k: L === "en" ? r[1] : r[0], v: r.length > 3 ? (L === "en" ? r[3] : r[2]) : r[2] }; });
    });
    var T = L === "en" ? {
      kicker: "VISION · TECHNOLOGY · PERFORMANCE", specsTitle: "Tech specs", cartAria: "Cart", cartTitle: "Your cart", close: "Close", cartEmpty: "Your cart is empty.", remove: "Remove", total: "Total", pay: "Pay with card", paying: "Redirecting to secure checkout…", secure: "Secure payment by Stripe · Cards, Apple Pay and Google Pay", missingPrice: "Some items don't have a price yet. Contact us to complete your order.", askPrice: "Price on request", errGeneric: "We couldn't start the payment. Please try again.", specsNote: "From official and retailer sources. May vary by version and region.", h1a: "The future", h1b: "looks different.", launchUp: "LAUNCH", sevenLaunches: "7 LAUNCHES", view: "View ",
      catH1: "Three worlds.", catH2: "One vision.", catP: "Choose by how you live: connected, on the run or at the limit. Each line takes you to its models.", seeModels: "See models", modelsSp: " models",
      newest: "Just launched", newestP: "One standout launch from each line. Open its tab to see all seven.", ref: "Ref.", renderNote: "PRODUCT RENDER · HOVER TO ZOOM",
      avail: "In stock · ships in [SHIPPING TIME]", refOff: "OFFICIAL REF.", price: "VYSOR PRICE", addCart: "Add to cart", addedSuf: " added to cart", allPre: "All ",
      ctaH: "What's your next pair?", ctaP: "We'll help you on WhatsApp to pick the right model, lens and fit.", whats: "Message us on WhatsApp", backHome: "Back to home",
      footer: "Smart glasses · Running · Sport", contact: "[CITY] · [CONTACT]", seeLine: "See the full ", lineSuf: " line", count: "7 models",
      marquee: ["META AI", "RUNNING", "CYCLING", "SNOW", "PRIZM LENSES", "CAMERA + AUDIO"],
      nav: ["Home", "Smart", "Running", "Sport"], decks: ["Smart", "Running", "Sport"], deckNames: ["SMART GLASSES", "RUNNING", "SPORT"],
      cats: [["Connected", "Smart Glasses"], ["On the move", "Running"], ["Cycling and snow", "Sport"]],
      lines: [["SMART GLASSES · 7 LAUNCHES", "Smart Glasses", "Glasses with camera, audio, AI and displays: Meta, Samsung, Snap and Even Realities."], ["RUNNING · 7 LAUNCHES", "Running", "Light, bounce-free shields for road, trail and marathon."], ["SPORT · 7 LAUNCHES", "Sport", "Road cycling and snow goggles from this season."]]
    } : {
      kicker: "VISIÓN · TECNOLOGÍA · RENDIMIENTO", specsTitle: "Ficha técnica", cartAria: "Carrito", cartTitle: "Tu carrito", close: "Cerrar", cartEmpty: "Tu carrito está vacío.", remove: "Quitar", total: "Total", pay: "Pagar con tarjeta", paying: "Redirigiendo al pago seguro…", secure: "Pago seguro con Stripe · Tarjetas, Apple Pay y Google Pay", missingPrice: "Algunos productos aún no tienen precio. Escríbenos para completar tu pedido.", askPrice: "Precio a consultar", errGeneric: "No pudimos iniciar el pago. Inténtalo de nuevo.", specsNote: "Datos de fuentes oficiales y tiendas. Pueden variar por versión y región.", h1a: "El futuro", h1b: "se ve distinto.", launchUp: "LANZAMIENTO", sevenLaunches: "7 LANZAMIENTOS", view: "Ver ",
      catH1: "Tres mundos.", catH2: "Una sola visión.", catP: "Elige por cómo vives: conectado, corriendo o al límite. Cada línea te lleva a sus modelos.", seeModels: "Ver modelos", modelsSp: " modelos",
      newest: "Lo más nuevo", newestP: "Un lanzamiento destacado de cada línea. Entra a su pestaña para ver los siete.", ref: "Ref.", renderNote: "RENDER DE PRODUCTO · PASA EL CURSOR PARA AMPLIAR",
      avail: "Disponible · envío [TIEMPO DE ENVÍO]", refOff: "REF. OFICIAL", price: "PRECIO VYSOR", addCart: "Agregar al carrito", addedSuf: " agregado al carrito", allPre: "Todos los ",
      ctaH: "¿Cuál es tu próximo par?", ctaP: "Te asesoramos por WhatsApp para elegir el modelo, la lente y la talla correcta.", whats: "Escribir por WhatsApp", backHome: "Volver al inicio",
      footer: "Smart glasses · Running · Deporte", contact: "[CIUDAD] · [CONTACTO]", seeLine: "Ver toda la línea ", lineSuf: "", count: "7 modelos",
      marquee: ["META AI", "RUNNING", "CICLISMO", "NIEVE", "LENTES PRIZM", "CÁMARA + AUDIO"],
      nav: ["Inicio", "Smart", "Running", "Deporte"], decks: ["Smart", "Running", "Deporte"], deckNames: ["SMART GLASSES", "RUNNING", "DEPORTE"],
      cats: [["Conectadas", "Smart Glasses"], ["En movimiento", "Running"], ["Ciclismo y nieve", "Deporte"]],
      lines: [["SMART GLASSES · 7 LANZAMIENTOS", "Smart Glasses", "Gafas con cámara, audio, IA y pantalla: Meta, Samsung, Snap y Even Realities."], ["RUNNING · 7 LANZAMIENTOS", "Running", "Escudos ligeros y sin rebote para ruta, trail y maratón."], ["DEPORTE · 7 LANZAMIENTOS", "Deporte", "Ciclismo de ruta y máscaras de nieve de la temporada."]]
    };
    var deckNames = { smart: T.deckNames[0], run: T.deckNames[1], sport: T.deckNames[2] };
    var animByDeck = { smart: "deal0", run: "deal1", sport: "deal2" };
    var deckIds = { smart: [], run: [], sport: [] };
    P.forEach(function (p) { deckIds[p.k].push(p.i); });
    this._deckIds = deckIds;
    var top = function () { try { window.scrollTo({ top: 0, behavior: "smooth" }); } catch (e) {} };
    var go = function (k, i) { return function () { var v = (i === undefined ? deckIds[k][0] : i); self.setState({ page: k, deck: k, sel: v, prevSel: v }); top(); }; };
    var sel = s.sel, d = P[sel];
    var pick = function (i) { return function () { self._setSel(i); }; };
    var deckItems = P.filter(function (p) { return p.k === s.deck; });
    var ci = deckItems.findIndex(function (p) { return p.i === sel; }); if (ci < 0) ci = 3;
    var cp = deckItems.findIndex(function (p) { return p.i === s.prevSel; }); if (cp < 0) cp = ci;
    var cards = deckItems.map(function (p, j) {
      var o = ((j - ci + 10) % 7) - 3;
      var t = "translateX(" + (o * 150) + "px) translateY(" + (Math.abs(o) * 30) + "px) rotate(" + (o * 8) + "deg)";
      return Object.assign({}, p, { num: "0" + (j + 1), cls: p.i === sel ? "card on" : "card", pick: pick(p.i), pos: (function () { var op = ((j - cp + 10) % 7) - 3; var wrap = s.dealt && Math.abs(o - op) > 3; var st = { transform: t, zIndex: 10 - Math.abs(o), left: 0 }; if (wrap) { st.transition = "none"; st.animation = "popin .9s ease both"; } return st; })(), dealStyle: s.dealt ? { animationName: "none" } : { animationName: animByDeck[s.deck], animationDelay: (0.15 + Math.abs(j - 3) * 0.12) + "s" }, flipStyle: s.dealt ? { animationName: "none" } : { animationName: "flip" + animByDeck[s.deck].slice(-1), animationDelay: (0.9 + j * 0.14) + "s" }, bg: { background: p.g } });
    });
    var deckDefs = [["smart", T.decks[0]], ["run", T.decks[1]], ["sport", T.decks[2]]];
    var decks = deckDefs.map(function (dk) { return { label: dk[1], cls: s.deck === dk[0] ? "tab on" : "tab", pick: function () { var first = P.filter(function (p) { return p.k === dk[0]; })[3]; self.setState({ deck: dk[0], sel: first.i, prevSel: first.i, dealt: false }); self._deal(); } }; });
    var lensDefs = [
      { name: "Transparente", color: "#BFD9EE", bg: "radial-gradient(circle at 35% 30%,#fff,#9FC3DF)" },
      { name: "Polarizada", color: "#141820", bg: "radial-gradient(circle at 35% 30%,#4A5568,#0B0D12)" },
      { name: "Prizm", color: "#FF6B2C", bg: "radial-gradient(circle at 35% 30%,#FFD36B,#FF4A3D 60%,#7B5CFF)" }
    ];
    var lenses = lensDefs.map(function (l, i) { return { name: l.name, cls: i === s.lens ? "sw on" : "sw", bg: { background: l.bg }, pick: function () { self.setState({ lens: i }); } }; });
    var counts = { smart: 0, run: 0, sport: 0 };
    P.forEach(function (p) { counts[p.k]++; });
    var catDefs = [
      { key: "smart", kicker: T.cats[0][0], label: T.cats[0][1], color: "#5EE7FF", bg: { background: "radial-gradient(120% 90% at 50% 110%,rgba(46,110,255,.55),#070B16 70%)", border: "1px solid rgba(94,231,255,.35)", boxShadow: "inset 0 -30px 60px rgba(46,110,255,.25),0 0 40px rgba(46,110,255,.15)" }, curve: "M10 100 C 70 100, 110 100, 130 60 C 145 25, 160 20, 170 55 C 185 100, 230 100, 290 96" },
      { key: "run", kicker: T.cats[1][0], label: T.cats[1][1], color: "#3DDC97", bg: { background: "radial-gradient(120% 90% at 50% 110%,rgba(30,200,130,.5),#06120E 70%)", border: "1px solid rgba(61,220,151,.35)", boxShadow: "inset 0 -30px 60px rgba(30,200,130,.22),0 0 40px rgba(30,200,130,.12)" }, curve: "M10 105 C 60 100, 90 90, 120 80 C 160 66, 190 72, 220 50 C 245 32, 265 20, 290 18" },
      { key: "sport", kicker: T.cats[2][0], label: T.cats[2][1], color: "#FF8A4C", bg: { background: "radial-gradient(120% 90% at 50% 110%,rgba(255,107,44,.5),#140904 70%)", border: "1px solid rgba(255,138,76,.35)", boxShadow: "inset 0 -30px 60px rgba(255,107,44,.22),0 0 40px rgba(255,107,44,.12)" }, curve: "M10 90 C 50 30, 80 30, 110 80 C 140 120, 170 110, 200 60 C 225 20, 260 30, 290 40" }
    ];
    var cats = catDefs.map(function (c) { return Object.assign({}, c, { count: counts[c.key], pick: go(c.key) }); });
    var lineK = s.page === "home" ? d.k : s.page;
    var mk = function (p, n) { return Object.assign({}, p, { bg: { background: p.g, height: "200px", display: "flex", alignItems: "center", justifyContent: "center" }, delay: { animationDelay: (n * 0.05) + "s" } }); };
    var grid = P.filter(function (p) { return p.k === lineK; }).map(function (p, n) { return Object.assign(mk(p, n), { pick: function () { self.setState({ sel: p.i, prevSel: p.i }); } }); });
    var featured = [0, 7, 14].map(function (i, n) { return Object.assign(mk(P[i], n), { pick: go(P[i].k, i) }); });
    var lines = {
      smart: { kicker: T.lines[0][0], title: T.lines[0][1], color: "#5EE7FF", desc: T.lines[0][2] },
      run: { kicker: T.lines[1][0], title: T.lines[1][1], color: "#3DDC97", desc: T.lines[1][2] },
      sport: { kicker: T.lines[2][0], title: T.lines[2][1], color: "#FF8A4C", desc: T.lines[2][2] }
    };
    var line = Object.assign({}, lines[lineK], { count: T.count });
    var navDefs = [[T.nav[0], "home"], [T.nav[1], "smart"], [T.nav[2], "run"], [T.nav[3], "sport"]];
    var navs = navDefs.map(function (n, i) { return { label: n[0], href: "#inicio", cls: s.page === n[1] ? "navbtn on" : "navbtn", pick: n[1] === "home" ? function () { self.setState({ page: "home" }); top(); } : go(n[1]) }; });
    var thumbs = P.filter(function (p) { return p.k === d.k; }).map(function (p) { return { name: p.name, img: p.img, isFrame: p.isFrame, isShield: p.isShield, cls: p.i === sel ? "thumb on" : "thumb", pick: pick(p.i) }; });
    var fmt = function (n) { return "$" + Number(n).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 }); };
    var total = 0, missing = false;
    var cartItems = s.items.map(function (x, n) { var p = P[x.i]; var pr = s.prices[x.i]; if (pr == null) missing = true; else total += pr * x.qty;
      var upd = function (q) { return function () { var it = s.items.map(function (y) { return Object.assign({}, y); }); if (q === 0) it.splice(n, 1); else { it[n].qty = Math.max(1, it[n].qty + q); } self.setState({ items: it, checkoutErr: "" }); }; };
      return { name: p.name, img: p.img, qty: x.qty, priceLabel: pr != null ? fmt(pr) : T.askPrice, inc: upd(1), dec: upd(-1), remove: upd(0) }; });
    var selInDeck = deckItems.findIndex(function (p) { return p.i === sel; });
    return {
      d: d,
      selNum: "0" + ((selInDeck < 0 ? 0 : selInDeck) + 1),
      deckLabel: deckNames[s.deck],
      cards: cards, decks: decks, cats: cats, grid: grid, navs: navs, thumbs: thumbs, lenses: lenses,
      isHome: s.page === "home", isLine: s.page !== "home", line: line, featured: featured, deckShort: deckDefs.filter(function (x) { return x[0] === s.deck; })[0][1], deckCta: T.seeLine + deckDefs.filter(function (x) { return x[0] === s.deck; })[0][1] + T.lineSuf, fanCls: s.dealt ? "fanscale dealt" : "fanscale",
      goHome: function () { self.setState({ page: "home" }); top(); }, goSel: go(d.k, d.i), goDeck: go(s.deck),
      holdOn: function () { self.setState({ hold: true }); }, holdOff: function () { self.setState({ hold: false }); },
      t: Object.assign({}, T, { viewSel: T.view + d.name, added: d.name + T.addedSuf, allLine: (L === "en" ? "All " + line.title + " models" : "Todos los modelos " + line.title) }),
      marquee: T.marquee.concat(T.marquee).map(function (w, n) { return { w: w, st: { color: ["#5EE7FF", "#FF6B2C", "#7B5CFF"][n % 3] } }; }),
      langs: [["en", "EN", "English"], ["es", "ES", "Español"]].map(function (x) { return { label: x[1], aria: x[2], cls: L === x[0] ? "lang on" : "lang", pick: function () { self.setState({ lang: x[0] }); } }; }),
      cart: s.items.reduce(function (a, x) { return a + x.qty; }, 0), toast: s.toast,
      addCart: function () { var it = s.items.slice(); var f = it.find(function (x) { return x.i === d.i; }); if (f) f.qty++; else it.push({ i: d.i, qty: 1 }); self.setState({ items: it, toast: true, cartOpen: true, checkoutErr: "" }); clearTimeout(self._t); self._t = setTimeout(function () { self.setState({ toast: false }); }, 2000); },
      openCart: function () { self.setState({ cartOpen: true }); }, closeCart: function () { self.setState({ cartOpen: false }); },
      cartOpen: s.cartOpen, cartEmpty: s.items.length === 0, cartItems: cartItems, cartTotal: fmt(total), missingPrice: missing, payDisabled: s.busy || missing || s.items.length === 0, payLabel: s.busy ? T.paying : T.pay, checkoutErr: s.checkoutErr, priceLabel: s.prices[d.i] != null ? fmt(s.prices[d.i]) : T.askPrice,
      checkout: function () { if (s.busy) return; self.setState({ busy: true, checkoutErr: "" }); try { localStorage.setItem("vysor_cart", JSON.stringify(s.items)); } catch (e) {} fetch("/api/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ items: s.items, lang: L }) }).then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }); }).then(function (res) { if (res.ok && res.j.url) { location.href = res.j.url; } else { self.setState({ busy: false, checkoutErr: (res.j && res.j.error) || T.errGeneric }); } }).catch(function () { self.setState({ busy: false, checkoutErr: T.errGeneric }); }); }
    };
  }
  render() { const v = this.renderVals(); return html`
<div id="inicio" style="width:100%;min-height:100vh;background:#06070A;color:#F2F4F8;font-family:Inter,sans-serif;position:relative;overflow:hidden">


<header style="position:sticky;top:0;z-index:50;display:flex;justify-content:center;align-items:center;gap:16px;padding:18px 16px;flex-wrap:wrap">
<a href="#inicio" onClick=${v.goHome} style="font:700 20px 'Space Grotesk',sans-serif;letter-spacing:.32em;color:#F2F4F8;text-decoration:none;min-height:44px;display:flex;align-items:center">VYSOR</a>
<nav class="navpill" aria-label="Principal">
${(v.navs || []).map((n, $index) => html`
<a class=${n.cls} href=${n.href} onClick=${n.pick}>${n.label}</a>
`)}
<button class="navbtn" style="background:none;cursor:pointer" onClick=${v.openCart} aria-label=${v.t.cartAria}>
<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M5 7h14l-1.4 11.2a2 2 0 0 1-2 1.8H8.4a2 2 0 0 1-2-1.8z"></path><path d="M9 7V5.5a3 3 0 0 1 6 0V7"></path></svg>
<span style="min-width:22px;height:22px;border-radius:999px;background:#5EE7FF;color:#06070A;font:600 12px Inter,sans-serif;display:inline-flex;align-items:center;justify-content:center">${v.cart}</span>
</button>
</nav>
<div class="langpill" role="group" aria-label="Language / Idioma">
${(v.langs || []).map((lg, $index) => html`
<button class=${lg.cls} onClick=${lg.pick} aria-label=${lg.aria}>${lg.label}</button>
`)}
</div>
</header>


<svg class="flow" aria-hidden="true" viewBox="0 0 1440 900" preserveAspectRatio="none" style="position:absolute;inset:0;width:100%;height:900px;pointer-events:none">
<path d="M-40 640 C 300 520, 520 760, 760 600 S 1200 420, 1500 560" fill="none" stroke="#5EE7FF" stroke-opacity=".35" stroke-width="1.2"></path>
<path class="slow" d="M-40 700 C 260 640, 560 820, 820 680 S 1180 520, 1500 640" fill="none" stroke="#7B5CFF" stroke-opacity=".35" stroke-width="1.2"></path>
<path d="M-40 580 C 340 460, 600 640, 900 520 S 1260 380, 1500 470" fill="none" stroke="#FF6B2C" stroke-opacity=".25" stroke-width="1"></path>
<path class="slow" d="M720 0 C 720 160, 700 220, 720 330" fill="none" stroke="#5EE7FF" stroke-opacity=".35" stroke-width="1"></path>
</svg>
<div aria-hidden="true" style="position:absolute;left:50%;top:180px;width:900px;height:600px;transform:translateX(-50%);background:radial-gradient(closest-side,rgba(94,231,255,.10),transparent);pointer-events:none"></div>

${v.isHome ? html`

<section style="position:relative;max-width:1320px;margin:0 auto;padding:24px 24px 0;text-align:center">
<p style="margin:12px 0 0;font:500 12px Inter,sans-serif;letter-spacing:.42em;color:#9AA3B2;animation:rise .8s both">${v.t.kicker}</p>
<h1 class="hero-title" style="margin:14px auto 0;max-width:980px;font:600 76px/1 'Space Grotesk',sans-serif;letter-spacing:-.03em;animation:rise .9s .1s both">${v.t.h1a}<br>${v.t.h1b}</h1>
<div style="margin-top:34px;display:flex;gap:8px;justify-content:center;flex-wrap:wrap" role="group" aria-label="Elegir línea">
${(v.decks || []).map((dk, $index) => html`
<button class=${dk.cls} onClick=${dk.pick}>${dk.label}</button>
`)}
</div>
<div style="margin-top:26px;display:flex;flex-direction:column;align-items:center;gap:2px">
<span style="font:600 44px 'Space Grotesk',sans-serif;color:rgba(242,244,248,.14);line-height:1">${v.selNum}</span>
<span style="font:500 12px Inter,sans-serif;letter-spacing:.42em;color:#AEB6C4">${v.deckLabel} · ${v.t.sevenLaunches}</span>
</div>
<div class="fanwrap">
<div class=${v.fanCls} style="position:relative;width:230px;height:420px" onMouseEnter=${v.holdOn} onMouseLeave=${v.holdOff}>
${(v.cards || []).map((c, $index) => html`
<button class=${c.cls} style=${c.pos} onClick=${c.pick} aria-label=${c.name}>
<div class="dealer" style=${c.dealStyle}>
<div class="inner">
<div class="flip" style=${c.flipStyle}>
<div class="face back" aria-hidden="true">
<span style="font:700 22px 'Space Grotesk',sans-serif;letter-spacing:.4em;color:#F2F4F8;padding-left:.4em">VYSOR</span>
<span style="font:500 10px Inter,sans-serif;letter-spacing:.3em;color:#5EE7FF">${c.num} · ${c.cat}</span>
</div>
<div class="face front" style=${c.bg}>
<div class="scanline"></div>
<div class="sheen"></div>
<div style="position:absolute;top:16px;left:16px;right:16px;display:flex;justify-content:space-between;font:500 10px Inter,sans-serif;letter-spacing:.24em;color:rgba(255,255,255,.75)"><span>${c.num}</span><span>${c.ref}</span></div>
<div class="glass"><img src=${c.img} alt=""></div>
<div style="position:absolute;left:18px;right:18px;bottom:18px;text-align:left">
<div style="font:600 19px/1.15 'Space Grotesk',sans-serif;color:#fff">${c.name}</div>
<div style="margin-top:6px;font:400 11px/1.4 Inter,sans-serif;color:rgba(255,255,255,.78)">${c.short}</div>
<div style="margin-top:8px;font:500 10px Inter,sans-serif;letter-spacing:.18em;color:rgba(255,255,255,.9)">${v.t.launchUp} · ${c.date}</div>
</div>
</div>
</div>
</div>
</div>
</button>
`)}
</div>
</div>
<div style="display:flex;gap:14px;justify-content:center;flex-wrap:wrap;padding-bottom:40px">
<a class="cta" href="#inicio" onClick=${v.goSel}>${v.t.viewSel} <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"></path></svg></a>
<a class="ghost" href="#inicio" onClick=${v.goDeck}>${v.deckCta}</a>
</div>
</section>


<div aria-hidden="true" style="border-top:1px solid rgba(255,255,255,.07);border-bottom:1px solid rgba(255,255,255,.07);overflow:hidden;padding:18px 0">
<div style="display:flex;gap:56px;width:max-content;animation:marquee 28s linear infinite;font:500 15px 'Space Grotesk',sans-serif;letter-spacing:.3em;color:#7E8796;white-space:nowrap">
${(v.marquee || []).map((mw, $index) => html`<span>${mw.w}</span><span style=${mw.st}>✦</span>`)}
</div>
</div>


<section id="categorias" style="max-width:1240px;margin:0 auto;padding:110px 24px 40px">
<div style="display:flex;justify-content:space-between;align-items:flex-end;gap:24px;flex-wrap:wrap;margin-bottom:40px">
<h2 style="margin:0;font:600 48px/1.05 'Space Grotesk',sans-serif;letter-spacing:-.02em;max-width:620px">${v.t.catH1} <span style="color:#7E8796">${v.t.catH2}</span></h2>
<p style="margin:0;max-width:380px;color:#9AA3B2;font-size:15px;line-height:1.6">${v.t.catP}</p>
</div>
<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:22px">
${(v.cats || []).map((k, $index) => html`
<a class="glow" href="#inicio" onClick=${k.pick} style=${k.bg}>
<div style="display:flex;justify-content:space-between;font:500 12px Inter,sans-serif;color:rgba(255,255,255,.7)"><span>${k.kicker}</span><span style="border:1px solid rgba(255,255,255,.2);border-radius:999px;padding:4px 10px">${v.t.seeModels}</span></div>
<svg viewBox="0 0 300 120" style="width:100%;height:120px" aria-hidden="true">
<path d=${k.curve} fill="none" stroke=${k.color} stroke-width="2.5" stroke-linecap="round"></path>
<circle r="6" fill="#fff"><animateMotion dur="4s" repeatCount="indefinite" path=${k.curve}></animateMotion></circle>
<circle r="14" fill=${k.color} fill-opacity=".3"><animateMotion dur="4s" repeatCount="indefinite" path=${k.curve}></animateMotion></circle>
</svg>
<div style="text-align:center">
<div style="font:500 13px Inter,sans-serif;color:rgba(255,255,255,.75)">${k.label}</div>
<div style="font:600 52px/1.1 'Space Grotesk',sans-serif;color:#fff">${k.count}<span style="font-size:20px;color:rgba(255,255,255,.7)">${v.t.modelsSp}</span></div>
</div>
</a>
`)}
</div>
</section>


<section style="max-width:1240px;margin:0 auto;padding:40px 24px 40px">
<div style="display:flex;justify-content:space-between;align-items:flex-end;gap:24px;flex-wrap:wrap;margin-bottom:32px">
<h2 style="margin:0;font:600 48px/1.05 'Space Grotesk',sans-serif;letter-spacing:-.02em">${v.t.newest}</h2>
<p style="margin:0;max-width:380px;color:#9AA3B2;font-size:15px;line-height:1.6">${v.t.newestP}</p>
</div>
<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:20px">
${(v.featured || []).map((g, $index) => html`
<a class="pcard" href="#inicio" onClick=${g.pick} style=${g.delay}>
<div class="pimg" style=${g.bg}>
<img src=${g.img} alt="" style="height:190px;width:auto;display:block">
</div>
<div style="padding:18px 20px 20px;display:flex;flex-direction:column;gap:6px">
<span style="font:500 11px Inter,sans-serif;letter-spacing:.24em;color:#8C95A4">${g.cat}</span>
<span style="font:600 18px 'Space Grotesk',sans-serif">${g.name}</span>
<div style="display:flex;justify-content:space-between;gap:12px;font-size:13px;color:#AEB6C4"><span>${g.date}</span><span>${v.t.ref} ${g.ref}</span></div>
</div>
</a>
`)}
</div>
</section>
` : null}

${v.isLine ? html`

<section style="position:relative;max-width:1320px;margin:0 auto;padding:40px 24px 0;text-align:center;animation:rise .7s both">
<p style="margin:0;font:500 12px Inter,sans-serif;letter-spacing:.42em;color:${v.line.color}">${v.line.kicker}</p>
<h1 class="line-title" style="margin:14px 0 0;font:600 88px/1 'Space Grotesk',sans-serif;letter-spacing:-.03em">${v.line.title}</h1>
<p style="margin:18px auto 0;max-width:560px;color:#AEB6C4;font-size:16px;line-height:1.6">${v.line.desc}</p>
</section>

<section id="detalle" style="position:relative;margin:56px auto 0;max-width:1320px;padding:0 24px">
<div style="position:relative;border-radius:36px;overflow:hidden;background:radial-gradient(90% 120% at 50% 0%, rgba(255,255,255,.06), #0B0D12 70%);border:1px solid rgba(255,255,255,.06);padding:48px 40px 40px">
<div class="giant" aria-hidden="true" style="position:absolute;top:-10px;left:0;right:0;text-align:center;font:700 200px/1 'Space Grotesk',sans-serif;letter-spacing:-.04em;color:transparent;-webkit-text-stroke:1.5px rgba(255,255,255,.16);white-space:nowrap;pointer-events:none">${v.d.word}</div>
<div style="position:relative;display:flex;flex-wrap:wrap;gap:40px;align-items:stretch">
<div style="flex:1 1 260px;display:flex;flex-direction:column;gap:18px;padding-top:120px">
<span style="font:500 12px Inter,sans-serif;letter-spacing:.3em;color:#AEB6C4">${v.d.cat}</span>
<h2 style="margin:0;font:600 40px/1.05 'Space Grotesk',sans-serif">${v.d.name}</h2>
<p style="margin:0;color:#C3C9D4;font-size:15px;line-height:1.65;max-width:340px">${v.d.desc}</p>
<div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:6px">
${(v.thumbs || []).map((t, $index) => html`
<button class=${t.cls} onClick=${t.pick} aria-label=${t.name}>
<img src=${t.img} alt="" style="height:52px;width:auto;display:block">
</button>
`)}
</div>
</div>

<div class="zoom" style="flex:2 1 420px;min-height:420px;display:flex;flex-direction:column;align-items:center;justify-content:center;position:relative">
<div style="width:100%;max-width:560px;animation:floaty 6s ease-in-out infinite">
<img src=${v.d.img} alt=${v.d.name} style="width:100%;height:auto;display:block;filter:drop-shadow(0 40px 40px rgba(0,0,0,.55))">
</div>
<div aria-hidden="true" style="width:60%;height:26px;margin-top:30px;border-radius:50%;background:radial-gradient(closest-side,rgba(0,0,0,.6),transparent)"></div>
<span style="margin-top:14px;font:500 11px Inter,sans-serif;letter-spacing:.3em;color:#8C95A4">${v.t.renderNote}</span>
</div>

<div style="flex:1 1 240px;display:flex;flex-direction:column;gap:22px;padding-top:120px">
<div style="display:flex;align-items:center;gap:8px;font-size:13px;color:#C3C9D4"><span style="width:8px;height:8px;border-radius:99px;background:#3DDC97;animation:pulse 1.6s infinite"></span>${v.t.avail}</div>
<div style="display:flex;justify-content:space-between;border-top:1px solid rgba(255,255,255,.1);padding-top:16px"><span style="color:#AEB6C4;font-size:13px;letter-spacing:.2em">${v.t.launchUp}</span><span style="font-size:14px">${v.d.date}</span></div>
<div style="display:flex;justify-content:space-between"><span style="color:#AEB6C4;font-size:13px;letter-spacing:.2em">${v.t.refOff}</span><span style="font-size:14px;color:#C3C9D4">${v.d.ref}</span></div>
<div style="display:flex;justify-content:space-between"><span style="color:#AEB6C4;font-size:13px;letter-spacing:.2em">${v.t.price}</span><span style="font:600 22px 'Space Grotesk',sans-serif">${v.priceLabel}</span></div>

<button class="cta" onClick=${v.addCart} style="justify-content:center;width:100%">${v.t.addCart}</button>
${v.toast ? html`
<div role="status" style="font-size:13px;color:#5EE7FF;animation:rise .4s both">✓ ${v.t.added}</div>
` : null}
<ul style="margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:10px;font-size:13px;color:#C3C9D4">
${(v.d.feats || []).map((f, $index) => html`<li style="display:flex;gap:10px;align-items:center"><span style="width:16px;height:1px;background:#5EE7FF"></span>${f}</li>`)}
</ul>
</div>
</div>
<div style="position:relative;margin-top:44px;border-top:1px solid rgba(255,255,255,.1);padding-top:28px">
<div style="display:flex;justify-content:space-between;align-items:baseline;gap:16px;flex-wrap:wrap;margin-bottom:18px">
<h3 style="margin:0;font:600 22px 'Space Grotesk',sans-serif;letter-spacing:.02em">${v.t.specsTitle} · ${v.d.name}</h3>
<span style="font-size:12px;color:#8C95A4">${v.t.specsNote}</span>
</div>
<dl style="margin:0;display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));column-gap:40px">
${(v.d.specs || []).map((sp, $index) => html`
<div style="display:flex;justify-content:space-between;gap:16px;padding:14px 0;border-bottom:1px solid rgba(255,255,255,.07)">
<dt style="font:500 12px Inter,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#8C95A4">${sp.k}</dt>
<dd style="margin:0;font-size:14px;color:#F2F4F8;text-align:right">${sp.v}</dd>
</div>
`)}
</dl>
</div>
</div>
</section>


<section id="catalogo" style="max-width:1240px;margin:0 auto;padding:120px 24px 60px">
<div style="display:flex;justify-content:space-between;align-items:flex-end;gap:24px;flex-wrap:wrap;margin-bottom:32px">
<h2 style="margin:0;font:600 48px/1.05 'Space Grotesk',sans-serif;letter-spacing:-.02em">${v.t.allLine}</h2>
<span style="color:#9AA3B2;font-size:15px">${v.line.count}</span>
</div>
<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:20px">
${(v.grid || []).map((g, $index) => html`
<a class="pcard" href="#detalle" onClick=${g.pick} style=${g.delay}>
<div class="pimg" style=${g.bg}>
<img src=${g.img} alt="" style="height:190px;width:auto;display:block">
</div>
<div style="padding:18px 20px 20px;display:flex;flex-direction:column;gap:6px">
<span style="font:500 11px Inter,sans-serif;letter-spacing:.24em;color:#8C95A4">${g.cat}</span>
<span style="font:600 18px 'Space Grotesk',sans-serif">${g.name}</span>
<div style="display:flex;justify-content:space-between;gap:12px;font-size:13px;color:#AEB6C4"><span>${g.date}</span><span>${v.t.ref} ${g.ref}</span></div>
</div>
</a>
`)}
</div>
</section>

` : null}

${v.cartOpen ? html`
<div class="overlay" onClick=${v.closeCart}></div>
<aside class="drawer" role="dialog" aria-label=${v.t.cartTitle}>
<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:18px">
<h2 style="margin:0;font:600 24px 'Space Grotesk',sans-serif">${v.t.cartTitle}</h2>
<button class="navbtn" style="background:none;cursor:pointer" onClick=${v.closeCart} aria-label=${v.t.close}>✕</button>
</div>
${v.cartEmpty ? html`<p style="color:#9AA3B2">${v.t.cartEmpty}</p>` : null}
<div style="display:flex;flex-direction:column;gap:14px;overflow-y:auto;flex:1">
${(v.cartItems || []).map((ci, $index) => html`
<div style="display:flex;gap:12px;align-items:center;border:1px solid rgba(255,255,255,.08);border-radius:16px;padding:10px">
<img src=${ci.img} alt="" style="width:64px;height:64px;object-fit:contain;border-radius:10px;background:#11141B">
<div style="flex:1;min-width:0">
<div style="font:600 14px 'Space Grotesk',sans-serif">${ci.name}</div>
<div style="font-size:13px;color:#AEB6C4">${ci.priceLabel}</div>
<div style="display:flex;gap:6px;align-items:center;margin-top:6px">
<button class="qty" onClick=${ci.dec} aria-label="−">−</button><span style="min-width:20px;text-align:center">${ci.qty}</span><button class="qty" onClick=${ci.inc} aria-label="+">+</button>
<button class="qty" style="width:auto;padding:0 10px;margin-left:auto" onClick=${ci.remove}>${v.t.remove}</button>
</div>
</div>
</div>
`)}
</div>
<div style="border-top:1px solid rgba(255,255,255,.1);padding-top:16px;margin-top:16px;display:flex;flex-direction:column;gap:12px">
<div style="display:flex;justify-content:space-between;font:600 18px 'Space Grotesk',sans-serif"><span>${v.t.total}</span><span>${v.cartTotal}</span></div>
${v.missingPrice ? html`<p style="margin:0;font-size:12px;color:#FF8A4C">${v.t.missingPrice}</p>` : null}
<button class="cta" style="justify-content:center;width:100%" onClick=${v.checkout} disabled=${v.payDisabled}>${v.payLabel}</button>
${v.checkoutErr ? html`<p role="alert" style="margin:0;font-size:13px;color:#FF6B6B">${v.checkoutErr}</p>` : null}
<p style="margin:0;font-size:12px;color:#8C95A4;text-align:center">${v.t.secure}</p>
</div>
</aside>
` : null}


<section style="position:relative;max-width:1240px;margin:40px auto 0;padding:0 24px 80px">
<div style="position:relative;border-radius:36px;overflow:hidden;border:1px solid rgba(255,255,255,.08);background:radial-gradient(120% 140% at 50% 0%,#14203A 0%,#06070A 60%);padding:80px 32px;text-align:center">
<svg class="flow" aria-hidden="true" viewBox="0 0 1200 300" preserveAspectRatio="none" style="position:absolute;inset:0;width:100%;height:100%"><path d="M0 220 C 300 120, 600 300, 1200 140" fill="none" stroke="#5EE7FF" stroke-opacity=".4"></path><path class="slow" d="M0 250 C 360 170, 700 320, 1200 180" fill="none" stroke="#7B5CFF" stroke-opacity=".4"></path></svg>
<h2 style="position:relative;margin:0 auto;max-width:760px;font:600 52px/1.05 'Space Grotesk',sans-serif;letter-spacing:-.02em">${v.t.ctaH}</h2>
<p style="position:relative;margin:18px auto 0;max-width:520px;color:#AEB6C4;font-size:16px;line-height:1.6">${v.t.ctaP}</p>
<div style="position:relative;margin-top:30px;display:flex;gap:14px;justify-content:center;flex-wrap:wrap">
<a class="cta" href="#inicio">${v.t.whats}</a>
<a class="ghost" href="#inicio" onClick=${v.goHome}>${v.t.backHome}</a>
</div>
</div>
<footer style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:16px;padding-top:40px;color:#7E8796;font-size:13px">
<span style="font:700 15px 'Space Grotesk',sans-serif;letter-spacing:.3em;color:#C3C9D4">VYSOR</span>
<span>${v.t.footer}</span>
<span>${v.t.contact}</span>
</footer>
</section>
</div>
`; }
}

render(html`<${App} />`, document.getElementById("app"));
