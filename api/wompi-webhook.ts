import { ConfigError, getConfig, verifyEventChecksum, type WompiEvent } from '../server/wompi';
import { json } from '../server/http';

/*
 * POST /api/wompi-webhook  ← URL que se configura en el panel de Wompi ("URL de eventos").
 * Es la ÚNICA confirmación fiable de un pago. Wompi reintenta si no respondemos 200.
 *
 * TODO (con base de datos):
 *  - buscar el pedido por data.transaction.reference
 *  - comprobar que amount_in_cents coincide con el importe guardado
 *  - actualizar su estado de forma idempotente (el mismo evento puede llegar varias veces)
 *  - enviar el correo de confirmación
 */
export async function POST(request: Request): Promise<Response> {
  let evt: WompiEvent;
  try {
    evt = (await request.json()) as WompiEvent;
  } catch {
    return json({ error: 'JSON no válido' }, 400);
  }

  let secret: string;
  try {
    secret = getConfig().eventsSecret;
  } catch (err) {
    if (err instanceof ConfigError) return json({ error: 'No configurado' }, 503);
    throw err;
  }

  if (!verifyEventChecksum(evt, secret)) {
    console.warn('[webhook] Firma inválida: evento ignorado');
    return json({ error: 'Firma inválida' }, 401);
  }

  if (evt.event === 'transaction.updated') {
    const tx = evt.data.transaction as { id?: string; reference?: string; status?: string; amount_in_cents?: number };
    // Sin base de datos todavía: dejamos constancia en los logs del servidor.
    console.info('[webhook] Transacción', {
      environment: evt.environment,
      id: tx?.id,
      reference: tx?.reference,
      status: tx?.status,
      amountInCents: tx?.amount_in_cents,
    });
  }

  return json({ ok: true });
}
