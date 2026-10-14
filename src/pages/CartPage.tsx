import { useCart } from '../cart/CartContext';
import { formatPrice } from '../lib/format';
import { CartLineItem } from '../components/cart/CartLineItem';
import { Button } from '../components/ui/Button';
import { Eyebrow } from '../components/ui/Eyebrow';
import { usePageTitle } from '../hooks/usePageTitle';
import styles from './CartPage.module.css';

/* Página completa de la cesta (/cesta): líneas a la izquierda, resumen a la derecha. */
export function CartPage() {
  const { lines, count, subtotal, clear } = useCart();
  usePageTitle('Tu cesta');

  return (
    <section className={`container ${styles.page}`}>
      <header className={styles.head}>
        <Eyebrow>Tu cesta</Eyebrow>
        <h1 className={styles.title}>{count > 0 ? `${count} ${count === 1 ? 'producto' : 'productos'}` : 'Tu cesta está vacía'}</h1>
      </header>

      {lines.length === 0 ? (
        <div className={styles.empty}>
          <p>Aún no has añadido nada. Empieza por nuestras monturas.</p>
          <Button to="/monturas" withArrow>
            Ver monturas
          </Button>
        </div>
      ) : (
        <div className={styles.grid}>
          <div>
            <ul className={styles.lines}>
              {lines.map((line) => (
                <CartLineItem key={line.key} line={line} />
              ))}
            </ul>
            <button className={styles.clear} onClick={clear}>
              Vaciar cesta
            </button>
          </div>

          <aside className={styles.summary} aria-label="Resumen del pedido">
            <p className={styles.summaryTitle}>Resumen</p>
            <dl className={styles.rows}>
              <div>
                <dt>Subtotal</dt>
                <dd>{formatPrice(subtotal)}</dd>
              </div>
              <div>
                <dt>Envío</dt>
                <dd>Se calcula en el checkout</dd>
              </div>
            </dl>
            <Button to="/checkout" withArrow className={styles.checkout}>
              Finalizar compra
            </Button>
            <p className={styles.note}>Precios de ejemplo (productos ficticios). Pagos en COP.</p>
          </aside>
        </div>
      )}
    </section>
  );
}
