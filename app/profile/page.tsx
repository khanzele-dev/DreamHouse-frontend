"use client";

import ProtectedRoute from "@/app/components/ProtectedRoute";
import DeleteAccountModal from "@/app/components/DeleteAccountModal";
import { useSearchParams } from "next/navigation";
import { useProfileData, useReferralData, useAccountActions } from "./hooks";
import { ProfileHeader, ProfileSidebar, AccountSection, ReferralSection } from "./ui";

function ProfileContent() {
  const searchParams = useSearchParams();
  const activeSection = searchParams.get("section") || "account";

  const { profile, setProfile, isAuth } = useProfileData();
  const { referralLink, referrals, copied, loadingReferral, handleCopyLink } = 
    useReferralData(activeSection, isAuth);
  const {
    message,
    isDeleteModalOpen,
    isDeleting,
    setIsDeleteModalOpen,
    handleLogout,
    handleDeleteAccount,
    handleConfirmDelete,
  } = useAccountActions();

  return (
    <div
      className="min-h-screen font-[family-name:var(--font-stetica-regular)]"
      style={{
        backgroundColor: "var(--bg-primary)",
        transition: "background-color 0.3s ease",
      }}
    >
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <ProfileHeader />

        <div className="flex flex-col lg:flex-row gap-6 lg:items-start">
          <ProfileSidebar activeSection={activeSection} />

          <div className="flex-1">
            {activeSection === "account" && (
              <AccountSection
                profile={profile}
                setProfile={setProfile}
                message={message}
                onLogout={handleLogout}
                onDeleteAccount={handleDeleteAccount}
              />
            )}

            {activeSection === "referral" && (
              <ReferralSection
                referralLink={referralLink}
                referrals={referrals}
                copied={copied}
                loadingReferral={loadingReferral}
                onCopyLink={handleCopyLink}
              />
            )}
          </div>
        </div>
      </div>

      <DeleteAccountModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
      />
    </div>
  );
}

export default function Profile() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}
