"use client";

import { Star } from "react-coolicons";
import { useReviews } from "@/hooks/useReviews";
import NoContent from "../../../../../components/ui/NoContent";

interface ReviewType {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  teacher: { firstName: string; lastName: string };
  student: { firstName: string; lastName: string };
}

interface TutorsStudentBoxProps {
  studentId?: string;
  teacherId?: string;
}

export const TutorsStudentBox: React.FC<TutorsStudentBoxProps> = ({
  studentId,
  teacherId,
}) => {
  // Pass both studentId and teacherId to the hook
  const {
    data: reviewsData,
    isLoading,
    error,
  } = useReviews(studentId, teacherId);

  if (isLoading) {
    return (
      <div className="bg-white p-5 rounded-2xl flex justify-center items-center">
        <span className="text-sm text-gray-500">შეფასებების ჩატვირთვა...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-5 rounded-2xl flex justify-center items-center">
        <span className="text-sm text-red-500">
          შეფასებების ჩატვირთვა ვერ მოხერხდა
        </span>
      </div>
    );
  }

  const reviews = reviewsData?.reviews || [];

  if (reviews.length === 0) {
    return (
      <div className="col-span-full w-full">
        <NoContent needBtn={false} desc="შეფასება არ არის" />
      </div>
    );
  }

  return (
    <>
      {reviews.map((review: ReviewType) => (
        <div
          key={review.id}
          className="bg-white p-5 rounded-2xl flex flex-col gap-5"
        >
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-[10px]">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-5 h-5 ${
                    review.rating >= star
                      ? "text-[#F04F14] fill-[#F04F14]"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm leading-5 text-[#080808] font-helveticaneue-medium xl:text-base xl:leading-6">
              {/* Show different text based on who is viewing */}
              {teacherId
                ? `მოსწავლის შეფასება: ${review.student.firstName} ${review.student.lastName}`
                : `${review.teacher.firstName} ${review.teacher.lastName} შესახებ`}
            </span>
          </div>
          <span className="text-xs leading-4 text-black font-helveticaneue-regular text-start sm:text-sm sm:leading-5">
            {review.comment}
          </span>
          <div className="flex flex-col gap-1">
            <span className="text-sm leading-5 text-black font-helveticaneue-medium">
              {teacherId
                ? `მასწავლებელი: ${review.teacher.firstName} ${review.teacher.lastName}`
                : `მოსწავლე: ${review.student.firstName} ${review.student.lastName}`}
            </span>
            <span className="text-xs leading-4 text-[#767676] font-helveticaneue-regular">
              {new Date(review.createdAt).toLocaleDateString("ka-GE", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
      ))}
    </>
  );
};
