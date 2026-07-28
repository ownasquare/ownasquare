# Domain and Cloudflare Rollout

## Current verified provider state

- The OwnASquare Cloudflare account has one deployed Worker,
  `ownasquare-platform`.
- `ownasquare.com` is an active Cloudflare zone on the free plan.
- GoDaddy delegates `ownasquare.com` to the two Cloudflare-assigned
  nameservers. Registrar readback, public delegation, and direct authoritative
  queries all confirm the cutover.
- `ownasquare.com` and `www.ownasquare.com` are exact production Custom Domains
  for `ownasquare-platform`.
- Cloudflare's authoritative DNS returns its proxied IPv4 and IPv6 addresses
  for both production hostnames.
- The imported apex and `www` HostGator A records were removed before the
  Custom Domains were attached. The imported proxied wildcard record was
  deliberately preserved for later subdomain migration work.
- Valid TLS, the homepage, `/api/health`, and the Worker-authored security
  headers were verified on both exact hostnames by resolving directly against
  the new authoritative Cloudflare addresses.
- Some recursive resolvers can temporarily retain the former HostGator address
  while nameserver-delegation caches expire. This is passive DNS propagation,
  not a remaining configuration action.
- GoDaddy shows no DS records, so DNSSEC is currently off.
- GoDaddy lists `ownasquare.com`.
- GoDaddy lists `buggum.com`.
- GoDaddy does not show the requested spelling `buggom.com`.
- GoDaddy remains the registrar for `ownasquare.com`; Cloudflare is now the
  authoritative DNS provider.
- No public apex MX or TXT response was observed during the 2026-07-27 audit.
- The `workers.dev` fallback remains enabled, while deployment preview URLs are
  disabled.

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
   approval. Completed after the user approved the exact cutover.
9. Wait for Cloudflare to report the zone active. Completed.
10. Remove only the conflicting imported apex and `www` A records, preserve
    the wildcard, and bind both exact custom domains to the Worker. Completed.
11. Verify DNS, TLS, homepage, health response, security headers, and hostname
    behavior on both public hostnames. Completed against authoritative
    Cloudflare DNS and the active edge. Recursive-cache expiration remains
    outside the deployment path and requires no additional provider change.

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

Pause immediately before any future:

- Changing nameservers or DNS records.
- Creating additional API tokens or credentials.
- Accepting registrar or transfer agreements.
- Paying a transfer or renewal charge.
- Solving a CAPTCHA or entering a password.

The repository, first Worker deployment, Cloudflare zone, `ownasquare.com`
nameserver cutover, and exact apex/`www` Custom Domains were approved and
completed on 2026-07-27. Their earlier confirmation gates no longer apply to
those completed actions. They do not authorize changes to another domain.
