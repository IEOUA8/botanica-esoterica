const PAYMENT_METHODS = ['Transferencia bancaria', 'Nequi', 'Daviplata', 'Pago contra entrega', 'WhatsApp para confirmar'];
const ORDER_STATUSES = ['Nuevo', 'Confirmado', 'En preparación', 'Despachado', 'Entregado', 'Cancelado'];
const PAYMENT_STATUSES = ['Pendiente', 'Pagado', 'Rechazado', 'Reembolsado'];
const SHIPPING_STATUSES = ['Pendiente de despacho', 'En preparación', 'Despachado', 'Entregado'];

const ORDER_TRANSITIONS = Object.freeze({
  Nuevo: ['Confirmado', 'Cancelado'],
  Confirmado: ['En preparación', 'Cancelado'],
  'En preparación': ['Despachado', 'Cancelado'],
  Despachado: ['Entregado'],
  Entregado: [],
  Cancelado: [],
});

module.exports = {
  PAYMENT_METHODS,
  ORDER_STATUSES,
  PAYMENT_STATUSES,
  SHIPPING_STATUSES,
  ORDER_TRANSITIONS,
};

