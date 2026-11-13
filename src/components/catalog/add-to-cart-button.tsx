'use client';

import { useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '@/components/cart/cart-provider';

export function AddToCartButton({
  productId,
  variantId,
}: {
  productId: string;
  variantId: string;
}) {
  const { items, addItem } = useCart();
  const [added, setAdded] = useState(false);
  const item = items.find((cartItem) => cartItem.variantId === variantId);
  const limitReached = item ? item.quantity >= 10 : items.length >= 50;

  function handleAdd() {
    addItem(productId, variantId);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  }

  return (
    <button
      type="button"
      onClick={handleAdd}
      disabled={limitReached}
      className="gradient-brand inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white shadow-soft transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <ShoppingBag aria-hidden="true" className="h-4 w-4" />
      {added
        ? 'Ajouté au panier'
        : limitReached
          ? 'Limite atteinte'
          : 'Ajouter au panier'}
    </button>
  );
}
