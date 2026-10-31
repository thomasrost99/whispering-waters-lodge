import { createContext, useContext } from "react";
import type { ShopifyProduct, CartItem } from "../types/shopify";

export interface ShopifyState {
  products: ShopifyProduct[];
  cart: CartItem[];
  cartOpen: boolean;
  checkoutUrl: string;
  loading: boolean;
  configured: boolean;
}

export interface ShopifyContextValue extends ShopifyState {
  fetchProducts: () => Promise<void>;
  addToCart: (product: ShopifyProduct, variantIndex?: number, quantity?: number) => void;
  removeFromCart: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: (open?: boolean) => void;
  checkout: () => Promise<void>;
  cartCount: number;
  cartTotal: string;
}

export const ShopifyContext = createContext<ShopifyContextValue | null>(null);

export function useShopify(): ShopifyContextValue {
  const ctx = useContext(ShopifyContext);
  if (!ctx) throw new Error("useShopify must be used within ShopifyProvider");
  return ctx;
}
