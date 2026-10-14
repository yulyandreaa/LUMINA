import { useCart } from '../../cart/CartContext';
import { formatPrice } from '../../lib/format';
import { Drawer } from '../ui/Drawer';
import { Button } from '../ui/Button';
import { CartLineItem } from './CartLineItem';
import styles from './CartDrawer.module.css';

/* Cesta lateral: se abre desde el icono de la cabecera y al añadir un producto. */
export function CartDrawer() {
  const { lines, count, subtotal, isOpen, close } = useCart();

  return (
    <Drawer
      open={isOpen}
      onClose={close}
      title={`Tu cesta (${count})`}
      footer={
        lines.length > 0 && (
          <div className={styles.footer}>
            <div className={styles.row}>
              <span>Subtotal</span>
              <strong>{formatPrice(subtotal)}</strong>
            </div>
            <p className={styles.note}>Envío e impuestos se calculan en el checkout.</p>
            <Button to="/checkout" withArrow onClick={close}>
              Finalizar compra
            </Button>
            <Button to="/cesta" variant="secondary" onClick={close}>
              Ver cesta
            </Button>
          </div>
        )
      }
    >
      {lines.length === 0 ? (
        <div className={styles.empty}>
          <p className={styles.emptyTitle}>Tu cesta está vacía.</p>
          <p>Encuentra la montura que va con tu forma de ver.</p>
          <Button to="/monturas" withArrow onClick={close}>
            Ver monturas
          </Button>
          <Button to="/gafas-de-sol" variant="secondary" onClick={close}>
            Ver gafas de sol
          </Button>
        </div>
      ) : (
        <ul>
          {lines.map((line) => (
            <CartLineItem key={line.key} line={line} />
          ))}
        </ul>
      )}
    </Drawer>
  );
}
