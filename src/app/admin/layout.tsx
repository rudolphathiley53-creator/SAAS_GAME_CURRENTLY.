import type { ReactNode } from 'react';
import Link from 'next/link';
import { EmptyState } from '@/components/ui/empty-state';
import { PageHeading } from '@/components/ui/page-heading';
import { getCurrentProfile } from '@/modules/auth/current-profile';

const adminSections = [
  { href: '/admin', label: 'Vue d’ensemble' },
  { href: '/admin/users', label: 'Utilisateurs' },
  { href: '/admin/catalog/categories', label: 'Catégories' },
  { href: '/admin/catalog/products', label: 'Produits' },
  { href: '/admin/catalog/variants', label: 'Variantes' },
  { href: '/admin/providers', label: 'Fournisseurs' },
  { href: '/admin/orders', label: 'Commandes' },
  { href: '/admin/payments', label: 'Paiements' },
  { href: '/admin/deliveries', label: 'Livraisons' },
  { href: '/admin/webhooks', label: 'Webhooks' },
  { href: '/admin/jobs', label: 'Tâches' },
  { href: '/admin/wallet', label: 'Wallet' },
  { href: '/admin/ai/models', label: 'Modèles IA' },
  { href: '/admin/ai/keys', label: 'Clés IA' },
  { href: '/admin/ai/usage', label: 'Usage IA' },
  { href: '/admin/finance', label: 'Finance' },
  { href: '/admin/analytics', label: 'Analytique' },
  { href: '/admin/audit-logs', label: 'Journal d’audit' },
  { href: '/admin/settings', label: 'Paramètres' },
];

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const result = await getCurrentProfile();

  if (result.status !== 'ready') {
    const description =
      result.status === 'unauthenticated'
        ? 'Connectez-vous avec un compte administrateur autorisé.'
        : result.status === 'schema-required'
          ? 'Le schéma d’identité doit être appliqué avant de vérifier les rôles.'
          : result.status === 'profile-missing'
            ? 'Aucun profil n’est associé à cette session. L’accès administrateur est refusé.'
            : result.status === 'unconfigured'
              ? 'Supabase n’est pas configuré dans cet environnement.'
              : 'La session et les autorisations ne peuvent pas être vérifiées.';
    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
        <PageHeading eyebrow="Administration" title="Accès restreint" />
        <div className="mt-8">
          <EmptyState
            title="Accès administrateur indisponible"
            description={description}
            tone="warning"
          />
        </div>
      </div>
    );
  }

  if (
    result.profile.role !== 'admin' ||
    result.profile.accountStatus !== 'active'
  ) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
        <PageHeading eyebrow="Administration" title="Accès restreint" />
        <div className="mt-8">
          <EmptyState
            title="Autorisation administrateur requise"
            description="Votre compte ne dispose pas du rôle administrateur actif. Le rôle n’est jamais accepté depuis le navigateur."
            tone="warning"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-12 sm:px-6 lg:px-8">
      <PageHeading
        eyebrow="Administration sécurisée"
        title="Console de gestion"
      />
      <nav
        aria-label="Navigation admin"
        className="flex gap-2 overflow-x-auto pb-2"
      >
        {adminSections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="shrink-0 rounded-full border border-rose-200 bg-surface px-4 py-2 text-sm font-bold hover:bg-rose-50"
          >
            {section.label}
          </Link>
        ))}
      </nav>
      {children}
    </div>
  );
}
