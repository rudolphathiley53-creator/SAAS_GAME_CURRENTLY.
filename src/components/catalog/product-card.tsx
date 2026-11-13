import Link from 'next/link';
import { ArrowUpRight, Gamepad2 } from 'lucide-react';
import type { PublicProduct } from '@/modules/catalog/public-catalog';
import { formatXof } from '@/lib/format-xof';

export function ProductCard({ product }: { product: PublicProduct }) {
  const lowestPrice = product.variants.reduce<number | null>(
    (price, variant) =>
      price === null || variant.priceXof < price ? variant.priceXof : price,
    null,
  );

  return (
    <article className="group overflow-hidden rounded-3xl border border-rose-100 bg-surface shadow-soft transition-transform hover:-translate-y-1">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="grid h-44 place-items-center bg-gradient-to-br from-rose-100 via-surface to-coral-50">
          <Gamepad2
            aria-hidden="true"
            className="h-14 w-14 text-rose-600/75 transition-transform group-hover:scale-110"
          />
        </div>
        <div className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-rose-700">
                {product.brand ?? 'Gaming'}
                {product.regionCode ? ` · ${product.regionCode}` : ''}
              </p>
              <h3 className="mt-2 text-lg font-extrabold">{product.name}</h3>
            </div>
            <ArrowUpRight
              aria-hidden="true"
              className="h-5 w-5 shrink-0 text-ink/40 transition-colors group-hover:text-rose-700"
            />
          </div>
          <p className="mt-2 min-h-10 text-sm leading-5 text-ink/60">
            {product.shortDescription ?? 'Consultez les options disponibles.'}
          </p>
          <div className="mt-5 border-t border-rose-100 pt-4">
            {lowestPrice !== null ? (
              <p className="text-sm font-bold">
                Dès{' '}
                <span className="text-rose-700">{formatXof(lowestPrice)}</span>
              </p>
            ) : (
              <p className="text-xs font-semibold text-ink/50">
                Aucune variante disponible
              </p>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}
