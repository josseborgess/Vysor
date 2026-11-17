// Crea una sesión de Stripe Checkout con los precios del catálogo del servidor.
// Requiere la variable de entorno STRIPE_SECRET_KEY en Vercel.
const catalog = require("../catalog.json");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }
  const { sameOrigin, siteUrl } = require("./_security");
  if (!sameOrigin(req)) return res.status(403).json({ error: "Forbidden" });
  if (!String(req.headers["content-type"] || "").startsWith("application/json")) return res.status(415).json({ error: "Unsupported" });
  const key = process.env.STRIPE_SECRET_KEY;
  const es = req.body && req.body.lang === "es";
  if (!key) return res.status(500).json({ error: es ? "Los pagos aún no están activados." : "Payments are not enabled yet." });

  const items = Array.isArray(req.body && req.body.items) ? req.body.items : [];
  if (!items.length || items.length > 30) return res.status(400).json({ error: es ? "Carrito vacío." : "Empty cart." });

  const origin = siteUrl(req);
  const form = new URLSearchParams();
  form.append("mode", "payment");
  form.append("success_url", `${origin}/gracias.html?session_id={CHECKOUT_SESSION_ID}`);
  form.append("cancel_url", `${origin}/?cancel=1`);
  form.append("locale", es ? "es" : "en");
  form.append("phone_number_collection[enabled]", "true");
  (process.env.SHIPPING_COUNTRIES || "US,EC").split(",").forEach((c, n) =>
    form.append(`shipping_address_collection[allowed_countries][${n}]`, c.trim()));

  let line = 0;
  for (const it of items) {
    const idx = Number(it && it.i);
    const p = Number.isInteger(idx) && idx >= 0 && idx < catalog.length ? catalog[idx] : null;
    const qty = Math.max(1, Math.min(10, parseInt(it.qty, 10) || 1));
    if (!p) return res.status(400).json({ error: es ? "Producto inválido." : "Invalid product." });
    if (typeof p.price !== "number" || p.price <= 0) {
      return res.status(400).json({ error: (es ? "Sin precio: " : "No price yet: ") + p.name });
    }
    form.append(`line_items[${line}][quantity]`, String(qty));
    form.append(`line_items[${line}][price_data][currency]`, "usd");
    form.append(`line_items[${line}][price_data][unit_amount]`, String(Math.round(p.price * 100)));
    form.append(`line_items[${line}][price_data][product_data][name]`, p.name);
    form.append(`line_items[${line}][price_data][product_data][images][0]`, origin + p.img);
    form.append(`metadata[item_${line}]`, `${p.index}x${qty}`);
    line++;
  }

  try {
    const r = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/x-www-form-urlencoded" },
      body: form.toString()
    });
    const j = await r.json();
    if (!r.ok) {
      console.error("Stripe error", j && j.error && j.error.message);
      return res.status(502).json({ error: es ? "No pudimos iniciar el pago." : "We couldn't start the payment." });
    }
    return res.status(200).json({ url: j.url });
  } catch (e) {
    console.error(e);
    return res.status(502).json({ error: es ? "No pudimos iniciar el pago." : "We couldn't start the payment." });
  }
};
