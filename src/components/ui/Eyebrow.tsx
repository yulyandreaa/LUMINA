import type { ReactNode } from 'react';
import styles from './Eyebrow.module.css';

/*
 * Etiqueta editorial de LUMINA: mayúsculas espaciadas + filete corto debajo
 * (como "LOGOTIPO PRINCIPAL" o "PALETA DE COLOR" en el tablero).
 */
interface EyebrowProps {
  children: ReactNode;
  as?: 'p' | 'span' | 'h2' | 'h3';
  rule?: boolean;
  className?: string;
}

export function Eyebrow({ children, as: Tag = 'p', rule = true, className }: EyebrowProps) {
  return (
    <Tag className={[styles.eyebrow, rule && styles.rule, className].filter(Boolean).join(' ')}>
      {children}
    </Tag>
  );
}
