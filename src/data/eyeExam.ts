/*
 * Contenido de la página de servicio "Examen visual".
 * Confirmado por LUMINA (2026-10-14): se hace en las 3 tiendas, se agenda con un formulario web
 * y es gratis con la compra de una montura. Valor sin compra y duración: PENDIENTES.
 * Los textos de "qué incluye" y "cómo funciona" son una PROPUESTA para que LUMINA la revise.
 */
export const examIncludes: { title: string; text: string }[] = [
  { title: 'Agudeza visual', text: 'Medimos qué tan bien ves de lejos y de cerca, con cada ojo y con ambos.' },
  { title: 'Tu fórmula', text: 'Revisamos tu graduación actual y, si cambió, te entregamos la nueva fórmula.' },
  { title: 'Salud visual', text: 'Una revisión general de tus ojos y una conversación sobre tus hábitos de uso de pantallas.' },
  { title: 'Asesoría de montura', text: 'Te ayudamos a elegir la forma y la talla que mejor van con tu rostro.' },
];

export const examSteps: { title: string; text: string }[] = [
  { title: 'Agenda', text: 'Elige la tienda, el día y la hora que te queden mejor.' },
  { title: 'Visítanos', text: 'Llega unos minutos antes con tus gafas actuales, si usas.' },
  { title: 'Ve distinto', text: 'Recibe tu fórmula y pruébate las monturas con asesoría.' },
];

export const examFaqs: { q: string; a: string }[] = [
  {
    q: '¿Cuánto cuesta el examen?',
    a: 'Es sin costo si compras una montura LUMINA. El valor del examen sin compra está pendiente de definir.',
  },
  { q: '¿Cuánto dura?', a: 'Pendiente de confirmar por LUMINA.' },
  {
    q: '¿Qué debo llevar?',
    a: 'Tus gafas actuales y tu fórmula anterior, si las tienes. Si usas lentes de contacto, cuéntanoslo al agendar.',
  },
  {
    q: '¿Puedo comprar lentes formulados en LUMINA?',
    a: 'Por ahora la tienda online vende monturas y gafas de sol. Las lentes graduadas llegarán en una etapa posterior.',
  },
  { q: '¿Puedo cambiar o cancelar mi cita?', a: 'Política de cambios y cancelaciones: pendiente de definir por LUMINA.' },
];
