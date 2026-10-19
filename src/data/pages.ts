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
  /** Lista corta opcional (plazos, condiciones, pasos). */
  items?: string[];
  /** true = contenido que LUMINA debe redactar o confirmar. */
  pending?: boolean;
  /** true = dato de ejemplo inventado, para reemplazar por la política real (no se muestra en la página). */
  fictional?: boolean;
}

export interface InfoPage {
  slug: string;
  eyebrow: string;
  title: string;
  intro: string;
  sections: PageSection[];
  legalReview?: boolean;
  /** Reemplaza el aviso genérico de revisión legal. */
  reviewNote?: string;
  /** Bloque especial que la página inserta (p. ej. la guía de tallas). */
  embed?: 'size-guide' | 'faq';
}

export const infoPages: InfoPage[] = [
  {
    slug: 'envios-y-devoluciones',
    eyebrow: 'Ayuda',
    title: 'Envíos y devoluciones',
    intro: 'Enviamos gratis a toda Colombia y tienes 30 días para cambiar tu montura. Aquí está lo esencial.',
    sections: [
      {
        heading: 'Envíos',
        paragraphs: ['Envío gratis en todos los pedidos. Despachamos el mismo día hábil si pagas antes de la 1:00 p. m. y te enviamos el número de guía por correo.'],
        items: [
          'Bogotá: 1 a 2 días hábiles.',
          'Medellín, Cali, Barranquilla y otras ciudades principales: 2 a 4 días hábiles.',
          'Resto del país: 4 a 7 días hábiles.',
        ],
        fictional: true,
      },
      {
        heading: 'Recoger en tienda',
        paragraphs: [
          'Gratis en nuestras tres tiendas de Bogotá. Tu pedido estará listo en 1 día hábil; te avisamos por correo. Lleva tu documento de identidad.',
        ],
        fictional: true,
      },
      {
        heading: 'Cambios',
        paragraphs: ['Tienes 30 días calendario desde la entrega para cambiar tu montura por otro modelo o color, sin costo.'],
        items: ['Sin señales de uso.', 'Con su estuche, paño y empaque original.', 'Con el número de pedido.'],
        fictional: true,
      },
      {
        heading: 'Derecho de retracto',
        paragraphs: [
          'Si cambias de opinión, tienes 5 días hábiles desde la entrega para retractarte (Ley 1480 de 2011, art. 47). Devuelve el producto en las mismas condiciones en que lo recibiste; el costo del envío de vuelta corre por tu cuenta.',
          'Te devolvemos el dinero en máximo 15 días calendario, al mismo medio de pago (Ley 2439 de 2024).',
        ],
      },
      {
        heading: 'Reversión del pago',
        paragraphs: [
          'Si pagaste con un medio electrónico y hubo fraude, una operación no solicitada, o el producto no llegó, no corresponde a lo pedido o tiene un defecto, puedes pedir que se reverse el pago (Ley 1480, art. 51).',
          'Avísanos a nosotros y a tu banco dentro de los 5 días hábiles siguientes. La reversión se hace efectiva en máximo 15 días hábiles (Decreto 587 de 2016).',
        ],
      },
      {
        heading: 'Cómo solicitarlo',
        paragraphs: [],
        items: [
          'Escríbenos desde Mi cuenta › Mis pedidos o en la página de Contacto, con tu número de pedido.',
          'Te enviamos una guía de envío prepagada para cambios (en retracto, el envío lo pagas tú).',
          'Revisamos el producto en 2 días hábiles y despachamos tu cambio o tramitamos el reembolso.',
        ],
        fictional: true,
      },
    ],
  },
  {
    slug: 'garantia',
    eyebrow: 'Ayuda',
    title: 'Garantía',
    intro: 'Todas nuestras monturas y gafas de sol tienen 1 año de garantía desde la entrega. Aquí está lo esencial.',
    sections: [
      {
        heading: 'Plazo',
        paragraphs: [
          '1 año contado desde que recibes tu pedido. Es el término que fija la ley para productos nuevos cuando no se indica otro (Ley 1480 de 2011, art. 8).',
        ],
      },
      {
        heading: 'Qué cubre',
        paragraphs: ['Defectos de fabricación que aparezcan con un uso normal, por ejemplo:'],
        items: [
          'Bisagras o tornillos que se rompen o aflojan sin un golpe.',
          'Uniones, plaquetas o terminales que se sueltan.',
          'Acetato que se deforma o cambia de color sin una causa externa.',
          'Lentes de gafas de sol que se desprenden o pierden su tratamiento por defecto.',
        ],
        fictional: true,
      },
      {
        heading: 'Qué no cubre',
        paragraphs: ['Daños causados por un uso indebido o por no seguir las indicaciones de cuidado (Ley 1480, art. 16), como:'],
        items: [
          'Golpes, caídas o aplastamiento.',
          'Calor extremo, por ejemplo dejarlas en un carro al sol.',
          'Rayones por el uso diario.',
          'Arreglos hechos por terceros, pérdida o robo.',
        ],
        fictional: true,
      },
      {
        heading: 'Qué hacemos',
        paragraphs: [
          'Reparamos tu montura sin costo. Si la falla se repite, eliges entre una nueva reparación, el cambio por otra igual o la devolución de tu dinero (Ley 1480, art. 11).',
        ],
      },
      {
        heading: 'Cómo solicitarla',
        paragraphs: [],
        items: [
          'Lleva tus gafas a cualquiera de nuestras tres tiendas, o escríbenos desde Mi cuenta › Mis pedidos o en Contacto, con tu número de pedido y fotos del daño.',
          'Si no puedes ir a una tienda, te enviamos una guía de envío prepagada.',
          'Te respondemos en 2 días hábiles (la ley fija un máximo de 15).',
        ],
        fictional: true,
      },
      {
        heading: 'Ajustes gratis, siempre',
        paragraphs: [
          'Aunque tu garantía haya terminado, en nuestras tiendas ajustamos tus monturas LUMINA y cambiamos plaquetas o tornillos sin costo.',
        ],
        fictional: true,
      },
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
    intro: 'Las reglas de compra en la tienda online de LUMINA, en pocas palabras. Última actualización: 16 de octubre de 2026.',
    sections: [
      {
        heading: 'Quiénes somos',
        paragraphs: [
          'LUMINA Óptica S.A.S. es una óptica con sede en Bogotá, Colombia. Puedes contactarnos desde la página de Contacto o en cualquiera de nuestras tres tiendas.',
        ],
        fictional: true,
      },
      {
        heading: 'Uso de la tienda',
        paragraphs: [
          'Al comprar aceptas estos términos. Para comprar debes ser mayor de edad y darnos datos reales y completos, porque los usamos para facturar y entregar tu pedido.',
        ],
        fictional: true,
      },
      {
        heading: 'Productos y precios',
        paragraphs: [],
        items: [
          'Vendemos monturas y gafas de sol. Por ahora no vendemos lentes formuladas.',
          'Los precios están en pesos colombianos (COP) e incluyen IVA.',
          'El color puede verse un poco distinto según tu pantalla.',
          'Si un precio aparece con un error evidente, te avisamos antes de despachar y puedes cancelar con reembolso total.',
        ],
        fictional: true,
      },
      {
        heading: 'Cómo se confirma tu compra',
        paragraphs: [
          'Antes de pagar ves un resumen con los productos, el precio total y el envío. Tu pedido queda confirmado cuando el pago es aprobado; en ese momento te enviamos un correo con tu número de pedido.',
        ],
        fictional: true,
      },
      {
        heading: 'Medios de pago',
        paragraphs: [
          'Pagas con Wompi: tarjeta débito o crédito, PSE, Nequi o Botón Bancolombia. LUMINA no ve ni guarda los datos de tu tarjeta.',
        ],
      },
      {
        heading: 'Envío y entrega',
        paragraphs: [
          'Los plazos están en Envíos y devoluciones. En ningún caso superan los 30 días calendario; si no recibes tu pedido a tiempo, puedes cancelarlo y te devolvemos el dinero (Ley 1480 de 2011, art. 50).',
        ],
      },
      {
        heading: 'Retracto, cambios y garantía',
        paragraphs: [
          'Tienes 5 días hábiles desde la entrega para retractarte, 30 días para cambios y 1 año de garantía. Los detalles están en Envíos y devoluciones y en Garantía.',
        ],
      },
      {
        heading: 'Datos personales',
        paragraphs: [
          'Tratamos tus datos conforme a la Ley 1581 de 2012. Consulta nuestra Política de tratamiento de datos personales.',
        ],
      },
      {
        heading: 'Propiedad intelectual',
        paragraphs: [
          'La marca LUMINA, su logo, las fotos y los textos de esta tienda pertenecen a LUMINA. No puedes usarlos sin nuestra autorización.',
        ],
        fictional: true,
      },
      {
        heading: 'Quejas y reclamos',
        paragraphs: [
          'Escríbenos desde Contacto. Te respondemos en máximo 15 días hábiles (Ley 1480, art. 58). Si no quedas conforme, puedes acudir a la Superintendencia de Industria y Comercio.',
          'Estos términos se rigen por la ley colombiana. Si los actualizamos, aplica la versión vigente el día de tu compra.',
        ],
      },
    ],
  },
  {
    slug: 'tratamiento-de-datos',
    eyebrow: 'Legal',
    title: 'Política de tratamiento de datos personales',
    intro: 'Qué datos tuyos usamos, para qué y cómo puedes controlarlos, conforme a la Ley 1581 de 2012. Vigente desde el 16 de octubre de 2026.',
    sections: [
      {
        heading: 'Responsable',
        paragraphs: [
          'LUMINA Óptica S.A.S., con sede en Bogotá, Colombia, es responsable de tus datos. Para cualquier solicitud, escríbenos desde la página de Contacto.',
        ],
        fictional: true,
      },
      {
        heading: 'Qué datos usamos y para qué',
        paragraphs: [],
        items: [
          'Compras: nombre, documento, correo, celular y dirección, para procesar, facturar y entregar tu pedido.',
          'Mi cuenta: correo, nombre, direcciones y favoritos, para gestionar tu cuenta y tus pedidos.',
          'Examen visual: nombre, celular, correo y, si quieres, el motivo de la cita, para agendarla y recordártela.',
          'Boletín: tu correo, para enviarte novedades solo si te suscribes. Puedes darte de baja cuando quieras.',
        ],
        fictional: true,
      },
      {
        heading: 'Datos de salud',
        paragraphs: [
          'El motivo de tu examen visual es un dato sensible (Ley 1581, arts. 5 y 6). Responderlo es opcional y solo lo usamos para preparar tu cita.',
        ],
      },
      {
        heading: 'Con quién los compartimos',
        paragraphs: [
          'Solo con quienes nos ayudan a atenderte: Wompi para los pagos, la transportadora para las entregas y nuestro proveedor de alojamiento web. Nunca vendemos tus datos.',
        ],
        fictional: true,
      },
      {
        heading: 'Cuánto tiempo los guardamos',
        paragraphs: [
          'Mientras tengas una cuenta o una compra activa con nosotros, y después solo el tiempo que exijan las normas contables y tributarias.',
        ],
        fictional: true,
      },
      {
        heading: 'Tus derechos',
        paragraphs: ['Como titular de tus datos puedes (Ley 1581, art. 8):'],
        items: [
          'Conocerlos, actualizarlos y corregirlos.',
          'Pedir prueba de la autorización que nos diste.',
          'Saber cómo los hemos usado.',
          'Revocar tu autorización o pedir que los borremos, salvo que la ley nos obligue a conservarlos.',
          'Consultarlos gratis.',
          'Presentar quejas ante la Superintendencia de Industria y Comercio.',
        ],
      },
      {
        heading: 'Cómo ejercerlos',
        paragraphs: [
          'Escríbenos desde Contacto. Respondemos las consultas en máximo 10 días hábiles y los reclamos (corregir, borrar o reportar un mal uso) en máximo 15 días hábiles (Ley 1581, arts. 14 y 15).',
        ],
      },
      {
        heading: 'Seguridad',
        paragraphs: [
          'Protegemos tus datos con medidas técnicas y administrativas. Los datos de tu tarjeta los procesa Wompi: LUMINA no los ve ni los guarda.',
        ],
      },
      {
        heading: 'Cambios a esta política',
        paragraphs: ['Si la actualizamos, lo publicaremos en esta página y te avisaremos por correo cuando el cambio sea importante.'],
        fictional: true,
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
    intro: 'Tres números, la forma de tu rostro y unas pocas señales: todo lo que necesitas para elegir la montura que mejor te queda.',
    sections: [],
    embed: 'size-guide',
  },
  {
    slug: 'cuidado',
    eyebrow: 'Guía',
    title: 'Cuidado de tus gafas',
    intro: 'Pequeños gestos que alargan la vida de tus monturas.',
    // Mismo contenido que el artículo del Diario "Cuidar tus gafas, paso a paso" (fuentes: Which?, NBC Select).
    sections: [
      {
        heading: 'La rutina de limpieza',
        paragraphs: ['La mayoría de los rayones no vienen de una caída, sino de limpiar mal las lentes día tras día.'],
        items: [
          'Enjuaga primero con agua tibia, nunca caliente: el polvo y la arena son los que rayan.',
          'Si hace falta, usa un limpiador de lentes sin alcohol o muy poco jabón suave, y frota con los dedos.',
          'Enjuaga de nuevo y sacude el exceso de agua.',
          'Seca con un paño de microfibra limpio, con movimientos suaves.',
        ],
      },
      {
        heading: 'Lo que es mejor evitar',
        paragraphs: [],
        items: [
          'Papel higiénico, servilletas o toallas de papel: tienen fibras que pueden rayar.',
          'La camiseta o el borde de la ropa: arrastran polvo.',
          'Limpiavidrios y productos de la casa: pueden dañar los recubrimientos de las lentes.',
        ],
      },
      {
        heading: 'Montura y estuche',
        paragraphs: [
          'Limpia también las plaquetas y las bisagras, donde se acumula grasa. Cuando no las uses, guárdalas en su estuche y nunca las dejes boca abajo sobre las lentes ni en el tablero del carro al sol.',
        ],
      },
    ],
  },
  {
    slug: 'contacto',
    eyebrow: 'Ayuda',
    title: 'Contacto',
    intro: '¿Tienes dudas sobre una montura o un pedido? Te ayudamos.',
    sections: [
      {
        heading: 'En nuestras tiendas',
        paragraphs: ['Te atendemos en persona en nuestras 3 tiendas de Bogotá: Quinta Camacho, Usaquén y Parque 93.'],
        items: ['Teléfono: 1234567892', 'Horario: 10:00 a. m. – 7:00 p. m.'],
      },
      {
        heading: 'Examen visual',
        paragraphs: ['Puedes agendar tu examen visual desde la página Examen visual, eligiendo la tienda, el día y la hora.'],
      },
      { heading: 'Correo y WhatsApp', paragraphs: ['Pendientes de confirmar por LUMINA.'], pending: true },
    ],
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
  {
    q: '¿Cuánto cuesta el envío y cuánto tarda?',
    a: 'Es gratis a toda Colombia: 1 a 2 días hábiles en Bogotá, 2 a 4 en ciudades principales y 4 a 7 en el resto del país.',
  },
  {
    q: '¿Puedo devolver mi compra?',
    a: 'Sí. Tienes 5 días hábiles desde la entrega para retractarte (Ley 1480) y 30 días para cambiar tu montura. Detalles en Envíos y devoluciones.',
  },
];
