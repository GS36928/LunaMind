"use client";

import { useTeachers } from "@/hooks/useTeachers";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { WavyCheck } from "react-coolicons";
import { UnionCrown } from "../ui/Icons";
import { useResponsiveSlice } from "@/hooks/useResponsiveSlice";
import { getLessonDuration } from "@/utils/helperFunc";

// Types
type TeacherSubject = {
  id: string;
  name: string;
  price: number;
};

type User = {
  firstName: string;
  lastName: string;
  image: string | null;
};

type Lesson = {
  id: string;
  teacherId: string;
  subject: string;
  day: string;
  date: string;
  time: string;
  duration: number;
  comment: string;
  link: string | null;
};

type Teacher = {
  id: string;
  user: User;
  lessons: Lesson[];
  teacherSubjects: TeacherSubject[];
  profession?: string;
  city?: string;
  certificateDescription?: string | null;
};

type TeacherWithCurrentSubject = Teacher & {
  currentSubject: TeacherSubject;
};

const TutorsInfo = ({
  id,
  userExist,
}: {
  id: string;
  userExist?: string | null;
}) => {
  const { data: teacherList, isLoading, isError } = useTeachers();
  const router = useRouter();

  // Flatten teachers with subjects
  const teachersWithSubjects: TeacherWithCurrentSubject[] =
    teacherList?.teachers
      ?.filter(
        (teacher: Teacher) => teacher.lessons && teacher.lessons.length > 0
      )
      .flatMap((teacher: Teacher) =>
        teacher.teacherSubjects.map((subject: TeacherSubject) => ({
          ...teacher,
          currentSubject: subject,
        }))
      ) || [];

  const displayedTeachers = useResponsiveSlice(teachersWithSubjects, 4, 6);

  if (isLoading) return <div>ჩატვირთვა...</div>;
  if (isError) return <div>გაიშვება შეცდომა</div>;

  // Get first lesson duration for display

  return (
    <div
      id={id}
      className="mt-6 md:mt-8 xl:mt-[65px] 2xl:mt-[76px] 3xl:mt-[128px] flex flex-col"
    >
      <div className="hidden xl:flex flex-col w-full text-center">
        <span className="text-[#0C0F21] text-[40px] leading-[40px] font-lgvanastasia-regular lg:text-[52px] xl:text-[64px] xl:leading-[52px] xl:text-black  inline-block">
          <span className="relative inline-block ">
            ვ
            <span className="absolute -top-10 -left-10 hidden xl:block">
              <UnionCrown />
            </span>
          </span>
          ერიფიცირებული რეპეტიტორები
        </span>
        <span className="text-base leading-6 text-[#939393] font-helveticaneue-regular">
          შექმენით ანგარიში და იხილეთ ყველა რეპეტიტორის სრული პროფილი
        </span>
      </div>
      <div className="flex flex-col gap-6 md:gap-8 lg:grid lg:grid-cols-2 lg:gap-6 xl:grid-cols-3 h-fit xl:mt-8">
        {displayedTeachers.map((item, index) => (
          <div
            className="hover:shadow-md transition-shadow"
            key={`${item.id}-${index}`}
          >
            <div className="bg-[#EBECF0] px-4 py-3 rounded-t-2xl flex flex-col gap-3 xl:gap-4">
              <div className="flex items-center gap-2">
                <div
                  className="flex items-center gap-1 p-2 rounded-[40px]"
                  style={{ backgroundColor: "rgba(0, 119, 255, 0.1)" }}
                >
                  <WavyCheck color="#0077FF" width={20} height={20} />
                  <span className="text-xs leading-4 text-[#0077FF] font-helveticaneue-regular">
                    ვერიფიცირებული
                  </span>
                </div>
                <div
                  className="flex items-center gap-2 backdrop-blur-[24px] px-4 py-3 rounded-[40px] h-[36px]"
                  style={{ backgroundColor: "rgba(73, 176, 44, 0.2)" }}
                >
                  <div className="bg-[#49B02C] w-3 h-3 rounded-full"></div>
                  <span className="text-xs leading-4 text-[#49B02C] font-helveticaneue-regular">
                    ონლაინ
                  </span>
                </div>
              </div>
              <div>
                <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-[52px] h-[52px] xl:w-[64px] xl:h-[64px] relative overflow-hidden rounded-full">
                      <Image
                        src={item.user.image || "/images/default-profile.png"}
                        alt="user"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs leading-4 text-[#737373] font-helveticaneue-regular">
                        {item.currentSubject.name}
                      </span>
                      <span className="text-sm leading-5 text-[#080808] font-helveticaneue-medium !font-bold">
                        {item.user.firstName} {item.user.lastName}
                      </span>
                    </div>
                  </div>

                  <span className="bg-white px-3 py-2 xl:px-4 xl:py-3 w-fit text-xs leading-4 font-helveticaneue-regular rounded-[40px] backdrop-blur-[24px]">
                    {item.city || "თბილისი"}
                  </span>
                </div>
              </div>
            </div>
            <div className="bg-white px-4 py-3 rounded-b-2xl border border-t-0 border-[#EBECF0]">
              <div className="flex flex-col">
                <span className="text-base leading-6 text-[#080808] font-helveticaneue-medium !font-bold xl:text-[20px] xl:leading-7">
                  {item.currentSubject.price} ლარი
                  <span className="text-xs leadign-4 font-helveticaneue-regular text-[#737373] xl:text-sm xl:leading-5">
                    /საათი
                  </span>
                </span>
                <span className="text-sm leading-5 text-[#737373] font-helveticaneue-regular line-clamp-2 mt-1 min-h-[40px]">
                  {item.profession || "პროფესია არ არის მითითებული"}
                </span>
                <div className="flex w-full sm:items-center sm:flex-row mt-3 flex-col items-start gap-3 sm:gap-0">
                  <div className="w-1/2 flex flex-col">
                    <span className="text-xs leading-4 text-[#737373] font-helveticaneue-regular xl:hidden">
                      ხანგრძლივობა
                    </span>
                    <span className="text-xs leading-4 text-[#737373] font-helveticaneue-regular hidden xl:inline">
                      შეხვედრის ხანგრძლივობა
                    </span>
                    <span className="text-sm leading-5 text-[#080808] font-helveticaneue-medium !font-bold">
                      {getLessonDuration(item?.lessons[0]?.duration)}
                    </span>
                  </div>
                  <div className="w-1/2 flex flex-col">
                    <span className="text-xs leading-4 text-[#737373] font-helveticaneue-regular">
                      შეხვედრები
                    </span>
                    <span className="text-sm leading-5 text-[#080808] font-helveticaneue-medium !font-bold">
                      მოქნილი განრიგი
                    </span>
                  </div>
                </div>
              </div>
              <hr className="mt-3 border border-[#EBECF0]" />
              <div className="mt-2">
                <span className="text-xs leading-4 text-[#737373] font-helveticaneue-regular">
                  განათლება/გამოცდილება
                </span>
                <div className="mt-2 h-[72px] sm:h-[32px] lg:h-[72px] 2xl:h-[32px] overflow-hidden flex gap-2 flex-wrap">
                  {item.certificateDescription && (
                    <div
                      style={{ backgroundColor: "rgba(0, 119, 255, 0.1)" }}
                      className="w-fit flex justify-center items-center py-2 px-3 rounded-[40px] h-[32px]"
                    >
                      <span className="text-sm leading-5 text-[#0077FF] font-helveticaneue-regular">
                        {item.certificateDescription}
                      </span>
                    </div>
                  )}

                  <div
                    style={{ backgroundColor: "rgba(0, 119, 255, 0.1)" }}
                    className="w-fit flex justify-center items-center py-2 px-3 rounded-[40px] h-[32px]"
                  >
                    <span className="text-sm leading-5 text-[#0077FF] font-helveticaneue-regular">
                      {item.currentSubject.name}
                    </span>
                  </div>
                </div>
              </div>
              {!userExist && (
                <>
                  <hr className="mt-3 border border-[#EBECF0]" />
                  <button
                    className="py-[14px] w-full rounded-[40px] bg-[#F6F7FB] cursor-pointer mt-4 text-sm leading-5 text-[#0C0F21] font-helveticaneue-medium hover:bg-[#E0E2E8] transition"
                    onClick={() => router.push("/register")}
                  >
                    რეგისტრაცია
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
      {!userExist && (
        <div
          className="hidden md:flex items-center bg-[#FFD52A] hover:bg-[#FFC700] transition-colors rounded-[40px] w-fit mx-auto justify-center py-4 px-[36px] mt-8 2xl:mt-6 3xl:mt-8 2xl:py-[19px] 2xl:px-[44px] cursor-pointer"
          onClick={() => router.push("/register")}
        >
          <button className="text-sm leading-5 font-helveticaneue-medium cursor-pointer">
            უფრო მეტის სანახავად დარეგისტრირდი
          </button>
        </div>
      )}
    </div>
  );
};

export default TutorsInfo;
