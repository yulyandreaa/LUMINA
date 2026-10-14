import { BrandSeal } from '../ui/BrandSeal';
import { Reveal } from '../ui/Reveal';
import styles from './StoryQuote.module.css';

/*
 * Historia de marca (como la sección de la cita de Zack Moscot en la referencia):
 * mitad foto a sangre · mitad panel de color con sello, cita y firma.
 */
interface StoryQuoteProps {
  image: string;
  alt: string;
  quote: string;
  author: string;
}

export function StoryQuote({ image, alt, quote, author }: StoryQuoteProps) {
  return (
    <section className={styles.section}>
      <div className={styles.media}>
        <img src={image} alt={alt} loading="lazy" />
      </div>
      <div className={styles.panel}>
        <Reveal className={styles.content}>
          <BrandSeal className={styles.seal} />
          <blockquote className={styles.quote}>
            <p>“{quote}”</p>
            <footer className={styles.signature}>
              <cite className={styles.author}>{author}</cite>
            </footer>
          </blockquote>
        </Reveal>
      </div>
    </section>
  );
}
