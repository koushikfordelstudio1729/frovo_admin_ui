import React from "react";

export interface PasswordValidationProps {
  validationRules: {
    id: string;
    label: string;
    isValid: boolean;
  }[];
  className?: string;
}

export const PasswordValidation: React.FC<PasswordValidationProps> = ({
  validationRules,
  className = "",
}) => {
  return (
    <div className={`space-y-2 text-sm mt-4 ${className}`}>
      {validationRules.map((rule) => (
        <div key={rule.id} className="flex items-center text-orange-500">
          <span className={rule.isValid ? "text-green-500" : "text-gray-400"}>
            {rule.isValid ? "✔" : "○"}
          </span>
          <span className="ml-2">{rule.label}</span>
        </div>
      ))}
    </div>
  );
};

export default PasswordValidation;
