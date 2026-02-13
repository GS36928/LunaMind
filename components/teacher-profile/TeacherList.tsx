"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { WavyCheck } from "react-coolicons";

interface Teacher {
  id: string;
  profession?: string | null;
  price?: number;
  user: {
    firstName: string;
    lastName: string;
    image?: string;
  };
  teacherSubjects?: Array<{
    id: string;
    name: string;
    price?: number;
  }>;
  lessons?: Array<{
    id: string;
    day: string;
    time: string;
  }>;

  subjectName?: string;
  subjectPrice?: number;
}

interface TeacherListProps {
  teachers: Teacher[];
  filterParams?: {
    subjects?: string[];
    days?: string[];
    time?: string;
    minPrice?: number;
    maxPrice?: number;
  };
}

export const TeacherList = ({ teachers, filterParams }: TeacherListProps) => {
  const router = useRouter();

  // ფილტრაცია
  // ყველა subject-ით ქარდები გამოჩნდება მხოლოდ იმ subjects-ზე, რაც ფილტრშია
  const filteredTeachers = teachers.filter((teacher) =>
    teacher.subjectName
      ? !filterParams?.subjects?.length ||
        filterParams.subjects.includes(teacher.subjectName)
      : true
  );

  const handleTeacherClick = (teacher: Teacher) => {
    // აქ ვამოწმებთ თუ არსებობს subjectName და ვამატებთ URL პარამეტრს
    const subjectParam = teacher.subjectName
      ? `?subject=${encodeURIComponent(teacher.subjectName)}`
      : "";

    router.push(`/dashboard/tutors/${teacher.id}${subjectParam}`);
  };

  return (
    <div className="flex flex-col md:grid gap-4 md:grid-cols-1 lg:col-span-2 xl:col-span-3 lg:grid-cols-2 mt-6 lg:mt-0 h-fit">
      {filteredTeachers.map((item, index) => (
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
                      {item.subjectName}
                    </span>
                    <span className="text-sm leading-5 text-[#080808] font-helveticaneue-medium !font-bold">
                      {item.user.firstName} {item.user.lastName}
                    </span>
                  </div>
                </div>

                <span className="bg-white  px-3 py-2 xl:px-4 xl:py-3 w-fit text-xs leading-4 font-helveticaneue-regular rounded-[40px] backdrop-blur-[24px]">
                  თბილისი
                </span>
              </div>
            </div>
          </div>
          <div className="bg-white px-4 py-3 rounded-b-2xl">
            <div className="flex flex-col">
              <span className="text-base leading-6 text-[#080808] font-helveticaneue-medium !font-bold xl:text-[20px] xl:leading-7">
                {item.subjectPrice} ლარი
                <span className="text-xs leadign-4 font-helveticaneue-regular text-[#737373] xl:text-sm xl:leading-5">
                  /საათი
                </span>
              </span>
              <span className="text-sm leading-5 text-[#737373] font-helveticaneue-regular line-clamp-2 mt-1 min-h-[40px]">
                {item.profession || "პროფესია არ არის მითითებული"}
              </span>
              <div className="flex w-full items-center mt-3">
                <div className="w-1/2 flex flex-col">
                  <span className="text-xs leading-4 text-[#737373] font-helveticaneue-regular xl:hidden">
                    ხანგრძლივობა
                  </span>
                  <span className="text-xs leading-4 text-[#737373] font-helveticaneue-regular hidden xl:inline">
                    შეხვედრის ხანგრძლივობა
                  </span>
                  <span className="text-sm leading-5 text-[#080808] font-helveticaneue-medium !font-bold">
                    2 საათი
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
                <div
                  style={{ backgroundColor: "rgba(0, 119, 255, 0.1)" }}
                  className="w-fit flex justify-center items-center py-2 px-3 rounded-[40px] h-[32px]"
                >
                  <span className="text-sm leading-5 text-[#0077FF] font-helveticaneue-regular">
                    ივანე ჯავახიშვილის უნივერსიტეტი
                  </span>
                </div>

                <div
                  style={{ backgroundColor: "rgba(0, 119, 255, 0.1)" }}
                  className="w-fit flex justify-center items-center py-2 px-3 rounded-[40px] h-[32px]"
                >
                  <span className="text-sm leading-5 text-[#0077FF] font-helveticaneue-regular">
                    {item.subjectName}
                  </span>
                </div>
              </div>
            </div>
            <hr className="mt-3 border border-[#EBECF0]" />
            <button
              className="py-[14px] w-full rounded-[40px] bg-[#F0C514] cursor-pointer mt-4 text-sm leading-5 text-[#0C0F21] font-helveticaneue-medium hover:bg-[#e6b800] transition"
              onClick={() => handleTeacherClick(item)}
            >
              დეტალურად ნახვა
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
