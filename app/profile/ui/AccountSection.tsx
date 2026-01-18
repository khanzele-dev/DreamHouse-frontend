import { User } from "lucide-react";
import { useRef, useState } from "react";
import Image from "next/image";
import { useUpdateProfilePhotoMutation } from "@/app/shared/redux/api/auth";

interface AccountSectionProps {
  profile: {
    name: string;
    phone_number: string;
    password: string;
    profile_photo?: string | undefined;
  };
  setProfile: React.Dispatch<React.SetStateAction<{
    name: string;
    phone_number: string;
    password: string;
    profile_photo: string | undefined;
  }>>;
  message: string | null;
  onLogout: () => void;
  onDeleteAccount: () => void;
}

export function AccountSection({
  profile,
  setProfile,
  message,
  onLogout,
  onDeleteAccount,
}: AccountSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [updateProfilePhoto, { isLoading: isUploadingPhoto }] = useUpdateProfilePhotoMutation();
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setUploadMessage("Пожалуйста, выберите изображение");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadMessage("Размер файла не должен превышать 5MB");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("profile_photo", file);

      const result = await updateProfilePhoto(formData).unwrap();
      
      setProfile({
        ...profile,
        profile_photo: result.profile_photo,
      });
      
      setUploadMessage("Фото успешно обновлено");
      setTimeout(() => setUploadMessage(null), 3000);
    } catch (error) {
      console.error("Ошибка при загрузке фото:", error);
      setUploadMessage("Не удалось загрузить фото");
    }
  };

  return (
    <div
      className="rounded-2xl px-6 sm:px-8"
      style={{
        backgroundColor: "transparent",
        transition: "background-color 0.3s ease",
      }}
    >
      <div className="flex flex-col mb-8">
        <div className="w-24 h-24 rounded-full flex items-center justify-center overflow-hidden"
          style={{
            backgroundColor: "var(--bg-secondary)",
            border: "3px solid var(--accent-primary)",
          }}
        >
          {profile.profile_photo ? (
            <Image
              src={profile.profile_photo}
              alt="Profile"
              width={96}
              height={96}
              className="w-full h-full object-cover"
            />
          ) : (
            <User
              className="w-12 h-12"
              style={{ color: "var(--accent-primary)" }}
            />
          )}
        </div>
        
        <button
          onClick={handlePhotoClick}
          disabled={isUploadingPhoto}
          className="mt-2 text-sm cursor-pointer hover:underline transition-all text-left"
          style={{
            color: "var(--accent-primary)",
          }}
        >
          Сменить фото
        </button>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        
        {isUploadingPhoto && (
          <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
            Загрузка...
          </p>
        )}
        
        {uploadMessage && (
          <p
            className="mt-2 text-sm"
            style={{
              color: uploadMessage.includes("успешно")
                ? "var(--accent-primary)"
                : "#FF4444",
            }}
          >
            {uploadMessage}
          </p>
        )}
      </div>

      <div className="space-y-6">
        <div>
          <label
            className="block text-sm font-[family-name:var(--font-stetica-bold)] mb-2"
            style={{
              color: "var(--text-primary)",
              transition: "color 0.3s ease",
            }}
          >
            Имя
          </label>
          <input
            type="text"
            value={profile.name}
            onChange={(e) =>
              setProfile({ ...profile, name: e.target.value, profile_photo: profile.profile_photo || undefined })
            }
            disabled
            readOnly
            className="rounded-xl px-4 py-3 focus:outline-none cursor-not-allowed"
            style={{
              border: "1px solid var(--border-color)",
              backgroundColor: "var(--bg-secondary)",
              color: "var(--text-primary)",
              transition: "all 0.3s ease",
              width: "500px",
              maxWidth: "100%",
              opacity: "0.6",
            }}
            placeholder="Магомед"
          />
        </div>

        <div>
          <label
            className="block text-sm font-[family-name:var(--font-stetica-bold)] mb-2"
            style={{
              color: "var(--text-primary)",
              transition: "color 0.3s ease",
            }}
          >
            Номер телефона
          </label>
          <input
            type="tel"
            inputMode="tel"
            value={profile.phone_number}
            onChange={(e) => {
              const numbers = e.target.value.replace(/\D/g, "");
              let formatted = numbers;

              if (formatted.startsWith("8")) {
                formatted = "7" + formatted.slice(1);
              }
              if (
                !formatted.startsWith("7") &&
                formatted.length > 0
              ) {
                formatted = "7" + formatted;
              }

              formatted = formatted.slice(0, 11);

              let result = "";
              if (formatted.length === 0) result = "";
              else if (formatted.length === 1)
                result = `+${formatted}`;
              else if (formatted.length <= 4)
                result = `+${formatted[0]} (${formatted.slice(1)}`;
              else if (formatted.length <= 7) {
                result = `+${formatted[0]} (${formatted.slice(
                  1,
                  4
                )}) ${formatted.slice(4)}`;
              } else if (formatted.length <= 9) {
                result = `+${formatted[0]} (${formatted.slice(
                  1,
                  4
                )}) ${formatted.slice(4, 7)}-${formatted.slice(7)}`;
              } else {
                result = `+${formatted[0]} (${formatted.slice(
                  1,
                  4
                )}) ${formatted.slice(4, 7)}-${formatted.slice(
                  7,
                  9
                )}-${formatted.slice(9, 11)}`;
              }

              setProfile({ ...profile, phone_number: result, profile_photo: profile.profile_photo || undefined });
            }}
            disabled
            readOnly
            className="rounded-xl px-4 py-3 focus:outline-none cursor-not-allowed"
            style={{
              border: "1px solid var(--border-color)",
              backgroundColor: "var(--bg-secondary)",
              color: "var(--text-primary)",
              transition: "all 0.3s ease",
              width: "500px",
              maxWidth: "100%",
              opacity: "0.6",
            }}
            placeholder="+7 (___) ___-__-__"
          />
        </div>

        <div className="flex flex-col space-y-4">
          <button
            onClick={onLogout}
            className="py-3 rounded-full font-[family-name:var(--font-stetica-bold)] transition-all cursor-pointer hover:bg-[rgba(255,68,68,0.05)]"
            style={{
              backgroundColor: "transparent",
              border: "2px solid #FF4444",
              color: "#FF4444",
              width: "400px",
              maxWidth: "100%",
            }}
          >
            Выйти
          </button>

          <button
            onClick={onDeleteAccount}
            className="py-1 text-sm hover:underline cursor-pointer text-center"
            style={{
              color: "var(--text-secondary)",
              width: "400px",
              maxWidth: "100%",
            }}
          >
            Удалить аккаунт
          </button>
        </div>
      </div>

      {message && (
        <div
          className="mt-6 rounded-xl px-4 py-3 text-sm"
          style={{
            backgroundColor: "var(--bg-secondary)",
            color: "var(--text-primary)",
            transition: "all 0.3s ease",
          }}
        >
          {message}
        </div>
      )}
    </div>
  );
}
