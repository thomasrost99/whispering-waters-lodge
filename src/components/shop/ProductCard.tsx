import { useState, useMemo, useRef } from "react";
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

  // Find back image by matching the variant slug in the Printful filename pattern:
  // {product}-{variant-slug}-front-{hash}.jpg  ↔  {product}-{variant-slug}-back-{hash}.jpg
  const variantImageIds = new Set(product.variants.map((v) => v.image?.id).filter(Boolean));
  const extraImages = product.images.filter((img) => !variantImageIds.has(img.id));
  const getVariantSlug = (src: string) => {
    const filename = src.split("/").pop()?.split("?")[0] ?? "";
    const match = filename.match(/^(.+?)-(front|back)-/i);
    return match ? match[1].toLowerCase() : "";
  };
  const variantSlug = image ? getVariantSlug(image.src) : "";
  const backImage = extraImages.find((img) => {
    const src = img.src.toLowerCase();
    return src.includes("back") && (variantSlug ? getVariantSlug(img.src) === variantSlug : true);
  });

  // Carousel: front image + matched back image (if any)
  const carouselImages = useMemo(() => {
    const imgs = image ? [image] : [];
    if (backImage) imgs.push(backImage);
    return imgs;
  }, [image, backImage]);

  // Carousel index resets automatically when the variant image changes by pairing index with imageId
  const [carousel, setCarousel] = useState<{ imageId: string | undefined; index: number }>(
    () => ({ imageId: image?.id, index: 0 })
  );
  const carouselIndex = carousel.imageId === image?.id ? carousel.index : 0;
  const setCarouselIndex = (idx: number | ((prev: number) => number)) =>
    setCarousel({ imageId: image?.id, index: typeof idx === "function" ? idx(carouselIndex) : idx });

  const touchStartX = useRef<number | null>(null);
  const prevSlide = () => setCarouselIndex((i) => (i - 1 + carouselImages.length) % carouselImages.length);
  const nextSlide = () => setCarouselIndex((i) => (i + 1) % carouselImages.length);

  const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 40) { if (delta > 0) nextSlide(); else prevSlide(); }
    touchStartX.current = null;
  };

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-earth-100 flex flex-col">
      {/* Carousel */}
      <div className="select-none">
        {/* Main image */}
        <div
          className="aspect-square overflow-hidden bg-earth-50 relative"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {carouselImages.length > 0 ? (
            <>
              {/* Sliding strip */}
              <div
                className="flex h-full transition-transform duration-300 ease-in-out"
                style={{
                  width: `${carouselImages.length * 100}%`,
                  transform: `translateX(-${carouselIndex * (100 / carouselImages.length)}%)`,
                }}
              >
                {carouselImages.map((img) => (
                  <div key={img.id} className="h-full flex-shrink-0" style={{ width: `${100 / carouselImages.length}%` }}>
                    <img src={img.src} alt={img.altText || product.title} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>

              {/* Arrows — full-height click zones with gradient backing */}
              {carouselImages.length > 1 && (
                <>
                  <button
                    onClick={prevSlide}
                    aria-label="Previous image"
                    className={`absolute left-0 top-0 h-full w-14 flex items-center justify-start pl-2 transition-opacity duration-200 ${carouselIndex === 0 ? "opacity-0 pointer-events-none" : "opacity-100"}`}
                    style={{ background: "linear-gradient(to right, rgba(0,0,0,0.22), transparent)" }}
                  >
                    <span className="w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center">
                      <svg className="w-4 h-4 text-lodge-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                      </svg>
                    </span>
                  </button>
                  <button
                    onClick={nextSlide}
                    aria-label="Next image"
                    className={`absolute right-0 top-0 h-full w-14 flex items-center justify-end pr-2 transition-opacity duration-200 ${carouselIndex === carouselImages.length - 1 ? "opacity-0 pointer-events-none" : "opacity-100"}`}
                    style={{ background: "linear-gradient(to left, rgba(0,0,0,0.22), transparent)" }}
                  >
                    <span className="w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center">
                      <svg className="w-4 h-4 text-lodge-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </button>
                </>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-earth-300">
              <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>

        {/* Thumbnail strip — always visible, shows you exactly what images exist */}
        {carouselImages.length > 1 && (
          <div className="flex gap-2 px-3 py-2.5 bg-earth-50 border-t border-earth-100">
            {carouselImages.map((img, i) => (
              <button
                key={img.id}
                onClick={() => setCarouselIndex(i)}
                aria-label={`View image ${i + 1}`}
                className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all duration-200 flex-shrink-0 ${
                  i === carouselIndex
                    ? "border-forest-600 opacity-100 shadow-sm"
                    : "border-transparent opacity-50 hover:opacity-80"
                }`}
              >
                <img src={img.src} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
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
