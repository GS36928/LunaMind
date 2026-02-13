// components/teacher-profile/LessonEdit.tsx
"use client";

import { useClickOutside } from "@/hooks/useClickOutside";
import React, { useEffect, useRef, useState } from "react";
import { AddPlus, CaretDownSm, CaretUpSm, TrashFull } from "react-coolicons";
import toast from "react-hot-toast";
import type { Lesson } from "../../types/lesson";

const days = [
  "ორშაბათი",
  "სამშაბათი",
  "ოთხშაბათი",
  "ხუთშაბათი",
  "პარასკევი",
  "შაბათი",
  "კვირა",
];

interface TeacherSubject {
  id: string;
  name: string;
  price: number;
}

interface LessonEditProps {
  lesson: Lesson;
  teacherId?: string;
  setModalOpen?: (open: boolean) => void;
  onLessonUpdated?: (lesson: Lesson) => void;
}

export const LessonEdit: React.FC<LessonEditProps> = ({
  lesson,
  teacherId,
  setModalOpen,
  onLessonUpdated,
}) => {
  const [subjects, setSubjects] = useState<TeacherSubject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(
    lesson.subject
  );
  const [selectedTimes, setSelectedTimes] = useState<
    { day: string; start: string; end: string }[]
  >([
    {
      day: lesson.day,
      start: lesson.time,
      end: calculateEndTime(lesson.time, lesson.duration),
    },
  ]);
  const [comment, setComment] = useState(lesson.comment || "");
  const [meetingLink, setMeetingLink] = useState(lesson.link || "");
  const [openSubject, setOpenSubject] = useState(false);
  const subjectRef = useRef<HTMLDivElement>(null);

  useClickOutside(subjectRef, () => setOpenSubject(false));

  const timeRegex = /^(?:[01]\d|2[0-3]):[0-5]\d$/;

  // Helper function to calculate end time from start time and duration
  function calculateEndTime(start: string, duration: number): string {
    const [startH, startM] = start.split(":").map(Number);
    const startTotal = startH * 60 + startM;
    const endTotal = startTotal + duration;

    const endH = Math.floor(endTotal / 60);
    const endM = endTotal % 60;

    return `${endH.toString().padStart(2, "0")}:${endM
      .toString()
      .padStart(2, "0")}`;
  }

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await fetch("/api/teachers/subjects");
        if (!res.ok) throw new Error("Failed to fetch subjects");
        const data: TeacherSubject[] = await res.json();
        setSubjects(data);
      } catch (error) {
        console.error(error);
        toast.error("საგნების ჩამოტვირთვა ვერ მოხერხდა");
      }
    };
    fetchSubjects();
  }, []);

  const addTimeRow = () => {
    setSelectedTimes((prev) => [
      ...prev,
      { day: "", start: "16:00", end: "17:00" },
    ]);
  };

  const removeTimeRow = (index: number) => {
    setSelectedTimes((prev) => {
      if (prev.length === 1) {
        toast.error("მინიმუმ ერთი განრიგი აუცილებელია");
        return prev;
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleTimeChange = (
    index: number,
    field: "day" | "start" | "end",
    value: string
  ) => {
    const cleanValue = field === "day" ? value : value.replace(/[^0-9:]/g, "");
    setSelectedTimes((prev) =>
      prev.map((row, i) => {
        if (i !== index) return row;
        const newRow = { ...row, [field]: cleanValue };
        if (newRow.start.match(timeRegex) && newRow.end.match(timeRegex)) {
          const [startH, startM] = newRow.start.split(":").map(Number);
          const [endH, endM] = newRow.end.split(":").map(Number);
          const startTotal = startH * 60 + startM;
          const endTotal = endH * 60 + endM;
          if (startTotal > endTotal) {
            if (field === "start") newRow.end = newRow.start;
            if (field === "end") newRow.start = newRow.end;
          }
        }
        return newRow;
      })
    );
  };

  const calculateDuration = (start: string, end: string) => {
    const [startH, startM] = start.split(":").map(Number);
    const [endH, endM] = end.split(":").map(Number);
    return endH * 60 + endM - (startH * 60 + startM);
  };

  const isRowValid = (row: { day: string; start: string; end: string }) =>
    row.day && timeRegex.test(row.start) && timeRegex.test(row.end);

  const isSubmitDisabled =
    !teacherId ||
    !selectedSubject ||
    !meetingLink ||
    selectedTimes.length === 0 ||
    selectedTimes.some((row) => !isRowValid(row));

  const handleSubmit = async () => {
    if (isSubmitDisabled) {
      toast.error("გთხოვთ შეავსოთ ყველა ველი სწორად");
      return;
    }

    try {
      const uniqueDays = [...new Set(selectedTimes.map((row) => row.day))];

      const payload = {
        lessonId: lesson.id,
        teacherId,
        subject: selectedSubject,
        days: uniqueDays,
        time: selectedTimes[0].start,
        duration: calculateDuration(
          selectedTimes[0].start,
          selectedTimes[0].end
        ),
        comment: comment || undefined,
        link: meetingLink,
      };

      const res = await fetch("/api/teachers/updateLesson", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json();
        console.error("API Error:", error);
        toast.error(error.error || "გაკვეთილის განახლება ვერ მოხერხდა");
        return;
      }

      const updatedLesson: Lesson = await res.json();

      if (onLessonUpdated) {
        onLessonUpdated(updatedLesson);
      }

      if (setModalOpen) setModalOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("შეცდომა მოხდა");
    }
  };

  return (
    <div className="mt-6 w-full h-fit">
      <span className="font-helveticaneue-medium !font-bold px-4">
        გაკვეთილის რედაქტირება
      </span>
      <hr className="mt-4 text-[#EBECF0]" />

      {/* SUBJECT */}
      <div className="relative mt-4 px-4" ref={subjectRef}>
        <button
          onClick={() => setOpenSubject(!openSubject)}
          className={`w-full text-left border border-[#F1F1F1] p-3 bg-white flex justify-between items-center cursor-pointer
            ${openSubject ? "rounded-t-xl border-b-0" : "rounded-xl"}`}
        >
          <span className="text-sm leading-5 text-black font-helveticaneue-medium break-words whitespace-normal">
            {selectedSubject || "აირჩიეთ გაკვეთილი"}
          </span>
          <span>{openSubject ? <CaretUpSm /> : <CaretDownSm />}</span>
        </button>
        {openSubject && (
          <div className="absolute inset-x-4 bg-white border border-[#F1F1F1] max-h-60 overflow-y-auto z-100 rounded-b-xl">
            {subjects.map((subject) => (
              <div
                key={subject.id}
                onClick={() => {
                  setSelectedSubject(subject.name);
                  setOpenSubject(false);
                }}
                className="p-3 cursor-pointer hover:bg-gray-100 text-sm break-words"
              >
                {subject.name}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* COMMENT */}
      <div className="mt-4 px-4">
        <div className="border border-[#F1F1F1] rounded-xl relative overflow-hidden">
          <p className="text-xs leading-4 font-helveticaneue-regular absolute left-3 pt-[10px] text-[#737373] z-20 bg-white">
            აღწერა (სურვილისამებრ)
          </p>
          <textarea
            placeholder="შეიყვანეთ კომენტარი (სურვილისამებრ)"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full px-3 pt-[26px] text-sm font-helveticaneue-medium text-[#080808] bg-white focus:outline-none placeholder-gray-400 resize-none h-24"
          />
        </div>
      </div>

      {/* TIMES */}
      <div className="mt-4 px-4">
        <div className="flex justify-between items-center">
          <span className="text-sm leading-5 font-helveticaneue-regular text-[#737373]">
            შეხვედრის დრო
          </span>
          <button onClick={addTimeRow} className="flex items-center gap-1">
            <AddPlus color="#0077FF" width={20} height={20} />
            <span className="text-sm leading-5 text-[#0077FF] font-helveticaneue-regular">
              ახალი განრიგი
            </span>
          </button>
        </div>

        {selectedTimes.map((row, index) => (
          <div key={index} className="flex items-center gap-2 mt-3">
            <select
              value={row.day}
              onChange={(e) => handleTimeChange(index, "day", e.target.value)}
              className="flex-1 border border-[#EBECF0] focus:outline-0 rounded-xl px-3 py-3 bg-white text-sm leading-5 text-[#000000] font-helveticaneue-medium"
            >
              <option value="">დღე</option>
              {days.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="დაწყება hh:mm"
              value={row.start}
              onChange={(e) => handleTimeChange(index, "start", e.target.value)}
              className="w-24 border border-[#EBECF0] focus:outline-0 rounded-xl px-3 py-3 bg-white text-sm leading-5 text-[#000000] font-helveticaneue-medium placeholder:text-[#A1A1A1]"
            />

            <input
              type="text"
              placeholder="დასრულება hh:mm"
              value={row.end}
              onChange={(e) => handleTimeChange(index, "end", e.target.value)}
              className="w-24 border border-[#EBECF0] focus:outline-0 rounded-xl px-3 py-3 bg-white text-sm leading-5 text-[#000000] font-helveticaneue-medium placeholder:text-[#A1A1A1]"
            />

            <button onClick={() => removeTimeRow(index)}>
              <TrashFull color="#D80303" width={24} height={24} />
            </button>
          </div>
        ))}
      </div>

      {/* MEETING LINK */}
      <div className="mt-4 px-4">
        <div className="border border-[#F1F1F1] rounded-xl relative overflow-hidden">
          <p className="text-xs leading-4 font-helveticaneue-regular absolute left-3 pt-[10px] text-[#737373] z-20 bg-white">
            შეხვედრის ლინკი
          </p>
          <textarea
            placeholder="შეიყვანეთ შეხვედრის ლინკი"
            value={meetingLink}
            onChange={(e) => setMeetingLink(e.target.value)}
            className="w-full px-3 pt-[26px] text-sm font-helveticaneue-medium text-[#0077FF] bg-white focus:outline-none placeholder-gray-400 resize-none h-24"
          />
        </div>
      </div>

      {/* SUBMIT */}
      <div className="px-4">
        <button
          onClick={handleSubmit}
          disabled={isSubmitDisabled}
          className={`mt-5 w-full py-3 rounded-xl font-helveticaneue-medium text-white transition ${
            !isSubmitDisabled
              ? "bg-[#F0C514] hover:bg-[#e6b800]"
              : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          განახლება
        </button>
      </div>
    </div>
  );
};
