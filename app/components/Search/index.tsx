"use client";

import Link from "next/link";
import debounce from "lodash.debounce";
import { useState, useRef, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/shared/redux/hooks";
import {
  searchCards,
  clearSearchResults,
} from "@/app/shared/redux/slices/cards";

export const Search = () => {
  const searchRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const { searchResults, searchLoading } = useAppSelector(
    (state) => state.cards
  );

  const [query, setQuery] = useState("");
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const debouncedSearch = useRef(
    debounce((q: string) => {
      if (!q || q.trim().length === 0) {
        dispatch(clearSearchResults());
        return;
      }
      dispatch(searchCards(q));
    }, 800)
  );

  useEffect(() => {
    debouncedSearch.current(query);
  }, [query, dispatch]);

  useEffect(() => {
    const cancel = debouncedSearch.current.cancel;
    return () => {
      if (cancel) cancel();
    };
  }, []);

  return (
    <div className="w-full lg:flex-1 flex flex-row items-center justify-center">
      <div
        className="relative w-full max-w-[450px] min-w-[200px]"
        ref={searchRef}
      >
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowResults(true);
          }}
          placeholder="Искать квартиры в Dream House"
          className="w-full px-4 py-[9px] rounded-l-md focus:outline-none text-sm sm:text-base"
          style={{
            backgroundColor: "transparent",
            color: "var(--text-primary)",
            border: "1px solid var(--border-color)",
            borderRight: 0,
            transition:
              "background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease",
            paddingRight: query ? "40px" : "16px",
          }}
        />
        
        {query && (
          <button
            onClick={() => {
              setQuery("");
              dispatch(clearSearchResults());
              setShowResults(false);
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
            aria-label="Очистить поиск"
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ color: "var(--text-secondary)" }}
              />
            </svg>
          </button>
        )}

        {showResults && query.trim().length > 0 && (
          <div
            className="absolute left-0 right-0 mt-2 max-h-64 overflow-auto rounded-md shadow-lg z-50"
            style={{
              backgroundColor: "var(--card-bg)",
              border: "1px solid var(--border-color)",
            }}
          >
            {searchLoading && (
              <div
                className="px-4 py-2 text-sm"
                style={{ color: "var(--text-secondary)" }}
              >
                Поиск...
              </div>
            )}
            {!searchLoading &&
              Array.isArray(searchResults) &&
              searchResults.length === 0 && (
                <div
                  className="px-4 py-2 text-sm"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Квартир не найдено по вашему запросу
                </div>
              )}
            {!searchLoading &&
              Array.isArray(searchResults) &&
              searchResults.map((item) => (
                <Link
                  key={item.id}
                  href={`/card/${item.id}`}
                  className="block px-4 py-2 text-sm transition-colors cursor-pointer"
                  style={{
                    color: "var(--text-primary)",
                    backgroundColor: "transparent",
                    transition: "background-color 0.2s ease",
                  }}
                  onClick={() => setShowResults(false)}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "var(--bg-secondary)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
                >
                  <div className="font-medium">{item.title}</div>
                  {item.address && (
                    <div
                      className="text-xs flex items-center gap-1 mt-1"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      <svg
                        className="w-3 h-3 flex-shrink-0"
                        viewBox="0 0 12 14"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M6 0C2.68629 0 0 2.68629 0 6C0 9.31371 6 14 6 14C6 14 12 9.31371 12 6C12 2.68629 9.31371 0 6 0ZM6 8C4.89543 8 4 7.10457 4 6C4 4.89543 4.89543 4 6 4C7.10457 4 8 4.89543 8 6C8 7.10457 7.10457 8 6 8Z"
                          fill="var(--text-secondary)"
                          style={{ transition: "fill 0.3s ease" }}
                        />
                      </svg>
                      {item.address}
                    </div>
                  )}
                </Link>
              ))}
          </div>
        )}
      </div>
      <button
        className="flex items-center justify-center px-4 py-[11px] sm:py-[13px] rounded-r-md outline-none cursor-pointer"
        style={{
          backgroundColor: "var(--accent-primary)",
          color: "white",
          border: "1px solid var(--border-color)",
          borderLeft: 0,
          transition:
            "background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.backgroundColor = "var(--accent-secondary)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.backgroundColor = "var(--accent-primary)")
        }
      >
        <svg
          className="w-[18px] h-[18px]"
          viewBox="0 0 17 17"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M16 16L12.3809 12.3809M12.3809 12.3809C12.9999 11.7618 13.491 11.0269 13.826 10.218C14.1611 9.40917 14.3335 8.54225 14.3335 7.66676C14.3335 6.79127 14.1611 5.92435 13.826 5.1155C13.491 4.30665 12.9999 3.57172 12.3809 2.95265C11.7618 2.33358 11.0269 1.84251 10.218 1.50748C9.40917 1.17244 8.54225 1 7.66676 1C6.79127 1 5.92435 1.17244 5.1155 1.50748C4.30665 1.84251 3.57172 2.33358 2.95265 2.95265C1.70239 4.20291 1 5.89863 1 7.66676C1 9.4349 1.70239 11.1306 2.95265 12.3809C4.20291 13.6311 5.89863 14.3335 7.66676 14.3335C9.4349 14.3335 11.1306 13.6311 12.3809 12.3809Z"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
};
