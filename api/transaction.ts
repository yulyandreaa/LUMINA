import { ConfigError, fetchTransaction, getConfig } from '../server/wompi';
import { json } from '../server/http';

/*
 * GET /api/transaction?id=…
 * La usa la página de resultado tras volver de Wompi para mostrar el estado.
 * Es INFORMATIVA: la confirmación real del pago es el webhook.
 */
export async function GET(request: Request): Promise<Response> {
  const id = new URL(request.url).searchParams.get('id') ?? '';
  if (!/^[\w-]{4,64}$/.test(id)) return json({ error: 'Identificador no válido.' }, 400);

  try {
    return json(await fetchTransaction(getConfig(), id));
  } catch (err) {
    if (err instanceof ConfigError) return json({ error: 'Los pagos aún no están configurados.' }, 503);
    console.error('[transaction]', err);
    return json({ error: 'No pudimos consultar el estado del pago.' }, 502);
  }
}
