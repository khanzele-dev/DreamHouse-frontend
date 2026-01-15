import Image from "next/image";
import { useState } from "react";
import { IReview } from "@/app/types/models";
import { MOCK_REVIEWS } from "./mockReviews";

interface ReviewsAccordionProps {
  reviews?: IReview[];
}

export function ReviewsAccordion({
  reviews = MOCK_REVIEWS,
}: ReviewsAccordionProps) {
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");
  const [visibleCount, setVisibleCount] = useState(5);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [votedReviews, setVotedReviews] = useState<
    Record<number, "helpful" | "not_helpful">
  >({});

  const sortedReviews = [...reviews].sort((a, b) => {
    const dateA = new Date(a.created_at).getTime();
    const dateB = new Date(b.created_at).getTime();
    return sortBy === "newest" ? dateB - dateA : dateA - dateB;
  });

  const visibleReviews = sortedReviews.slice(0, visibleCount);
  const hasMore = visibleCount < sortedReviews.length;

  const handleVote = (
    reviewId: number,
    voteType: "helpful" | "not_helpful"
  ) => {
    if (votedReviews[reviewId]) return;
    setVotedReviews((prev) => ({ ...prev, [reviewId]: voteType }));
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            width="16"
            height="16"
            viewBox="0 0 23 22"
            fill={star <= rating ? "#F5BD68" : "none"}
            stroke={star <= rating ? "none" : "var(--border-color)"}
            strokeWidth={star <= rating ? 0 : 1}
          >
            <path d="M11.4127 0L14.1068 8.2918H22.8253L15.7719 13.4164L18.4661 21.7082L11.4127 16.5836L4.35924 21.7082L7.0534 13.4164L-1.90735e-05 8.2918H8.71849L11.4127 0Z" />
          </svg>
        ))}
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Сегодня";
    if (diffDays === 1) return "Вчера";
    if (diffDays < 7) return `${diffDays} дн. назад`;

    return date.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <>
      <div
        className="overflow-hidden rounded-lg"
      >
        <div className="sm:px-6 pb-4 sm:pb-6 pt-2">
          {reviews.length === 0 ? (
            <p
              className="text-center py-4 text-sm sm:text-base"
              style={{ color: "var(--text-secondary)" }}
            >
              Отзывы пока отсутствуют
            </p>
          ) : (
            <>
              <div className="flex items-center justify-start mb-4">
                <svg
                  className="w-[24px] h-[24px] mr-1 flex-shrink-0 bg-[var(--accent-primary)] rounded-full p-[6px]"
                  width="10"
                  height="9"
                  viewBox="0 0 10 9"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0_2842_1879)">
                    <path
                      d="M9.99997 7.62013C9.99997 7.71409 9.96046 7.80421 9.89013 7.87065C9.81981 7.93709 9.72442 7.97442 9.62497 7.97442H7.07498C6.99145 8.26866 6.80752 8.52865 6.55169 8.71407C6.29586 8.8995 5.98242 9 5.65998 9C5.33754 9 5.0241 8.8995 4.76827 8.71407C4.51244 8.52865 4.32851 8.26866 4.24499 7.97442H0.374999C0.275543 7.97442 0.18016 7.93709 0.109835 7.87065C0.0395086 7.80421 0 7.71409 0 7.62013C0 7.52616 0.0395086 7.43605 0.109835 7.36961C0.18016 7.30316 0.275543 7.26584 0.374999 7.26584H4.24499C4.32851 6.9716 4.51244 6.71161 4.76827 6.52618C5.0241 6.34076 5.33754 6.24026 5.65998 6.24026C5.98242 6.24026 6.29586 6.34076 6.55169 6.52618C6.80752 6.71161 6.99145 6.9716 7.07498 7.26584H9.62497C9.72442 7.26584 9.81981 7.30316 9.89013 7.36961C9.96046 7.43605 9.99997 7.52616 9.99997 7.62013ZM9.99997 1.37987C9.99997 1.47384 9.96046 1.56395 9.89013 1.63039C9.81981 1.69684 9.72442 1.73416 9.62497 1.73416H8.39997C8.31645 2.0284 8.13251 2.28839 7.87668 2.47382C7.62085 2.65924 7.30742 2.75975 6.98498 2.75975C6.66253 2.75975 6.3491 2.65924 6.09327 2.47382C5.83744 2.28839 5.6535 2.0284 5.56998 1.73416H0.374999C0.325753 1.73416 0.27699 1.725 0.231493 1.7072C0.185996 1.68939 0.144656 1.66329 0.109835 1.63039C0.0750127 1.5975 0.0473905 1.55844 0.028545 1.51545C0.00969959 1.47247 0 1.4264 0 1.37987C0 1.33335 0.00969959 1.28728 0.028545 1.24429C0.0473905 1.20131 0.0750127 1.16225 0.109835 1.12935C0.144656 1.09645 0.185996 1.07035 0.231493 1.05255C0.27699 1.03475 0.325753 1.02558 0.374999 1.02558H5.56998C5.6535 0.731342 5.83744 0.471354 6.09327 0.285929C6.3491 0.100504 6.66253 0 6.98498 0C7.30742 0 7.62085 0.100504 7.87668 0.285929C8.13251 0.471354 8.31645 0.731342 8.39997 1.02558H9.62497C9.6744 1.02495 9.72346 1.03368 9.76927 1.05126C9.81507 1.06884 9.85667 1.09491 9.89163 1.12793C9.92659 1.16096 9.95418 1.20027 9.97279 1.24354C9.9914 1.28681 10.0006 1.33317 9.99997 1.37987ZM9.99997 4.49764C10.0006 4.54434 9.9914 4.5907 9.97279 4.63397C9.95418 4.67724 9.92659 4.71655 9.89163 4.74958C9.85667 4.7826 9.81507 4.80868 9.76927 4.82626C9.72346 4.84384 9.6744 4.85257 9.62497 4.85193H3.77499C3.69147 5.14617 3.50753 5.40616 3.2517 5.59158C2.99587 5.77701 2.68243 5.87751 2.35999 5.87751C2.03755 5.87751 1.72412 5.77701 1.46828 5.59158C1.21245 5.40616 1.02852 5.14617 0.944997 4.85193H0.374999C0.275543 4.85193 0.18016 4.8146 0.109835 4.74816C0.0395086 4.68172 0 4.5916 0 4.49764C0 4.40367 0.0395086 4.31356 0.109835 4.24712C0.18016 4.18067 0.275543 4.14335 0.374999 4.14335H0.944997C1.02852 3.84911 1.21245 3.58912 1.46828 3.40369C1.72412 3.21827 2.03755 3.11777 2.35999 3.11777C2.68243 3.11777 2.99587 3.21827 3.2517 3.40369C3.50753 3.58912 3.69147 3.84911 3.77499 4.14335H9.62497C9.72442 4.14335 9.81981 4.18067 9.89013 4.24712C9.96046 4.31356 9.99997 4.40367 9.99997 4.49764Z"
                      fill="white"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_2842_1879">
                      <rect width="10" height="9" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
                <select
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(e.target.value as "newest" | "oldest")
                  }
                  className="py-1.5 rounded-lg text-sm cursor-pointer outline-none"
                  style={{
                    color: "var(--text-primary)",
                  }}
                >
                  <option value="newest">По новизне</option>
                  <option value="oldest">По </option>
                </select>
              </div>

              <div className="space-y-4">
                {visibleReviews.map((review) => (
                  <div
                    key={review.id}
                    className="p-2 rounded-lg"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div
                        className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden"
                        style={{ backgroundColor: "var(--accent-primary)" }}
                      >
                        {review.user_avatar ? (
                          <Image
                            src={review.user_avatar}
                            alt={review.user_name}
                            width={40}
                            height={40}
                            className="object-cover"
                          />
                        ) : (
                          <span className="text-white text-lg font-[family-name:var(--font-stetica-bold)]">
                            {review.user_name.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <p
                            className="font-[family-name:var(--font-stetica-medium)] text-sm sm:text-base"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {review.user_name}
                          </p>
                          <span
                            className="text-xs sm:text-sm"
                            style={{ color: "var(--text-secondary)" }}
                          >
                            {formatDate(review.created_at)}
                          </span>
                        </div>
                        {renderStars(review.rating)}
                      </div>
                    </div>

                    {review.images && review.images.length > 0 && (
                      <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
                        {review.images.slice(0, 3).map((img, idx) => (
                          <div
                            key={img.id}
                            className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded-lg overflow-hidden cursor-pointer"
                            onClick={() => setSelectedImage(img.image)}
                          >
                            <Image
                              src={img.image}
                              alt={`Фото ${idx + 1}`}
                              fill
                              className="object-cover"
                              sizes="(max-width: 640px) 80px, 96px"
                            />
                            {idx === 2 && review.images.length > 3 && (
                              <div
                                className="absolute inset-0 flex items-center justify-center text-white text-lg font-[family-name:var(--font-stetica-bold)]"
                                style={{
                                  backgroundColor: "rgba(0, 0, 0, 0.6)",
                                }}
                              >
                                +{review.images.length - 3}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    <p
                      className="text-sm sm:text-base leading-relaxed mb-3"
                      style={{
                        color: "var(--text-secondary)",
                        wordBreak: "break-word",
                      }}
                    >
                      {review.comment}
                    </p>

                    <div className="flex items-center gap-[2px]">
                      <span
                        className="text-xs sm:text-sm"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        Ответ полезен?
                      </span>
                      <button
                        onClick={() => handleVote(review.id, "helpful")}
                        disabled={!!votedReviews[review.id]}
                        className="flex items-center gap-1 px-1 py-1 rounded transition-opacity"
                        style={{
                          opacity: votedReviews[review.id] ? 0.5 : 1,
                          cursor: votedReviews[review.id]
                            ? "not-allowed"
                            : "pointer",
                        }}
                      >
                        <span>👍</span>
                      </button>
                      <button
                        onClick={() => handleVote(review.id, "not_helpful")}
                        disabled={!!votedReviews[review.id]}
                        className="flex items-center gap-1 px-1 py-1 rounded transition-opacity"
                        style={{
                          opacity: votedReviews[review.id] ? 0.5 : 1,
                          cursor: votedReviews[review.id]
                            ? "not-allowed"
                            : "pointer",
                        }}
                      >
                        <span>👎</span>
                      </button>
                    </div>

                    {review.developer_response && (
                      <div
                        className="mt-3 p-3 rounded-lg"
                        style={{
                          backgroundColor:
                            "rgba(var(--accent-primary-rgb), 0.1)",
                          border:
                            "1px solid rgba(var(--accent-primary-rgb), 0.3)",
                        }}
                      >
                        <p
                          className="text-xs sm:text-sm font-[family-name:var(--font-stetica-medium)] mb-1"
                          style={{ color: "var(--accent-primary)" }}
                        >
                          Ответ застройщика{" "}
                          {review.developer_response.developer_name}
                        </p>
                        <p
                          className="text-xs sm:text-sm mb-1"
                          style={{
                            color: "var(--text-secondary)",
                            wordBreak: "break-word",
                          }}
                        >
                          {review.developer_response.response_text}
                        </p>
                        <p
                          className="text-xs"
                          style={{
                            color: "var(--text-secondary)",
                            opacity: 0.7,
                          }}
                        >
                          {formatDate(review.developer_response.created_at)}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {hasMore && (
                <button
                  onClick={() => setVisibleCount((prev) => prev + 5)}
                  className="w-full py-2.5 rounded-lg font-[family-name:var(--font-stetica-medium)] text-sm sm:text-base transition-opacity hover:opacity-80"
                  style={{
                    backgroundColor: "var(--accent-primary)",
                    color: "white",
                  }}
                >
                  Показать ещё ({sortedReviews.length - visibleCount})
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.9)" }}
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <Image
              src={selectedImage}
              alt="Просмотр изображения"
              width={1200}
              height={800}
              className="object-contain max-h-[90vh]"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full text-white text-2xl"
              style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </>
  );
}