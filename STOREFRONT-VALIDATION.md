# Premium storefront verification

Base: `vercel-release` at `307151357b825f95b2123db3a17aed2f00151c90`.
Feature branch: `design/premium-storefront`.

## Scope

React, JavaScript and Tailwind storefront inspired by Spring Rose's plum palette, spacing and collection-led layout. Existing store catalogue and images are retained. Node API, MongoDB models, admin dashboard and same-origin session integration remain intact.

## Verified on 2026-10-20

GitHub Actions run: https://github.com/Rabea19/my-ecommerce-app/actions/runs/39397126438
Tested implementation commit: `8de2508747189739d2f859102d9964f1bfab0c7d`.

- PASS: 6 frontend tests covering filters, stock limits, persistence and checkout success/failure/idempotency.
- PASS: 5 server tests with a real disposable MongoDB replica set, including order totals, permissions, admin visibility, cancellation/restock, rollback and concurrent overselling prevention.
- PASS: production build of storefront, dashboard and combined Vercel output.
- PASS: 3 Chromium browser journeys at desktop 1440×900 and emulated mobile 390×844 and 320×740.
- Each browser journey verifies home/menu, search, product details, bag quantity and reload persistence, account registration, checkout POST and server total, customer history, separate admin login, dashboard order visibility, cancellation and refreshed/persisted customer status.
- All tested storefront pages fit their viewport horizontally. No uncaught page JavaScript errors were observed in the customer journey.
- Screenshots and HTML report are stored in the run's `browser-verification` artifact for seven days.
- The deployed preview was also inspected manually on desktop with live catalogue reads and guest shopping flow.

## Isolation and limits

Browser tests run against a disposable database created by `server/e2e/start.mjs`; they do not read production credentials or modify live products/orders. The local runner cannot start MongoDB (exit 100), so full-stack execution was completed on GitHub Actions.

Mobile checks use Chromium viewport/touch emulation, not physical phones or Safari. Authenticated order testing uses the built applications and real API/database in CI, not production customer accounts.

## Reproduce

Run `npm ci`, `npm --prefix admin ci`, `npm --prefix server ci`, and `npm run build:vercel`.
In `server/`, run `npx playwright install --with-deps chromium` then `npx playwright test`.
