import type { CSSProperties } from 'react';
import type { ColorVariant } from '../../types/product';
import styles from './Swatches.module.css';

/*
 * Muestras de color como grupo de radio accesible:
 * el lector de pantalla anuncia "Borgoña, seleccionado, 1 de 4".
 */
interface SwatchesProps {
  colors: ColorVariant[];
  selected: string;
  onSelect: (id: string) => void;
  label: string;
  size?: 'sm' | 'md';
}

export function Swatches({ colors, selected, onSelect, label, size = 'sm' }: SwatchesProps) {
  return (
    <div className={`${styles.list} ${styles[size]}`} role="radiogroup" aria-label={label}>
      {colors.map((c) => (
        <button
          key={c.id}
          type="button"
          role="radio"
          aria-checked={c.id === selected}
          aria-label={c.name}
          title={c.name}
          className={styles.swatch}
          style={{ '--swatch': c.hex } as CSSProperties}
          onClick={() => onSelect(c.id)}
        />
      ))}
    </div>
  );
}
