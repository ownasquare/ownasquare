# OwnASquare Platform Architecture

## Product boundary

OwnASquare is the parent company and shared hosted platform. Individual apps
remain focused products with their own repositories and subdomains.

| Surface | Responsibility |
| --- | --- |
| `ownasquare.com` | Parent homepage, app discovery, product explanation |
| `account.ownasquare.com` | Central sign-in, account, sessions, billing profile |
| `api.ownasquare.com` | Platform API for accounts, subscriptions, entitlements |
| `<app>.ownasquare.com` | One hosted app with an app-specific session |
| App repository | Open-source core plus an optional OwnASquare hosted adapter |

## Deployment model

The parent homepage ships as Worker Static Assets and a small Worker API. The
Worker handles `/api/*` first and delegates all other paths to the static asset
binding.

Initial app deployments may use explicit custom domains. As the fleet grows,
a wildcard hostname routes traffic through an OwnASquare dispatch Worker. The
dispatcher resolves the hostname to an immutable app release and delegates to
the correct service. This avoids managing a unique platform route for every
application.

## Shared platform services

The shared platform is deliberately smaller than the apps:

1. Identity: accounts, verified email addresses, sessions, and recovery.
2. Catalog: stable app IDs, slugs, release metadata, and repository links.
3. Billing: plans and provider subscription references.
4. Entitlements: whether an account may use a hosted app.
5. Audit: security-relevant sign-in, entitlement, and account events.

D1 is the planned first source of truth for these records. Apps access platform
services through a service binding where possible, not a public network hop.

## Self-hosted boundary

Every generated app must keep its useful core independent of:

- OwnASquare login.
- OwnASquare billing.
- A central OwnASquare database.
- Private OwnASquare API keys.

The hosted adapter may add account context, managed storage, usage metering, and
entitlement checks. Removing that adapter must leave a functional self-hosted
application.

## Reusable app integration

Generated apps will consume a versioned OwnASquare platform package containing:

- A shared account button and account-status presentation.
- Authorization redirect and callback helpers.
- App-session validation.
- Hosted entitlement checks.
- A consistent set of loading, signed-out, signed-in, denied, and error states.

The package does not redesign the app. It provides a familiar account edge
around each app's shortest useful workflow.

## Source references

Beladed's split frontend auth modules, hostname-aware API selection, shared auth
layout, session validation, and backend account routes informed this boundary.
OwnASquare does not copy Beladed's implementation or client-stored session
pattern. In particular, OwnASquare will not share a parent-domain cookie across
independently deployed app subdomains.

