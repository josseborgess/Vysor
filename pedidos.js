(function(){
  var orders = [], hasMore = false, open = {};
  var $ = function(id){ return document.getElementById(id); };
  var esc = function(s){ return String(s == null ? "" : s).replace(/[&<>"']/g, function(c){ return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]; }); };
  var money = function(n){ return "$" + Number(n||0).toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}); };
  var COUNTRY = {US:"Estados Unidos", EC:"Ecuador"};
  var LABEL = {nuevo:"Nuevo", preparando:"Preparando", enviado:"Enviado", entregado:"Entregado", cancelado:"Cancelado"};

  function toast(t){ var el=$("toast"); el.textContent=t; el.style.display="block"; clearTimeout(toast.t); toast.t=setTimeout(function(){ el.style.display="none"; },2200); }

  function api(method, body, qs){
    return fetch("/api/orders" + (qs||""), {
      method: method,
      credentials: "same-origin",
      headers: body ? {"Content-Type":"application/json"} : {},
      body: body ? JSON.stringify(body) : undefined
    }).then(function(r){ return r.json().then(function(d){ if(!r.ok){ var e=new Error(d.error||"Error"); e.status=r.status; throw e; } return d; }); });
  }

  function alerts(o){
    var a = [];
    if (!o.paid) a.push("Pago no confirmado");
    if (o.refunded) a.push("Reembolsado " + money(o.refunded));
    if (o.disputed) a.push("Cliente abrió disputa");
    if (o.risk && (o.risk.level === "elevated" || o.risk.level === "highest")) a.push("Riesgo " + (o.risk.level === "highest" ? "muy alto" : "elevado"));
    if (o.card && o.card.cvc_check === "fail") a.push("CVC no coincide");
    if (o.card && o.card.postal_check === "fail") a.push("Código postal no coincide");
    if (!o.shipping) a.push("Sin dirección de envío");
    if (!o.customer.phone) a.push("Sin teléfono");
    return a;
  }
  function ck(v){ return v === "pass" ? '<span class="chip ok">OK</span>' : v === "fail" ? '<span class="chip bad">Falló</span>' : '<span class="chip warn">No verificado</span>'; }
  function adr(a){ if(!a) return "—"; return esc([a.line1,a.line2].filter(Boolean).join(", ")) + "<br>" + esc([a.city,a.state,a.postal_code].filter(Boolean).join(", ")) + "<br>" + esc(COUNTRY[a.country]||a.country); }

  function render(){
    var q = $("q").value.trim().toLowerCase(), f = $("f").value;
    var ver = orders.filter(function(o){ return o.verified; });
    $("k1").textContent = ver.length;
    $("k2").textContent = money(ver.reduce(function(s,o){ return s + o.total; },0));
    $("k3").textContent = ver.filter(function(o){ return o.status === "nuevo" || o.status === "preparando"; }).length;
    $("k4").textContent = orders.filter(function(o){ return alerts(o).length; }).length;

    var list = orders.filter(function(o){
      if (f === "alerta" ? !alerts(o).length : (f && o.status !== f)) return false;
      if (!q) return true;
      var hay = [o.id,o.payment_intent,o.customer.name,o.customer.email,o.customer.phone,o.shipping&&o.shipping.name].concat(o.items.map(function(i){return i.name;})).join(" ").toLowerCase();
      return hay.indexOf(q) >= 0;
    });
    if (!list.length){ $("list").innerHTML = '<div class="empty">' + (orders.length ? "No hay pedidos con ese filtro." : "Todavía no hay pedidos.") + "</div>"; return; }

    $("list").innerHTML = list.map(function(o){
      var al = alerts(o), d = new Date(o.created*1000);
      var wa = (o.customer.phone||"").replace(/[^0-9]/g,"");
      var badge = o.verified ? '<span class="chip ok">✓ Verificado por Stripe</span>' : '<span class="chip bad">No verificado</span>';
      return '<div class="order' + (open[o.id] ? " open" : "") + '" data-id="' + esc(o.id) + '">' +
        '<div class="head" data-toggle="' + esc(o.id) + '">' +
          '<div><div class="who">' + esc(o.customer.name || "Sin nombre") + badge + '<span class="chip st">' + LABEL[o.status] + '</span>' + (al.length ? '<span class="chip warn">⚠ ' + al.length + '</span>' : "") + '</div>' +
          '<div class="sub">' + esc(o.items.map(function(i){ return i.qty + "× " + i.name; }).join(" · ")) + '</div>' +
          '<div class="sub">' + d.toLocaleString("es-EC",{dateStyle:"medium",timeStyle:"short"}) + '</div></div>' +
          '<div class="right"><div class="amt">' + money(o.total) + '</div><div class="sub">' + esc(o.currency) + '</div></div>' +
        '</div>' +
        '<div class="body">' +
          '<div class="box"><h3>Cliente</h3><p><b>' + esc(o.customer.name) + '</b></p>' +
            '<p><a href="mailto:' + esc(o.customer.email) + '">' + esc(o.customer.email || "—") + '</a></p>' +
            '<p>' + (o.customer.phone ? esc(o.customer.phone) + ' · <a target="_blank" rel="noopener" href="https://wa.me/' + wa + '">WhatsApp</a>' : "Sin teléfono") + '</p>' +
            '<p style="margin-top:8px;color:var(--mut);font-size:12px">Dirección de la tarjeta</p><p>' + adr(o.customer.address) + '</p></div>' +
          '<div class="box"><h3>Envío</h3>' + (o.shipping ? '<p><b>' + esc(o.shipping.name) + '</b></p><p>' + adr(o.shipping.address) + '</p>' : "<p>—</p>") +
            (o.tracking ? '<p style="margin-top:8px">Guía: <b>' + esc(o.tracking) + '</b></p>' : "") + '</div>' +
          '<div class="box"><h3>Productos</h3>' + o.items.map(function(i){ return '<div class="row"><span>' + i.qty + '× ' + esc(i.name) + '</span><span>' + money(i.total) + '</span></div>'; }).join("") +
            '<div class="row" style="border-top:1px solid var(--line);margin-top:6px;padding-top:6px"><b>Total</b><b>' + money(o.total) + '</b></div></div>' +
          '<div class="box"><h3>Verificación del pago</h3>' +
            '<p class="check">Cobro confirmado por Stripe ' + (o.paid ? '<span class="chip ok">Sí</span>' : '<span class="chip bad">No</span>') + '</p>' +
            (o.card ? '<p class="check">Tarjeta: ' + esc((o.card.brand||"").toUpperCase()) + ' •••• ' + esc(o.card.last4) + (o.card.wallet ? " (" + esc(o.card.wallet.replace("_"," ")) + ")" : "") + (o.card.country ? " · " + esc(o.card.country) : "") + '</p>' +
              '<p class="check">Código CVC ' + ck(o.card.cvc_check) + '</p><p class="check">Código postal ' + ck(o.card.postal_check) + '</p>' : "") +
            (o.risk ? '<p class="check">Riesgo de fraude: ' + (o.risk.level === "normal" ? '<span class="chip ok">Normal</span>' : '<span class="chip bad">' + esc(o.risk.level) + '</span>') + (o.risk.score != null ? " (" + o.risk.score + "/100)" : "") + '</p>' : "") +
            (al.length ? '<p class="check" style="color:var(--warn)">⚠ ' + esc(al.join(" · ")) + '</p>' : '<p class="check" style="color:var(--ok)">Sin alertas</p>') +
            (o.receipt_url ? '<p class="check"><a target="_blank" rel="noopener" href="' + esc(o.receipt_url) + '">Ver recibo de Stripe</a></p>' : "") +
            '<p class="check" style="color:var(--mut)">ID: ' + esc(o.payment_intent || o.id) + '</p></div>' +
          '<div class="edit">' +
            '<select data-f="status">' + Object.keys(LABEL).map(function(k){ return '<option value="' + k + '"' + (k===o.status?" selected":"") + '>' + LABEL[k] + '</option>'; }).join("") + '</select>' +
            '<input data-f="tracking" placeholder="Número de guía" value="' + esc(o.tracking) + '">' +
            '<input data-f="note" placeholder="Nota interna" value="' + esc(o.note) + '">' +
            '<button class="btn" data-save="' + esc(o.id) + '"' + (o.payment_intent ? "" : " disabled") + '>Guardar</button>' +
          '</div>' +
        '</div>' +
      '</div>';
    }).join("");
  }

  function load(append){
    var last = append && orders.length ? "?starting_after=" + encodeURIComponent(orders[orders.length-1].id) : "";
    return api("GET", null, last).then(function(d){
      orders = append ? orders.concat(d.orders) : d.orders;
      hasMore = d.has_more;
      $("more").hidden = !hasMore;
      var m = $("mode"); m.textContent = d.livemode ? "MODO REAL" : "MODO PRUEBA"; m.className = "mode " + (d.livemode ? "live" : "test");
      render();
    });
  }

  function start(){
    $("login").hidden = true; $("app").hidden = false;
    clearInterval(start.t); start.t = setInterval(function(){ if (!document.hidden && !document.activeElement.matches("input,select")) load().catch(function(e){ if (e.status === 401) logout("Tu sesión venció. Vuelve a entrar."); }); }, 60000);
  }
  function logout(msg, server){
    if (server) fetch("/api/admin-login", { method: "DELETE", credentials: "same-origin" }).catch(function(){});
    orders = []; $("list").innerHTML = "";
    clearInterval(start.t); $("app").hidden = true; $("login").hidden = false; $("lerr").textContent = msg || ""; $("pw").focus();
  }

  $("lf").addEventListener("submit", function(e){
    e.preventDefault();
    var btn = e.target.querySelector("button"); btn.disabled = true; $("lerr").textContent = "";
    fetch("/api/admin-login", { method: "POST", credentials: "same-origin", headers: {"Content-Type":"application/json"}, body: JSON.stringify({ password: $("pw").value, code: $("code").value }) })
      .then(function(r){ return r.json().then(function(d){ if (!r.ok) throw new Error(d.error || "Error"); }); })
      .then(function(){ $("pw").value = ""; $("code").value = ""; return load().then(start); })
      .catch(function(err){ $("lerr").textContent = err.message; $("code").value = ""; })
      .then(function(){ btn.disabled = false; });
  });
  $("out").onclick = function(){ logout("", true); };
  $("refresh").onclick = function(){ load().then(function(){ toast("Actualizado"); }).catch(function(e){ toast(e.message); }); };
  $("more").onclick = function(){ load(true).catch(function(e){ toast(e.message); }); };
  $("q").oninput = render; $("f").onchange = render;

  $("list").addEventListener("click", function(e){
    var t = e.target.closest("[data-toggle]");
    if (t){ var id = t.getAttribute("data-toggle"); open[id] = !open[id]; render(); return; }
    var s = e.target.closest("[data-save]");
    if (s){
      var id2 = s.getAttribute("data-save"), card = s.closest(".order"), o = orders.filter(function(x){ return x.id === id2; })[0];
      var val = function(f){ return card.querySelector('[data-f="' + f + '"]').value; };
      var body = { payment_intent: o.payment_intent, status: val("status"), tracking: val("tracking"), note: val("note") };
      s.disabled = true;
      api("POST", body).then(function(){ o.status = body.status; o.tracking = body.tracking; o.note = body.note; render(); toast("Pedido guardado"); })
        .catch(function(err){ s.disabled = false; toast(err.message); });
    }
  });

  $("csv").onclick = function(){
    var cols = ["Fecha","Estado","Verificado","Cliente","Email","Teléfono","Envío a","Dirección","Ciudad","Provincia/Estado","Código postal","País","Productos","Total","Moneda","Guía","Tarjeta","ID Stripe"];
    var rows = orders.map(function(o){
      var a = (o.shipping && o.shipping.address) || {};
      return [new Date(o.created*1000).toISOString(), LABEL[o.status], o.verified ? "Sí" : "No", o.customer.name, o.customer.email, o.customer.phone,
        o.shipping ? o.shipping.name : "", [a.line1,a.line2].filter(Boolean).join(" "), a.city, a.state, a.postal_code, a.country,
        o.items.map(function(i){ return i.qty + "x " + i.name; }).join(" | "), o.total, o.currency, o.tracking,
        o.card ? o.card.brand + " " + o.card.last4 : "", o.payment_intent || o.id];
    });
    var csv = [cols].concat(rows).map(function(r){ return r.map(function(v){ return '"' + String(v == null ? "" : v).replace(/"/g,'""') + '"'; }).join(","); }).join("\n");
    var blob = new Blob(["﻿" + csv], {type:"text/csv;charset=utf-8"});
    var a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "vysor-pedidos-" + new Date().toISOString().slice(0,10) + ".csv"; a.click();
  };

  load().then(start).catch(function(){ logout(); });
})();
