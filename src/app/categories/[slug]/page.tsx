import type { Metadata } from 'next';
import Link from 'next/link';
import { CatalogGrid } from '@/components/catalog/catalog-grid';
import { EmptyState } from '@/components/ui/empty-state';
import { PageHeading } from '@/components/ui/page-heading';
import {
  getPublishedCategoryBySlug,
  listPublishedCategoryProducts,
} from '@/modules/catalog/public-catalog';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const result = await getPublishedCategoryBySlug(slug);
  return {
    title:
      result.status === 'ready'
        ? result.category.name
        : 'Catégorie indisponible',
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const categoryResult = await getPublishedCategoryBySlug(slug);

  if (categoryResult.status !== 'ready') {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12">
        <EmptyState
          title="Catégorie indisponible"
          description="Cette catégorie n’est pas publiée ou le catalogue n’est pas accessible."
          action={
            <Link href="/gaming" className="font-bold text-rose-700">
              Voir le Gaming Store
            </Link>
          }
        />
      </div>
    );
  }

  const category = categoryResult.category;
  const products = await listPublishedCategoryProducts(category.id);

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-12 sm:px-6 lg:px-8">
      <PageHeading
        eyebrow="Catégorie"
        title={category.name}
        description={category.description ?? undefined}
      />
      <CatalogGrid result={products} />
    </div>
  );
}
