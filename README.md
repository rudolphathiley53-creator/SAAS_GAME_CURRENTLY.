# GOCOINS — Gaming Store & AI Credits

GOCOINS is being prepared as a French-first, mobile-responsive platform for a
gaming catalog and future AI credits. The frontend uses Next.js App Router,
TypeScript, Tailwind CSS, and Supabase Auth/PostgreSQL scaffolding.

The former Vite demo catalog and mock purchase flow have been removed. No
fictional products, orders, balances, payments, delivery events, AI usage, or
provider integrations are included.

## Current scope

- Public catalog pages read only active categories, published products, and
  active variants from Supabase.
- Product and category detail pages, catalog search/sort, and a browser cart
  are available. The cart stores variant IDs and quantities only; the displayed
  subtotal is informational.
- Phone OTP forms are enabled only when the configured Supabase project reports
  phone authentication enabled. A prior read-only check found phone auth
  disabled; re-check the live setting before relying on OTP.
- Account and admin routes verify the current user and profile server-side.
  Admin access is denied unless the database profile has an active admin role.
- Orders, payments, delivery, wallet, AI gateway, provider actions, and admin
  mutations are intentionally not operational. Checkout does not create an
  order or initiate payment.
- `supabase/migrations/20261111130000_identity_and_public_catalog.sql` is a
  local, unapplied foundation for profiles and the public catalog. It has not
  been applied to the remote project.

## Requirements

- Node.js 24 (see `.nvmrc`; Next.js requires Node.js 20.9 or newer).
- npm.
- Supabase environment variables for live catalog and auth connections.

## Local setup

```sh
npm ci
Copy-Item .env.example .env.local
```

Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in the
ignored `.env.local` file. Use only a publishable/anon key in these public
variables. Never put a service-role key or provider secret in a `NEXT_PUBLIC_*`
variable. The app can also start without Supabase configured; data-dependent
features will show explicit unavailable states.

```sh
npm run dev
```

Open <http://localhost:3000>.

## Validation

```sh
npm run lint
npm run typecheck
npm test
npm run build
```

`npm run format:check` checks the repository's Prettier configuration.

## Main routes

| Route                                          | Purpose                                             |
| ---------------------------------------------- | --------------------------------------------------- |
| `/`                                            | Platform overview and published catalog             |
| `/gaming`, `/categories`, `/categories/[slug]` | Public gaming catalog                               |
| `/products/[slug]`                             | Published product and active variants               |
| `/cart`, `/checkout`                           | Browser cart and non-operational checkout state     |
| `/login`, `/signup`, `/verify`                 | Supabase phone OTP, gated by live provider settings |
| `/account/**`                                  | Session- and profile-checked customer area          |
| `/admin/**`                                    | Server-checked admin shell; actions remain disabled |
| `/ai-credits`                                  | AI Credits capability status                        |
| `/faq`, `/contact`, `/legal/**`                | Public information and clearly marked legal drafts  |
| `/api/v1/catalog/**`                           | Read-only catalog endpoints                         |

## Architecture

```text
src/
├── app/                 # App Router pages and API routes
├── components/          # Shared UI, auth, cart and catalog components
├── lib/supabase/        # Browser, server and public Supabase clients
├── modules/             # Catalog and identity domain services
├── types/               # Supabase database types
└── proxy.ts             # Session refresh for private account/admin routes
supabase/migrations/     # Versioned local SQL migrations
docs/                    # Progress, decisions and implementation plan
```

The target architecture and business/security requirements are defined in
`.github/STRUCTURE_GLOBALE_PLATEFORME_GAMING_AI.md`. Do not implement financial
or provider workflows in the browser; server-side services, idempotency, RLS,
and validated integrations are prerequisites.

## Migration status

The foundation migration is not applied remotely. Review it and test it against
a local Supabase instance before any remote application. Applying it requires
authenticated Supabase CLI/database access; a publishable key is insufficient.
Do not apply remote schema changes without explicit approval.
