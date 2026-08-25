import { Suspense } from "react";
import ProductsClient from "./ProductsClient";

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-black pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="h-12 bg-white/10 rounded-lg w-64 mx-auto mb-4 animate-pulse" />
          <div className="h-6 bg-white/10 rounded-lg w-96 mx-auto animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-square rounded-2xl bg-white/5 animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ProductsClient />
    </Suspense>
  );
}
