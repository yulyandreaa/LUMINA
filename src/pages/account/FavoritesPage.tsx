import { useAccountData } from '../../auth/useAccountData';
import { products } from '../../data/products';
import { usePageTitle } from '../../hooks/usePageTitle';
import { Button } from '../../components/ui/Button';
import { ProductCard } from '../../components/product/ProductCard';
import { SectionHead } from './AccountLayout';
import styles from './Account.module.css';

/*
 * Favoritos: las monturas guardadas con el corazón, las más recientes primero,
 * cada una en el color con el que se guardó. Tocar el corazón de nuevo la quita.
 */
export function FavoritesPage() {
  usePageTitle('Favoritos');
  const { data } = useAccountData();
  const saved = data.favorites.flatMap((f) => {
    const product = products.find((p) => p.id === f.productId);
    return product ? [{ product, colorId: f.colorId }] : [];
  });

  return (
    <>
      <SectionHead title="Favoritos">
        {saved.length > 0 && (
          <p className={styles.muted}>
            {saved.length} {saved.length === 1 ? 'montura guardada' : 'monturas guardadas'}
          </p>
        )}
      </SectionHead>

      {saved.length === 0 ? (
        <div className={styles.empty}>
          <p className={styles.emptyTitle}>Aún no tienes favoritos.</p>
          <p className={styles.muted}>Toca el corazón de una montura y la encontrarás aquí.</p>
          <Button to="/monturas" variant="secondary" withArrow>
            Ver monturas
          </Button>
        </div>
      ) : (
        <ul className={styles.favorites}>
          {saved.map(({ product, colorId }) => (
            <li key={product.id}>
              <ProductCard product={product} initialColorId={colorId} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
