import { Link } from 'react-router-dom';
import { Icon, type IconName } from '../ui/Icon';
import styles from './TrustBar.module.css';

/*
 * Tarjetas de confianza bajo "Sobre la colección", según el diseño de la usuaria:
 * fotos entregadas por ella (public/trust/*.jpg)
 * y encima ícono de línea, título, filete corto y texto, alineados a la izquierda.
 * Solo promesas que LUMINA ya definió: examen gratis con montura, 3 tiendas con horario,
 * garantía legal. Envío no aparece porque su costo sigue pendiente.
 */
const items: { icon: IconName; title: string; text: string; to: string; image: string; dark?: boolean; veil?: boolean }[] = [
  {
    icon: 'eye',
    title: 'Examen visual\nsin costo',
    text: 'Gratis con la compra de tu montura, en cualquiera de nuestras tiendas.',
    to: '/examen-visual',
    image: '/trust/examen.jpg',
  },
  {
    icon: 'store',
    title: 'Pruébatelas\nen tienda',
    text: 'Visítanos en cualquiera de nuestras 3 tiendas en Bogotá y encuentra la montura que va contigo.',
    to: '/tiendas',
    image: '/trust/tienda.jpg',
    dark: true,
  },
  {
    icon: 'shield',
    title: 'Compra\nrespaldada',
    text: 'Todas tus compras cuentan con la garantía legal de la Ley 1480 de 2011.',
    to: '/garantia',
    image: '/trust/garantia.jpg',
    veil: true,
  },
];

export function TrustBar() {
  return (
    <section className={`container ${styles.bar}`} aria-label="Por qué comprar en LUMINA">
      {items.map((item) => (
        <Link
          key={item.title}
          to={item.to}
          className={styles.card}
          data-tone={item.dark ? 'dark' : 'light'}
          data-veil={item.veil || undefined}
          style={{ backgroundImage: `url(${item.image})` }}
        >
          <Icon name={item.icon} size={30} className={styles.icon} />
          <h3 className={styles.title}>{item.title}</h3>
          <p className={styles.text}>{item.text}</p>
        </Link>
      ))}
    </section>
  );
}
