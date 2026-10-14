import type { FrameSize } from '../types/product';

/*
 * ⚠️ MEDIDAS FICTICIAS de ejemplo (en mm). Sustituir por las medidas reales de cada modelo.
 * Estructura de la guía de tallas de la referencia: ancho de lente y de montura + recomendación por rostro.
 */
export interface SizeInfo {
  id: FrameSize;
  label: string;
  /** Número que se muestra en el selector, como "46 (Media)" en la referencia. */
  lensWidth: number;
  bridge: number;
  temple: number;
  frameWidth: number;
  advice: string;
}

export const sizeGuide: Record<FrameSize, SizeInfo> = {
  estrecha: {
    id: 'estrecha',
    label: 'Estrecha',
    lensWidth: 46,
    bridge: 20,
    temple: 140,
    frameWidth: 128,
    advice: 'Si tu rostro es más bien delgado o los sombreros suelen quedarte holgados.',
  },
  media: {
    id: 'media',
    label: 'Media',
    lensWidth: 49,
    bridge: 21,
    temple: 145,
    frameWidth: 136,
    advice: 'La talla más habitual. Si no estás segura o seguro, empieza por aquí.',
  },
  ancha: {
    id: 'ancha',
    label: 'Ancha',
    lensWidth: 52,
    bridge: 22,
    temple: 145,
    frameWidth: 142,
    advice: 'Si tu cabeza es más bien ancha o los sombreros suelen quedarte ajustados.',
  },
  'extra-ancha': {
    id: 'extra-ancha',
    label: 'Extra ancha',
    lensWidth: 55,
    bridge: 22,
    temple: 150,
    frameWidth: 148,
    advice: 'Si tu cabeza es especialmente ancha o necesitas un poco más de espacio.',
  },
};
