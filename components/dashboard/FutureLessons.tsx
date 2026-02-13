"use client";

import { useEffect, useRef, useState } from "react";
import { useClickOutside } from "@/hooks/useClickOutside";
import NoContent from "../ui/NoContent";
import { LessonCreate } from "../teacher-profile/LessonCreate";
import { LessonEdit } from "../teacher-profile/LessonEdit";
import { useBookedLessons } from "@/hooks/useBookedLessons";
import toast from "react-hot-toast";
import Image from "next/image";
import { EditPencil01, TrashFull } from "react-coolicons";

// იმპორტი ორივე ინტერფეისი
import type { Lesson, BookedLesson } from "../../types/lesson";

interface FutureLessonsBoxTimeProps {
  duration?: number;
  timeLine?: string;
}

const FutureLessonsBoxTitle = ({ title }: { title: string }) => (
  <span className="text-xs leading-4 text-[#737373] font-helveticaneue-regular">
    {title}
  </span>
);

const FutureLessonsBoxTime: React.FC<FutureLessonsBoxTimeProps> = ({
  duration,
  timeLine,
}) => {
  let display = timeLine || "";

  if (duration !== undefined) {
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;

    if (hours > 0) display += `${hours} საათი`;
    if (minutes > 0)
      display += hours > 0 ? ` და ${minutes} წუთი` : `${minutes} წუთი`;
    if (!display) display = "0 წუთი";
  }

  return (
    <span className="text-sm leading-5 font-helveticaneue-regular text-[#080808]">
      {display}
    </span>
  );
};

const FutureLessonsBoxContent = ({
  teacher = false,
  lesson,
  booked = false,
  onDeleteLesson,
  onEditLesson,
}: {
  teacher?: boolean;
  lesson: Lesson | BookedLesson;
  onOpenMeetingLink: (lesson: Lesson | BookedLesson) => void;
  booked?: boolean;
  onDeleteLesson: (lessonId: string) => void;
  onEditLesson: (lesson: Lesson) => void;
}) => {
  const fullNameTeacher = `${lesson.teacher?.firstName || ""} ${
    lesson.teacher?.lastName || ""
  }`;
  const fullNameStudent = `${lesson.student?.firstName || ""} ${
    lesson.student?.lastName || ""
  }`;

  const handleAttendanceClick = () => {
    if (lesson.link) {
      window.open(lesson.link, "_blank");
    } else {
      toast.error("შეხვედრის ლინკი ჯერ არ არის მითითებული");
    }
  };

  const handleDeleteClick = async () => {
    try {
      onDeleteLesson(lesson.id);
    } catch (error) {
      console.error("Error deleting lesson:", error);
    }
  };

  const handleEditClick = () => {
    // მხოლოდ Lesson-ს შეგვიძლია ედითი, BookedLesson-ს არა
    if ("day" in lesson) {
      onEditLesson(lesson as Lesson);
    } else {
      toast.error("დაჯავშნილი გაკვეთილის რედაქტირება შეუძლებელია");
    }
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:gap-0 sm:justify-between">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-full">
          <Image
            width={44}
            height={44}
            src={
              teacher
                ? lesson?.student?.image || "/images/default-profile.png"
                : lesson?.teacher?.image || "/images/default-profile.png"
            }
            alt="user image"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col">
          <span className="text-xs leading-4 text-[#737373] font-helveticaneue-regular">
            {teacher ? fullNameStudent : fullNameTeacher}
          </span>
          <span className="text-sm leading-5 text-[#080808] font-helveticaneue-medium !font-bold">
            {lesson.subject}
          </span>
        </div>
      </div>
      {teacher && booked ? (
        <div className="flex flex-col gap-3 sm:flex-row sm:gap-2">
          <button
            className="text-sm leading-5 font-helveticaneue-regular py-3 rounded-[50px] bg-[#F0C514] text-[#080808] cursor-pointer sm:px-[34px] order-1 sm:order-2"
            onClick={handleAttendanceClick}
          >
            დასწრება
          </button>
        </div>
      ) : teacher ? (
        <div className="flex gap-3 sm:flex-row sm:gap-2">
          <button
            className="bg-[#F0C514] w-fit rounded-[48px] py-2 px-10 cursor-pointer"
            onClick={handleEditClick}
          >
            <EditPencil01 width={24} height={24} color="white" />
          </button>
          <button
            className="bg-[#D80303] w-fit rounded-[48px] py-2 px-10 cursor-pointer"
            onClick={handleDeleteClick}
          >
            <TrashFull width={24} height={24} color="white" />
          </button>
        </div>
      ) : (
        <button
          className="text-sm leading-5 font-helveticaneue-regular py-3 rounded-[50px] bg-white cursor-pointer sm:px-[34px]"
          onClick={handleAttendanceClick}
        >
          დასწრება
        </button>
      )}
    </div>
  );
};

const FutureLessonsBox = ({
  teacher = false,
  lesson,
  onOpenMeetingLink,
  booked = false,
  onDeleteLesson,
  onEditLesson,
}: {
  teacher?: boolean;
  lesson: Lesson | BookedLesson;
  onOpenMeetingLink: (lesson: Lesson | BookedLesson) => void;
  booked?: boolean;
  onDeleteLesson: (lessonId: string) => void;
  onEditLesson: (lesson: Lesson) => void;
}) => {
  const months = [
    "იანვარი",
    "თებერვალი",
    "მარტი",
    "აპრილი",
    "მაისი",
    "ივნისი",
    "ივლისი",
    "აგვისტო",
    "სექტემბერი",
    "ოქტომბერი",
    "ნოემბერი",
    "დეკემბერი",
  ];

  const date = new Date(lesson.date);
  const formattedDate = `${date.getDate()} ${months[date.getMonth()]} `;

  return (
    <div className="flex flex-col bg-[#ECF1FF] rounded-2xl p-4 gap-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:gap-2">
        <div className="flex flex-col sm:w-1/3">
          <FutureLessonsBoxTitle title="დაწყების თარიღი" />
          <FutureLessonsBoxTime timeLine={formattedDate} />
        </div>
        <div className="flex flex-col sm:w-1/3">
          <FutureLessonsBoxTitle title="შეხვედრის დრო" />
          <FutureLessonsBoxTime timeLine={lesson.time} />
        </div>
        <div className="flex flex-col sm:w-1/3">
          <FutureLessonsBoxTitle title="ხანგრძლივობა" />
          <FutureLessonsBoxTime duration={lesson.duration} />
        </div>
        <div
          className={`${lesson.price ? "flex flex-col sm:w-1/3" : "hidden"}`}
        >
          <FutureLessonsBoxTitle title="ფასი" />
          <FutureLessonsBoxTime timeLine={`${lesson.price} ₾`} />
        </div>
      </div>
      <hr className="text-[#D4D5D8]" />
      <FutureLessonsBoxContent
        teacher={teacher}
        lesson={lesson}
        onOpenMeetingLink={onOpenMeetingLink}
        booked={booked}
        onDeleteLesson={onDeleteLesson}
        onEditLesson={onEditLesson}
      />
    </div>
  );
};

const FutureLessons = ({
  teacher = false,
  teacherId = undefined,
  studentId,
}: {
  teacher?: boolean;
  teacherId?: string;
  studentId?: string;
}) => {
  const [formattedDate, setFormattedDate] = useState("");
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [meetingModalOpen, setMeetingModalOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<
    Lesson | BookedLesson | null
  >(null);
  const [selectedLessonForEdit, setSelectedLessonForEdit] =
    useState<Lesson | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const editModalRef = useRef<HTMLDivElement | null>(null);
  const meetingModalRef = useRef<HTMLDivElement | null>(null);

  useClickOutside(modalRef, () => setModalOpen(false));
  useClickOutside(editModalRef, () => setEditModalOpen(false));
  useClickOutside(meetingModalRef, () => setMeetingModalOpen(false));

  const { data: bookedLessons, isLoading: isLoadingBooked } = useBookedLessons({
    teacherId,
  });

  useEffect(() => {
    const months = [
      "იანვარი",
      "თებერვალი",
      "მარტი",
      "აპრილი",
      "მაისი",
      "ივნისი",
      "ივლისი",
      "აგვისტო",
      "სექტემბერი",
      "ოქტომბერი",
      "ნოემბერი",
      "დეკემბერი",
    ];

    const today = new Date();
    const formatted = `${today.getDate()} ${
      months[today.getMonth()]
    } ${today.getFullYear()}`;
    setFormattedDate(formatted);
  }, []);

  useEffect(() => {
    const fetchLessons = async () => {
      if (!studentId && !teacher) return;

      try {
        const url = teacher
          ? `/api/teachers/lessons?teacherId=${teacherId}`
          : `/api/book-lesson/booked-lessons?studentId=${studentId}`;

        const res = await fetch(url);

        if (!res.ok) throw new Error("Failed to fetch");

        const data: Lesson[] = await res.json();

        // დღევანდელი თარიღი 00:00-ზე (რათა გამარტივდეს შედარება)
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // მხოლოდ მომავალი ან დღევანდელი გაკვეთილები
        const upcomingLessons = data.filter((lesson) => {
          const lessonDate = new Date(lesson.date);
          lessonDate.setHours(0, 0, 0, 0);
          return lessonDate >= today;
        });

        setLessons(upcomingLessons);
      } catch (error) {
        console.error("Error fetching lessons:", error);
      }
    };
    fetchLessons();
  }, [teacher, studentId, teacherId]);

  const handleOpenMeetingLink = (lesson: Lesson | BookedLesson) => {
    setSelectedLesson(lesson);
    setMeetingModalOpen(true);
  };

  const handleDeleteLesson = async (lessonId: string) => {
    try {
      const res = await fetch("/api/teachers/deleteLesson", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ lessonId }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to delete lesson");
      }

      // წაშლის შემდეგ განაახლე სია
      setLessons((prev) => prev.filter((lesson) => lesson.id !== lessonId));
      toast.success("გაკვეთილი წარმატებით წაიშალა");
    } catch (error) {
      console.error("Error deleting lesson:", error);
      toast.error("გაკვეთილის წაშლა ვერ მოხერხდა");
    }
  };

  const handleEditLesson = (lesson: Lesson) => {
    setSelectedLessonForEdit(lesson);
    setEditModalOpen(true);
  };

  const handleLessonUpdated = (updatedLesson: Lesson) => {
    setLessons((prev) =>
      prev.map((lesson) =>
        lesson.id === updatedLesson.id ? updatedLesson : lesson
      )
    );
    toast.success("გაკვეთილი წარმატებით განახლდა");
  };

  const handleLessonCreated = (newLesson: Lesson) => {
    setLessons((prev) => [...prev, newLesson]);
  };

  // ✅ ყველა დაჯავშნილი გაკვეთილი (ფილტრაციის გარეშე)
  const allBookedLessons = bookedLessons || [];

  // Debug log
  console.log("Booked lessons data:", {
    allBookedLessons,
    isLoadingBooked,
    teacherId,
  });

  return (
    <div
      className={`${
        teacher
          ? "lg:grid lg:grid-cols-1 gap-4 xl:grid-cols-2"
          : "xl:grid-cols-1"
      }`}
    >
      {/* პირველი ბლოკი - დაჯავშნილი გაკვეთილები */}
      <div
        className={`mt-4 bg-white rounded-2xl p-5 flex flex-col gap-4 overflow-y-auto lg:mt-0 xl:col-span-1 h-fit max-h-[644px] xl:max-h-[680px] ${
          !teacher && "hidden"
        }`}
        style={{ boxShadow: "0px 2px 5px 0px rgba(0,0,0,0.05)" }}
      >
        <div className="flex flex-col gap-1">
          <span className="text-xl leading-7 text-[#0C0F21] font-helveticaneue-medium !font-bold">
            {formattedDate}
          </span>
          <span className="text-sm leading-5 text-[#737373] font-helveticaneue-regular">
            დაჯავშნილი გაკვეთილები ({allBookedLessons.length})
          </span>
        </div>
        <hr className="text-[#EBECF0]" />

        {isLoadingBooked ? (
          <div>იტვირთება...</div>
        ) : teacher ? (
          <>
            {allBookedLessons.length === 0 ? (
              <NoContent
                desc="ჯერ არ გაქვთ დაჯავშნილი გაკვეთილები"
                needBtn={false}
              />
            ) : (
              allBookedLessons.map((lesson) => (
                <FutureLessonsBox
                  key={lesson.id}
                  teacher={teacher}
                  lesson={lesson}
                  onOpenMeetingLink={handleOpenMeetingLink}
                  booked={true}
                  onDeleteLesson={handleDeleteLesson}
                  onEditLesson={handleEditLesson}
                />
              ))
            )}
          </>
        ) : null}
      </div>

      {/* მეორე ბლოკი - შექმნილი გაკვეთილები */}
      <div
        className="mt-4 bg-white rounded-2xl p-5 flex flex-col gap-4 overflow-y-auto lg:mt-0 xl:col-span-1 h-fit max-h-[644px] xl:max-h-[680px]"
        style={{ boxShadow: "0px 2px 5px 0px rgba(0,0,0,0.05)" }}
      >
        <div className="flex sm:justify-between sm:items-center flex-col items-start sm:flex-row gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-xl leading-7 text-[#0C0F21] font-helveticaneue-medium !font-bold">
              {formattedDate}
            </span>
            <span className="text-sm leading-5 text-[#737373] font-helveticaneue-regular">
              აქტიური გაკვეთილები ({lessons.length})
            </span>
          </div>
          {teacher && (
            <button
              className="text-sm leading-5 font-helveticaneue-medium py-3 w-full bg-[#8144FF] sm:w-fit sm:px-6 rounded-[50px] cursor-pointer text-[#fff]"
              onClick={() => setModalOpen(true)}
            >
              გაკვეთილის ჩანიშვნა
            </button>
          )}
        </div>
        <hr className="text-[#EBECF0]" />

        <div className="flex flex-col gap-2">
          {lessons.length === 0 ? (
            <NoContent
              desc="არ გაქვთ გაკვეთილი, გთხოვთ ჩანიშნოთ გაკვეთილი"
              needBtn={false}
            />
          ) : (
            lessons.map((lesson) => (
              <FutureLessonsBox
                key={lesson.id}
                teacher={teacher}
                lesson={lesson}
                onOpenMeetingLink={handleOpenMeetingLink}
                onDeleteLesson={handleDeleteLesson}
                onEditLesson={handleEditLesson}
              />
            ))
          )}
        </div>

        {/* გაკვეთილის შექმნის მოდალი */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-end lg:items-center justify-center bg-[#00000099]">
            <div
              ref={modalRef}
              className="relative w-full lg:max-w-lg mx-0 lg:mx-4 rounded-t-2xl lg:rounded-2xl bg-white overflow-auto h-[570px] lg:h-[592px]"
            >
              <LessonCreate
                teacherId={teacherId}
                setModalOpen={setModalOpen}
                onLessonCreated={handleLessonCreated}
              />
              <button
                onClick={() => setModalOpen(false)}
                className="absolute top-3 right-6 text-black text-lg font-bold"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* გაკვეთილის რედაქტირების მოდალი */}
        {editModalOpen && selectedLessonForEdit && (
          <div className="fixed inset-0 z-50 flex items-end lg:items-center justify-center bg-[#00000099]">
            <div
              ref={editModalRef}
              className="relative w-full lg:max-w-lg mx-0 lg:mx-4 rounded-t-2xl lg:rounded-2xl bg-white overflow-auto h-[570px] lg:h-[592px]"
            >
              <LessonEdit
                lesson={selectedLessonForEdit}
                teacherId={teacherId}
                setModalOpen={setEditModalOpen}
                onLessonUpdated={handleLessonUpdated}
              />
              <button
                onClick={() => setEditModalOpen(false)}
                className="absolute top-3 right-6 text-black text-lg font-bold"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* შეხვედრის ლინკის მოდალი */}
        {meetingModalOpen && selectedLesson && (
          <div className="fixed inset-0 z-50 flex items-end lg:items-center justify-center bg-[#00000099]">
            <div
              ref={meetingModalRef}
              className="relative w-full lg:max-w-lg mx-0 lg:mx-4 rounded-t-2xl lg:rounded-2xl bg-white overflow-auto h-[400px] lg:h-[420px]"
            >
              <button
                onClick={() => setMeetingModalOpen(false)}
                className="absolute top-3 right-6 text-black text-lg font-bold"
              >
                ×
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FutureLessons;
