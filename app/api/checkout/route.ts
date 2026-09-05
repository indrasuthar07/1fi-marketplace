import { products } from '@/lib/catalog';
import { makeQuote } from '@/lib/marketplace';
export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body || typeof body !== 'object')
      return Response.json({ error: 'Invalid selection.' }, { status: 400 });
    const { productId, variantId, months } = body as Record<string, unknown>;
    const product = products.find((p) => p.id === productId);
    const variant = product?.variants.find((v) => v.id === variantId);
    if (
      !product ||
      !variant ||
      !variant.available ||
      typeof months !== 'number' ||
      !product.tenures.includes(months)
    )
      return Response.json(
        { error: 'Please choose an available product and a valid EMI plan.' },
        { status: 400 },
      );
    return Response.json({
      reference: `DEMO-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
      product: product.name,
      variant: `${variant.label} · ${variant.color}`,
      quote: makeQuote(variant.price, months),
      demo: true,
    });
  } catch {
    return Response.json(
      { error: 'Invalid selection. Please try again.' },
      { status: 400 },
    );
  }
}
