'use client';
import { useEffect } from 'react';
import { makeQuote, type Product } from '@/lib/marketplace';
type Registry = {
  registerTool: (
    tool: {
      name: string;
      description: string;
      inputSchema: object;
      annotations: object;
      execute: (input: unknown) => unknown;
    },
    options: { signal: AbortSignal },
  ) => void | Promise<void>;
};
export function useMarketplaceTools(products: Product[]) {
  useEffect(() => {
    const context = (document as Document & { modelContext?: Registry })
      .modelContext;
    if (!context?.registerTool || !products.length) return;
    const lifecycle = new AbortController();
    try {
      Promise.resolve(
        context.registerTool(
          {
            name: 'compare_marketplace_plans',
            description:
              'Read the demo catalog and compare EMI plans for an available product variant. This does not select a plan or create an order.',
            inputSchema: {
              type: 'object',
              properties: {
                productId: { type: 'string' },
                variantId: { type: 'string' },
              },
              required: ['productId', 'variantId'],
              additionalProperties: false,
            },
            annotations: { readOnlyHint: true, untrustedContentHint: false },
            execute(input: unknown) {
              if (!input || typeof input !== 'object')
                throw new Error('Product and variant are required');
              const { productId, variantId } = input as Record<string, unknown>;
              const product = products.find((p) => p.id === productId),
                variant = product?.variants.find(
                  (v) => v.id === variantId && v.available,
                );
              if (!product || !variant)
                throw new Error('Available product variant not found');
              return {
                product: product.name,
                variant: variant.label,
                demo: true,
                currency: 'INR',
                unit: 'paise',
                plans: product.tenures.map((m) => makeQuote(variant.price, m)),
              };
            },
          },
          { signal: lifecycle.signal },
        ),
      ).catch(() => {});
    } catch {
      /* Optional browser capability. */
    }
    return () => lifecycle.abort();
  }, [products]);
}
