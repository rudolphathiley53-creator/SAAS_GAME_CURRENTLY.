'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { z } from 'zod';
import { useCart } from '@/components/cart/cart-provider';
import { EmptyState } from '@/components/ui/empty-state';
import { formatXof } from '@/lib/format-xof';

const cartVariantSchema = z.object({
  id: z.string().uuid(),
  productId: z.string().uuid(),
  productName: z.string(),
  productSlug: z.string(),
  sku: z.string(),
  name: z.string(),
  priceXof: z.number().int().positive().safe(),
});
const cartResponseSchema = z.object({
  status: z.enum(['ready', 'unconfigured', 'schema-required', 'error']),
  variants: z.array(cartVariantSchema),
});

type CartResponse = z.infer<typeof cartResponseSchema>;

export function CartView({ checkout = false }: { checkout?: boolean }) {
  const { items, removeItem } = useCart();
  const [response, setResponse] = useState<{
    requestKey: string;
    result: CartResponse;
  } | null>(null);

  const requestKey = useMemo(
    () => items.map((item) => item.variantId).join(','),
    [items],
  );
  const result = response?.requestKey === requestKey ? response.result : null;

  useEffect(() => {
    const controller = new AbortController();
    const query = new URLSearchParams();
    const variantIds = requestKey ? requestKey.split(',') : [];
    variantIds.forEach((id) => query.append('id', id));

    fetch(`/api/v1/catalog/cart?${query.toString()}`, {
      signal: controller.signal,
    })
      .then(async (response) => {
        const payload: unknown = await response.json();
        const parsed = cartResponseSchema.safeParse(payload);
        if (!parsed.success)
          throw new Error('Invalid cart response from server.');
        setResponse({ requestKey, result: parsed.data });
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError')
          return;
        console.error('Unable to refresh cart prices from the catalog.', error);
        setResponse({ requestKey, result: { status: 'error', variants: [] } });
      });

    return () => controller.abort();
  }, [requestKey]);

  if (!result) {
    return (
      <p className="py-12 text-center text-sm text-ink/60" role="status">
        Chargement du panier…
      </p>
    );
  }

  if (result.status !== 'ready') {
    const description =
      result.status === 'unconfigured'
        ? 'La base Supabase n’est pas configurée dans cet environnement.'
        : result.status === 'schema-required'
          ? 'Le schéma du catalogue doit être appliqué avant de valider la disponibilité.'
          : 'Les prix et disponibilités n’ont pas pu être revalidés depuis le catalogue.';
    return (
      <EmptyState
        title="Panier non vérifiable"
        description={description}
        tone="warning"
      />
    );
  }

  if (!items.length) {
    return (
      <EmptyState
        title="Votre panier est vide"
        description="Ajoutez une variante actuellement publiée dans le Gaming Store pour la voir ici."
        action={
          <Link
            href="/gaming"
            className="inline-flex rounded-xl bg-rose-600 px-5 py-3 text-sm font-bold text-white"
          >
            Parcourir le catalogue
          </Link>
        }
      />
    );
  }

  const variantsById = new Map(
    result.variants.map((variant) => [variant.id, variant]),
  );
  const total = items.reduce((sum, item) => {
    const variant = variantsById.get(item.variantId);
    if (!variant) return sum;
    return sum + BigInt(variant.priceXof) * BigInt(item.quantity);
  }, BigInt(0));
  const hasUnavailableItems = items.some(
    (item) => !variantsById.has(item.variantId),
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_21rem]">
      <div className="space-y-3">
        {items.map((item) => {
          const variant = variantsById.get(item.variantId);
          return (
            <article
              key={item.variantId}
              className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-rose-100 bg-surface p-4"
            >
              <div>
                {variant ? (
                  <>
                    <Link
                      href={`/products/${variant.productSlug}`}
                      className="font-bold hover:text-rose-700"
                    >
                      {variant.productName} · {variant.name}
                    </Link>
                    <p className="mt-1 text-xs text-ink/55">
                      SKU {variant.sku} · Quantité {item.quantity}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="font-bold">Variante indisponible</p>
                    <p className="mt-1 text-xs text-ink/55">
                      Cette variante n’est plus publiée ou active.
                    </p>
                  </>
                )}
              </div>
              <div className="flex items-center gap-4">
                {variant && (
                  <span className="font-extrabold text-rose-700">
                    {formatXof(
                      BigInt(variant.priceXof) * BigInt(item.quantity),
                    )}
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => removeItem(item.variantId)}
                  className="rounded-lg border border-rose-200 px-3 py-2 text-xs font-bold hover:bg-rose-50"
                >
                  Retirer
                </button>
              </div>
            </article>
          );
        })}
      </div>

      <aside className="h-fit rounded-3xl border border-rose-200 bg-surface p-5 shadow-soft">
        <h2 className="font-game text-2xl font-bold">
          {checkout ? 'Récapitulatif' : 'Total indicatif'}
        </h2>
        <div className="mt-4 flex justify-between border-t border-rose-100 pt-4 text-sm">
          <span className="text-ink/60">Sous-total actuel</span>
          <strong>{formatXof(total)}</strong>
        </div>
        <p className="mt-3 text-xs leading-5 text-ink/55">
          Ce montant est une lecture indicative du catalogue, pas une commande
          ni une confirmation de prix.
        </p>
        {checkout ? (
          <div className="mt-5">
            <EmptyState
              title="Commande non activée"
              description="La création de commande exige une session client et un calcul transactionnel côté serveur. Aucun paiement ne sera déclenché ici."
              tone="warning"
            />
          </div>
        ) : (
          <Link
            href="/checkout"
            aria-disabled={hasUnavailableItems}
            className={`mt-5 flex justify-center rounded-xl px-5 py-3 text-sm font-bold text-white ${
              hasUnavailableItems
                ? 'pointer-events-none bg-ink/35'
                : 'bg-rose-600 hover:bg-rose-700'
            }`}
          >
            Continuer
          </Link>
        )}
      </aside>
    </div>
  );
}
