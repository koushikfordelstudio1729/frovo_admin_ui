"use client";

import React from "react";
import { X, AlertCircle } from "lucide-react";
import { Button } from "@/components";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  variant?: "danger" | "warning" | "info";
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isLoading = false,
  variant = "warning",
}: ConfirmationModalProps) {
  // Close modal when clicking outside
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && !isLoading) {
      onClose();
    }
  };

  const handleConfirm = () => {
    onConfirm();
  };

  if (!isOpen) return null;

  const variantColors = {
    danger: "text-red-600 bg-red-50",
    warning: "text-orange-600 bg-orange-50",
    info: "text-blue-600 bg-blue-50",
  };

  return (
    <div
      className="fixed w-full inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-full ${variantColors[variant]}`}>
              <AlertCircle size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{title}</h2>
              <p className="text-sm text-gray-600 mt-2">{message}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <X size={24} />
          </button>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end mt-8">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={isLoading}
            className="px-6 rounded-lg"
          >
            {cancelText}
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirm}
            disabled={isLoading}
            className="px-6 rounded-lg"
          >
            {isLoading ? "Processing..." : confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
