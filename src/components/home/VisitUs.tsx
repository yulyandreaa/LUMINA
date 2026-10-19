import { Button } from '../ui/Button';
import { Eyebrow } from '../ui/Eyebrow';
import { Reveal } from '../ui/Reveal';
import styles from './VisitUs.module.css';

/* Sección 10 — "Visítanos": tienda física + examen visual, con los iconos de línea del tablero. */
export function VisitUs({ image }: { image: string }) {
  return (
    <section className={styles.section}>
      <div className={`container ${styles.grid}`}>
        <Reveal className={styles.copy}>
          <Eyebrow>Visítanos</Eyebrow>
          <h2 className={styles.title}>Cuidamos tu forma de ver.</h2>
          <p className={styles.text}>
            Pruébate las monturas en persona y recibe asesoría de ajuste en nuestras 3 tiendas de Bogotá, de 10:00 a. m. a 7:00 p. m.
          </p>
          <div className={styles.actions}>
            <Button to="/examen-visual" variant="secondary" withArrow className={styles.button}>
              Examen visual
            </Button>
            <Button to="/tiendas" variant="secondary" withArrow className={styles.button}>
              Encuentra una tienda
            </Button>
          </div>
        </Reveal>
        <Reveal className={styles.media}>
          <img src={image} alt="Bolsa de compra LUMINA en color borgoña" loading="lazy" />
        </Reveal>
      </div>
    </section>
  );
}
