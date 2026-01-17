"use client";

import Image from "next/image";
import FiltersPanel from "@/app/components/Filter";
import { CategoryList } from "@/app/components/CategoryList";
import { Suspense, useMemo, useRef, useEffect } from "react";
import { VirtualizedCardList } from "@/app/components/VirtualizedCardList";
import { useAppDispatch, useAppSelector } from "@/app/shared/redux/hooks";
import { useFiltersFromUrl } from "@/app/shared/hooks/useFiltersFromUrl";
import { resetPagination } from "@/app/shared/redux/slices/cards";
import { ICardFilters } from "@/app/types";

/**
 * Сравнивает два объекта фильтров на равенство
 */
function areFiltersEqual(filters1: ICardFilters, filters2: ICardFilters): boolean {
  const keys1 = Object.keys(filters1).sort();
  const keys2 = Object.keys(filters2).sort();
  
  if (keys1.length !== keys2.length) return false;
  
  for (const key of keys1) {
    if (filters1[key as keyof ICardFilters] !== filters2[key as keyof ICardFilters]) {
      return false;
    }
  }
  
  return true;
}

function HomeContent() {
  const dispatch = useAppDispatch();
  const { error } = useAppSelector((state) => state.cards);
  const { filters, updateFilters } = useFiltersFromUrl();
  
  const { q, ...cardFilters } = filters as ICardFilters & { q?: string };
  const prevFiltersRef = useRef<ICardFilters & { q?: string }>(filters as ICardFilters & { q?: string });
  
  const filtersString = useMemo(() => {
    return JSON.stringify(filters);
  }, [
    filters
  ]);
  
  useEffect(() => {
    // Сбрасываем пагинацию только если фильтры действительно изменились
    const filtersWithoutQ = { ...filters } as ICardFilters & { q?: string };
    delete filtersWithoutQ.q;
    const prevFiltersWithoutQ = { ...prevFiltersRef.current } as ICardFilters & { q?: string };
    delete prevFiltersWithoutQ.q;
    
    if (!areFiltersEqual(filtersWithoutQ as ICardFilters, prevFiltersWithoutQ as ICardFilters) || 
        (filters as ICardFilters & { q?: string }).q !== prevFiltersRef.current.q) {
      prevFiltersRef.current = filters as ICardFilters & { q?: string };
      dispatch(resetPagination());
    }
  }, [dispatch, filtersString, filters]);

  const handleCategoryChange = (category: string | undefined) => {
    updateFilters({
      ...filters,
      category: category as "flat" | "new_building" | undefined,
    });
  };

  return (
    <>
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center flex-1 min-w-0">
          <CategoryList
            currentFilters={filters}
            onCategoryChange={handleCategoryChange}
          />
        </div>
        <div className="flex-shrink-0">
          <FiltersPanel
            onApplyFilters={updateFilters}
            currentFilters={filters}
          />
        </div>
      </div>

      {error && (
        <div className="text-center py-4 px-6 rounded-lg">
          {error === "Network Error" ? (
            <div className="flex flex-col items-center">
              <Image
                src="/Network-error.png"
                alt="Network Error"
                width={200}
                height={200}
              />
              <h1 className="text-lg sm:text-xl font-[family-name:var(--font-stetica-bold)] mt-3">
                Неполадки с интернетом
              </h1>
              <p className="text-sm sm:text-base font-[family-name:var(--font-stetica-regular)] mt-2 opacity-60">
                Проверьте соединение с сетью и обновите страницу
              </p>
              <button
                onClick={() => window.location.reload()}
                className="cursor-pointer text-base sm:text-lg font-[family-name:var(--font-stetica-bold)] mt-5 px-15 py-2 rounded-full bg-[var(--accent-primary)] text-white transition-all hover:opacity-90"
              >
                Обновить
              </button>
            </div>
          ) : (
            `Ошибка: ${error}`
          )}
        </div>
      )}

      <VirtualizedCardList filters={cardFilters} query={q} />
    </>
  );
}

export default function Home() {
  return (
    <div
      className="flex flex-col justify-start content-center items-center font-[family-name:var(--font-stetica-regular)]"
      style={{
        backgroundColor: "var(--bg-primary)",
        transition: "background-color 0.3s ease",
        // minHeight: "calc(100vh - 80px)",
      }}
    >
      <div className="w-full max-w-[1300px] flex flex-col content-center gap-y-6 sm:gap-y-[25px] px-4 sm:px-6 lg:px-8 pt-2 pb-6 flex-grow">
        <Suspense
          fallback={
            <div
              className="text-center py-10"
              style={{ color: "var(--text-secondary)" }}
            >
              Загрузка...
            </div>
          }
        >
          <HomeContent />
        </Suspense>
      </div>
    </div>
  );
}
