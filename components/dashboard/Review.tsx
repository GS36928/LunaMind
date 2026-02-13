"use client";

import { useEffect, useState } from "react";
import { CircleWarning, Star } from "react-coolicons";
import toast from "react-hot-toast";
import { useAddReview } from "@/hooks/useAddReview";
import { useBookedLessons } from "@/hooks/useBookedLessons";

interface PropReview {
  isModal?: boolean;
  studentId: string;
  onSuccess?: () => void;
}

interface TeacherOption {
  id: string;
  firstName: string;
  lastName: string;
}

const Review = ({ isModal = false, studentId, onSuccess }: PropReview) => {
  const [rating, setRating] = useState(0);
  const [value, setValue] = useState("");
  const [selectedTeacherId, setSelectedTeacherId] = useState("");
  const [teachers, setTeachers] = useState<TeacherOption[]>([]);

  const { mutate: addReview, isPending } = useAddReview(studentId);
  const { data: lessons } = useBookedLessons({ studentId });

  useEffect(() => {
    if (!lessons) return;

    const uniqueTeachersMap = new Map<
      string,
      { id: string; firstName: string; lastName: string }
    >();

    lessons.forEach((lesson) => {
      uniqueTeachersMap.set(lesson.teacher.id, {
        id: lesson.teacher.id,
        firstName: lesson.teacher.firstName,
        lastName: lesson.teacher.lastName,
      });
    });

    const uniqueTeachers = Array.from(uniqueTeachersMap.values());
    setTeachers(uniqueTeachers);

    if (uniqueTeachers.length > 0) {
      setSelectedTeacherId(uniqueTeachers[0].id);
    }
  }, [lessons]);

  const handleSubmit = () => {
    if (!selectedTeacherId) {
      toast.error("გთხოვთ, აირჩიოთ მასწავლებელი");
      return;
    }

    if (rating === 0) {
      toast.error("გთხოვთ, აირჩიოთ ვარსკვლავის რაოდენობა");
      return;
    }

    addReview(
      { teacherId: selectedTeacherId, rating, comment: value },
      {
        onSuccess: () => {
          toast.success("შეფასება წარმატებით დამატებულია!");
          setRating(0);
          setValue("");
          onSuccess?.(); // Close modal
        },
        onError: (err: Error) => {
          toast.error(err.message || "სერვერის შეცდომა");
        },
      }
    );
  };

  return (
    <div
      className={`bg-white rounded-2xl p-5 flex flex-col ${
        isModal ? "h-[570px] mt-0 lg:h-[592px]" : "lg:h-[680px] mt-4 lg:mt-0"
      }`}
      style={{ boxShadow: "0px 2px 5px 0px rgba(0,0,0,0.05)" }}
    >
      <span className="font-helveticaneue-regular text-sm leading-5 text-[#737373]">
        შეფასების დაწერა
      </span>

      <div className="flex flex-col gap-3 justify-center items-center mt-5">
        <CircleWarning className="text-[#737373]" />
        <span className="text-xs leading-5 text-[#737373] font-helveticaneue-regular text-center sm:text-sm">
          შეფასების დაწერა შეგიძლიათ მხოლოდ თქვენს მიერ არჩეულ რეპეტიტორზე
        </span>
      </div>

      <hr className="text-[#EBECF0] mt-3 pb-4" />

      <section className="flex flex-col mt-3 border border-[#EBECF0] rounded-xl py-[10px] px-3">
        <span className="text-[10px] leading-4 text-[#737373] font-helveticaneue-regular sm:text-xs">
          აირჩეთ მასწავლებელი
        </span>
        <div className="relative w-full">
          <select
            value={selectedTeacherId}
            onChange={(e) => setSelectedTeacherId(e.target.value)}
            className="w-full text-xs sm:text-sm leading-4 text-[#000000] font-helveticaneue-medium appearance-none focus:outline-none focus:ring-0 bg-transparent"
          >
            {teachers.map((t) => (
              <option key={t.id} value={t.id}>
                {t.firstName} {t.lastName}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <svg
              className="w-5 h-5 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </section>

      <div className="flex items-center justify-between mt-3 py-[18px] px-3 border border-[#EBECF0] rounded-xl">
        <span className="text-[10px] sm:text-xs leading-4 text-[#737373] font-helveticaneue-regular">
          ვარსკვლავი
        </span>
        <div className="flex items-center gap-[10px]">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className="focus:outline-none"
            >
              <Star
                className={`w-6 h-6 ${
                  rating >= star
                    ? "text-[#F04F14] fill-[#F04F14]"
                    : "text-gray-300"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="relative w-full mt-3">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className={`w-full resize-none border border-[#EBECF0] rounded-xl focus:outline-none focus:ring-0 py-[10px] px-3 peer text-xs sm:text-sm leading-5 text-black font-helveticaneue-medium ${
            isModal ? "h-[162px]" : "h-[242px]"
          }`}
          placeholder=" "
        />
        {value === "" && (
          <label className="absolute left-3 top-3 text-[10px] sm:text-xs leading-4 text-[#737373] font-helveticaneue-regular pointer-events-none transition-all duration-200">
            შეიყვანეთ კომენტარი
          </label>
        )}
      </div>

      <button
        className="text-sm leading-5 text-[#080808] font-helveticaneue-medium py-4 w-full rounded-[50px] bg-[#F0C514] mt-[30px] sm:mt-[26px] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={handleSubmit}
        disabled={isPending}
        type="button"
      >
        {isPending ? "გადააგზავნა..." : "შეფასების დაწერა"}
      </button>
    </div>
  );
};

export default Review;
