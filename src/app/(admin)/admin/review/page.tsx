"use client";

type UserSummary = {
  firstName: string;
  lastName: string;
  email: string;
};

type ReviewItem = {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  student: UserSummary;
  teacher: UserSummary;
};

import React, { useState } from "react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useAllReviews } from "@/hooks/useAllReviews";
import { TrashFull, CloseCircle } from "react-coolicons";
import AdminNavbar from "../../../../../components/admin/AdminNavbar";

const AdminReview: React.FC = () => {
  const { user, isLoading } = useAdminAuth();
  const { data } = useAllReviews();
  const [expandedReview, setExpandedReview] = useState<string | null>(null);

  const toggleExpand = (reviewId: string) => {
    setExpandedReview(expandedReview === reviewId ? null : reviewId);
  };

  if (isLoading) {
    return (
      <div className="h-screen bg-[#081028] flex justify-center items-center text-white">
        Loading...
      </div>
    );
  }

  const reviews: ReviewItem[] = data?.reviews || [];

  return (
    <div className="min-h-screen bg-[#081028] grid grid-cols-5 px-4 py-4 gap-4">
      <AdminNavbar user={user} />

      <div className="bg-gradient-to-br from-[#0A1330] to-[#151F45] col-span-4 rounded-2xl shadow-2xl border border-[#1A2450] p-8 flex flex-col h-[calc(100vh-2rem)]">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-white">
            Reviews Management ({reviews.length})
          </h2>
        </div>

        <div className="flex-1 overflow-hidden">
          {reviews.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
              <p className="text-xl mb-2">No reviews found</p>
            </div>
          ) : (
            <ul className="h-full overflow-y-auto pr-2 custom-scrollbar space-y-4">
              {reviews.map((review: ReviewItem) => (
                <li
                  key={review.id}
                  className="text-white border border-[#2A3650] rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div
                    className="flex items-center gap-4 p-4 cursor-pointer hover:bg-[#1A2450] transition-colors"
                    onClick={() => toggleExpand(review.id)}
                  >
                    <div className="flex-1 flex flex-col justify-between h-full">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold text-white">
                            {review.student.firstName} {review.student.lastName}{" "}
                            ➜ {review.teacher.firstName}{" "}
                            {review.teacher.lastName}
                          </h3>
                          <p className="text-gray-400 text-sm">
                            Student: {review.student.email}
                          </p>
                          <p className="text-gray-400 text-sm">
                            Teacher: {review.teacher.email}
                          </p>
                        </div>

                        <div className="flex flex-col justify-between items-end h-full">
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              review.rating >= 4
                                ? "bg-green-500"
                                : "bg-yellow-500"
                            }`}
                          >
                            Rating: {review.rating}
                          </span>
                          <span className="text-gray-400 mt-2">
                            {expandedReview === review.id ? "▲" : "▼"}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-3 justify-end">
                        <button className="p-1 rounded hover:bg-red-600 transition-colors">
                          <TrashFull className="text-white" />
                        </button>
                        <button className="p-1 rounded hover:bg-gray-600 transition-colors">
                          <CloseCircle className="text-white" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {expandedReview === review.id && (
                    <div className="p-4 bg-[#0A1330] border-t border-[#2A3650] text-sm">
                      <p>
                        <span className="font-semibold">Comment:</span>{" "}
                        {review.comment || "No comment"}
                      </p>
                      <p>
                        <span className="font-semibold">Created:</span>{" "}
                        {new Date(review.createdAt).toLocaleString()}
                      </p>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminReview;
