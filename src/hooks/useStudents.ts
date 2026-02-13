"use client";

import { useQuery } from "@tanstack/react-query";

const fetchStudents = async () => {
  const response = await fetch("/api/students/all-students");
  if (!response.ok) {
    throw new Error("Failed to fetch students");
  }
  return response.json();
};

export const useStudents = () => {
  return useQuery({
    queryKey: ["students"],
    queryFn: fetchStudents,
    staleTime: 1000 * 60 * 5, // 5 წუთი
    refetchInterval: 1000 * 60, // ყოველ წუთში რეფრეში
    refetchOnWindowFocus: true, // ფოკუსზე ავტომატური რეფრეში
  });
};
