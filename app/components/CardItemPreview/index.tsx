"use client";

import Image from "next/image";
import Link from "next/link";
import { ICard } from "@/app/types/models";
import { useAppDispatch, useAppSelector } from "@/app/shared/redux/hooks";
import { toggleFavorite } from "@/app/shared/redux/slices/cards";
import { ReactElement } from "react";

interface CardItemPreviewProps {
  card: ICard;
}

export const CellComponent: React.FC<CardItemPreviewProps> = ({ card }) => {
  return <CardItemPreview card={card} />;
};

export function CardItemPreview({ card }: CardItemPreviewProps): ReactElement {
  const dispatch = useAppDispatch();
  const { isAuth } = useAppSelector((state) => state.auth);

  const formattedPrice = new Intl.NumberFormat("ru-RU").format(
    card.price_metr
  );
  const mainImage =
    card.images?.[0]?.image && card.images[0].image.trim() !== ""
      ? card.images[0].image
      : "/placeholder.jpg";

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuth) {
      alert("Войдите в систему, чтобы добавить в избранное");
      return;
    }
    dispatch(
      toggleFavorite({ id: card.id, is_favorite: card.is_favorite || false })
    );
  };

  return (
    <Link href={`/card/${card.id}`} className="block">
      <div
        className="font-[family-name:var(--font-stetica-bold)] w-full overflow-hidden transition-shadow duration-300"
      >
        <div className="relative w-full h-[260px]">
          <Image
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 490px"
            className="object-cover rounded-xl"
            src={mainImage}
            alt={card.title}
            priority={false}
          />
          <button
            className="absolute top-3 right-3 p-2 rounded-full bg-black/30 hover:bg-black/50 transition-all duration-200 backdrop-blur-sm z-10"
            onClick={handleFavoriteClick}
            aria-label={
              card.is_favorite
                ? "Удалить из избранного"
                : "Добавить в избранное"
            }
          >
            <svg
              className="w-6 h-6"
              viewBox="0 0 30 26"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 4.1201L14.2465 4.84248C14.3441 4.94332 14.4612 5.02353 14.5906 5.07831C14.7201 5.1331 14.8593 5.16133 15 5.16133C15.1407 5.16133 15.2799 5.1331 15.4094 5.07831C15.5388 5.02353 15.6559 4.94332 15.7535 4.84248L15 4.1201ZM11.4084 21.9324C9.29302 20.2723 6.98093 18.6511 5.14605 16.5951C3.34884 14.578 2.09302 12.2261 2.09302 9.17262H0C0 12.8762 1.54884 15.7019 3.58186 17.9788C5.57721 20.2154 8.12232 22.0074 10.1121 23.5689L11.4084 21.9324ZM2.09302 9.17262C2.09302 6.18584 3.78837 3.67972 6.10326 2.62532C8.35256 1.60148 11.3749 1.87237 14.2465 4.84248L15.7535 3.3991C12.3488 -0.125297 8.39163 -0.707372 5.23256 0.73045C2.14326 2.13771 0 5.40511 0 9.17262H2.09302ZM10.1121 23.5689C10.8279 24.1301 11.5953 24.7275 12.3726 25.1804C13.1498 25.6333 14.0372 26 15 26V23.9162C14.5674 23.9162 14.0595 23.7495 13.4288 23.3814C12.7967 23.0146 12.1423 22.5089 11.4084 21.9324L10.1121 23.5689ZM19.8879 23.5689C21.8777 22.0061 24.4228 20.2168 26.4181 17.9788C28.4512 15.7005 30 12.8762 30 9.17262H27.907C27.907 12.2261 26.6512 14.578 24.854 16.5951C23.0191 18.6511 20.707 20.2723 18.5916 21.9324L19.8879 23.5689ZM30 9.17262C30 5.40511 27.8581 2.13771 24.7674 0.73045C21.6084 -0.707372 17.654 -0.125297 14.2465 3.39771L15.7535 4.84248C18.6251 1.87376 21.6474 1.60148 23.8967 2.62532C26.2116 3.67972 27.907 6.18445 27.907 9.17262H30ZM18.5916 21.9324C17.8577 22.5089 17.2033 23.0146 16.5712 23.3814C15.9391 23.7481 15.4326 23.9162 15 23.9162V26C15.9628 26 16.8502 25.6319 17.6274 25.1804C18.406 24.7275 19.1721 24.1301 19.8879 23.5689L18.5916 21.9324Z"
                fill={card.is_favorite ? "#FF4444" : "white"}
                style={{ transition: "fill 0.3s ease" }}
              />
            </svg>
          </button>
        </div>
        <div className="pt-4">
          <div className="flex justify-between items-start mb-1">
            <h3
              className="font-[family-name:var(--font-stetica-bold)] text-xl line-clamp-1 flex-1 mr-3"
              style={{
                color: "var(--text-primary)",
                transition: "color 0.3s ease",
              }}
            >
              {card.title}
            </h3>
            <div className="text-right flex-shrink-0">
              <p
                className="text-xl whitespace-nowrap"
                style={{
                  color: "var(--accent-primary)",
                  transition: "color 0.3s ease",
                }}
              >
                {formattedPrice} ₽{" "}
                <span
                  style={{ color: "var(--text-secondary)" }}
                  className="text-base"
                >
                  / 1 м²
                </span>
              </p>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 21 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10.4609 0L12.9306 7.60081H20.9226L14.4569 12.2984L16.9266 19.8992L10.4609 15.2016L3.9953 19.8992L6.46495 12.2984L-0.000683784 7.60081H7.99128L10.4609 0Z"
                    fill="#F5BD68"
                  />
                </svg>

                <span
                  className="text-lg font-[family-name:var(--font-stetica-medium)]"
                  style={{
                    color: "#F5BD68",
                    transition: "color 0.3s ease",
                  }}
                >
                  {card.rating}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{
                    color: "var(--text-secondary)",
                    opacity: 0.6,
                    transition: "color 0.3s ease",
                  }}
                >
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
                <span
                  className="text-sm line-clamp-1 font-[family-name:var(--font-stetica-medium)]"
                  style={{
                    color: "var(--text-secondary)",
                    transition: "color 0.3s ease",
                  }}
                >
                  {card.address}
                </span>
              </div>
            </div>
            <span
              className="text-sm ml-2 flex-shrink-0 font-[family-name:var(--font-stetica-medium)]"
              style={{
                color: "var(--text-secondary)",
                transition: "color 0.3s ease",
              }}
            >
              Апарт-комплекс
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
