"use client";

import React from "react";

interface RadioProps {
  label: string;
  value: string;
  selectedValue: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const Radio: React.FC<RadioProps> = ({
  label,
  value,
  selectedValue,
  onChange,
  disabled = false,
}) => {
  return (
    <label
      className={`flex items-center gap-3 cursor-pointer ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      <input
        type="radio"
        value={value}
        checked={selectedValue === value}
        onChange={() => onChange(value)}
        disabled={disabled}
        className="h-5 w-5 accent-blue-500 cursor-pointer"
      />
      <span className="text-gray-900 text-md">{label}</span>
    </label>
  );
};

export default Radio;
