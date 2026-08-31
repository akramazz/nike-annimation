"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { apiUrl } from "@/lib/api-client";
import { DEFAULT_SIZES } from "@/lib/product-normalize";
import { getProductImage, DEFAULT_PRODUCT_IMAGE } from "@/lib/image-utils";
import { formatPriceDA } from "@/lib/price-utils";
import { normalizeCategory, PRODUCT_CATEGORIES } from "@/lib/product-categories";
import ProductImage from "@/app/components/products/ProductImage";
import { useAdminNav } from "@/app/context/AdminNavContext";
import {
  Package,
  ShoppingCart,
  MessageSquare,
  DollarSign,
  Plus,
  Edit,
  Trash2,
  Eye,
  Check,
  X,
  Search,
  Users,
} from "lucide-react";

interface Product {
  _id: string;
  id?: number;
  name: string;
  color: string;
  price: number;
  stock: number;
  category: string;
  description: string;
  image?: string;
  sizes?: string[];
  published?: boolean;
  images?: Array<{ url: string; isMain?: boolean }>;
}

interface Order {
  _id: string;
  id?: number;
  orderNumber: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  city?: string;
  items: any[];
  total: number;
  status: string;
  createdAt: string;
}

interface Message {
  _id: string;
  id?: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
}

interface AdminUser {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const { section, setSection } = useAdminNav();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<"product" | "order" | "message">(
    "product",
  );
  const [editingItem, setEditingItem] = useState<any>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [sessionChecked, setSessionChecked] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [authRequired, setAuthRequired] = useState(false);
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginSubmitting, setLoginSubmitting] = useState(false);
  const [availableImages, setAvailableImages] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>(DEFAULT_PRODUCT_IMAGE);
  const [imagePreview, setImagePreview] = useState<string>(DEFAULT_PRODUCT_IMAGE);
  const [productPublished, setProductPublished] = useState(true);
  const [additionalImages, setAdditionalImages] = useState<string[]>([]);
  const [additionalImageInput, setAdditionalImageInput] = useState("");

  const addAdditionalImages = () => {
    const urls = additionalImageInput
      .split(",")
      .map((url) => getProductImage(url.trim()))
      .filter(Boolean);
    setAdditionalImages((prev) => {
      const next = [...prev];
      for (const url of urls) {
        if (!next.includes(url)) next.push(url);
      }
      return next;
    });
    setAdditionalImageInput("");
  };

  const setProductImageChoice = (value: string) => {
    const normalized = getProductImage(value || undefined);
    setSelectedImage(normalized);
    setImagePreview(normalized);
  };

  useEffect(() => {
    if (editingItem && modalType === "product") {
      const imgs = Array.isArray((editingItem as any)?.images)
        ? ((editingItem as any).images as Array<{ url: string }>)
            .map((img) => getProductImage(img.url))
            .filter(Boolean)
        : [];
      setAdditionalImages(imgs);
      setAdditionalImageInput(imgs.join(", "));
    } else {
      setAdditionalImages([]);
      setAdditionalImageInput("");
    }
  }, [editingItem, modalType]);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [productsRes, ordersRes, messagesRes, usersRes] = await Promise.all([
        fetch(apiUrl("/api/products?includeUnpublished=1"), { credentials: "include" }),
        fetch(apiUrl("/api/orders"), { credentials: "include" }),
        fetch(apiUrl("/api/messages"), { credentials: "include" }),
        fetch(apiUrl("/api/admin/users"), { credentials: "include" }),
      ]);

      const productsData = await productsRes.json();
      const ordersData = await ordersRes.json();
      const messagesData = await messagesRes.json();
      const usersData = await usersRes.json();

      if (productsRes.ok && productsData.success) {
        setProducts(productsData.products);
      }
      if (ordersRes.ok && ordersData.success) {
        setOrders(ordersData.orders);
      }
      if (messagesRes.ok && messagesData.success) {
        setMessages(messagesData.messages);
      }
      if (usersRes.ok && usersData.success) {
        setUsers(usersData.users);
      }
    } catch {
      /* ignore */
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(apiUrl("/api/auth/admin/me"), {
          credentials: "include",
        });
        const data = await res.json();
        if (!cancelled && data.success) {
          setAuthRequired(Boolean(data.authRequired));
          setAuthenticated(Boolean(data.authenticated));
          if (!data.authRequired || data.authenticated) {
            await fetchData();
          }
        }
      } catch {
        if (!cancelled) setAuthenticated(false);
      } finally {
        if (!cancelled) setSessionChecked(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [fetchData]);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoginSubmitting(true);
    try {
      const res = await fetch(apiUrl("/api/auth/admin/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ password: loginPassword }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setLoginError(
          typeof data.error === "string" ? data.error : "Connexion refusée.",
        );
        setLoginSubmitting(false);
        return;
      }
      setLoginPassword("");
      setAuthenticated(true);
      await fetchData();
    } catch {
      setLoginError("Erreur réseau.");
    }
    setLoginSubmitting(false);
  };

  const handleAdminLogout = async () => {
    await fetch(apiUrl("/api/auth/admin/logout"), {
      method: "POST",
      credentials: "include",
    });
    setAuthenticated(false);
    setOrders([]);
    setMessages([]);
    setUsers([]);
    router.push("/admin");
  };

  // Stats
  const stats = [
    {
      title: "Total Produits",
      value: products.length,
      icon: Package,
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Commandes",
      value: orders.length,
      icon: ShoppingCart,
      color: "from-green-500 to-green-600",
    },
    {
      title: "Messages",
      value: messages.filter((m) => m.status === "unread").length,
      icon: MessageSquare,
      color: "from-purple-500 to-purple-600",
    },
    {
      title: "Revenus",
      value: `${formatPriceDA(orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0))}`,
      icon: DollarSign,
      color: "from-orange-500 to-orange-600",
    },
  ];

  // Animation
  useEffect(() => {
    if (typeof window !== "undefined") {
      gsap.fromTo(
        ".stat-card",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power3.out" },
      );
    }
  }, [section]);

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) return;
    try {
      const res = await fetch(apiUrl(`/api/products?id=${id}`), {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        setProducts(products.filter((p) => p._id !== id));
      }
      await fetchData();
    } catch {
      await fetchData();
    }
  };

  const handleUpdateOrderStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(apiUrl("/api/orders"), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        await fetchData();
      }
    } catch {
      /* ignore */
    }
  };

  const handleUpdateMessageStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(apiUrl("/api/messages"), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        await fetchData();
      }
    } catch {
      /* ignore */
    }
  };

  const handleDeleteMessage = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce message ?")) return;
    try {
      const res = await fetch(apiUrl(`/api/messages?id=${id}`), {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        setMessages(messages.filter((m) => m._id !== id));
      }
      await fetchData();
    } catch {
      await fetchData();
    }
  };

  if (!sessionChecked) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="loading-spinner" />
      </div>
    );
  }

  if (authRequired && !authenticated) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
        <motion.form
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleAdminLogin}
          className="w-full max-w-md p-8 rounded-3xl bg-white/5 border border-white/10 space-y-6"
        >
          <h1 className="text-2xl font-bold">Admin — connexion</h1>
          <p className="text-white/60 text-sm">
            Entrez la valeur de{" "}
            <code className="text-white/80">ADMIN_API_SECRET</code> définie sur
            le serveur.
          </p>
          <input
            type="password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            placeholder="Secret administrateur"
            required
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/30"
          />
          {loginError && (
            <p className="text-red-400 text-sm" role="alert">
              {loginError}
            </p>
          )}
          <button
            type="submit"
            disabled={loginSubmitting}
            className="w-full py-3 bg-white text-black font-bold rounded-xl hover:bg-white/90 disabled:opacity-50"
          >
            {loginSubmitting ? "Connexion…" : "Se connecter"}
          </button>
          <a
            href="/"
            className="block text-center text-white/60 hover:text-white text-sm"
          >
            Retour au site
          </a>
        </motion.form>
      </div>
    );
  }

  return (
    <div className="pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Dashboard Tab */}
          {section === "dashboard" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl font-bold mb-8">Tableau de bord</h1>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className="stat-card p-6 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}
                      >
                        <stat.icon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <h3 className="text-white/60 text-sm mb-1">{stat.title}</h3>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                ))}
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10">
                  <h3 className="text-xl font-bold mb-4">Commandes récentes</h3>
                  <div className="space-y-4">
                    {orders.slice(0, 5).map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between p-3 bg-white/5 rounded-xl"
                      >
                        <div>
                          <p className="font-medium">{order.orderNumber}</p>
                          <p className="text-white/60 text-sm">
                            {order.customerName}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">
                            {formatPriceDA(Number(order.total || 0))}
                          </p>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              order.status === "pending"
                                ? "bg-yellow-500/20 text-yellow-400"
                                : order.status === "confirmed"
                                  ? "bg-blue-500/20 text-blue-400"
                                  : order.status === "shipped"
                                    ? "bg-purple-500/20 text-purple-400"
                                    : "bg-green-500/20 text-green-400"
                            }`}
                          >
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-6 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10">
                  <h3 className="text-xl font-bold mb-4">Messages récents</h3>
                  <div className="space-y-4">
                    {messages.slice(0, 5).map((msg) => (
                      <div
                        key={msg.id}
                        className="flex items-center justify-between p-3 bg-white/5 rounded-xl"
                      >
                        <div>
                          <p className="font-medium">{msg.subject}</p>
                          <p className="text-white/60 text-sm">{msg.name}</p>
                        </div>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            msg.status === "unread"
                              ? "bg-red-500/20 text-red-400"
                              : "bg-green-500/20 text-green-400"
                          }`}
                        >
                          {msg.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Products Tab */}
            {section === "products" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
                <h1 className="text-3xl font-bold">Gestion des produits</h1>
                <button
                  onClick={() => {
                    setModalType("product");
                    setEditingItem(null);
                    setProductImageChoice(DEFAULT_PRODUCT_IMAGE);
                    setProductPublished(true);
                    setShowModal(true);
                  }}
                  className="flex items-center space-x-2 px-6 py-3 bg-white text-black font-bold rounded-full hover:bg-white/90 transition-colors"
                >
                  <Plus className="h-5 w-5" />
                  <span>Ajouter un produit</span>
                </button>
              </div>

              {/* Search */}
              <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/40" />
                <input
                  type="text"
                  placeholder="Rechercher un produit..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/30"
                />
              </div>

              {/* Products Table */}
              <div className="overflow-x-auto rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left p-4 font-medium text-white/60">
                        Produit
                      </th>
                      <th className="text-left p-4 font-medium text-white/60">
                        Couleur
                      </th>
                      <th className="text-left p-4 font-medium text-white/60">
                        Prix
                      </th>
                      <th className="text-left p-4 font-medium text-white/60">
                        Stock
                      </th>
                      <th className="text-left p-4 font-medium text-white/60">
                        Catégorie
                      </th>
                      <th className="text-left p-4 font-medium text-white/60">
                        Statut
                      </th>
                      <th className="text-left p-4 font-medium text-white/60">
                        Actions
                      </th>
                    </tr>
                  </thead>
                    <tbody>
                    {products
                      .filter((p) =>
                        p.name.toLowerCase().includes(searchTerm.toLowerCase()),
                      )
                      .map((product) => (
                        <tr
                          key={product._id}
                          className="border-b border-white/5 hover:bg-white/5"
                        >
                          <td className="p-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 rounded-xl overflow-hidden bg-white/10">
                                <ProductImage
                                  src={product.image || DEFAULT_PRODUCT_IMAGE}
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <span className="font-medium">
                                {product.name}
                              </span>
                            </div>
                          </td>
                          <td className="p-4 text-white/80">{product.color}</td>
                          <td className="p-4 font-bold">{formatPriceDA(product.price)}</td>
                          <td className="p-4">
                            <span
                              className={`px-3 py-1 rounded-full text-sm ${
                                product.stock > 20
                                  ? "bg-green-500/20 text-green-400"
                                  : product.stock > 10
                                    ? "bg-yellow-500/20 text-yellow-400"
                                    : "bg-red-500/20 text-red-400"
                              }`}
                            >
                              {product.stock} unités
                            </span>
                          </td>
                          <td className="p-4 text-white/80">
                             {normalizeCategory(product.category)}
                           </td>
                          <td className="p-4">
                            <span
                              className={`px-3 py-1 rounded-full text-sm ${
                                product.published !== false
                                  ? "bg-green-500/20 text-green-400"
                                  : "bg-yellow-500/20 text-yellow-400"
                              }`}
                            >
                              {product.published !== false ? "En ligne" : "Brouillon"}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => {
                                  setEditingItem(product);
                                  setModalType("product");
                                  setProductImageChoice(
                                    product.image || DEFAULT_PRODUCT_IMAGE,
                                  );
                                  setProductPublished(product.published !== false);
                                  setShowModal(true);
                                }}
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                              >
                                <Edit className="h-4 w-4 text-blue-400" />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(product._id)}
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                              >
                                <Trash2 className="h-4 w-4 text-red-400" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
           )}

           {/* Orders Tab */}
            {section === "orders" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl font-bold mb-8">Gestion des commandes</h1>

              <div className="overflow-x-auto rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left p-4 font-medium text-white/60">
                        Produits
                      </th>
                      <th className="text-left p-4 font-medium text-white/60">
                        N° Commande
                      </th>
                      <th className="text-left p-4 font-medium text-white/60">
                        Client
                      </th>
                      <th className="text-left p-4 font-medium text-white/60">
                        Email
                      </th>
                      <th className="text-left p-4 font-medium text-white/60">
                        Total
                      </th>
                      <th className="text-left p-4 font-medium text-white/60">
                        Statut
                      </th>
                      <th className="text-left p-4 font-medium text-white/60">
                        Date
                      </th>
                      <th className="text-left p-4 font-medium text-white/60">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr
                        key={order._id}
                        className="border-b border-white/5 hover:bg-white/5"
                      >
                        <td className="p-4">
                          <div className="flex -space-x-2">
                             {order.items?.slice(0, 3).map((item: any, idx: number) => (
                              <ProductImage
                                key={idx}
                                src={item.image || "/products/default.webp"}
                                alt={item.name}
                                className="w-10 h-10 rounded-lg object-cover border-2 border-black"
                              />
                            ))}
                            {order.items?.length > 3 && (
                              <div className="w-10 h-10 rounded-lg bg-white/10 border-2 border-black flex items-center justify-center text-xs">
                                +{order.items.length - 3}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="p-4 font-mono text-sm">
                          {order.orderNumber}
                        </td>
                        <td className="p-4">{order.customerName}</td>
                        <td className="p-4 text-white/60">{order.email}</td>
                        <td className="p-4 font-bold">
                          {formatPriceDA(Number(order.total || 0))}
                        </td>
                        <td className="p-4">
                          <select
                            value={order.status}
                            onChange={(e) =>
                              handleUpdateOrderStatus(order._id, e.target.value)
                            }
                            className="bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-sm focus:outline-none"
                          >
                            <option value="pending">En attente</option>
                            <option value="confirmed">Confirmée</option>
                            <option value="shipped">Expédiée</option>
                            <option value="delivered">Livrée</option>
                            <option value="cancelled">Annulée</option>
                          </select>
                        </td>
                        <td className="p-4 text-white/60">
                          {new Date(order.createdAt).toLocaleDateString(
                            "fr-FR",
                          )}
                        </td>
                        <td className="p-4">
                          <button 
                            onClick={() => { setSelectedOrder(order); setShowModal(true); setModalType("order"); }}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                          >
                            <Eye className="h-4 w-4 text-blue-400" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* Messages Tab */}
            {section === "messages" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl font-bold mb-8">Messages des clients</h1>

              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg._id}
                    className={`p-6 rounded-2xl backdrop-blur-xl border transition-all duration-300 ${
                      msg.status === "unread"
                        ? "bg-white/10 border-white/20"
                        : "bg-white/5 border-white/10"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold">{msg.subject}</h3>
                        <p className="text-white/60">
                          De: {msg.name} ({msg.email})
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${
                            msg.status === "unread"
                              ? "bg-red-500/20 text-red-400"
                              : "bg-green-500/20 text-green-400"
                          }`}
                        >
                          {msg.status === "unread" ? "Non lu" : "Lu"}
                        </span>
                        <button
                          onClick={() =>
                            handleUpdateMessageStatus(
                              msg._id,
                              msg.status === "unread" ? "read" : "unread",
                            )
                          }
                          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                          {msg.status === "unread" ? (
                            <Check className="h-4 w-4 text-green-400" />
                          ) : (
                            <X className="h-4 w-4 text-white/60" />
                          )}
                        </button>
                        <button
                          onClick={() => handleDeleteMessage(msg._id)}
                          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4 text-red-400" />
                        </button>
                      </div>
                    </div>
                    <p className="text-white/80 mb-4">{msg.message}</p>
                    <p className="text-white/40 text-sm">
                      Reçu le{" "}
                      {new Date(msg.createdAt).toLocaleDateString("fr-FR")} à{" "}
                      {new Date(msg.createdAt).toLocaleTimeString("fr-FR")}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Users Tab */}
          {section === "users" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl font-bold mb-8">Utilisateurs</h1>

              <div className="overflow-x-auto rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left p-4 font-medium text-white/60">
                        Utilisateur
                      </th>
                      <th className="text-left p-4 font-medium text-white/60">
                        Email
                      </th>
                      <th className="text-left p-4 font-medium text-white/60">
                        Date d'inscription
                      </th>
                      <th className="text-left p-4 font-medium text-white/60">
                        Identifiant
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr
                        key={user._id}
                        className="border-b border-white/5 hover:bg-white/5"
                      >
                        <td className="p-4">
                          <span className="font-medium">{user.name}</span>
                        </td>
                        <td className="p-4 text-white/80">{user.email}</td>
                        <td className="p-4 text-white/60">
                          {new Date(user.createdAt).toLocaleDateString("fr-FR")}
                        </td>
                        <td className="p-4 font-mono text-sm text-white/60">
                          {user._id}
                        </td>
                      </tr>
                    ))}
                    {users.length === 0 && (
                      <tr>
                        <td colSpan={4} className="p-6 text-center text-white/60">
                          Aucun utilisateur enregistré.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </div>

        {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg p-8 rounded-3xl backdrop-blur-xl bg-white/10 border border-white/20"
            >
              <h2 className="text-2xl font-bold mb-6">
                {modalType === "order" ? "Détails de la commande" : (editingItem ? "Modifier le produit" : "Ajouter un produit")}
              </h2>
              {modalType !== "order" && (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const sizesRaw = String(formData.get("sizes") ?? "");
                  const sizes = sizesRaw
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean);
                  const color = String(formData.get("color") ?? "").trim();
                  const normalizedImage = getProductImage(
                    selectedImage || undefined,
                  );
                   const productData = {
                     name: formData.get("name"),
                     color,
                     price: parseFloat(formData.get("price") as string),
                     stock: parseInt(formData.get("stock") as string, 10),
                     category: formData.get("category"),
                     description: formData.get("description"),
                     image: normalizedImage,
                     published: productPublished,
                     ...(sizes.length > 0 ? { sizes } : {}),
                     images: additionalImages
                       .map((url) => getProductImage(url.trim()))
                       .filter(Boolean)
                       .map((url, idx) => ({ url, isMain: idx === 0 })),
                   };

                  const opts = {
                    headers: { "Content-Type": "application/json" },
                    credentials: "include" as RequestCredentials,
                    body: JSON.stringify(
                      editingItem
                        ? { id: editingItem._id, ...productData }
                        : productData,
                    ),
                  };

                  if (editingItem) {
                    await fetch(apiUrl("/api/products"), {
                      method: "PUT",
                      ...opts,
                    });
                  } else {
                    await fetch(apiUrl("/api/products"), {
                      method: "POST",
                      ...opts,
                    });
                  }

                  await fetchData();
                  setShowModal(false);
                }}
              >
                <div className="space-y-4">
                  <input
                    name="name"
                    placeholder="Nom du produit"
                    defaultValue={editingItem?.name}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/30"
                  />
                  <input
                    name="color"
                    placeholder="Couleur"
                    defaultValue={editingItem?.color}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/30"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      name="price"
                      type="number"
                      step="0.01"
                      placeholder="Prix"
                      defaultValue={editingItem?.price}
                      required
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/30"
                    />
                    <input
                      name="stock"
                      type="number"
                      placeholder="Stock"
                      defaultValue={editingItem?.stock}
                      required
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/30"
                    />
                  </div>
                  <select
                     name="category"
                     defaultValue={normalizeCategory(editingItem?.category)}
                     className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-white/30"
                   >
                     <option value={PRODUCT_CATEGORIES.SWEAT}>{PRODUCT_CATEGORIES.SWEAT}</option>
                     <option value={PRODUCT_CATEGORIES.T_SHIRT}>{PRODUCT_CATEGORIES.T_SHIRT}</option>
                   </select>
                  <textarea
                    name="description"
                    placeholder="Description"
                    defaultValue={editingItem?.description}
                    rows={3}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/30 resize-none"
                  />
                  <input
                    name="image"
                    placeholder="Image (URL ou chemin, ex. /products/algersoliel.webp)"
                    value={selectedImage}
                    onChange={(e) => {
                      const value = e.target.value;
                      setSelectedImage(value);
                      setImagePreview(getProductImage(value || undefined));
                    }}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/30"
                  />
                  <select
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-white/30"
                    value={
                      availableImages.some(
                        (img) => `/products/${img}` === selectedImage,
                      )
                        ? selectedImage
                        : ""
                    }
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value) {
                        setSelectedImage(value);
                        setImagePreview(value);
                      }
                    }}
                  >
                    <option value="">-- Choisir une image --</option>
                    {availableImages.map((img) => (
                      <option key={img} value={`/products/${img}`}>
                        {img}
                      </option>
                    ))}
                  </select>
                  <div className="flex items-center gap-4">
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-white/10 border border-white/20">
                      <img
                        src={imagePreview}
                        alt="Aperçu image"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-white/70 text-sm">
                      {availableImages.length} image(s) disponible(s)
                    </span>
                   </div>
                   <div className="space-y-2">
                     <p className="text-white/70 text-xs font-medium">Images supplémentaires (chemins séparés par des virgules)</p>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="/products/xxx.webp, /products/yyy.webp"
                          value={additionalImageInput}
                          onChange={(e) => setAdditionalImageInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              addAdditionalImages();
                            }
                          }}
                          className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/30"
                        />
                        <button
                          type="button"
                          onClick={addAdditionalImages}
                          className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-white text-sm font-medium transition-colors"
                        >
                          Ajouter
                        </button>
                      </div>
                     <div className="flex flex-wrap gap-2">
                       {additionalImages.map((img, idx) => (
                         <div key={idx} className="relative">
                           <img src={getProductImage(img)} alt="" className="w-16 h-16 object-cover rounded-lg border border-white/20" />
                           <button
                             type="button"
                             onClick={() => setAdditionalImages((prev) => prev.filter((_, i) => i !== idx))}
                             className="absolute -top-1 -right-1 p-1 bg-red-500 rounded-full text-white text-[10px]"
                           >
                             ✕
                           </button>
                         </div>
                       ))}
                     </div>
                   </div>
                   <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={productPublished}
                      onChange={(e) => setProductPublished(e.target.checked)}
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-white/80 text-sm">
                      Visible sur le site (publié)
                    </span>
                  </label>
                  <input
                    name="sizes"
                    placeholder={`Tailles séparées par des virgules (défaut: ${DEFAULT_SIZES.join(",")})`}
                    defaultValue={
                      editingItem?.sizes?.length
                        ? editingItem.sizes.join(",")
                        : DEFAULT_SIZES.join(",")
                    }
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/30"
                  />
                </div>
                <div className="flex space-x-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-medium transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-white/90 transition-colors"
                  >
                    {editingItem ? "Modifier" : "Ajouter"}
                  </button>
                </div>
              </form>
              )}
               
              {/* Order Details Modal */}
              {modalType === "order" && selectedOrder && (
                <div className="mt-6 pt-6 border-t border-white/20">
                  <h3 className="text-lg font-bold mb-4">Détails de la commande</h3>

                  <div className="space-y-3 mb-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-white/60">Client</span>
                        <p className="font-medium">{selectedOrder.customerName || "Non renseigné"}</p>
                      </div>
                      <div>
                        <span className="text-white/60">Email</span>
                        <p className="font-medium">{selectedOrder.email || "Non renseigné"}</p>
                      </div>
                      <div>
                        <span className="text-white/60">Téléphone</span>
                        <p className="font-medium">{selectedOrder.phone || "Non renseigné"}</p>
                      </div>
                      <div>
                        <span className="text-white/60">Wilaya / Ville</span>
                        <p className="font-medium">{selectedOrder.city || "Non renseigné"}</p>
                      </div>
                      <div className="sm:col-span-2">
                        <span className="text-white/60">Adresse</span>
                        <p className="font-medium">{selectedOrder.address || "Non renseigné"}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 max-h-60 overflow-y-auto">
                    {selectedOrder.items?.map((item: any, idx: number) => (
                      <div key={idx} className="flex items-center gap-4 p-3 bg-white/5 rounded-xl">
                        <ProductImage src={item.image || "/products/default.webp"} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
                        <div className="flex-1">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-white/60 text-sm">
                            {item.category ? `Catégorie: ${item.category}` : ""}
                            {item.color ? ` · Couleur: ${item.color}` : ""}
                            {" · "}
                            Taille: {item.size || "Non renseigné"} · Qté: {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{formatPriceDA(item.price * item.quantity)}</p>
                          <p className="text-white/60 text-xs">{formatPriceDA(item.price)} / unité</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex space-x-4 mt-6">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-medium transition-colors"
                    >
                      Fermer
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
