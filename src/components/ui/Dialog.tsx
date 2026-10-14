import { useEffect, useId, useRef, type ReactNode } from 'react';
import { Icon } from './Icon';
import styles from './Dialog.module.css';

/*
 * Modal basado en el elemento nativo <dialog>.
 * showModal() ya da gratis: foco atrapado dentro, Escape para cerrar y fondo inerte.
 */
interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function Dialog({ open, onClose, title, children }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className={styles.dialog}
      aria-labelledby={titleId}
      onClose={onClose}
      // Clic en el fondo (fuera de la caja) cierra el modal.
      onClick={(e) => e.target === ref.current && onClose()}
    >
      <div className={styles.box}>
        <div className={styles.head}>
          <h2 id={titleId} className={styles.title}>
            {title}
          </h2>
          <button className={styles.close} onClick={onClose} aria-label="Cerrar">
            <Icon name="close" size={22} />
          </button>
        </div>
        <div className={styles.body}>{children}</div>
      </div>
    </dialog>
  );
}
