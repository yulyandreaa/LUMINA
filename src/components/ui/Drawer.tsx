import { useEffect, useRef, type ReactNode } from 'react';
import { Icon } from './Icon';
import styles from './Drawer.module.css';

/*
 * Panel lateral genérico (filtros en móvil y, en la etapa 5, la cesta).
 * Bloquea el scroll de fondo, cierra con Escape o clic fuera,
 * y devuelve el foco al elemento que lo abrió al cerrarse.
 */
interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  side?: 'left' | 'right';
  children: ReactNode;
  footer?: ReactNode;
}

export function Drawer({ open, onClose, title, side = 'right', children, footer }: DrawerProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement as HTMLElement | null;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
      opener?.focus();
    };
  }, [open, onClose]);

  return (
    <>
      <div className={styles.overlay} data-open={open} onClick={onClose} aria-hidden="true" />
      <div
        className={styles.drawer}
        data-open={open}
        data-side={side}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        inert={!open}
      >
        <div className={styles.head}>
          <p className={styles.title}>{title}</p>
          <button ref={closeRef} className={styles.close} onClick={onClose} aria-label="Cerrar">
            <Icon name="close" size={22} />
          </button>
        </div>
        <div className={styles.body}>{children}</div>
        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    </>
  );
}
