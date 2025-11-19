import { useState, useRef } from "react";
import { ChevronDown } from "lucide-react";

interface AgeRangeSelectProps {
  value: string;
  onChange: (val: string) => void;
  className?: string;
  borderColor?: string;
}

const AGE_OPTIONS = [
  { value: "> 60", label: ">60 Days", color: "bg-red-500 text-white" },
  { value: "> 45", label: ">45 Days", color: "bg-orange-400 text-white" },
  { value: "15", label: "15 Days", color: "bg-green-500 text-white" },
];

export default function AgeRangeSelect({
  value,
  onChange,
  className = "",
  borderColor = "border-gray-200",
}: AgeRangeSelectProps) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const selected =
    AGE_OPTIONS.find((opt) => opt.value === value) || AGE_OPTIONS[0];

  return (
    <div className={`relative my-2 ${className}`}>
      <div
        className={`bg-white rounded-md px-4 py-3 border-2 flex items-center gap-2 shadow  ${borderColor}`}
        onClick={() => setOpen((v) => !v)}
        style={{ cursor: "pointer" }}
      >
        <span
          className={`rounded px-4 py-2 font-medium text-xs ${selected.color}`}
        >
          {selected.label}
        </span>
        <ChevronDown className="w-6 h-6 ml-auto text-gray-800" />
      </div>
      {open && (
        <div className="absolute left-0 mt-2 z-10 w-full">
          <div className="flex flex-col gap-2">
            {AGE_OPTIONS.filter((opt) => opt.value !== selected.value).map(
              (opt) => (
                <button
                  key={opt.value}
                  className={`rounded border border-gray-300 px-4 py-3 font-medium text-left shadow text-xs ${opt.color}`}
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  type="button"
                >
                  {opt.label}
                </button>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}
