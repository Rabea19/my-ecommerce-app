# Premium storefront redesign

Base: `vercel-release` at `307151357b825f95b2123db3a17aed2f00151c90`.
Branch: `design/premium-storefront`.

## Scope

React / JavaScript / Tailwind storefront inspired by Spring Rose's purple palette, generous spacing and collection-led shopping. Uses this store's existing catalogue and images; does not copy Spring Rose branding, business claims or product data.

Updated home, navigation, collection, product, bag, authentication and checkout pages. Added customer order history, URL-backed search/filter/sort, available-stock controls, image fallbacks, loading/error/retry states, keyboard-accessible native menu dialog, responsive layouts and consistent EGP display. Removed unused MUI/Emotion/Supabase storefront dependencies.

Node API, MongoDB schemas, admin dashboard, same-origin cookies, admin routes, server-calculated prices and checkout idempotency remain in place. The admin application retains its existing dependencies. No production database changes, migrations or test orders were made.

## Verification

- PASS: `npm run build:vercel` (storefront, admin and combined output).
- PASS: `CI=true npm test -- --watchAll=false --runInBand`: 6 tests across 3 suites. Covers filtering/sorting, stock bounds, cart persistence/removal, checkout payload, duplicate-click prevention, successful clearing and retry with the same idempotency key.
- PASS: 3 server security tests (password hashing, input validation, unauthenticated/private endpoint and origin checks).
- BLOCKED: 2 existing MongoDB integration tests. MongoMemoryServer exits with code 100: `open: Operation not permitted` during initialization in this execution environment. No assertion against a running database was reached.
- Browser visual/responsive QA has not been performed. Local browser preview infrastructure is unavailable in this environment.
- Vercel project inspection returned 403 for the connected team's scope. No manual preview or production deployment was performed.

## Before merging / production release

1. Run `npm --prefix server test` where MongoDB test processes are permitted; all five tests must pass.
2. Check the branch's Vercel preview at mobile and desktop sizes: catalogue search, filters, sorting, image fallback and navigation.
3. Against an isolated test database, sign in, add a product, change quantities, place an order, verify it in the admin dashboard and refresh customer order status.
4. Confirm the established EGP currency and store name are appropriate for the live business.

The feature branch is intended for review; do not merge until the outstanding integration and browser checks pass.
