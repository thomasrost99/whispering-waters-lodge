import type { ElementType } from "react";

interface IconCardProps {
  icon: ElementType;
  title: string;
  text: string;
  centered?: boolean;
}

/**
 * Card with a colored icon, title, and description.
 * Used in feature grids and value sections.
 * `centered` adds text-center and hover-lift animation.
 */
export default function IconCard({ icon: Icon, title, text, centered = false }: IconCardProps) {
  return (
    <div
      className={`bg-white p-8 rounded-2xl border border-earth-100 transition-all duration-300 ${
        centered
          ? "text-center hover:shadow-lg hover:-translate-y-1 group"
          : "hover:shadow-md"
      }`}
    >
      <div
        className={`w-14 h-14 rounded-xl bg-forest-50 text-forest-600 flex items-center justify-center mb-5 ${
          centered
            ? "mx-auto group-hover:bg-forest-600 group-hover:text-white transition-colors duration-300"
            : ""
        }`}
      >
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="font-heading text-lg font-semibold text-lodge-dark mb-2">
        {title}
      </h3>
      <p className="text-lodge-charcoal/60 leading-relaxed text-sm">{text}</p>
    </div>
  );
}
