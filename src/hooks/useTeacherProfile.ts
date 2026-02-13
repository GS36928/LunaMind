import { useQuery } from "@tanstack/react-query";

export const useTeacherProfile = (teacherId?: string) => {
  return useQuery({
    queryKey: ["teacherProfile", teacherId],
    queryFn: async () => {
      if (!teacherId) return null;
      const res = await fetch(`/api/teachers/profile?userId=${teacherId}`);
      if (!res.ok) throw new Error("Failed to fetch teacher profile");
      const data = await res.json();
      return data.profile;
    },
    enabled: !!teacherId, // მხოლოდ მაშინ გაეშვება, როცა teacherId არსებობს
  });
};
