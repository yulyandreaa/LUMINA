import type { FrameSize } from '../../types/product';
import { sizeGuide } from '../../data/sizes';
import styles from './SizeSelector.module.css';

/*
 * Selector de talla: botones con el ancho de lente y el nombre, como "46 (Average)" en la referencia.
 * Es un grupo de radio accesible; muestra un error si se intenta comprar sin elegir.
 */
interface SizeSelectorProps {
  sizes: FrameSize[];
  selected: FrameSize | null;
  onSelect: (size: FrameSize) => void;
  error?: string;
}

export function SizeSelector({ sizes, selected, onSelect, error }: SizeSelectorProps) {
  return (
    <div>
      <div
        className={styles.list}
        role="radiogroup"
        aria-label="Talla"
        aria-invalid={!!error}
        aria-describedby={error ? 'size-error' : undefined}
      >
        {sizes.map((id) => {
          const s = sizeGuide[id];
          return (
            <button
              key={id}
              type="button"
              role="radio"
              aria-checked={selected === id}
              className={styles.option}
              onClick={() => onSelect(id)}
            >
              <span className={styles.number}>{s.lensWidth}</span>
              <span className={styles.label}>{s.label}</span>
            </button>
          );
        })}
      </div>
      {error && (
        <p id="size-error" className={styles.error} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
