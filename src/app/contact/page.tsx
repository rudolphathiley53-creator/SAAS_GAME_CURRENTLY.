import type { Metadata } from 'next';
import { Card } from '@/components/ui/card';
import { PageHeading } from '@/components/ui/page-heading';

export const metadata: Metadata = { title: 'Contact' };

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-12 sm:px-6 lg:px-8">
      <PageHeading
        eyebrow="Support"
        title="Nous contacter"
        description="Les canaux de support seront publiés après validation opérationnelle."
      />
      <Card>
        <h2 className="font-game text-2xl font-bold">Support en préparation</h2>
        <p className="mt-3 text-sm leading-6 text-ink/65">
          Aucun e-mail, numéro WhatsApp ou délai de prise en charge n’est
          inventé ici. Les clients connectés pourront utiliser l’espace support
          lorsque le service sera activé.
        </p>
      </Card>
    </div>
  );
}
