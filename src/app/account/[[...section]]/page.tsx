import type { Metadata } from 'next';
import Link from 'next/link';
import { ProfileForm } from '@/components/auth/profile-form';
import { SignOutButton } from '@/components/auth/sign-out-button';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { PageHeading } from '@/components/ui/page-heading';
import { getCurrentProfile } from '@/modules/auth/current-profile';

export const metadata: Metadata = { title: 'Espace client' };
export const dynamic = 'force-dynamic';

const accountSections = [
  { slug: '', label: 'Vue d’ensemble' },
  { slug: 'profile', label: 'Profil' },
  { slug: 'orders', label: 'Commandes' },
  { slug: 'payments', label: 'Paiements' },
  { slug: 'wallet', label: 'Wallet' },
  { slug: 'wallet/topup', label: 'Recharges' },
  { slug: 'wallet/transactions', label: 'Transactions' },
  { slug: 'deliveries', label: 'Livraisons' },
  { slug: 'ai', label: 'AI Credits' },
  { slug: 'ai/models', label: 'Modèles IA' },
  { slug: 'ai/keys', label: 'Clés API' },
  { slug: 'ai/usage', label: 'Usage IA' },
  { slug: 'notifications', label: 'Notifications' },
  { slug: 'support', label: 'Support' },
];

export default async function AccountPage({
  params,
}: {
  params: Promise<{ section?: string[] }>;
}) {
  const { section = [] } = await params;
  const path = section.join('/');
  const currentSection =
    accountSections.find((item) => item.slug === path) ??
    (section.length === 2 && ['orders', 'deliveries'].includes(section[0])
      ? {
          slug: path,
          label:
            section[0] === 'orders'
              ? 'Détail de commande'
              : 'Détail de livraison',
        }
      : undefined);
  const profileResult = await getCurrentProfile();

  if (profileResult.status === 'unauthenticated') {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
        <EmptyState
          title="Connexion requise"
          description="Connectez-vous pour accéder aux informations de votre compte."
          action={
            <Link href="/login" className="font-bold text-rose-700">
              Aller à la connexion
            </Link>
          }
        />
      </div>
    );
  }

  if (profileResult.status !== 'ready') {
    const description =
      profileResult.status === 'unconfigured'
        ? 'Supabase n’est pas configuré dans cet environnement.'
        : profileResult.status === 'schema-required'
          ? 'Le schéma identité doit être appliqué avant de lire les profils.'
          : profileResult.status === 'profile-missing'
            ? 'Votre session ne possède pas de profil associé. La création automatique doit être vérifiée.'
            : 'Le profil ne peut pas être chargé pour le moment.';
    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
        <EmptyState
          title="Espace client indisponible"
          description={description}
          tone="warning"
        />
      </div>
    );
  }

  if (profileResult.profile.accountStatus !== 'active') {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
        <EmptyState
          title="Compte indisponible"
          description="Ce compte ne peut pas accéder à l’espace client. Contactez le support si vous pensez qu’il s’agit d’une erreur."
          tone="warning"
        />
      </div>
    );
  }

  const title = currentSection?.label ?? 'Espace client';

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <PageHeading
          eyebrow="Compte sécurisé"
          title={title}
          description={`Bonjour${profileResult.profile.displayName ? ` ${profileResult.profile.displayName}` : ''}. Les données privées sont chargées depuis votre session.`}
        />
        <SignOutButton />
      </div>
      <nav
        aria-label="Navigation du compte"
        className="flex gap-2 overflow-x-auto pb-2"
      >
        {accountSections.map((item) => {
          const href = item.slug ? `/account/${item.slug}` : '/account';
          const active = item.slug === path;
          return (
            <Link
              key={item.slug}
              href={href}
              aria-current={active ? 'page' : undefined}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm font-bold ${
                active
                  ? 'border-rose-600 bg-rose-600 text-white'
                  : 'border-rose-200 bg-surface hover:bg-rose-50'
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <Card className="min-h-64 p-6 sm:p-8">
        {path === 'profile' ? (
          <div className="space-y-6">
            <div>
              <h2 className="font-game text-2xl font-bold">
                Informations du profil
              </h2>
              <p className="mt-2 text-sm text-ink/60">
                Le rôle et le statut du compte sont gérés côté serveur.
              </p>
            </div>
            <ProfileForm displayName={profileResult.profile.displayName} />
            <dl className="grid gap-4 border-t border-rose-100 pt-5 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-ink/55">Téléphone</dt>
                <dd className="mt-1 font-semibold">
                  {profileResult.profile.phone ?? 'Non renseigné'}
                </dd>
              </div>
              <div>
                <dt className="text-ink/55">E-mail</dt>
                <dd className="mt-1 font-semibold">
                  {profileResult.profile.email ?? 'Non renseigné'}
                </dd>
              </div>
            </dl>
          </div>
        ) : currentSection ? (
          <EmptyState
            title={`${currentSection.label} en préparation`}
            description="Aucune donnée de démonstration n’est affichée. Cette section s’activera lorsque son schéma et ses services sécurisés seront disponibles."
            tone="neutral"
          />
        ) : (
          <EmptyState
            title="Section introuvable"
            description="Cette page de l’espace client n’existe pas."
            action={
              <Link href="/account" className="font-bold text-rose-700">
                Retour à l’espace client
              </Link>
            }
            tone="warning"
          />
        )}
      </Card>
    </div>
  );
}
