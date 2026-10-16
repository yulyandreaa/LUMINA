import { Link, useParams } from 'react-router-dom';
import { articles, formatArticleDate, getArticle } from '../data/journal';
import { usePageTitle } from '../hooks/usePageTitle';
import { NotFoundPage } from './NotFoundPage';
import { ArticleCard } from './JournalPage';
import styles from './ArticlePage.module.css';

/* Artículo del Diario: portada, cuerpo, llamada a la acción, fuentes y otros artículos. */
export function ArticlePage() {
  const { slug = '' } = useParams();
  const article = getArticle(slug);
  usePageTitle(article?.title);

  if (!article) return <NotFoundPage />;

  const related = articles.filter((a) => a.slug !== article.slug && a.category === article.category);
  const more = [...related, ...articles.filter((a) => a.slug !== article.slug && a.category !== article.category)].slice(0, 3);

  return (
    <article className={styles.page}>
      <div className={`container ${styles.head}`}>
        <nav className={styles.breadcrumb} aria-label="Ruta de navegación">
          <Link to="/diario">Diario LUMINA</Link>
          <span aria-hidden="true">/</span>
          <span>{article.category}</span>
        </nav>
        <h1 className={styles.title}>{article.title}</h1>
        <p className={styles.excerpt}>{article.excerpt}</p>
        <p className={styles.meta}>
          Por Equipo LUMINA · <time dateTime={article.date}>{formatArticleDate(article.date)}</time> ·{' '}
          {article.readMinutes} min de lectura
        </p>
      </div>

      <figure className={`container ${styles.cover}`}>
        <img src={article.image} alt={article.imageAlt} />
      </figure>

      <div className={`container ${styles.body}`}>
        {article.fictional && <p className={styles.note}>Texto de ejemplo (ficticio), pendiente de la historia real de LUMINA.</p>}

        {article.body.map((section, i) => (
          <section key={i} className={styles.section}>
            {section.heading && <h2 className={styles.heading}>{section.heading}</h2>}
            {section.paragraphs?.map((p) => (
              <p key={p}>{p}</p>
            ))}
            {section.list && (
              <ul className={styles.list}>
                {section.list.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
          </section>
        ))}

        {article.cta && (
          <p>
            <Link to={article.cta.to} className={styles.cta}>
              {article.cta.label} →
            </Link>
          </p>
        )}

        {article.sources && (
          <footer className={styles.sources}>
            <p className={styles.sourcesTitle}>Fuentes</p>
            <ul>
              {article.sources.map((s) => (
                <li key={s.url}>
                  <a href={s.url} target="_blank" rel="noreferrer">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
            <p className={styles.disclaimer}>
              Contenido informativo. No reemplaza la consulta con un profesional de la salud visual.
            </p>
          </footer>
        )}
      </div>

      <section className={`container ${styles.more}`} aria-labelledby="mas-articulos">
        <div className={styles.moreHead}>
          <h2 id="mas-articulos" className={styles.moreTitle}>
            Sigue leyendo
          </h2>
          <Link to="/diario" className="text-link">
            Ver todo el Diario
          </Link>
        </div>
        <ul className={styles.moreGrid}>
          {more.map((a) => (
            <li key={a.slug}>
              <ArticleCard article={a} />
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
