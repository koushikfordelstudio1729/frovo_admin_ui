import React from "react";
import { Eye, EyeOff } from "lucide-react";

export interface PasswordToggleButtonProps {
  isVisible: boolean;
  onToggle: () => void;
  className?: string;
  size?: number;
}

export const PasswordToggleButton: React.FC<PasswordToggleButtonProps> = ({
  isVisible,
  onToggle,
  className = "",
  size = 20,
}) => {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`text-gray-400 hover:text-gray-600 transition-colors focus:outline-none ${className}`}
      aria-label={isVisible ? "Hide password" : "Show password"}
    >
      {isVisible ? <EyeOff size={size} /> : <Eye size={size} />}
    </button>
  );
};

export default PasswordToggleButton;
