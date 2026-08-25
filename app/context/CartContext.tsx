"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { normalizeProductImage } from "@/lib/product-normalize";

export interface CartItem {
  _id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  color: string;
  size: string;
  category: string;
}

interface CartContextType {
  items: CartItem[];
  isHydrated: boolean;
  addItem: (
    item: Omit<CartItem, "quantity">,
    quantity?: number,
  ) => void;
  removeItem: (productKey: string) => void;
  updateQuantity: (productKey: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const MAX_LINE_QTY = 99;
const CART_STORAGE_KEY = "cart";

function cartKey(item: { _id: string; size: string; color: string }): string {
  return `${item._id}|${item.size}|${item.color}`;
}

function migrateOldCart(raw: unknown): CartItem[] {
  if (!Array.isArray(raw)) return [];
  const migrated: CartItem[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const candidate = item as Record<string, unknown>;
    const legacyId = candidate.id;
    const _id =
      typeof candidate._id === "string"
        ? candidate._id
        : typeof legacyId === "number"
          ? String(legacyId)
          : typeof legacyId === "string"
            ? legacyId
            : crypto.randomUUID?.() ?? `legacy-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    migrated.push({
      _id,
      productId: _id,
      name: String(candidate.name ?? ""),
      price: Math.max(0, Number(candidate.price ?? 0)),
      quantity: Math.max(1, Math.min(MAX_LINE_QTY, Math.floor(Number(candidate.quantity ?? 1)))),
      image: normalizeProductImage(
        typeof candidate.image === "string" ? candidate.image : undefined,
      ),
      color: String(candidate.color ?? ""),
      size: String(candidate.size ?? "Unique"),
      category: String(candidate.category ?? ""),
    });
  }
  return migrated;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const normalized = migrateOldCart(parsed);
        setItems(
          normalized.map((item) => ({
            ...item,
            image: normalizeProductImage(item.image),
          })),
        );
      }
    } catch {
      // ignore corrupt cart
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // storage full or disabled
    }
  }, [items, isHydrated]);

  const addItem = (
    item: Omit<CartItem, "quantity">,
    quantity = 1,
  ) => {
    const qty = Math.max(1, Math.min(MAX_LINE_QTY, Math.floor(quantity)));
    const normalizedItem: CartItem = {
      ...item,
      image: normalizeProductImage(item.image),
      productId: item._id,
      quantity: qty,
    };

    setItems((prev) => {
      const key = cartKey(normalizedItem);
      const existing = prev.find((i) => cartKey(i) === key);
      if (existing) {
        return prev.map((i) =>
          cartKey(i) === key
            ? {
                ...i,
                quantity: Math.min(MAX_LINE_QTY, i.quantity + qty),
                image: normalizeProductImage(i.image),
              }
            : i,
        );
      }
      return [...prev, normalizedItem];
    });
  };

  const removeItem = (productKey: string) => {
    setItems((prev) => prev.filter((i) => cartKey(i) !== productKey));
  };

  const updateQuantity = (productKey: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productKey);
      return;
    }
    const q = Math.min(MAX_LINE_QTY, Math.max(1, Math.floor(quantity)));
    setItems((prev) =>
      prev.map((i) => (cartKey(i) === productKey ? { ...i, quantity: q } : i)),
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        isHydrated,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        total,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

export { cartKey };
