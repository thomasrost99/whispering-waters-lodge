import { Store, ShoppingBag } from "lucide-react";
import { useShopify } from "../context/ShopifyContext";
import { demoProducts } from "../data/demoProducts";
import PageHero from "../components/ui/PageHero";
import ProductCard from "../components/shop/ProductCard";

export default function Shop() {
  const { products, loading, configured } = useShopify();
  const displayProducts = configured && products.length > 0 ? products : demoProducts;

  return (
    <div>
      <PageHero
        gradient="earth"
        icon={<Store className="w-8 h-8 text-gold-light" />}
        title="The Lodge Shop"
        subtitle="Handcrafted goods, local treasures, and a piece of the mountain life — delivered to your door."
      />

      {!configured && <DemoNotice />}

      <section className="py-12 sm:py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {loading ? <ProductGridSkeleton /> : <ProductGrid products={displayProducts} />}
        </div>
      </section>
    </div>
  );
}

/* ─── Demo-Mode Banner ─── */

function DemoNotice() {
  return (
    <div className="max-w-7xl mx-auto px-4 pt-8">
      <div className="bg-water-50 border border-water-200 rounded-xl p-4 flex items-start gap-3">
        <ShoppingBag className="w-5 h-5 text-water-600 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm font-medium text-water-800">Demo Mode — Shopify not connected</p>
          <p className="text-sm text-water-600 mt-1">
            These are sample products. Connect your Shopify store by adding your credentials to the{" "}
            <code className="bg-water-100 px-1.5 py-0.5 rounded text-xs">.env</code> file to load real inventory.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─── Product Grid ─── */

function ProductGrid({ products }: { products: typeof demoProducts }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

/* ─── Loading Skeleton ─── */

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl overflow-hidden border border-earth-100 animate-pulse">
          <div className="aspect-square bg-earth-100" />
          <div className="p-5 space-y-3">
            <div className="h-5 bg-earth-100 rounded w-3/4" />
            <div className="h-4 bg-earth-50 rounded w-full" />
            <div className="h-4 bg-earth-50 rounded w-2/3" />
            <div className="flex justify-between pt-2">
              <div className="h-6 bg-earth-100 rounded w-16" />
              <div className="h-9 bg-earth-100 rounded w-24" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}