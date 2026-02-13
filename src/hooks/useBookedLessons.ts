import { useQuery } from "@tanstack/react-query";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  image: string; // ✅ პროფილის სურათი (არაა სავალდებულო)
}

export interface BookedLesson {
  id: string;
  date: string;
  time: string;
  duration: number;
  subject: string;
  createdAt: string;
  comment?: string;
  link?: string;
  teacher: User;
  student: User;
}

export interface UseBookedLessonsParams {
  studentId?: string | null;
  teacherId?: string | null;
}

const fetchBookedLessons = async ({
  studentId,
  teacherId,
}: UseBookedLessonsParams): Promise<BookedLesson[]> => {
  const params = new URLSearchParams();
  if (studentId) params.append("studentId", studentId);
  if (teacherId) params.append("teacherId", teacherId);

  const res = await fetch(
    `/api/book-lesson/booked-lessons?${params.toString()}`
  );

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "ვერ მოხერხდა გაკვეთილების წამოღება");
  }

  const data: BookedLesson[] = await res.json();

  // ✅ Default სურათის დამატება თუ უკავია image
  return data.map((lesson) => ({
    ...lesson,
    teacher: {
      ...lesson.teacher,
      image: lesson.teacher.image || "/images/default-profile.png",
    },
    student: {
      ...lesson.student,
      image: lesson.student.image || "/images/default-profile.png",
    },
  }));
};

export const useBookedLessons = ({
  studentId,
  teacherId,
}: UseBookedLessonsParams) => {
  const enabled = !!studentId || !!teacherId;

  return useQuery({
    queryKey: ["bookedLessons", { studentId, teacherId }],
    queryFn: () => fetchBookedLessons({ studentId, teacherId }),
    enabled,
    staleTime: 1000 * 60, // 1 წუთი fresh
  });
};
