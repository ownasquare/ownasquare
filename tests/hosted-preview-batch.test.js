import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

import {
  previewBatch,
  workspaceRoot,
} from "../scripts/deploy-hosted-preview-batch.mjs";

test("static preview batch has unique, deployable catalog entries", async () => {
  const slugs = previewBatch.map((entry) => entry.slug);
  assert.equal(new Set(slugs).size, slugs.length);

  const catalogSource = await readFile(
    path.join(workspaceRoot, "ownasquare/public/apps/catalog-data.js"),
    "utf8",
  );

  for (const entry of previewBatch) {
    assert.match(entry.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.ok(
      catalogSource.includes(`slug: "${entry.slug}"`),
      `${entry.slug} must exist in the app catalog`,
    );
    const repositoryDirectory = path.join(
      workspaceRoot,
      entry.repositoryPath,
    );
    await access(path.join(repositoryDirectory, "package.json"));
  }
});
