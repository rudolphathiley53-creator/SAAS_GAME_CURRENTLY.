---
applyTo: 'supabase/**/*.sql'
---

# Supabase migration guardrails

- Inspect existing migration history and the global platform architecture before
  changing schema.
- Never edit a migration that may already have been applied. Add a new
  timestamped migration for every schema evolution.
- Enable RLS on public application tables and pair policies with least-privilege
  `GRANT`/`REVOKE` statements.
- Keep monetary XOF values as bounded positive integers. Add constraints for
  ownership, state transitions, and idempotency where the schema supports them.
- Do not allow clients to set roles, account status, payment state, balances,
  order totals, or delivery state.
- Avoid recursive policies and `SECURITY DEFINER`. If a definer function is
  required, justify it, schema-qualify referenced objects, set a safe
  `search_path`, and revoke unnecessary execution privileges.
- Do not add demo commerce records or unverified provider data.
- Validate migrations against a local Supabase database and compare generated
  types before integration. Never apply remote migrations without explicit
  user approval and authenticated tooling.
