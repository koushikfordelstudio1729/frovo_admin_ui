import React from "react";

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  id?: string;
  className?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({
  label,
  checked,
  onChange,
  id,
  className,
  ...rest
}) => {
  const checkboxId =
    id || `checkbox-${label.replace(/\s+/g, "-").toLowerCase()}`;
  return (
    <label
      htmlFor={checkboxId}
      className={`flex items-center cursor-pointer gap-2 ${className}`}
    >
      <input
        type="checkbox"
        className="accent-blue-600 w-5 h-5 rounded transition border-gray-300 shadow-sm"
        id={checkboxId}
        checked={checked}
        onChange={onChange}
        {...rest}
      />
      <span className="text-gray-700">{label}</span>
    </label>
  );
};

export default Checkbox;
