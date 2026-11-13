import { EmptyState } from '@/components/ui/empty-state';
import { CatalogBrowser } from '@/components/catalog/catalog-browser';
import type { CatalogResult } from '@/modules/catalog/public-catalog';

export function CatalogGrid({ result }: { result: CatalogResult }) {
  if (result.status === 'unconfigured') {
    return (
      <EmptyState
        title="Catalogue en préparation"
        description="La connexion à la base Supabase n’est pas configurée dans cet environnement."
      />
    );
  }

  if (result.status === 'schema-required') {
    return (
      <EmptyState
        title="Catalogue indisponible"
        description="Le schéma de catalogue doit être appliqué et vérifié avant de publier des produits."
        tone="warning"
      />
    );
  }

  if (result.status === 'error') {
    return (
      <EmptyState
        title="Impossible de charger le catalogue"
        description="La base n’a pas pu répondre. Réessayez plus tard ou contactez le support."
        tone="warning"
      />
    );
  }

  if (!result.products.length) {
    return (
      <EmptyState
        title="Aucun produit publié"
        description="Les produits apparaîtront ici après leur création et leur publication depuis le catalogue administrateur."
      />
    );
  }

  return <CatalogBrowser products={result.products} />;
}
