"use client";

import { ICard } from "@/app/types/models";
import { AsidePanel } from "./lib/AsidePanel";
import { Tabs } from "@/app/card/[id]/lib/Tabs";
import { useEffect, useState, useRef } from "react";
import { ImageCarousel } from "./lib/ImageCarousel";
import { CardItemPreview } from "@/app/components/CardItemPreview";
import { FavoriteButton } from "@/app/card/[id]/lib/FavoriteButton";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { CardDetailSkeleton } from "@/app/components/CardDetailSkeleton";
import { useAppDispatch, useAppSelector } from "@/app/shared/redux/hooks";
import { LocationAccordion } from "@/app/card/[id]/lib/LocationAccordion";
import { PlanningAccordion } from "@/app/card/[id]/lib/PlanningAccordion";
import { DocumentsAccordion } from "@/app/card/[id]/lib/DocumentsAccordion";
import { fetchCardById, toggleFavorite } from "@/app/shared/redux/slices/cards";
import { DescriptionAccordion } from "@/app/card/[id]/lib/DescriptionAccordion";
import { ReviewsAccordion } from "@/app/card/[id]/lib/ReviewsAccordion";
import { CharacteristicsAccordion } from "@/app/card/[id]/lib/CharacteristicsAccordion";
import {
  BackButton,
  LocationIcon,
  RatingAndQuestionsBlock,
} from "@/app/card/[id]/lib/components";
import {
  formatPrice,
  translateCategory,
  translateCity,
  translateElevator,
  translateHouseType,
  translateParking,
} from "@/app/card/[id]/lib";

export default function CardDetailPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { currentCard, loading, error } = useAppSelector(
    (state) => state.cards
  );

  useEffect(() => {
    const id = Number(params.id);
    if (id) {
      dispatch(fetchCardById(id));
    }
  }, [params.id, dispatch]);

  if (loading) {
    return <CardDetailSkeleton />;
  }

  if (error) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-4"
        style={{ backgroundColor: "var(--bg-primary)" }}
      >
        <p className="text-xl text-red-600">{error}</p>
        <button
          onClick={() => router.push("/")}
          className="px-6 py-2 rounded-lg transition-colors cursor-pointer"
          style={{ backgroundColor: "var(--accent-primary)", color: "white" }}
        >
          Вернуться на главную
        </button>
      </div>
    );
  }

  if (!currentCard) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "var(--bg-primary)" }}
      >
        <p className="text-xl" style={{ color: "var(--text-secondary)" }}>
          Карточка не найдена
        </p>
      </div>
    );
  }

  const formattedPrice = formatPrice(currentCard.price);
  const recommendations =
    currentCard.list_curations || currentCard.recommendations || [];

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-[1300px] mx-auto">
        <BackButton onClick={() => router.back()} />
      </div>
      <div className="max-w-[1300px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              transition: "background-color 0.3s ease",
            }}
          >
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 pb-5 lg:pb-5">
              <div>
                <h1
                  className="text-2xl sm:text-3xl lg:text-4xl font-[family-name:var(--font-stetica-bold)]"
                  style={{
                    color: "var(--text-primary)",
                    transition: "color 0.3s ease",
                  }}
                >
                  {currentCard.title}
                </h1>
                <div
                  className="flex items-center gap-2 mt-1 font-[family-name:var(--font-stetica-regular)]"
                  style={{
                    color: "var(--text-secondary)",
                    transition: "color 0.3s ease",
                  }}
                >
                  <LocationIcon />
                  <p className="text-sm sm:text-base lg:text-lg">{currentCard.address}</p>
                </div>
              </div>
            </div>
            <ImageCarousel
              images={currentCard.images}
              videos={currentCard.videos}
              title={currentCard.title}
            />
            <CardBottomSection card={currentCard} />
          </div>
        </div>
        <AsidePanel card={currentCard} formattedPrice={formattedPrice} />
      </div>
      {recommendations.length > 0 && (
        <div className="max-w-[1300px] mx-auto mt-8">
          <h2
            className="text-xl sm:text-2xl font-[family-name:var(--font-stetica-bold)] mb-6"
            style={{ color: "var(--text-primary)" }}
          >
            Подборка для вас
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 lg:gap-[30px] w-full">
            {recommendations.map((item) => (
              <CardItemPreview key={item.id} card={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function CardBottomSection({ card }: { card: ICard }) {
  const dispatch = useAppDispatch();
  const { isAuth } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabFromUrl = searchParams.get("tab");
  const [tab, setTab] = useState(tabFromUrl || "characteristics");
  const tabsRef = useRef<HTMLDivElement>(null);
  const questions = card.questions || [];
  const left = [
    { label: "Город", value: translateCity(card.city) },
    {
      label: "Общая площадь",
      value: card.area ? `${card.area} м²` : "Не указано",
    },
    { label: "Тип дома", value: translateHouseType(card.house_type) },
    { label: "Категория", value: translateCategory(card.category) },
    { label: "Количество комнат", value: card.rooms ?? "Не указано" },
    { label: "Этажей в доме", value: card.floors_total ?? "Не указано" },
    {
      label: "Высота потолков",
      value: card.ceiling_height ? `${card.ceiling_height} м` : "Не указано",
    },
  ];
  const right = [
    { label: "Лифт", value: translateElevator(card.elevator) },
    { label: "Парковка", value: translateParking(card.parking) },
    { label: "Ремонт", value: card.renovation ?? "Не указано" },
    {
      label: "Балкон или лоджия",
      value: card.balcony ? "Балкон" : "Нет",
    },
  ];

  const documents = card.documents || [];
  const description = card.description;
  const { latitude, longitude, address } = card;
  const [isFavorite, setIsFavorite] = useState(Boolean(card.is_favorite));

  useEffect(() => {
    if (tabFromUrl && tabFromUrl !== tab) {
      setTab(tabFromUrl);
      if (tabsRef.current) {
        tabsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }

    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabFromUrl]);

  const handleTabChange = (newTab: string) => {
    setTab(newTab);
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", newTab);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handleToggleFavorite = async () => {
    if (!isAuth) {
      alert("Войдите в систему, чтобы добавить в избранное");
      return;
    }

    try {
      await dispatch(
        toggleFavorite({ id: card.id, is_favorite: isFavorite })
      ).unwrap();
      setIsFavorite((prev) => !prev);
    } catch (error) {
      console.error("Ошибка при добавлении в избранное:", error);
      alert("Не удалось изменить статус избранного");
    }
  };

  return (
    <div className="pb-2 pt-4">
      <RatingAndQuestionsBlock
        rating={card.rating}
        count={card.rating_count}
        onNavigateToReviews={() => handleTabChange("reviews")}
        onNavigateToQuestions={() => handleTabChange("questions")}
      />
      <div ref={tabsRef}>
        <Tabs
          active={tab}
          onChange={handleTabChange}
          tabs={[
            { key: "characteristics", label: "Характеристики" },
            { key: "documents", label: "Документы" },
            { key: "planning", label: "Планирование" },
            { key: "reviews", label: "Отзывы" },
            { key: "questions", label: "Вопросы" },
          ]}
        />
      </div>
      {tab === "characteristics" && (
        <CharacteristicsAccordion left={left} right={right} />
      )}
      {tab === "documents" && <DocumentsAccordion documents={documents} />}
      {tab === "planning" && <PlanningAccordion />}
      {tab === "reviews" && <ReviewsAccordion />}
      {/* {tab === "reviews" && (
        <div
          className="mb-4 rounded-lg p-6 text-center"
          style={{
            backgroundColor: "rgba(var(--accent-secondary-rgb))",
            color: "var(--text-secondary)",
          }}
        >
          Отзывы пока отсутствуют
        </div>
      )} */}
      {/* {tab === "reviews" && <ReviewsAccordion reviews={card.reviews} />} */}
      {tab === "questions" && (
        <div
          className="mb-4 rounded-lg p-6"
          style={{
            backgroundColor: "rgba(var(--accent-secondary-rgb))",
          }}
        >
          {questions && questions.length > 0 ? (
            <ul className="space-y-4">
              {questions.map((question, i) => (
                <li
                  key={i}
                  className="p-4 rounded-lg"
                  style={{
                    backgroundColor: "rgba(var(--bg-secondary-rgb), 0.3)",
                  }}
                >
                  <p
                    className="text-base font-[family-name:var(--font-stetica-medium)]"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {question}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p
              className="text-center py-4 text-base"
              style={{ color: "var(--text-secondary)" }}
            >
              Вопросы пока отсутствуют
            </p>
          )}
        </div>
      )}
      <LocationAccordion
        latitude={latitude}
        longitude={longitude}
        address={address}
      />
      <DescriptionAccordion description={description} />
      <div className="mt-6">
        <FavoriteButton
          isFavorite={isFavorite}
          onToggle={handleToggleFavorite}
        />
      </div>
    </div>
  );
}
