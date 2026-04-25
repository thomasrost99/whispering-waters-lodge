import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, ShoppingBag } from "lucide-react";
import { useShopify } from "../../context/ShopifyContext";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/shop", label: "Shop" },
  { to: "/contact", label: "Contact" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { toggleCart, cartCount } = useShopify();

  return (
    <header className="sticky top-0 z-50 bg-warm-white/90 backdrop-blur-md border-b border-earth-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <span className="text-2xl sm:text-3xl font-heading font-bold text-forest-800 tracking-tight group-hover:text-forest-600 transition-colors">
              Whispering Waters
            </span>
            <span className="hidden sm:inline text-sm font-body text-earth-500 tracking-widest uppercase">
              Lodge
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `text-sm font-medium tracking-wide uppercase transition-colors ${
                    isActive
                      ? "text-forest-700 border-b-2 border-gold pb-1"
                      : "text-lodge-charcoal/70 hover:text-forest-600"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}

            {/* Cart Button */}
            <button
              onClick={() => toggleCart()}
              className="relative p-2 text-lodge-charcoal/70 hover:text-forest-600 transition-colors"
              aria-label="Open cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-forest-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                  {cartCount}
                </span>
              )}
            </button>
          </nav>

          {/* Mobile Controls */}
          <div className="flex items-center gap-4 md:hidden">
            <button
              onClick={() => toggleCart()}
              className="relative p-2 text-lodge-charcoal/70"
              aria-label="Open cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-forest-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 text-lodge-charcoal/70"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <nav className="md:hidden pb-4 border-t border-earth-100">
            <div className="flex flex-col gap-2 pt-4">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-lg text-sm font-medium tracking-wide uppercase transition-colors ${
                      isActive
                        ? "bg-forest-50 text-forest-700"
                        : "text-lodge-charcoal/70 hover:bg-earth-50"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
