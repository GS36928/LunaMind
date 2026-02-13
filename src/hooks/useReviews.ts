// hooks/useReviews.ts
import { useQuery } from "@tanstack/react-query";

export const fetchReviews = async (studentId?: string, teacherId?: string) => {
  const queryParams = new URLSearchParams();
  if (studentId) queryParams.append("studentId", studentId);
  if (teacherId) queryParams.append("teacherId", teacherId);

  const res = await fetch(`/api/reviews?${queryParams.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch reviews");
  return res.json();
};

export const useReviews = (studentId?: string, teacherId?: string) => {
  return useQuery({
    queryKey: ["reviews", studentId, teacherId],
    queryFn: () => fetchReviews(studentId, teacherId),
  });
};
