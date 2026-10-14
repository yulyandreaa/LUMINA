import type { FrameShape } from '../../types/product';

/*
 * Ilustración vectorial de una montura, coloreada con la variante elegida.
 * Sustituye a la foto mientras no haya fotografía real de producto:
 * así las muestras de color cambian la imagen de verdad.
 */
interface FrameIllustrationProps {
  shape: FrameShape;
  color: string;
  sun?: boolean;
  /** Vista ligeramente girada, usada como segunda imagen al pasar el ratón. */
  angled?: boolean;
  className?: string;
}

// Lente izquierda centrada en (60, 60); la derecha se obtiene reflejándola.
const lens: Record<FrameShape, string> = {
  redonda: 'M60 30a30 30 0 1 1 0 60a30 30 0 1 1 0-60Z',
  cuadrada: 'M30 36q0-8 8-8h46q8 0 8 8v40q0 12-12 12H42q-12 0-12-12Z',
  aviador: 'M28 38q2-10 14-10h40q12 0 12 10q0 22-14 40q-10 12-24 10q-18-4-24-22q-4-14-4-28Z',
  'cat-eye': 'M24 30q30-6 64 2q8 2 6 14q-4 30-30 38q-24 6-34-14q-6-14-6-40Z',
  geometrica: 'M44 28h32l18 18v26l-18 18H44L26 72V46Z',
};

export function FrameIllustration({ shape, color, sun = false, angled = false, className }: FrameIllustrationProps) {
  const lensFill = sun ? color : '#ffffff';
  const lensOpacity = sun ? 0.55 : 0.18;

  return (
    <svg
      viewBox="0 0 240 120"
      className={className}
      aria-hidden="true"
      style={angled ? { transform: 'perspective(500px) rotateY(-22deg) scale(0.94)' } : undefined}
    >
      <g>
        {/* Patillas */}
        <path d="M24 44 L4 40" stroke={color} strokeWidth="6" strokeLinecap="round" />
        <path d="M216 44 L236 40" stroke={color} strokeWidth="6" strokeLinecap="round" />
        {/* Lentes */}
        <path d={lens[shape]} fill={lensFill} fillOpacity={lensOpacity} stroke={color} strokeWidth="9" strokeLinejoin="round" />
        <path
          d={lens[shape]}
          transform="translate(240 0) scale(-1 1)"
          fill={lensFill}
          fillOpacity={lensOpacity}
          stroke={color}
          strokeWidth="9"
          strokeLinejoin="round"
        />
        {/* Puente */}
        <path d="M94 48q26-14 52 0" fill="none" stroke={color} strokeWidth="7" strokeLinecap="round" />
        {/* Remaches con destello de marca */}
        <path d="M30 40l1.5 4l4 1.5l-4 1.5l-1.5 4l-1.5-4l-4-1.5l4-1.5Z" fill="#f7f0ea" opacity="0.85" />
        <path d="M210 40l1.5 4l4 1.5l-4 1.5l-1.5 4l-1.5-4l-4-1.5l4-1.5Z" fill="#f7f0ea" opacity="0.85" />
      </g>
    </svg>
  );
}
