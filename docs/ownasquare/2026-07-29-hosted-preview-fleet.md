# OwnASquare Hosted Preview Fleet Completion

Date: 2026-07-29

## Outcome

OwnASquare now publishes an app library at
`https://ownasquare.com/apps/` with 50 catalog cards. Every card has:

- a live hosted preview at `https://<slug>.ownasquare.com`;
- a public GitHub source link;
- category, use-case, and simplicity metadata; and
- an availability state that is derived from the current public fleet.

The catalog supports left-panel filters for category, use case (`Personal`,
`Education`, and `Business`), simplicity (`Simple · 2 clicks`,
`Moderate · 5 clicks`, and `Full dashboard`), and availability.

## Deployment classes

| Surface | Count | Public behavior |
| --- | ---: | --- |
| Existing verified previews | 3 | Original app interface |
| Pilot hosted previews | 5 | App-specific static interface |
| Static/Vite batch | 18 | App-specific static or client-side interface |
| Browser-native remaining batch | 6 | App-specific browser interface |
| Client-side demo builds | 2 | Real Vite demo mode |
| Read-only product tours | 16 | Truthfully labeled product/workflow tour |
| **Total** | **50** | HTTP 200 HTML on the canonical subdomain |

The 16 product tours are not substitutes for private Python services, local
models, paid providers, durable databases, autonomous execution, or other
server-side runtimes. Each tour visibly states that boundary and links to the
complete public source.

## Implementation

The parent repository now contains:

- catalog metadata and UI truth for all 50 previews;
- deterministic Wrangler deployment runners for the static/Vite and remaining
  fleets;
- per-app isolated Wrangler configurations generated under ignored
  `.preview-build/`;
- live preview and GitHub-source verification commands;
- Node contracts for fleet classification and deployment-runner safety; and
- Playwright coverage for desktop, tablet, and phone catalog behavior.

Primary files:

- `public/apps/catalog-data.js`
- `public/apps/index.html`
- `scripts/deploy-hosted-preview-batch.mjs`
- `scripts/deploy-remaining-previews.mjs`
- `scripts/verify-preview-fleet.mjs`
- `scripts/verify-source-links.mjs`
- `tests/hosted-preview-batch.test.js`
- `tests/remaining-preview-fleet.test.js`
- `tests/site.test.js`
- `tests/e2e/home.spec.js`

## Deployment safety and recovery

All provider commands use the OwnASquare named Wrangler profile through the
secret-safe launcher, with the inherited Cloudflare account selector removed.

The first remaining-fleet attempt inherited the parent repository's Wrangler
configuration for four previews, which temporarily attached the apex and
`www` routes to preview Workers. Execution stopped immediately. The
`ownasquare-platform` Worker was redeployed to restore both routes, public
readback succeeded, and the runner was corrected to generate and pass one
isolated per-app Wrangler configuration containing only the exact preview
hostname. The batch then completed using the corrected runner.

The repaired parent deployment produced Worker version
`243d0f4f-f128-4d36-b8db-9e8d0d61e564`.

## Validation evidence

- `npm test`: 18 of 18 tests passed.
- `npm run test:e2e`: 24 of 24 Playwright tests passed across phone, tablet,
  and desktop projects.
- `npm run verify:previews`: 50 of 50 canonical preview URLs returned HTTP 200
  HTML.
- `npm run verify:sources`: 50 of 50 public GitHub repository URLs returned
  HTTP 200.
- `npx wrangler deploy --dry-run --profile ownasquare`: passed through the
  secret-safe command boundary.
- Live Chrome QA: 50 cards, 50 preview states, 50 preview links, 50 GitHub
  links, working Education filter, working clear action, working mobile filter
  drawer, no horizontal overflow, and no console warnings or errors.
- Live apex, app-library, and sampled preview readback: HTTP 200 after route
  recovery.

## Truth boundary and remaining hardening

This completion proves public availability of the catalog, preview HTML, and
GitHub source URLs on 2026-07-29. It does not certify that every product's full
server-side runtime is operating, nor does it replace formal immutable
source-SHA, binding, traffic-allocation, and provider release attestation.
Those remain separate release-hardening work.
