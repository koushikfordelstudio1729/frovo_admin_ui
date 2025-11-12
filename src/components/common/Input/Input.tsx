import React from "react";

type InputVariant = "default" | "orange" | "search" | "underline";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: InputVariant;
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  inputClassName?: string;
  labelClassName?: string;
}

const Input: React.FC<InputProps> = ({
  variant = "default",
  label,
  error,
  helperText,
  fullWidth = true,
  startIcon,
  endIcon,
  rightIcon,
  className = "",
  inputClassName = "",
  labelClassName = "",
  id,
  ...props
}) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
  const hasError = !!error;

  const finalEndIcon = rightIcon || endIcon;

  // Variant styles
  const variantStyles = {
    default: {
      base: "bg-gray-100 border border-gray-300",
      label: "text-gray-700 text-sm font-semibold",
      input: "px-4 py-3",
    },
    orange: {
      base: "bg-white border-2 border-orange-300",
      label: "text-gray-900 text-xl font-medium",
      input: "px-4 py-4",
    },
    search: {
      base: "bg-gray-100 border border-gray-200",
      label: "text-gray-700 text-sm",
      input: "px-4 py-2",
    },
    underline: {
      base: "bg-transparent border",
      label: "text-gray-700 text-sm",
      input: "px-0 py-2",
    },
  };

  const currentVariant = variantStyles[variant];

  // Base input classes
  const baseInputClasses =
    "block rounded-lg shadow-sm focus:outline-none transition-all text-gray-900";

  // Error classes
  const errorClasses = hasError
    ? "border-red-500 focus:ring-red-500 focus:border-red-500 text-red-900 placeholder-red-400"
    : currentVariant.base;

  // Width class
  const widthClass = fullWidth ? "w-full" : "";

  // Icon padding
  const paddingLeft = startIcon ? "pl-11" : "";
  const paddingRight = finalEndIcon ? "pr-11" : "";

  // Final input classes
  const inputClasses = `${baseInputClasses} ${currentVariant.input} ${errorClasses} ${widthClass} ${paddingLeft} ${paddingRight} ${inputClassName}`;

  // Label classes
  const labelClasses = `block font-medium mb-2 ${currentVariant.label} ${
    hasError ? "text-red-600" : ""
  } ${labelClassName}`;

  return (
    <div className={`${fullWidth ? "w-full" : ""} ${className}`}>
      {/* Label */}
      {label && (
        <label htmlFor={inputId} className={labelClasses}>
          {label}
        </label>
      )}

      {/* Input Container */}
      <div className="relative">
        {/* Start Icon */}
        {startIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <div className="h-5 w-5 text-gray-400">{startIcon}</div>
          </div>
        )}

        {/* Input */}
        <input id={inputId} className={inputClasses} {...props} />

        {/* End Icon */}
        {finalEndIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <div className="h-5 w-5 text-gray-400">{finalEndIcon}</div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

      {/* Helper Text */}
      {helperText && !error && (
        <p className="mt-2 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
};

export default Input;
