import type { Metadata } from 'next';
import { CartView } from '@/components/cart/cart-view';
import { PageHeading } from '@/components/ui/page-heading';

export const metadata: Metadata = { title: 'Panier' };

export default function CartPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-12 sm:px-6 lg:px-8">
      <PageHeading
        eyebrow="Gaming Store"
        title="Votre panier"
        description="Les prix sont relus depuis les variantes actives du catalogue."
      />
      <CartView />
    </div>
  );
}
