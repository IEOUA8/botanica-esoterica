const { createOrderNumber } = require('../../utils/orderNumber');

describe('createOrderNumber', () => {
  it('matches the expected format BEI-YYYYMMDD-XXXXX', () => {
    const num = createOrderNumber();
    expect(num).toMatch(/^BEI-\d{8}-[A-Z0-9]{5}$/);
  });

  it('contains todays date', () => {
    const num = createOrderNumber();
    const datePart = num.split('-')[1];
    const today = new Date().toISOString().slice(0, 10).replaceAll('-', '');
    expect(datePart).toBe(today);
  });

  it('generates unique numbers across multiple calls', () => {
    const numbers = new Set(Array.from({ length: 100 }, createOrderNumber));
    expect(numbers.size).toBeGreaterThan(90);
  });
});
