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

const TEST_RECIPIENT = "team@example.com";

function createEmailEnvironment() {
  const sent = [];
  const env = {
    ...createAssetEnvironment(),
    CONTACT_RECIPIENT: TEST_RECIPIENT,
    EMAIL: {
      async send(message) {
        sent.push(message);
        return { messageId: "test-message-id" };
      },
    },
  };
  return { env, sent };
}

const validContact = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  subject: "Hello",
  message: "I love the apps.",
};

function contactRequest(body, init = {}) {
  return new Request("https://ownasquare.com/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    ...init,
  });
}

test("contact endpoint rejects non-POST methods", async () => {
  const response = await worker.fetch(
    new Request("https://ownasquare.com/api/contact"),
    createAssetEnvironment(),
  );

  assert.equal(response.status, 405);
  assert.equal(response.headers.get("Allow"), "POST");
});

test("contact endpoint validates required fields", async () => {
  const { env } = createEmailEnvironment();
  const response = await worker.fetch(
    contactRequest({ name: "", email: "not-an-email", message: "" }),
    env,
  );

  assert.equal(response.status, 422);
  const payload = await response.json();
  assert.equal(payload.ok, false);
  assert.deepEqual(payload.fields.sort(), ["email", "message", "name"]);
});

test("contact endpoint sends a message and replies to the visitor", async () => {
  const { env, sent } = createEmailEnvironment();
  const response = await worker.fetch(contactRequest(validContact), env);

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), {
    ok: true,
    message: "Thanks — your message is on its way.",
  });
  assert.equal(sent.length, 1);
  assert.equal(sent[0].to, TEST_RECIPIENT);
  assert.equal(sent[0].from.email, "noreply@ownasquare.com");
  assert.equal(sent[0].replyTo, "ada@example.com");
  assert.match(sent[0].subject, /^\[Contact\] Hello$/);
  assert.match(sent[0].text, /I love the apps\./);
});

test("contact endpoint silently accepts honeypot submissions without sending", async () => {
  const { env, sent } = createEmailEnvironment();
  const response = await worker.fetch(
    contactRequest({ ...validContact, company: "spam-bot" }),
    env,
  );

  assert.equal(response.status, 200);
  assert.equal((await response.json()).ok, true);
  assert.equal(sent.length, 0);
});

test("contact endpoint escapes HTML in the generated email body", async () => {
  const { env, sent } = createEmailEnvironment();
  await worker.fetch(
    contactRequest({ ...validContact, message: "<script>alert(1)</script>" }),
    env,
  );

  assert.match(sent[0].html, /&lt;script&gt;/);
  assert.doesNotMatch(sent[0].html, /<script>/);
});

test("contact endpoint reports a friendly error when email is not configured", async () => {
  const response = await worker.fetch(
    contactRequest(validContact),
    createAssetEnvironment(),
  );

  assert.equal(response.status, 503);
  const payload = await response.json();
  assert.equal(payload.ok, false);
  assert.match(payload.error, /hello@ownasquare\.com/);
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

