interface FormFieldProps {
  id: string;
  label: string;
  type?: "text" | "email";
  placeholder?: string;
  required?: boolean;
  multiline?: boolean;
  rows?: number;
}

/**
 * Styled form field (input or textarea) with label.
 * Used in the contact form.
 */
export default function FormField({
  id,
  label,
  type = "text",
  placeholder,
  required,
  multiline,
  rows = 5,
}: FormFieldProps) {
  const fieldClasses =
    "w-full px-4 py-3 rounded-xl border border-earth-200 bg-warm-white focus:border-forest-400 focus:ring-2 focus:ring-forest-400/20 outline-none transition-all text-sm";

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-lodge-dark mb-1.5">
        {label}
      </label>
      {multiline ? (
        <textarea
          id={id}
          name={id}
          rows={rows}
          required={required}
          className={`${fieldClasses} resize-none`}
          placeholder={placeholder}
        />
      ) : (
        <input
          id={id}
          name={id}
          type={type}
          required={required}
          className={fieldClasses}
          placeholder={placeholder}
        />
      )}
    </div>
  );
}
