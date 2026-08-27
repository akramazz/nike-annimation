"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export type AdminSection = "dashboard" | "products" | "orders" | "messages" | "users";

interface AdminNavContextValue {
  section: AdminSection;
  setSection: (section: AdminSection) => void;
}

const AdminNavContext = createContext<AdminNavContextValue | undefined>(undefined);

export function AdminNavProvider({ children }: { children: ReactNode }) {
  const [section, setSection] = useState<AdminSection>("dashboard");

  return (
    <AdminNavContext.Provider value={{ section, setSection }}>
      {children}
    </AdminNavContext.Provider>
  );
}

export function useAdminNav() {
  const context = useContext(AdminNavContext);
  if (!context) {
    throw new Error("useAdminNav must be used within AdminNavProvider");
  }
  return context;
}
