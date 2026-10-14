import { useId } from 'react';

/*
 * Sello circular de LUMINA (equivalente al emblema "MOSCOT · EST. 1915" de la referencia):
 * texto curvado alrededor (SVG <textPath>) y el destello de la marca en el centro.
 */
export function BrandSeal({ className }: { className?: string }) {
  const id = useId();
  return (
    <svg viewBox="0 0 120 120" className={className} role="img" aria-label="LUMINA, óptica contemporánea">
      <defs>
        <path id={id} d="M60 60m-44 0a44 44 0 1 1 88 0a44 44 0 1 1 -88 0" />
      </defs>
      <circle cx="60" cy="60" r="56" fill="none" stroke="currentColor" strokeWidth="1" />
      <circle cx="60" cy="60" r="32" fill="none" stroke="currentColor" strokeWidth="0.75" />
      <text fill="currentColor" fontFamily="Inter, sans-serif" fontSize="8.6" fontWeight="600" letterSpacing="2.6">
        <textPath href={`#${id}`}>LUMINA · ÓPTICA CONTEMPORÁNEA ·</textPath>
      </text>
      {/* Destello de 4 puntas */}
      <path d="M60 40c1.6 11 8 18 20 20c-12 2-18.4 9-20 20c-1.6-11-8-18-20-20c12-2 18.4-9 20-20Z" fill="currentColor" />
    </svg>
  );
}
