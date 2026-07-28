# OwnASquare

OwnASquare is the parent platform for a growing collection of small, focused
apps. Each app is intended to solve one painful problem without turning the
solution into a complicated suite.

The platform supports two product paths:

- Open-source apps that can be downloaded, changed, and self-hosted without an
  OwnASquare account.
- Managed apps on OwnASquare subdomains that will use one shared account and a
  hosted subscription.

This repository contains the OwnASquare parent homepage, the Cloudflare Worker
that serves it, and the platform contracts future apps will share.

## Local development

Requirements:

- Node.js 20 or newer

Install dependencies and start the Worker:

```sh
npm install
npm run dev
```

Open the local address printed by Wrangler.

## Validation

```sh
npm run check
```

This checks generated Cloudflare bindings, runs the unit suite, and performs a
deployment dry run. No provider state is changed by the check.

## Deployment status

The local foundation is ready for validation. The first Cloudflare deployment,
domain onboarding, DNS cutover, account database, email delivery, and payment
provider are intentionally separate activation steps.

See:

- `docs/platform/architecture.md`
- `docs/platform/auth-contract.md`
- `docs/platform/domain-rollout.md`

## License

MIT. See `LICENSE`.

