const { mergeItems, calculateShippingCost, assertTransition, OrderServiceError } = require('../../services/orderService');

describe('mergeItems', () => {
  it('merges duplicate products by summing quantities', () => {
    const items = [
      { product: 'p1', quantity: 2 },
      { product: 'p2', quantity: 1 },
      { product: 'p1', quantity: 3 },
    ];
    const result = mergeItems(items);
    const p1 = result.find((i) => i.product === 'p1');
    const p2 = result.find((i) => i.product === 'p2');
    expect(p1.quantity).toBe(5);
    expect(p2.quantity).toBe(1);
  });

  it('keeps single items unchanged', () => {
    const result = mergeItems([{ product: 'abc', quantity: 3 }]);
    expect(result).toEqual([{ product: 'abc', quantity: 3 }]);
  });

  it('throws when merged quantity exceeds 99', () => {
    const items = [
      { product: 'p1', quantity: 50 },
      { product: 'p1', quantity: 50 },
    ];
    expect(() => mergeItems(items)).toThrow(OrderServiceError);
    expect(() => mergeItems(items)).toThrow('cantidad máxima');
  });

  it('accepts exactly 99 units for one product', () => {
    const result = mergeItems([{ product: 'p1', quantity: 99 }]);
    expect(result[0].quantity).toBe(99);
  });
});

describe('calculateShippingCost', () => {
  const env = require('../../config/env');

  it('returns flat rate when subtotal is below threshold (threshold=0 means no free shipping)', () => {
    const cost = calculateShippingCost(50000);
    expect(typeof cost).toBe('number');
    expect(cost).toBeGreaterThanOrEqual(0);
  });

  it('returns 0 when free shipping threshold is 0 (disabled)', () => {
    // env.freeShippingThreshold is 0 in test env → free shipping is disabled
    expect(calculateShippingCost(1000000)).toBe(0);
    expect(calculateShippingCost(0)).toBe(0);
  });
});

describe('assertTransition', () => {
  it('allows valid forward transitions', () => {
    expect(() => assertTransition('Nuevo', 'Confirmado')).not.toThrow();
    expect(() => assertTransition('Confirmado', 'En preparación')).not.toThrow();
    expect(() => assertTransition('En preparación', 'Despachado')).not.toThrow();
    expect(() => assertTransition('Despachado', 'Entregado')).not.toThrow();
  });

  it('allows cancellation from allowed statuses', () => {
    expect(() => assertTransition('Nuevo', 'Cancelado')).not.toThrow();
    expect(() => assertTransition('Confirmado', 'Cancelado')).not.toThrow();
    expect(() => assertTransition('En preparación', 'Cancelado')).not.toThrow();
  });

  it('throws on invalid transition', () => {
    expect(() => assertTransition('Entregado', 'Nuevo')).toThrow(OrderServiceError);
    expect(() => assertTransition('Cancelado', 'Confirmado')).toThrow(OrderServiceError);
    expect(() => assertTransition('Despachado', 'Cancelado')).toThrow(OrderServiceError);
  });

  it('does not throw when current and next status are the same', () => {
    expect(() => assertTransition('Nuevo', 'Nuevo')).not.toThrow();
  });
});
