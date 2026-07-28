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
