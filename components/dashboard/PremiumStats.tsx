import React from "react";

const ColorMeansEverything = ({
  color,
  text,
}: {
  color: string;
  text: string;
}) => {
  return (
    <div className="flex items-center gap-2 justify-center pl-1.5 pb-1.5">
      <div
        className={`w-[11px] h-[11px] rounded-[2px]`}
        style={{ backgroundColor: color }}
      ></div>
      <span className="text-xs leading-4 text-black font-helveticaneue-regular">
        {text}
      </span>
    </div>
  );
};

const PremiumStats = ({ profilePage = false }: { profilePage?: boolean }) => {
  return (
    <div
      className={`mt-4 flex flex-col gap-4 sm:flex-row  xl:flex-col ${
        profilePage ? "xl:mt-4" : "xl:mt-0"
      }`}
    >
      <div
        className={`bg-white rounded-2xl p-5 gap-4 flex flex-col xl:w-full ${
          profilePage
            ? "sm:w-full md:justify-between md:h-[428px]"
            : "sm:w-full"
        }`}
        style={
          profilePage ? {} : { boxShadow: "0px 2px 5px 0px rgba(0,0,0,0.05)" }
        }
      >
        <div className="flex flex-col gap-3 2xl:gap-4">
          <span className="text-sm leading-5 text-[#737373] font-helveticaneue-regular">
            სტატისტიკა
          </span>
          <span className="font-helveticaneue-regular text-xs leading-5 text-[#080808]">
            სტატისტიკა მოცემულია თქვენი დროის და გაკვეთილების ცხრილის მიხედვით
          </span>
        </div>
        <div className="flex flex-col justify-center items-center gap-6">
          <div className="relative w-[164px] h-[164px] flex items-center justify-center  rounded-full ">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              {/* Arc 1 */}
              <circle
                cx="18"
                cy="18"
                r="14.915"
                fill="none"
                stroke="#F0C514"
                strokeWidth="5"
                strokeDasharray="30 70"
                strokeLinecap="round"
              />
              {/* Arc 2 */}
              <circle
                cx="18"
                cy="18"
                r="14.915"
                fill="none"
                stroke="#1EC418"
                strokeWidth="5"
                strokeDasharray="20 80"
                strokeDashoffset="-30"
                strokeLinecap="round"
              />
              {/* Arc 3 */}
              <circle
                cx="18"
                cy="18"
                r="14.915"
                fill="none"
                stroke="#BDBEC0"
                strokeWidth="5"
                strokeDasharray="20 80"
                strokeDashoffset="-50"
                strokeLinecap="round"
              />
              {/* Arc 4 */}
              <circle
                cx="18"
                cy="18"
                r="14.915"
                fill="none"
                stroke="#F76825"
                strokeWidth="5"
                strokeDasharray="30 70"
                strokeDashoffset="-70"
                strokeLinecap="round"
              />
            </svg>

            {/* Inner text */}
            <div className="absolute flex items-center justify-center">
              <span className="text-[28px] leading-[100%] font-helveticaneue-medium !font-bold">
                88%
              </span>
            </div>
          </div>

          <div className="flex flex-wrap justify-center">
            <ColorMeansEverything color="#1EC418" text="დასრულებული" />
            <ColorMeansEverything color="#F0C514" text="მიმდინარე" />
            <ColorMeansEverything color="#BDBEC0" text="გამოტოვებული" />
            <ColorMeansEverything color="#F76825" text="ჯერ არ დაწყებულა" />
          </div>
        </div>
        <div className={`hidden xl:flex flex-col gap-4`}>
          <hr className=" text-[#EBECF0]" />
          <div className="flex justify-between items-center gap-4">
            <span className="text-xs leading-4 text-[#737373] font-helveticaneue-regular">
              შენს ცხრილზე დაყრდნობით შენი პროგრესის დიდი ნაწილი შესრულებული
              გაქვს
            </span>
            <span className="text-2xl leading-4 font-helveticaneue-medium !font-bold text-[#080808] tracking-[0.5px]">
              88%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumStats;
