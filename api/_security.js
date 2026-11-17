// Utilidades de seguridad compartidas (los archivos que empiezan con "_" no se publican como rutas).
const crypto = require("crypto");

function siteUrl(req) {
  return (process.env.SITE_URL || `https://${req.headers.host}`).replace(/\/+$/, "");
}

// Acepta solo peticiones que vienen de la propia tienda (bloquea otros sitios que intenten usar la API).
function sameOrigin(req) {
  const allowed = new Set([siteUrl(req), `https://${req.headers.host}`]);
  const o = req.headers.origin;
  if (o) return allowed.has(o);
  const r = req.headers.referer;
  if (r) { try { return allowed.has(new URL(r).origin); } catch (e) { return false; } }
  return false;
}

function safeEqual(a, b) {
  const x = crypto.createHash("sha256").update(String(a)).digest();
  const y = crypto.createHash("sha256").update(String(b)).digest();
  return crypto.timingSafeEqual(x, y);
}

// ---- Código de 6 dígitos del celular (TOTP, compatible con Google Authenticator) ----
function base32Decode(s) {
  const alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  let bits = "";
  for (const c of String(s).toUpperCase().replace(/[^A-Z2-7]/g, "")) bits += alpha.indexOf(c).toString(2).padStart(5, "0");
  const out = [];
  for (let i = 0; i + 8 <= bits.length; i += 8) out.push(parseInt(bits.slice(i, i + 8), 2));
  return Buffer.from(out);
}
function totpAt(secret, counter) {
  const buf = Buffer.alloc(8);
  buf.writeBigUInt64BE(BigInt(counter));
  const h = crypto.createHmac("sha1", base32Decode(secret)).update(buf).digest();
  const o = h[h.length - 1] & 0xf;
  const n = ((h[o] & 0x7f) << 24) | (h[o + 1] << 16) | (h[o + 2] << 8) | h[o + 3];
  return String(n % 1e6).padStart(6, "0");
}
function verifyTotp(secret, code, now = Date.now()) {
  if (!secret || !/^\d{6}$/.test(String(code || ""))) return false;
  const c = Math.floor(now / 30000);
  let ok = false;
  for (const d of [-1, 0, 1]) if (safeEqual(totpAt(secret, c + d), code)) ok = true;
  return ok;
}

// ---- Sesión del panel: cookie firmada, solo accesible por el servidor ----
const COOKIE = "__Host-vysor_admin";
const HOURS = 8;
function sign(v) {
  return crypto.createHmac("sha256", process.env.ADMIN_SESSION_SECRET || "").update(v).digest("base64url");
}
function makeSession() {
  const exp = Date.now() + HOURS * 3600e3;
  const v = `${exp}.${crypto.randomBytes(16).toString("base64url")}`;
  return `${COOKIE}=${v}.${sign(v)}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${HOURS * 3600}`;
}
function clearSession() {
  return `${COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`;
}
function hasSession(req) {
  if (!process.env.ADMIN_SESSION_SECRET) return false;
  const m = String(req.headers.cookie || "").split(/;\s*/).find((c) => c.startsWith(COOKIE + "="));
  if (!m) return false;
  const parts = m.slice(COOKIE.length + 1).split(".");
  if (parts.length !== 3) return false;
  const v = parts[0] + "." + parts[1];
  if (!safeEqual(sign(v), parts[2])) return false;
  return Number(parts[0]) > Date.now();
}

module.exports = { siteUrl, sameOrigin, safeEqual, verifyTotp, totpAt, makeSession, clearSession, hasSession };
