"use client";

import { useQuery } from "@tanstack/react-query";

const fetchBookedLessons = async () => {
  const response = await fetch("/api/admin/all-booked-lessons");
  if (!response.ok) {
    throw new Error("Failed to fetch booked lessons");
  }
  return response.json();
};

export const useAllBookedLessons = () => {
  return useQuery({
    queryKey: ["booked-lessons"],
    queryFn: fetchBookedLessons,
    staleTime: 1000 * 60 * 5, // 5 წუთი
    refetchInterval: 1000 * 60, // ყოველი 1 წუთი
    refetchOnWindowFocus: true,
  });
};
