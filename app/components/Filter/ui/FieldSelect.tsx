"use client";

import { useState, useRef, useEffect, memo } from "react";

interface FieldSelectOption {
  value: string | number;
  label: string;
}

interface FieldSelectProps {
  label?: string;
  value?: string | number;
  onChange: (v: string) => void;
  options: FieldSelectOption[];
  placeholder?: string;
}

export const FieldSelect = memo(function FieldSelect({
  label,
  value,
  onChange,
  options,
  placeholder = "",
}: FieldSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((o) => String(o.value) === String(value));
  const displayText = selectedOption?.label || placeholder || "Все";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const handleSelect = (optionValue: string | number) => {
    onChange(String(optionValue));
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setIsOpen(!isOpen);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div className="space-y-2 mb-1" ref={dropdownRef}>
      {label && (
        <label className="block text-lg font-[family-name:var(--font-stetica-regular)]">
          {label}
        </label>
      )}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          className="w-full px-4 py-2 cursor-pointer rounded-xl text-left flex items-center justify-between transition-all duration-200 hover:border-[var(--accent-primary)] focus:outline-none focus:border-[var(--accent-primary)] focus:ring-[var(--accent-primary)] focus:ring-opacity-20"
          style={{
            backgroundColor: "var(--bg-secondary)",
            border: isOpen ? "1.5px solid var(--accent-primary)" : "1.5px solid var(--border-color)",
            color: selectedOption ? "var(--text-primary)" : "var(--text-secondary)",
          }}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <span className="font-[family-name:var(--font-stetica-regular)]">{displayText}</span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            style={{ color: "var(--text-secondary)" }}
          >
            <path
              d="M4 6L8 10L12 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {isOpen && (
          <div
            className="absolute z-10 w-full mt-2 rounded-xl overflow-hidden shadow-lg"
            style={{
              backgroundColor: "var(--modal-bg)",
              border: "1.5px solid var(--border-color)",
              maxHeight: "240px",
              overflowY: "auto",
            }}
            role="listbox"
          >
            <button
              type="button"
              onClick={() => handleSelect("")}
              className="w-full px-4 py-2 cursor-pointer text-left transition-colors duration-150 hover:bg-opacity-80"
              style={{
                backgroundColor: !value ? "var(--accent-primary)" : "transparent",
                color: !value ? "white" : "var(--text-primary)",
              }}
              onMouseEnter={(e) => {
                if (value) {
                  e.currentTarget.style.backgroundColor = "var(--bg-secondary)";
                }
              }}
              onMouseLeave={(e) => {
                if (value) {
                  e.currentTarget.style.backgroundColor = "transparent";
                }
              }}
              role="option"
              aria-selected={!value}
            >
              <span className="font-[family-name:var(--font-stetica-regular)]">
                {placeholder || "Все"}
              </span>
            </button>
            {options.map((option) => {
              const isSelected = String(option.value) === String(value);
              return (
                <button
                  key={String(option.value)}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className="w-full px-4 py-2 cursor-pointer text-left transition-colors duration-150 hover:bg-opacity-80"
                  style={{
                    backgroundColor: isSelected ? "var(--accent-primary)" : "transparent",
                    color: isSelected ? "white" : "var(--text-primary)",
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor = "var(--bg-secondary)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }
                  }}
                  role="option"
                  aria-selected={isSelected}
                >
                  <span className="font-[family-name:var(--font-stetica-regular)]">
                    {option.label}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
});
