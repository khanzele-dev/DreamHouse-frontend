import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/app/shared/redux/hooks";
import { logout } from "@/app/shared/redux/slices/auth";
import { useDeleteAccountMutation } from "@/app/shared/redux/api/auth";

export function useAccountActions() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [deleteAccount, { isLoading: isDeleting }] = useDeleteAccountMutation();
  
  const [message, setMessage] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/");
  };

  const handleDeleteAccount = () => {
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async (password: string) => {
    try {
      await deleteAccount({ password }).unwrap();
      
      setIsDeleteModalOpen(false);
      dispatch(logout());
      router.replace("/");
    } catch (error: unknown) {
      const apiError = error as { data?: { reason?: string; detail?: string } };
      let errorMessage = 
        apiError?.data?.reason || 
        apiError?.data?.detail ||
        "Неверный пароль или ошибка сервера";
      
      if (errorMessage === "Incorrect password") {
        errorMessage = "Неверный пароль";
      }
      
      setMessage(errorMessage);
      setIsDeleteModalOpen(false);
    }
  };

  return {
    message,
    isDeleteModalOpen,
    isDeleting,
    setIsDeleteModalOpen,
    handleLogout,
    handleDeleteAccount,
    handleConfirmDelete,
  };
}
