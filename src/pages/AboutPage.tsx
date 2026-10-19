import { Link } from 'react-router-dom';
import { about } from '../data/about';
import { usePageTitle } from '../hooks/usePageTitle';
import { Manifesto } from '../components/about/Manifesto';
import { Button } from '../components/ui/Button';
import { Eyebrow } from '../components/ui/Eyebrow';
import { Icon } from '../components/ui/Icon';
import { Reveal } from '../components/ui/Reveal';
import styles from './AboutPage.module.css';

/*
 * Nuestra historia (como la página "About" de la referencia):
 * portada (título + collage de 8 fotos a sangre) · origen (texto + foto) · manifiesto · valores · caminos (tiendas, examen, colección) · cierre.
 */
export function AboutPage() {
  usePageTitle('Nuestra historia');
  const { hero, origin, manifesto, values, paths } = about;

  return (
    <article>
      <header className={`container ${styles.hero}`}>
        <Eyebrow>{hero.eyebrow}</Eyebrow>
        <h1 className={styles.heroTitle}>{hero.title}</h1>
        <p className={styles.heroIntro}>{hero.intro}</p>
      </header>

      <div className={styles.collage}>
        {hero.collage.map((row, r) => (
          <div key={r} className={styles.collageRow}>
            {row.map((photo) => (
              <img
                key={photo.src}
                src={photo.src}
                alt={photo.alt}
                className={styles.collagePhoto}
                style={{ flexGrow: photo.w }}
                loading={r === 0 ? 'eager' : 'lazy'}
              />
            ))}
          </div>
        ))}
      </div>

      <section className={`container ${styles.origin}`}>
        <Reveal className={styles.originText}>
          <Eyebrow>{origin.eyebrow}</Eyebrow>
          <h2 className={styles.title}>{origin.title}</h2>
          {origin.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </Reveal>
        <img src={origin.image} alt={origin.alt} loading="lazy" className={styles.originImage} />
      </section>

      <Manifesto eyebrow={manifesto.eyebrow} lines={manifesto.lines} />

      <section className={`container ${styles.values}`}>
        <header className={styles.sectionHead}>
          <Eyebrow>Lo que nos mueve</Eyebrow>
          <h2 className={styles.title}>Cuatro ideas que nos guían</h2>
        </header>
        <ul className={styles.valueGrid}>
          {values.map((v) => (
            <li key={v.title} className={styles.value}>
              <span className={styles.valueIcon}>
                <Icon name={v.icon} size={22} />
              </span>
              <h3 className={styles.valueTitle}>{v.title}</h3>
              <p>{v.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className={`container ${styles.paths}`}>
        <header className={styles.sectionHead}>
          <Eyebrow>Conócenos</Eyebrow>
          <h2 className={styles.title}>Ven a mirar distinto</h2>
        </header>
        <ul className={styles.pathGrid}>
          {paths.map((p) => (
            <li key={p.href}>
              <Link to={p.href} className={styles.pathCard}>
                <img src={p.image} alt={p.alt} loading="lazy" className={styles.pathImage} />
                <h3 className={styles.valueTitle}>{p.title}</h3>
                <p>{p.text}</p>
                <span className="text-link">{p.cta}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className={`container ${styles.closing}`}>
        <h2 className={styles.title}>Te esperamos en LUMINA.</h2>
        <div className={styles.closingActions}>
          <Button to="/examen-visual" withArrow>
            Agenda tu examen visual
          </Button>
          <Button to="/tiendas" variant="secondary">
            Encuentra tu tienda
          </Button>
        </div>
      </section>
    </article>
  );
}
