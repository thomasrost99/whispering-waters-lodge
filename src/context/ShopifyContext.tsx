import {
  useReducer,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { getShopifyClient, isShopifyConfigured } from "../lib/shopify";
import type { ShopifyProduct, CartItem } from "../types/shopify";
import { ShopifyContext, type ShopifyState } from "./useShopify";

/* ─── State ─── */

const initialState: ShopifyState = {
  products: [],
  cart: [],
  cartOpen: false,
  checkoutUrl: "",
  loading: false,
  configured: isShopifyConfigured(),
};

function loadCart(state: ShopifyState): ShopifyState {
  try {
    const items: CartItem[] = JSON.parse(localStorage.getItem("wwl-cart") ?? "[]");
    return { ...state, cart: items };
  } catch {
    return state; // ignore corrupt data
  }
}

/* ─── Actions ─── */

type Action =
  | { type: "SET_PRODUCTS"; products: ShopifyProduct[] }
  | { type: "SET_LOADING"; loading: boolean }
  | { type: "ADD_TO_CART"; item: CartItem }
  | { type: "REMOVE_FROM_CART"; variantId: string }
  | { type: "UPDATE_QUANTITY"; variantId: string; quantity: number }
  | { type: "CLEAR_CART" }
  | { type: "TOGGLE_CART"; open?: boolean }
  | { type: "SET_CHECKOUT_URL"; url: string };

function reducer(state: ShopifyState, action: Action): ShopifyState {
  switch (action.type) {
    case "SET_PRODUCTS":
      return { ...state, products: action.products };
    case "SET_LOADING":
      return { ...state, loading: action.loading };
    case "ADD_TO_CART": {
      const existing = state.cart.find(
        (i) => i.variant.id === action.item.variant.id
      );
      if (existing) {
        return {
          ...state,
          cart: state.cart.map((i) =>
            i.variant.id === action.item.variant.id
              ? { ...i, quantity: i.quantity + action.item.quantity }
              : i
          ),
        };
      }
      return { ...state, cart: [...state.cart, action.item] };
    }
    case "REMOVE_FROM_CART":
      return {
        ...state,
        cart: state.cart.filter((i) => i.variant.id !== action.variantId),
      };
    case "UPDATE_QUANTITY":
      if (action.quantity <= 0) {
        return {
          ...state,
          cart: state.cart.filter((i) => i.variant.id !== action.variantId),
        };
      }
      return {
        ...state,
        cart: state.cart.map((i) =>
          i.variant.id === action.variantId
            ? { ...i, quantity: action.quantity }
            : i
        ),
      };
    case "CLEAR_CART":
      return { ...state, cart: [], checkoutUrl: "" };
    case "TOGGLE_CART":
      return {
        ...state,
        cartOpen: action.open !== undefined ? action.open : !state.cartOpen,
      };
    case "SET_CHECKOUT_URL":
      return { ...state, checkoutUrl: action.url };
    default:
      return state;
  }
}

/* ─── Provider ─── */

export function ShopifyProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState, loadCart);

  const fetchProducts = useCallback(async () => {
    const client = getShopifyClient();
    if (!client) return;

    dispatch({ type: "SET_LOADING", loading: true });
    try {
      const products = await client.product.fetchAll();
      dispatch({
        type: "SET_PRODUCTS",
        products: products.map((p) => ({
          id: p.id,
          title: p.title,
          description: p.description,
          descriptionHtml: p.descriptionHtml,
          handle: p.handle,
          productType: p.productType,
          vendor: p.vendor,
          images: p.images.map((img) => ({
            id: img.id,
            src: img.src,
            altText: img.altText,
          })),
          variants: p.variants.map((v) => ({
            id: v.id,
            title: v.title,
            price: v.price,
            available: v.available,
            selectedOptions: v.selectedOptions ?? [],
            image: v.image
              ? { id: v.image.id, src: v.image.src, altText: v.image.altText }
              : undefined,
          })),
        })),
      });
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      dispatch({ type: "SET_LOADING", loading: false });
    }
  }, []);

  const addToCart = useCallback(
    (product: ShopifyProduct, variantIndex = 0, quantity = 1) => {
      const variant = product.variants[variantIndex];
      if (!variant) return;
      dispatch({
        type: "ADD_TO_CART",
        item: {
          id: product.id,
          title: product.title,
          variant,
          quantity,
          image: product.images[0],
        },
      });
    },
    []
  );

  const removeFromCart = useCallback((variantId: string) => {
    dispatch({ type: "REMOVE_FROM_CART", variantId });
  }, []);

  const updateQuantity = useCallback((variantId: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", variantId, quantity });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: "CLEAR_CART" });
  }, []);

  const toggleCart = useCallback((open?: boolean) => {
    dispatch({ type: "TOGGLE_CART", open });
  }, []);

  const checkout = useCallback(async () => {
    const client = getShopifyClient();
    if (!client || state.cart.length === 0) return;

    try {
      const checkout = await client.checkout.create();
      const lineItems = state.cart.map((item) => ({
        variantId: item.variant.id,
        quantity: item.quantity,
      }));
      const updatedCheckout = await client.checkout.addLineItems(
        checkout.id,
        lineItems
      );
      dispatch({
        type: "SET_CHECKOUT_URL",
        url: updatedCheckout.webUrl,
      });
      window.location.assign(updatedCheckout.webUrl);
    } catch (err) {
      console.error("Checkout failed:", err);
    }
  }, [state.cart]);

  // Load products on mount if configured
  useEffect(() => {
    if (state.configured) {
      fetchProducts();
    }
  }, [state.configured, fetchProducts]);

  // Persist cart to localStorage
  useEffect(() => {
    localStorage.setItem("wwl-cart", JSON.stringify(state.cart));
  }, [state.cart]);

  const cartCount = state.cart.reduce((sum, i) => sum + i.quantity, 0);
  const cartTotal = state.cart
    .reduce(
      (sum, i) => sum + parseFloat(i.variant.price.amount) * i.quantity,
      0
    )
    .toFixed(2);

  return (
    <ShopifyContext.Provider
      value={{
        ...state,
        fetchProducts,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleCart,
        checkout,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </ShopifyContext.Provider>
  );
}
