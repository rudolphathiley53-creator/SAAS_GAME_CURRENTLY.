import type { Metadata } from 'next';
import Link from 'next/link';
import { EmptyState } from '@/components/ui/empty-state';

export const metadata: Metadata = { title: 'Suivi de commande' };

export default async function OrderStatusPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;
  const validOrderNumber = /^[A-Za-z0-9-]{1,64}$/.test(orderNumber);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <EmptyState
        title="Suivi de commande indisponible"
        description={
          validOrderNumber
            ? 'Aucune commande ne peut être consultée avant la mise en place du service de commande sécurisé.'
            : 'La référence de commande est invalide.'
        }
        action={
          <Link href="/gaming" className="font-bold text-rose-700">
            Retour au Gaming Store
          </Link>
        }
        tone="warning"
      />
    </div>
  );
}
