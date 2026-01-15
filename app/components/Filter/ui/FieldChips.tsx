import { memo, useCallback } from "react";

interface FieldChipsOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface FieldChipsProps {
  label?: string;
  options: FieldChipsOption[];
  value: string[];
  onToggle: (val: string) => void;
  multiSelect?: boolean;
}

export const FieldChips = memo(function FieldChips({
  label,
  options,
  value,
  onToggle,
}: FieldChipsProps) {
  const handleToggle = useCallback((optionValue: string) => {
    onToggle(optionValue);
  }, [onToggle]);

  const handleKeyDown = (e: React.KeyboardEvent, optionValue: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleToggle(optionValue);
    }
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-lg font-[family-name:var(--font-stetica-regular)]">
          {label}
        </label>
      )}
      <div className="flex flex-wrap gap-2" role="group" aria-label={label}>
        {options.map((o) => {
          const active = value.includes(o.value);
          const disabled = o.disabled ?? false;
          return (
            <button
              key={o.value}
              type="button"
              role="checkbox"
              aria-checked={active}
              aria-disabled={disabled}
              disabled={disabled}
              onClick={() => !disabled && handleToggle(o.value)}
              onKeyDown={(e) => !disabled && handleKeyDown(e, o.value)}
              className={`px-4 py-1 rounded-lg border-[1.5px] transition-all flex items-center justify-center select-none focus:outline-none ${
                disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
              }`}
              style={
                disabled
                  ? {
                      backgroundColor: "transparent",
                      color: "var(--text-secondary)",
                      border: "1.5px solid var(--border-color)",
                      opacity: 0.5,
                    }
                  : active
                  ? {
                      backgroundColor: "transparent",
                      border: "1.5px solid var(--accent-primary)",
                    }
                  : {
                      backgroundColor: "transparent",
                      color: "var(--text-primary)",
                      border: "1.5px solid var(--border-color)",
                    }
              }
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
});
