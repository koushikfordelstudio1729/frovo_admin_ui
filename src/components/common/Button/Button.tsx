import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "secondary"
    | "danger"
    | "red"
    | "outline"
    | "approve"
    | "reject"
    | "archive"
    | "edit";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  isLoading = false,
  fullWidth = false,
  disabled,
  children,
  className = "",
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center font-medium transition-colors focus:outline-none disabled:opacity-50 hover:cursor-pointer";

  const variantClasses = {
    primary: "bg-[#FF5722] text-white hover:bg-[#F4511E]",
    secondary: "bg-gray-700 text-white hover:bg-gray-800",
    danger: "text-red-600 hover:text-red-700 hover:cursor-pointer",
    red: "bg-red-600 text-white hover:bg-red-700 hover:cursor-pointer",
    outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
    approve: "bg-[#0B9F00] text-white hover:bg-green-800",
    reject: "bg-gray-700 text-white hover:bg-red-700",
    archive: "bg-gray-700 text-white hover:bg-gray-800 rounded-2xl",
    edit: "bg-blue-500 text-white hover:bg-blue-600 rounded-2xl",
  };

  const sizeClasses = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-3 text-sm",
    lg: "px-6 py-3 text-base",
  };

  const widthClass = fullWidth ? "w-full" : "";

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`;

  return (
    <button className={classes} disabled={disabled || isLoading} {...props}>
      {isLoading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
};

export default Button;
