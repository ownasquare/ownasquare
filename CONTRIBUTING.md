# Contributing

OwnASquare apps should remain small, legible, and useful.

Before proposing a change:

1. Confirm it solves a demonstrated user problem.
2. Prefer the shortest clear workflow over additional configuration.
3. Keep the self-hosted core independent of OwnASquare accounts and billing.
4. Reuse the shared account contract for hosted access instead of inventing a
   new login flow.
5. Run `npm run check`.

End-to-end browser tests belong in Playwright. Do not add Cypress end-to-end
tests.

