"use client";

import React, { useMemo, useState, useEffect, useRef } from "react";
import { ChevronDown, Search } from "lucide-react";

type SelectVariant = "default" | "orange";

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SearchableSelectProps {
  id?: string;
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  variant?: SelectVariant;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
  labelClassName?: string;
  selectClassName?: string;
  value?: string;
  onChange: (value: string) => void;
}

const variantStyles: Record<SelectVariant, { base: string; label: string }> = {
  default: {
    base: "border-2 border-gray-300",
    label: "text-gray-700",
  },
  orange: {
    base: "border-2 border-orange-300",
    label: "text-gray-900",
  },
};

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
  id,
  label,
  error,
  helperText,
  fullWidth = true,
  variant = "default",
  options,
  placeholder = "Select an option",
  className = "",
  labelClassName = "",
  selectClassName = "",
  value,
  onChange,
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const currentVariant = variantStyles[variant];
  const hasError = !!error;

  const selectedOption = options.find((opt) => opt.value === value);

  const filteredOptions = useMemo(
    () =>
      options.filter(
        (opt) =>
          opt &&
          typeof opt.label === "string" &&
          opt.label.toLowerCase().includes(search.toLowerCase())
      ),
    [options, search]
  );

  const widthClass = fullWidth ? "w-full" : "";

  const triggerClasses = [
    "w-full broder-2 border-orange-300",
    "flex items-center justify-between rounded-lg bg-white cursor-pointer",
    "px-6 py-4 text-base text-black",
    hasError ? "border-2 border-red-300" : currentVariant.base,
    selectClassName,
  ].join(" ");

  const labelClasses = `block text-xl font-medium mb-2 ${currentVariant.label} ${labelClassName}`;

  const handleSelect = (val: string) => {
    onChange(val);
    setOpen(false);
    setSearch("");
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

      <button
        id={id}
        type="button"
        className={triggerClasses}
        onClick={() => setOpen((p) => !p)}
      >
        <span className="truncate">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className="text-gray-500" size={20} />
      </button>

      {open && (
        <div className="absolute text-gray-900 z-20 mt-2 w-full rounded-lg border- border-orange-300 bg-white shadow-lg">
          <div className="flex items-center px-3 py-2 rounded-t border border-orange-200 gap-2">
            <Search size={20} className="text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-lg outline-none"
              placeholder="Search Vendors..."
            />
          </div>

          <div className="max-h-46 overflow-y-auto">
            {filteredOptions.length === 0 && (
              <div className="px-3 py-2 text-sm text-gray-500">
                No options found
              </div>
            )}
            {filteredOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                disabled={opt.disabled}
                onClick={() => handleSelect(opt.value)}
                className={`w-full text-left border border-orange-100 px-3 py-2 text-sm hover:bg-gray-100 ${
                  opt.value === value ? "bg-orange-100 font-medium" : ""
                } ${opt.disabled ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      {helperText && !error && (
        <p className="mt-2 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
};

export default SearchableSelect;
