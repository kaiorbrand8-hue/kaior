"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { CartItem } from "@/lib/types";

const CART_KEY = "kaior_cart";
const SHIPPING_FLAT_RATE = 70;
const FREE_SHIPPING_THRESHOLD = 2000;

type CartContextValue = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, size: string, color: string) => void;
  updateQuantity: (productId: string, size: string, color: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  shipping: number;
  total: number;
};

const CartContext = createContext<CartContextValue | null>(null);

function lineKey(productId: string, size: string, color: string) {
  return `${productId}__${size}__${color}`;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(CART_KEY);
    if (raw) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrating from localStorage, unavailable during SSR
        setItems(JSON.parse(raw));
      } catch {
        setItems([]);
      }
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const addItem = (item: CartItem) => {
    setItems((prev) => {
      const key = lineKey(item.productId, item.size, item.color);
      const existing = prev.find((i) => lineKey(i.productId, i.size, i.color) === key);
      if (existing) {
        return prev.map((i) =>
          lineKey(i.productId, i.size, i.color) === key
            ? { ...i, quantity: Math.min(i.quantity + item.quantity, i.stock) }
            : i
        );
      }
      return [...prev, item];
    });
  };

  const removeItem = (productId: string, size: string, color: string) => {
    const key = lineKey(productId, size, color);
    setItems((prev) => prev.filter((i) => lineKey(i.productId, i.size, i.color) !== key));
  };

  const updateQuantity = (productId: string, size: string, color: string, quantity: number) => {
    const key = lineKey(productId, size, color);
    setItems((prev) =>
      prev.map((i) =>
        lineKey(i.productId, i.size, i.color) === key
          ? { ...i, quantity: Math.max(1, Math.min(quantity, i.stock)) }
          : i
      )
    );
  };

  const clearCart = () => setItems([]);

  const { itemCount, subtotal } = useMemo(() => {
    return items.reduce(
      (acc, i) => ({
        itemCount: acc.itemCount + i.quantity,
        subtotal: acc.subtotal + i.quantity * i.price,
      }),
      { itemCount: 0, subtotal: 0 }
    );
  }, [items]);

  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT_RATE;
  const total = subtotal + shipping;

  const value = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    itemCount,
    subtotal,
    shipping,
    total,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
