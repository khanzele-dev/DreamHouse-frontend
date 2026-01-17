import { useState, useEffect } from "react";
import config from "@/app/shared/config/axios";

interface Referral {
  name?: string;
  phone_number?: string;
  created_at: string;
}

interface ReferralLinkResponse {
  referral_link: string;
}

interface ReferralsResponse {
  results?: Referral[];
  count?: number;
  next?: string | null;
  previous?: string | null;
}

export function useReferralData(activeSection: string, isAuth: boolean) {
  const [referralLink, setReferralLink] = useState<string>("");
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [copied, setCopied] = useState(false);
  const [loadingReferral, setLoadingReferral] = useState(false);

  useEffect(() => {
    if (activeSection === "referral" && isAuth) {
      fetchReferralData();
    }
  }, [activeSection, isAuth]);

  const fetchReferralData = async () => {
    setLoadingReferral(true);
    try {
      const [linkResponse, referralsResponse] = await Promise.all([
        config.get<ReferralLinkResponse>("/users/referral-link/"),
        config.get<ReferralsResponse | Referral[]>("/users/referrals/"),
      ]);

      // Обрабатываем реферальную ссылку
      const link = linkResponse.data?.referral_link || "";
      setReferralLink(link);

      // Обрабатываем рефералов (массив или объект с пагинацией)
      let referralsData: Referral[] = [];
      const referralsDataRaw = referralsResponse.data;

      if (Array.isArray(referralsDataRaw)) {
        referralsData = referralsDataRaw;
      } else if (
        referralsDataRaw &&
        typeof referralsDataRaw === "object" &&
        "results" in referralsDataRaw &&
        Array.isArray(referralsDataRaw.results)
      ) {
        referralsData = referralsDataRaw.results;
      }

      setReferrals(referralsData);
    } catch (error) {
      console.error("Ошибка при загрузке реферальных данных:", error);
      setReferrals([]);
      setReferralLink("");
    } finally {
      setLoadingReferral(false);
    }
  };

  const handleCopyLink = () => {
    if (referralLink) {
      navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return {
    referralLink,
    referrals,
    copied,
    loadingReferral,
    handleCopyLink,
  };
}
