"use client";

import { useState, useRef } from "react";
import { useClickOutside } from "@/hooks/useClickOutside";
import { FilterPanel } from "./FilterPanel";
import { Slider01 } from "react-coolicons";

interface FilterMobileModalProps {
  initialSubjects: string[];
  initialDays: string[];
  initialTime: string;
  initialMinPrice?: string;
  initialMaxPrice?: string;
}

export const FilterMobileModal: React.FC<FilterMobileModalProps> = ({
  initialSubjects,
  initialDays,
  initialTime,
  initialMinPrice,
  initialMaxPrice,
}) => {
  const [showModal, setShowModal] = useState(false);
  const modalRef = useRef<HTMLDivElement | null>(null);

  useClickOutside(modalRef, () => setShowModal(false));

  return (
    <>
      {/* Mobile Filter Button */}
      <div
        className="flex items-center gap-[10px] py-3 px-9 bg-[#EBECF0] w-fit h-fit rounded-[50px] lg:hidden"
        onClick={() => setShowModal(true)}
      >
        <Slider01 />
        <span className="text-sm leading-5 text-[#080808]">ფილტრი</span>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#00000099] lg:hidden">
          <div
            ref={modalRef}
            className="relative w-full lg:max-w-lg mx-0 lg:mx-4 rounded-t-2xl lg:rounded-2xl bg-white overflow-y-scroll h-[480px]"
          >
            <div className="mt-[22px] px-4">
              <span className="text-sm leading-5 text-[#080808]">ფილტრი</span>
            </div>
            <hr className="mt-[22px] border-[#EBECF0]" />
            <div className="mt-5 px-4">
              <FilterPanel
                initialSubjects={initialSubjects}
                initialDays={initialDays}
                initialTime={initialTime}
                initialMinPrice={initialMinPrice}
                initialMaxPrice={initialMaxPrice}
                onFiltered={() => setShowModal(false)}
              />
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="absolute top-5 right-6 text-black text-lg font-bold"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </>
  );
};
