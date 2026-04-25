import type { ReactNode } from "react";

interface PageHeroProps {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: string;
  icon?: ReactNode;
  gradient: "forest" | "earth" | "water";
}

const gradientMap = {
  forest: "from-forest-800 to-forest-900",
  earth: "from-earth-700 via-earth-600 to-earth-800",
  water: "from-water-700 via-water-600 to-water-800",
};

const eyebrowColorMap = {
  forest: "text-gold-light",
  earth: "text-gold-light",
  water: "text-water-100",
};

const subtitleColorMap = {
  forest: "text-earth-200",
  earth: "text-earth-200",
  water: "text-water-100",
};

/**
 * Reusable page hero banner with gradient background and subtle SVG texture.
 * Used on About, Shop, and Contact pages (Home has its own video hero).
 */
export default function PageHero({ eyebrow, title, subtitle, icon, gradient }: PageHeroProps) {
  return (
    <section className={`relative py-20 sm:py-28 bg-gradient-to-br ${gradientMap[gradient]} overflow-hidden`}>
      {/* Subtle texture overlay */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.3' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="relative max-w-4xl mx-auto text-center px-4">
        {icon && (
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 mb-6">
            {icon}
          </div>
        )}

        {eyebrow && (
          <p className={`tracking-[0.3em] uppercase text-sm font-medium mb-4 ${eyebrowColorMap[gradient]}`}>
            {eyebrow}
          </p>
        )}

        <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-cream mb-4">
          {title}
        </h1>

        {subtitle && (
          <p className={`text-lg max-w-2xl mx-auto leading-relaxed ${subtitleColorMap[gradient]}`}>
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
