# Whispering Waters Lodge

Website for [Whispering Waters Lodge](https://whisperingwaterslodge.com), a log-cabin vacation rental
in the Wisconsin northwoods. Pages: Home, About, Shop, Contact. The shop sells lodge merch through
Shopify's Storefront API.

## Build and run

Vite, React 19, TypeScript, Tailwind 4, `shopify-buy`, Leaflet for the map.

```
npm install
npm run dev      # http://localhost:5173
npm run build    # dist/
```

Copy `.env.example` to `.env` and set `VITE_SHOPIFY_DOMAIN` and `VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN`.
Without them the shop shows demo products and checkout is off.

## Deploying

Cloudflare Pages builds and deploys every push to `main` (`npm run build`, output `dist`). The Shopify
variables are set in Pages and baked in at build time, so changing them needs a new deploy.

## Code map

- `src/pages/`: the four pages. `src/data/`: copy for features, about, demo products.
- `src/lib/shopify.ts` and `src/context/ShopifyContext.tsx`: Storefront client, products, cart, checkout.
- `src/components/`: layout (header, footer), shop (cart, product card), small UI pieces.
