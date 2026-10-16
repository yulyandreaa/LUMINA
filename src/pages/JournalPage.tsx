import { useState } from 'react';
import { Link } from 'react-router-dom';
import { articles, formatArticleDate, journalCategories, type Article, type JournalCategory } from '../data/journal';
import { usePageTitle } from '../hooks/usePageTitle';
import { Eyebrow } from '../components/ui/Eyebrow';
import styles from './JournalPage.module.css';

/* Portada del Diario LUMINA: artículo destacado + grilla, con filtro por categoría. */
export function JournalPage() {
  usePageTitle('Diario LUMINA');
  const [category, setCategory] = useState<JournalCategory | 'Todo'>('Todo');

  const list = category === 'Todo' ? articles : articles.filter((a) => a.category === category);
  const [featured, ...rest] = list;

  return (
    <div className={`container ${styles.page}`}>
      <header className={styles.head}>
        <Eyebrow>Diario LUMINA</Eyebrow>
        <h1 className={styles.title}>Historias para ver distinto</h1>
        <p className={styles.intro}>Guías, cuidado visual y diseño: todo lo que hay detrás de unas gafas que te representan.</p>
      </header>

      <div className={styles.filters} role="group" aria-label="Filtrar por tema">
        {(['Todo', ...journalCategories] as const).map((c) => (
          <button
            key={c}
            type="button"
            className={styles.chip}
            aria-pressed={category === c}
            onClick={() => setCategory(c)}
          >
            {c}
          </button>
        ))}
      </div>

      {featured && <FeaturedCard article={featured} />}

      {rest.length > 0 && (
        <ul className={styles.grid}>
          {rest.map((a) => (
            <li key={a.slug}>
              <ArticleCard article={a} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Meta({ article }: { article: Article }) {
  return (
    <p className={styles.meta}>
      <span className={styles.category}>{article.category}</span>
      <span aria-hidden="true">·</span>
      <time dateTime={article.date}>{formatArticleDate(article.date)}</time>
      <span aria-hidden="true">·</span>
      <span>{article.readMinutes} min de lectura</span>
    </p>
  );
}

function FeaturedCard({ article }: { article: Article }) {
  return (
    <Link to={`/diario/${article.slug}`} className={styles.featured}>
      <span className={styles.featuredMedia}>
        <img src={article.image} alt={article.imageAlt} />
      </span>
      <span className={styles.featuredBody}>
        <Meta article={article} />
        <h2 className={styles.featuredTitle}>{article.title}</h2>
        <p className={styles.excerpt}>{article.excerpt}</p>
        <span className="text-link">Leer artículo</span>
      </span>
    </Link>
  );
}

export function ArticleCard({ article }: { article: Article }) {
  return (
    <Link to={`/diario/${article.slug}`} className={styles.card}>
      <span className={styles.media}>
        <img src={article.image} alt={article.imageAlt} loading="lazy" />
      </span>
      <Meta article={article} />
      <h2 className={styles.cardTitle}>{article.title}</h2>
      <p className={styles.excerpt}>{article.excerpt}</p>
    </Link>
  );
}
