import type { ElementType } from "react";

interface ContactInfoItemProps {
  icon: ElementType;
  label: string;
  children: React.ReactNode;
}

/**
 * A single row of contact info with an icon badge, label, and content.
 * Used on the Contact page sidebar.
 */
export default function ContactInfoItem({ icon: Icon, label, children }: ContactInfoItemProps) {
  return (
    <div className="flex gap-4">
      <div className="w-10 h-10 rounded-xl bg-forest-50 text-forest-600 flex items-center justify-center flex-shrink-0">
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="font-medium text-lodge-dark">{label}</p>
        <div className="text-lodge-charcoal/60 text-sm">{children}</div>
      </div>
    </div>
  );
}
