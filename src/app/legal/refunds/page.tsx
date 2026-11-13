import type { Metadata } from 'next';
import { Card } from '@/components/ui/card';
import { PageHeading } from '@/components/ui/page-heading';
import { StatusBadge } from '@/components/ui/status-badge';

export const metadata: Metadata = { title: 'Remboursements' };

export default function RefundsPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center gap-3">
        <PageHeading
          eyebrow="Informations légales"
          title="Politique de remboursement"
        />
        <StatusBadge label="Brouillon à valider" tone="warning" />
      </div>
      <Card className="space-y-4 text-sm leading-7 text-ink/65">
        <p>
          Aucune commande ni aucun paiement n’est actuellement accepté par la
          plateforme.
        </p>
        <p>
          Les règles de remboursement devront être définies en fonction des
          produits, des fournisseurs réellement contractés et des obligations
          applicables avant l’ouverture commerciale.
        </p>
      </Card>
    </div>
  );
}
