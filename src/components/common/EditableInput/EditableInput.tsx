import { Pencil } from "lucide-react";
import { Label } from "@/components";

interface EditableInputProps {
  id: string;
  label: string;
  value: string;
  isEditing: boolean;
  onChange: (value: string) => void;
  toggleEdit: () => void;
  placeholder?: string;
  type?: string;
}

export default function EditableInput({
  id,
  label,
  value,
  isEditing,
  onChange,
  toggleEdit,
  placeholder = "",
  type = "text",
}: EditableInputProps) {
  return (
    <div className="mb-2">
      <Label htmlFor={id} className="mb-1 text-base font-medium">
        {label}
      </Label>
      <div className="relative">
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={!isEditing}
          placeholder={placeholder}
          className={`block w-full mt-2 rounded-md px-4 py-4 pr-10 bg-white text-black border-2 border-orange-200  outline-none transition min-h-10 font-normal`}
        />
        <button
          type="button"
          onClick={toggleEdit}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500"
        >
          <Pencil className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
