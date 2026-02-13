"use client";

import { useQuery } from "@tanstack/react-query";

const fetchReviews = async () => {
  const response = await fetch("/api/admin/reviews/all-reviews");
  if (!response.ok) {
    throw new Error("Failed to fetch reviews");
  }
  return response.json();
};

export const useAllReviews = () => {
  return useQuery({
    queryKey: ["reviews"],
    queryFn: fetchReviews,
    staleTime: 1000 * 60 * 5, // 5 წუთი
    refetchInterval: 1000 * 60, // ყოველი 1 წუთი
    refetchOnWindowFocus: true,
  });
};
