import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCart } from '../cart/CartContext';
import type { TransactionStatus } from '../lib/checkoutSchema';
import { formatPrice } from '../lib/format';
import { Button } from '../components/ui/Button';
import { Eyebrow } from '../components/ui/Eyebrow';
import { usePageTitle } from '../hooks/usePageTitle';
import styles from './OrderResultPage.module.css';

/*
 * /pedido/resultado?id=…  — Wompi redirige aquí después del pago.
 * Consulta el estado a NUESTRO servidor (/api/transaction). Es informativo:
 * la confirmación definitiva llega por el webhook.
 */
type State =
  | { kind: 'loading' }
  | { kind: 'missing' }
  | { kind: 'error'; message: string }
  | { kind: 'done'; tx: TransactionStatus };

const copy: Record<TransactionStatus['status'], { title: string; text: string }> = {
  APPROVED: { title: '¡Pago aprobado!', text: 'Gracias por tu compra. Te enviaremos la confirmación a tu correo.' },
  PENDING: { title: 'Pago en proceso', text: 'Tu banco aún está procesando el pago. Puede tardar unos minutos.' },
  DECLINED: { title: 'Pago rechazado', text: 'Tu banco no aprobó el pago. Tu cesta sigue guardada: puedes intentarlo de nuevo.' },
  VOIDED: { title: 'Pago anulado', text: 'La transacción fue anulada. Tu cesta sigue guardada.' },
  ERROR: { title: 'Hubo un error', text: 'No se pudo completar el pago. Tu cesta sigue guardada.' },
};

export function OrderResultPage() {
  const [params] = useSearchParams();
  const id = params.get('id');
  const { clear } = useCart();
  usePageTitle('Estado de tu pedido');
  const [state, setState] = useState<State>(id ? { kind: 'loading' } : { kind: 'missing' });

  const load = useCallback(async () => {
    if (!id) return;
    setState({ kind: 'loading' });
    try {
      const res = await fetch(`/api/transaction?id=${encodeURIComponent(id)}`);
      const body = (await res.json()) as TransactionStatus | { error: string };
      if (!res.ok || 'error' in body) {
        setState({ kind: 'error', message: 'error' in body ? body.error : 'No pudimos consultar el pago.' });
        return;
      }
      setState({ kind: 'done', tx: body });
    } catch {
      setState({ kind: 'error', message: 'Sin conexión con el servidor.' });
    }
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  // Solo se vacía la cesta cuando el pago está aprobado.
  const approved = state.kind === 'done' && state.tx.status === 'APPROVED';
  useEffect(() => {
    if (approved) clear();
  }, [approved, clear]);

  return (
    <section className={`container ${styles.page}`} aria-live="polite" aria-busy={state.kind === 'loading'}>
      <Eyebrow>Tu pedido</Eyebrow>

      {state.kind === 'loading' && <h1 className={styles.title}>Consultando tu pago…</h1>}

      {state.kind === 'missing' && (
        <>
          <h1 className={styles.title}>No encontramos ningún pago</h1>
          <Button to="/" withArrow>
            Volver al inicio
          </Button>
        </>
      )}

      {state.kind === 'error' && (
        <>
          <h1 className={styles.title}>No pudimos consultar el estado</h1>
          <p className={styles.text}>{state.message}</p>
          <Button onClick={() => void load()} withArrow>
            Reintentar
          </Button>
        </>
      )}

      {state.kind === 'done' && (
        <>
          <h1 className={styles.title} data-status={state.tx.status}>
            {copy[state.tx.status].title}
          </h1>
          <p className={styles.text}>{copy[state.tx.status].text}</p>
          <dl className={styles.details}>
            <div>
              <dt>Referencia</dt>
              <dd>{state.tx.reference || '—'}</dd>
            </div>
            <div>
              <dt>Importe</dt>
              <dd>{formatPrice(state.tx.amountInCents / 100)}</dd>
            </div>
            <div>
              <dt>Transacción</dt>
              <dd>{id}</dd>
            </div>
          </dl>
          <div className={styles.actions}>
            {state.tx.status === 'PENDING' && (
              <Button onClick={() => void load()} withArrow>
                Actualizar estado
              </Button>
            )}
            {['DECLINED', 'VOIDED', 'ERROR'].includes(state.tx.status) && (
              <Button to="/checkout" withArrow>
                Intentar de nuevo
              </Button>
            )}
            <Button to="/" variant="secondary">
              Seguir comprando
            </Button>
          </div>
        </>
      )}
    </section>
  );
}
