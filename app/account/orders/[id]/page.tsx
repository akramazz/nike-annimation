"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { apiUrl } from "@/lib/api-client";
import { useAuth } from "@/app/context/AuthContext";

type OrderItem = {
  name: string;
  quantity: number;
  price: number;
  color?: string;
  size?: string;
  image?: string;
};

type Order = {
  _id: string;
  orderNumber: string;
  createdAt: string;
  updatedAt: string;
  status: string;
  total: number;
  customerName: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  items: OrderItem[];
};

export default function AccountOrderDetailPage() {
  const params = useParams();
  const { user } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const id = Array.isArray(params.id) ? params.id[0] : params.id;
        const res = await fetch(apiUrl(`/api/account/orders/${id}`), { credentials: "include" });
        const data = await res.json();
        if (!cancelled && data.success) {
          setOrder(data.order);
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
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="loading-spinner" />
      </div>
    );
  }

  if (!user || !order) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-white mb-4">Commande introuvable.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold">Commande #{order.orderNumber}</h1>
              <p className="text-white/60 text-sm">{new Date(order.createdAt).toLocaleDateString("fr-FR")}</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-white">{order.total.toLocaleString("fr-FR")} DA</p>
              <p className="text-white/60 text-sm capitalize">{order.status}</p>
            </div>
          </div>

          <section className="mb-8">
            <h2 className="text-lg font-semibold mb-3">Produits</h2>
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl p-4">
                  <div>
                    <p className="text-white font-medium">{item.name}</p>
                    <p className="text-white/60 text-sm">Qté : {item.quantity}</p>
                  </div>
                  <p className="text-white font-medium">{(item.price * item.quantity).toLocaleString("fr-FR")} DA</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-semibold mb-3">Adresse de livraison</h2>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-white/80">
              <p>{order.customerName}</p>
              {order.address && <p>{order.address}</p>}
              <p>{[order.city, order.postalCode, order.country].filter(Boolean).join(", ")}</p>
              {order.phone && <p>{order.phone}</p>}
            </div>
          </section>
        </motion.div>
      </div>
    </div>
  );
}
