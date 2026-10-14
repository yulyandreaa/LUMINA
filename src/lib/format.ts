/* Formato de precios en pesos colombianos: "$ 420.000" (sin decimales). */
const cop = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});

export const formatPrice = (amount: number) => cop.format(amount);
