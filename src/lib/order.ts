export interface Order {
  ref: string;
  placedAt: string;
  name: string;
  email: string;
  city: string;
  country: string;
  delivery: "standard" | "express";
  items: { slug: string; name: string; qty: number; price: number }[];
  subtotal: number;
  shipping: number;
  total: number;
  eta: string;
}

const KEY = "emberline.orders.v1";

export function saveOrder(order: Order): void {
  try {
    const raw = localStorage.getItem(KEY);
    const list = raw ? (JSON.parse(raw) as Order[]) : [];
    list.push(order);
    localStorage.setItem(KEY, JSON.stringify(list.slice(-8)));
  } catch {
    /* storage unavailable — confirmation still works via the in-memory route */
  }
}

export function loadOrder(ref: string): Order | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const list = JSON.parse(raw) as Order[];
    return list.find((o) => o.ref === ref) ?? null;
  } catch {
    return null;
  }
}
