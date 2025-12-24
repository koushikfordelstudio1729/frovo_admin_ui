"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, Search, Check } from "lucide-react";

type ComboboxVariant = "default" | "orange";

interface ComboboxOption {
  value: string;
  label: string;
}

interface ComboboxProps {
  id?: string;
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  variant?: ComboboxVariant;
  options: ComboboxOption[];
  placeholder?: string;
  className?: string;
  labelClassName?: string;
  inputClassName?: string;
  value?: string;
  onChange: (value: string) => void;
  allowCustom?: boolean;
  loading?: boolean;
  disabled?: boolean;
}

const variantStyles: Record<ComboboxVariant, { base: string; label: string }> = {
  default: {
    base: "border-2 border-gray-300",
    label: "text-gray-700",
  },
  orange: {
    base: "border-2 border-orange-300",
    label: "text-gray-900",
  },
};

export const Combobox: React.FC<ComboboxProps> = ({
  id,
  label,
  error,
  helperText,
  fullWidth = true,
  variant = "default",
  options,
  placeholder = "Select or type...",
  className = "",
  labelClassName = "",
  inputClassName = "",
  value = "",
  onChange,
  allowCustom = true,
  loading = false,
  disabled = false,
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState(value);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const currentVariant = variantStyles[variant];
  const hasError = !!error;

  useEffect(() => {
    setSearch(value);
  }, [value]);

  const filteredOptions = options.filter(
    (opt) =>
      opt &&
      typeof opt.label === "string" &&
      opt.label.toLowerCase().includes(search.toLowerCase())
  );

  const widthClass = fullWidth ? "w-full" : "";

  const inputClasses = [
    "w-full",
    "px-4 py-3 rounded-lg bg-white cursor-pointer",
    "text-base text-black",
    hasError ? "border-2 border-red-300" : currentVariant.base,
    disabled ? "opacity-50 cursor-not-allowed" : "",
    inputClassName,
  ].join(" ");

  const labelClasses = `block text-xl font-medium mb-2 ${currentVariant.label} ${labelClassName}`;

  const handleSelect = (optionValue: string) => {
    setSearch(optionValue);
    onChange(optionValue);
    setOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearch(newValue);
    if (allowCustom) {
      onChange(newValue);
    }
    setOpen(true);
  };

  const handleInputFocus = () => {
    if (!disabled) {
      setOpen(true);
    }
  };

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div ref={wrapperRef} className={`${widthClass} ${className} relative`}>
      {label && (
        <label htmlFor={id} className={labelClasses}>
          {label}
        </label>
      )}

      <div className="relative">
        <input
          id={id}
          type="text"
          className={inputClasses}
          value={search}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          placeholder={placeholder}
          disabled={disabled || loading}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          {loading ? (
            <div className="animate-spin h-5 w-5 border-2 border-orange-500 border-t-transparent rounded-full"></div>
          ) : (
            <ChevronDown className="text-gray-500" size={20} />
          )}
        </div>
      </div>

      {open && !disabled && (
        <div className="absolute z-20 mt-2 w-full rounded-lg border-2 border-orange-300 bg-white shadow-lg max-h-60 overflow-y-auto">
          {filteredOptions.length === 0 && !loading ? (
            <div className="px-4 py-3 text-sm text-gray-500">
              {allowCustom
                ? search
                  ? `Press Enter to use "${search}"`
                  : "Type to search or add custom value"
                : "No options found"}
            </div>
          ) : (
            filteredOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={`flex items-center justify-between w-full text-left px-4 py-3 text-sm hover:bg-gray-50 border-b border-gray-100 ${
                  value === opt.value ? "bg-orange-50" : ""
                }`}
                onClick={() => handleSelect(opt.value)}
              >
                <span className="flex-1 text-gray-900">{opt.label}</span>
                {value === opt.value && (
                  <Check size={16} className="text-orange-500" />
                )}
              </button>
            ))
          )}

          {allowCustom && search && !filteredOptions.some(opt => opt.value === search) && (
            <button
              type="button"
              className="flex items-center w-full text-left px-4 py-3 text-sm hover:bg-gray-50 border-t-2 border-orange-200 bg-orange-50"
              onClick={() => handleSelect(search)}
            >
              <span className="text-gray-900">
                Use custom: <strong>"{search}"</strong>
              </span>
            </button>
          )}
        </div>
      )}

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      {helperText && !error && (
        <p className="mt-2 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
};

export default Combobox;
