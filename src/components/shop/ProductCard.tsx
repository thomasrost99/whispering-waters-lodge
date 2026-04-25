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
      <div
        className="aspect-square overflow-hidden bg-earth-50 relative select-none"
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

            {/* Arrows — hidden on mobile (swipe instead), reveal on hover on desktop */}
            {carouselImages.length > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/80 backdrop-blur-sm items-center justify-center shadow transition-all hidden sm:flex sm:opacity-0 sm:group-hover:opacity-100 hover:bg-white"
                  aria-label="Previous image"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/80 backdrop-blur-sm items-center justify-center shadow transition-all hidden sm:flex sm:opacity-0 sm:group-hover:opacity-100 hover:bg-white"
                  aria-label="Next image"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {/* Dot indicators — always visible, tappable on mobile */}
                <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {carouselImages.map((img, i) => (
                    <button
                      key={img.id}
                      onClick={() => setCarouselIndex(i)}
                      aria-label={`Go to image ${i + 1}`}
                      className={`h-1.5 rounded-full transition-all duration-300 shadow-sm ${
                        i === carouselIndex ? "bg-white w-4" : "bg-white/60 w-1.5"
                      }`}
                    />
                  ))}
                </div>
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
