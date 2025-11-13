import React from "react";

type LabelProps = {
  children: React.ReactNode;
  htmlFor?: string;
  className?: string;
};

const Label: React.FC<LabelProps> = ({ children, htmlFor, className = "" }) => {
  return (
    <label htmlFor={htmlFor} className={`text-gray-900 ${className}`}>
      {children}
    </label>
  );
};

export default Label;
