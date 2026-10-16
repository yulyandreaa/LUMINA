/*
 * Sedes de LUMINA en Bogotá.
 * ⚠️ Barrios PROPUESTOS; dirección aún sin definir (no se muestra). Teléfono y horario dados por LUMINA.
 * Fotos: fachadas generadas con IA (Magnific) con el logo real montado en edición.
 */
export interface Store {
  id: string;
  name: string;
  city: string;
  /** null = pendiente de confirmar. */
  address: string | null;
  phone: string | null;
  hours: string | null;
  image: string;
  alt: string;
}

export const stores: Store[] = [
  {
    id: 'quinta-camacho',
    name: 'Tienda LUMINA Quinta Camacho',
    city: 'Bogotá, Colombia',
    address: null,
    phone: '1234567892',
    hours: '10:00 a. m. – 7:00 p. m.',
    image: '/stores/quinta-camacho.jpg',
    alt: 'Fachada borgoña de LUMINA en un edificio de ladrillo de Quinta Camacho, con los cerros al fondo',
  },
  {
    id: 'usaquen',
    name: 'Tienda LUMINA Usaquén',
    city: 'Bogotá, Colombia',
    address: null,
    phone: '1234567892',
    hours: '10:00 a. m. – 7:00 p. m.',
    image: '/stores/usaquen.jpg',
    alt: 'Fachada borgoña de LUMINA en una casa colonial blanca de Usaquén, sobre calle empedrada',
  },
  {
    id: 'parque-93',
    name: 'Tienda LUMINA Parque 93',
    city: 'Bogotá, Colombia',
    address: null,
    phone: '1234567892',
    hours: '10:00 a. m. – 7:00 p. m.',
    image: '/stores/parque-93.jpg',
    alt: 'Fachada borgoña de LUMINA con grandes ventanales en un edificio de ladrillo cerca del Parque de la 93',
  },
];
