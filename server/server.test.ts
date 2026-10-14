import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { PricingError, priceOrder } from './pricing';
import { buildCheckoutUrl, getConfig, integritySignature, verifyEventChecksum, type WompiEvent } from './wompi';
import { POST as checkout } from '../api/checkout';

const env = {
  WOMPI_PUBLIC_KEY: 'pub_test_demo',
  WOMPI_PRIVATE_KEY: 'prv_test_demo',
  WOMPI_INTEGRITY_SECRET: 'test_integrity_demo',
  WOMPI_EVENTS_SECRET: 'test_events_demo',
  APP_URL: 'http://localhost:5173/',
};
const sha = (s: string) => createHash('sha256').update(s).digest('hex');

const customer = {
  email: 'ana@example.com',
  fullName: 'Ana Pérez',
  legalIdType: 'CC' as const,
  legalId: '1020304050',
  phone: '3001234567',
  region: 'Antioquia' as const,
  city: 'Medellín',
  address: 'Calle 10 # 43-20',
  acceptTerms: true as const,
  acceptData: true as const,
};

describe('priceOrder', () => {
  it('usa el precio del servidor y convierte a centavos', () => {
    const o = priceOrder([{ productId: 'p-aura', colorId: 'borgona', size: 'media', quantity: 2 }]);
    expect(o.total).toBe(840000);
    expect(o.amountInCents).toBe(84000000);
  });

  it('rechaza productos inexistentes', () => {
    expect(() => priceOrder([{ productId: 'p-falso', colorId: 'x', size: 'media', quantity: 1 }])).toThrow(PricingError);
  });
});

describe('Wompi', () => {
  it('firma de integridad = SHA256(referencia + monto + moneda + secreto)', () => {
    expect(integritySignature('LUM-1', 42000000, 'COP', 'secreto')).toBe(sha('LUM-142000000COPsecreto'));
  });

  it('la URL de pago lleva monto, referencia y firma', () => {
    const cfg = getConfig(env);
    const url = new URL(buildCheckoutUrl(cfg, { reference: 'LUM-1', amountInCents: 42000000 }, customer));
    expect(url.origin + url.pathname).toBe('https://checkout.wompi.co/p/');
    expect(url.searchParams.get('amount-in-cents')).toBe('42000000');
    expect(url.searchParams.get('signature:integrity')).toBe(sha('LUM-142000000COPtest_integrity_demo'));
    expect(url.searchParams.get('redirect-url')).toBe('http://localhost:5173/pedido/resultado');
    expect(url.toString()).not.toContain('prv_test'); // nunca exponer la llave privada
  });

  it('verifica el checksum del webhook y detecta manipulación', () => {
    const data = { transaction: { id: '1234-1610641025-49201', status: 'APPROVED', amount_in_cents: 4490000 } };
    const props = ['transaction.id', 'transaction.status', 'transaction.amount_in_cents'];
    const timestamp = 1530291411;
    const checksum = sha(`1234-1610641025-49201APPROVED4490000${timestamp}test_events_demo`);
    const evt: WompiEvent = {
      event: 'transaction.updated',
      data,
      environment: 'test',
      signature: { properties: props, checksum },
      timestamp,
      sent_at: '',
    };
    expect(verifyEventChecksum(evt, 'test_events_demo')).toBe(true);

    const tampered = { ...evt, data: { transaction: { ...data.transaction, amount_in_cents: 100 } } };
    expect(verifyEventChecksum(tampered, 'test_events_demo')).toBe(false);
  });

  it('falla de forma clara si faltan variables de entorno', () => {
    expect(() => getConfig({})).toThrow(/WOMPI_PUBLIC_KEY/);
  });
});

describe('POST /api/checkout', () => {
  it('rechaza datos inválidos con 422', async () => {
    const res = await checkout(new Request('http://x/api/checkout', { method: 'POST', body: JSON.stringify({ lines: [] }) }));
    expect(res.status).toBe(422);
  });

  it('ignora un precio enviado por el navegador', async () => {
    Object.assign(process.env, env);
    const res = await checkout(
      new Request('http://x/api/checkout', {
        method: 'POST',
        body: JSON.stringify({
          customer,
          lines: [{ productId: 'p-aura', colorId: 'borgona', size: 'media', quantity: 1, price: 1 }],
        }),
      }),
    );
    const body = (await res.json()) as { checkoutUrl: string };
    expect(new URL(body.checkoutUrl).searchParams.get('amount-in-cents')).toBe('42000000');
  });
});
