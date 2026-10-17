# Simple Market — Storefront, Admin Dashboard & MongoDB API

A unified e-commerce application preserving the existing storefront and dashboard designs. The dashboard source is integrated from `Rabea19/Ecommerce-dashboard-project`; the original repository remains unchanged.

## Architecture

- `/`: existing React 18 / Material UI storefront and Redux cart.
- `/admin`: existing React 19 / Tailwind dashboard, built separately with Vite.
- `/api`: Express API, Mongoose and MongoDB, shared by both applications.
- Products, customers, orders, inventory and uploaded images use the same database.
- Server-side sessions in HttpOnly cookies, salted scrypt password hashes, server-enforced customer/admin roles.
- Checkout calculates prices from the database, reserves stock transactionally, and supports idempotent retries. Canceling a pending order restores stock once. Terminal orders cannot be reopened. Deletions preserve order records internally.

Two frontend builds deliberately retain each application's dependency versions and existing styling. `src/lib/api.js` and `admin/src/lib/api.js` provide the small query interface expected by existing views; keep these files synchronized. This is a staged integration, not a claim of production readiness.

## Requirements

Node.js 22.12+ (Node 24 used during validation), npm, and MongoDB 7+ **replica set** or Atlas. Transactions require a replica set; a standalone local MongoDB instance is insufficient.

## Local setup

```bash
npm run setup
docker compose up -d --wait
cp server/.env.example server/.env
```

The example URI targets the local replica set. For Atlas, put your connection URI in `server/.env` instead. Never place database credentials in frontend variables or commit `.env`.

Set a real `ADMIN_EMAIL` and strong `ADMIN_PASSWORD` in `server/.env`, then:

```bash
cd server
npm run admin
cd ..
```

The command creates one admin and refuses to overwrite an existing user. Remove `ADMIN_PASSWORD` after creation. Customer signup cannot create admins.

Run in three terminals:

```bash
npm run server
npm start
npm run admin
```

- Storefront: `http://localhost:3000`
- Dashboard: `http://localhost:5173/admin/`
- API: `http://localhost:4000/api/health`

Both development frontends proxy `/api` to the same server. Register a customer through the storefront's existing Sign In page, using the added Create Account action. Log in to the dashboard with the provisioned admin account.

## One-origin build

```bash
npm run build:all
npm run server
```

Open `http://localhost:4000/` and `http://localhost:4000/admin/`. Both frontends and the API are served together. For production use HTTPS, `NODE_ENV=production`, an explicit `ALLOWED_ORIGINS=https://your-domain.example`, and an authenticated MongoDB deployment. Secure cookies require HTTPS. Configure proxy trust and a shared rate-limit store for your actual hosting topology before multi-instance deployment. No hosting deployment is included in this branch.

## Verification

```bash
npm --prefix server test
```

The integration suite starts a temporary MongoDB replica set (downloads MongoDB on first run). It checks admin authorization, customer order isolation, server-side pricing, duplicate checkout prevention, stock rollback, concurrent purchases and cancellation. It never connects to your real database.

For environments unable to launch MongoDB:

```bash
cd server
node --test test/security.test.js
```

### Manual acceptance flow

1. Admin creates a product with image, price and stock.
2. Refresh the storefront; verify the same product and its details.
3. Create a customer, add the product and check out.
4. Admin refreshes Orders; verify items, price and reduced stock.
5. Cancel the pending order; verify stock restores exactly once.
6. Log in as a customer and try `/admin`; access must be denied.
7. Refresh while signed in, then sign out; verify the session behavior.

Data is refreshed on page entry/reload; the Users page polls every 15 seconds. Product and order changes are not pushed live to already-open screens.

## Migration and current limits

- Existing Supabase data has **not** been copied, changed or deleted. MongoDB starts empty. Add products through the dashboard or prepare a reviewed migration of exported data before switching production.
- Existing Supabase user sessions/passwords do not migrate automatically. Plan password reset/account recreation before cutover.
- Google/Facebook buttons no longer create fake authenticated users; they show that provider setup is required. Real OAuth needs provider credentials and callback configuration.
- Checkout records an order; it does **not** process payment. There is no payment gateway, shipping integration or email/password-reset flow yet.
- Product image uploads accept PNG/JPEG/WebP up to 2 MB and are stored in MongoDB for this portfolio-sized application. Larger installations should use object storage and image processing.
- Existing frontend category and currency labels are retained; review them before a real store launch.
- Add pagination, deployment-specific monitoring, backups, CSRF/security review and CI integration before claiming production readiness.

## Validation of this change

See `VALIDATION.md` for the checks actually run and limitations. A project becomes strong CV evidence through working features, tests and clear architecture; merging two interfaces alone does not establish senior engineering proficiency.

## Vercel deployment

Import the `feat/mongodb-market-dashboard` branch into a new Vercel project. Framework: Other; root directory: repository root. `vercel.json` supplies install/build commands and output directory. Use Node 24.

Set `MONGODB_URI` as a sensitive server environment variable in Vercel (never commit it). Set `ALLOWED_ORIGINS` to the exact HTTPS production origin, without a trailing slash, especially when using custom domains. Standard Vercel deployment and production hostnames are also allowed from Vercel system variables. Do not set ADMIN_PASSWORD in Vercel; the administrator is already provisioned in Atlas.

Storefront: `/`; dashboard: `/admin/`; API health: `/api/health`. The Node function reuses MongoDB connections within each instance. Images are stored in MongoDB, not the ephemeral filesystem. Rate limits currently use instance-local memory and are not a global distributed quota.

Before public release, review dependency audit findings; a successful build is not a security clearance. Verify authentication, product images, checkout, stock changes and cancellation on the deployed domain.
