---
applyTo: '**/*.{ts,tsx,js,jsx,md}'
---

# Gaming platform structure guardrail

Before implementing a feature, check `.github/STRUCTURE_GLOBALE_PLATEFORME_GAMING_AI.md` and align the solution with the target architecture described there.

Use this document as follows:

- Follow the product structure: gaming storefront, wallet/account flows, AI credits, support/admin operations, and modular service responsibilities.
- Prefer the architecture described in the project brief over ad-hoc page layouts or unrelated demo patterns.
- Keep money-related logic, inventory, status transitions, and role checks server-side in the final target design.
- Respect the company rules defined in the reference: XOF as integer pricing, idempotent payments and deliveries, and secure separation of business domains.
- If the current repo is a partial frontend or prototype, keep the implementation directionally consistent with the final architecture and do not introduce conflicting conventions.

This instruction applies to every feature request and every code change.
