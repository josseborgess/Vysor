// Adapta las funciones estilo Vercel (req, res) al formato de Netlify Functions.
module.exports = function wrap(handler) {
  return async function (event) {
    const headers = {};
    for (const k in (event.headers || {})) headers[k.toLowerCase()] = event.headers[k];
    let raw = event.body || "";
    if (event.isBase64Encoded && raw) raw = Buffer.from(raw, "base64").toString("utf8");
    let body = raw;
    if (raw && String(headers["content-type"] || "").startsWith("application/json")) {
      try { body = JSON.parse(raw); } catch (e) { body = {}; }
    }
    const req = { method: event.httpMethod, headers, body, query: event.queryStringParameters || {}, url: event.rawUrl || event.path };
    const out = { statusCode: 200, headers: {}, multiValueHeaders: {}, body: "" };
    let done;
    const finished = new Promise((r) => { done = r; });
    const res = {
      status(c) { out.statusCode = c; return res; },
      setHeader(k, v) {
        if (Array.isArray(v) || k.toLowerCase() === "set-cookie") out.multiValueHeaders[k] = [].concat(v);
        else out.headers[k] = String(v);
        return res;
      },
      json(o) { out.headers["Content-Type"] = "application/json; charset=utf-8"; out.body = JSON.stringify(o); done(); return res; },
      send(s) { out.body = typeof s === "string" ? s : JSON.stringify(s); done(); return res; },
      end(s) { if (s) out.body = String(s); done(); return res; }
    };
    out.headers["X-Robots-Tag"] = "noindex";
    out.headers["Cross-Origin-Resource-Policy"] = "same-origin";
    out.headers["Cache-Control"] = "no-store";
    await Promise.race([Promise.resolve(handler(req, res)).then(() => done()), finished]);
    return out;
  };
};
