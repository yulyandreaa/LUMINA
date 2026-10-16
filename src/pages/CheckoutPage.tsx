import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../cart/CartContext';
import { useAuth } from '../auth/AuthContext';
import { useAccountData } from '../auth/useAccountData';
import { customerSchema, departments, legalIdTypes, type CheckoutResponse, type CustomerInput } from '../lib/checkoutSchema';
import { PAYMENT_MODE, paymentMethods, placeSimulatedOrder } from '../lib/simulatedPayment';
import type { PaymentMethod } from '../data/adminOrders';
import { Dialog } from '../components/ui/Dialog';
import { formatPrice } from '../lib/format';
import { sizeGuide } from '../data/sizes';
import { ProductThumb } from '../components/product/ProductThumb';
import { Field } from '../components/ui/Field';
import { controlClass } from '../components/ui/fieldStyles';
import { Button } from '../components/ui/Button';
import { Eyebrow } from '../components/ui/Eyebrow';
import { usePageTitle } from '../hooks/usePageTitle';
import styles from './CheckoutPage.module.css';

/*
 * Checkout:
 * 1. Valida el formulario en el navegador (mismo esquema que el servidor).
 * 2. Envía cesta + datos a /api/checkout (solo ids y cantidades, nunca precios).
 * 3. El servidor devuelve la URL de pago de Wompi y redirigimos allí.
 * La cesta NO se vacía aquí: solo cuando el pago se confirma.
 * Mientras Wompi no esté configurado (PAYMENT_MODE = 'simulado'), el paso 2-3 es una ventana
 * de "Pago de prueba": se elige el medio y se aprueba o rechaza, sin cobro real.
 * Con sesión iniciada, el formulario llega prellenado con los datos de la cuenta.
 */
type Errors = Partial<Record<string, string>>;
type Status = { kind: 'idle' } | { kind: 'submitting' } | { kind: 'error'; message: string };

export function CheckoutPage() {
  const { lines, subtotal, count, clear } = useCart();
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>({ kind: 'idle' });
  // Datos validados esperando la decisión en la ventana de pago de prueba.
  const [pending, setPending] = useState<CustomerInput | null>(null);
  const navigate = useNavigate();
  const { customer } = useAuth();
  const { data: account } = useAccountData();
  const profile = account.profile;
  const address = account.addresses.find((a) => a.isDefault) ?? account.addresses[0];
  usePageTitle('Finalizar compra');

  if (lines.length === 0) {
    return (
      <section className={`container ${styles.emptyPage}`}>
        <Eyebrow>Checkout</Eyebrow>
        <h1 className={styles.title}>Tu cesta está vacía</h1>
        <Button to="/monturas" withArrow>
          Ver monturas
        </Button>
      </section>
    );
  }

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    const parsed = customerSchema.safeParse({
      ...data,
      acceptTerms: data.acceptTerms === 'on',
      acceptData: data.acceptData === 'on',
      address2: data.address2 || undefined,
    });

    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      setErrors(Object.fromEntries(Object.entries(fieldErrors).map(([k, v]) => [k, v?.[0]])));
      // Lleva el foco al primer campo con error.
      const first = Object.keys(fieldErrors)[0];
      form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    setErrors({});
    if (PAYMENT_MODE === 'simulado') {
      setStatus({ kind: 'idle' });
      setPending(parsed.data);
      return;
    }
    setStatus({ kind: 'submitting' });
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: parsed.data,
          lines: lines.map(({ productId, colorId, size, quantity }) => ({ productId, colorId, size, quantity })),
        }),
      });
      const body = (await res.json()) as CheckoutResponse;
      if (!res.ok || 'error' in body) {
        setStatus({ kind: 'error', message: 'error' in body ? body.error : 'No pudimos iniciar el pago.' });
        return;
      }
      window.location.assign(body.checkoutUrl); // → pasarela de Wompi
    } catch {
      setStatus({ kind: 'error', message: 'Sin conexión con el servidor. Revisa tu internet e inténtalo de nuevo.' });
    }
  };

  const submitting = status.kind === 'submitting';

  const approve = (method: PaymentMethod) => {
    if (!pending) return;
    const order = placeSimulatedOrder(pending, lines, method);
    clear();
    navigate(`/pedido/resultado?simulado=${order.id}`, { replace: true });
  };

  const decline = () => {
    setPending(null);
    setStatus({
      kind: 'error',
      message: 'El pago fue rechazado (prueba). No se hizo ningún cobro y tu cesta sigue guardada: puedes intentarlo de nuevo.',
    });
  };

  return (
    <section className={`container ${styles.page}`}>
      <header className={styles.head}>
        <nav aria-label="Migas de pan" className={styles.breadcrumb}>
          <Link to="/cesta">Cesta</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">Datos y pago</span>
        </nav>
        <h1 className={styles.title}>Finalizar compra</h1>
      </header>

      <div className={styles.grid}>
        <form className={styles.form} onSubmit={onSubmit} noValidate aria-busy={submitting}>
          <fieldset className={styles.fieldset} disabled={submitting}>
            <legend className={styles.legend}>Contacto</legend>
            <Field id="email" label="Correo electrónico" error={errors.email} hint="Te enviaremos la confirmación del pedido.">
              {(a) => <input {...a} name="email" type="email" autoComplete="email" defaultValue={customer?.email} className={controlClass} />}
            </Field>
            <Field id="fullName" label="Nombre completo" error={errors.fullName}>
              {(a) => <input
                  {...a}
                  name="fullName"
                  autoComplete="name"
                  defaultValue={[profile.firstName, profile.lastName].filter(Boolean).join(' ') || undefined}
                  className={controlClass}
                />}
            </Field>
            <div className={styles.row}>
              <Field id="legalIdType" label="Tipo de documento" error={errors.legalIdType}>
                {(a) => (
                  <select {...a} name="legalIdType" defaultValue={profile.legalIdType ?? 'CC'} className={controlClass}>
                    {legalIdTypes.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                )}
              </Field>
              <Field id="legalId" label="Número de documento" error={errors.legalId}>
                {(a) => <input {...a} name="legalId" inputMode="numeric" defaultValue={profile.legalId} className={controlClass} />}
              </Field>
            </div>
            <Field id="phone" label="Teléfono celular" error={errors.phone}>
              {(a) => <input {...a} name="phone" type="tel" autoComplete="tel-national" placeholder="300 123 4567" defaultValue={profile.phone} className={controlClass} />}
            </Field>
          </fieldset>

          <fieldset className={styles.fieldset} disabled={submitting}>
            <legend className={styles.legend}>Envío · Colombia</legend>
            <div className={styles.row}>
              <Field id="region" label="Departamento" error={errors.region}>
                {(a) => (
                  <select {...a} name="region" defaultValue={address?.region ?? ''} autoComplete="address-level1" className={controlClass}>
                    <option value="" disabled>
                      Elige…
                    </option>
                    {departments.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                )}
              </Field>
              <Field id="city" label="Ciudad o municipio" error={errors.city}>
                {(a) => <input {...a} name="city" autoComplete="address-level2" defaultValue={address?.city} className={controlClass} />}
              </Field>
            </div>
            <Field id="address" label="Dirección" error={errors.address}>
              {(a) => <input {...a} name="address" autoComplete="address-line1" placeholder="Calle 10 # 43-20" defaultValue={address?.address} className={controlClass} />}
            </Field>
            <Field id="address2" label="Apartamento, torre, barrio" optional error={errors.address2}>
              {(a) => <input {...a} name="address2" autoComplete="address-line2" defaultValue={address?.address2} className={controlClass} />}
            </Field>
          </fieldset>

          <fieldset className={styles.fieldset} disabled={submitting}>
            <legend className="visually-hidden">Condiciones</legend>
            <label className={styles.check}>
              <input type="checkbox" name="acceptTerms" aria-invalid={!!errors.acceptTerms} />
              <span>
                Acepto los <Link to="/terminos">términos y condiciones</Link> y la{' '}
                <Link to="/envios-y-devoluciones">política de envíos y devoluciones</Link>.
              </span>
            </label>
            {errors.acceptTerms && <p className={styles.checkError}>{errors.acceptTerms}</p>}
            <label className={styles.check}>
              <input type="checkbox" name="acceptData" aria-invalid={!!errors.acceptData} />
              <span>
                Autorizo el <Link to="/tratamiento-de-datos">tratamiento de mis datos personales</Link> (Ley 1581 de 2012).
              </span>
            </label>
            {errors.acceptData && <p className={styles.checkError}>{errors.acceptData}</p>}
          </fieldset>

          {status.kind === 'error' && (
            <p className={styles.serverError} role="alert">
              {status.message}
            </p>
          )}

          <Button type="submit" withArrow className={styles.submit} disabled={submitting}>
            {submitting ? 'Conectando con la pasarela…' : `Pagar ${formatPrice(subtotal)}`}
          </Button>
          <p className={styles.secure}>
            {PAYMENT_MODE === 'simulado' ? (
              <>
                <strong>Pago de prueba:</strong> no se hace ningún cobro. Eliges el medio de pago y si se aprueba o se
                rechaza.
              </>
            ) : (
              <>
                Serás redirigido a <strong>Wompi</strong> para pagar con tarjeta, PSE, Nequi o Bancolombia. LUMINA no ve
                ni guarda los datos de tu tarjeta.
              </>
            )}
          </p>
        </form>

        <aside className={styles.summary} aria-label="Resumen del pedido">
          <p className={styles.summaryTitle}>
            Tu pedido · {count} {count === 1 ? 'producto' : 'productos'}
          </p>
          <ul className={styles.items}>
            {lines.map((l) => (
              <li key={l.key} className={styles.item}>
                <span className={styles.thumb}>
                  <ProductThumb product={l.product} color={l.color} />
                  <span className={styles.qty}>{l.quantity}</span>
                </span>
                <span className={styles.itemInfo}>
                  <strong>{l.product.name}</strong>
                  <span>
                    {l.color.name} · {sizeGuide[l.size].label}
                  </span>
                </span>
                <span>{formatPrice(l.lineTotal)}</span>
              </li>
            ))}
          </ul>
          <dl className={styles.totals}>
            <div>
              <dt>Subtotal</dt>
              <dd>{formatPrice(subtotal)}</dd>
            </div>
            <div>
              <dt>Envío</dt>
              <dd>Gratis</dd>
            </div>
            <div className={styles.total}>
              <dt>Total</dt>
              <dd>{formatPrice(subtotal)} COP</dd>
            </div>
          </dl>
          <p className={styles.note}>
            {PAYMENT_MODE === 'simulado' ? 'Pago de prueba (simulación).' : 'Entorno de pruebas (sandbox).'}
          </p>
        </aside>
      </div>

      <Dialog open={!!pending} onClose={() => setPending(null)} title="Pago de prueba">
        {pending && <TestPayment total={subtotal} onApprove={approve} onDecline={decline} />}
      </Dialog>
    </section>
  );
}

/* Ventana del pago simulado: medio de pago + aprobar o rechazar. */
function TestPayment({
  total,
  onApprove,
  onDecline,
}: {
  total: number;
  onApprove: (method: PaymentMethod) => void;
  onDecline: () => void;
}) {
  const [method, setMethod] = useState<PaymentMethod>('Tarjeta');
  return (
    <div className={styles.testPay}>
      <p>
        Total: <strong>{formatPrice(total)} COP</strong>
      </p>
      <fieldset className={styles.testMethods}>
        <legend className={styles.legend}>Medio de pago</legend>
        {paymentMethods.map((m) => (
          <label key={m} className={styles.testMethod}>
            <input type="radio" name="testMethod" checked={method === m} onChange={() => setMethod(m)} />
            {m}
          </label>
        ))}
      </fieldset>
      <p className={styles.secure}>Simulación: no se pide ningún dato de tarjeta ni se hace ningún cobro.</p>
      <div className={styles.testActions}>
        <Button onClick={() => onApprove(method)} withArrow>
          Aprobar pago
        </Button>
        <button type="button" className={styles.testDecline} onClick={onDecline}>
          Rechazar pago
        </button>
      </div>
    </div>
  );
}
