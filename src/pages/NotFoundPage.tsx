import { usePageTitle } from '../hooks/usePageTitle';
import { Button } from '../components/ui/Button';
import { Eyebrow } from '../components/ui/Eyebrow';
import styles from './PlaceholderPage.module.css';

/* 404: ruta inexistente. */
export function NotFoundPage() {
  usePageTitle('Página no encontrada');
  return (
    <section className={`container ${styles.page}`}>
      <Eyebrow>Error 404</Eyebrow>
      <h1 className={styles.title}>Esta página no está a la vista.</h1>
      <p>Puede que el enlace haya cambiado. Te ayudamos a encontrar tu montura.</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
        <Button to="/monturas" withArrow>
          Ver monturas
        </Button>
        <Button to="/" variant="secondary">
          Ir al inicio
        </Button>
      </div>
    </section>
  );
}
