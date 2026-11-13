'use client';

import { useMemo, useState } from 'react';
import { ProductCard } from '@/components/catalog/product-card';
import { EmptyState } from '@/components/ui/empty-state';
import type { PublicProduct } from '@/modules/catalog/public-catalog';

export function CatalogBrowser({ products }: { products: PublicProduct[] }) {
  const [query, setQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<
    'name' | 'price-asc' | 'price-desc'
  >('name');

  const visibleProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase('fr');
    const filtered = products.filter((product) =>
      `${product.name} ${product.brand ?? ''} ${product.regionCode ?? ''}`
        .toLocaleLowerCase('fr')
        .includes(normalizedQuery),
    );

    return filtered.sort((left, right) => {
      if (sortOrder === 'name')
        return left.name.localeCompare(right.name, 'fr');
      const leftPrice =
        left.variants.reduce<number | null>(
          (price, variant) =>
            price === null || variant.priceXof < price
              ? variant.priceXof
              : price,
          null,
        ) ?? Number.MAX_SAFE_INTEGER;
      const rightPrice =
        right.variants.reduce<number | null>(
          (price, variant) =>
            price === null || variant.priceXof < price
              ? variant.priceXof
              : price,
          null,
        ) ?? Number.MAX_SAFE_INTEGER;
      return sortOrder === 'price-asc'
        ? leftPrice - rightPrice
        : rightPrice - leftPrice;
    });
  }, [products, query, sortOrder]);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="sr-only" htmlFor="catalog-search">
          Rechercher un produit
        </label>
        <input
          id="catalog-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Rechercher par nom, marque ou région"
          className="min-w-0 flex-1 rounded-xl border border-rose-200 bg-surface px-4 py-3 text-sm outline-none focus:border-rose-500"
        />
        <label className="sr-only" htmlFor="catalog-sort">
          Trier les produits
        </label>
        <select
          id="catalog-sort"
          value={sortOrder}
          onChange={(event) => {
            const value = event.currentTarget.value;
            if (
              value === 'name' ||
              value === 'price-asc' ||
              value === 'price-desc'
            ) {
              setSortOrder(value);
            }
          }}
          className="rounded-xl border border-rose-200 bg-surface px-4 py-3 text-sm outline-none focus:border-rose-500"
        >
          <option value="name">Nom</option>
          <option value="price-asc">Prix croissant</option>
          <option value="price-desc">Prix décroissant</option>
        </select>
      </div>
      {visibleProducts.length ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visibleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="Aucun résultat"
          description="Aucun produit publié ne correspond à cette recherche."
        />
      )}
    </div>
  );
}
