import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import styles from './CookieBanner.module.css';

/*
 * Aviso de cookies (como el de la referencia: Rechazar / Aceptar).
 * Hoy la tienda solo usa almacenamiento ESENCIAL (la cesta), así que la elección
 * se guarda para el día en que se añada analítica (leer CONSENT_KEY antes de cargarla).
 */
export const CONSENT_KEY = 'lumina.consent.v1';
type Consent = 'accepted' | 'rejected';

function readConsent(): Consent | null {
  try {
    const v = window.localStorage.getItem(CONSENT_KEY);
    return v === 'accepted' || v === 'rejected' ? v : null;
  } catch {
    return null;
  }
}

export function CookieBanner() {
  const [consent, setConsent] = useState<Consent | null>(readConsent);

  if (consent) return null;

  const choose = (value: Consent) => {
    try {
      window.localStorage.setItem(CONSENT_KEY, value);
    } catch {
      /* sin almacenamiento: el aviso volverá a salir en la próxima visita */
    }
    setConsent(value);
  };

  return (
    <section className={styles.banner} aria-label="Aviso de cookies">
      <p className={styles.text}>
        Usamos almacenamiento esencial para guardar tu cesta. Si en el futuro añadimos cookies de analítica, solo se activarán
        con tu permiso. <Link to="/privacidad">Más información</Link>
      </p>
      <div className={styles.actions}>
        <Button variant="secondary" onClick={() => choose('rejected')}>
          Rechazar opcionales
        </Button>
        <Button onClick={() => choose('accepted')}>Aceptar</Button>
      </div>
    </section>
  );
}
