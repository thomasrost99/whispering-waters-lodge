declare module "shopify-buy" {
  interface Config {
    domain: string;
    storefrontAccessToken: string;
    apiVersion?: string;
  }

  interface Image {
    id: string;
    src: string;
    altText: string | null;
  }

  interface Variant {
    id: string;
    title: string;
    price: { amount: string; currencyCode: string };
    available: boolean;
    selectedOptions?: { name: string; value: string }[];
    image?: Image | null;
  }

  interface Product {
    id: string;
    title: string;
    description: string;
    descriptionHtml: string;
    handle: string;
    productType: string;
    vendor: string;
    images: Image[];
    variants: Variant[];
  }

  interface Checkout {
    id: string;
    webUrl: string;
  }

  interface Client {
    product: {
      fetchAll: (pageSize?: number) => Promise<Product[]>;
    };
    checkout: {
      create: () => Promise<Checkout>;
      addLineItems: (checkoutId: string, lineItems: Array<{ variantId: string; quantity: number }>) => Promise<Checkout>;
    };
  }

  const Client: {
    buildClient: (config: Config) => Client;
  };

  export default Client;
}
