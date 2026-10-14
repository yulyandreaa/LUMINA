import { checkoutRequestSchema } from '../src/lib/checkoutSchema';
import { PricingError, priceOrder } from '../server/pricing';
import { ConfigError, buildCheckoutUrl, getConfig, newReference } from '../server/wompi';
import { json } from '../server/http';

/*
 * POST /api/checkout
 * 1. Valida los datos con el mismo esquema que el formulario.
 * 2. Calcula el importe con el catálogo del servidor.
 * 3. Genera referencia + firma de integridad y devuelve la URL de pago de Wompi.
 *
 * TODO (con base de datos): guardar el pedido como PENDIENTE con su referencia e importe,
 * para comprobarlo después cuando llegue el webhook.
 */
export async function POST(request: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Solicitud no válida.' }, 400);
  }

  const parsed = checkoutRequestSchema.safeParse(body);
  if (!parsed.success) {
    return json({ error: 'Revisa los datos del formulario.' }, 422);
  }

  try {
    const cfg = getConfig();
    const order = priceOrder(parsed.data.lines);
    const reference = newReference();
    const checkoutUrl = buildCheckoutUrl(cfg, { reference, amountInCents: order.amountInCents }, parsed.data.customer);
    return json({ checkoutUrl, reference });
  } catch (err) {
    if (err instanceof PricingError) return json({ error: err.message }, 409);
    if (err instanceof ConfigError) {
      console.error('[checkout]', err.message);
      return json({ error: 'Los pagos aún no están configurados en este entorno.' }, 503);
    }
    console.error('[checkout]', err);
    return json({ error: 'No pudimos iniciar el pago. Inténtalo de nuevo.' }, 500);
  }
}
