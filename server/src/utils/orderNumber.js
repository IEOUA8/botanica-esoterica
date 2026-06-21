function createOrderNumber() {
  const date = new Date().toISOString().slice(0, 10).replaceAll('-', '');
  const suffix = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `BEI-${date}-${suffix}`;
}

module.exports = { createOrderNumber };
