'use client';
/* oxlint-disable next/no-img-element -- Bundled compressed WebP assets; no external image optimizer required. */
import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  ChartNoAxesCombined,
  Check,
  House,
  LoaderCircle,
  ReceiptText,
  Search,
  ShieldCheck,
  Store,
  UserRound,
  X,
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Skeleton } from '@/components/ui/skeleton';
import { useMarketplaceTools } from '@/hooks/use-marketplace-tools';
import {
  getProducts,
  makeQuote,
  money,
  submitSelection,
  type Product,
} from '@/lib/marketplace';

function ProductImage({
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
function ProductCard({
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
function ProductDetail({
  product,
  onBack,
}: {
  product: Product;
  onBack: () => void;
}) {
  const [variantId, setVariantId] = useState(
    product.variants.find((v) => v.available)!.id,
  );
  const [months, setMonths] = useState(
    product.tenures.includes(12) ? 12 : product.tenures[0],
  );
  const [step, setStep] = useState<'detail' | 'review' | 'done'>('detail');
  const [busy, setBusy] = useState(false),
    [error, setError] = useState('');
  const [result, setResult] = useState<Awaited<
    ReturnType<typeof submitSelection>
  > | null>(null);
  const variant = product.variants.find((v) => v.id === variantId)!;
  const quote = makeQuote(variant.price, months);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);
  async function proceed() {
    setBusy(true);
    setError('');
    try {
      setResult(await submitSelection(product.id, variant.id, months));
      setStep('done');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Please try again.');
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="detail">
      <header className="detail-header">
        <button
          className="icon-button"
          aria-label={
            step === 'detail' ? 'Back to marketplace' : 'Back to product'
          }
          onClick={() => (step === 'detail' ? onBack() : setStep('detail'))}
        >
          <ArrowLeft />
        </button>
        <h1>
          {step === 'detail'
            ? 'Product details'
            : step === 'review'
              ? 'Review your plan'
              : 'Your selected plan'}
        </h1>
        <span className="wordmark">1Fi</span>
      </header>
      {step === 'done' && result ? (
        <div className="completion">
          <div className="success-icon">
            <Check size={34} />
          </div>
          <h2>Your plan is ready</h2>
          <p>
            {result.product}
            <br />
            {result.variant}
          </p>
          <div className="summary">
            <strong>
              {money(result.quote.monthly)}
              <small> / month</small>
            </strong>
            <p>{result.quote.months} monthly installments · 0% interest</p>
            <p>Total payable: {money(result.quote.total)}</p>
          </div>
          <p className="demo-note">
            Demo complete. No order has been placed and no loan has been
            created. In the live app, eligibility and mutual fund pledging would
            follow.
          </p>
          <span className="reference">Reference: {result.reference}</span>
          <button className="primary" onClick={onBack}>
            Back to Marketplace <ArrowRight size={18} />
          </button>
        </div>
      ) : (
        <>
          {step === 'detail' ? (
            <>
              <ProductImage product={product} large />
              <div className="detail-copy">
                <span className="brand">{product.brand}</span>
                <h2>{product.name}</h2>
                <p className="description">{product.description}</p>
                <div className="price big">
                  {money(variant.price)}{' '}
                  {variant.mrp > variant.price && (
                    <del>{money(variant.mrp)}</del>
                  )}
                </div>
                <p className="muted">Inclusive of all taxes</p>
                <fieldset>
                  <legend>Choose storage</legend>
                  <RadioGroup
                    value={variantId}
                    onValueChange={(value) => setVariantId(String(value))}
                    className="variant-options"
                  >
                    {product.variants.map((v) => (
                      <label
                        className={`variant-option ${variantId === v.id ? 'selected' : ''} ${!v.available ? 'unavailable' : ''}`}
                        key={v.id}
                      >
                        <RadioGroupItem value={v.id} disabled={!v.available} />
                        <span>
                          {v.label}
                          {!v.available && <small>Out of stock</small>}
                        </span>
                      </label>
                    ))}
                  </RadioGroup>
                </fieldset>
                <p className="color-label">
                  Colour: <strong>{variant.color}</strong>
                </p>
                <div className="section-heading">
                  <h3>Choose your EMI plan</h3>
                  <span className="no-cost">No-cost EMI</span>
                </div>
                <p className="muted">
                  Keep your investments. Pay in easy installments.
                </p>
                <RadioGroup
                  aria-label="EMI tenure"
                  value={String(months)}
                  onValueChange={(value) => setMonths(Number(value))}
                  className="plans"
                >
                  {product.tenures.map((m) => (
                    <label
                      key={m}
                      className={`plan ${months === m ? 'selected' : ''}`}
                    >
                      <RadioGroupItem value={String(m)} />
                      <span>
                        <strong>{m} months</strong>
                        <small>0% interest</small>
                      </span>
                      <span className="plan-price">
                        <strong>
                          {money(makeQuote(variant.price, m).monthly)}
                        </strong>
                        <small>per month</small>
                      </span>
                      {m === 12 && <span className="popular">POPULAR</span>}
                    </label>
                  ))}
                </RadioGroup>
                <div className="fee-line">
                  <ShieldCheck size={17} />
                  <span>Zero down payment · No processing fee</span>
                </div>
                <details>
                  <summary>Product details</summary>
                  <dl>
                    {Object.entries(product.specs).map(([key, value]) => (
                      <div key={key}>
                        <dt>{key}</dt>
                        <dd>{value}</dd>
                      </div>
                    ))}
                  </dl>
                </details>
                <p className="demo-note">
                  Illustrative catalog and EMI plans for this demo. Images show
                  a representative colour; prices and availability are sample
                  data.
                </p>
              </div>
            </>
          ) : (
            <div className="review-copy">
              <div className="review-product">
                <ProductImage product={product} />
                <div>
                  <span className="brand">{product.brand}</span>
                  <h2>{product.name}</h2>
                  <p>
                    {variant.label} · {variant.color}
                  </p>
                  <button
                    className="text-button"
                    onClick={() => setStep('detail')}
                  >
                    Change selection
                  </button>
                </div>
              </div>
              <h3>Payment breakdown</h3>
              <dl className="breakdown">
                <div>
                  <dt>Product price</dt>
                  <dd>{money(variant.price)}</dd>
                </div>
                <div>
                  <dt>Down payment</dt>
                  <dd>{money(0)}</dd>
                </div>
                <div>
                  <dt>Interest</dt>
                  <dd>{money(quote.interest)} (0%)</dd>
                </div>
                <div>
                  <dt>Processing fee</dt>
                  <dd>{money(quote.fees)}</dd>
                </div>
                <div className="total">
                  <dt>Total payable</dt>
                  <dd>{money(quote.total)}</dd>
                </div>
              </dl>
              <div className="summary">
                <strong>
                  {money(quote.monthly)}
                  <small> / month</small>
                </strong>
                <p>For {quote.months} months</p>
              </div>
              <p className="muted">
                First {quote.months - 1} installments: {money(quote.monthly)}{' '}
                each. Final installment: {money(quote.finalPayment)}.
              </p>
              <div className="notice">
                <ShieldCheck />
                <p>
                  This is a demo selection. Continuing won’t place an order,
                  charge you or apply for credit.
                </p>
              </div>
              {error && (
                <p role="alert" className="error-text">
                  {error}
                </p>
              )}
            </div>
          )}
          <div className="checkout-bar">
            <div>
              <span>{months} months • 0% interest</span>
              <strong>
                {money(quote.monthly)}
                <small>/mo</small>
              </strong>
            </div>
            <button
              className="primary"
              disabled={busy}
              onClick={() =>
                step === 'detail' ? setStep('review') : proceed()
              }
            >
              {busy ? (
                <LoaderCircle className="spin" size={18} />
              ) : (
                <>
                  {step === 'detail' ? 'Review plan' : 'Continue'}
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </div>
        </>
      )}
    </section>
  );
}
export default function Shop() {
  const [products, setProducts] = useState<Product[]>([]),
    [loading, setLoading] = useState(true),
    [error, setError] = useState(''),
    [retry, setRetry] = useState(0);
  const [tab, setTab] = useState('marketplace'),
    [search, setSearch] = useState(''),
    [selected, setSelected] = useState<Product | null>(null);
  useMarketplaceTools(products);
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
