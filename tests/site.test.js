import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

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

test("app library exposes verified hosted previews and public source", async () => {
  const html = await readFile(new URL("apps/index.html", siteRoot), "utf8");

  for (const slug of [
    "unitpath-coach",
    "split-ticket-rescue",
    "move-thesis",
  ]) {
    assert.match(html, new RegExp(`https://${slug}\\.ownasquare\\.com`));
    assert.match(
      html,
      new RegExp(`https://github\\.com/ownasquare/${slug}`),
    );
  }

  assert.match(html, /Public preview/);
  assert.match(html, /Production certification is still in progress/);
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
