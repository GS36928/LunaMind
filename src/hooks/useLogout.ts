"use client";

import { useRouter } from "next/navigation";

export const useLogout = () => {
  const router = useRouter();

  const logout = async (): Promise<void> => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return { logout };
};
