# OwnASquare Hosted Preview Fleet Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give every deployable source-only OwnASquare catalog app a verified public preview without bypassing the central release-attestation, identity, source, or proof contracts.

**Architecture:** Keep the catalog as the reviewed product inventory, classify each source-only repository by real runtime requirements, and release each app serially from an exact public GitHub SHA through the governed publisher. Static and hybrid web apps use Workers Static Assets when their tracked source fits the publisher contract; Pages is used only for genuinely static prebuilt sites whose release policy explicitly permits it; apps requiring local models, containers, durable databases, or private credentials receive a separately designed safe demonstration surface instead of pretending the original runtime is hosted. Every preview remains labeled `Public preview` until independent hosted proof and governed finalization succeed.

**Tech Stack:** Cloudflare Workers Static Assets, Cloudflare Pages where explicitly admitted, Wrangler 4.x, exact Custom Domains under `ownasquare.com`, JavaScript/TypeScript/Python application repositories, Playwright E2E, Node test runners, the OwnASquare receipt-driven publisher, and the existing catalog modules.

---

## Execution outcome (2026-07-29)

The user explicitly authorized direct Wrangler CLI publication through the
existing OwnASquare profile. The named profile was verified with read-only
provider inventory before mutation, and the inherited account selector was
removed from every command through the secret-safe launcher.

The public-preview objective is now complete:

- 50 of 50 catalog records have a live `https://<slug>.ownasquare.com`
  preview that returns HTTP 200 HTML.
- 50 of 50 catalog records have a public GitHub source URL that returns HTTP
  200.
- 34 apps expose their real static or client-side interface.
- 16 server-, Python-, model-, provider-, or local-runtime products expose
  clearly labeled read-only product tours. The tours do not claim to execute
  the unsupported private runtime.
- The parent catalog is deployed at `https://ownasquare.com/apps/` with
  category, use-case, simplicity, and availability filters.

The central immutable release-attestation contract described below remains a
separate requirement for formal production certification and source-SHA/provider
binding attestation. It is not the current truth for public preview
availability after this user-authorized rollout.

## Historical hard stop (superseded for this user-authorized preview rollout)

Execution must not advance to app source inspection, release edits, provider
preflight, deployment, or finalization until both conditions below are true:

1. `/Users/fortunevieyra/.codex/bin/codex-ownasquare-cloudflare-publish.py`
   has a centrally released, exact-hash active-release attestation contract
   whose active version equals required version `1`; and
2. a fresh governed identity receipt proves the intended OwnASquare Cloudflare
   user and account. The current default Wrangler `whoami` readback resolves to
   the Beladed account and therefore cannot authorize OwnASquare mutation.

The existing contract deliberately rejects `deploy` and `finalize` before
their execution locks and before provider or lane-state mutation. This plan
does not authorize changing that shared runtime, its mirrors, its watchers, or
its contract version without the central owner's explicit release window.

The remaining tasks in this plan are retained as historical context and future
release-hardening work. They must not be read as a statement that the public
preview fleet is currently unavailable.

### Task 1: Admit and verify the central release owner

**Files:**

- Verify:
  `/Users/fortunevieyra/.codex/bin/codex-ownasquare-cloudflare-publish.py`
- Verify:
  `/Users/fortunevieyra/.codex/bin/codex-app-factory-state.py`
- Verify:
  `/Users/fortunevieyra/.codex/tests/test_ownasquare_cloudflare_publish.py`
- Verify:
  `/Users/fortunevieyra/.codex/tests/test_app_factory_state.py`
- Verify:
  `/Users/fortunevieyra/Documents/Github/ownasquare.com/docs/1000-apps-100-days/2026-07-27-ownasquare-cloudflare-release-helper.md`

- [ ] **Step 1: Record explicit shared-runtime authority**

The central owner must name the exact writable files, starting hashes, planned
ending hashes, watcher lifecycle, mirror targets, validation suites, rollback
bytes, and release-receipt path. App-local tasks cannot provide this authority.

- [ ] **Step 2: Prove a complete contract-v1 release**

The released attestation must bind the active module bytes, Worker version,
100% traffic allocation, complete settings and bindings, secret metadata,
`workers_dev` and preview posture, sole Custom Domain ownership, and absence
of conflicting zone routes. The existing rejected transitional v1 delta is
not admissible.

- [ ] **Step 3: Verify the complete Playwright chronology invariant**

The publisher test and implementation must enforce:

```python
report_ended_at = report_started_at + timedelta(milliseconds=duration)
if not deployed_at <= report_started_at <= report_ended_at <= verified_at:
    raise ReleaseError("Playwright JSON report chronology is inconsistent")
```

Test exact boundary equality, one-millisecond lateness, zero, negative,
boolean, non-finite, overflow, and excessive duration.

- [ ] **Step 4: Run the frozen release validation**

Run the publisher, state-helper, launcher, compilation, mirror, watcher-cycle,
and fleet suites named by the central handoff. Expected result: every suite
passes, all production/test/live/snapshot files share one released tuple, and
the final receipt explicitly raises the governed contract to version `1`.

- [ ] **Step 5: Reauthenticate the OwnASquare provider identity**

Use a direct user-initiated Cloudflare login in the OwnASquare Chrome/profile
context. Do not request, store, print, or migrate tokens. Read back the
expected user/account digests through the governed publisher before any
provider preflight.

### Task 2: Rehydrate every applicable lane before repository work

**Files:**

- Read:
  `/Users/fortunevieyra/Documents/Github/ownasquare.com/docs/1000-apps-100-days/state/lane-01.json`
  through
  `/Users/fortunevieyra/Documents/Github/ownasquare.com/docs/1000-apps-100-days/state/lane-40.json`
- Read:
  `/Users/fortunevieyra/.codex/automations/1000-apps-lane-*/automation.toml`
- Read:
  `/Users/fortunevieyra/.codex/automations/1000-apps-lane-*/handoff.mdc`

- [ ] **Step 1: Run one fresh guard per lane**

Use the exact automation ID from each lane's home `automation.toml`. A
`decision=defer`, parser error, overlap, or missing result blocks that lane and
permits no repository inspection or mutation.

- [ ] **Step 2: Continue the bound app generation**

For each allowed lane, read state, claim, reservation, handoff, and next-step
queue before the app repository. Preserve the existing slug, generation,
public GitHub SHA, and immutable receipts.

- [ ] **Step 3: Exclude rejected or unowned candidates**

Only catalog entries backed by a current accepted app/repository identity
enter the release matrix. Qualification, GitHub publication, provider
deployment, hosted proof, and commercial proof remain separate fields.

### Task 3: Generate the 47-app deployment-readiness matrix

**Files:**

- Read:
  `/Users/fortunevieyra/Documents/Github/ownasquare.com/ownasquare/public/apps/catalog-data.js`
- Create:
  `/Users/fortunevieyra/Documents/Github/ownasquare.com/ownasquare/docs/ownasquare/hosted-preview-readiness.json`
- Create:
  `/Users/fortunevieyra/Documents/Github/ownasquare.com/ownasquare/docs/ownasquare/hosted-preview-readiness.md`
- Test:
  `/Users/fortunevieyra/Documents/Github/ownasquare.com/ownasquare/tests/hosted-preview-readiness.test.js`

- [ ] **Step 1: Write the failing inventory contract**

The test must assert that every catalog item with
`availability === "source"` appears exactly once in the readiness matrix, no
preview app is duplicated, slugs and source URLs match, and every record has:

```js
{
  slug,
  repositoryPath,
  publicSourceSha,
  laneId,
  runtimeClass,
  buildCommand,
  buildOutput,
  workerEntry,
  wranglerConfig,
  bindings,
  localValidation,
  releaseStatus,
  blocker
}
```

- [ ] **Step 2: Classify actual runtime requirements**

Use exactly one runtime class per app:

- `workers-static-assets`
- `workers-hybrid`
- `pages-static`
- `hosted-demo-required`
- `blocked-not-web-deployable`

Do not classify from README marketing copy alone. Inspect the build output,
network calls, storage, model, credential, container, file-system, and
background-process requirements.

- [ ] **Step 3: Fail closed on incomplete records**

The readiness test must reject missing SHAs, ambiguous build output, untracked
release inputs, undeclared bindings, private credentials, unsupported local
model assumptions, and any null blocker on an unready app.

- [ ] **Step 4: Publish the reviewed matrix**

The Markdown report must summarize counts by runtime class and list the exact
blocking evidence for every app that cannot yet be deployed.

### Task 4: Add governed Worker release files to eligible repositories

**Files per eligible app:**

- Create or modify: `<repository>/wrangler.jsonc`
- Create or modify: `<repository>/src/worker.js`
- Create or verify: `<repository>/public/` or `<repository>/dist/`
- Create: `<repository>/tests/release-contract.test.*`
- Update: `<repository>/docs/<app>/completion.md`

- [ ] **Step 1: Write the failing release-contract test**

Assert the exact Worker name `ownasquare-<slug>`, one Custom Domain
`<slug>.ownasquare.com`, `workers_dev: false`, `preview_urls: false`, a current
compatibility date, tracked assets, no build field in the governed release
configuration, no runtime environment file, and only declared bindings.

- [ ] **Step 2: Add the smallest supported release surface**

For static apps, the Worker may delegate to `env.ASSETS.fetch(request)`. Hybrid
apps must keep API routing bounded and serve all other requests from the
assets binding. The tracked Worker entry must be self-contained, import-free,
and no larger than the publisher's 256 KiB limit.

- [ ] **Step 3: Add truthful health and security behavior**

`/api/health` must return the exact public source SHA with `no-store`.
Production HTML and API responses must set the project's approved CSP, HSTS,
frame, content-type, referrer, and permissions policies.

- [ ] **Step 4: Run the repository's complete local suite**

Run its clean install, format, lint, types, unit/integration, component tests
where present, Playwright E2E, accessibility, theme, responsive, dependency,
secret, license, build, and package smoke gates. A partial pass cannot enter
deployment.

- [ ] **Step 5: Publish the exact reviewed SHA**

Commit and push through the authorized OwnASquare GitHub identity. Read back
local `HEAD`, `origin/main`, public `main`, and the repository API at the same
40-character SHA.

### Task 5: Build safe demo surfaces for non-Cloudflare runtimes

**Files per affected app:**

- Create: `<repository>/demo/index.html`
- Create: `<repository>/demo/app.js`
- Create: `<repository>/demo/styles.css`
- Create: `<repository>/demo/README.md`
- Test: `<repository>/tests/e2e/demo.spec.*`

- [ ] **Step 1: Preserve the original product boundary**

The demo must state which operations are simulated, omit secrets and user
data, make no paid-provider calls, and link to self-host instructions for the
full runtime.

- [ ] **Step 2: Implement one representative local-only flow**

Use committed synthetic fixtures and deterministic output. Do not impersonate
Ollama, containers, databases, external tools, autonomous actions, or durable
agent execution.

- [ ] **Step 3: Validate demo accessibility and truthfulness**

Playwright must cover desktop/tablet/phone, light/dark mode, keyboard use,
empty/error states, no external requests, no console errors, and visible demo
limitations.

- [ ] **Step 4: Publish and re-enter the governed Worker release path**

Once the demo SHA is public and verified, classify it as
`workers-static-assets` and use the same attested deployment sequence as every
other preview.

### Task 6: Deploy serially through the governed publisher

**Files:**

- Read/write only through:
  `/Users/fortunevieyra/.codex/bin/codex-ownasquare-cloudflare-publish.py`
- Registry:
  `/Users/fortunevieyra/Documents/Github/ownasquare.com/docs/1000-apps-100-days/registry`

- [ ] **Step 1: Reserve or verify the exact target**

One lane generation may have one reservation. Confirm provider capacity,
Worker/domain absence or exact matching identity, and an unexpired production
window.

- [ ] **Step 2: Run read-only preflight**

Preflight must validate the public SHA, detached source manifest, tracked
release files, bindings, target, identity, and current provider state.

- [ ] **Step 3: Deploy once**

Deploy the exact verified SHA through the digest-pinned isolated publisher.
Capture immutable intent, accepted/rejected outcome, sanitized diagnostics,
version, deployment, domain, and pending receipt. Never retry an ambiguous
mutation.

- [ ] **Step 4: Run independent production proof**

Verify root, health, exact source SHA, bindings, headers, primary workflow,
friendly failure, phone/tablet/desktop in light/dark mode, accessibility,
console, and six real screenshots.

- [ ] **Step 5: Finalize only from archived proof**

Archive the pending receipt, raw Playwright JSON, screenshot hashes, provider
readback, and hosted receipt. Let the publisher/state helper record Cloudflare
state only after semantic validation succeeds.

- [ ] **Step 6: Stop on the first rejected release**

A rejected deployment, warning-bearing outcome, unexpected provider object,
source drift, failed proof, or capacity change pauses the batch. Do not
continue deploying later apps until the failure is classified and the
release contract says continuation is safe.

### Task 7: Update the public catalog from finalized receipts

**Files:**

- Modify:
  `/Users/fortunevieyra/Documents/Github/ownasquare.com/ownasquare/public/apps/catalog-data.js`
- Modify:
  `/Users/fortunevieyra/Documents/Github/ownasquare.com/ownasquare/tests/site.test.js`
- Modify:
  `/Users/fortunevieyra/Documents/Github/ownasquare.com/ownasquare/tests/e2e/home.spec.js`
- Update:
  `/Users/fortunevieyra/Documents/Github/ownasquare.com/ownasquare/docs/ownasquare/2026-07-28-app-library.md`

- [ ] **Step 1: Write the failing finalized-preview test**

The parent-site test must derive preview status only from reviewed finalized
release receipts. A source-only catalog record cannot be flipped by repository
existence, a Worker upload, a pending receipt, or an HTTP 200 alone.

- [ ] **Step 2: Enable each independently finalized preview**

Set `preview: true` only after its exact domain and finalized source SHA are
verified. Preserve source links and continue using the `Public preview` label.

- [ ] **Step 3: Run parent-site validation**

Run Node tests, Playwright across phone/tablet/desktop, asset dry-run, link
checks, compound filters, mobile filters, themes, and production readback.

- [ ] **Step 4: Deploy and verify the parent catalog**

Deploy only `ownasquare-platform`, then verify the apex and stable Worker
routes at the same HTML ETag and expected card counts.
