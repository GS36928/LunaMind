"use client";

import { useQuery } from "@tanstack/react-query";

const fetchTeachers = async () => {
  const response = await fetch("/api/teachers");
  if (!response.ok) {
    throw new Error("Failed to fetch teachers");
  }
  return response.json();
};

export const useTeachers = () => {
  return useQuery({
    queryKey: ["teachers"],
    queryFn: fetchTeachers,
    staleTime: 1000 * 60 * 5,
    refetchInterval: 1000 * 60,
    refetchOnWindowFocus: true,
  });
};
