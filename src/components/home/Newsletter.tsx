import { useState, type FormEvent } from 'react';
import { Button } from '../ui/Button';
import { Eyebrow } from '../ui/Eyebrow';
import styles from './Newsletter.module.css';

/*
 * Sección 11 — Newsletter.
 * Valida el correo y pide la autorización de tratamiento de datos (Ley 1581 de 2012, Colombia).
 * ⚠️ AÚN NO ENVÍA a ningún proveedor: lo indica claramente en vez de fingir que funcionó.
 */
type Status = 'idle' | 'error' | 'pending-provider';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function Newsletter() {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const email = String(data.get('email') ?? '').trim();

    if (!EMAIL_RE.test(email)) {
      setError('Escribe un correo válido, por ejemplo nombre@correo.com');
      setStatus('error');
      return;
    }
    if (!data.get('consent')) {
      setError('Necesitamos tu autorización para el tratamiento de datos.');
      setStatus('error');
      return;
    }
    setError('');
    setStatus('pending-provider');
  };

  return (
    <section className={`section ${styles.section}`}>
      <div className={`container ${styles.inner}`}>
        <Eyebrow>Únete a LUMINA</Eyebrow>
        <h2 className={styles.title}>Más visión para tu mundo.</h2>
        <p className={styles.text}>Novedades, lanzamientos y consejos para cuidar tu forma de ver.</p>

        <form className={styles.form} onSubmit={onSubmit} noValidate>
          <label htmlFor="newsletter-email" className="visually-hidden">
            Correo electrónico
          </label>
          <div className={styles.row}>
            <input
              id="newsletter-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="Tu correo electrónico"
              className={styles.input}
              aria-invalid={status === 'error'}
              aria-describedby="newsletter-msg"
            />
            <Button type="submit" withArrow>
              Suscribirme
            </Button>
          </div>
          <label className={styles.consent}>
            <input type="checkbox" name="consent" />
            <span>Autorizo el tratamiento de mis datos personales según la política de privacidad.</span>
          </label>
          <p id="newsletter-msg" className={styles.message} role="status" data-status={status}>
            {status === 'error' && error}
            {status === 'pending-provider' &&
              'Formulario válido. Demo: aún no está conectado a un proveedor de correo, tu suscripción no se ha guardado.'}
          </p>
        </form>
      </div>
    </section>
  );
}
