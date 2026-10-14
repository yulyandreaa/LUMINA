import styles from './EyesFrame.module.css';

/*
 * Pequeña ilustración animada: unas gafas con ojos que miran a los lados y parpadean.
 * Equivale al GIF de ojos de la referencia, pero en SVG + CSS (ligero y nítido).
 * Con "reducir movimiento" activado, queda quieta.
 */
export function EyesFrame({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 160 60" className={styles.svg} aria-hidden="true">
      {[40, 120].map((cx) => (
        <g key={cx}>
          <ellipse cx={cx} cy="30" rx="22" ry="14" fill="#fffaf6" />
          <g className={styles.pupil}>
            <circle cx={cx} cy="31" r="8" fill="#5b3a2e" />
            <circle cx={cx} cy="31" r="4" fill="#1e1415" />
            <circle cx={cx + 3} cy="28" r="1.6" fill="#fff" />
          </g>
          {/* Párpado: un rectángulo que baja y sube */}
          <rect className={styles.lid} x={cx - 24} y="14" width="48" height="32" fill="#d7a6a0" />
        </g>
      ))}
      {/* Montura */}
      <path d="M14 22q0-8 9-8h34q9 0 9 8v14q0 12-14 12H28q-14 0-14-12Z" fill="none" stroke={color} strokeWidth="5" />
      <path d="M94 22q0-8 9-8h34q9 0 9 8v14q0 12-14 12h-24q-14 0-14-12Z" fill="none" stroke={color} strokeWidth="5" />
      <path d="M66 24q14-8 28 0" fill="none" stroke={color} strokeWidth="4" />
      <path d="M14 22 4 20M146 22l10-2" stroke={color} strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}
