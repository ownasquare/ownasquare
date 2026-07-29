# OwnASquare App Library

Date: 2026-07-28

## Outcome

OwnASquare now has a dedicated `/apps/` library in the parent-site source. The
library gives each currently reachable app two explicit paths:

- open the public OwnASquare-hosted preview; or
- inspect the public open-source GitHub repository.

The page intentionally labels the app hosts as `Public preview`. It does not
claim that the app-level hosted-release certification process has finalized.

## Included apps

| App | Public preview | Public source | Current classification |
| --- | --- | --- | --- |
| UnitPath Coach | <https://unitpath-coach.ownasquare.com> | <https://github.com/ownasquare/unitpath-coach> | Public root, health endpoint, and fictional coaching flow read back successfully; app-level production certification remains separate |
| Split Ticket Rescue | <https://split-ticket-rescue.ownasquare.com> | <https://github.com/ownasquare/split-ticket-rescue> | Public root, health endpoint, and fictional recovery-plan flow read back successfully; app-level production certification remains separate |
| Move Thesis | <https://move-thesis.ownasquare.com> | <https://github.com/ownasquare/move-thesis> | Public root, health endpoint, and fictional reality-test flow read back successfully; app-level production certification remains separate |

Cloudflare dashboard readback showed these three app Workers and Custom Domains
alongside the existing parent Worker. The connected GitHub readback independently
reported all three repositories as public, unarchived, and using `main` as the
default branch.

## Changed surfaces

- `public/apps/index.html`: new accessible app library and exact hosted/source
  links.
- `public/index.html`: added the Apps navigation tab and current availability
  message.
- `public/adventure/index.html`: added the shared Apps navigation tab.
- `public/styles.css`: added responsive library layouts, cards, status
  treatment, actions, focus states, and light/dark compatibility.
- `tests/site.test.js`: added source contracts for the library and exact links.
- `tests/e2e/home.spec.js`: added phone, tablet, and desktop navigation, link,
  card-count, and overflow checks.
- `docs/superpowers/plans/2026-07-28-app-library.md`: implementation plan and
  release sequence.

## Validation

### Local source and Worker validation

`npm run check` passed:

- generated Worker types were current;
- 13 Node source/Worker tests passed;
- 21 Playwright checks passed across phone, tablet, and desktop;
- the new library exposed exactly three app cards and six exact destination
  links at every configured viewport;
- Wrangler deployment dry-run read all eight public assets and completed
  successfully.

The expected Playwright `NO_COLOR`/`FORCE_COLOR` diagnostic remained visible.
It did not correspond to a failed assertion, browser-console warning, or
suppressed product issue.

### Rendered browser validation

The local `/apps/` route was inspected in the user's OwnASquare Chrome profile:

- title and route identity were correct;
- the DOM contained meaningful page and card content;
- no framework error overlay appeared;
- browser console readback had no warnings or errors;
- desktop dark, mobile dark, and mobile light layouts were inspected;
- the mobile document width equaled the client width with no horizontal
  overflow;
- the shared theme control changed from dark to light and updated its
  accessible label and pressed state.

### Public app readback

The three public roots loaded in the user's OwnASquare Chrome profile with the
expected title, primary heading, input, and action. Console readback was empty.

The three health endpoints returned successful service/source responses:

- UnitPath Coach: `ok: true`, source
  `8401a058d0f55a7877a9560d630849a5dcc2e10b`.
- Split Ticket Rescue: `status: ok`, source
  `7b00530692f42dd3ce56ef3742a7990720698afc`.
- Move Thesis: `status: ok`, source
  `8962630975d3270e0ad9f6f600b16fe290bbcd9e`.

Fictional, non-sensitive primary-flow checks completed:

- UnitPath Coach returned a unit-checked coaching result for a kilometer-to-meter
  factor chain.
- Split Ticket Rescue returned ordered immediate actions, a decision tree,
  document guidance, and safety boundaries for its built-in fictional
  itinerary.
- Move Thesis returned assumptions, a countercase, failure modes, and a bounded
  experiment for a fictional smaller-city relocation idea.

These browser checks prove current public reachability and observed workflow
behavior. They do not replace each app's immutable hosted-release receipt,
provider certification, payment proof, customer proof, usage proof, demand
proof, or commercial proof.

## Release status

The parent-site library is publicly released:

- app-library source commit:
  `2c7d6512660ef08aebc83d726cc033e25decef6a`;
- GitHub `origin/main` read back at that exact commit after publication;
- Cloudflare parent Worker version:
  `10a4377d-ae81-4e19-8ffa-04ba89c8453b`;
- stable Worker route:
  <https://ownasquare-platform.ownasquare-com.workers.dev>;
- public library:
  <https://ownasquare.com/apps/>.

The deployment used the existing named `ownasquare` Wrangler profile. A stale
shell-level Cloudflare account override initially pointed a read-only query at
the Beladed account; that query failed closed before mutation. The release
invocation explicitly removed only that override and then read back the
OwnASquare account, existing parent deployment history, and new version.

Production `/apps/` validation confirmed:

- HTTP 200 at the apex route;
- all expected security headers, including HSTS, CSP, frame denial, content-type
  protection, referrer policy, permissions policy, and cross-origin opener
  policy;
- three rendered library cards and six exact hosted/source destinations;
- desktop dark and mobile light layouts;
- a working theme switch with updated accessible state;
- no horizontal overflow at the mobile viewport;
- no warning or error entries in the inspected browser console.

The terminal initially selected the stored `beladed-sites` GitHub identity, so
the first push was correctly rejected. The already stored `ownasquare` identity
was selected temporarily, the exact commit was pushed, and `beladed-sites` was
restored as the default immediately afterward.

No app Worker, app Custom Domain, DNS record, central publisher, release-state
helper, pending receipt, or app-level hosted certification was changed. The
three app entries therefore remain accurately labeled `Public preview`.

## Filterable catalog expansion

The library was expanded later on July 28 from three featured previews to a
reviewed catalog snapshot of all 50 public OwnASquare app repositories. The
parent repository and an unrelated technical-challenge repository were excluded
from the app inventory.

The catalog now provides:

- a desktop left-side filter panel and a collapsible mobile filter panel;
- 23 normalized category options, with multi-select support;
- Personal, Education, and Business use-case filters;
- Simple (about 2 clicks), Moderate (about 5 clicks), and Full dashboard
  interaction-shape filters;
- Public preview and Source only availability filters;
- a disabled Popular demand option with a zero count and explanatory copy;
- a responsive card for every app, including an explicit
  `Hosted preview not available` state for source-only apps; and
- a clear action, live result count, selected-filter count, and no-results
  state.

Selections are ORed within one filter group and ANDed across different groups.
The simplicity labels are reviewed interaction-shape classifications, not
universal measured click counts.

Exactly three cards retain their independently verified public-preview links:
UnitPath Coach, Split Ticket Rescue, and Move Thesis. The remaining 47 cards
link only to their public GitHub repositories. No verified request-total source
exists yet, so no app is labeled as popular demand and that filter cannot be
selected.

### Expanded implementation

- `public/apps/catalog-data.js`: 50 reviewed catalog records and normalized
  classification data.
- `public/apps/catalog.js`: pure filter semantics plus safe DOM rendering and
  mobile control behavior.
- `public/apps/index.html`: catalog structure, filter groups, availability
  explanation, and no-JavaScript fallback.
- `public/styles.css`: sticky desktop filter panel, responsive cards, mobile
  controls, and complete interaction/theme states.
- `tests/site.test.js`: catalog data-contract, URL, classification, preview
  count, demand-state, and filter-semantics coverage.
- `tests/e2e/home.spec.js`: initial catalog, representative links, compound
  filtering, clear/empty states, and mobile-panel coverage.
- `docs/superpowers/plans/2026-07-28-filterable-app-catalog.md`: TDD
  implementation and release plan.

### Expanded validation and release

`npm run check` passed after the expansion:

- 15 Node tests passed;
- 24 Playwright E2E checks passed across phone, tablet, and desktop;
- Wrangler deployment dry-run read 10 assets successfully.

Local browser QA additionally caught and resolved two issues before release:

- separate internal Privacy and Security keys produced one duplicate-facing
  label, so they were normalized to one category; and
- the selected-filter count remained visible at zero because a catalog display
  rule overrode the HTML `hidden` state, so an explicit hidden-state rule was
  added.

The expanded source was published in commit `307b273` and deployed as parent
Worker version `4bb02eaa-3e1a-4bec-8a14-7751a2df1c85`. Only the
`ownasquare-platform` Worker was deployed.

Production readback at <https://ownasquare.com/apps/> confirmed:

- the apex and stable Worker routes returned the same new HTML ETag;
- HTTP 200 and the existing HSTS, CSP, frame, content-type, referrer,
  permissions, and cross-origin opener protections;
- 50 rendered cards, 23 category filters, three public-preview cards, and 47
  source-only cards;
- Popular demand remained disabled at zero pending verified request totals;
- Education + Personal + Simple narrowed the list to UnitPath Coach;
- clearing filters restored all 50 cards;
- the canonical route loaded the catalog module after an initial stale Chrome
  cache read;
- desktop and 375-pixel mobile layouts had no horizontal overflow;
- the mobile filter panel expanded correctly and the light/dark theme control
  preserved its accessible label; and
- all three preview roots plus representative GitHub source links returned
  HTTP 200.

The initial Chrome navigation immediately after deployment showed the old
three-card asset. Read-only HTTP checks then showed the new apex and
`workers.dev` HTML with a matching ETag and cache miss; a cache-busted browser
navigation loaded the new catalog, and a later navigation to the canonical URL
also loaded all 50 cards. No broad cache purge was required.

This catalog expansion does not alter or supersede any individual app Worker,
Custom Domain, DNS record, release receipt, central publisher/state helper, or
frozen app-level certification.
