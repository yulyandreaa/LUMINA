import { useMemo, type FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { products } from '../data/products';
import { searchProducts } from '../lib/catalog';
import { CatalogView } from '../components/catalog/CatalogView';
import { Eyebrow } from '../components/ui/Eyebrow';
import { Button } from '../components/ui/Button';
import { usePageTitle } from '../hooks/usePageTitle';
import styles from './SearchPage.module.css';

/* Resultados de búsqueda: /buscar?q=redonda — con los mismos filtros y orden que los listados. */
export function SearchPage() {
  const [params, setParams] = useSearchParams();
  const query = params.get('q') ?? '';
  usePageTitle(query ? `Buscar: ${query}` : 'Buscar');
  const results = useMemo(() => searchProducts(products, query), [query]);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const q = String(new FormData(e.currentTarget).get('q') ?? '').trim();
    setParams(q ? { q } : {}); // una búsqueda nueva reinicia filtros y orden
  };

  return (
    <>
      <header className={`container ${styles.hero}`}>
        <Eyebrow>Buscar</Eyebrow>
        <h1 className={styles.title}>{query ? `“${query}”` : '¿Qué estás buscando?'}</h1>
        <form className={styles.form} onSubmit={onSubmit} role="search">
          <label htmlFor="search-page-input" className="visually-hidden">
            Buscar productos
          </label>
          <input
            key={query}
            id="search-page-input"
            name="q"
            type="search"
            defaultValue={query}
            placeholder="Nombre, forma o color"
            className={styles.input}
          />
          <Button type="submit" withArrow>
            Buscar
          </Button>
        </form>
      </header>

      {query && <CatalogView key={query} products={results} defaultSort="relevancia" isSearch />}
    </>
  );
}
