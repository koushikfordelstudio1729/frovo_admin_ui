"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, Search, X } from "lucide-react";

type SelectVariant = "default" | "orange";

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface MultiSelectProps {
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
  value?: string[];
  onChange: (value: string[]) => void;
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

export const MultiSelect: React.FC<MultiSelectProps> = ({
  id,
  label,
  error,
  helperText,
  fullWidth = true,
  variant = "default",
  options,
  placeholder = "Select options",
  className = "",
  labelClassName = "",
  selectClassName = "",
  value = [],
  onChange,
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const currentVariant = variantStyles[variant];
  const hasError = !!error;

  const selectedOptions = options.filter((opt) => value.includes(opt.value));

  const filteredOptions = options.filter(
    (opt) =>
      opt &&
      typeof opt.label === "string" &&
      opt.label.toLowerCase().includes(search.toLowerCase())
  );

  const widthClass = fullWidth ? "w-full" : "";

  const triggerClasses = [
    "w-full",
    "flex items-center justify-between rounded-lg bg-white cursor-pointer",
    "px-4 py-3 text-base text-black min-h-[52px]",
    hasError ? "border-2 border-red-300" : currentVariant.base,
    selectClassName,
  ].join(" ");

  const labelClasses = `block text-xl font-medium mb-2 ${currentVariant.label} ${labelClassName}`;

  const handleToggle = (optionValue: string) => {
    const newValue = value.includes(optionValue)
      ? value.filter((v) => v !== optionValue)
      : [...value, optionValue];
    onChange(newValue);
  };

  const handleRemove = (optionValue: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(value.filter((v) => v !== optionValue));
  };

  const handleClearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange([]);
  };

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
        setSearch("");
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
        <div className="flex-1 flex items-center gap-2 flex-wrap min-h-[28px]">
          {selectedOptions.length === 0 ? (
            <span className="text-gray-400">{placeholder}</span>
          ) : (
            selectedOptions.map((opt) => (
              <span
                key={opt.value}
                className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm"
              >
                {opt.label}
                <button
                  type="button"
                  onClick={(e) => handleRemove(opt.value, e)}
                  className="hover:bg-blue-200 rounded-full p-0.5"
                >
                  <X size={14} />
                </button>
              </span>
            ))
          )}
        </div>
        <div className="flex items-center gap-2">
          {selectedOptions.length > 0 && (
            <button
              type="button"
              onClick={handleClearAll}
              className="text-gray-400 hover:text-gray-600 text-sm"
            >
              Clear
            </button>
          )}
          <ChevronDown className="text-gray-500" size={20} />
        </div>
      </button>

      {open && (
        <div className="absolute text-gray-900 z-20 mt-2 w-full rounded-lg border-2 border-orange-300 bg-white shadow-lg">
          <div className="flex items-center px-3 py-2 border-b border-orange-200 gap-2">
            <Search size={20} className="text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-base outline-none"
              placeholder="Search machines..."
            />
          </div>

          <div className="max-h-60 overflow-y-auto">
            {filteredOptions.length === 0 && (
              <div className="px-4 py-3 text-sm text-gray-500">
                No options found
              </div>
            )}
            {filteredOptions.map((opt) => (
              <label
                key={opt.value}
                className={`flex items-center gap-3 w-full text-left px-4 py-3 text-sm hover:bg-gray-50 cursor-pointer border-b border-gray-100 ${
                  opt.disabled ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <input
                  type="checkbox"
                  checked={value.includes(opt.value)}
                  onChange={() => !opt.disabled && handleToggle(opt.value)}
                  disabled={opt.disabled}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="flex-1">{opt.label}</span>
              </label>
            ))}
          </div>

          {selectedOptions.length > 0 && (
            <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 text-sm text-gray-600">
              {selectedOptions.length} selected
            </div>
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

export default MultiSelect;
