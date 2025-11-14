import React from "react";
import { ChevronDown } from "lucide-react";

type SelectVariant = "default" | "orange";

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps
  extends Omit<
    React.SelectHTMLAttributes<HTMLSelectElement>,
    "children" | "onChange"
  > {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  variant?: SelectVariant;
  options: SelectOption[];
  placeholder?: string;
  selectClassName?: string;
  labelClassName?: string;
  iconSize?: number;
  onChange: (value: string) => void;
}

const Select: React.FC<SelectProps> = ({
  label,
  error,
  helperText,
  fullWidth = true,
  variant = "default",
  options,
  placeholder = "Select an option",
  className = "",
  selectClassName = "",
  labelClassName = "",
  iconSize = 28,
  onChange,
  id,
  value,
  ...props
}) => {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, "-");
  const hasError = !!error;

  const variantStyles = {
    default: {
      base: "border-gray-300",
      label: "text-gray-700",
    },
    orange: {
      base: "border-orange-300 ",
      label: "text-gray-900",
    },
  };

  const currentVariant = variantStyles[variant];

  const baseSelectClasses =
    "block border rounded-lg shadow-sm focus:outline-none transition-colors appearance-none pr-12 text-black";

  const errorClasses = hasError
    ? "border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500"
    : currentVariant.base;

  const widthClass = fullWidth ? "w-full" : "";

  const selectClasses = `${baseSelectClasses} ${errorClasses} ${widthClass} ${selectClassName}`;
  const labelClasses = `block text-xl font-medium mb-2 ${currentVariant.label} ${labelClassName}`;

  return (
    <div className={`${fullWidth ? "w-full" : ""} ${className}`}>
      {label && (
        <label htmlFor={selectId} className={labelClasses}>
          {label}
        </label>
      )}

      <div className="relative">
        <select
          id={selectId}
          className={selectClasses}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}

          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>

        <ChevronDown
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none"
          size={iconSize}
        />
      </div>

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      {helperText && !error && (
        <p className="mt-2 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
};

export default Select;
