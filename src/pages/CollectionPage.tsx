import { Link } from 'react-router-dom';
import type { Category } from '../types/product';
import { getProductsByCategory } from '../data/products';
import { CatalogView } from '../components/catalog/CatalogView';
import { Eyebrow } from '../components/ui/Eyebrow';
import { usePageTitle } from '../hooks/usePageTitle';
import styles from './CollectionPage.module.css';

/* Listado por categoría (/monturas, /gafas-de-sol), como /collections/eyeglasses de la referencia. */
const copy: Record<Category, { title: string; text: string }> = {
  monturas: {
    title: 'Monturas',
    text: 'Acetatos y metales pensados para acompañarte cada día. Elige forma, talla y color.',
  },
  'gafas-de-sol': {
    title: 'Gafas de sol',
    text: 'Para los días de luz: siluetas con carácter y lentes que cuidan tu mirada.',
  },
};

export function CollectionPage({ category }: { category: Category }) {
  const { title, text } = copy[category];
  usePageTitle(title);

  return (
    <>
      <header className={`container ${styles.hero}`}>
        <nav aria-label="Migas de pan" className={styles.breadcrumb}>
          <Link to="/">Inicio</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{title}</span>
        </nav>
        <Eyebrow>Catálogo · Ficticio</Eyebrow>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.text}>{text}</p>
      </header>
      {/* key: al cambiar de categoría se reinicia el estado interno (p. ej. el panel de filtros). */}
      <CatalogView key={category} products={getProductsByCategory(category)} defaultSort="destacados" />
    </>
  );
}
