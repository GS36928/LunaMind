import { WavyCheck } from "react-coolicons";
import { whyOurPlatformData } from "../../constants/data";
import { UnionCrown } from "../ui/Icons";

const WhyOurPlatform = ({ id }: { id: string }) => {
  return (
    <div
      className="pt-[32px] sm:pt-[44px] lg:pt-[52px] xl:pt-[88px] 2xl:pt-[64px] 3xl:pt-[96px]"
      id={id}
    >
      <div
        className="flex flex-col gap-2 lg:flex-row lg:items-center xl:flex-col xl:justify-center xl:text-center xl:gap-3
      pb-6 lg:pb-8 xl:pb-[44px]"
      >
        <div className="lg:w-1/2">
          <span className="text-[#0C0F21] text-[40px] leading-[40px] font-lgvanastasia-regular lg:text-[52px] xl:text-[64px] xl:leading-[52px] xl:text-black  inline-block">
            <span className="relative inline-block ">
              რ
              <span className="absolute -top-10 -left-10 hidden xl:block">
                <UnionCrown />
              </span>
            </span>
            ატომ ჩვენი პლატფომა
          </span>
        </div>

        <p className="text-[#939393] text-base leading-5 font-helveticaneue-regular lg:w-1/2 xl:pl-0 xl:mt-2">
          მარტივი გზა ცოდნამდე
        </p>
      </div>
      <div className="flex flex-col gap-6 lg:grid lg:grid-cols-2 xl:grid-cols-12">
        {whyOurPlatformData?.map((item, index) => {
          let colSpan = "xl:col-span-6";
          if (index % 4 === 0) colSpan = "xl:col-span-7";
          if (index % 4 === 1) colSpan = "xl:col-span-5";
          if (index % 4 === 2) colSpan = "xl:col-span-5";
          if (index % 4 === 3) colSpan = "xl:col-span-7";
          return (
            <div
              key={index}
              className={`bg-[#F6F7FB] rounded-3xl p-6 flex flex-col gap-6 ${colSpan}`}
            >
              <div
                className={`p-[14px] rounded-full w-fit`}
                style={{ backgroundColor: item?.color }}
              >
                <WavyCheck width={24} height={24} color="white" />
              </div>
              <div className="flex flex-col gap-3">
                <span className="text-[32px] leading-[100%] font-lgvanastasia-regular text-black lg:text-[44px] xl:text-[52px]">
                  {item?.title}
                </span>
                <p className="text-[#939393] text-sm leading-5 font-helveticaneue-regular">
                  {item?.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WhyOurPlatform;
