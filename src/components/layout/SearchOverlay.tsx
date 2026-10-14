import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { products } from '../../data/products';
import { searchProducts } from '../../lib/catalog';
import { formatPrice } from '../../lib/format';
import { FrameIllustration } from '../product/FrameIllustration';
import { Icon } from '../ui/Icon';
import styles from './SearchOverlay.module.css';

/*
 * Buscador desplegable bajo la cabecera.
 * Muestra hasta 4 resultados mientras escribes; Enter lleva a /buscar?q=…
 */
const MAX_PREVIEW = 4;

export function SearchOverlay({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const results = useMemo(() => searchProducts(products, query), [query]);

  useEffect(() => {
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/buscar?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <div className={styles.panel} role="dialog" aria-label="Buscar">
      <div className="container">
        <form className={styles.form} onSubmit={onSubmit} role="search">
          <Icon name="search" size={22} />
          <label htmlFor="site-search" className="visually-hidden">
            Buscar productos
          </label>
          <input
            ref={inputRef}
            id="site-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Busca por nombre, forma o color…"
            className={styles.input}
            autoComplete="off"
          />
          <button type="button" onClick={onClose} className={styles.close} aria-label="Cerrar búsqueda">
            <Icon name="close" />
          </button>
        </form>

        {query.trim() && (
          <div className={styles.results} aria-live="polite">
            {results.length === 0 ? (
              <p className={styles.none}>Sin resultados para “{query}”.</p>
            ) : (
              <>
                <ul className={styles.list}>
                  {results.slice(0, MAX_PREVIEW).map((p) => (
                    <li key={p.id}>
                      <Link to={`/producto/${p.slug}`} className={styles.item}>
                        <span className={styles.thumb}>
                          <FrameIllustration shape={p.shape} color={p.colors[0].hex} sun={p.category === 'gafas-de-sol'} />
                        </span>
                        <span>
                          <span className={styles.name}>{p.name}</span>
                          <span className={styles.price}>{formatPrice(p.price)}</span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link to={`/buscar?q=${encodeURIComponent(query.trim())}`} className="text-link">
                  Ver los {results.length} resultados
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
