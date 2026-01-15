"use client";

import { useEffect, useRef, useState } from "react";
import { ICardFilters } from "@/app/types";

interface CategoryItem {
  value: string;
  label: string;
  disabled?: boolean;
}

interface CategoryListProps {
  currentFilters?: ICardFilters;
  onCategoryChange: (category: string | undefined) => void;
}

const categories: CategoryItem[] = [
  { value: "flat", label: "Квартира" },
  { value: "new_building", label: "Новостройка" },
  { value: "secondary", label: "Вторичка", disabled: true },
  { value: "land", label: "Земельный участок", disabled: true },
  { value: "commercial", label: "Коммерческая недвижимость", disabled: true },
];

export const CategoryList = ({
  currentFilters,
  onCategoryChange,
}: CategoryListProps) => {
  const selectedCategory = currentFilters?.category;

  const containerRef = useRef<HTMLDivElement | null>(null);

  const updateFades = () => {
    const el = containerRef.current;
    if (!el) return;
    // Fade indicators can be added here if needed in the future
  };

  useEffect(() => {
    updateFades();
    window.addEventListener("resize", updateFades);
    return () => window.removeEventListener("resize", updateFades);
  }, []);

  const handleCategoryClick = (
    categoryValue: string,
    disabled?: boolean
  ) => {
    if (disabled) return;

    if (selectedCategory === categoryValue) {
      onCategoryChange(undefined);
    } else {
      onCategoryChange(categoryValue);
    }
  };

  return (
    <nav aria-label="Категории недвижимости" className="w-full">
      <div className="relative w-full overflow-hidden">
        <div
          ref={containerRef}
          onScroll={updateFades}
          className="flex gap-2 overflow-x-auto px-1 pt-1 scrollbar-thin whitespace-nowrap tabs-scroll"
          style={{
            scrollbarColor: "var(--border-color) transparent",
          }}
        >
          {categories.map((item, index) => {
            const isActive = item.value === selectedCategory;
            const isDisabled = item.disabled ?? false;

            return (
              <button
                key={index}
                type="button"
                onClick={() =>
                  handleCategoryClick(item.value, isDisabled)
                }
                disabled={isDisabled}
                aria-current={isActive ? "page" : undefined}
                aria-disabled={isDisabled}
                className="flex-shrink-0 inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-1.5 text-sm md:text-base transition-all duration-200 cursor-pointer"
                style={{
                  border: isActive
                    ? "1px solid var(--accent-primary)"
                    : "1px solid var(--border-color)",
                  opacity: isDisabled ? 0.5 : 1,
                }}
                onMouseEnter={(e) => {
                  if (!isActive && !isDisabled) {
                    e.currentTarget.style.borderColor =
                      "var(--accent-primary)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive && !isDisabled) {
                    e.currentTarget.style.borderColor =
                      "var(--border-color)";
                  }
                }}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
