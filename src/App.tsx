import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { ShopifyProvider } from "./context/ShopifyContext";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

const About = lazy(() => import("./pages/About"));
const Shop = lazy(() => import("./pages/Shop"));
const Contact = lazy(() => import("./pages/Contact"));

export default function App() {
  return (
    <ShopifyProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<Suspense><About /></Suspense>} />
          <Route path="shop" element={<Suspense><Shop /></Suspense>} />
          <Route path="contact" element={<Suspense><Contact /></Suspense>} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </ShopifyProvider>
  );
}
