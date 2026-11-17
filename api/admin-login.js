// Entrada al panel: contraseña + código de 6 dígitos del celular.
const { sameOrigin, safeEqual, verifyTotp, makeSession, clearSession } = require("./_security");

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  if (req.method === "DELETE") {
    if (!sameOrigin(req)) return res.status(403).json({ error: "Forbidden" });
    res.setHeader("Set-Cookie", clearSession());
    return res.status(200).json({ ok: true });
  }
  if (req.method !== "POST") { res.setHeader("Allow", "POST, DELETE"); return res.status(405).json({ error: "Method not allowed" }); }
  if (!sameOrigin(req)) return res.status(403).json({ error: "Forbidden" });

  const { ADMIN_PASSWORD: pass, ADMIN_TOTP_SECRET: totp, ADMIN_SESSION_SECRET: ses } = process.env;
  if (!pass || !totp || !ses) return res.status(500).json({ error: "El panel aún no está configurado." });

  const b = req.body || {};
  const okPass = safeEqual(String(b.password || ""), pass);
  const okCode = verifyTotp(totp, String(b.code || "").replace(/\s/g, ""));
  if (!okPass || !okCode) {
    console.warn("admin-login-failed", { ip: req.headers["x-forwarded-for"] || "", at: new Date().toISOString() });
    await new Promise((r) => setTimeout(r, 1200));
    return res.status(401).json({ error: "Contraseña o código incorrectos." });
  }
  console.info("admin-login-ok", { ip: req.headers["x-forwarded-for"] || "", at: new Date().toISOString() });
  res.setHeader("Set-Cookie", makeSession());
  return res.status(200).json({ ok: true });
};
