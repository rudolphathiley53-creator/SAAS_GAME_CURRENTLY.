'use client';

import {
  createContext,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from 'react';
import { z } from 'zod';

const CART_STORAGE_KEY = 'gocoins-cart';
const CART_CHANGE_EVENT = 'gocoins-cart-change';
const cartItemSchema = z.object({
  variantId: z.string().uuid(),
  productId: z.string().uuid(),
  quantity: z.number().int().min(1).max(10),
});
const cartSchema = z.array(cartItemSchema).max(50);
const EMPTY_CART: CartItem[] = [];

export type CartItem = z.infer<typeof cartItemSchema>;

type CartContextValue = {
  items: CartItem[];
  addItem: (productId: string, variantId: string) => void;
  removeItem: (variantId: string) => void;
};

const CartContext = createContext<CartContextValue | null>(null);
let cartSnapshot: CartItem[] | null = null;
let lastSavedCart: string | null | undefined;
let storageUnavailable = false;

function getCartSnapshot(): CartItem[] {
  if (typeof window === 'undefined') return EMPTY_CART;
  if (storageUnavailable) return cartSnapshot ?? EMPTY_CART;

  try {
    const savedCart = window.localStorage.getItem(CART_STORAGE_KEY);
    if (cartSnapshot && savedCart === lastSavedCart) return cartSnapshot;
    if (!savedCart) {
      cartSnapshot = EMPTY_CART;
      lastSavedCart = savedCart;
      return cartSnapshot;
    }

    const parsed = cartSchema.safeParse(JSON.parse(savedCart));
    if (parsed.success) {
      cartSnapshot = parsed.data;
      lastSavedCart = savedCart;
      return cartSnapshot;
    }

    console.warn('Saved cart data is invalid and has been ignored.');
    cartSnapshot = EMPTY_CART;
    lastSavedCart = savedCart;
    return cartSnapshot;
  } catch (error) {
    console.error('Unable to read the saved cart.', error);
    storageUnavailable = true;
  }

  return cartSnapshot ?? EMPTY_CART;
}

function getServerCartSnapshot() {
  return EMPTY_CART;
}

function notifyCartChange() {
  window.dispatchEvent(new Event(CART_CHANGE_EVENT));
}

function subscribeToCart(listener: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === CART_STORAGE_KEY || event.key === null) {
      cartSnapshot = null;
      lastSavedCart = undefined;
      storageUnavailable = false;
      listener();
    }
  };
  window.addEventListener('storage', onStorage);
  window.addEventListener(CART_CHANGE_EVENT, listener);
  return () => {
    window.removeEventListener('storage', onStorage);
    window.removeEventListener(CART_CHANGE_EVENT, listener);
  };
}

function saveCart(items: CartItem[]) {
  cartSnapshot = items;
  const serializedCart = JSON.stringify(items);
  try {
    window.localStorage.setItem(CART_STORAGE_KEY, serializedCart);
    lastSavedCart = serializedCart;
    storageUnavailable = false;
  } catch (error) {
    console.error('Unable to save the cart.', error);
    try {
      lastSavedCart = window.localStorage.getItem(CART_STORAGE_KEY);
    } catch (readError) {
      console.error(
        'Unable to reconcile the saved cart after a write failure.',
        readError,
      );
      lastSavedCart = undefined;
      storageUnavailable = true;
    }
  }
  notifyCartChange();
}

function addCartItem(productId: string, variantId: string) {
  const current = getCartSnapshot();
  const existing = current.find((item) => item.variantId === variantId);
  if (existing) {
    if (existing.quantity >= 10) return;
    saveCart(
      current.map((item) =>
        item.variantId === variantId
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      ),
    );
    return;
  }
  if (current.length >= 50) return;
  saveCart([...current, { productId, variantId, quantity: 1 }]);
}

function removeCartItem(variantId: string) {
  saveCart(getCartSnapshot().filter((item) => item.variantId !== variantId));
}

export function CartProvider({ children }: { children: ReactNode }) {
  const items = useSyncExternalStore(
    subscribeToCart,
    getCartSnapshot,
    getServerCartSnapshot,
  );
  const value = useMemo(
    () => ({
      items,
      addItem: addCartItem,
      removeItem: removeCartItem,
    }),
    [items],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}
