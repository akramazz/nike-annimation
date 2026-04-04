/**
 * Layout Admin - Structure commune à toutes les pages du dashboard admin
 * 
 * Ce layout fournit une structure de base pour le dashboard admin :
 * - Container principal avec fond noir
 * - Zone principale <main> pour le contenu des pages enfants
 * 
 * Fonctionnement :
 * - Toutes les pages sous /admin/ utilisent ce layout
 * - Le paramètre 'children' est le contenu de la page spécifique
 * 
 * Note importante : La page admin (page.tsx) contient déjà tous les éléments
 * de navigation (header, tabs, etc.). Ce layout fournit uniquement le conteneur
 * de base pour suivre les bonnes pratiques Next.js App Router.
 */

import { ReactNode } from "react";

interface AdminLayoutProps {
  /** Contenu de la page enfant */
  children: ReactNode;
}

/**
 * Layout principal du dashboard admin
 * 
 * Structure simple :
 * <div className="admin-layout">
 *   <main>{children}</main>
 * </div>
 * 
 * La page (/admin/page.tsx) gère elle-même son header, sa navigation
 * et son contenu complet.
 */
export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-black text-white">
      <main>
        {children}
      </main>
    </div>
  );
}