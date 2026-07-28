# Shared Account and Login Contract

## Goals

- One recognizable login and account experience across hosted apps.
- No OwnASquare login requirement for an app's open-source, self-hosted core.
- No wildcard session capable of crossing every app subdomain.
- A short redirect-based path that does not clutter the app workflow.

## Hosted sign-in flow

1. A signed-out hosted app sends the browser to
   `account.ownasquare.com/authorize`.
2. The request includes a registered app ID, exact redirect URI, random state,
   PKCE code challenge, and requested scopes.
3. The account service signs in or creates the user and asks for app consent
   only when it is materially needed.
4. The account service returns a single-use, short-lived authorization code to
   the exact registered callback URI.
5. The hosted app exchanges the code and PKCE verifier through a trusted
   service binding.
6. The app creates its own host-only session cookie.
7. The app checks the account's current entitlement before providing hosted
   service.

This follows Authorization Code with PKCE semantics. The central account
session and each app session remain separate.

## Cookie contract

Central account cookie:

- Host: `account.ownasquare.com`
- `HttpOnly`
- `Secure`
- `SameSite=Lax`
- Short idle lifetime with a bounded absolute lifetime

Hosted app cookie:

- Host: the exact app subdomain
- `HttpOnly`
- `Secure`
- `SameSite=Lax`
- Opaque session ID
- Rotated after authorization and privilege changes

Forbidden:

- `Domain=.ownasquare.com`
- Tokens in URLs after the callback completes
- Session identifiers in local storage
- Shared API keys embedded in browser code

## Registration contract

Each hosted app receives immutable registration data:

- `app_id`
- stable slug
- allowed redirect URIs
- allowed post-logout URIs
- requested scopes
- active release
- repository URL

Redirect URIs use exact matching. Wildcard callbacks are not allowed.

## Minimal scopes

- `openid`: stable account subject
- `profile`: display name and avatar, if present
- `email`: verified email address
- `entitlements`: hosted plan and app access

Apps receive no billing-provider credentials or unrelated account data.

## Entitlement decision

An entitlement response is restricted to one account and app:

```json
{
  "account_id": "acct_public_identifier",
  "app_id": "app_public_identifier",
  "access": "allowed",
  "plan": "hosted",
  "expires_at": "2026-08-27T00:00:00Z"
}
```

The real response is signed or obtained through a service binding. Hosted apps
fail closed when an entitlement cannot be verified, while their self-hosted
cores remain usable.

## Planned D1 records

- `accounts`
- `account_emails`
- `sessions`
- `apps`
- `app_redirect_uris`
- `plans`
- `subscriptions`
- `entitlements`
- `authorization_codes`
- `audit_events`

The first migration is created only when the account Worker is implemented.
No placeholder production database is created merely to satisfy the design.

## Shared user interface

All hosted apps present the same account states:

- Signed out: one clear “Sign in” action.
- Returning from sign-in: one short loading state.
- Signed in: a compact account control showing the user's chosen name.
- Access unavailable: one friendly explanation and one relevant next action.
- Service error: “We could not connect right now. Please try again.”

An app may use a workflow when its problem requires one. Account controls must
not add settings panels, API-key fields, or unnecessary steps to that workflow.

