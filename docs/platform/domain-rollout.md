# Domain and Cloudflare Rollout

## Current verified provider state

- The signed-in OwnASquare Cloudflare account has no zones.
- The signed-in OwnASquare Cloudflare account has no Workers or Pages projects.
- GoDaddy lists `ownasquare.com`.
- GoDaddy lists `buggum.com`.
- GoDaddy does not show the requested spelling `buggom.com`.

No account IDs, credentials, nameserver values, private DNS records, or
registrar authorization data belong in this repository.

## Safe rollout sequence for `ownasquare.com`

1. Validate the Worker locally.
2. Publish the source repository.
3. Deploy a `workers.dev` preview.
4. Verify homepage, health response, headers, phone/tablet/desktop layout, and
   both color modes.
5. Add `ownasquare.com` to Cloudflare.
6. Review every imported DNS record against GoDaddy's current zone.
7. Preserve website, mail, verification, and other service records.
8. Change the registrar nameservers only after explicit action-time approval.
9. Wait for Cloudflare to report the zone active.
10. Bind the Worker custom domain and verify TLS and public behavior.

DNS onboarding and registrar transfer are separate decisions. DNS can move to
Cloudflare while GoDaddy remains the registrar. A later transfer should proceed
only after checking transfer cost, included renewal, lock status, expiration
timing, privacy, and agreement terms.

## Domain batches

Now:

- `ownasquare.com`

Blocked pending spelling confirmation:

- `buggom.com` as requested
- `buggum.com` as present in GoDaddy

Later:

- `gredger.com`
- `sinecur.com`
- `vettir.com`
- `fortunevieyra.com`
- `buggum.com` if confirmed

Each later domain gets an independent DNS inventory, mail-preservation check,
cutover record, and rollback plan. The domains are never changed as an
unreviewed bulk action.

## Confirmation boundaries

Pause immediately before:

- Creating or deploying a Cloudflare project.
- Adding a Cloudflare zone.
- Changing nameservers or DNS records.
- Creating API tokens or credentials.
- Accepting registrar or transfer agreements.
- Paying a transfer or renewal charge.
- Solving a CAPTCHA or entering a password.

