export interface Variant {
  id: string;
  label: string;
  color: string;
  price: number;
  mrp: number;
  available: boolean;
}
export interface Product {
  id: string;
  name: string;
  brand: string;
  image: string;
  description: string;
  specs: Record<string, string>;
  variants: Variant[];
  tenures: number[];
}
export interface Quote {
  months: number;
  monthly: number;
  finalPayment: number;
  total: number;
  interest: number;
  fees: number;
}
export const money = (paise: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: paise % 100 ? 2 : 0,
  }).format(paise / 100);
// All monetary values are integer paise. The last installment reconciles rounding.
export function makeQuote(price: number, months: number): Quote {
  if (
    !Number.isSafeInteger(price) ||
    price <= 0 ||
    !Number.isInteger(months) ||
    months <= 0
  )
    throw new Error('Invalid EMI inputs');
  const monthly = Math.floor(price / months);
  return {
    months,
    monthly,
    finalPayment: price - monthly * (months - 1),
    total: price,
    interest: 0,
    fees: 0,
  };
}
export async function getProducts(signal?: AbortSignal): Promise<Product[]> {
  const response = await fetch('/api/products', { signal });
  if (!response.ok)
    throw new Error('We couldn’t load the products. Please try again.');
  const body = (await response.json()) as { products?: unknown };
  if (!Array.isArray(body.products) || !body.products.every(isProduct))
    throw new Error('Product information is unavailable.');
  return body.products;
}
export async function submitSelection(
  productId: string,
  variantId: string,
  months: number,
) {
  const response = await fetch('/api/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productId, variantId, months }),
  });
  const body = (await response.json()) as { error?: string };
  if (!response.ok)
    throw new Error(
      body.error || 'Unable to prepare your plan. Please try again.',
    );
  return body as {
    reference: string;
    product: string;
    variant: string;
    quote: Quote;
    demo: boolean;
  };
}

function isProduct(value: unknown): value is Product {
  if (!value || typeof value !== 'object') return false;
  const p = value as Product;
  return (
    typeof p.id === 'string' &&
    typeof p.name === 'string' &&
    typeof p.brand === 'string' &&
    typeof p.image === 'string' &&
    typeof p.description === 'string' &&
    !!p.specs &&
    typeof p.specs === 'object' &&
    Object.values(p.specs).every((v) => typeof v === 'string') &&
    Array.isArray(p.variants) &&
    p.variants.length > 0 &&
    p.variants.some((v) => v.available) &&
    p.variants.every(
      (v) =>
        !!v &&
        typeof v.id === 'string' &&
        typeof v.label === 'string' &&
        typeof v.color === 'string' &&
        Number.isSafeInteger(v.price) &&
        v.price > 0 &&
        Number.isSafeInteger(v.mrp) &&
        v.mrp >= v.price &&
        typeof v.available === 'boolean',
    ) &&
    Array.isArray(p.tenures) &&
    p.tenures.length > 0 &&
    p.tenures.every((m) => Number.isInteger(m) && m > 0)
  );
}
