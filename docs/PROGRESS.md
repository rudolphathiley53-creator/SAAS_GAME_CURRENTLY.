# Progress

## Current state

The frontend has been migrated from the Vite demo to Next.js App Router. The
demo catalog, purchase modal, mock order flow, and legacy Vite entry points
have been removed. The existing theme palette and light/dark preference have
been retained.

## Implemented foundation

- Next.js, React, strict TypeScript, Tailwind, ESLint, Prettier, Vitest, and CI
  scripts are configured.
- Shared responsive layout, theme provider, reusable UI primitives, and
  application error/loading states are present.
- Supabase browser/server/public clients and public environment validation are
  separated. No service-role key or provider secret is used.
- A local migration defines profiles, active/public catalog data, profile
  synchronization on Auth signup, grants, and RLS.
- Public catalog/category/product pages read only published and active data.
  Search and sorting run on the currently loaded published result set.
- The cart stores only variant IDs and bounded quantities in browser storage.
  Current availability and price are reread through a read-only server API.
- Phone OTP actions are gated by the live Supabase Auth phone setting. The last
  read-only check found phone sign-in disabled in the target project; verify
  again before enabling or promising OTP.
- Account/profile and admin pages verify the session and database role on the
  server. Profile editing is limited to display name.
- AI Credits, legal, support, checkout, and admin surfaces use honest
  unavailable/draft states rather than fabricated data.
- The existing `VIDEO/` assets are retained, but the platform frontend no
  longer references them.

## Validation completed

- `npm run lint` passed.
- `npm run typecheck` passed.
- `npm test` passed: 3 test files and 6 tests.
- `npm run format:check` passed.
- `npm run build` passed with Next.js 16.4.6.
- `npm audit --omit=dev` reported no production dependency vulnerabilities.
- Browser smoke checks returned HTTP 200 for `/` and `/login`; the catalog API
  returned the expected 503 while Supabase is unconfigured.
- A 375px mobile viewport had no horizontal page overflow.

The full dependency audit still reports seven moderate findings in development
dependencies, nested under ESLint/TypeScript tooling. `npm audit fix` did not
resolve them; they are not included in the production dependency audit.

## Not implemented or requires external verification

- The migration has not been applied to a local or remote database.
- Supabase CLI configuration is initialized, but local startup is blocked
  until Docker Desktop is running. CLI access to the production project is
  also not authenticated in the current environment.
- No production URL or publishable key has been written to `.env.local`.
- Supabase-generated types have not been generated; current TypeScript types
  are manually aligned with the local migration.
- No order, payment, wallet, delivery, AI Gateway, provider, worker, or admin
  mutation service is operational.
- No real catalog data is present or seeded.
- RLS integration tests against two authenticated users have not been run.
- Remote Supabase Auth/provider settings and production deployment have not
  been verified during this implementation.

## Required before production

1. Validate and apply the migration through a reviewed local Supabase workflow.
2. Generate database types from the validated schema.
3. Configure and verify the actual Auth provider, rate limits, email/SMS
   templates, and recovery flows.
4. Implement server-side order creation, pricing snapshots, idempotency,
   payment verification, wallet ledger, delivery, and AI billing separately.
5. Add multi-user RLS and authorization integration tests.
6. Replace legal drafts with reviewed policies and establish real support
   channels.
7. Configure production environment variables, monitoring, backups, and
   deployment safeguards.
