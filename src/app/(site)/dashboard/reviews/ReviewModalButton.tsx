"use client";

import { useState, useRef } from "react";
import { useClickOutside } from "@/hooks/useClickOutside";
import Review from "../../../../../components/dashboard/Review";

interface ReviewModalButtonProps {
  studentId: string;
}

export default function ReviewModalButton({
  studentId,
}: ReviewModalButtonProps) {
  const [showModal, setShowModal] = useState(false);

  const modalRef = useRef<HTMLDivElement | null>(null);

  useClickOutside(modalRef, () => setShowModal(false));

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="text-sm leading-5 text-[#080808] font-helveticaneue-medium w-full py-4 bg-[#F0C514] rounded-xl sm:w-fit sm:px-9 cursor-pointer"
      >
        შეფასების გაკეთება
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-end lg:items-center justify-center bg-[#00000099]">
          <div
            ref={modalRef}
            className="relative w-full lg:max-w-lg lg:w-full mx-0 lg:mx-4 rounded-t-2xl lg:rounded-2xl bg-white overflow-auto h-[570px] lg:h-[592px]"
          >
            <Review
              isModal={true}
              studentId={studentId}
              onSuccess={() => setShowModal(false)}
            />
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-6 text-black text-lg font-bold"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </>
  );
}
