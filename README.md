# LUMINA · Tienda online

React + TypeScript + Vite. Pagos con Wompi (Colombia, COP). Funciones de servidor en `/api` (formato Vercel).

## Comandos

```bash
npm install
npm run dev     # http://localhost:5173 (incluye /api en local)
npm test        # tests unitarios (catálogo, cesta, servidor)
npm run build   # comprobación de tipos + build de producción
```

## Estructura

| Carpeta | Contenido |
|---|---|
| `src/styles` | Tokens de diseño y estilos base |
| `src/components` | `ui/` piezas reutilizables · `layout/` cabecera, menú, footer · `home/` secciones del inicio · `catalog/` · `product/` · `cart/` |
| `src/pages` | Una página por ruta |
| `src/lib` | Lógica pura y testeable: catálogo, cesta, esquema del checkout |
| `src/data` | ⚠️ Catálogo, tallas y contenido **ficticios** |
| `src/cart` | Estado global de la cesta (Context + useReducer + localStorage) |
| `api/` | Funciones de servidor: `checkout`, `wompi-webhook`, `transaction` |
| `server/` | Lógica de servidor: precios y Wompi (firma, checksum) |

## Configurar pagos de prueba (Wompi sandbox)

1. Crea una cuenta en el panel de comercios de Wompi y entra en modo **pruebas (sandbox)**.
2. Copia `.env.example` como `.env.local` y pega las cuatro llaves de prueba.
3. Reinicia `npm run dev` y haz una compra con los datos de prueba de la documentación de Wompi.

**Webhook:** Wompi no puede llamar a `localhost`. Para recibir eventos hay que desplegar
(p. ej. en Vercel, con las mismas variables de entorno) y registrar en el panel de Wompi la URL
`https://TU-DOMINIO/api/wompi-webhook`.

## Seguridad

- Las llaves privadas solo existen en el servidor (sin prefijo `VITE_`).
- La cesta guarda ids y cantidades; el **servidor recalcula el importe** con su catálogo.
- La redirección de Wompi es informativa; la confirmación real es el **webhook** con checksum verificado.

## Pendiente antes de vender de verdad

- Costo de envío (`server/pricing.ts → SHIPPING_COP`) e IVA.
- Base de datos de pedidos (guardar pedido pendiente, conciliar con el webhook de forma idempotente, correo de confirmación).
- Inventario real, catálogo real, fotos y medidas reales.
- Textos legales: términos, envíos y devoluciones, tratamiento de datos.
