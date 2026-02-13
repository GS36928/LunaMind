import { useMutation, useQueryClient } from "@tanstack/react-query";

export interface AddReviewPayload {
  teacherId: string;
  rating: number;
  comment: string;
}

export interface ReviewResponse {
  id: string;
  studentId: string;
  teacherId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export const useAddReview = (studentId: string) => {
  const queryClient = useQueryClient();

  return useMutation<ReviewResponse, Error, AddReviewPayload>({
    mutationFn: async (payload) => {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId, ...payload }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error adding review");
      }

      return res.json();
    },
    onSuccess: () => {
      // Invalidate ALL reviews queries to ensure everything updates
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
  });
};
