import { useEffect } from 'react';

const BASE = 'LUMINA · Óptica contemporánea';

/* Pone el título de la pestaña del navegador (importante para accesibilidad y SEO). */
export function usePageTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} · LUMINA` : BASE;
    return () => {
      document.title = BASE;
    };
  }, [title]);
}
