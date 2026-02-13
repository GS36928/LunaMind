import React from "react";
import { Calendar, Clock } from "react-coolicons";

// This component will display real lesson history when integrated with backend
// Currently shows "No lessons" message

type LessonHistoryItem = {
  id: string;
  date: string;
  duration: string;
  teacherName: string;
  subject: string;
  teacherImage?: string;
};

const LessonsHistoryBox = ({ lesson }: { lesson: LessonHistoryItem }) => {
  return (
    <div className="bg-[#EBECF0] rounded-2xl p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
        <div className="flex flex-col">
          <span className="text-xs leading-4 text-[#737373] font-helveticaneue-regular">
            თარიღი
          </span>
          <span className="text-sm leading-5 text-[#080808] font-helveticaneue-regular">
            {lesson.date}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs leading-4 text-[#737373] font-helveticaneue-regular">
            ხანგრძლივობა
          </span>
          <span className="text-sm leading-5 text-[#080808] font-helveticaneue-regular">
            {lesson.duration}
          </span>
        </div>
      </div>
      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
        <div className="flex items-center gap-3">
          <div className="w-[44px] h-[44px] bg-[#080808] rounded-full overflow-hidden flex items-center justify-center text-white font-bold">
            {lesson.teacherImage ? (
              <img 
                src={lesson.teacherImage} 
                alt={lesson.teacherName}
                className="w-full h-full object-cover"
              />
            ) : (
              lesson.teacherName.charAt(0)
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-xs leading-4 text-[#737373] font-helveticaneue-regular">
              {lesson.teacherName}
            </span>
            <span className="text-sm leading-5 text-[#080808] font-helveticaneue-regular">
              {lesson.subject}
            </span>
          </div>
        </div>
        <button className="text-sm leading-5 text-[#080808] font-helveticaneue-regular py-3 bg-[#F0C514] w-full rounded-[50px] cursor-pointer sm:w-fit sm:px-4 hover:bg-[#d4ad11] transition-colors">
          შეფასების დაწერა
        </button>
      </div>
    </div>
  );
};

const LessonsHistory = () => {
  // TODO: Fetch real lesson history from database
  // For now, show empty state
  const lessons: LessonHistoryItem[] = []; // Will be populated from API

  if (lessons.length === 0) {
    return (
      <div className="mt-4 flex flex-col items-center justify-center py-16 border border-[#F1F1F1] rounded-xl">
        <div className="flex gap-3 mb-4 text-[#737373]">
          <Calendar width={32} height={32} />
          <Clock width={32} height={32} />
        </div>
        <p className="text-lg leading-6 text-[#737373] font-helveticaneue-medium mb-2">
          გაკვეთილების ისტორია ცარიელია
        </p>
        <p className="text-sm leading-5 text-[#737373] font-helveticaneue-regular text-center max-w-md">
          როდესაც დაჯავშნით და გაივლით გაკვეთილებს, ისინი აქ გამოჩნდება
        </p>
      </div>
    );
  }

  return (
    <div className="mt-4 flex flex-col gap-3 max-h-[948px] overflow-y-scroll sm:max-h-[532px]">
      {lessons.map((lesson) => (
        <LessonsHistoryBox key={lesson.id} lesson={lesson} />
      ))}
    </div>
  );
};

export default LessonsHistory;
