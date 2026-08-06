import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { catalogApps } from "../public/apps/catalog-data.js";
import { filterCatalog } from "../public/apps/catalog.js";

const siteRoot = new URL("../public/", import.meta.url);
const wranglerConfig = new URL("../wrangler.jsonc", import.meta.url);

test("homepage states the hosted and self-hosted choices honestly", async () => {
  const html = await readFile(new URL("index.html", siteRoot), "utf8");

  assert.match(html, /One account\./);
  assert.match(html, /A thousand focused tools\./);
  assert.match(html, /Hosted by OwnASquare/);
  assert.match(html, /Open source/);
  assert.match(html, /coming soon/i);
});

test("homepage includes baseline accessibility and responsive metadata", async () => {
  const html = await readFile(new URL("index.html", siteRoot), "utf8");

  assert.match(html, /name="viewport"/);
  assert.match(html, /class="skip-link"/);
  assert.match(html, /id="main"/);
  assert.match(html, /data-theme-toggle/);
  assert.match(html, /prefers-color-scheme/);
});

test("homepage links to the founder adventure", async () => {
  const html = await readFile(new URL("index.html", siteRoot), "utf8");

  assert.match(html, /href="\/adventure\/"/);
  assert.match(html, />The Adventure</);
});

test("public pages link to the app library", async () => {
  const homepage = await readFile(new URL("index.html", siteRoot), "utf8");
  const adventure = await readFile(
    new URL("adventure/index.html", siteRoot),
    "utf8",
  );

  assert.match(homepage, /href="\/apps\/"/);
  assert.match(adventure, /href="\/apps\/"/);
});

test("app library exposes a filterable catalog shell", async () => {
  const html = await readFile(new URL("apps/index.html", siteRoot), "utf8");

  assert.match(html, /data-filter-group="category"/);
  assert.match(html, /data-filter-group="useCases"/);
  assert.match(html, /data-filter-group="simplicity"/);
  assert.match(html, /data-filter-group="availability"/);
  assert.match(html, /data-catalog-grid/);
  assert.match(html, /data-result-count/);
  assert.match(html, /data-clear-filters/);
  assert.match(html, /catalog\.js/);
  assert.match(
    html,
    /Production\s+certification\s+is still in progress/,
  );
});

test("catalog contains every reviewed public app with truthful availability", () => {
  assert.equal(catalogApps.length, 50);
  assert.equal(new Set(catalogApps.map(({ slug }) => slug)).size, 50);
  assert.equal(new Set(catalogApps.map(({ name }) => name)).size, 50);

  const allowedUseCases = new Set(["personal", "education", "business"]);
  const allowedSimplicity = new Set(["simple", "moderate", "dashboard"]);
  const allowedAvailability = new Set(["preview", "source"]);

  for (const app of catalogApps) {
    assert.equal(
      app.sourceUrl,
      `https://github.com/ownasquare/${app.slug}`,
    );
    assert.ok(app.category);
    assert.ok(app.categoryLabel);
    assert.ok(app.useCases.length > 0);
    assert.ok(app.useCases.every((useCase) => allowedUseCases.has(useCase)));
    assert.ok(allowedSimplicity.has(app.simplicity));
    assert.ok(allowedAvailability.has(app.availability));
    assert.equal(app.popularDemand, false);

    if (app.availability === "preview") {
      assert.equal(
        app.previewUrl,
        app.slug === "context-loom"
          ? "https://context-loom.ownasquare.com/?demo=1"
          : `https://${app.slug}.ownasquare.com`,
      );
    } else {
      assert.equal(app.previewUrl, null);
    }
  }

  assert.equal(
    catalogApps.filter(({ availability }) => availability === "preview")
      .length,
    50,
  );
  assert.equal(
    catalogApps.filter(({ availability }) => availability === "source")
      .length,
    0,
  );
});

test("catalog filters use OR within groups and AND across groups", () => {
  const result = filterCatalog(catalogApps, {
    categories: new Set(["education", "travel"]),
    useCases: new Set(["personal"]),
    simplicity: new Set(["simple"]),
    availability: new Set(),
  });

  assert.ok(result.some(({ slug }) => slug === "unitpath-coach"));
  assert.ok(result.some(({ slug }) => slug === "split-ticket-rescue"));
  assert.ok(
    result.every(
      (app) =>
        ["education", "travel"].includes(app.category) &&
        app.useCases.includes("personal") &&
        app.simplicity === "simple",
    ),
  );

  assert.equal(
    filterCatalog(catalogApps, {
      categories: new Set(["finance"]),
      useCases: new Set(["education"]),
      simplicity: new Set(["simple"]),
      availability: new Set(),
    }).length,
    0,
  );
});

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

test("every public page links to the contact page and uses the logo mark", async () => {
  const pages = ["index.html", "apps/index.html", "adventure/index.html"];

  for (const page of pages) {
    const html = await readFile(new URL(page, siteRoot), "utf8");
    assert.match(html, /href="\/contact-us\/"/, `${page} links to contact`);
    assert.match(
      html,
      /class="brand-mark-logo"[\s\S]*?src="\/ownasquare-logo\.png"/,
      `${page} uses the logo image`,
    );
    assert.doesNotMatch(html, /class="brand-mark"/, `${page} drops old mark`);
  }
});

test("contact page offers a working form plus a direct email fallback", async () => {
  const html = await readFile(new URL("contact-us/index.html", siteRoot), "utf8");

  assert.match(html, /<form[^>]*action="\/api\/contact"[^>]*method="post"/);
  assert.match(html, /data-contact-form/);
  assert.match(html, /name="name"/);
  assert.match(html, /name="email"/);
  assert.match(html, /name="message"/);
  assert.match(html, /name="company"/); // honeypot
  assert.match(html, /mailto:hello@ownasquare\.com/);
  assert.match(html, /<noscript>/);
  assert.match(html, /aria-current="page"/);
});

test("styles include mobile, tablet, desktop, dark, and reduced-motion rules", async () => {
  const css = await readFile(new URL("styles.css", siteRoot), "utf8");

  assert.match(css, /@media \(min-width: 44rem\)/);
  assert.match(css, /@media \(min-width: 64rem\)/);
  assert.match(css, /prefers-color-scheme: dark/);
  assert.match(css, /prefers-reduced-motion: no-preference/);
});

test("production assets pass through the Worker security-header layer", async () => {
  const config = JSON.parse(await readFile(wranglerConfig, "utf8"));

  assert.equal(config.assets.run_worker_first, true);
});

test("production binds both exact OwnASquare hostnames as custom domains", async () => {
  const config = JSON.parse(await readFile(wranglerConfig, "utf8"));

  assert.equal(config.workers_dev, true);
  assert.equal(config.preview_urls, false);
  assert.deepEqual(config.routes, [
    {
      pattern: "ownasquare.com",
      custom_domain: true,
    },
    {
      pattern: "www.ownasquare.com",
      custom_domain: true,
    },
  ]);
});
