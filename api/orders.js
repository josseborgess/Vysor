// Panel de pedidos de VYSOR.
// Lee los pedidos directamente de Stripe (la fuente de verdad del pago), así
// el panel nunca muestra una venta que Stripe no haya cobrado de verdad.
// Requiere STRIPE_SECRET_KEY y una sesión válida del panel (ver admin-login.js).
const { hasSession, sameOrigin } = require("./_security");

const STATUSES = ["nuevo", "preparando", "enviado", "entregado", "cancelado"];

async function stripe(key, path, body) {
  const r = await fetch("https://api.stripe.com/v1/" + path, {
    method: body ? "POST" : "GET",
    headers: {
      Authorization: "Bearer " + key,
      ...(body ? { "Content-Type": "application/x-www-form-urlencoded" } : {}),
    },
    body: body ? body.toString() : undefined,
  });
  const data = await r.json();
  if (!r.ok) throw new Error((data.error && data.error.message) || "Error de Stripe");
  return data;
}

function addr(a) {
  if (!a) return null;
  return {
    line1: a.line1 || "", line2: a.line2 || "", city: a.city || "",
    state: a.state || "", postal_code: a.postal_code || "", country: a.country || "",
  };
}

function toOrder(s) {
  const pi = s.payment_intent && typeof s.payment_intent === "object" ? s.payment_intent : null;
  const ch = pi && pi.latest_charge && typeof pi.latest_charge === "object" ? pi.latest_charge : null;
  const card = ch && ch.payment_method_details && ch.payment_method_details.card;
  const cd = s.customer_details || {};
  const ship =
    (s.collected_information && s.collected_information.shipping_details) ||
    s.shipping_details || null;
  const checks = (card && card.checks) || {};
  const refunded = ch ? ch.amount_refunded || 0 : 0;
  const meta = (pi && pi.metadata) || {};

  // "Verificado" = Stripe confirma que el dinero se cobró y no fue reembolsado ni disputado.
  const paid = s.payment_status === "paid" && pi && pi.status === "succeeded" && ch && ch.paid && ch.status === "succeeded";
  const disputed = !!(ch && ch.disputed);

  return {
    id: s.id,
    payment_intent: pi ? pi.id : null,
    created: s.created,
    total: (s.amount_total || 0) / 100,
    currency: (s.currency || "usd").toUpperCase(),
    livemode: !!s.livemode,
    verified: paid && !disputed && refunded === 0,
    paid,
    refunded: refunded / 100,
    disputed,
    status: STATUSES.includes(meta.vysor_status) ? meta.vysor_status : "nuevo",
    tracking: meta.vysor_tracking || "",
    note: meta.vysor_note || "",
    customer: { name: cd.name || "", email: cd.email || "", phone: cd.phone || "", address: addr(cd.address) },
    shipping: ship ? { name: ship.name || "", address: addr(ship.address) } : null,
    items: ((s.line_items && s.line_items.data) || []).map((li) => ({
      name: li.description, qty: li.quantity, total: (li.amount_total || 0) / 100,
    })),
    card: card ? {
      brand: card.brand, last4: card.last4, country: card.country,
      wallet: card.wallet ? card.wallet.type : null,
      cvc_check: checks.cvc_check || null,
      address_check: checks.address_line1_check || null,
      postal_check: checks.address_postal_code_check || null,
    } : null,
    risk: ch && ch.outcome ? { level: ch.outcome.risk_level || null, score: ch.outcome.risk_score ?? null, seller_message: ch.outcome.seller_message || "" } : null,
    receipt_url: ch ? ch.receipt_url || null : null,
  };
}

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return res.status(500).json({ error: "El panel aún no está configurado." });
  if (!hasSession(req)) return res.status(401).json({ error: "Sesión vencida. Vuelve a entrar." });
  if (req.method !== "GET" && !sameOrigin(req)) return res.status(403).json({ error: "Forbidden" });

  try {
    if (req.method === "GET") {
      const q = new URLSearchParams();
      q.append("limit", "100");
      q.append("status", "complete");
      q.append("expand[]", "data.line_items");
      q.append("expand[]", "data.payment_intent.latest_charge");
      if (req.query && /^cs_[A-Za-z0-9_]+$/.test(String(req.query.starting_after || ""))) q.append("starting_after", String(req.query.starting_after));
      const list = await stripe(key, "checkout/sessions?" + q.toString());
      const orders = list.data.filter((s) => s.mode === "payment").map(toOrder);
      return res.status(200).json({ orders, has_more: !!list.has_more, livemode: key.startsWith("sk_live") });
    }

    if (req.method === "POST") {
      const b = req.body || {};
      const pi = String(b.payment_intent || "");
      if (!/^pi_[A-Za-z0-9]+$/.test(pi)) return res.status(400).json({ error: "Pedido inválido." });
      const form = new URLSearchParams();
      if (b.status !== undefined) {
        if (!STATUSES.includes(b.status)) return res.status(400).json({ error: "Estado inválido." });
        form.append("metadata[vysor_status]", b.status);
      }
      if (b.tracking !== undefined) form.append("metadata[vysor_tracking]", String(b.tracking).slice(0, 200));
      if (b.note !== undefined) form.append("metadata[vysor_note]", String(b.note).slice(0, 450));
      await stripe(key, "payment_intents/" + pi, form);
      return res.status(200).json({ ok: true });
    }

    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ error: "Method not allowed" });
  } catch (e) {
    return res.status(502).json({ error: "No se pudo leer Stripe: " + e.message });
  }
};
