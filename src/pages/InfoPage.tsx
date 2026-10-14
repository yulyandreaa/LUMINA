import type { InfoPage as InfoPageData } from '../data/pages';
import { faqs } from '../data/pages';
import { usePageTitle } from '../hooks/usePageTitle';
import { SizeGuide } from '../components/product/SizeGuide';
import { Accordion } from '../components/ui/Accordion';
import { Eyebrow } from '../components/ui/Eyebrow';
import styles from './InfoPage.module.css';

/* Plantilla única para todas las páginas informativas y legales (contenido en data/pages.ts). */
export function InfoPage({ page }: { page: InfoPageData }) {
  usePageTitle(page.title);

  return (
    <article className={`container ${styles.page}`}>
      <header className={styles.head}>
        <Eyebrow>{page.eyebrow}</Eyebrow>
        <h1 className={styles.title}>{page.title}</h1>
        <p className={styles.intro}>{page.intro}</p>
        {page.legalReview && (
          <p className={styles.review} role="note">
            Borrador estructural: este texto debe completarse y revisarse con asesoría legal antes de publicar la tienda.
          </p>
        )}
      </header>

      <div className={styles.body}>
        {page.sections.map((s) => (
          <section key={s.heading} className={styles.section}>
            <h2 className={styles.heading}>
              {s.heading}
              {s.pending && <span className={styles.pending}>Pendiente</span>}
            </h2>
            {s.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </section>
        ))}

        {page.embed === 'size-guide' && <SizeGuide category="monturas" />}

        {page.embed === 'faq' && (
          <Accordion group="faq" items={faqs.map((f, i) => ({ id: `faq-${i}`, title: f.q, content: <p>{f.a}</p> }))} />
        )}
      </div>
    </article>
  );
}
