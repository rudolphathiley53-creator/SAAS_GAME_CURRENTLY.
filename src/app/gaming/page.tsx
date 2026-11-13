import type { Metadata } from 'next';
import { CatalogGrid } from '@/components/catalog/catalog-grid';
import { PageHeading } from '@/components/ui/page-heading';
import Link from 'next/link';
import {
  listPublishedCatalog,
  listPublishedCategories,
} from '@/modules/catalog/public-catalog';

export const metadata: Metadata = { title: 'Gaming Store' };
export const dynamic = 'force-dynamic';

export default async function GamingPage() {
  const [result, categories] = await Promise.all([
    listPublishedCatalog(),
    listPublishedCategories(),
  ]);

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-12 sm:px-6 lg:px-8">
      <PageHeading
        eyebrow="Gaming Store"
        title="Catalogue gaming"
        description="Les produits et variantes affichés proviennent du catalogue actif et publié."
      />
      {categories.status === 'ready' && categories.categories.length > 0 && (
        <nav aria-label="Catégories Gaming" className="flex flex-wrap gap-2">
          {categories.categories.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="rounded-full border border-rose-200 bg-surface px-4 py-2 text-sm font-bold hover:bg-rose-50"
            >
              {category.name}
            </Link>
          ))}
          <Link
            href="/categories"
            className="rounded-full px-4 py-2 text-sm font-bold text-rose-700 hover:bg-rose-50"
          >
            Toutes les catégories
          </Link>
        </nav>
      )}
      <CatalogGrid result={result} />
    </div>
  );
}
