export interface ShopifyProduct {
  id: string;
  title: string;
  description: string;
  descriptionHtml: string;
  handle: string;
  images: ShopifyImage[];
  variants: ShopifyVariant[];
  productType: string;
  vendor: string;
}

export interface ShopifyImage {
  id: string;
  src: string;
  altText: string | null;
}

export interface ShopifyVariant {
  id: string;
  title: string;
  price: { amount: string; currencyCode: string };
  available: boolean;
  image?: ShopifyImage;
}

export interface CartItem {
  id: string;
  title: string;
  variant: ShopifyVariant;
  quantity: number;
  image?: ShopifyImage;
}

export interface CartState {
  id: string | null;
  items: CartItem[];
  subtotal: string;
  checkoutUrl: string;
}
