interface FieldTextRangeProps {
  label: string;
  fromValue?: number | string;
  toValue?: number | string;
  onFromChange: (v: number | "") => void;
  onToChange: (v: number | "") => void;
  placeholderFrom?: string;
  placeholderTo?: string;
  min?: number;
}

export function FieldTextRange({
  label,
  fromValue,
  toValue,
  onFromChange,
  onToChange,
  placeholderFrom = "От",
  placeholderTo = "До",
  min,
}: FieldTextRangeProps) {
  return (
    <div className="space-y-2">
      <label className="block text-lg font-[family-name:var(--font-stetica-regular)]">
        {label}
      </label>
      <div className="flex gap-2">
        <input
          type="number"
          placeholder={placeholderFrom}
          value={fromValue || ""}
          min={min}
          onChange={(e) =>
            onFromChange(e.target.value ? Number(e.target.value) : "")
          }
          className="w-full px-3 py-2 rounded-lg"
          style={{
            backgroundColor: "var(--bg-secondary)",
            border: "1px solid var(--border-color)",
          }}
        />
        <input
          type="number"
          placeholder={placeholderTo}
          value={toValue || ""}
          min={min}
          onChange={(e) =>
            onToChange(e.target.value ? Number(e.target.value) : "")
          }
          className="w-full px-3 py-2 rounded-lg"
          style={{
            backgroundColor: "var(--bg-secondary)",
            border: "1px solid var(--border-color)",
          }}
        />
      </div>
    </div>
  );
}
