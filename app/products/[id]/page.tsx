import { notFound } from "next/navigation";
import ProductGallery from "@/app/components/products/ProductGallery";
import ProductInfo from "@/app/components/products/ProductInfo";
import { QuickOrderForm } from "@/app/components/products/QuickOrderForm";
import { getProduct } from "@/app/lib/get-product";

// ─── Metadata ───────────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: { id: string };
}) {
  try {
    const product = await getProduct(params.id);
    if (!product) return { title: "Produit introuvable — DripBazzarDZ" };

    const price = product.onSale && product.salePrice
      ? product.salePrice
      : product.price;

    return {
      title: `${product.name} — ${price.toFixed(2)} € — DripBazzarDZ`,
      description: product.description,
      keywords: [
        product.name,
        product.category,
        ...product.sizes,
        "DripBazzarDZ",
      ].join(", "),
      openGraph: {
        title: `${product.name} — €${price.toFixed(2)}`,
        description: product.description,
        images: [{ url: product.image }],
        type: "product",
      },
      alternates: {
        canonical: `/products/${product._id}`,
      },
    };
  } catch {
    return { title: "Produit — DripBazzarDZ" };
  }
}

// ─── Page ───────────────────────────────────────────────────────────────────
export default async function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  let product: ReturnType<typeof getProduct>;

  try {
    product = await getProduct(params.id);
  } catch {
    return notFound();
  }

  if (!product) return notFound();

  const currentPrice = product.onSale && product.salePrice
    ? product.salePrice
    : product.price;

  // Default selected size
  const defaultSize = product.sizes[0] || null;

  return (
    <div className="min-h-screen bg-black">
      {/* ─── Mobile Shared Header (ProductInfo renders its own on SSR) ─── */}
      <div className="sr-only">
        <h1>{product.name}</h1>
      </div>

      {/* ─── Desktop Shared Header (Nav already global) ─────────────────── */}
      <div className="md:hidden sticky top-0 z-50 backdrop-blur-xl bg-black/30 border-b border-white/10" />

      {/* ─── Main Layout ──────────────────────────────────────────────── */}
      <section
        className="pt-4 sm:pt-6 lg:pt-8 pb-16 px-3 sm:px-6 lg:px-8"
        aria-label={`Fiche produit : ${product.name}`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16">
            {/* Gallery */}
            <div className="lg:sticky lg:top-24 lg:self-start">
              <ProductGallery product={product} />
            </div>

            {/* Info + Actions */}
            <div>
              <ProductInfo product={product} initialSize={defaultSize} />

              {/* ─── Order Form ─── */}
              <div className="mt-6 sm:mt-8">
                <QuickOrderForm
                  productId={product._id}
                  productName={product.name}
                  productPrice={currentPrice}
                  totalAmount={currentPrice}
                  productColor={product.color}
                  selectedSize={defaultSize || product.sizes[0] || "Unique"}
                  quantity={1}
                  productImage={product.image}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
