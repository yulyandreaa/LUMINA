/*
 * Páginas informativas y legales.
 *
 * ⚠️ NO son textos legales definitivos. Cada página muestra la ESTRUCTURA que debe cubrir
 * y marca como "pendiente" lo que LUMINA debe definir. Las referencias normativas
 * (Ley 1480 de 2011, Ley 1581 de 2012) deben revisarse con asesoría legal antes de publicar.
 */

export interface PageSection {
  heading: string;
  paragraphs: string[];
  /** true = contenido que LUMINA debe redactar o confirmar. */
  pending?: boolean;
}

export interface InfoPage {
  slug: string;
  eyebrow: string;
  title: string;
  intro: string;
  sections: PageSection[];
  legalReview?: boolean;
  /** Bloque especial que la página inserta (p. ej. la guía de tallas). */
  embed?: 'size-guide' | 'faq';
}

const P = 'Pendiente de redactar por LUMINA.';

export const infoPages: InfoPage[] = [
  {
    slug: 'nosotros',
    eyebrow: 'Nuestra historia',
    title: 'Una nueva perspectiva.',
    intro: 'LUMINA es una óptica contemporánea: diseño editorial, cercanía y cuidado por cómo ves el mundo.',
    sections: [
      {
        heading: 'Ver bien también es sentir bien',
        paragraphs: [
          'Creemos que unas gafas son mucho más que un accesorio: son la forma en la que miras y te miran.',
          'Historia, equipo y origen de la marca: pendientes de redactar por LUMINA.',
        ],
        pending: true,
      },
    ],
  },
  {
    slug: 'envios-y-devoluciones',
    eyebrow: 'Ayuda',
    title: 'Envíos y devoluciones',
    intro: 'Condiciones de entrega en Colombia y cómo devolver un producto.',
    legalReview: true,
    sections: [
      {
        heading: 'Envíos',
        paragraphs: ['Cobertura, transportadora, plazos de entrega y costo del envío: pendientes de definir.'],
        pending: true,
      },
      {
        heading: 'Derecho de retracto',
        paragraphs: [
          'En ventas a distancia, el Estatuto del Consumidor (Ley 1480 de 2011, art. 47) reconoce al comprador el derecho a retractarse dentro de los cinco (5) días hábiles siguientes a la entrega.',
          'Procedimiento, canal de solicitud y plazos de reembolso de LUMINA: pendientes de definir y validar legalmente.',
        ],
        pending: true,
      },
      {
        heading: 'Reversión del pago',
        paragraphs: [
          'La Ley 1480 de 2011 (art. 51) regula la reversión del pago en compras electrónicas en determinados casos (fraude, operación no solicitada, producto no recibido o defectuoso, entre otros).',
          'Canal y procedimiento para solicitarla: pendientes de definir.',
        ],
        pending: true,
      },
      { heading: 'Cambios', paragraphs: [P], pending: true },
    ],
  },
  {
    slug: 'garantia',
    eyebrow: 'Ayuda',
    title: 'Garantía',
    intro: 'Qué cubre la garantía de tus monturas y cómo solicitarla.',
    legalReview: true,
    sections: [
      {
        heading: 'Garantía legal',
        paragraphs: [
          'Todos los productos cuentan con la garantía legal establecida en la Ley 1480 de 2011.',
          'Plazo, cobertura y exclusiones de LUMINA: pendientes de definir.',
        ],
        pending: true,
      },
      { heading: 'Cómo solicitarla', paragraphs: [P], pending: true },
    ],
  },
  {
    slug: 'preguntas-frecuentes',
    eyebrow: 'Ayuda',
    title: 'Preguntas frecuentes',
    intro: 'Lo que más nos preguntan antes de comprar.',
    sections: [],
    embed: 'faq',
  },
  {
    slug: 'terminos',
    eyebrow: 'Legal',
    title: 'Términos y condiciones',
    intro: 'Condiciones que rigen el uso de la tienda y las compras realizadas en ella.',
    legalReview: true,
    sections: [
      'Identificación del vendedor (razón social, NIT, domicilio, contacto)',
      'Proceso de compra y aceptación del pedido',
      'Precios, impuestos y medios de pago',
      'Envíos, retracto, cambios y garantía',
      'Propiedad intelectual',
      'Ley aplicable y resolución de conflictos',
    ].map((heading) => ({ heading, paragraphs: [P], pending: true })),
  },
  {
    slug: 'tratamiento-de-datos',
    eyebrow: 'Legal',
    title: 'Política de tratamiento de datos personales',
    intro: 'Cómo LUMINA recoge, usa y protege tus datos, conforme a la Ley 1581 de 2012 y sus decretos reglamentarios.',
    legalReview: true,
    sections: [
      { heading: 'Responsable del tratamiento', paragraphs: ['Razón social, NIT, dirección y correo de contacto: pendientes.'], pending: true },
      {
        heading: 'Datos que recogemos y para qué',
        paragraphs: [
          'En el checkout solicitamos nombre, documento, correo, teléfono y dirección para procesar y entregar tu pedido.',
          'Finalidades completas (incluido el envío de novedades si te suscribes): pendientes de redactar.',
        ],
        pending: true,
      },
      {
        heading: 'Tus derechos',
        paragraphs: [
          'Como titular puedes conocer, actualizar, rectificar y solicitar la supresión de tus datos, así como revocar la autorización otorgada.',
          'Canal y plazos de atención de solicitudes: pendientes de definir.',
        ],
        pending: true,
      },
      {
        heading: 'Pagos',
        paragraphs: ['Los pagos se procesan en la pasarela de Wompi. LUMINA no recibe ni almacena los datos de tu tarjeta.'],
      },
    ],
  },
  {
    slug: 'privacidad',
    eyebrow: 'Legal',
    title: 'Privacidad y cookies',
    intro: 'Qué guardamos en tu navegador.',
    legalReview: true,
    sections: [
      {
        heading: 'Almacenamiento esencial',
        paragraphs: [
          'Guardamos tu cesta y tu elección sobre cookies en el almacenamiento local de tu navegador. Es necesario para que la tienda funcione y no se comparte con terceros.',
        ],
      },
      {
        heading: 'Analítica y publicidad',
        paragraphs: ['Por ahora la tienda no usa cookies de analítica ni de publicidad. Si se añaden, se pedirá tu consentimiento.'],
      },
    ],
  },
  {
    slug: 'talla-y-ajuste',
    eyebrow: 'Guía',
    title: 'Talla y ajuste',
    intro: 'Encuentra la montura que mejor se adapta a tu rostro.',
    sections: [],
    embed: 'size-guide',
  },
  {
    slug: 'cuidado',
    eyebrow: 'Guía',
    title: 'Cuidado de tus gafas',
    intro: 'Pequeños gestos que alargan la vida de tus monturas.',
    sections: [{ heading: 'Limpieza, estuche y ajustes', paragraphs: [P], pending: true }],
  },
  {
    slug: 'examen-visual',
    eyebrow: 'Servicios',
    title: 'Examen visual',
    intro: 'Cuidamos tu forma de ver.',
    sections: [
      {
        heading: 'Cómo agendar',
        paragraphs: ['Disponibilidad del servicio, profesionales, precio y canal de reserva: pendientes de definir.'],
        pending: true,
      },
    ],
  },
  {
    slug: 'contacto',
    eyebrow: 'Ayuda',
    title: 'Contacto',
    intro: '¿Tienes dudas sobre una montura o un pedido? Escríbenos.',
    sections: [{ heading: 'Canales de atención', paragraphs: ['Correo, WhatsApp y horario de atención: pendientes.'], pending: true }],
  },
  {
    slug: 'diario',
    eyebrow: 'Diario LUMINA',
    title: 'Historias para ver distinto',
    intro: 'Artículos sobre diseño, color y cuidado visual.',
    sections: [{ heading: 'Próximamente', paragraphs: ['El blog se publicará más adelante.'], pending: true }],
  },
];

export const faqs: { q: string; a: string }[] = [
  {
    q: '¿Venden lentes formulados?',
    a: 'Por ahora no: la tienda online vende monturas y gafas de sol. Las lentes graduadas llegarán en una etapa posterior.',
  },
  {
    q: '¿Cómo sé qué talla elegir?',
    a: 'Compara el ancho de lente con unas gafas que ya te queden bien. En la guía de talla y ajuste tienes las recomendaciones por tipo de rostro.',
  },
  {
    q: '¿Qué medios de pago aceptan?',
    a: 'Los pagos se procesan con Wompi: tarjeta, PSE, Nequi y botón Bancolombia. LUMINA no ve ni guarda los datos de tu tarjeta.',
  },
  { q: '¿Cuánto cuesta el envío y cuánto tarda?', a: 'Pendiente de definir por LUMINA.' },
  { q: '¿Puedo devolver mi compra?', a: 'Sí. Consulta la página de envíos y devoluciones (en preparación).' },
];
