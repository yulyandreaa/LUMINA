import type { FrameShape } from '../types/product';

/*
 * Guía "Talla y ajuste".
 * Los rangos generales y los consejos por forma de rostro resumen guías públicas de ópticas y marcas
 * (All About Vision, Chanel, MOSCOT, EyeBuyDirect, Opticare). ⚠️ Las medidas de LUMINA (sizes.ts)
 * y el ejemplo de patilla son FICTICIOS hasta confirmar las medidas reales de cada modelo.
 */

/** Ejemplo de los tres números grabados en la patilla (ficticio). */
export const templeExample = { lens: 49, bridge: 21, temple: 145 };

export const measurements = [
  {
    id: 'lens',
    label: 'Ancho de lente',
    range: '40–62 mm',
    text: 'El ancho de una sola lente, de borde a borde. Es el número que define la talla de la montura.',
  },
  {
    id: 'bridge',
    label: 'Puente',
    range: '14–24 mm',
    text: 'La distancia entre las dos lentes. Decide dónde y cómo se apoya la montura sobre tu nariz.',
  },
  {
    id: 'temple',
    label: 'Patilla',
    range: '120–150 mm',
    text: 'El largo de la varilla, desde la bisagra hasta la punta que va detrás de la oreja.',
  },
] as const;

export const steps = [
  {
    title: 'Busca tus números',
    text: 'Toma unas gafas que ya te queden bien y mira la cara interior de la patilla: verás tres números, como 49 □ 21 145.',
  },
  {
    title: 'Compara el ancho de lente',
    text: 'El primer número es el ancho de lente. Búscalo en la tabla de tallas LUMINA de abajo; una diferencia de 1 o 2 mm casi no se nota.',
  },
  {
    title: 'Elige y pruébatelas',
    text: 'Filtra por esa talla en la tienda o ven a cualquiera de nuestras tiendas en Bogotá para probártelas en persona.',
  },
];

export const faceShapes: { name: string; traits: string; tip: string; shapes: { label: string; id: FrameShape }[] }[] = [
  {
    name: 'Redondo',
    traits: 'Mejillas llenas, largo y ancho parecidos, líneas suaves.',
    tip: 'Las monturas con ángulos le dan estructura al rostro. Busca formas cuadradas, geométricas o cat-eye.',
    shapes: [
      { label: 'Cuadradas', id: 'cuadrada' },
      { label: 'Geométricas', id: 'geometrica' },
    ],
  },
  {
    name: 'Cuadrado',
    traits: 'Mandíbula marcada, frente amplia y facciones rectas.',
    tip: 'Las curvas suavizan los ángulos. Prueba monturas redondas, ovaladas o cat-eye.',
    shapes: [
      { label: 'Redondas', id: 'redonda' },
      { label: 'Cat-eye', id: 'cat-eye' },
    ],
  },
  {
    name: 'Ovalado',
    traits: 'Algo más largo que ancho, con pómulos suaves y frente equilibrada.',
    tip: 'Casi todo te queda bien. Mantén la montura en proporción: ni mucho más ancha ni mucho más pequeña que tu rostro.',
    shapes: [
      { label: 'Redondas', id: 'redonda' },
      { label: 'Cuadradas', id: 'cuadrada' },
    ],
  },
  {
    name: 'Corazón',
    traits: 'Frente ancha y mentón más estrecho.',
    tip: 'Lleva la mirada hacia abajo con monturas ovaladas, redondas o de borde inferior curvo; evita las muy recargadas arriba.',
    shapes: [
      { label: 'Redondas', id: 'redonda' },
      { label: 'Cat-eye', id: 'cat-eye' },
    ],
  },
];

export const fitChecklist = [
  'Tus ojos quedan centrados en cada lente, ni muy juntos ni muy separados.',
  'El frente no es más ancho que tu rostro: termina más o menos a la altura de tus sienes.',
  'El puente se apoya en la nariz sin dejar marcas ni resbalarse.',
  'Las patillas pasan rectas hasta las orejas y no aprietan detrás.',
  'Al sonreír, la montura no toca tus mejillas.',
];
