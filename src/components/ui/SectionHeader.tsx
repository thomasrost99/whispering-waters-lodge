interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
}

/**
 * Centered section header with optional uppercase eyebrow text.
 * Used to introduce content sections across pages.
 */
export default function SectionHeader({ eyebrow, title }: SectionHeaderProps) {
  return (
    <div className="text-center mb-16">
      {eyebrow && (
        <p className="text-forest-600 tracking-widest uppercase text-sm font-medium mb-3">
          {eyebrow}
        </p>
      )}
      <h2 className="font-heading text-3xl sm:text-4xl font-bold text-lodge-dark">
        {title}
      </h2>
    </div>
  );
}
