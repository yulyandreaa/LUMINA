import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/*
 * Fila de pestañas deslizable (Mi cuenta y panel en celular/tablet):
 * - al cambiar de sección, desliza la fila para que la pestaña activa quede a la vista;
 * - marca data-at-end cuando ya no hay más a la derecha (el CSS quita el fundido).
 */
export function useTabStrip<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const { pathname } = useLocation();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      el.dataset.atEnd = String(el.scrollLeft + el.clientWidth >= el.scrollWidth - 2);
    };
    update();
    el.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      el.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  useEffect(() => {
    const active = ref.current?.querySelector<HTMLElement>('[aria-current="page"]');
    if (!active || !ref.current || ref.current.scrollWidth <= ref.current.clientWidth) return;
    active.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }, [pathname]);

  return ref;
}
