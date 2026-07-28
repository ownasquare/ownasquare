# OwnASquare Platform Foundation Completion

Date: 2026-07-27

## Completed

- Created a dedicated OwnASquare repository.
- Built the initial parent-company single-page homepage.
- Added mobile-first phone, tablet, and desktop layouts.
- Added automatic light/dark mode and a compact manual theme control.
- Added a shared Home/The Adventure top navigation that remains compact on
  phone, tablet, and desktop layouts.
- Added `/adventure/`, a dedicated founder-story and video-journal page about
  the five-year startup lesson, the thousand-app reset, the high-pain problem
  filter, the build tools, and learning from real users.
- Added five truthful upcoming video chapters labeled `Recording soon`; no
  unpublished recording is represented as a playable video.
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

`npm run check` passed after the Adventure page implementation:

- Cloudflare-generated bindings are current.
- 11 unit and source-contract tests passed.
- 18 Playwright checks passed across phone, tablet, and desktop.
- Light mode, dark mode, explicit theme switching, no horizontal overflow,
  homepage-to-Adventure navigation, Adventure-page identity, health behavior,
  and dark-mode text contrast were exercised.
- Wrangler's deployment dry run completed with the expected static asset
  binding.

The rendered Adventure flow was also verified through the in-app browser at
the local Worker:

- The homepage presented unique Home and The Adventure tabs with the correct
  active state.
- Activating The Adventure opened `/adventure/` with the expected page title,
  founder headline, five upcoming video chapters, and build principles.
- The in-page `Watch the journey unfold` action moved the video journal heading
  into view.
- Desktop dark, mobile dark, and mobile light views were visually inspected.
- The first mobile pass exposed a three-row header. The grid placement was
  corrected so brand and theme share the first row and navigation occupies the
  second.
- Console readback contained no warnings or errors after the correction.

The rendered site was also inspected in the user's Chrome browser. The first
inspection found low-contrast hosted-plan copy in dark mode. The styles were
corrected and a minimum contrast assertion was added before final validation.

The deployed Worker was then verified at
`https://ownasquare-platform.ownasquare-com.workers.dev`:

- The homepage returned HTTP 200 and rendered correctly in the signed-in Chrome
  session.
- `/adventure/` returned HTTP 200 with the expected page title, founder
  headline, and truthful upcoming-video states.
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

The Adventure release was then deployed and read back independently:

- `/adventure/` returned HTTP 200 from the stable Worker URL, apex, and `www`.
- The production route returned the expected CSP, permissions, referrer, and
  content-type security headers.
- The stable Worker URL rendered the live Adventure page in the in-app browser
  at desktop/dark, mobile/dark, and mobile/light sizes.
- The live Home and The Adventure menu links navigated in both directions, the
  theme control switched state, and the browser console remained empty.
- Ordinary command-line TLS and HTTP readback passed for both custom domains.
  The in-app browser still resolved the apex to a stale certificate path during
  the visual check, so visual proof used the stable Worker URL without
  weakening TLS validation.

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

- Supply and approve real video files or hosted video URLs before replacing any
  `Recording soon` state with a playable recording.
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
  static asset routing, exact hostname bindings, Adventure navigation and
  content, TLS, and production response headers.
- Data Integrity Classification: real deployed Worker and real provider state;
  no application database exists yet.
- Mock/Fixture Usage: none for hosted proof; local tests use controlled Worker
  request objects and local static assets.
- Production Validation Status: the existing Worker fallback and exact Custom
  Domains returned the deployed Adventure release with HTTP 200 and the
  expected security headers. The stable Worker URL also passed real-browser
  desktop/mobile, theme, navigation, and console readback. The in-app browser's
  apex resolver still showed the known stale-certificate path even though
  ordinary TLS/HTTP readback passed.
- Localhost Validation Integrity: real local Worker runtime, not a production
  sign-off substitute.
- Warning/Issue Triage: the production static-header gap was `fixed_now`; the
  initial Custom Domain conflict with imported apex/`www` A records was
  `fixed_now`; the mobile three-row header was `fixed_now`; recursive DNS cache
  lag is `verified_external_or_stale`; the
  repeated Playwright color-environment message is
  `verified_external_or_stale` because all assertions passed and no warning was
  suppressed.
- Warning Suppression Status: `not_suppressed`.

## Commit and push evidence

- Branch: `main`.
- Product hardening, regression test, and provider documentation:
  `85a5e74`.
- Repository handoff-pointer refresh: `086d3e6`.
- Custom Domain configuration, regression test, deployment evidence, and
  cutover documentation: `8da0e13`.
- Adventure journal, shared navigation, responsive styling, source contracts,
  and Playwright coverage: `92db224`.
- These evidence commits were pushed to
  `https://github.com/ownasquare/ownasquare`.
- The final documentation-only closeout commit follows these evidence commits;
  no product code changed after the fully validated `92db224` deployment.
