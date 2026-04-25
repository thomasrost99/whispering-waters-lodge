import Client from "shopify-buy";

const domain = import.meta.env.VITE_SHOPIFY_DOMAIN;
const storefrontAccessToken = import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

let client: ReturnType<typeof Client.buildClient> | null = null;

export function getShopifyClient() {
  if (!domain || !storefrontAccessToken) {
    console.warn(
      "Shopify credentials not configured. Set VITE_SHOPIFY_DOMAIN and VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN in .env"
    );
    return null;
  }

  if (!client) {
    client = Client.buildClient({
      domain,
      storefrontAccessToken,
      apiVersion: "2024-10",
    });
  }

  return client;
}

export function isShopifyConfigured(): boolean {
  return !!(domain && storefrontAccessToken && domain !== "your-store.myshopify.com");
}
