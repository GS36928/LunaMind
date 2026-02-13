"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export const useAdminAuth = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/check-admin", {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) {
          router.push("/admin");
          return;
        }

        const data = await res.json();
        setUser(data.user);
        setIsLoading(false);
      } catch {
        router.push("/admin");
      }
    };

    checkAuth();
  }, [router]);

  return { user, isLoading };
};
