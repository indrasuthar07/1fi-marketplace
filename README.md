# 1Fi Marketplace

A standalone Shop implementation for the 1Fi SDE Intern assignment, built with React, TypeScript and Vinext's Next.js-compatible App Router. Includes a runnable source project and a private hosted preview.

## Run locally

Requires Node.js 22.13 or newer and npm.

```sh
npm ci
npm run dev
```

Open http://localhost:3000/shop. The root URL also opens Shop.

```sh
npx tsc --noEmit
npm run lint:marketplace
npm run build
# With the dev server running in another terminal:
npm test
```

## Implemented

- Shop tabs: Top Brands and Nearby Stores intentionally render empty panels; 1Fi Marketplace is complete.
- Product listing with locally bundled images, product name, variant, price and starting EMI.
- Product/brand search with empty results and clear-search action.
- Product details, available/unavailable storage variants and specifications.
- EMI tenure selection, a breakdown of total payable, and a review CTA.
- A server-validated demo continuation showing the selected product, variant, plan and reference.
- Loading skeletons, cancellation on unmount, retry, failed-image fallback, request error feedback and disabled submitting state.
- Narrow responsive app layout, accessible tab/radio primitives, keyboard focus, safe-area padding and reduced-motion support.

## Architecture and API

- `app/shop/page.tsx`, `app/page.tsx`: route entry points.
- `components/marketplace/shop.tsx`: Shop shell and reusable ProductCard, ProductImage and ProductDetail components.
- `lib/catalog.ts`: typed mock catalog, separate from UI code.
- `lib/marketplace.ts`: API adapter, response validation, shared types and money/EMI functions.
- `app/api/products/route.ts`: GET /api/products.
- `app/api/checkout/route.ts`: POST /api/checkout, accepting productId, variantId and months. The server resolves the price and rejects unavailable variants/unsupported tenures. Client-supplied prices are ignored.
- `hooks/use-marketplace-tools.ts`: optional read-only WebMCP EMI comparison, feature-detected with lifecycle cleanup.
- `api.test.mjs`: integration checks against a running server. TEST_BASE_URL can override the origin.

All monetary amounts are integer paise. For no-cost plans, the regular installment is floor(price / months); the final installment reconciles the remainder. Review shows both amounts. Interest, down payment and processing fees are zero for this illustrative catalog.

The checkout is deliberately a mock: it creates no order or loan, takes no payment and persists no financial data. Its reference is a response identifier, not a retrievable order. Replace the catalog repository and checkout service with authenticated production integrations when the original codebase becomes available.

## Reference research and limitations

The supplied PDF contains three pages of requirements but no product reference screens, embedded attachments or source repository. No Android device/emulator was available, so the native app was not downloaded or installed. The publicly accessible web app at https://app.1fi.in/shop was explored directly.

Observed design: approximately 526px maximum content width, Geist typography, #712cdc active purple, original Shop promotional banner, pale-purple pill tabs, rounded white cards and a floating five-item bottom navigation. These were retained for consistency. Other bottom-navigation links open the original app in a separate tab; unrelated account screens are not reimplemented.

This is a standalone implementation, not a modification of 1Fi's private codebase. Native implementation details could not be verified. React and the Next.js-compatible route structure were chosen for the observed public web experience. Exact product/EMI reference matching requires the missing reference material. Product specifications, prices, availability and tenures are illustrative and are identified as demo content in the UI.

## Asset attribution

Banner and representative product images were downloaded from 1Fi's public website for this assignment demonstration:

- https://cdn.1fi.in/banners/shop-page%201536x1024.webp
- https://www.1fi.in/iphone17_home.webp
- https://www.1fi.in/pixel-home-1.webp
- https://www.1fi.in/samsungs25_home.webp
- https://www.1fi.in/macbook.webp

Brand/product images remain the property of their respective owners; no redistribution license is claimed. See https://www.1fi.in/ for the original public product presentation.

## Verification

TypeScript check and production build pass. API tests cover 25 available variant/tenure combinations, unavailable variants, malformed payloads, unsupported tenures, ignored client price overrides, asset responses and both Shop entry routes. WebMCP valid and invalid input paths were checked in a supported browser context. Full click-through and viewport browser QA were not performed.

The starter's full `npm run lint` reports pre-existing issues in unused vendored Shadcn components and its use-mobile hook. `npm run lint:marketplace` checks the assignment implementation separately; vendored components have not been rewritten merely to silence those baseline issues.

Dependency audit after compatible patch upgrades: 0 known vulnerabilities reported by npm on 5 September 2026.

