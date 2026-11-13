import type { Metadata } from 'next';
import { Card } from '@/components/ui/card';
import { PageHeading } from '@/components/ui/page-heading';
import { StatusBadge } from '@/components/ui/status-badge';

export const metadata: Metadata = { title: 'Conditions' };

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center gap-3">
        <PageHeading
          eyebrow="Informations légales"
          title="Conditions d’utilisation"
        />
        <StatusBadge label="Brouillon à valider" tone="warning" />
      </div>
      <Card className="space-y-4 text-sm leading-7 text-ink/65">
        <p>
          Cette page est un emplacement technique et ne constitue pas un
          document contractuel.
        </p>
        <p>
          Les conditions définitives, l’identité légale de l’exploitant, le
          périmètre des services, les prix, les délais et les obligations
          locales doivent être rédigés et validés avant toute mise en
          production.
        </p>
        <p>
          Les fonctionnalités commerciales ne sont pas activées par cette
          interface.
        </p>
      </Card>
    </div>
  );
}
