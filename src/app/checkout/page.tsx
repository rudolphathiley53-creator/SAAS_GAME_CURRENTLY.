import type { Metadata } from 'next';
import { CartView } from '@/components/cart/cart-view';
import { PageHeading } from '@/components/ui/page-heading';

export const metadata: Metadata = { title: 'Récapitulatif' };

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-12 sm:px-6 lg:px-8">
      <PageHeading
        eyebrow="Avant la commande"
        title="Vérifier le panier"
        description="La validation finale ne sera activée qu’avec l’authentification et le calcul des prix côté serveur."
      />
      <CartView checkout />
    </div>
  );
}
