import assert from "node:assert/strict";
import { access } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

import { catalogApps } from "../public/apps/catalog-data.js";
import { previewBatch } from "../scripts/deploy-hosted-preview-batch.mjs";
import {
  remainingPreviews,
  workspaceRoot,
} from "../scripts/deploy-remaining-previews.mjs";

const originalPreviews = [
  "move-thesis",
  "split-ticket-rescue",
  "unitpath-coach",
];

const pilotPreviews = [
  "cleanout-reach-map",
  "coverage-letter-map",
  "laundry-odor-triage",
  "ncr-family-lens",
  "session-minute-ledger",
];

test("remaining fleet is unique and covers every unassigned catalog app", async () => {
  const remainingSlugs = remainingPreviews.map(({ slug }) => slug);
  assert.equal(remainingSlugs.length, 24);
  assert.equal(new Set(remainingSlugs).size, remainingSlugs.length);

  const fleet = new Set([
    ...originalPreviews,
    ...pilotPreviews,
    ...previewBatch.map(({ slug }) => slug),
    ...remainingSlugs,
  ]);
  assert.equal(fleet.size, 50);
  assert.deepEqual(
    [...fleet].sort(),
    catalogApps.map(({ slug }) => slug).sort(),
  );

  for (const entry of remainingPreviews) {
    assert.match(entry.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    await access(path.join(workspaceRoot, entry.repositoryPath));
  }
});

test("showcase previews disclose that full processing is source-hosted", async () => {
  const source = await import("node:fs/promises").then(({ readFile }) =>
    readFile(
      path.join(
        workspaceRoot,
        "ownasquare/scripts/deploy-remaining-previews.mjs",
      ),
      "utf8",
    ),
  );

  assert.match(source, /read-only interface and workflow tour/i);
  assert.match(source, /Full processing stays with the source/i);
  assert.match(source, /pattern: `\$\{entry\.slug\}\.ownasquare\.com`/);
  assert.doesNotMatch(source, /pattern: "ownasquare\.com"/);
  assert.doesNotMatch(source, /pattern: "www\.ownasquare\.com"/);
});
