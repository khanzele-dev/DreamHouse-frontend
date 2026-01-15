"use client";

import { FilterButton } from "@/app/components/Filter/ui/FilterButton";
import { AIModal } from "@/app/components/AIModal";
import { ICardFilters } from "@/app/types";
import { useCallback, useEffect, useState, lazy, Suspense, useMemo } from "react";
import { useAppSelector } from "@/app/shared/redux/hooks";

const FiltersModal = lazy(() => import("@/app/components/Filter/ui/FiltersModal").then(m => ({ default: m.FiltersModal })));
const ModalShell = lazy(() => import("@/app/components/Filter/ui/ModalShell").then(m => ({ default: m.ModalShell })));

interface FiltersPanelProps {
  onApplyFilters: (filters: ICardFilters) => void;
  currentFilters?: ICardFilters;
}

export default function FiltersPanel({
  onApplyFilters,
  currentFilters = {},
}: FiltersPanelProps) {
  const { isAuth } = useAppSelector((state) => state.auth);
  const [isOpen, setIsOpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);
  
  // Мемоизируем currentFilters для стабильности
  const currentFiltersString = useMemo(() => JSON.stringify(currentFilters), [currentFilters]);
  const [filters, setFilters] = useState<ICardFilters>(currentFilters);

  useEffect(() => {
    setFilters(currentFilters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentFiltersString]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleApply = useCallback(
    (f: ICardFilters) => {
      setFilters(f);
      onApplyFilters(f);
      setIsOpen(false);
    },
    [onApplyFilters]
  );

  const handleAIChat = useCallback(() => {
    if (!isAuth) {
      alert('Для использования ИИ-помощника необходимо войти в систему');
      return;
    }
    setIsAIOpen(true);
  }, [isAuth]);

  const handleAIClose = useCallback(() => {
    setIsAIOpen(false);
  }, []);

  return (
    <div className="flex items-center gap-x-2">
      <span 
        className="text-sm font-[family-name:var(--font-stetica-regular)] hidden sm:block animate-fade-in"
        style={{ 
          color: "var(--text-secondary)",
          animation: "fadeIn 0.5s ease-in"
        }}
      >
        Попробуйте спросить у ИИ ✨
      </span>
      <button
        type="button"
        onClick={handleAIChat}
        className="rounded-full p-[10.5px] bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center cursor-pointer transition-all duration-300 hover:opacity-90 shadow-lg group relative"
        aria-label="Открыть чат с ИИ"
        title="Чат с ИИ помощником"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10"
        >
          <path
            d="M21 6C21 4.9 20.1 4 19 4H5C3.9 4 3 4.9 3 6V15C3 16.1 3.9 17 5 17H8V21L13 17H19C20.1 17 21 16.1 21 15V6Z"
            fill="white"
          />
          <path
            d="M8 10C8 10.55 8.45 11 9 11C9.55 11 10 10.55 10 10C10 9.45 9.55 9 9 9C8.45 9 8 9.45 8 10Z"
            fill="#3366CC"
          />
          <path
            d="M11 10C11 10.55 11.45 11 12 11C12.55 11 13 10.55 13 10C13 9.45 12.55 9 12 9C11.45 9 11 9.45 11 10Z"
            fill="#3366CC"
          />
          <path
            d="M14 10C14 10.55 14.45 11 15 11C15.55 11 16 10.55 16 10C16 9.45 15.55 9 15 9C14.45 9 14 9.45 14 10Z"
            fill="#3366CC"
          />
        </svg>
      </button>
      <FilterButton onClick={useCallback(() => setIsOpen(true), [])} />
      {isOpen && (
        <Suspense fallback={null}>
          <ModalShell onClose={handleClose}>
            <FiltersModal
              initial={filters}
              onClose={handleClose}
              onApply={handleApply}
            />
          </ModalShell>
        </Suspense>
      )}
      {isAIOpen && <AIModal onClose={handleAIClose} />}
    </div>
  );
}