# Security

Please do not open a public issue for a suspected vulnerability.

Send a private report to the repository owner with:

- A concise description of the issue.
- The affected route or component.
- Reproduction steps that do not expose real user data.
- The likely impact.

Do not include passwords, session cookies, API tokens, private DNS records, or
other credentials in reports, commits, screenshots, or logs.

## Platform rules

- Self-hosted app cores must not require OwnASquare credentials.
- Hosted apps must use the central authorization flow.
- Session cookies are host-only, `HttpOnly`, `Secure`, and `SameSite=Lax`.
- No session cookie may be scoped to `.ownasquare.com`.
- Authorization results are short-lived and restricted to one app audience.
- Secrets belong in Cloudflare secret storage, never source or Wrangler config.

