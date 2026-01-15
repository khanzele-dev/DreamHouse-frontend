"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/app/shared/redux/hooks";
import {
  fetchDeveloperById,
  subscribeToDeveloper,
  unsubscribeFromDeveloper,
  clearCurrentDeveloper,
} from "@/app/shared/redux/slices/developers";
import Image from "next/image";
import { CardItemPreview } from "@/app/components/CardItemPreview";
import { CardSkeleton } from "@/app/components/CardSkeleton";

export default function DeveloperDetailPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { currentDeveloper, loading, error } = useAppSelector(
    (state) => state.developers
  );
  const { isAuth } = useAppSelector((state) => state.auth);
  const [isLoadingSubscription, setIsLoadingSubscription] = useState(false);

  const developerId = Number(params.id);

  useEffect(() => {
    if (developerId) {
      dispatch(fetchDeveloperById(developerId));
    }

    return () => {
      dispatch(clearCurrentDeveloper());
    };
  }, [dispatch, developerId]);

  const handleSubscriptionToggle = async () => {
    if (!isAuth) {
      alert("Необходима авторизация");
      router.push("/login");
      return;
    }

    setIsLoadingSubscription(true);
    try {
      if (currentDeveloper) {
        if (currentDeveloper.is_subscribed) {
          await dispatch(unsubscribeFromDeveloper(currentDeveloper.id));
        } else {
          await dispatch(subscribeToDeveloper(currentDeveloper.id));
        }
      }
    } catch (error) {
      console.error("Ошибка при изменении подписки:", error);
      alert("Не удалось изменить подписку. Попробуйте позже.");
    } finally {
      setIsLoadingSubscription(false);
    }
  };

  if (loading) {
    return (
      <div
        className="flex flex-col justify-start content-center items-center font-[family-name:var(--font-stetica-regular)]"
        style={{
          backgroundColor: "var(--bg-primary)",
          transition: "background-color 0.3s ease",
        }}
      >
        <div className="w-full max-w-[1300px] flex flex-col content-center gap-y-6 sm:gap-y-[25px] px-4 sm:px-6 lg:px-8 pt-6 pb-6 flex-grow">
          <div
            className="rounded-2xl p-6 sm:p-8 animate-pulse"
            style={{
              backgroundColor: "var(--card-bg)",
              border: "1px solid var(--border-color)",
            }}
          >
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div
                className="w-32 h-32 rounded-full flex-shrink-0"
                style={{
                  backgroundColor: "var(--bg-secondary)",
                }}
              />
              <div className="flex-1 flex flex-col gap-4 w-full">
                <div
                  className="h-10 w-3/4 rounded"
                  style={{ backgroundColor: "var(--bg-secondary)" }}
                />
                <div
                  className="h-6 w-1/2 rounded"
                  style={{ backgroundColor: "var(--bg-secondary)" }}
                />
                <div
                  className="h-12 w-40 rounded-lg"
                  style={{ backgroundColor: "var(--bg-secondary)" }}
                />
              </div>
            </div>
          </div>
          <div
            className="h-8 w-64 rounded"
            style={{ backgroundColor: "var(--bg-secondary)" }}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 lg:gap-[30px] w-full">
            {[...Array(4)].map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !currentDeveloper) {
    return (
      <div
        className="flex flex-col justify-center items-center"
        style={{ backgroundColor: "var(--bg-primary)" }}
      >
        <div className="text-center py-10 text-[#FF4444]">
          {error || "Застройщик не найден"}
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col justify-start content-center items-center font-[family-name:var(--font-stetica-regular)]"
      style={{
        backgroundColor: "var(--bg-primary)",
        transition: "background-color 0.3s ease",
      }}
    >
      <div className="w-full max-w-[1300px] flex flex-col content-center gap-y-6 sm:gap-y-[25px] px-4 sm:px-6 lg:px-8 pt-6 pb-6 flex-grow">
        <div className="rounded-2xl py-6 px-4 sm:py-8 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div
              className="w-32 h-32 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0"
              style={{
                backgroundColor: "var(--bg-secondary)",
                border: "3px solid var(--accent-primary)",
              }}
            >
              {currentDeveloper.logo ? (
                <Image
                  src={currentDeveloper.logo}
                  alt={currentDeveloper.name}
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span
                  className="text-5xl font-[family-name:var(--font-stetica-bold)]"
                  style={{ color: "var(--accent-primary)" }}
                >
                  {currentDeveloper.name.charAt(0)}
                </span>
              )}
            </div>

            <div className="flex-1 flex flex-col gap-4 text-center sm:text-left">
              <h1
                className="text-3xl sm:text-4xl font-[family-name:var(--font-stetica-bold)]"
                style={{ color: "var(--text-primary)" }}
              >
                {currentDeveloper.name}
              </h1>

              <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z"
                      stroke="var(--text-secondary)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span style={{ color: "var(--text-secondary)" }}>
                    {currentDeveloper.cards.length}{" "}
                    {currentDeveloper.cards.length === 1 ? "объект" : "объекта"}
                  </span>
                </div>
              </div>

              <button
                onClick={handleSubscriptionToggle}
                disabled={isLoadingSubscription}
                className={`cursor-pointer max-w-[340px] sm:w-auto px-6 py-3 rounded-full transition-all duration-300 flex items-center justify-center gap-2 font-[family-name:var(--font-stetica-medium)] ${
                  isLoadingSubscription ? "opacity-60 cursor-not-allowed" : "hover:opacity-90 active:scale-[0.98]"
                }`}
                style={{
                  backgroundColor: currentDeveloper.is_subscribed ? "var(--bg-button)" : "var(--accent-primary)",
                  color: currentDeveloper.is_subscribed
                    ? "var(--text-secondary)"
                    : "var(--text-primary)",
                }}
              >
                {isLoadingSubscription ? (
                  <span>Загрузка...</span>
                ) : currentDeveloper.is_subscribed ? (
                  <>
                    <svg
                      className="w-5 h-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M20 6L9 17L4 12"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span>Вы подписаны</span>
                  </>
                ) : (
                  <span>Подписаться</span>
                )}
              </button>
            </div>
          </div>
        </div>

        <h2
          className="text-2xl sm:text-3xl font-[family-name:var(--font-stetica-medium)]"
          style={{ color: "var(--text-primary)" }}
        >
          Размещения профиля
        </h2>

        {currentDeveloper.cards && currentDeveloper.cards.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 lg:gap-[30px] w-full">
            {currentDeveloper.cards.map((card) => (
              <CardItemPreview key={card.id} card={card} />
            ))}
          </div>
        ) : (
          <div
            className="text-center py-20 rounded-2xl"
            style={{
              backgroundColor: "var(--card-bg)",
              color: "var(--text-secondary)",
            }}
          >
            <p className="text-lg">У этого застройщика пока нет объектов</p>
          </div>
        )}
      </div>
    </div>
  );
}
