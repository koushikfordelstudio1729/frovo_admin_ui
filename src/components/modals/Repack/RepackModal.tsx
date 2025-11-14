"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import { Button, Label, Select, Input } from "@/components";

interface RepackModalProps {
  open: boolean;
  onClose: () => void;
  batchId?: string;
  onSubmit: (data: {
    vendorId: string;
    batchId: string;
    reason: string;
  }) => void;
}

const vendorOptions = [
  { value: "vendor1", label: "Vendor 1" },
  { value: "vendor2", label: "Vendor 2" },
];

export default function RepackModal({
  open,
  onClose,
  batchId,
  onSubmit,
}: RepackModalProps) {
  const [vendorId, setVendorId] = useState("");
  const [reason, setReason] = useState("");
  const [charCount, setCharCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      onSubmit({
        vendorId,
        batchId: batchId || "",
        reason,
      });
      setVendorId("");
      setReason("");
      setCharCount(0);
      onClose();
    } catch (err) {
      console.error("Error submitting form:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed w-full inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl p-8 w-xl shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Return Order</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Vendor ID"
            selectClassName="px-2 py-3 bg-gray-100"
            options={vendorOptions}
            value={vendorId}
            onChange={setVendorId}
            required
            disabled={isLoading}
            variant="default"
            placeholder="Select Vendor"
            fullWidth
          />
          <div className="flex flex-col gap-2">
            <Label className="text-lg">Batch ID</Label>

            <Input
              variant="default"
              type="text"
              labelClassName="text-lg"
              value={batchId || ""}
              readOnly
              disabled
              fullWidth
            />
          </div>

          <div>
            <Label className="text-lg">Reason</Label>
            <textarea
              className="mt-1 border-2 border-gray-200 text-gray-600 rounded-lg p-2 min-h-20 w-full focus:outline-none "
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                setCharCount(e.target.value.length);
              }}
              maxLength={300}
              placeholder="Enter reason"
              required
              disabled={isLoading}
            />
            <div className="flex justify-end text-xs text-gray-400 pt-1">
              {charCount} / 300
            </div>
          </div>

          <div className="flex justify-center pt-2">
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isLoading}
              disabled={isLoading}
              className="px-8 rounded-lg"
            >
              Submit Return
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
