"use client";

import { useTeachers } from "@/hooks/useTeachers";
import SubjectSpin from "./SubjectSpin";

// საგნების სია და ფერები
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

type TeacherSubject = {
  id: string;
  name: string;
  price: number;
};

type Teacher = {
  id: string;
  teacherSubjects: TeacherSubject[];
};

// Skeleton კომპონენტი ლოდინგისთვის
const SubjectSkeleton = () => (
  <div className="hidden lg:flex bg-gray-200 animate-pulse rounded-2xl self-start h-[235px] items-center justify-center w-full xl:h-[195px]">
    <div className="w-24 h-4 bg-gray-300 rounded"></div>
  </div>
);

const SpinContent = () => {
  const { data: teacherList, isLoading, isError } = useTeachers();

  // ლოდინგისას იგივე სტრუქტურა რჩება
  if (isLoading) {
    return (
      <div className="hidden lg:flex lg:w-[35%] h-screen overflow-hidden relative xl:w-1/2 xl:gap-6 marquee-wrapper">
        {/* მარცხენა მხარე */}
        <div className="marquee xl:w-1/2 lg:w-full">
          <div className="marquee-inner">
            {[...Array(14)].map((_, i) => (
              <SubjectSkeleton key={`left-skel-${i}`} />
            ))}
          </div>
        </div>

        {/* მარჯვენა მხარე */}
        <div className="w-1/2 hidden xl:block xl:w-1/2">
          <div className="marquee-inner-scrollDown">
            {[...Array(14)].map((_, i) => (
              <SubjectSkeleton key={`right-skel-${i}`} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError) return <div>დაფიქსირდა შეცდომა</div>;

  // ვთვლით რამდენი რეპეტიტორია თითო საგანში
  const subjectCounts: Record<string, number> = {};
  (teacherList?.teachers as Teacher[]).forEach((teacher) => {
    teacher.teacherSubjects.forEach((subject) => {
      subjectCounts[subject.name] = (subjectCounts[subject.name] || 0) + 1;
    });
  });

  return (
    <div className="hidden lg:flex lg:w-[35%] h-screen overflow-hidden relative xl:w-1/2 xl:gap-6 marquee-wrapper">
      {/* მარცხენა მხარე – scroll up */}
      <div className="marquee xl:w-1/2 lg:w-full">
        <div className="marquee-inner">
          {subjectsInfo.map((item, i) => {
            const count = subjectCounts[item.name] || 0;
            return (
              <SubjectSpin
                key={i}
                subject={item.name}
                color={item.color}
                count={count}
              />
            );
          })}
          {subjectsInfo.map((item, i) => {
            const count = subjectCounts[item.name] || 0;
            return (
              <SubjectSpin
                key={`dup-left-${i}`}
                subject={item.name}
                color={item.color}
                count={count}
              />
            );
          })}
        </div>
      </div>

      {/* მარჯვენა მხარე – scroll down */}
      <div className="w-1/2 hidden xl:block xl:w-1/2">
        <div className="marquee-inner-scrollDown">
          {subjectsInfo.map((item, i) => {
            const count = subjectCounts[item.name] || 0;
            return (
              <SubjectSpin
                key={`right-${i}`}
                subject={item.name}
                color={item.color}
                count={count}
              />
            );
          })}
          {subjectsInfo.map((item, i) => {
            const count = subjectCounts[item.name] || 0;
            return (
              <SubjectSpin
                key={`right-dup-${i}`}
                subject={item.name}
                color={item.color}
                count={count}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SpinContent;
