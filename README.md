# VYSOR — tienda de gafas

Sitio estático (Preact sin build) + función serverless de Vercel para cobrar con Stripe Checkout.

## Activar pagos
1. En Vercel → Project → Settings → Environment Variables, agrega `STRIPE_SECRET_KEY` (clave secreta de Stripe; primero la de prueba `sk_test_...`).
2. Opcional: `SITE_URL` (dominio final) y `SHIPPING_COUNTRIES` (por defecto `US,EC`).
3. Pon los precios de venta en `catalog.json` (campo `price` en USD). Sin precio, el producto no se puede pagar y aparece como "Precio a consultar".

## Estructura
- `index.html`, `app.js`, `styles.css`: la tienda (EN/ES, baraja animada, pestañas por línea, fichas técnicas, carrito).
- `api/checkout.js`: crea la sesión de pago con los precios del servidor (el cliente no puede cambiarlos).
- `gracias.html`: página de pago confirmado.
- `img/`: fotos de producto.
