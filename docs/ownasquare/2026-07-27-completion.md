# OwnASquare Platform Foundation Completion

Date: 2026-07-27

## Completed

- Created a dedicated OwnASquare repository.
- Built the initial parent-company single-page homepage.
- Added mobile-first phone, tablet, and desktop layouts.
- Added automatic light/dark mode and a compact manual theme control.
- Added a Cloudflare Worker with Worker Static Assets.
- Added `/api/health` with stable, friendly JSON responses.
- Added restrictive security headers for the parent site.
- Routed production static assets through the Worker so those security headers
  are applied to both the homepage and API responses.
- Documented the hosted versus open-source product boundary.
- Documented the central account, app-session, and entitlement contract.
- Documented the phased Cloudflare and registrar rollout.
- Preserved all unrelated Beladed and automation-lane work.

## Validation

`npm run check` passed after the production routing correction:

- Cloudflare-generated bindings are current.
- 8 unit and source-contract tests passed.
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
- `ownasquare.com` has been added to Cloudflare on the free plan and remains
  pending nameserver activation.
- Cloudflare imported three current HostGator web records: wildcard, apex, and
  `www`. All three matched independent public DNS readback.
- No public apex MX or TXT response was observed, and GoDaddy showed no DS
  records, so DNSSEC is currently off.
- GoDaddy contains `ownasquare.com`.
- GoDaddy contains `buggum.com`, not the requested `buggom.com` spelling.
- `ownasquare.com` currently delegates DNS to HostGator.
- The current HTTP origin serves an error placeholder and its HTTPS certificate
  does not match the domain.
- Cloudflare has assigned replacement nameservers, but GoDaddy still retains
  the HostGator nameservers.
- No registrar nameserver, registrar transfer, payment, password, or agreement
  action was performed.

## Remaining activation work

- Obtain explicit action-time approval for the GoDaddy nameserver cutover.
- Replace the two HostGator nameservers with the two Cloudflare-assigned
  nameservers and wait for Cloudflare to report the zone active.
- Bind both `ownasquare.com` and `www.ownasquare.com` to the Worker as exact
  custom domains after zone activation.
- Verify public DNS, TLS, homepage, `/api/health`, redirects or dual-host
  behavior, and security headers on both hostnames.
- Implement the central account Worker, D1 migrations, email delivery, and
  payment-provider integration as separate reviewed stages.

## Validation classification

- Validation Environment: local Worker plus deployed Cloudflare Worker preview.
- Validation Scope: parent homepage, responsive behavior, themes, health API,
  static asset routing, and production response headers.
- Data Integrity Classification: real deployed Worker and real provider state;
  no application database exists yet.
- Mock/Fixture Usage: none for hosted proof; local tests use controlled Worker
  request objects and local static assets.
- Production Validation Status: Worker preview verified; custom-domain
  production remains pending nameserver activation.
- Localhost Validation Integrity: real local Worker runtime, not a production
  sign-off substitute.
- Warning/Issue Triage: the production static-header gap was `fixed_now`; the
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
