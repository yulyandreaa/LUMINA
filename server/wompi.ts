import { createHash, randomUUID } from 'node:crypto';
import type { CustomerInput, TransactionStatus } from '../src/lib/checkoutSchema';

/*
 * Integración con Wompi (Colombia). SOLO se ejecuta en el servidor.
 * Documentación: https://docs.wompi.co/docs/colombia/widget-checkout-web/
 *                https://docs.wompi.co/docs/colombia/eventos/
 *
 * Variables de entorno (ver .env.example):
 *   WOMPI_PUBLIC_KEY        pub_test_…        (pública, pero la leemos aquí para no duplicarla)
 *   WOMPI_PRIVATE_KEY       prv_test_…        SECRETA
 *   WOMPI_INTEGRITY_SECRET  test_integrity_…  SECRETA
 *   WOMPI_EVENTS_SECRET     test_events_…     SECRETA
 *   APP_URL                 http://localhost:5173
 */

const CHECKOUT_URL = 'https://checkout.wompi.co/p/';

export interface WompiConfig {
  publicKey: string;
  privateKey: string;
  integritySecret: string;
  eventsSecret: string;
  appUrl: string;
  apiBase: string;
}

export class ConfigError extends Error {}

export function getConfig(env: Record<string, string | undefined> = process.env): WompiConfig {
  const publicKey = env.WOMPI_PUBLIC_KEY ?? '';
  const missing = ['WOMPI_PUBLIC_KEY', 'WOMPI_PRIVATE_KEY', 'WOMPI_INTEGRITY_SECRET', 'WOMPI_EVENTS_SECRET', 'APP_URL'].filter(
    (k) => !env[k],
  );
  if (missing.length) throw new ConfigError(`Faltan variables de entorno: ${missing.join(', ')}`);
  return {
    publicKey,
    privateKey: env.WOMPI_PRIVATE_KEY!,
    integritySecret: env.WOMPI_INTEGRITY_SECRET!,
    eventsSecret: env.WOMPI_EVENTS_SECRET!,
    appUrl: env.APP_URL!.replace(/\/$/, ''),
    // Las llaves de prueba usan sandbox; las de producción, production.
    apiBase: publicKey.startsWith('pub_prod_') ? 'https://production.wompi.co/v1' : 'https://sandbox.wompi.co/v1',
  };
}

const sha256 = (s: string) => createHash('sha256').update(s, 'utf8').digest('hex');

/** Referencia única del pedido, p. ej. "LUM-m1x2y3-4f9a1c2b". */
export const newReference = () => `LUM-${Date.now().toString(36)}-${randomUUID().slice(0, 8)}`;

/** Firma de integridad: SHA256("<referencia><monto><moneda><secreto>"). */
export const integritySignature = (reference: string, amountInCents: number, currency: string, secret: string) =>
  sha256(`${reference}${amountInCents}${currency}${secret}`);

/** URL del Web Checkout de Wompi con todos los parámetros firmados. */
export function buildCheckoutUrl(
  cfg: WompiConfig,
  order: { reference: string; amountInCents: number },
  customer: CustomerInput,
): string {
  const currency = 'COP';
  const params = new URLSearchParams({
    'public-key': cfg.publicKey,
    currency,
    'amount-in-cents': String(order.amountInCents),
    reference: order.reference,
    'signature:integrity': integritySignature(order.reference, order.amountInCents, currency, cfg.integritySecret),
    'redirect-url': `${cfg.appUrl}/pedido/resultado`,
    'customer-data:email': customer.email,
    'customer-data:full-name': customer.fullName,
    'customer-data:phone-number': customer.phone,
    'customer-data:phone-number-prefix': '+57',
    'customer-data:legal-id': customer.legalId,
    'customer-data:legal-id-type': customer.legalIdType,
    'shipping-address:address-line-1': customer.address,
    'shipping-address:country': 'CO',
    'shipping-address:region': customer.region,
    'shipping-address:city': customer.city,
    'shipping-address:phone-number': customer.phone,
  });
  if (customer.address2) params.set('shipping-address:address-line-2', customer.address2);
  return `${CHECKOUT_URL}?${params.toString()}`;
}

/* — Eventos (webhook) — */

export interface WompiEvent {
  event: string;
  data: Record<string, unknown>;
  environment: 'test' | 'prod';
  signature: { properties: string[]; checksum: string };
  timestamp: number;
  sent_at: string;
}

/** Lee "transaction.id" dentro de data → data.transaction.id */
const readPath = (obj: unknown, path: string): unknown =>
  path.split('.').reduce<unknown>((acc, key) => (acc && typeof acc === 'object' ? (acc as Record<string, unknown>)[key] : undefined), obj);

/**
 * Verifica que el evento lo envió Wompi:
 * SHA256( valores de signature.properties en orden + timestamp + secreto de eventos ) === checksum
 * Las propiedades se leen del propio evento: la doc avisa que pueden cambiar.
 */
export function verifyEventChecksum(evt: WompiEvent, eventsSecret: string): boolean {
  if (!evt?.signature?.properties || !evt.signature.checksum) return false;
  const values = evt.signature.properties.map((p) => String(readPath(evt.data, p) ?? '')).join('');
  const expected = sha256(`${values}${evt.timestamp}${eventsSecret}`);
  return expected.toUpperCase() === String(evt.signature.checksum).toUpperCase();
}

/* — Consulta de transacción (para la página de resultado) — */

/**
 * ⚠️ Pendiente de verificar en sandbox: la doc indica que la consulta ya no se hace
 * desde el frontend; aquí se hace desde el servidor con la llave privada.
 */
export async function fetchTransaction(cfg: WompiConfig, id: string): Promise<TransactionStatus> {
  const res = await fetch(`${cfg.apiBase}/transactions/${encodeURIComponent(id)}`, {
    headers: { Authorization: `Bearer ${cfg.privateKey}` },
  });
  if (!res.ok) throw new Error(`Wompi respondió ${res.status}`);
  const body = (await res.json()) as { data?: { status?: string; reference?: string; amount_in_cents?: number } };
  const known = ['APPROVED', 'DECLINED', 'VOIDED', 'ERROR', 'PENDING'];
  return {
    status: (known.includes(body.data?.status ?? '') ? body.data!.status : 'PENDING') as TransactionStatus['status'],
    reference: body.data?.reference ?? '',
    amountInCents: body.data?.amount_in_cents ?? 0,
  };
}
