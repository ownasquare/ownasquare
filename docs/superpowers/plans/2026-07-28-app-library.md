# OwnASquare App Library Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a public OwnASquare app library that links each currently reachable hosted app to its verified public GitHub repository without overstating hosted-release certification.

**Architecture:** Keep the existing static-site and Cloudflare Worker architecture. Add a static `/apps/` route, reuse the shared header, theme script, and design tokens, and encode the three provider-verified app records directly in accessible HTML so the library remains useful without JavaScript.

**Tech Stack:** Semantic HTML, shared CSS, vanilla JavaScript theme control, Node test runner, Playwright E2E, Cloudflare Workers Static Assets.

---

### Task 1: Add failing source-contract coverage

**Files:**
- Modify: `tests/site.test.js`

- [ ] **Step 1: Add the app-library source contract**

```js
test("app library exposes verified hosted previews and public source", async () => {
  const html = await readFile(new URL("apps/index.html", siteRoot), "utf8");

  for (const slug of [
    "unitpath-coach",
    "split-ticket-rescue",
    "move-thesis",
  ]) {
    assert.match(html, new RegExp(`https://${slug}\\.ownasquare\\.com`));
    assert.match(html, new RegExp(`https://github\\.com/ownasquare/${slug}`));
  }

  assert.match(html, /Public preview/);
  assert.match(html, /Production certification is still in progress/);
});
```

- [ ] **Step 2: Run the focused suite and confirm the missing page fails**

Run: `npm test`

Expected: FAIL because `public/apps/index.html` does not exist.

### Task 2: Build the accessible app library

**Files:**
- Create: `public/apps/index.html`
- Modify: `public/styles.css`

- [ ] **Step 1: Create the semantic library page**

Add a shared header with `Apps` marked `aria-current="page"`, a concise library hero, and three `<article class="library-card">` records. Each record contains one accurate problem statement, a `Public preview` status, an exact hosted URL, and an exact public GitHub URL. Include the explicit note:

```html
<p class="library-proof-note">
  Each preview loaded from its public OwnASquare address on July 28, 2026.
  Production certification is still in progress.
</p>
```

- [ ] **Step 2: Add responsive card, status, and link styles**

Extend the existing design tokens with:

```css
.library-grid {
  display: grid;
  gap: 1rem;
}

.library-card {
  display: flex;
  flex-direction: column;
  min-height: 25rem;
  padding: clamp(1.35rem, 4vw, 2rem);
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius-medium);
}

@media (min-width: 64rem) {
  .library-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
```

- [ ] **Step 3: Run source tests**

Run: `npm test`

Expected: PASS.

### Task 3: Connect the library to every public page

**Files:**
- Modify: `public/index.html`
- Modify: `public/adventure/index.html`
- Modify: `tests/site.test.js`

- [ ] **Step 1: Add the Apps navigation tab**

Use this shared ordering everywhere:

```html
<a class="nav-tab" href="/">Home</a>
<a class="nav-tab" href="/apps/">Apps</a>
<a class="nav-tab" href="/adventure/">The Adventure</a>
```

Only `/apps/` marks Apps current.

- [ ] **Step 2: Replace the homepage launch note with a library link**

```html
<p class="launch-note">
  Three public app previews are available now.
  <a href="/apps/">Explore the app library.</a>
</p>
```

- [ ] **Step 3: Assert all pages link to the library**

Read `index.html` and `adventure/index.html` and assert `href="/apps/"` appears in both.

- [ ] **Step 4: Run source tests**

Run: `npm test`

Expected: PASS.

### Task 4: Add rendered navigation and link proof

**Files:**
- Modify: `tests/e2e/home.spec.js`

- [ ] **Step 1: Add the library navigation test**

```js
test("the app library connects each public preview to its source", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Apps" }).click();

  await expect(page).toHaveURL(/\/apps\/$/);
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Small tools. Ready to try.",
    }),
  ).toBeVisible();
  await expect(page.locator(".library-card")).toHaveCount(3);
  await expect(page.getByRole("link", { name: "Open UnitPath Coach" })).toHaveAttribute(
    "href",
    "https://unitpath-coach.ownasquare.com",
  );
});
```

- [ ] **Step 2: Run the complete validation gate**

Run: `npm run check`

Expected: type generation, Node tests, Playwright phone/tablet/desktop projects, and Wrangler dry run all PASS.

### Task 5: Publish and verify the exact source

**Files:**
- Modify: `docs/ownasquare/2026-07-28-app-library.md`
- Create: `docs/handoffs/2026-07-28-codex-ownasquare-app-library.handoff.mdc`

- [ ] **Step 1: Record local and provider proof separately**

Document source/test results, the three public-repository readbacks, the three browser-loaded hosted roots, and the app-level certification limitation.

- [ ] **Step 2: Commit and push the validated source**

Run:

```bash
git add public tests docs
git commit -m "Add the OwnASquare app library"
git push origin main
```

Expected: remote `main` includes the validated commit.

- [ ] **Step 3: Deploy the parent Worker**

Run the existing OwnASquare deployment path from the exact validated commit.

Expected: `ownasquare-platform` publishes the new `/apps/` static route without changing app Workers, DNS, credentials, or central hosted-release records.

- [ ] **Step 4: Verify the public library in Chrome**

Check page identity, meaningful DOM, console health, desktop and mobile screenshots, theme switching, the three hosted links, and the three GitHub links. Preserve the user’s Cloudflare and OwnASquare tabs at handoff.
