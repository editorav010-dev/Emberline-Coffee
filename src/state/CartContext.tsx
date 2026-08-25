import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { getProduct } from "../data/products";
import { clamp } from "../lib/utils";

export const MAX_QTY = 10;
export const FREE_SHIPPING_AT = 45;
export const STANDARD_SHIPPING = 5.9;
export const EXPRESS_SHIPPING = 12;

export interface CartLine {
  slug: string;
  qty: number;
}

interface CartContextValue {
  lines: CartLine[];
  count: number;
  subtotal: number;
  add: (slug: string, qty?: number) => { clamped: boolean };
  remove: (slug: string) => void;
  setQty: (slug: string, qty: number) => { clamped: boolean };
  clear: () => void;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  bumpKey: number;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "emberline.cart.v1";

function loadCart(): CartLine[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartLine[];
    return parsed.filter((l) => getProduct(l.slug) && l.qty >= 1 && l.qty <= MAX_QTY);
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(loadCart);
  const [isOpen, setIsOpen] = useState(false);
  const [bumpKey, setBumpKey] = useState(0);
  const hydrated = useRef(false);

  useEffect(() => {
    if (!hydrated.current) {
      hydrated.current = true;
      return;
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* storage unavailable — cart still works in memory */
    }
  }, [lines]);

  const add = useCallback((slug: string, qty = 1) => {
    let clamped = false;
    setLines((prev) => {
      const existing = prev.find((l) => l.slug === slug);
      if (existing) {
        const wanted = existing.qty + qty;
        clamped = wanted > MAX_QTY;
        const next = clamp(wanted, 1, MAX_QTY);
        return prev.map((l) => (l.slug === slug ? { ...l, qty: next } : l));
      }
      clamped = qty > MAX_QTY;
      return [...prev, { slug, qty: clamp(qty, 1, MAX_QTY) }];
    });
    setBumpKey((k) => k + 1);
    return { clamped };
  }, []);

  const remove = useCallback((slug: string) => {
    setLines((prev) => prev.filter((l) => l.slug !== slug));
  }, []);

  const setQty = useCallback((slug: string, qty: number) => {
    const clamped = qty < 1 || qty > MAX_QTY;
    setLines((prev) => prev.map((l) => (l.slug === slug ? { ...l, qty: clamp(qty, 1, MAX_QTY) } : l)));
    return { clamped };
  }, []);

  const clear = useCallback(() => setLines([]), []);
  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const { count, subtotal } = useMemo(() => {
    let c = 0;
    let s = 0;
    for (const line of lines) {
      const product = getProduct(line.slug);
      if (!product) continue;
      c += line.qty;
      s += line.qty * product.price;
    }
    return { count: c, subtotal: s };
  }, [lines]);

  const value = useMemo(
    () => ({ lines, count, subtotal, add, remove, setQty, clear, isOpen, openCart, closeCart, bumpKey }),
    [lines, count, subtotal, add, remove, setQty, clear, isOpen, openCart, closeCart, bumpKey],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
