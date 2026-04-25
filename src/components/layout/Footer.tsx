import { Link } from "react-router-dom";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-lodge-dark text-earth-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 py-16">
          {/* Brand */}
          <div>
            <h3 className="font-heading text-2xl font-bold text-cream mb-4">
              Whispering Waters Lodge
            </h3>
            <p className="text-earth-300 leading-relaxed">
              A family-owned log cabin on over 100 acres of Wisconsin
              northwoods, with a waterfall, private lake, and trails
              right on the property.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-lg font-semibold text-cream mb-4">
              Explore
            </h4>
            <ul className="space-y-2">
              {[
                { to: "/", label: "Home" },
                { to: "/about", label: "About Us" },
                { to: "/shop", label: "Lodge Shop" },
                { to: "/contact", label: "Contact" },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-earth-300 hover:text-gold transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-heading text-lg font-semibold text-cream mb-4">
              Book Your Stay
            </h4>
            <address className="not-italic space-y-2 text-earth-300">
              <p>Delta, WI · Near Iron River</p>
              <p>Bayfield County, Wisconsin</p>
              <p className="pt-2">
                <a
                  href="https://www.vrbo.com/9605561ha"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gold transition-colors"
                >
                  View on Vrbo →
                </a>
              </p>
              <p>
                <a
                  href="mailto:hello@whisperingwaterslodge.com"
                  className="hover:text-gold transition-colors"
                >
                  hello@whisperingwaterslodge.com
                </a>
              </p>
            </address>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-earth-400">
            &copy; {currentYear} Whispering Waters Lodge. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-earth-400">
            <a href="#" className="hover:text-gold transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-gold transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
