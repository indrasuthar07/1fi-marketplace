import assert from 'node:assert/strict';
const base = process.env.TEST_BASE_URL || 'http://localhost:3000';
const catalog = await fetch(`${base}/api/products`).then((r) => r.json());
assert.equal(catalog.demo, true);
assert.equal(catalog.products.length, 4);
let checked = 0;
for (const product of catalog.products) {
  const image = await fetch(`${base}${product.image}`);
  assert.equal(image.status, 200, product.image);
  assert.match(image.headers.get('content-type'), /image/);
  for (const variant of product.variants)
    for (const months of product.tenures) {
      const response = await fetch(`${base}/api/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          variantId: variant.id,
          months,
          price: 1,
        }),
      });
      if (!variant.available) {
        assert.equal(response.status, 400);
        continue;
      }
      assert.equal(response.status, 200);
      const result = await response.json();
      assert.equal(
        result.quote.total,
        variant.price,
        'server must ignore client-supplied prices',
      );
      assert.equal(
        result.quote.monthly * (months - 1) + result.quote.finalPayment,
        variant.price,
      );
      assert.equal(result.quote.interest, 0);
      assert.equal(result.quote.fees, 0);
      assert.equal(result.quote.months, months);
      assert.equal(result.demo, true);
      checked++;
    }
}
for (const body of [
  null,
  {},
  { productId: 'bad', variantId: 'bad', months: 12 },
  { productId: 'iphone-17', variantId: 'ip256', months: 13 },
  { productId: 'iphone-17', variantId: 'ip256', months: '12' },
]) {
  const response = await fetch(`${base}/api/checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  assert.equal(response.status, 400);
}
const invalid = await fetch(`${base}/api/checkout`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: 'invalid json',
});
assert.equal(invalid.status, 400);
for (const path of ['/', '/shop', '/images/shop-banner.webp'])
  assert.equal((await fetch(base + path)).status, 200);
console.log(
  `PASS: ${checked} valid EMI combinations, unavailable variants, malformed input, tampered prices, product images and Shop routes.`,
);
