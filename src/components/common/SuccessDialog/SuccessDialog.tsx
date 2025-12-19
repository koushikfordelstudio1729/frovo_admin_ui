"use client";

import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components";

interface SuccessDialogProps {
  open: boolean;
  title?: string;
  message?: string;
  primaryText?: string;
  onClose?: () => void;
}

export default function SuccessDialog({
  open,
  title = "Saved successfully",
  message = "Your changes have been saved.",
  primaryText = "OK",
  onClose,
}: SuccessDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex flex-col items-center text-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
            <CheckCircle2 className="h-8 w-8 text-emerald-600" />
          </div>

          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          <p className="text-sm text-slate-500">{message}</p>
        </div>
      </div>
    </div>
  );
}
