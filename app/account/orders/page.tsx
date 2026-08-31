"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { apiUrl } from "@/lib/api-client";
import { useAuth } from "@/app/context/AuthContext";

type Order = {
  _id: string;
  orderNumber: string;
  createdAt: string;
  total: number;
  status: string;
  items: { name: string; quantity: number; price: number }[];
};

export default function AccountOrdersPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch(apiUrl("/api/account/orders"), { credentials: "include" });
        const data = await res.json();
        if (!cancelled && data.success) {
          setOrders(data.orders);
        }
      } catch {
        // ignore
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="loading-spinner" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-white mb-4">Vous devez être connecté.</p>
          <button onClick={() => router.push("/login")} className="px-6 py-3 bg-white text-black rounded-full">
            Se connecter
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-8">Commandes</h1>

        {orders.length === 0 && (
          <p className="text-white/60">Aucune commande pour le moment.</p>
        )}

        <div className="space-y-4">
          {orders.map((order) => (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <p className="font-bold text-white">Commande #{order.orderNumber}</p>
                  <p className="text-white/60 text-sm">{new Date(order.createdAt).toLocaleDateString("fr-FR")}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-white">{(() => { const total = order.items.reduce((s, i) => s + i.price * i.quantity, 0); return total.toLocaleString("fr-FR") + " DA"; })()}</p>
                  <p className="text-white/60 text-sm capitalize">{order.status}</p>
                </div>
              </div>

              <div className="mt-4">
                {order.items.map((item, index) => (
                  <div key={index} className="text-white/80 text-sm">
                    {item.name} × {item.quantity}
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <button onClick={() => router.push(`/account/orders/${order._id}`)} className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-sm">
                  Voir les détails
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
