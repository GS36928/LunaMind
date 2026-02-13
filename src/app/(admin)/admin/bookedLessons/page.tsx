"use client";

import React from "react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import AdminNavbar from "../../../../../components/admin/AdminNavbar";
import { useAllBookedLessons } from "@/hooks/useAllBookedLessons";

type BookedLesson = {
  id: string;
  date: string;
  duration: number;
  price: number;
  status: string;
  createdAt: string;

  student: {
    firstName: string;
    lastName: string;
    email: string;
  };

  teacher: {
    firstName: string;
    lastName: string;
    email: string;
  };
};

const AdminBookedLessons = () => {
  const { user, isLoading: authLoading } = useAdminAuth();
  const { data, isLoading: lessonsLoading, isError } = useAllBookedLessons();

  if (authLoading) {
    return (
      <div className="h-screen bg-[#081028] flex justify-center items-center text-white">
        Loading...
      </div>
    );
  }

  const lessons: BookedLesson[] = data?.lessons ?? [];

  return (
    <div className="min-h-screen bg-[#081028] grid grid-cols-5 px-4 py-4 gap-4">
      <AdminNavbar user={user} />

      <div className="bg-gradient-to-br from-[#0A1330] to-[#151F45] col-span-4 rounded-2xl shadow-2xl border border-[#1A2450] p-8 flex flex-col h-[calc(100vh-2rem)]">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-white">
            Booked Lessons ({lessons.length})
          </h2>
        </div>

        {/* Loading State */}
        {lessonsLoading && (
          <div className="flex-1 flex items-center justify-center text-gray-300">
            Loading booked lessons...
          </div>
        )}

        {/* Error State */}
        {isError && !lessonsLoading && (
          <div className="flex-1 flex items-center justify-center text-red-400">
            Failed to load booked lessons
          </div>
        )}

        {!lessonsLoading && !isError && (
          <div className="flex-1 overflow-hidden">
            {lessons.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400">
                <p className="text-xl mb-2">No booked lessons found</p>
              </div>
            ) : (
              <ul className="h-full overflow-y-auto pr-2 custom-scrollbar space-y-4">
                {lessons.map((lesson) => (
                  <li
                    key={lesson.id}
                    className="text-white border border-[#2A3650] rounded-xl p-5 hover:shadow-xl transition-all bg-[#0F1738]/50"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-xl font-semibold">
                          {lesson.student.firstName} {lesson.student.lastName}
                        </h3>
                        <p className="text-sm text-gray-400">
                          Student: {lesson.student.email}
                        </p>

                        <p className="text-sm mt-1 text-gray-300">
                          Teacher: {lesson.teacher.firstName}{" "}
                          {lesson.teacher.lastName} ({lesson.teacher.email})
                        </p>

                        <p className="text-sm text-gray-400 mt-2">
                          Date: {new Date(lesson.date).toLocaleString()}
                        </p>

                        <p className="text-sm text-gray-400">
                          Duration: {lesson.duration} min
                        </p>

                        <p className="text-sm text-gray-300 mt-2 font-medium">
                          Price: ${lesson.price}
                        </p>

                        <p className="text-sm text-blue-300 mt-2">
                          Status: {lesson.status}
                        </p>
                      </div>

                      <div className="flex flex-col items-end">
                        <span className="text-xs text-gray-500">
                          Created:{" "}
                          {new Date(lesson.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBookedLessons;
