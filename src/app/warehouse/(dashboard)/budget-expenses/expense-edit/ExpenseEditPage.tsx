"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components";
import EditableInput from "@/components/common/EditableInput";

export default function ExpenseEditPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [formData, setFormData] = useState({
    id: "",
    date: "",
    category: "",
    amount: "",
  });

  const [editingFields, setEditingFields] = useState({
    date: false,
    category: false,
    amount: false,
  });

  useEffect(() => {
    setFormData({
      id: searchParams.get("id") || "",
      date: searchParams.get("date") || "",
      category: searchParams.get("category") || "",
      amount: searchParams.get("amount") || "",
    });
  }, [searchParams]);

  const toggleEdit = (field: keyof typeof editingFields) => {
    setEditingFields((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSave = () => {
    router.back();
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="flex items-center gap-3 my-4">
        <button
          onClick={() => router.back()}
          className="p-2 hover:cursor-pointer"
        >
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-2xl font-semibold text-gray-900">Expense edit</h1>
      </div>

      <div className="bg-white rounded-2xl p-8 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-8">
          <EditableInput
            id="date"
            label="Date"
            value={formData.date}
            isEditing={editingFields.date}
            onChange={(val) => setFormData({ ...formData, date: val })}
            toggleEdit={() => toggleEdit("date")}
            placeholder="Edit date"
          />

          <EditableInput
            id="category"
            label="Category"
            value={formData.category}
            isEditing={editingFields.category}
            onChange={(val) => setFormData({ ...formData, category: val })}
            toggleEdit={() => toggleEdit("category")}
            placeholder="Edit supply"
          />

          <EditableInput
            id="amount"
            label="Amount"
            value={formData.amount}
            isEditing={editingFields.amount}
            onChange={(val) => setFormData({ ...formData, amount: val })}
            toggleEdit={() => toggleEdit("amount")}
            placeholder="Edit amount"
          />
        </div>

        <div className="flex justify-center gap-4 mt-8">
          <Button
            variant="primary"
            className="px-8 rounded-lg"
            onClick={handleSave}
          >
            Save
          </Button>
          <Button
            variant="secondary"
            className="px-8 rounded-lg"
            onClick={handleCancel}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
