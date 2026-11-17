try { localStorage.removeItem("vysor_cart"); } catch (e) {}
if ((navigator.language || "").toLowerCase().startsWith("es")) {
  document.documentElement.lang = "es";
  document.getElementById("h").textContent = "Gracias por tu compra";
  document.getElementById("p").textContent = "Recibimos tu pago. Te llegará el recibo de Stripe por correo y te contactaremos para coordinar la entrega.";
  document.getElementById("a").textContent = "Volver a la tienda";
}
