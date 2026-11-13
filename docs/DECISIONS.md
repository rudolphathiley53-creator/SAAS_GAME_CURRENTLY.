# Architecture decisions

## ADR-001: Next.js App Router as the application foundation

**Decision:** Replace the Vite/React demo with Next.js App Router, React 19,
and TypeScript.

**Reason:** The target architecture calls for a Next.js frontend/BFF with
server-side session verification and modular server services.

**Consequence:** Route-level UI and data reads live under `src/app/`. The Vite
entry points and demo behavior are removed; the existing theme design is kept.

## ADR-002: No fabricated commerce or AI data

**Decision:** Do not seed sample products, prices, balances, orders, payments,
deliveries, AI models, or usage.

**Reason:** Commercial and financial information must come from verified
services. Empty and unavailable states are safer than success-shaped demos.

## ADR-003: Supabase public clients only in the frontend foundation

**Decision:** Use separated browser, server-cookie, and read-only public
clients. Public keys are loaded from environment variables; no service-role key
is present.

**Reason:** Server-side role checks and RLS are required, and privileged keys
must never be exposed to browsers.

## ADR-004: Phone OTP is configuration-gated

**Decision:** OTP UI and server actions require Supabase Auth to report phone
sign-in enabled.

**Reason:** The previously observed target project had phone authentication
disabled despite an SMS provider being listed. A configured vendor name alone
does not prove OTP is usable.

## ADR-005: Checkout is not an order workflow

**Decision:** The cart can display current catalog prices, but checkout does
not create orders or initiate payments.

**Reason:** Safe order processing requires server-side price recalculation,
database transactions, snapshots, idempotency, authorization, and an
unapplied schema for orders/payments.

## ADR-006: Migration remains local and unapplied

**Decision:** Keep the identity/catalog migration in version control without
applying it remotely.

**Reason:** Remote application requires authenticated database access and
explicit approval. The migration must first be tested locally and reviewed.

**Rollback:** Before remote application, revise or replace the migration.
After application, create a new forward migration for compatible changes;
avoid destructive rollback where data may exist. Backup and review before any
schema removal.
