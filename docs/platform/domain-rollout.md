# Domain and Cloudflare Rollout

## Current verified provider state

- The OwnASquare Cloudflare account has one deployed Worker,
  `ownasquare-platform`.
- `ownasquare.com` has been added as a pending Cloudflare zone on the free plan.
- Cloudflare imported the wildcard, apex, and `www` A records. Independent
  public DNS checks returned the same HostGator origin for all three.
- Cloudflare has assigned two replacement nameservers, but the registrar still
  uses the existing HostGator nameservers.
- GoDaddy shows no DS records, so DNSSEC is currently off.
- GoDaddy lists `ownasquare.com`.
- GoDaddy lists `buggum.com`.
- GoDaddy does not show the requested spelling `buggom.com`.
- GoDaddy is the registrar for `ownasquare.com`, but HostGator is the current
  authoritative DNS provider.
- The wildcard, apex, and `www` currently resolve to the same HostGator origin.
- No public apex MX or TXT response was observed during the 2026-07-27 audit.
- The current HTTP origin serves an error placeholder, and the current HTTPS
  certificate does not match `ownasquare.com`.

No account IDs, credentials, assigned nameserver values, private DNS records,
or registrar authorization data belong in this repository.

## Safe rollout sequence for `ownasquare.com`

1. Validate the Worker locally. Completed.
2. Publish the source repository. Completed.
3. Deploy a `workers.dev` preview. Completed.
4. Verify homepage, health response, headers, phone/tablet/desktop layout, and
   both color modes. Completed.
5. Add `ownasquare.com` to Cloudflare on the free plan. Completed.
6. Review every imported DNS record against the live HostGator zone. Completed;
   the imported wildcard, apex, and `www` records match public DNS, and no apex
   MX or TXT response was observed.
7. Confirm DNSSEC is off before cutover. Completed; GoDaddy shows no DS records.
8. Replace the HostGator nameservers at GoDaddy only after explicit action-time
   approval. Pending.
9. Wait for Cloudflare to report the zone active. Pending.
10. Bind both the apex and `www` exact custom domains to the Worker. Cloudflare
    requires an active zone before this step. Pending.
11. Verify DNS, TLS, homepage, health response, security headers, and hostname
    behavior on both public hostnames. Pending.

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

- Changing nameservers or DNS records.
- Creating additional API tokens or credentials.
- Accepting registrar or transfer agreements.
- Paying a transfer or renewal charge.
- Solving a CAPTCHA or entering a password.

The repository, first Worker deployment, and Cloudflare zone were already
approved and completed on 2026-07-27. Their earlier confirmation gates no
longer apply to continuation work for those completed actions.
