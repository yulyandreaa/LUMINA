import { Eyebrow } from '../components/ui/Eyebrow';
import { Button } from '../components/ui/Button';
import styles from './PlaceholderPage.module.css';

/* Página temporal para rutas que se construyen en etapas posteriores. */
export function PlaceholderPage({ title, stage }: { title: string; stage?: number }) {
  return (
    <section className={`container ${styles.page}`}>
      <Eyebrow>{stage ? `Etapa ${stage}` : 'En preparación'}</Eyebrow>
      <h1 className={styles.title}>{title}</h1>
      <Button to="/" variant="secondary" withArrow>
        Volver al inicio
      </Button>
    </section>
  );
}
