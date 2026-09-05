'use client';
/* oxlint-disable next/no-img-element -- Images are bundled WebP assets. */
import { useState, useEffect } from 'react';
import {
  BadgeCheck,
  ChartNoAxesCombined,
  House,
  ReceiptText,
  Search,
  Store,
  UserRound,
  X,
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { getProducts, type Product } from '@/lib/marketplace';
import ProductCard from './product-card';
import ProductDetail from './product-detail';

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([]),
    [loading, setLoading] = useState(true),
    [error, setError] = useState(''),
    [retry, setRetry] = useState(0);
  const [tab, setTab] = useState('marketplace'),
    [search, setSearch] = useState(''),
    [selected, setSelected] = useState<Product | null>(null);
  useEffect(() => {
    const controller = new AbortController();
    getProducts(controller.signal)
      .then(setProducts)
      .catch((e) => {
        if (e.name !== 'AbortError') setError(e.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [retry]);
  function openProduct(product: Product) {
    setSelected(product);
    window.scrollTo(0, 0);
  }
  const filtered = products.filter((p) =>
    `${p.name} ${p.brand}`.toLowerCase().includes(search.trim().toLowerCase()),
  );
  return (
    <main className="app-shell">
      {selected ? (
        <ProductDetail
          key={selected.id}
          product={selected}
          onBack={() => {
            setSelected(null);
            window.scrollTo(0, 0);
          }}
        />
      ) : (
        <>
          <img
            className="shop-banner"
            src="/images/shop-banner.webp"
            alt="Shop today, pay later using mutual funds"
          />
          <Tabs
            value={tab}
            onValueChange={(value) => setTab(String(value))}
            className="shop-tabs"
          >
            <TabsList className="shop-tab-list" aria-label="Shop sections">
              <TabsTrigger value="brands">Top Brands</TabsTrigger>
              <TabsTrigger value="nearby">Nearby Stores</TabsTrigger>
              <TabsTrigger value="marketplace">1Fi Marketplace</TabsTrigger>
            </TabsList>
            <TabsContent value="brands" className="blank-panel" />
            <TabsContent value="nearby" className="blank-panel" />
            <TabsContent value="marketplace">
              <div className="marketplace">
                <label className="search">
                  <Search size={19} />
                  <input
                    aria-label="Search products"
                    placeholder="Search products or brands..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  {search && (
                    <button
                      aria-label="Clear search"
                      onClick={() => setSearch('')}
                    >
                      <X size={17} />
                    </button>
                  )}
                </label>
                <div className="marketplace-heading">
                  <h1>1Fi Marketplace</h1>
                  <span className="curated">
                    <BadgeCheck size={15} />
                    Curated for you
                  </span>
                </div>
                <p className="intro">Your next upgrade. On your terms.</p>
                {loading ? (
                  <div
                    className="product-grid"
                    aria-label="Loading products"
                    aria-busy="true"
                  >
                    {[1, 2, 3, 4].map((i) => (
                      <Skeleton key={i} className="loading-card" />
                    ))}
                  </div>
                ) : error ? (
                  <div className="empty" role="alert">
                    <h2>Something went wrong</h2>
                    <p>{error}</p>
                    <button
                      className="primary"
                      onClick={() => {
                        setLoading(true);
                        setError('');
                        setRetry((r) => r + 1);
                      }}
                    >
                      Try again
                    </button>
                  </div>
                ) : filtered.length ? (
                  <div className="product-grid">
                    {filtered.map((p) => (
                      <ProductCard
                        key={p.id}
                        product={p}
                        onOpen={() => openProduct(p)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="empty">
                    <Search />
                    <h2>No products found</h2>
                    <p>Try another product or brand.</p>
                    <button
                      className="text-button"
                      onClick={() => setSearch('')}
                    >
                      Clear search
                    </button>
                  </div>
                )}
                <p className="catalog-note">
                  Demo catalog · Illustrative pricing and EMI plans
                </p>
              </div>
            </TabsContent>
          </Tabs>
          <nav className="bottom-nav" aria-label="Main navigation">
            {[
              { label: 'Home', Icon: House, path: 'dashboard' },
              { label: 'Shop', Icon: Store, path: 'shop' },
              { label: 'EMI Dues', Icon: ReceiptText, path: 'emi-dues' },
              {
                label: 'Limit',
                Icon: ChartNoAxesCombined,
                path: 'pledged-funds',
              },
              { label: 'Profile', Icon: UserRound, path: 'profile' },
            ].map(({ label, Icon, path }) =>
              label === 'Shop' ? (
                <button
                  key={label}
                  aria-current="page"
                  className="active"
                  onClick={() => {
                    setTab('marketplace');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  <Icon />
                  <span>{label}</span>
                </button>
              ) : (
                <a
                  key={label}
                  href={`https://app.1fi.in/${path}`}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${label} (opens original 1Fi app)`}
                >
                  <Icon />
                  <span>{label}</span>
                </a>
              ),
            )}
          </nav>
        </>
      )}
    </main>
  );
}
