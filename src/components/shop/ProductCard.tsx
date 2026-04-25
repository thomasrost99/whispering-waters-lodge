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

  const variantImageIds = useMemo(
    () => new Set(product.variants.map((v) => v.image?.id).filter(Boolean)),
    [product.variants]
  );

  // Extract the Printful slug: everything before -front- or -back- in the filename
  const getVariantSlug = (src: string) => {
    const filename = src.split("/").pop()?.split("?")[0] ?? "";
    const match = filename.match(/^(.+?)-(front|back)-/i);
    return match ? match[1].toLowerCase() : "";
  };

  // Build carousel as [front, back] regardless of which side Shopify assigned as the variant image
  const carouselImages = useMemo(() => {
    if (!image) return [];
    const extraImgs = product.images.filter((img) => !variantImageIds.has(img.id));
    const slug = getVariantSlug(image.src);
    const isVariantBack = image.src.toLowerCase().includes("-back-");

    if (!slug) return [image]; // no front/back pattern (mug, etc.) — single image

    if (isVariantBack) {
      // Variant image is the back; look for matching front anywhere in product images
      const front = product.images.find(
        (img) => getVariantSlug(img.src) === slug && img.src.toLowerCase().includes("-front-")
      );
      return front ? [front, image] : [image];
    } else {
      // Variant image is the front; look for matching back in extra images
      const back = extraImgs.find(
        (img) => img.src.toLowerCase().includes("-back-") && getVariantSlug(img.src) === slug
      );
      return back ? [image, back] : [image];
    }
  }, [image, product.images, variantImageIds]);

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
      {/* Carousel — image stays fully contained, no extra strip */}
      <div
        className="aspect-square bg-earth-50 relative overflow-hidden select-none"
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

            {carouselImages.length > 1 && (
              <>
                {/* Left / right invisible click zones — full height, half width each */}
                <button
                  onClick={prevSlide}
                  aria-label="Previous image"
                  className={`absolute left-0 top-0 w-1/2 h-full cursor-pointer transition-opacity duration-150 ${carouselIndex === 0 ? "pointer-events-none" : ""}`}
                />
                <button
                  onClick={nextSlide}
                  aria-label="Next image"
                  className={`absolute right-0 top-0 w-1/2 h-full cursor-pointer transition-opacity duration-150 ${carouselIndex === carouselImages.length - 1 ? "pointer-events-none" : ""}`}
                />

                {/* Frosted pill with dash indicators — bottom-center, always visible */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-black/40 backdrop-blur-sm pointer-events-none">
                  {carouselImages.map((img, i) => (
                    <span
                      key={img.id}
                      className={`block rounded-full transition-all duration-300 ${
                        i === carouselIndex ? "w-4 h-2 bg-white" : "w-2 h-2 bg-white/50"
                      }`}
                    />
                  ))}
                </div>

                {/* "Tap to see back" hint on first slide only */}
                {carouselIndex === 0 && (
                  <div className="absolute top-2.5 right-2.5 text-[10px] font-medium text-white bg-black/40 backdrop-blur-sm px-2 py-1 rounded-full pointer-events-none">
                    Back →
                  </div>
                )}
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
