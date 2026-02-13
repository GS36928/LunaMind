import React from "react";
import { ChevronLeftMd, ChevronRightMd } from "react-coolicons";

const RepetitorSwiperLoading = () => {
  return (
    <div
      className="mt-4 bg-white rounded-2xl lg:mt-0 p-5"
      style={{ boxShadow: "0px 2px 5px 0px rgba(0,0,0,0.05)" }}
    >
      {/* Header with title + custom nav buttons */}
      <div className="flex justify-between items-center mb-4 px-5 pt-5 gap-1.5">
        <span className="text-sm leading-5 text-[#737373] font-helveticaneue-regular">
          შემოთავაზებული რეპეტიტორები
        </span>
        <div className="flex gap-3">
          <button className="p-[10px] bg-[#EBECF0] rounded-[40px] flex items-center justify-center">
            <ChevronLeftMd className="text-[#080808]" />
          </button>
          <button className="p-[10px] bg-[#EBECF0] rounded-[40px] flex items-center justify-center">
            <ChevronRightMd className="text-[#080808]" />
          </button>
        </div>
      </div>

      {/* Loading Swiper */}
      <div className="w-full max-w-[1920px] 3xl:mx-auto overflow-hidden pb-5">
        <div className="animate-pulse">
          <div className="flex gap-4 px-5">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="p-4 border border-[#EBECF0] rounded-[12px] w-full flex flex-col min-w-[280px]"
              >
                <div className="flex justify-between w-full items-center">
                  <div className="w-[44px] h-[44px] bg-gray-200 rounded-full"></div>
                  <div className="flex flex-col text-end gap-1">
                    <div className="h-4 bg-gray-200 rounded w-12"></div>
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
                <div className="mt-3 flex flex-col gap-3">
                  <div className="flex flex-col">
                    <div className="h-3 bg-gray-200 rounded w-16 mb-1"></div>
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                  </div>
                  <div className="space-y-1">
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="text-[#EBECF0] mt-5 pb-3">
                  <hr />
                </div>
                <div className="flex flex-col">
                  <div className="h-3 bg-gray-200 rounded w-20 mb-1"></div>
                  <div className="h-4 bg-gray-200 rounded w-28"></div>
                </div>
                <div className="flex items-center justify-between gap-3 mt-3">
                  <div className="h-12 bg-gray-200 rounded-[50px] w-full"></div>
                  <div className="shrink-0 bg-gray-200 w-[44px] h-[44px] rounded-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RepetitorSwiperLoading;
