"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AdminNavProvider, useAdminNav } from "@/app/context/AdminNavContext";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  MessageSquare,
  Users,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const navItems = [
  { id: "dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { id: "products", label: "Produits", icon: Package },
  { id: "orders", label: "Commandes", icon: ShoppingCart },
  { id: "messages", label: "Messages", icon: MessageSquare },
  { id: "users", label: "Utilisateurs", icon: Users },
];

function AdminSidebar({ sidebarOpen, setSidebarOpen }: { sidebarOpen: boolean; setSidebarOpen: (open: boolean) => void }) {
  const { section, setSection } = useAdminNav();

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={[
          "fixed top-0 left-0 z-50 h-screen w-64 border-r border-white/10 bg-black transition-transform duration-300",
          "lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
            <Link href="/admin" className="flex items-center gap-3">
              <div className="relative h-10 w-10 overflow-hidden rounded-full border border-white/20 bg-white/10">
                <Image src="/logo.png" alt="DripBazzarDZ" fill className="object-cover" />
              </div>
              <div className="flex flex-col">
                <span className="text-white font-bold text-sm leading-tight">DripBazzarDZ</span>
                <span className="text-white/50 text-xs">Administration</span>
              </div>
            </Link>
            <button
              type="button"
              className="lg:hidden p-2 text-white/70 hover:text-white"
              onClick={() => setSidebarOpen(false)}
              aria-label="Fermer le menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setSection(item.id as typeof section);
                  setSidebarOpen(false);
                }}
                className={[
                  "flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                  section === item.id
                    ? "bg-white text-black"
                    : "text-white/70 hover:bg-white/10 hover:text-white",
                ].join(" ")}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="border-t border-white/10 px-4 py-4">
            <Link
              href="/api/auth/admin/logout"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Déconnexion</span>
            </Link>
            <Link
              href="/"
              className="mt-1 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-colors"
            >
              <span>Retour au site</span>
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AdminNavProvider>
      <div className="min-h-screen bg-black text-white">
        <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="lg:ml-64">
          <header className="sticky top-0 z-30 border-b border-white/10 bg-black/80 backdrop-blur-xl lg:hidden">
            <div className="flex items-center justify-between px-4 py-3">
              <button
                type="button"
                className="p-2 text-white/80 hover:text-white"
                onClick={() => setSidebarOpen(true)}
                aria-label="Ouvrir le menu"
              >
                <Menu className="h-6 w-6" />
              </button>
              <span className="text-white font-bold text-sm">Administration</span>
              <div className="w-8" />
            </div>
          </header>
          <main className="p-4 md:p-8">{children}</main>
        </div>
      </div>
    </AdminNavProvider>
  );
}
