import { Link } from 'react-router-dom';
import { Eyebrow } from '../ui/Eyebrow';
import { Reveal } from '../ui/Reveal';
import styles from './Journal.module.css';

/* Sección 9 — Diario (blog de la referencia): 3 artículos con imagen, título y extracto. */
export interface JournalPost {
  title: string;
  excerpt: string;
  image: string;
  to: string;
}

export function Journal({ posts }: { posts: JournalPost[] }) {
  return (
    <section className="section container">
      <Reveal className="section-head">
        <div>
          <Eyebrow>Diario LUMINA</Eyebrow>
          <h2 className="section-title">Historias para ver distinto</h2>
        </div>
        <Link to="/diario" className="text-link">
          Leer más
        </Link>
      </Reveal>
      <ul className={styles.grid}>
        {posts.map((post) => (
          <li key={post.title}>
            <Reveal>
              <Link to={post.to} className={styles.card}>
                <span className={styles.media}>
                  <img src={post.image} alt="" loading="lazy" />
                </span>
                <h3 className={styles.title}>{post.title}</h3>
                <p className={styles.excerpt}>{post.excerpt}</p>
              </Link>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
