import React from "react";

type TextareaVariant = "default" | "orange";

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  variant?: TextareaVariant;
  textareaClassName?: string;
  labelClassName?: string;
}

const Textarea: React.FC<TextareaProps> = ({
  label,
  error,
  helperText,
  fullWidth = true,
  variant = "default",
  className = "",
  textareaClassName = "",
  labelClassName = "",
  id,
  rows = 4,
  ...props
}) => {
  const textareaId = id || label?.toLowerCase().replace(/\s+/g, "-");
  const hasError = !!error;

  // Variant styles
  const variantStyles = {
    default: {
      base: "border-gray-300",
      label: "text-gray-700",
    },
    orange: {
      base: "border-orange-300",
      label: "text-gray-900",
    },
  };

  const currentVariant = variantStyles[variant];

  const baseTextareaClasses =
    "block px-4 py-3 border-2 rounded-lg shadow-sm focus:outline-none transition-colors resize-none text-black";

  const errorClasses = hasError
    ? "border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500"
    : currentVariant.base;

  const widthClass = fullWidth ? "w-full" : "";

  const textareaClasses = `${baseTextareaClasses} ${errorClasses} ${widthClass} ${textareaClassName}`;
  const labelClasses = `block text-xl font-medium mb-2 ${currentVariant.label} ${labelClassName}`;

  return (
    <div className={`${fullWidth ? "w-full" : ""} ${className}`}>
      {label && (
        <label htmlFor={textareaId} className={labelClasses}>
          {label}
        </label>
      )}

      <textarea
        id={textareaId}
        rows={rows}
        className={textareaClasses}
        {...props}
      />

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

      {helperText && !error && (
        <p className="mt-2 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
};

export default Textarea;
