# OwnASquare Platform Foundation Completion

Date: 2026-07-27

## Completed

- Created a dedicated OwnASquare repository.
- Built the initial parent-company single-page homepage.
- Added mobile-first phone, tablet, and desktop layouts.
- Added automatic light/dark mode and a compact manual theme control.
- Added a Cloudflare Worker with Worker Static Assets.
- Activated Cloudflare authoritative DNS for `ownasquare.com`.
- Attached `ownasquare.com` and `www.ownasquare.com` as exact production
  Custom Domains.
- Kept the stable `workers.dev` fallback enabled and disabled per-deployment
  preview URLs.
- Added `/api/health` with stable, friendly JSON responses.
- Added restrictive security headers for the parent site.
- Routed production static assets through the Worker so those security headers
  are applied to both the homepage and API responses.
- Documented the hosted versus open-source product boundary.
- Documented the central account, app-session, and entitlement contract.
- Documented the phased Cloudflare and registrar rollout.
- Preserved all unrelated Beladed and automation-lane work.

## Validation

`npm run check` passed after the custom-domain configuration:

- Cloudflare-generated bindings are current.
- 9 unit and source-contract tests passed.
- 12 Playwright checks passed across phone, tablet, and desktop.
- Light mode, dark mode, explicit theme switching, no horizontal overflow,
  health behavior, and dark-mode text contrast were exercised.
- Wrangler's deployment dry run completed with the expected static asset
  binding.

The rendered site was also inspected in the user's Chrome browser. The first
inspection found low-contrast hosted-plan copy in dark mode. The styles were
corrected and a minimum contrast assertion was added before final validation.

The deployed Worker was then verified at
`https://ownasquare-platform.ownasquare-com.workers.dev`:

- The homepage returned HTTP 200 and rendered correctly in the signed-in Chrome
  session.
- `/api/health` returned the expected ready JSON response.
- The homepage and health response both returned the expected HSTS, CSP,
  frame-denial, referrer, permissions, and content-type security headers.
- The first production check exposed that static assets were bypassing the
  Worker. `assets.run_worker_first` was corrected to `true`, a regression test
  was added, all checks were rerun, and the Worker was redeployed before hosted
  verification was accepted.

The two production Custom Domains were then verified against Cloudflare's
authoritative addresses while ordinary recursive DNS caches were still
expiring:

- `https://ownasquare.com` and `https://www.ownasquare.com` both returned HTTP
  200 with valid TLS and the current homepage.
- Both `/api/health` endpoints returned the expected ready JSON.
- Both homepages returned HSTS, CSP, COOP, permissions, referrer,
  content-type, and frame-denial headers.
- A real headless Chromium session, pinned to the new authoritative edge during
  DNS propagation, rendered the apex at desktop/light and `www` at
  mobile/dark. Both views showed the expected title, headline, responsive
  layout, complete content, and no error surface.

## Shared account decisions

- `account.ownasquare.com` owns the central account session.
- Each hosted app owns its own host-only app session.
- No session cookie is scoped to `.ownasquare.com`.
- Hosted sign-in follows Authorization Code with PKCE semantics.
- D1 is the planned source of truth for accounts, apps, subscriptions, and
  entitlements.
- Self-hosted app cores do not require OwnASquare login, billing, database, or
  private provider credentials.

## Provider state

- The repository is published at
  `https://github.com/ownasquare/ownasquare`.
- The Cloudflare GitHub App is limited to the single
  `ownasquare/ownasquare` repository.
- The Cloudflare dashboard's repository callback did not complete, so the
  deployment used a separate named Wrangler profile for the OwnASquare account.
  The existing Beladed Wrangler authentication was not replaced.
- The first Worker is deployed as `ownasquare-platform` and its hosted preview
  has been verified.
- `ownasquare.com` is active in Cloudflare on the free plan.
- GoDaddy readback and public delegation confirm that the registrar now uses
  Cloudflare's assigned nameservers.
- Cloudflare imported three HostGator web records during onboarding. The
  conflicting apex and `www` A records were removed before Custom Domain
  creation; the proxied wildcard was preserved.
- No public apex MX or TXT response was observed, and GoDaddy showed no DS
  records, so DNSSEC is currently off.
- GoDaddy contains `ownasquare.com`.
- GoDaddy contains `buggum.com`, not the requested `buggom.com` spelling.
- `ownasquare.com` and `www.ownasquare.com` are exact production Custom Domains
  for `ownasquare-platform`.
- Cloudflare's authoritative DNS returns proxied IPv4 and IPv6 addresses for
  both hostnames.
- The stable Worker URL remains public and deployment preview URLs are
  disabled.
- No registrar transfer, payment, password, agreement, or unrelated-domain
  action was performed.

## Remaining platform work

- Allow recursive DNS caches to expire naturally; no configuration action is
  required.
- Decide whether one hostname should redirect to the other. The current
  intentional behavior serves the same production site from both.
- Repair or replace the stalled GitHub push-to-deploy connection before
  depending on automatic releases.
- Implement the central account Worker, D1 migrations, email delivery, and
  payment-provider integration as separate reviewed stages.

## Validation classification

- Validation Environment: local Worker, deployed Cloudflare Worker fallback,
  active Cloudflare Custom Domains, authoritative DNS, and real Chromium.
- Validation Scope: parent homepage, responsive behavior, themes, health API,
  static asset routing, exact hostname bindings, TLS, and production response
  headers.
- Data Integrity Classification: real deployed Worker and real provider state;
  no application database exists yet.
- Mock/Fixture Usage: none for hosted proof; local tests use controlled Worker
  request objects and local static assets.
- Production Validation Status: Worker fallback and both exact Custom Domains
  verified against the active Cloudflare edge. Public recursive cache expiry
  remains in progress at some resolvers.
- Localhost Validation Integrity: real local Worker runtime, not a production
  sign-off substitute.
- Warning/Issue Triage: the production static-header gap was `fixed_now`; the
  initial Custom Domain conflict with imported apex/`www` A records was
  `fixed_now`; recursive DNS cache lag is `verified_external_or_stale`; the
  repeated Playwright color-environment message is
  `verified_external_or_stale` because all assertions passed and no warning was
  suppressed.
- Warning Suppression Status: `not_suppressed`.

## Commit and push evidence

- Branch: `main`.
- Product hardening, regression test, and provider documentation:
  `85a5e74`.
- Repository handoff-pointer refresh: `086d3e6`.
- Both commits were pushed to
  `https://github.com/ownasquare/ownasquare`.
- The final documentation-only closeout commit follows these evidence commits;
  no product code changed after the fully validated `85a5e74` deployment.
