# Filterable App Catalog Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand `/apps/` from three preview cards into a truthful, filterable catalog of the 50 public OwnASquare app repositories.

**Architecture:** Keep the existing static Cloudflare Worker site and add a small catalog data module plus a progressively enhanced renderer/filter controller. Filters use OR semantics within category, use-case, simplicity, and availability groups, then AND the active groups together. Hosted availability and verified demand are separate fields so a public repository never implies a working preview or a popular-demand claim.

**Tech Stack:** Static HTML/CSS/ES modules, Node test runner, Playwright E2E, Cloudflare Worker Static Assets.

---

## File map

- Create `public/apps/catalog-data.js`: reviewed public catalog records, exact GitHub destinations, classifications, availability, and demand state.
- Create `public/apps/catalog.js`: pure filter logic, safe card rendering, filter-state updates, result count, empty state, clear action, and mobile filter disclosure.
- Modify `public/apps/index.html`: catalog shell, filter controls, result toolbar, grid mount, no-JavaScript fallback, and truthful availability/demand copy.
- Modify `public/styles.css`: left filter panel, compact catalog cards, badges, responsive drawer treatment, focus/checked/disabled/empty states, and dark-mode parity.
- Modify `tests/site.test.js`: data integrity, allowed classifications, exact preview/source contracts, and filter semantics.
- Modify `tests/e2e/home.spec.js`: rendered catalog count, compound filter behavior, clear behavior, empty state, mobile filter control, and existing preview/source link preservation.
- Update `docs/ownasquare/2026-07-28-app-library.md`: catalog expansion, proof layers, release commit/version, and known demand-data boundary.

### Task 1: Add failing catalog data and filter contracts

- [ ] **Step 1: Write the failing source tests**

Add tests that import `catalogApps` and `filterCatalog`, then require:

```js
assert.equal(catalogApps.length, 50);
assert.equal(new Set(catalogApps.map(({ slug }) => slug)).size, 50);
assert.equal(
  catalogApps.filter(({ availability }) => availability === "preview").length,
  3,
);
assert.equal(
  filterCatalog(catalogApps, {
    categories: new Set(["education"]),
    useCases: new Set(["personal"]),
    simplicity: new Set(["simple"]),
    availability: new Set(),
  }).some(({ slug }) => slug === "unitpath-coach"),
  true,
);
```

Validate every source URL against `https://github.com/ownasquare/<slug>`, restrict use cases to `personal`, `education`, or `business`, restrict simplicity to `simple`, `moderate`, or `dashboard`, and require `popularDemand` to be `false` until a verified request count exists.

- [ ] **Step 2: Run `npm test` and confirm the missing module failure**

Expected: failure because `public/apps/catalog-data.js` and `public/apps/catalog.js` do not exist.

### Task 2: Add the reviewed catalog model and pure filtering

- [ ] **Step 1: Create `catalog-data.js`**

Represent all 50 public app repositories as:

```js
{
  slug: "unitpath-coach",
  name: "UnitPath Coach",
  description: "Find the first broken step in a chemistry factor chain without handing over the answer.",
  category: "education",
  categoryLabel: "Education",
  useCases: ["education", "personal"],
  simplicity: "simple",
  availability: "preview",
  previewUrl: "https://unitpath-coach.ownasquare.com",
  sourceUrl: "https://github.com/ownasquare/unitpath-coach",
  popularDemand: false,
}
```

Use `availability: "source"` and `previewUrl: null` for repositories without a verified hosted preview.

- [ ] **Step 2: Create the pure `filterCatalog` function**

```js
const matchesGroup = (selected, values) =>
  selected.size === 0 || values.some((value) => selected.has(value));

export function filterCatalog(apps, filters) {
  return apps.filter((app) =>
    matchesGroup(filters.categories, [app.category]) &&
    matchesGroup(filters.useCases, app.useCases) &&
    matchesGroup(filters.simplicity, [app.simplicity]) &&
    matchesGroup(
      filters.availability,
      [
        app.availability,
        ...(app.popularDemand ? ["popular"] : []),
      ],
    ),
  );
}
```

- [ ] **Step 3: Run `npm test`**

Expected: catalog integrity and compound filter tests pass.

### Task 3: Replace the three-card section with the accessible catalog shell

- [ ] **Step 1: Add the filter panel**

Add checkbox groups for:

- Category: all category values generated from the data module.
- Use case: Personal, Education, Business.
- Simplicity: Simple · about 2 clicks, Moderate · about 5 clicks, Full dashboard.
- Availability: Public preview, Source only, Popular demand.

The popular-demand option is disabled at count zero and explains that the badge requires verified request totals.

- [ ] **Step 2: Add the result toolbar and grid mount**

Use:

```html
<p data-result-count aria-live="polite">Loading the catalog…</p>
<button type="button" data-clear-filters disabled>Clear filters</button>
<div class="catalog-grid" data-catalog-grid></div>
<div class="catalog-empty" data-empty-state hidden>
  <h3>No apps match this combination yet.</h3>
  <button type="button" data-empty-clear>Clear filters</button>
</div>
```

- [ ] **Step 3: Render cards without unsafe HTML interpolation**

Build elements through `document.createElement`, set `textContent`, and assign reviewed URLs directly. Preview cards keep both actions. Source-only cards show a noninteractive `Hosted preview not available` status plus the public-source action.

- [ ] **Step 4: Add mobile filter toggle behavior**

The toggle updates `aria-expanded`, panel visibility, and label text. The desktop breakpoint leaves the filter panel visible and sticky.

### Task 4: Style the catalog against the shipped OwnASquare system

- [ ] **Step 1: Add desktop layout**

Use a two-column shell with a 16–18rem sticky filter panel and a responsive two-card result grid. Reuse current surface, line, ink, muted, accent, lime, radius, shadow, and focus tokens.

- [ ] **Step 2: Add interaction states**

Define visible checked filters, hover/focus-visible cards and actions, disabled popular-demand filter, source-only status, selected-count badge, clear controls, and empty state.

- [ ] **Step 3: Add mobile/tablet behavior**

Below 64rem, place the filter toggle above the results, collapse the panel, use one card column, and preserve a minimum 44px target size. Confirm no horizontal overflow.

- [ ] **Step 4: Verify light/dark parity and reduced motion**

All new controls use existing theme variables; motion stays inside the existing `prefers-reduced-motion: no-preference` contract.

### Task 5: Extend Playwright E2E

- [ ] **Step 1: Assert initial catalog state**

Require 50 cards, `50 apps`, the three exact preview links, and representative source-only cards.

- [ ] **Step 2: Exercise a compound filter**

Check Education, Personal, and Simple, then assert UnitPath Coach remains while unrelated cards are hidden and the count updates.

- [ ] **Step 3: Exercise clear and empty states**

Clear all filters and verify 50 cards return. Select a valid combination with no result, verify the empty state, and clear it.

- [ ] **Step 4: Exercise the mobile filter panel**

At the phone project, open the filter control, verify `aria-expanded`, select a filter, and confirm the grid and result count update.

- [ ] **Step 5: Run `npm run check`**

Expected: current type generation, Node tests, all Playwright projects, and Wrangler dry-run pass.

### Task 6: Rendered validation, publication, and production readback

- [ ] **Step 1: Start the local Worker and validate through the Browser workflow**

Check page identity, nonblank DOM, no overlay, warning/error console, desktop screenshot, mobile screenshot, compound filtering, clear behavior, and empty state.

- [ ] **Step 2: Update completion documentation**

Record exact catalog count, classifications, truth boundaries, test results, and source/hosted/provider proof separately.

- [ ] **Step 3: Commit and publish**

Commit the tested implementation, temporarily select the already stored authorized OwnASquare GitHub identity, push `main`, then restore the previous default identity.

- [ ] **Step 4: Deploy only `ownasquare-platform`**

Use the named `ownasquare` Wrangler profile with unrelated ambient account identity explicitly unset through the secret-safe launcher. Do not change app Workers, app domains, DNS, central publisher, or app release receipts.

- [ ] **Step 5: Read back production**

Verify `https://ownasquare.com/apps/`, all 50 records, filters, preview/source actions, console, security headers, desktop/mobile layouts, and the exact Worker version.

## Self-review

- Spec coverage: left filters, multi-select category range, three use-case values, three simplicity levels, card view, unavailable previews, and conditional popular-demand state are all assigned to tasks.
- Placeholder scan: no `TBD`, `TODO`, or undefined implementation step remains.
- Type consistency: `category`, `useCases`, `simplicity`, `availability`, and `popularDemand` use the same values in data, filtering, rendering, and tests.
