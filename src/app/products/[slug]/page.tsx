import type { Metadata } from 'next';
import Link from 'next/link';
import { AddToCartButton } from '@/components/catalog/add-to-cart-button';
import { EmptyState } from '@/components/ui/empty-state';
import { PageHeading } from '@/components/ui/page-heading';
import { formatXof } from '@/lib/format-xof';
import { getPublishedProductBySlug } from '@/modules/catalog/public-catalog';
import type { Json } from '@/types/database.types';

export const dynamic = 'force-dynamic';

function getMetadataText(value: Json, key: string): string | null {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return null;
  }
  const field = value[key];
  if (typeof field === 'string') return field.trim() || null;
  if (typeof field === 'number' && Number.isFinite(field)) {
    return String(field);
  }
  return null;
}

function ProductMetadata({ value }: { value: Json }) {
  const details = [
    ['platform', 'Plateforme'],
    ['denomination', 'Dénomination'],
    ['conditions', 'Conditions'],
    ['terms', 'Conditions d’utilisation'],
  ].flatMap(([key, label]) => {
    const text = getMetadataText(value, key);
    return text ? [{ key, label, text }] : [];
  });

  if (!details.length) return null;

  return (
    <dl className="grid gap-3 rounded-2xl border border-rose-100 bg-surface p-4 sm:grid-cols-2">
      {details.map(({ key, label, text }) => (
        <div key={key}>
          <dt className="text-xs font-bold uppercase tracking-wide text-ink/50">
            {label}
          </dt>
          <dd className="mt-1 whitespace-pre-wrap text-sm text-ink/75">
            {text}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const result = await getPublishedProductBySlug(slug);
  return {
    title:
      result.status === 'ready' ? result.product.name : 'Produit indisponible',
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const result = await getPublishedProductBySlug(slug);

  if (result.status !== 'ready') {
    const description =
      result.status === 'unconfigured'
        ? 'Supabase n’est pas configuré dans cet environnement.'
        : result.status === 'schema-required'
          ? 'Le schéma de catalogue doit être appliqué avant de consulter les produits.'
          : result.status === 'not-found'
            ? 'Ce produit n’existe pas ou n’est pas publié.'
            : 'Le catalogue n’a pas pu être chargé pour le moment.';
    return (
      <div className="mx-auto max-w-5xl px-4 py-12">
        <EmptyState
          title="Produit indisponible"
          description={description}
          action={
            <Link
              href="/gaming"
              className="font-bold text-rose-700 hover:text-rose-800"
            >
              Retour au catalogue
            </Link>
          }
        />
      </div>
    );
  }

  const product = result.product;
  const availableVariants = product.variants;

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-12 sm:px-6 lg:px-8">
      <Link
        href="/gaming"
        className="text-sm font-bold text-rose-700 hover:text-rose-800"
      >
        ← Catalogue gaming
      </Link>
      <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="grid min-h-72 place-items-center rounded-[2rem] border border-rose-200 bg-gradient-to-br from-rose-100 via-surface to-coral-50">
          <span className="font-game text-5xl font-bold text-rose-700">
            {product.brand ?? 'GOCOINS'}
          </span>
        </div>
        <div className="space-y-6">
          <PageHeading
            eyebrow={`${product.productType.replaceAll('_', ' ')}${product.regionCode ? ` · ${product.regionCode}` : ''}`}
            title={product.name}
            description={
              product.description ?? product.shortDescription ?? undefined
            }
          />
          <ProductMetadata value={product.metadata} />
          {availableVariants.length ? (
            <section aria-labelledby="variant-heading" className="space-y-3">
              <h2 id="variant-heading" className="text-sm font-extrabold">
                Variantes disponibles
              </h2>
              {availableVariants.map((variant) => (
                <div
                  key={variant.id}
                  className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-rose-200 bg-surface p-4"
                >
                  <div>
                    <p className="font-bold">{variant.name}</p>
                    <p className="mt-1 text-xs text-ink/55">
                      SKU {variant.sku}
                    </p>
                    {variant.description && (
                      <p className="mt-2 text-sm text-ink/65">
                        {variant.description}
                      </p>
                    )}
                    <ProductMetadata value={variant.variantData} />
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="whitespace-nowrap font-extrabold text-rose-700">
                      {formatXof(variant.priceXof)}
                    </span>
                    <AddToCartButton
                      productId={product.id}
                      variantId={variant.id}
                    />
                  </div>
                </div>
              ))}
            </section>
          ) : (
            <EmptyState
              title="Aucune variante disponible"
              description="Les variantes pourront être commandées uniquement lorsqu’elles sont actives dans le catalogue."
            />
          )}
          <p className="text-xs leading-5 text-ink/50">
            Le panier conserve uniquement les identifiants de variante et les
            quantités. Le prix est relu depuis le catalogue et ne constitue pas
            un devis de commande.
          </p>
        </div>
      </div>
    </div>
  );
}
