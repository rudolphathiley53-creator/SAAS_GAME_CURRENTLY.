import type { Metadata } from 'next';
import { Card } from '@/components/ui/card';
import { PageHeading } from '@/components/ui/page-heading';
import { StatusBadge } from '@/components/ui/status-badge';

export const metadata: Metadata = { title: 'Confidentialité' };

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center gap-3">
        <PageHeading
          eyebrow="Données personnelles"
          title="Politique de confidentialité"
        />
        <StatusBadge label="Brouillon à valider" tone="warning" />
      </div>
      <Card className="space-y-4 text-sm leading-7 text-ink/65">
        <p>
          Cette page ne remplace pas une politique de confidentialité validée
          juridiquement.
        </p>
        <p>
          Avant production, documenter précisément les données traitées, leurs
          finalités, les durées de conservation, les sous-traitants, les mesures
          de sécurité et les droits des personnes concernées.
        </p>
        <p>
          Aucune donnée commerciale ou activité de compte fictive n’est
          présentée dans cette interface.
        </p>
      </Card>
    </div>
  );
}
