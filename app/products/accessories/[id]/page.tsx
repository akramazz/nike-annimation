"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function AccessoryDetailPage() {
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    const productId = String(params.id);
    router.replace(`/products/${productId}`);
  }, [params.id, router]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="loading-spinner" />
    </div>
  );
}
