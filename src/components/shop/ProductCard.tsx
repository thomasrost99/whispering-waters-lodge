import type { ShopifyProduct } from "../../types/shopify";
import { useShopify } from "../../context/ShopifyContext";

interface ProductCardProps {
  product: ShopifyProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useShopify();
  const price = product.variants[0]?.price;
  const image = product.images[0];
  const available = product.variants.some((v) => v.available);

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-earth-100">
      {/* Image */}
      <div className="aspect-square overflow-hidden bg-earth-50">
        {image ? (
          <img
            src={image.src}
            alt={image.altText || product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-earth-300">
            <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-heading text-lg font-semibold text-lodge-dark mb-1 group-hover:text-forest-700 transition-colors">
          {product.title}
        </h3>
        <p className="text-sm text-lodge-charcoal/60 line-clamp-2 mb-3">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          {price && (
            <span className="text-lg font-semibold text-forest-700">
              ${parseFloat(price.amount).toFixed(2)}
            </span>
          )}
          <button
            onClick={() => addToCart(product)}
            disabled={!available}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              available
                ? "bg-forest-600 text-white hover:bg-forest-700 active:scale-95"
                : "bg-earth-100 text-earth-400 cursor-not-allowed"
            }`}
          >
            {available ? "Add to Cart" : "Sold Out"}
          </button>
        </div>
      </div>
    </div>
  );
}
