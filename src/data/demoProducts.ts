import type { ShopifyProduct } from "../types/shopify";

/** Sample products shown when Shopify is not connected. */
export const demoProducts: ShopifyProduct[] = [
  {
    id: "demo-1",
    title: "Lodge Pine Candle",
    description:
      "Hand-poured soy candle with notes of pine, cedar, and mountain air. Burns for 60+ hours.",
    descriptionHtml: "",
    handle: "lodge-pine-candle",
    productType: "Home",
    vendor: "Whispering Waters Lodge",
    images: [{ id: "img-1", src: "", altText: "Lodge Pine Candle" }],
    variants: [
      { id: "var-1", title: "Default Title", price: { amount: "34.00", currencyCode: "USD" }, available: true },
    ],
  },
  {
    id: "demo-2",
    title: "Mountain Creek Mug",
    description: "Handcrafted ceramic mug glazed in our signature forest green. 12oz capacity.",
    descriptionHtml: "",
    handle: "mountain-creek-mug",
    productType: "Drinkware",
    vendor: "Whispering Waters Lodge",
    images: [{ id: "img-2", src: "", altText: "Mountain Creek Mug" }],
    variants: [
      { id: "var-2", title: "Default Title", price: { amount: "28.00", currencyCode: "USD" }, available: true },
    ],
  },
  {
    id: "demo-3",
    title: "Wilderness Wool Blanket",
    description: "Locally-sourced wool blanket in earth tones. Perfect for fireside evenings.",
    descriptionHtml: "",
    handle: "wilderness-wool-blanket",
    productType: "Home",
    vendor: "Whispering Waters Lodge",
    images: [{ id: "img-3", src: "", altText: "Wilderness Wool Blanket" }],
    variants: [
      { id: "var-3", title: "Default Title", price: { amount: "120.00", currencyCode: "USD" }, available: true },
    ],
  },
  {
    id: "demo-4",
    title: "Trail Map Poster",
    description: "Illustrated map of our lodge trails and surrounding wilderness. 18x24 art print.",
    descriptionHtml: "",
    handle: "trail-map-poster",
    productType: "Art",
    vendor: "Whispering Waters Lodge",
    images: [{ id: "img-4", src: "", altText: "Trail Map Poster" }],
    variants: [
      { id: "var-4", title: "Default Title", price: { amount: "45.00", currencyCode: "USD" }, available: true },
    ],
  },
  {
    id: "demo-5",
    title: "River Stone Soap Set",
    description:
      "Set of three artisanal soaps shaped like river stones. Lavender, pine, and honey scents.",
    descriptionHtml: "",
    handle: "river-stone-soap-set",
    productType: "Body",
    vendor: "Whispering Waters Lodge",
    images: [{ id: "img-5", src: "", altText: "River Stone Soap Set" }],
    variants: [
      { id: "var-5", title: "Default Title", price: { amount: "24.00", currencyCode: "USD" }, available: true },
    ],
  },
  {
    id: "demo-6",
    title: "Lodge Embroidered Cap",
    description: "Structured cotton cap with our embroidered lodge crest. Adjustable strap.",
    descriptionHtml: "",
    handle: "lodge-embroidered-cap",
    productType: "Apparel",
    vendor: "Whispering Waters Lodge",
    images: [{ id: "img-6", src: "", altText: "Lodge Embroidered Cap" }],
    variants: [
      { id: "var-6", title: "Default Title", price: { amount: "32.00", currencyCode: "USD" }, available: true },
    ],
  },
];
