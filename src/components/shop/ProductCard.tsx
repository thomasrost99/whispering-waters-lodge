import { useState, useMemo } from "react";
import type { ShopifyProduct, ShopifyVariant } from "../../types/shopify";
import { useShopify } from "../../context/ShopifyContext";

interface ProductCardProps {
  product: ShopifyProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useShopify();
  const [descExpanded, setDescExpanded] = useState(false);

  // Build option groups from all variants: { "Size": ["S","M","L"], "Color": ["Black","White"] }
  const optionGroups = useMemo(() => {
    const groups: Record<string, string[]> = {};
    product.variants.forEach((v) => {
      v.selectedOptions?.forEach(({ name, value }) => {
        if (!groups[name]) groups[name] = [];
        if (!groups[name].includes(value)) groups[name].push(value);
      });
    });
    return groups;
  }, [product.variants]);

  const optionNames = Object.keys(optionGroups);
  const [selected, setSelected] = useState<Record<string, string>>(() =>
    Object.fromEntries(optionNames.map((n) => [n, optionGroups[n][0]]))
  );

  const selectedVariant: ShopifyVariant | undefined = useMemo(() => {
    return product.variants.find((v) =>
      v.selectedOptions?.every((o) => selected[o.name] === o.value)
    );
  }, [product.variants, selected]);

  const image = selectedVariant?.image ?? product.images[0];
  const price = selectedVariant?.price ?? product.variants[0]?.price;
  const available = selectedVariant?.available ?? false;

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-earth-100 flex flex-col">
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
      <div className="p-5 flex flex-col gap-3 flex-1">
        <div>
          <h3 className="font-heading text-lg font-semibold text-lodge-dark group-hover:text-forest-700 transition-colors">
            {product.title}
          </h3>
          <div
            className="text-sm text-lodge-charcoal/60 mt-1 overflow-hidden transition-[max-height] duration-300 ease-in-out"
            style={{ maxHeight: descExpanded ? "500px" : "4.5em" }}
          >
            {product.description}
          </div>
          {product.description?.length > 120 && (
            <button
              onClick={() => setDescExpanded((e) => !e)}
              className="text-xs text-forest-600 hover:text-forest-800 mt-1 font-medium"
            >
              {descExpanded ? "Show less" : "Show more"}
            </button>
          )}
        </div>

        {/* Option selectors — hide groups with only one value */}
        {optionNames.filter((name) => optionGroups[name].length > 1).map((name) => (
          <div key={name}>
            <p className="text-xs font-medium text-lodge-charcoal/50 uppercase tracking-wider mb-1.5">
              {name}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {optionGroups[name].map((value) => {
                const isActive = selected[name] === value;
                // Check if this option combo would lead to an available variant
                const wouldBeAvailable = product.variants.some(
                  (v) =>
                    v.available &&
                    v.selectedOptions?.find((o) => o.name === name)?.value === value
                );
                return (
                  <button
                    key={value}
                    onClick={() => setSelected((s) => ({ ...s, [name]: value }))}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                      isActive
                        ? "bg-forest-700 text-white border-forest-700"
                        : wouldBeAvailable
                        ? "bg-white text-lodge-charcoal border-earth-200 hover:border-forest-400"
                        : "bg-earth-50 text-earth-300 border-earth-100 cursor-not-allowed line-through"
                    }`}
                  >
                    {value}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {/* Price + Add to cart */}
        <div className="flex items-center justify-between pt-1 mt-auto">
          {price && (
            <span className="text-lg font-semibold text-forest-700">
              ${parseFloat(price.amount).toFixed(2)}
            </span>
          )}
          <button
            onClick={() => selectedVariant && addToCart(product, product.variants.indexOf(selectedVariant))}
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
