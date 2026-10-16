import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { PENDING_FAVORITE_KEY } from '../../auth/accountStorage';
import { useAccountData } from '../../auth/useAccountData';
import { isFavorite, toggleFavorite } from '../../lib/favorites';
import type { ColorVariant, Product } from '../../types/product';
import { Icon } from '../ui/Icon';
import styles from './FavoriteButton.module.css';

/*
 * Corazón de favoritos (tarjetas y ficha de producto).
 * Con sesión: guarda o quita al instante. Sin sesión: lleva a iniciar sesión,
 * recuerda el producto y lo guarda en cuanto la persona entra; luego vuelve a esta página.
 */
interface FavoriteButtonProps {
  product: Product;
  color: ColorVariant;
  className?: string;
}

export function FavoriteButton({ product, color, className }: FavoriteButtonProps) {
  const { customer } = useAuth();
  const { data, update } = useAccountData();
  const navigate = useNavigate();
  const { pathname, search } = useLocation();
  const active = !!customer && isFavorite(data.favorites, product.id);
  const item = { productId: product.id, colorId: color.id };

  const onClick = () => {
    if (customer) {
      update((d) => ({ ...d, favorites: toggleFavorite(d.favorites, item) }));
      return;
    }
    try {
      window.sessionStorage.setItem(PENDING_FAVORITE_KEY, JSON.stringify(item));
    } catch {
      /* sin sessionStorage: solo se pierde el guardado automático */
    }
    navigate('/cuenta/ingresar', { state: { from: pathname + search } });
  };

  return (
    <button
      type="button"
      className={[styles.button, className].filter(Boolean).join(' ')}
      aria-pressed={active}
      aria-label={active ? `Quitar ${product.name} de favoritos` : `Guardar ${product.name} en favoritos`}
      title={active ? 'Quitar de favoritos' : 'Guardar en favoritos'}
      onClick={onClick}
    >
      <Icon name="heart" size={20} />
    </button>
  );
}
