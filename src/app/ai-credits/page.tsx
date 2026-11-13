import type { Metadata } from 'next';
import { Bot, KeyRound, WalletCards } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { PageHeading } from '@/components/ui/page-heading';

export const metadata: Metadata = { title: 'AI Credits' };

const plannedCapabilities = [
  {
    icon: KeyRound,
    title: 'Clés API individuelles',
    description:
      'Création et révocation via un service serveur, sans exposer de clé maître.',
  },
  {
    icon: WalletCards,
    title: 'Crédits et facturation',
    description: 'Réservations et débits XOF suivis dans un ledger.',
  },
  {
    icon: Bot,
    title: 'Modèles disponibles',
    description:
      'Accès aux modèles activés et aux prix vérifiés depuis le service IA.',
  },
];

export default function AiCreditsPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-10 px-4 py-12 sm:px-6 lg:px-8">
      <PageHeading
        eyebrow="Services IA"
        title="AI Credits"
        description="Le module est prévu dans l’architecture, mais aucune passerelle, consommation ou tarification n’est encore activée."
      />
      <div className="grid gap-5 md:grid-cols-3">
        {plannedCapabilities.map(({ icon: Icon, title, description }) => (
          <Card key={title}>
            <Icon aria-hidden="true" className="h-6 w-6 text-rose-700" />
            <h2 className="mt-4 font-game text-2xl font-bold">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-ink/65">{description}</p>
          </Card>
        ))}
      </div>
      <EmptyState
        title="Service non activé"
        description="Les modèles, tarifs, clés API et usages s’afficheront uniquement depuis des services configurés et validés."
        tone="warning"
      />
    </div>
  );
}
