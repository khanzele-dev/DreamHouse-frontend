"use client";

import { useState, useEffect } from "react";
import axiosInstance from "@/app/shared/config/axios";
import { API_BASE_URL } from "@/app/shared/config/axios";

interface CallRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  cardId: number;
}

export function CallRequestModal({
  isOpen,
  onClose,
  cardId,
}: CallRequestModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [time, setTime] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const formatPhoneNumber = (value: string): string => {
    const numbers = value.replace(/\D/g, "");
    let formatted = numbers;

    if (formatted.startsWith("8")) {
      formatted = "7" + formatted.slice(1);
    }
    if (!formatted.startsWith("7") && formatted.length > 0) {
      formatted = "7" + formatted;
    }

    formatted = formatted.slice(0, 11);

    if (formatted.length === 0) return "";
    if (formatted.length === 1) return `+${formatted}`;
    if (formatted.length <= 4) return `+${formatted[0]} (${formatted.slice(1)}`;
    if (formatted.length <= 7) {
      return `+${formatted[0]} (${formatted.slice(1, 4)}) ${formatted.slice(
        4
      )}`;
    }
    if (formatted.length <= 9) {
      return `+${formatted[0]} (${formatted.slice(1, 4)}) ${formatted.slice(
        4,
        7
      )}-${formatted.slice(7)}`;
    }
    return `+${formatted[0]} (${formatted.slice(1, 4)}) ${formatted.slice(
      4,
      7
    )}-${formatted.slice(7, 9)}-${formatted.slice(9, 11)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhone(formatted);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const phoneNumber = phone.replace(/\D/g, "");

      await axiosInstance.post(
        `${API_BASE_URL}/cards/${cardId}/call_request/`,
        {
          phone_number: phoneNumber,
          name: name,
          preferred_time: time,
        }
      );

      alert("Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.");
      setName("");
      setPhone("");
      setTime("");
      onClose();
    } catch (error) {
      console.error("Ошибка при отправке заявки:", error);
      alert("Не удалось отправить заявку. Попробуйте позже.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          backdropFilter: "blur(4px)",
        }}
      />

      <div
        className="relative w-full max-w-md rounded-2xl shadow-2xl p-6 sm:p-8"
        style={{
          backgroundColor: "var(--card-bg)",
          transition: "background-color 0.3s ease",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full transition-colors"
          style={{
            color: "var(--text-secondary)",
          }}
          aria-label="Закрыть"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18 6L6 18M6 6L18 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <h2
          className="text-2xl mb-2"
          style={{
            color: "var(--text-primary)",
            fontFamily: "var(--font-stetica-medium)",
          }}
        >
          Оставить заявку
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium mb-2"
              style={{ color: "var(--text-primary)" }}
            >
              Ваш номер телефона
            </label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={handlePhoneChange}
              required
              className="w-full px-4 py-3 rounded-lg outline-none transition-all"
              style={{
                backgroundColor: "var(--bg-secondary)",
                color: "var(--text-primary)",
                border: "1px solid var(--border-color)",
              }}
              placeholder="+7 (___) ___-__-__"
            />
          </div>
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium mb-2"
              style={{ color: "var(--text-primary)" }}
            >
              Ваше имя
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg outline-none transition-all"
              style={{
                backgroundColor: "var(--bg-secondary)",
                color: "var(--text-primary)",
                border: "1px solid var(--border-color)",
              }}
              placeholder="Введите ваше имя"
            />
          </div>

          <div>
            <label
              htmlFor="time"
              className="block text-sm font-medium mb-2"
              style={{ color: "var(--text-primary)" }}
            >
              Выберите удобное время для звонка
            </label>
            <select
              id="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg outline-none transition-all cursor-pointer"
              style={{
                backgroundColor: "var(--bg-secondary)",
                color: "var(--text-primary)",
                border: "1px solid var(--border-color)",
              }}
            >
              <option value="">Выберите время</option>
              <option value="morning">Утро (9:00 - 12:00)</option>
              <option value="afternoon">День (12:00 - 15:00)</option>
              <option value="evening">Вечер (15:00 - 18:00)</option>
              <option value="late">Поздний вечер (18:00 - 21:00)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-full transition-all duration-300 cursor-pointer"
            style={{
              fontFamily: "var(--font-stetica-bold)",
              backgroundColor: "var(--accent-primary)",
              color: "#FFFFFF",
              opacity: isSubmitting ? 0.6 : 1,
              cursor: isSubmitting ? "not-allowed" : "pointer",
            }}
          >
            {isSubmitting ? "Отправка..." : "Отправить"}
          </button>
        </form>
      </div>
    </div>
  );
}
