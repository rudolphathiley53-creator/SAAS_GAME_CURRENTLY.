# Development plan

Use `.github/STRUCTURE_GLOBALE_PLATEFORME_GAMING_AI.md` as the product and
architecture source of truth. This plan tracks prerequisites; it does not
authorize production integrations or remote schema changes.

## Phase 0 — Application foundation

- [x] Move the frontend to Next.js App Router and strict TypeScript.
- [x] Preserve the existing light/dark theme and responsive visual system.
- [x] Remove Vite demo catalog, mock checkout, and demo order behavior.
- [x] Add Supabase client separation, public environment validation, and local
      identity/catalog migration.
- [x] Add empty/unavailable states without fictional commercial data.
- [ ] Run lint, typecheck, tests, production build, and browser smoke checks.
- [ ] Validate migration with a local Supabase stack and regenerate types.

## Phase 1 — Identity and authorization

- [ ] Confirm the selected Auth method and verify the real provider settings.
- [ ] Add password/email or phone flows only for configured providers.
- [ ] Test profile creation, allowed profile updates, role immutability, and
      account state handling.
- [ ] Add two-user RLS tests and server route authorization tests.

## Phase 2 — Gaming catalog and orders

- [ ] Validate complete catalog schema and publish workflow.
- [ ] Add product-required customer-input schemas and validation.
- [ ] Implement server-side cart/order pricing, snapshots, transaction,
      idempotency, and allowed state transitions.
- [ ] Add owner-scoped order history and admin catalog mutation services.
- [ ] Do not initiate real payment or supplier purchase in this phase without
      a separately approved integration.

## Phase 3 — Payments, wallet, and delivery

- [ ] Select and validate payment/supplier providers using their official
      contracts and test environments.
- [ ] Implement signed/idempotent webhooks, reconciliation, and outbox workers.
- [ ] Add append-only wallet ledger and delivery secret handling.
- [ ] Validate failure and duplicate-event scenarios before production.

## Phase 4 — AI Credits

- [ ] Configure the isolated AI Gateway and provider credentials server-side.
- [ ] Implement virtual key lifecycle, model limits, usage ingestion,
      reservation, settlement, and reconciliation.
- [ ] Add billing and abuse controls before exposing API access.

## Copilot task prompt template

> Read `.github/STRUCTURE_GLOBALE_PLATEFORME_GAMING_AI.md` and the relevant
> targeted instructions before changing code. Inspect the current schema and
> tests first. Implement only the requested phase. Keep money, authorization,
> secrets, and provider calls server-side. Do not fabricate products or
> successful transactions. Add focused tests, run the documented checks, and
> report exact commands and limitations. Do not apply a remote migration
> without explicit approval.
