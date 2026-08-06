# Contact page, email-backed form, and brand logo swap

**Date:** 2026-08-06
**Repo:** `ownasquare` (Cloudflare Worker + static assets, `ownasquare-platform`)
**Author:** Claude (Opus 4.8) session

## What changed and why

Added a public **`/contact-us`** page with a working, email-backed contact form, and
replaced the CSS-drawn 4-square brand mark with the real OwnASquare logo
(`ownasquare-logo.png`, the colored 3×3 tile) across every page.

### 1. Brand logo
- New asset `public/ownasquare-logo.png` (copied from `~/Downloads/ownasquare-logo.png`,
  576×576, 8 KB). Also generated `public/apple-touch-icon.png` (180px) and
  `public/icon-512.png`.
- Header + footer brand mark on all pages now uses
  `<img class="brand-mark-logo" src="/ownasquare-logo.png" …>` instead of the old
  `<span class="brand-mark">` grid of `<span>`s.
- Favicon links repointed from `/favicon.svg` (the old 4-square mark) to
  `/ownasquare-logo.png` + `apple-touch-icon`. `public/favicon.svg` is now unreferenced
  (left in place, not deleted).
- CSS: removed dead `.brand-mark` / `.brand-mark span` rules, added `.brand-mark-logo`.

### 2. Contact page + form
- `public/contact-us/index.html` — mirrors the existing header/footer/theme system.
  Two-column layout on ≥44rem (intro copy + form card), single column on mobile.
- Fields: name (req), email (req), subject (optional), message (req), plus a hidden
  **honeypot** field `company` for spam. `<noscript>` fallback + always-visible
  `mailto:hello@ownasquare.com` direct link (honest fallback — form never silently fails).
- "Contact" nav tab added to Home, Apps, and The Adventure pages (and active on the
  contact page).
- Progressive enhancement in `public/app.js`: intercepts submit, POSTs JSON to
  `/api/contact`, renders pending/success/error status via an `aria-live` region, marks
  invalid fields with `aria-invalid`, resets on success. Without JS the `<noscript>`
  mailto is the fallback.

### 3. Worker `/api/contact` endpoint (`src/index.js`)
- `POST /api/contact` only (405 otherwise). Reads JSON or form-encoded body.
- Validation: required name/email/message, email regex, length caps
  (name 120 / email 200 / subject 160 / message 4000). Returns `422 {ok,error,fields[]}`.
- Honeypot filled → silent `200 {ok:true}` (no send), so bots don't learn they were caught.
- Header-injection guard: `singleLine()` strips CR/LF from name/email/subject.
  HTML email body is `escapeHtml()`-escaped.
- Sends via the Cloudflare Email **`send_email` binding** (`env.EMAIL.send`):
  `to: hello@ownasquare.com`, `from: noreply@ownasquare.com`, `replyTo:` visitor email,
  subject `[Contact] …`, text + escaped HTML.
- If `env.EMAIL` is missing → `503` with "email hello@ownasquare.com directly".
  Send throw → `502` with the same fallback. All responses keep the site security headers.

### 4. Config
- `wrangler.jsonc`: added
  `"send_email": [{ "name": "EMAIL", "allowed_sender_addresses": ["noreply@ownasquare.com"] }]`.
- `worker-configuration.d.ts` regenerated (`wrangler types`) → `EMAIL: SendEmail`.

## Affected files
- Added: `public/contact-us/index.html`, `public/ownasquare-logo.png`,
  `public/apple-touch-icon.png`, `public/icon-512.png`, `tests/e2e/contact.spec.js`
- Modified: `src/index.js`, `wrangler.jsonc`, `worker-configuration.d.ts`, `public/app.js`,
  `public/styles.css`, `public/index.html`, `public/apps/index.html`,
  `public/adventure/index.html`, `tests/site.test.js`, `tests/worker.test.js`

## Validation / proof
- `npm run check` (Node 24 via nvm — wrangler needs ≥22): **PASS**
  - `typegen:check` ok
  - `node --test`: **26 passed** (added 6 worker contact tests + 2 site tests)
  - `playwright test`: **33 passed** (added 3 contact specs × phone/tablet/desktop)
  - `wrangler deploy --dry-run`: ok, binding shown as
    `env.EMAIL (unrestricted - senders: noreply@ownasquare.com)`
- Manual local (`wrangler dev :8791`) curl: GET→405, invalid→422 w/ fields, honeypot→200
  no-send, valid→200, `/contact-us/`→200, bare `/contact-us`→307→`/contact-us/`.
- Browser: dark-mode contact page renders; live form submit showed success status and
  cleared the form; logo renders in header/nav.

## Truth boundaries / not done here
- **Local proof only.** Not deployed to production in this session.
- **Cloudflare account:** the ownasquare zone is under account `84a701a2…`
  (zone `b5986b04603df0dd73fb862c84345309`), NOT the `CLOUDFLARE_ACCOUNT_ID` env value
  (`e1e50a59…`, a different account).
- **API token scope (corrected 2026-08-06):** the `CLOUDFLARE_API_TOKEN` (named
  "cheaper.app") is NOT narrowly scoped — it has broad ACCOUNT-level perms (Email Sending
  Write/Read, Email Routing account rules/addresses, Workers, R2, KV) plus full ZONE-level
  DNS/Email-Routing control. BUT that zone-level policy is bound to the **`cheaper.app`
  zone only**. Proven: identical DNS-read + `email/routing` GETs return **200 on
  cheaper.app, 403 on ownasquare.com**; account-level `email/routing/addresses` read
  returns 200; `email/sending/zones` returns 401. So this token cannot manage
  ownasquare.com DNS or zone Email Routing until the user edits the token to add
  `ownasquare.com` (or "All zones") to that policy's Zone Resources. Email + DNS setup was
  therefore left to the dashboard (user was doing it live during this session).

## Delivery design (revised 2026-08-06 after token scope widened)

The token was edited to add `ownasquare.com` to Zone Resources, so the session can now manage
the ownasquare zone (verified: identical DNS/email-routing GETs now 200 on both zones).

**Email Routing is live and "ready"** on ownasquare.com (MX route1/2/3.mx.cloudflare.net, SPF
`v=spf1 include:_spf.mx.cloudflare.net ~all`, DKIM `cf2024-1._domainkey` — all present).
**Transactional Email *Sending* is NOT active** on the account — `email/sending/zones` returns
`2036 Unauthorized` even with the permission granted. So delivery uses **Email Routing**, not
Email Sending.

Because the `send_email` binding (backed by Email Routing) only delivers to a **verified
Routing destination**, the Worker sends the contact notification directly to the verified
destination inbox, not to `hello@`. `hello@ownasquare.com` remains the public address (mailto +
a routing rule that forwards it to the same inbox).

- **Recipient config:** Worker reads `env.CONTACT_RECIPIENT` (no inbox address in committed
  source — the repo is public `github.com/ownasquare/ownasquare`). Local: `.dev.vars`
  (gitignored, `CONTACT_RECIPIENT="ownasquare.com@gmail.com"`). Prod: `wrangler secret put
  CONTACT_RECIPIENT`. If unset → graceful 503 "email hello@ownasquare.com directly".
- **Done via API this session:** created Email Routing destination `ownasquare.com@gmail.com`
  (Cloudflare sent it a verification email; currently `verified:false`).
- **Blocked on user:** verify that inbox (click Cloudflare's link). Rule creation returned
  `2054 Destination address is not verified` until then.

## Completed & LIVE (2026-08-06)

All shipped to production. Steps done:
1. ✅ Destination `ownasquare.com@gmail.com` created + **verified** (`verified:true`).
2. ✅ Routing rule created + enabled: `hello@ownasquare.com` → `ownasquare.com@gmail.com`
   (rule id `cc8828cae60340dca3a2175746d16402`).
3. ✅ `CONTACT_RECIPIENT` set as a Worker **secret** (secret_text; value not in git) via the
   Workers Secrets API.
4. ✅ Deployed with `wrangler deploy` (must pass `CLOUDFLARE_ACCOUNT_ID=84a701a2…` — the env
   default `e1e50a59…` is the wrong account and 10000-errors the deploy). Final version id
   `a23403b0-8dda-47e6-b5b2-abedaa80f16b`. Triggers: `ownasquare.com`, `www.ownasquare.com`,
   `ownasquare-platform.ownasquare-com.workers.dev`.

### Production proof
- `GET https://ownasquare.com/api/health` → 200; `/contact-us/` → 200; `/ownasquare-logo.png`
  → 200 image/png; homepage HTML contains `brand-mark-logo` + `href="/contact-us/"`.
- `POST /api/contact` (valid) → `200 {"ok":true}` — **real email delivered** to the gmail
  (two labeled smoke tests sent; reply-to = submitter). Invalid → 422. 
- Deployed-worker bindings confirmed via settings API: `ASSETS`, `CONTACT_RECIPIENT`
  (secret_text), `EMAIL` (send_email).
- A temporary `/api/contact-debug` (booleans only, no secret values) was used to confirm
  `hasEmail/sendType=function/hasRecipient/recipientLength=24`, then **removed** and
  redeployed (now 404).

### Gotcha logged
- Early prod 503s were **propagation lag**, not a config error — wait ~8s after
  `wrangler deploy` before testing custom-domain routes.

## Follow-ups (optional)
- Working tree has uncommitted changes (deploy uploads local files, not git). Commit when ready.
- `public/favicon.svg` (old mark) is unreferenced — safe to delete.
- If transactional Email Sending is ever activated, the recipient could switch to `hello@`.
