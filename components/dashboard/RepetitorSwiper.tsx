"use client";

import { ChevronLeftMd, ChevronRightMd, WavyCheck } from "react-coolicons";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Image from "next/image";
import { useRouter } from "next/navigation";
import RepetitorSwiperLoading from "../loading/RepetitorSwiperLoading";
import { useTeachers } from "@/hooks/useTeachers";
import { getLessonDuration } from "@/utils/helperFunc";

interface Teacher {
  id: string;
  user: {
    firstName: string;
    lastName: string;
    image?: string;
  };
  teacherSubjects: {
    name: string;
    price: number;
  }[];
  lessons: {
    day: string;
    time: string;
    duration: number;
  }[];
  rating?: number;
  profession: string;
}

const RepetitorSwiper = () => {
  const router = useRouter();
  const { data, isLoading } = useTeachers();

  if (isLoading) return <RepetitorSwiperLoading />;

  const teachers: Teacher[] = data?.teachers || [];

  // Create a slide for each subject if teacher has at least one lesson
  const slides = teachers.flatMap((teacher) =>
    teacher.teacherSubjects
      .map((subject) => {
        if (teacher.lessons.length === 0) return null; // skip if no lessons

        return {
          ...teacher,
          subjectName: subject.name,
          subjectPrice: subject.price,
        };
      })
      .filter((slide): slide is NonNullable<typeof slide> => slide !== null)
  );

  return (
    <div
      className="mt-4 bg-white rounded-2xl lg:mt-0"
      style={{ boxShadow: "0px 2px 5px 0px rgba(0,0,0,0.05)" }}
    >
      {/* Header with title + custom nav buttons */}
      <div className="flex justify-between items-center mb-4 px-5 pt-5 gap-1.5">
        <span className="text-sm leading-5 text-[#737373] font-helveticaneue-regular">
          შემოთავაზებული რეპეტიტორები
        </span>
        <div className="flex gap-3">
          <button className="custom-prev p-[10px] bg-[#EBECF0] rounded-[40px] flex items-center justify-center">
            <ChevronLeftMd className="text-[#080808]" />
          </button>
          <button className="custom-next p-[10px] bg-[#EBECF0] rounded-[40px] flex items-center justify-center">
            <ChevronRightMd className="text-[#080808]" />
          </button>
        </div>
      </div>

      <div className="w-full max-w-[1920px] 3xl:mx-auto overflow-hidden pb-5">
        <Swiper
          modules={[Navigation]}
          spaceBetween={16}
          slidesPerView={1.2}
          slidesOffsetBefore={10}
          slidesOffsetAfter={10}
          navigation={{
            nextEl: ".custom-next",
            prevEl: ".custom-prev",
          }}
          breakpoints={{
            320: {
              slidesPerView: 1,
              slidesOffsetBefore: 10,
              slidesOffsetAfter: 10,
            },
            400: {
              slidesPerView: 1.2,
              slidesOffsetBefore: 10,
              slidesOffsetAfter: 10,
            },
            500: {
              slidesPerView: 1.5,
              slidesOffsetBefore: 10,
              slidesOffsetAfter: 10,
            },
            640: {
              slidesPerView: 1.7,
              slidesOffsetBefore: 16,
              slidesOffsetAfter: 16,
            },
            768: {
              slidesPerView: 2.1,
              slidesOffsetBefore: 16,
              slidesOffsetAfter: 16,
            },
            1024: {
              slidesPerView: 2.7,
              spaceBetween: 24,
              slidesOffsetBefore: 16,
              slidesOffsetAfter: 16,
            },
            1124: {
              slidesPerView: 2.7,
              spaceBetween: 24,
              slidesOffsetBefore: 16,
              slidesOffsetAfter: 16,
            },
            1280: {
              slidesPerView: 2.3,
              spaceBetween: 24,
              slidesOffsetBefore: 16,
              slidesOffsetAfter: 16,
            },
            1380: {
              slidesPerView: 2.4,
              spaceBetween: 24,
              slidesOffsetBefore: 16,
              slidesOffsetAfter: 16,
            },
            1480: {
              slidesPerView: 2.6,
              spaceBetween: 24,
              slidesOffsetBefore: 16,
              slidesOffsetAfter: 16,
            },
            1536: {
              slidesPerView: 2.8,
              spaceBetween: 24,
              slidesOffsetBefore: 16,
              slidesOffsetAfter: 16,
            },
            1920: { slidesPerView: 3.2, spaceBetween: 24 },
          }}
        >
          {slides.map((teacher) => {
            const fullName = `${teacher.user.firstName} ${teacher.user.lastName}`;
            const price = teacher.subjectPrice || 0;
            const subjectName = teacher.subjectName || "საგანი";

            return (
              <SwiperSlide
                key={`${teacher.id}-${subjectName}`}
                className="hover:shadow-md transition-shadow"
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
                            src={
                              teacher.user.image ||
                              "/images/default-profile.png"
                            }
                            alt={fullName}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs leading-4 text-[#737373] font-helveticaneue-regular">
                            {subjectName}
                          </span>
                          <span className="text-sm leading-5 text-[#080808] font-helveticaneue-medium !font-bold">
                            {fullName}
                          </span>
                        </div>
                      </div>

                      <span className="bg-white px-3 py-2 xl:px-4 xl:py-3 w-fit text-xs leading-4 font-helveticaneue-regular rounded-[40px] backdrop-blur-[24px]">
                        თბილისი
                      </span>
                    </div>
                  </div>
                </div>
                <div className="bg-white px-4 py-3 rounded-b-2xl border border-[#EBECF0]">
                  <div className="flex flex-col">
                    <span className="text-base leading-6 text-[#080808] font-helveticaneue-medium !font-bold xl:text-[20px] xl:leading-7">
                      {price} ლარი
                      <span className="text-xs leadign-4 font-helveticaneue-regular text-[#737373] xl:text-sm xl:leading-5">
                        /საათი
                      </span>
                    </span>
                    <span className="text-sm leading-5 text-[#737373] font-helveticaneue-regular line-clamp-2 mt-1 min-h-[40px]">
                      {teacher?.profession || "პროფესია არ არის მითითებული"}
                    </span>
                    <div className="flex w-full items-center mt-3">
                      <div className="w-1/2 flex flex-col">
                        <span className="text-xs leading-4 text-[#737373] font-helveticaneue-regular">
                          ხანგრძლივობა
                        </span>
                        <span className="text-sm leading-5 text-[#080808] font-helveticaneue-medium !font-bold">
                          {getLessonDuration(teacher?.lessons[0]?.duration)}
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
                    <div className="mt-2 h-[72px] overflow-hidden flex gap-2 flex-wrap">
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
                          {subjectName}
                        </span>
                      </div>
                    </div>
                  </div>
                  <hr className="mt-3 border border-[#EBECF0]" />
                  <button
                    className="py-[14px] w-full rounded-[40px] bg-[#F0C514] cursor-pointer mt-4 text-sm leading-5 text-[#0C0F21] font-helveticaneue-medium hover:bg-[#e6b800] transition"
                    onClick={() =>
                      router.push(
                        `/dashboard/tutors/${
                          teacher.id
                        }?subject=${encodeURIComponent(teacher.subjectName)}`
                      )
                    }
                  >
                    დეტალურად ნახვა
                  </button>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </div>
  );
};

export default RepetitorSwiper;
