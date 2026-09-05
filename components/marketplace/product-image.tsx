'use client';
/* oxlint-disable next/no-img-element -- Images are bundled WebP assets. */
import { useState } from 'react';
import type { Product } from '@/lib/marketplace';

export default function ProductImage({
  product,
  large = false,
}: {
  product: Product;
  large?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  return (
    <div className={`product-image ${large ? 'large' : ''}`}>
      {failed ? (
        <span>{product.name}</span>
      ) : (
        <img
          src={product.image}
          alt={product.name}
          onError={() => setFailed(true)}
          loading={large ? 'eager' : 'lazy'}
        />
      )}
    </div>
  );
}
