"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export interface BackHeaderProps {
  title: string;
  onBack?: () => void;
  showBackButton?: boolean;
  className?: string;
  titleClassName?: string;
  backButtonClassName?: string;
}

export const BackHeader: React.FC<BackHeaderProps> = ({
  title,
  onBack,
  showBackButton = true,
  className = "",
  titleClassName = "",
  backButtonClassName = "",
}) => {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <div className={`flex items-center gap-3 my-4 ${className}`}>
      {showBackButton && (
        <button
          onClick={handleBack}
          className={`p-2 hover:cursor-pointer ${backButtonClassName}`}
          aria-label="Go back"
        >
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
      )}
      <h1 className={`text-2xl font-semibold text-gray-900 ${titleClassName}`}>
        {title}
      </h1>
    </div>
  );
};

export default BackHeader;
