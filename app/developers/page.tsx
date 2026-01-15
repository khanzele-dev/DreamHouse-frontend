"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/shared/redux/hooks";
import { fetchDevelopers } from "@/app/shared/redux/slices/developers";

export default function DevelopersPage() {
  const dispatch = useAppDispatch();
  const { developers, loading, error } = useAppSelector((state) => state.developers);

  useEffect(() => {
    dispatch(fetchDevelopers());
  }, [dispatch]);

  return (
    <div
      className="flex flex-col justify-start content-center items-center font-[family-name:var(--font-stetica-regular)]"
      style={{
        backgroundColor: "var(--bg-primary)",
        transition: "background-color 0.3s ease",
      }}
    >
      <div className="w-full max-w-[1300px] flex flex-col content-center gap-y-6 sm:gap-y-[25px] px-4 sm:px-6 lg:px-8 pt-6 pb-6 flex-grow">
        <h1
          className="text-3xl sm:text-4xl lg:text-5xl font-[family-name:var(--font-stetica-bold)]"
          style={{
            color: "var(--text-primary)",
            transition: "color 0.3s ease",
          }}
        >
          Застройщики
        </h1>

        {loading && (
          <div className="text-center py-10 text-[#999999]">
            Загрузка застройщиков...
          </div>
        )}

        {error && (
          <div className="text-center py-10 text-[#FF4444]">{error}</div>
        )}

        {!loading && !error && developers.length === 0 && (
          <div className="text-center py-10 text-[#999999]">
            Застройщики не найдены
          </div>
        )}
      </div>
    </div>
  );
}
