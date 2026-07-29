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
