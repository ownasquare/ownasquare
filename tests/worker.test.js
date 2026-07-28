import assert from "node:assert/strict";
import test from "node:test";

import worker, { SECURITY_HEADERS } from "../src/index.js";

const assetBody = "<!doctype html><title>OwnASquare</title>";

function createAssetEnvironment() {
  return {
    ASSETS: {
      async fetch() {
        return new Response(assetBody, {
          headers: {
            "Content-Type": "text/html; charset=utf-8",
          },
        });
      },
    },
  };
}

test("health endpoint returns a stable ready response", async () => {
  const response = await worker.fetch(
    new Request("https://ownasquare.com/api/health"),
    createAssetEnvironment(),
  );

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), {
    ok: true,
    service: "ownasquare-platform",
    status: "ready",
  });
  assert.equal(response.headers.get("Cache-Control"), "no-store");
});

test("health endpoint rejects unsupported methods with a friendly error", async () => {
  const response = await worker.fetch(
    new Request("https://ownasquare.com/api/health", {
      method: "POST",
    }),
    createAssetEnvironment(),
  );

  assert.equal(response.status, 405);
  assert.equal(response.headers.get("Allow"), "GET, HEAD");
  assert.deepEqual(await response.json(), {
    error: "That action is not available here.",
    ok: false,
  });
});

test("unknown API paths do not fall through to the SPA", async () => {
  const response = await worker.fetch(
    new Request("https://ownasquare.com/api/missing"),
    createAssetEnvironment(),
  );

  assert.equal(response.status, 404);
  assert.deepEqual(await response.json(), {
    error: "We could not find that service.",
    ok: false,
  });
});

test("static assets retain their content and receive security headers", async () => {
  const response = await worker.fetch(
    new Request("https://ownasquare.com/"),
    createAssetEnvironment(),
  );

  assert.equal(response.status, 200);
  assert.equal(await response.text(), assetBody);

  for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
    assert.equal(response.headers.get(name), value);
  }
});

