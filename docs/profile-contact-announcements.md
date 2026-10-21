# Profile, contact and announcements

Base: vercel-release (38c06176c72733f3bfadb20612963bf68eb08115).

Adds /profile with a server-backed name editor, read-only email and account role, order/cart links and sign-out. PATCH /api/auth/profile accepts only name for the authenticated session; role/email changes are rejected. Existing server admin checks, order ownership, pricing, stock and checkout remain unchanged. Existing dashboard links remain admin-only.

Adds /contact and footer contact links. Set the official REACT_APP_WHATSAPP_URL, REACT_APP_INSTAGRAM_URL, REACT_APP_FACEBOOK_URL and REACT_APP_LINKEDIN_URL at build time. Only configured HTTPS links on the expected platforms appear. No fabricated accounts or contact form that discards messages. The unconfigured contact page states availability honestly. Owner must supply official destinations before release.

The announcement bar rotates every six seconds, includes previous/next and pause controls, pauses on hover/focus and disables automatic rotation under reduced motion. Text contains no unverified offers or shipping promises. Reference Spring Rose banners did not load in the review browser; this is an announcement implementation, not a verified copy of its animation.

No production deployment or database mutation performed. Confirm the Vercel production branch before merging. Existing GitHub connection reports read-only repository permissions.

Validation: production storefront build passes. Existing cart/catalog/checkout tests plus profile UI tests pass (9 tests). Server security and profile endpoint tests pass (4 tests, profile DB layer mocked). MongoDB integration tests were attempted but the temporary MongoDB process was blocked by this environment with `open: Operation not permitted`; full database-backed verification remains required before release.

## Dashboard and release verification — 2026-10-21

Replaced the promotional overview with operational statistics, selectable order periods, a customer/order table, low-stock links, and working product-create/edit and pending-order shortcuts. Uses the same /api/products, /api/orders and /api/users routes as the existing applications. Product totals and stock are current values; revenue and order counts use the selected order creation period. Existing pending/completed/canceled lifecycle is preserved.

Private authentication, order and customer API responses now use Cache-Control: no-store. The administration guard redirects rejected sessions with history replacement. Updated the existing dashboard browser-test heading for the new design.

Verification: 9 storefront tests passed; 7 isolated server/security tests passed, including customer rejection across administrator mutation endpoints, owner-scoped orders, administrator operations, invalid session rejection and profile privilege escalation rejection. Database calls are mocked in the isolated access tests. Full Vercel production bundle builds successfully. Changed admin files pass ESLint; four existing lint errors remain in unrelated legacy components.

Full MongoDB integration and database-backed browser verification remain blocked: the temporary MongoDB process exits with code 100 and `open: Operation not permitted`. No production database credentials or production data were used for tests. Do not treat isolated checks as end-to-end verification.

Publication blocked: current GitHub connector permissions report pull=true, push=false for Rabea19/my-ecommerce-app. No push, merge or Vercel publication has occurred. Official social destinations remain unconfigured and require owner-provided links. All preview/sample records are outside production source.
