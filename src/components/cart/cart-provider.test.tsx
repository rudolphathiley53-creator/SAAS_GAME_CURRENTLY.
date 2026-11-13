import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CartProvider, useCart } from '@/components/cart/cart-provider';

const productId = 'c0d2f628-ea3f-4d49-83ef-2c2d01dd5301';
const variantId = '89c1d612-6da4-4df8-9863-d53dc3425f9a';

describe('CartProvider', () => {
  it('stores identifiers and bounded quantities, not client-side prices', async () => {
    const { result } = renderHook(() => useCart(), { wrapper: CartProvider });

    act(() => {
      result.current.addItem(productId, variantId);
      result.current.addItem(productId, variantId);
    });

    expect(result.current.items).toEqual([
      { productId, variantId, quantity: 2 },
    ]);
    expect(window.localStorage.getItem('gocoins-cart')).toContain(
      '"quantity":2',
    );
    expect(window.localStorage.getItem('gocoins-cart')).not.toContain('price');
  });

  it('caps the quantity of a variant at ten', () => {
    const { result } = renderHook(() => useCart(), { wrapper: CartProvider });

    act(() => {
      for (let index = 0; index < 12; index += 1) {
        result.current.addItem(productId, variantId);
      }
    });

    expect(result.current.items).toEqual([
      { productId, variantId, quantity: 10 },
    ]);
  });

  it('ignores malformed saved cart data', async () => {
    window.localStorage.setItem(
      'gocoins-cart',
      JSON.stringify([{ variantId: 'invalid' }]),
    );

    const { result } = renderHook(() => useCart(), { wrapper: CartProvider });
    await waitFor(() => expect(result.current.items).toEqual([]));

    expect(result.current.items).toEqual([]);
  });
});
