import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const siteRoot = new URL("../public/", import.meta.url);

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

