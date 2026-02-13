"use client";

import { useBookedLessons } from "@/hooks/useBookedLessons";
import { countFinishedLessons, countFinishedLessonsHours } from "@/utils/count";

interface AtcivityTrackerBoxProps {
  color: string;
  textColor: string;
  description: string;
  text: string;
  profilePage?: boolean;
  count?: number;
}

const AtcivityTrackerBox = ({
  color,
  textColor,
  description,
  text,
  profilePage,

  count,
}: AtcivityTrackerBoxProps) => {
  return (
    <div
      className={`flex flex-col p-4  border border-[#EFEEF4] rounded-2xl sm:w-1/2 xl:justify-between h-[128px] md:h-[140px] xl:min-h-[152px]
        ${profilePage ? "bg-[#EBECF0]" : "bg-[#FFFFFF]"}`}
    >
      <div className="flex flex-col">
        <span
          style={{ backgroundColor: color, color: textColor }}
          className="inline-block w-fit text-[10px] leading-3 px-3 py-2 rounded-[40px] font-helveticaneue-regular"
        >
          {text}
        </span>
        <span
          className="pt-3 text-xs leading-4 text-[#737373] font-helveticaneue-regular md:text-sm md:leading-5
        xl:text-xs xl:leading-4 2xl:text-sm 2xl:leading-5"
        >
          {description}
        </span>
      </div>
      <div className="pt-3 flex justify-between items-center md:pt-5">
        <span className="text-2xl leading-[28px] text-black font-spacegrotesk-bold md:text-[32px]">
          {count}
        </span>
      </div>
    </div>
  );
};

const ActivityTracker = ({
  profilePage = false,
  teacher = false,
  studentId,
  teacherId,
}: {
  profilePage?: boolean;
  teacher?: boolean;
  studentId?: string;
  teacherId?: string;
}) => {
  const { data: lessons } = useBookedLessons(
    teacher ? { teacherId: teacherId } : { studentId: studentId }
  );

  const activeLessonsCount = lessons?.length || 0;

  const uniqueCount = lessons
    ? teacher
      ? new Set(lessons.map((lesson) => lesson.student.id)).size // უნიკალური მოსწავლეები
      : new Set(lessons.map((lesson) => lesson.teacher.id)).size // უნიკალური მასწავლებლები
    : 0;

  // ActivityTracker-ში
  const finishedLessonsCount = lessons
    ? countFinishedLessons(
        lessons.map((lesson) => ({
          createdAt: lesson.createdAt,
          duration: lesson.duration,
        }))
      )
    : 0;

  const finishedLessonsHours = lessons
    ? countFinishedLessonsHours(
        lessons.map((lesson) => ({
          createdAt: lesson.createdAt,
          duration: lesson.duration,
        }))
      )
    : 0;
  const hours = Math.floor(finishedLessonsHours / 60);
  const minutes = finishedLessonsHours % 60;
  return (
    <div
      className={` rounded-[20px] flex flex-col gap-3 xl:flex-row xl:items-center
        ${profilePage ? "bg-white" : "bg-[#EBECF0] p-3 "}`}
      style={{ boxShadow: "0px 2px 5px 0px rgba(0,0,0,0.05)" }}
    >
      <div className="flex flex-col gap-3 sm:flex-row xl:flex-1">
        <AtcivityTrackerBox
          text="ისწავლე მეტი"
          color="rgba(255, 213, 42, 0.1)"
          textColor="#F0C514"
          description="აქტიური გაკვეთილი"
          profilePage={profilePage}
          count={activeLessonsCount}
        />
        <AtcivityTrackerBox
          text="ისწავლე მეტი"
          color="rgba(125, 63, 255, 0.1)"
          textColor="rgba(125, 63, 255, 0.973)"
          description={teacher ? "ჩემი მოსწავლეები" : "არჩეული რეპეტიტორი"}
          profilePage={profilePage}
          count={uniqueCount}
        />
      </div>
      <div className="flex flex-col gap-3 sm:flex-row xl:flex-1 xl:items-center">
        <AtcivityTrackerBox
          text="საუკეთესო შედეგი"
          color="rgba(82, 206, 145, 0.1)"
          textColor="#52CE91"
          description="დასრულებული გაკვეთილი"
          profilePage={profilePage}
          count={finishedLessonsCount}
        />
        <div
          className={`p-4  border border-[#EFEEF4] rounded-2xl flex flex-col gap-3 md:gap-5 sm:w-1/2 h-[128px] md:h-[140px] xl:min-h-[152px] xl:gap-2 2xl:gap-3
            ${profilePage ? "bg-[#EBECF0]" : "bg-[#FFFFFF]"}`}
        >
          <span className="text-xs leading-4 text-[#737373] font-helveticaneue-regular md:text-sm md:leading-5">
            დღიურად დახარჯული დრო
          </span>
          <span
            className="text-2xl leading-[28px] font-spacegrotesk-bold md:text-[32px]"
            style={{ color: "rgba(125, 63, 255, 0.973)" }}
          >
            {hours}:{minutes}:00
          </span>
          <span className="text-[10px] leading-3 text-[#737373] font-helveticaneue-regular md:text-xs md:leading-4 xl:text-[10px]">
            სწავლაში დაბანდებული დრო არასდროს არის დაკარგული
          </span>
        </div>
      </div>
    </div>
  );
};

export default ActivityTracker;
