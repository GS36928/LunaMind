import { getLessonDuration } from "@/utils/helperFunc";
import React from "react";
import {
  Camera,
  FileDocument,
  FolderOpen,
  LinkHorizontal,
  Tag,
} from "react-coolicons";

interface Teacher {
  id: string;
  userId: string;
  age: number | null;
  city: string | null;
  profession: string | null;
  education: string | null;
  currentStep: number;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  introVideoUrl?: string | null;
  preferredAgeGroups?: string[];
  certificateFiles?: string[];
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    image?: string;
  };
  teacherSubjects: Array<{
    id: string;
    name: string;
    price: number;
  }>;
  lessons: Array<{
    id: string;
    day: string;
    time: string;
    duration: number;
    subject: string;
    link?: string | null;
  }>;
}

interface SingleTeacherLeftSideProps {
  teacher: Teacher;
  selectedSubject?: string;
}

const SingleTeacherLeftSide = ({
  teacher,
  selectedSubject,
}: SingleTeacherLeftSideProps) => {
  const fullName = `${teacher.user.firstName} ${teacher.user.lastName}`;

  // მხოლოდ არჩეული საგნის გაკვეთილების დღეები
  const uniqueDays = [...new Set(teacher.lessons.map((lesson) => lesson.day))];
  const meetingDaysText = `კვირაში ${uniqueDays.length} დღე`;

  // დროების ფორმატირება (მხოლოდ არჩეული საგნისთვის)
  const formatLessonTimes = () => {
    if (teacher.lessons.length === 0) {
      return (
        <span className="text-sm leading-5 text-[#969696] font-helveticaneue-regular">
          დროები არ არის მითითებული
        </span>
      );
    }

    return teacher.lessons.map((lesson, index) => (
      <div key={lesson.id} className="flex items-center gap-1">
        <span className="text-sm leading-5 font-helveticaneue-medium text-[#080808]">
          {lesson.day}: {lesson.time} ({getLessonDuration(lesson.duration)})
        </span>
        {index < teacher.lessons.length - 1 && (
          <span className="text-[#969696]">•</span>
        )}
      </div>
    ));
  };

  // არჩეული საგანი ან პირველი საგანი
  const mainSubject =
    selectedSubject || teacher.teacherSubjects[0]?.name || "საგანი";

  // ყველა საგანი (მხოლოდ არჩეული საგნისთვის)
  const displaySubjects = selectedSubject
    ? selectedSubject
    : teacher.teacherSubjects.map((subject) => subject.name).join(", ");

  return (
    <div className="bg-white p-4 rounded-2xl lg:col-span-2 order-2 lg:order-1">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <span className="text-2xl leading-[100%] text-black font-helveticaneue-medium !font-bold lg:text-[32px]">
            {displaySubjects}
          </span>
          <span className="text-sm leading-5 text-[#969696] font-helveticaneue-regular lg:text-base lg:leading-[100%]">
            {fullName}
          </span>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:gap-0 sm:justify-between">
          <div className="flex items-center gap-2 cursor-pointer">
            <LinkHorizontal color="#3E74FF" width={24} height={24} />
            <span className="text-[#3E74FF] text-sm leading-5 font-helveticaneue-regular underline">
              გაზიარება
            </span>
          </div>
          <div className="flex items-center gap-2 cursor-pointer">
            <Tag color="#969696" width={24} height={24} />
            <span className="text-[#969696] text-sm leading-5 font-helveticaneue-regular">
              {mainSubject}
            </span>
          </div>
        </div>
      </div>

      {/* მხოლოდ თუ არჩეული საგნისთვის არის გაკვეთილები */}
      {teacher.lessons.length > 0 ? (
        <div className="bg-[#ECF1FF] rounded-xl p-3 mt-3 flex flex-col gap-3">
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="flex flex-col gap-1 sm:w-1/2">
              <span className="text-xs leading-4 text-[#969696] font-helveticaneue-regular">
                მასწავლებელი
              </span>
              <span className="text-sm leading-5 text-[#080808] font-helveticaneue-medium !font-bold">
                {fullName}
              </span>
            </div>
            <div className="flex flex-col gap-1 sm:w-1/2">
              <span className="text-xs leading-4 text-[#969696] font-helveticaneue-regular">
                შეხვედრები
              </span>
              <span className="text-sm leading-5 text-[#080808] font-helveticaneue-medium !font-bold">
                {meetingDaysText}
              </span>
            </div>
          </div>
          <hr className="border border-[#D3DFFF]" />
          <div className="flex flex-col gap-1">
            <span className="text-xs leading-4 text-[#969696] font-helveticaneue-regular">
              საათები ({mainSubject})
            </span>
            <div className="flex flex-col sm:flex-row sm:gap-1 flex-wrap">
              {formatLessonTimes()}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-[#ECF1FF] rounded-xl p-3 mt-3">
          <span className="text-sm leading-5 text-[#969696] font-helveticaneue-regular">
            {selectedSubject
              ? `${selectedSubject} საგნისთვის გაკვეთილები არ არის მითითებული`
              : "გაკვეთილები არ არის მითითებული"}
          </span>
        </div>
      )}

      <div className="mt-4 flex flex-col gap-3">
        <span className="text-sm leading-5 text-[#737373] font-helveticaneue-regular">
          ინფორმაცია რეპეტიტორზე
        </span>
        <span className="text-sm leading-5 text-[#080808] font-helveticaneue-regular">
          {teacher?.profession}
        </span>
      </div>

      <div className="w-full mt-4 rounded-xl overflow-hidden aspect-video bg-black">
        {teacher.introVideoUrl ? (
          <video
            className="w-full h-full object-cover"
            src={teacher.introVideoUrl}
            controls
            poster={teacher.user.image}
          />
        ) : (
          <div className="bg-[#EBECF0] flex flex-col items-center justify-center w-full h-full">
            <div className="bg-white rounded-full px-5 py-[20.5px]">
              <Camera width={24} height={24} color="black" />
            </div>
            <span className="text-sm leading-5 text-[#080808] font-helveticaneue-medium mt-[10px]">
              შესავალი ვიდეო არ არის დამატებული
            </span>
            <span className="text-xs leading-4 text-[#737373] font-helveticaneue-regular mt-1">
              ამ რეპეტიტორს ჯერ არ აქვს შესავალი ვიდეო
            </span>
          </div>
        )}
      </div>
      <div className="mt-4">
        <span className="text-sm leading-5 font-helveticaneue-regular text-[#737373]">
          სერტიფიკატები
        </span>
        <div className="mt-3">
          {teacher.certificateFiles && teacher.certificateFiles.length > 0 ? (
            <div className="flex flex-col gap-2">
              {teacher.certificateFiles.map((file, index) => (
                <div key={index}>
                  <a href={file} target="_blank" rel="noopener noreferrer">
                    <div className="flex items-center gap-3">
                      <div className="py-[13px] px-[15px] bg-[#3E74FF1A] rounded-xl w-fit">
                        <FileDocument width={24} height={24} color="#3E74FF" />
                      </div>
                      <span className="text-[#3E74FF] text-sm leading-5 underline font-helveticaneue-regular !font-bold">
                        სერტიფიკატის დასახელება
                      </span>
                    </div>
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <span className="text-sm text-[#969696]">
              სერტიფიკატები არ არის ატვირთული
            </span>
          )}
        </div>
      </div>
      <div className="mt-4">
        <span className="text-sm leading-5 font-helveticaneue-regular text-[#737373]">
          განათლება
        </span>
        <div className="bg-[#EBECF0] rounded-xl mt-3 px-4 py-[32px] flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="bg-[#F04F14] p-[10px] rounded-xl w-fit">
            <FolderOpen width={24} height={24} color="white" />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-sm leading-5 text-black font-helveticaneue-medium !font-bold">
              {teacher?.education} - სამართალმცოდნე
            </span>
            <span className="text-sm leading-5 text-black font-helveticaneue-regular">
              ივანე ჯავახიშვილის თბილისის სახელმწიფო უნივერსიტეტი
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <span className="text-sm leading-5 font-helveticaneue-regular text-[#737373]">
          დამატებითი ინფორმაცია
        </span>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="flex flex-col gap-1 bg-[#EBECF0] rounded-xl px-4 py-[32px]">
            <span className="text-sm leading-5 text-[#737373] font-helveticaneue-regular">
              აკადემიური ხარისხი
            </span>
            <span className="text-sm leading-5 text-black font-helveticaneue-medium !font-bold">
              მაგისტრი
            </span>
          </div>
          <div className="flex flex-col gap-1 bg-[#EBECF0] rounded-xl px-4 py-[32px]">
            <span className="text-sm leading-5 text-[#737373] font-helveticaneue-regular">
              ფოკუსირებული სფერო
            </span>
            <span className="text-sm leading-5 text-black font-helveticaneue-medium !font-bold">
              {teacher.preferredAgeGroups?.join(", ")}
            </span>
          </div>
          <div className="flex flex-col gap-1 bg-[#EBECF0] rounded-xl px-4 py-[32px]">
            <span className="text-sm leading-5 text-[#737373] font-helveticaneue-regular">
              პლატფორმას შემოუერთდა
            </span>
            <span className="text-sm leading-5 text-black font-helveticaneue-medium !font-bold">
              {new Date(teacher.createdAt).toLocaleDateString("ka-GE", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>
      <div className="mt-4 bg-[#ECF1FF] rounded-xl p-3 flex flex-col gap-1">
        <span className="text-[#969696] text-xs leading-4 font-helveticaneue-regular">
          კონსულტაციისთვის დაგვიკავშირდი
        </span>
        <span className="text-[#3E74FF] text-sm leading-5 font-helveticaneue-regular !font-bold">
          +995 557 55 55 55 - 032 2 57 57 57 - info@domaincom
        </span>
      </div>
    </div>
  );
};

export default SingleTeacherLeftSide;
