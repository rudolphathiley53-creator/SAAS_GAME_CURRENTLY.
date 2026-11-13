import Link from 'next/link';
import { EmptyState } from '@/components/ui/empty-state';
import { Card } from '@/components/ui/card';

const adminPages: Record<string, string> = {
  '': 'Vue d’ensemble',
  users: 'Utilisateurs',
  'catalog/categories': 'Catégories',
  'catalog/products': 'Produits',
  'catalog/variants': 'Variantes',
  providers: 'Fournisseurs',
  orders: 'Commandes',
  payments: 'Paiements',
  deliveries: 'Livraisons',
  webhooks: 'Webhooks',
  jobs: 'Tâches asynchrones',
  wallet: 'Wallet',
  'ai/models': 'Modèles IA',
  'ai/keys': 'Clés IA',
  'ai/usage': 'Usage IA',
  finance: 'Finance',
  analytics: 'Analytique',
  'audit-logs': 'Journal d’audit',
  settings: 'Paramètres',
};

export default async function AdminSectionPage({
  params,
}: {
  params: Promise<{ section?: string[] }>;
}) {
  const { section = [] } = await params;
  const path = section.join('/');
  const detailTitle =
    section.length === 2 && section[0] === 'users'
      ? 'Détail utilisateur'
      : section.length === 2 && section[0] === 'orders'
        ? 'Détail de commande'
        : section.length === 2 && section[0] === 'providers'
          ? 'Détail fournisseur'
          : section.length === 3 &&
              section[0] === 'catalog' &&
              section[1] === 'products'
            ? 'Détail produit'
            : undefined;
  const title = adminPages[path] ?? detailTitle;

  if (!title) {
    return (
      <Card className="p-6">
        <EmptyState
          title="Section introuvable"
          description="Cette section d’administration n’existe pas."
          action={
            <Link href="/admin" className="font-bold text-rose-700">
              Retour à la console
            </Link>
          }
          tone="warning"
        />
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <EmptyState
        title={`${title} non activé`}
        description="Aucune action administrative n’est exposée avant la mise en place de son schéma, de ses API serveur et de ses contrôles d’audit."
        tone="neutral"
      />
    </Card>
  );
}
