"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  color: string;
  size: string;
}

interface CartContextType {
  items: CartItem[];
  /** True after localStorage has been read on the client (avoids hydration / empty-cart flashes). */
  isHydrated: boolean;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (id: number, size: string) => void;
  updateQuantity: (id: number, size: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const MAX_LINE_QTY = 99;

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        const parsed = JSON.parse(savedCart) as CartItem[];
        if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      }
    } catch {
      /* ignore corrupt cart */
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem("cart", JSON.stringify(items));
    } catch {
      /* storage full or disabled */
    }
  }, [items, isHydrated]);

   const addItem = (item: Omit<CartItem, "quantity">, quantity = 1) => {
     const qty = Math.max(1, Math.min(MAX_LINE_QTY, Math.floor(quantity)));
     setItems((prev) => {
       const existing = prev.find(
         (i) => i.id === item.id && i.size === item.size,
       );
       if (existing) {
         return prev.map((i) =>
           i.id === item.id && i.size === item.size
             ? {
                 ...i,
                 quantity: Math.min(MAX_LINE_QTY, i.quantity + qty),
               }
             : i,
         );
       }
       return [...prev, { ...item, quantity: qty }];
     });
     
     // Track AddToCart event
     if (typeof window !== 'undefined' && window.fbq) {
       window.fbq('track', 'AddToCart', {
         content_name: item.name,
         content_type: 'product',
         value: item.price,
         currency: 'EUR'
       });
     }
   };

  const removeItem = (id: number, size: string) => {
    setItems((prev) => prev.filter((i) => !(i.id === id && i.size === size)));
  };

  const updateQuantity = (id: number, size: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id, size);
      return;
    }
    const q = Math.min(MAX_LINE_QTY, Math.max(1, Math.floor(quantity)));
    setItems((prev) =>
      prev.map((i) =>
        i.id === id && i.size === size ? { ...i, quantity: q } : i,
      ),
    );
  };

   const clearCart = () => {
     setItems([]);
   };

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
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
