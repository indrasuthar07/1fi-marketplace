'use client';
import { ArrowRight } from 'lucide-react';
import { makeQuote, money, type Product } from '@/lib/marketplace';
import ProductImage from './product-image';

export default function ProductCard({
  product,
  onOpen,
}: {
  product: Product;
  onOpen: () => void;
}) {
  const v = product.variants.find((v) => v.available)!;
  return (
    <button
      className="product-card"
      onClick={onOpen}
      aria-label={`View ${product.name}`}
    >
      <ProductImage product={product} />
      <div className="card-copy">
        <span className="brand">{product.brand}</span>
        <h2>{product.name}</h2>
        <p className="variant-caption">
          {v.label} · {v.color}
        </p>
        <div className="price">
          {money(v.price)} {v.mrp > v.price && <del>{money(v.mrp)}</del>}
        </div>
        <div className="emi-preview">
          <span>
            From{' '}
            <strong>
              {money(makeQuote(v.price, Math.max(...product.tenures)).monthly)}
            </strong>
            /mo
          </span>
          <ArrowRight size={16} />
        </div>
        <span className="no-cost">0% interest</span>
      </div>
    </button>
  );
}
