"use client";

import { useTeachers } from "@/hooks/useTeachers";
import Image from "next/image";

type Teacher = {
  id: string;
  user: {
    id: string;
    image: string | null;
  };
};

const Tutors = () => {
  const { data, isLoading } = useTeachers();

  const teacherWithImage =
    data?.teachers?.filter((teacher: Teacher) =>
      Boolean(teacher.user?.image)
    ) ?? [];

  const randomFiveTeachers = [...teacherWithImage]
    .sort(() => Math.random() - 0.5)
    .slice(0, 5);

  return (
    <>
      <div className="flex items-center justify-center gap-3 pt-6 pb-6 lg:pb-4 3xl:pb-6 lg:pt-0">
        <div className="flex items-center">
          {isLoading ? (
            <div className="animate-pulse bg-gray-200 w-[52px] h-[52px] rounded-full"></div>
          ) : (
            randomFiveTeachers.map((teacher, index) => (
              <div
                key={index}
                className={`-ml-6 w-[52px] h-[52px] border-4 border-white rounded-full overflow-hidden lg:w-[45px] lg:h-[45px] xl:w-[52px] xl:h-[52px]
              ${index === 0 ? "ml-0" : ""} 
              ${index === 4 ? "block lg:hidden xl:block" : ""}`}
              >
                <Image
                  alt={teacher.user.id}
                  src={teacher.user.image!}
                  width={52}
                  height={52}
                />
              </div>
            ))
          )}
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="font-spacegrotesk-bold text-[#0C0F21] text-2xl leading-6">
            {isLoading ? "8" : data?.teachers?.length}+
          </span>
          <span className="text-xs leading-4 text-[#939393] font-helveticaneue-regular">
            რეპეტიტორი
          </span>
        </div>
      </div>
      <div className="w-full text-center text-xs leading-4 font-helveticaneue-regular text-[#737373]  hidden lg:block pb-3 3xl:pb-4">
        აირჩიე სასურველი საგანი და დაიწყე ონლაინ მომზადება
      </div>
    </>
  );
};

export default Tutors;
