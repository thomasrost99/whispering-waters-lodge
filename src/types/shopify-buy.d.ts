declare module "shopify-buy" {
  interface Config {
    domain: string;
    storefrontAccessToken: string;
    apiVersion?: string;
  }

  interface Client {
    product: {
      fetchAll: (pageSize?: number) => Promise<any[]>;
      fetch: (id: string) => Promise<any>;
      fetchByHandle: (handle: string) => Promise<any>;
      fetchQuery: (query: { query?: string; sortKey?: string; reverse?: boolean; first?: number }) => Promise<any[]>;
    };
    checkout: {
      create: () => Promise<any>;
      fetch: (id: string) => Promise<any>;
      addLineItems: (checkoutId: string, lineItems: Array<{ variantId: string; quantity: number }>) => Promise<any>;
      removeLineItems: (checkoutId: string, lineItemIds: string[]) => Promise<any>;
      updateLineItems: (checkoutId: string, lineItems: Array<{ id: string; quantity: number }>) => Promise<any>;
    };
    collection: {
      fetchAll: (pageSize?: number) => Promise<any[]>;
      fetchAllWithProducts: () => Promise<any[]>;
      fetchByHandle: (handle: string) => Promise<any>;
      fetchWithProducts: (id: string) => Promise<any>;
    };
  }

  const Client: {
    buildClient: (config: Config) => Client;
  };

  export default Client;
}
