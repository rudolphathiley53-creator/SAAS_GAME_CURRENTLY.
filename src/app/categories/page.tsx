import type { Metadata } from 'next';
import Link from 'next/link';
import { EmptyState } from '@/components/ui/empty-state';
import { PageHeading } from '@/components/ui/page-heading';
import { listPublishedCategories } from '@/modules/catalog/public-catalog';

export const metadata: Metadata = { title: 'Catégories Gaming' };
export const dynamic = 'force-dynamic';

export default async function CategoriesPage() {
  const result = await listPublishedCategories();

  if (result.status !== 'ready') {
    const description =
      result.status === 'unconfigured'
        ? 'Supabase n’est pas configuré dans cet environnement.'
        : result.status === 'schema-required'
          ? 'Le schéma du catalogue doit être appliqué avant de publier des catégories.'
          : 'Les catégories n’ont pas pu être chargées.';
    return (
      <div className="mx-auto max-w-5xl px-4 py-12">
        <PageHeading eyebrow="Gaming Store" title="Catégories" />
        <div className="mt-8">
          <EmptyState
            title="Catégories indisponibles"
            description={description}
            tone="warning"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-12 sm:px-6 lg:px-8">
      <PageHeading
        eyebrow="Gaming Store"
        title="Catégories"
        description="Seules les catégories actives depuis le catalogue sont affichées."
      />
      {result.categories.length ? (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {result.categories.map((category) => (
            <li key={category.id}>
              <Link
                href={`/categories/${category.slug}`}
                className="block h-full rounded-3xl border border-rose-200 bg-surface p-6 shadow-soft transition-transform hover:-translate-y-1"
              >
                <h2 className="font-game text-2xl font-bold">
                  {category.name}
                </h2>
                {category.description && (
                  <p className="mt-2 text-sm leading-6 text-ink/60">
                    {category.description}
                  </p>
                )}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          title="Aucune catégorie publiée"
          description="Les catégories apparaîtront ici après leur création et leur activation dans le catalogue administrateur."
        />
      )}
    </div>
  );
}
