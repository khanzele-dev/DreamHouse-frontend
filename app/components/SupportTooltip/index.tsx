"use client";

import { useState, useRef, useEffect } from "react";

interface SupportTooltipProps {
  children: React.ReactNode;
  className?: string;
  placement?: "top" | "bottom";
}

export const SupportTooltip = ({ children, className, placement = "bottom" }: SupportTooltipProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        tooltipRef.current &&
        triggerRef.current &&
        !tooltipRef.current.contains(event.target as Node) &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handlePhoneClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.location.href = "tel:926266";
  };

  return (
    <div className="relative" ref={triggerRef}>
      <div
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onClick={() => setIsOpen(!isOpen)}
        className={className}
      >
        {children}
      </div>
      {isOpen && (
        <div
          ref={tooltipRef}
          className={`absolute right-0 z-50 ${
            placement === "top" ? "bottom-full mb-2" : "top-full mt-2"
          }`}
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
          <div
            className="px-3 py-2 rounded-md text-xs font-[family-name:var(--font-stetica-regular)]"
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              color: "#fff",
            }}
          >
            <div className="mb-1 text-[12px] opacity-90">Техническая поддержка</div>
            <a
              href="tel:926266"
              onClick={handlePhoneClick}
              className="hover:opacity-80 transition-opacity whitespace-nowrap"
            >
              92-62-66
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
