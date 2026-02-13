"use client";

import { useTeachers } from "@/hooks/useTeachers";
import { SectionHeader } from "../ui/Text";
import { Folders } from "react-coolicons";

// Types
type TeacherSubject = {
  id: string;
  name: string;
  price: number;
};

type Teacher = {
  id: string;
  teacherSubjects: TeacherSubject[];
  // სხვა საჭირო ველები შეგიძლიათ დაამატოთ
};

// subjects array
const subjectsInfo = [
  { name: "მათემატიკა", color: "#FFD52A" },
  { name: "ქართული", color: "#8FF2B3" },
  { name: "ისტორია", color: "#F15A24" },
  { name: "გეოგრაფია", color: "#FF7FFE" },
  { name: "ქიმია", color: "#FFEFCE" },
  { name: "ფიზიკა", color: "#94EB60" },
  { name: "ბიოლოგია", color: "#6947FF" },
  { name: "ხელოვნება", color: "#C69C6B" },
  { name: "ინგლისური", color: "#9859C7" },
  { name: "რუსული", color: "#6FC3E2" },
  { name: "გერმანული", color: "#F6A69A" },
  { name: "ესპანური", color: "#63D49C" },
  { name: "ფრანგული", color: "#60A5FA" },
  { name: "დაწყებითი კლასები", color: "#22C55E" },
];

const SubjectDiscover = () => {
  const { data: teacherList, isLoading, isError } = useTeachers();

  if (isLoading) return <div>ჩატვირთვა...</div>;
  if (isError) return <div>გაიშვება შეცდომა</div>;

  // Flatten subjects from teachers
  const subjectCounts: Record<string, number> = {};
  (teacherList?.teachers as Teacher[]).forEach((teacher) => {
    teacher.teacherSubjects.forEach((subject) => {
      subjectCounts[subject.name] = (subjectCounts[subject.name] || 0) + 1;
    });
  });

  return (
    <div className="pt-8 sm:pt-[57px] md:pt-[135px] lg:pt-[76px] xl:pt-[80px] 2xl:pt-[64px] 3xl:pt-[84px]">
      <SectionHeader
        title="აღმოაჩინეთ სასურველი რეპეტიტორი 
თქვენთვის სასურველ საგანში"
        description=""
      />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {subjectsInfo.map((item, index) => {
          const count = subjectCounts[item.name] || 0;
          return (
            <div
              key={index}
              className="rounded-3xl flex flex-col items-center gap-6 p-6"
              style={{ backgroundColor: item?.color }}
            >
              <div className="rounded-full bg-white p-[14px]">
                <Folders width={24} height={24} color="black" />
              </div>
              <div className="flex flex-col items-center gap-2">
                <h3 className="text-base leading-6 uppercase font-helveticaneue-medium !font-bold text-[#0C0F21]">
                  {item?.name}
                </h3>
                <span className="text-[#0C0F21] text-sm leading-5 font-helveticaneue-regular">
                  {count > 0
                    ? `${count} ვერიფიცირებული რეპეტიტორი`
                    : "რეპეტიტორი მალე დაემატება"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SubjectDiscover;
