# OwnASquare Adventure Video Journal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a prominent “The Adventure” homepage navigation tab and a dedicated, responsive story page that introduces the founder’s thousand-app journey and the video chapters that will document it.

**Architecture:** Keep the site dependency-free and static. Add one directory-indexed HTML route at `public/adventure/index.html`, share the existing theme script and core stylesheet, and extend the current design system with navigation, story, video-journal, and timeline primitives. Preserve truthful product language by labeling unpublished recordings as upcoming rather than presenting fake videos.

**Tech Stack:** Semantic HTML, modern CSS, vanilla JavaScript, Cloudflare Worker Static Assets, Node test runner, Playwright E2E, Wrangler 4.

---

## File Structure

- `public/index.html`: add the shared primary navigation with the adventure link.
- `public/adventure/index.html`: own the founder story, journal introduction, five video chapter cards, and the journey principles.
- `public/styles.css`: add shared navigation and page-specific responsive story styles.
- `tests/site.test.js`: assert the new route, navigation, truthful video states, and required story subjects.
- `tests/e2e/home.spec.js`: prove homepage-to-adventure navigation, page identity, responsive layout, and theme behavior.
- `docs/ownasquare/2026-07-27-completion.md`: record the delivered route, validation, deployment, and remaining content dependency.

### Task 1: Add failing source-contract tests

**Files:**
- Modify: `tests/site.test.js`
- Test: `tests/site.test.js`

- [ ] **Step 1: Write the failing homepage navigation test**

```js
test("homepage links to the founder adventure", async () => {
  const html = await readFile(new URL("index.html", siteRoot), "utf8");

  assert.match(html, /href="\/adventure\/"/);
  assert.match(html, />The Adventure</);
});
```

- [ ] **Step 2: Write the failing adventure-page content test**

```js
test("adventure page tells the useful-app story without inventing published videos", async () => {
  const html = await readFile(
    new URL("adventure/index.html", siteRoot),
    "utf8",
  );

  assert.match(html, /The Adventure/);
  assert.match(html, /five years/i);
  assert.match(html, /high-pain/i);
  assert.match(html, /tools I use/i);
  assert.match(html, /How I choose what to build/i);
  assert.match(html, /Recording soon/i);
  assert.doesNotMatch(html, /<iframe/i);
  assert.match(html, /aria-current="page"/);
});
```

- [ ] **Step 3: Run the focused tests and confirm failure**

Run: `node --test tests/site.test.js`

Expected: the two new tests fail because the navigation link and adventure page do not exist.

### Task 2: Add the shared top navigation and story page

**Files:**
- Modify: `public/index.html`
- Create: `public/adventure/index.html`
- Test: `tests/site.test.js`

- [ ] **Step 1: Add the navigation to the homepage header**

Insert between the brand and theme control:

```html
<nav class="primary-nav" aria-label="Primary">
  <a class="nav-tab" href="/" aria-current="page">Home</a>
  <a class="nav-tab" href="/adventure/">The Adventure</a>
</nav>
```

- [ ] **Step 2: Create the adventure page with the shared head and header**

Use this route identity and header:

```html
<meta
  name="description"
  content="Follow the personal journey behind OwnASquare and the attempt to build one thousand genuinely useful apps."
/>
<title>The Adventure — Building 1,000 Useful Apps | OwnASquare</title>
```

```html
<header class="site-header">
  <a class="brand" href="/" aria-label="OwnASquare home">...</a>
  <nav class="primary-nav" aria-label="Primary">
    <a class="nav-tab" href="/">Home</a>
    <a class="nav-tab" href="/adventure/" aria-current="page">The Adventure</a>
  </nav>
  <button class="theme-toggle" type="button" data-theme-toggle>...</button>
</header>
```

- [ ] **Step 3: Add the founder-story hero**

```html
<section class="story-hero" aria-labelledby="story-title">
  <div class="story-hero-copy">
    <p class="eyebrow">
      <span class="status-dot" aria-hidden="true"></span>
      The story behind 1,000 apps
    </p>
    <h1 id="story-title">Build what people need. Share every lesson.</h1>
    <p class="story-lede">
      I spent five years building a startup that went nowhere because it was
      not useful enough. This is the reset: one thousand small apps, each
      chosen because a real problem is painful, urgent, and worth solving.
    </p>
    <a class="primary-action" href="#journal">Watch the journey unfold</a>
  </div>
  <aside class="story-manifesto" aria-label="The OwnASquare build promise">
    <span>1,000 useful apps</span>
    <strong>No more building in the dark.</strong>
    <p>Find the pain. Build the smallest answer. Put it in people’s hands.</p>
  </aside>
</section>
```

- [ ] **Step 4: Add five truthful video-journal chapter cards**

Create cards for:

1. “The startup that taught me what not to build”
2. “Why 1,000 apps — and why usefulness comes first”
3. “How I choose what to build”
4. “The tools I use to move from pain point to working app”
5. “What the apps teach me after they meet real people”

Each card uses this complete semantic pattern:

```html
<article class="episode-card">
  <div class="episode-visual" aria-hidden="true">
    <span class="play-mark"></span>
    <span>01</span>
  </div>
  <div class="episode-copy">
    <p class="episode-state">Recording soon</p>
    <h3>The startup that taught me what not to build</h3>
    <p>
      The honest beginning: five years of effort, the cost of building without
      enough real need, and the lesson that changed the direction of my work.
    </p>
  </div>
</article>
```

- [ ] **Step 5: Add the journey principles**

```html
<ol class="principle-list">
  <li><span>01</span><div><h3>Start with pain</h3><p>The problem must be urgent, expensive, or painfully time-consuming.</p></div></li>
  <li><span>02</span><div><h3>Build the smallest useful answer</h3><p>Remove clicks, settings, and features until the result feels obvious.</p></div></li>
  <li><span>03</span><div><h3>Learn in public</h3><p>Share the tools, decisions, failures, and evidence instead of pretending the process is effortless.</p></div></li>
</ol>
```

- [ ] **Step 6: Run the source tests**

Run: `node --test tests/site.test.js`

Expected: all source-contract tests pass.

### Task 3: Extend the existing responsive design system

**Files:**
- Modify: `public/styles.css`
- Test: `tests/e2e/home.spec.js`

- [ ] **Step 1: Add the shared navigation styles**

```css
.primary-nav {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem;
  background: color-mix(in srgb, var(--surface) 76%, transparent);
  border: 1px solid var(--line);
  border-radius: 999px;
}

.nav-tab {
  padding: 0.55rem 0.8rem;
  color: var(--muted);
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 760;
  text-decoration: none;
}

.nav-tab[aria-current="page"] {
  color: var(--surface-strong);
  background: var(--ink);
}
```

- [ ] **Step 2: Add the story and journal layout**

```css
.story-hero {
  display: grid;
  gap: 2rem;
  padding: 5rem 0 4rem;
}

.story-hero h1 {
  max-width: 11ch;
}

.story-lede {
  max-width: 42rem;
  margin: 2rem 0 0;
  color: var(--muted);
  font-size: clamp(1.1rem, 3vw, 1.35rem);
}

.story-manifesto,
.episode-card {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius-medium);
}

.episode-grid {
  display: grid;
  gap: 1rem;
}

@media (min-width: 44rem) {
  .episode-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 64rem) {
  .story-hero {
    grid-template-columns: minmax(0, 1.25fr) minmax(20rem, 0.75fr);
    align-items: end;
  }

  .episode-card:first-child {
    grid-column: span 2;
  }
}
```

- [ ] **Step 3: Add mobile header behavior**

```css
@media (max-width: 43.99rem) {
  .site-header {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 0.75rem;
    padding-block: 1rem;
  }

  .primary-nav {
    grid-column: 1 / -1;
    justify-self: stretch;
  }

  .nav-tab {
    flex: 1;
    text-align: center;
  }
}
```

- [ ] **Step 4: Include navigation in focus and motion rules**

Add `.nav-tab:focus-visible` to the existing focus selector and `.nav-tab` to the existing reduced-motion-safe transition selector.

### Task 4: Add navigation and responsive E2E proof

**Files:**
- Modify: `tests/e2e/home.spec.js`
- Test: `tests/e2e/home.spec.js`

- [ ] **Step 1: Add the adventure navigation test**

```js
test("the adventure tab opens the founder journal at every supported size", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("link", { name: "The Adventure" }).click();

  await expect(page).toHaveURL(/\/adventure\/$/);
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Build what people need. Share every lesson.",
    }),
  ).toBeVisible();
  await expect(page.getByText("Recording soon")).toHaveCount(5);

  const pageWidth = await page.evaluate(
    () => document.documentElement.scrollWidth,
  );
  const viewportWidth = page.viewportSize()?.width;
  expect(pageWidth).toBeLessThanOrEqual(viewportWidth ?? pageWidth);
});
```

- [ ] **Step 2: Add the adventure theme test**

```js
test("the adventure page shares the same theme control", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/adventure/");

  const themeButton = page.getByRole("button", {
    name: "Switch to light mode",
  });
  await expect(themeButton).toBeVisible();
  await themeButton.click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
});
```

- [ ] **Step 3: Run the full local validation**

Run: `npm run check`

Expected: type generation, all Node tests, all Playwright phone/tablet/desktop tests, and the Wrangler dry run pass.

### Task 5: Render, deploy, and document

**Files:**
- Modify: `docs/ownasquare/2026-07-27-completion.md`
- Modify: `docs/handoffs/2026-07-27-codex-ownasquare-platform-foundation.handoff.mdc`
- Modify: `/Users/fortunevieyra/Documents/Github/beladed.com/docs/handoffs/2026-07-27-codex-ownasquare-platform-foundation.handoff.mdc`

- [ ] **Step 1: Validate the rendered target flow**

The flow under test is: homepage loads -> user activates “The Adventure” -> `/adventure/` renders the founder story and five upcoming video chapters -> theme control changes the page theme.

Use the Browser plugin when available. Verify page identity, meaningful DOM, no framework overlay, no relevant console errors or warnings, desktop and mobile screenshots, navigation, in-page journal jump, and theme interaction.

- [ ] **Step 2: Deploy with the existing OwnASquare Wrangler profile**

Run: `npm run deploy`

Expected: deployment reports the stable Worker URL plus exact `ownasquare.com` and `www.ownasquare.com` custom domains.

- [ ] **Step 3: Verify hosted production**

Check:

- `https://ownasquare.com/`
- `https://ownasquare.com/adventure/`
- `https://www.ownasquare.com/adventure/`
- `https://ownasquare-platform.ownasquare-com.workers.dev/adventure/`
- `/api/health`

Expected: HTTP 200, valid TLS, correct page titles and headings, security headers, working navigation, five truthful “Recording soon” states, and no horizontal overflow.

- [ ] **Step 4: Update completion and handoff evidence**

Record the exact changed files, test counts, Browser proof, hosted proof, commit SHA, push result, remaining video-content dependency, and the rule that recordings must not be presented as published until real media URLs are supplied and verified.

- [ ] **Step 5: Commit and push coherent changes**

Stage only the plan, HTML, CSS, tests, and OwnASquare documentation. Commit to `main`, push to `origin/main`, and verify the local and remote SHA match without changing any automation lane or unrelated domain.
