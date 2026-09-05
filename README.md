# 1Fi Marketplace

Shop page implementation for the 1Fi SDE Intern assignment. Built with React, TypeScript and Vinext (Next.js-compatible routing).

## Setup

Use Node.js 22.13+ and npm.

```sh
npm ci
npm run dev
```

Open http://localhost:3000/shop. To run a production build:

```sh
npm run build
npm start
```

## Features

- Three Shop tabs: Top Brands, Nearby Stores and 1Fi Marketplace. The first two are intentionally blank.
- Product listing, search, storage variants and product specifications.
- No-cost EMI plans with a payment breakdown and review step.
- Mock checkout with server-side validation.
- Loading, empty, error and unavailable-variant states.

The layout follows the public [1Fi Shop](https://app.1fi.in/shop): narrow mobile content, purple accents, rounded tabs and floating bottom navigation.

## Project structure

```text
app/
  shop/page.tsx          Shop route
  api/products/         Product catalog endpoint
  api/checkout/         Validated mock checkout endpoint
components/
  marketplace/          Shop, product card, image and detail components
  ui/                   Shared tab, radio and skeleton primitives
lib/
  catalog.ts            Sample product data
  marketplace.ts        API functions, types and EMI calculation
api.test.mjs            API integration tests
```

Product data stays outside the components. `GET /api/products` serves the catalog. `POST /api/checkout` takes `productId`, `variantId` and `months`; the server resolves the price and rejects unsupported or unavailable selections.

Prices are stored in paise. Monthly payments round down to the nearest paise, and the final installment includes the remainder so payments add up to the product price.

## Checks

```sh
npm run typecheck
npm run lint
npm run build
# Run the dev server in a separate terminal first:
npm test
```

The API tests cover all available variant/tenure combinations, unavailable variants, invalid input, price tampering, product images and Shop routes. Set `TEST_BASE_URL` to test a different local origin.

## Scope and assumptions

This is a standalone implementation. The original app repository and separate product reference screens were not supplied, so the public web Shop was used as the design reference. The Android app was not installed.

Prices, specifications, availability and EMI plans are sample data. Checkout returns a demo reference; it does not place an order, charge a payment or create a loan. Other bottom-navigation links open the original 1Fi app.

## Assets

The banner and product images come from 1Fi's public website and are bundled for this assignment. They remain the property of their respective owners.

- [Shop banner](https://cdn.1fi.in/banners/shop-page%201536x1024.webp)
- [iPhone](https://www.1fi.in/iphone17_home.webp)
- [Pixel](https://www.1fi.in/pixel-home-1.webp)
- [Galaxy](https://www.1fi.in/samsungs25_home.webp)
- [MacBook](https://www.1fi.in/macbook.webp)
