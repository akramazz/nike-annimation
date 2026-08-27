"use client";

import { usePathname } from "next/navigation";
import Header from "./layout/Header";
import Footer from "./Footer";

export default function PublicFrame({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <>
      {!isAdmin && <Header />}

      <main
        id="main-content"
        className={isAdmin ? "" : "pt-16 md:pt-20"}
      >
        {children}
      </main>

      {!isAdmin && <Footer />}
    </>
  );
}
