import Link from "next/link";
import { Evectus } from "../ui/Icons";

const Hero = ({
  id,
  userExist,
}: {
  id: string;
  userExist: string | undefined;
}) => {
  return (
    <div
      className="flex flex-col items-center justify-center pb-6 lg:mt-[100px]"
      id={id}
    >
      <div className="lg:hidden pt-8 pb-6 sm:pb-8 flex gap-2 items-center">
        <Evectus />
        <span className="font-freeman-regular text-2xl leading-[0] text-[#0C0F21]  sm:text-[32px]  ">
          EVECTUS
        </span>
      </div>

      <div>
        <span
          className={`text-[#0C0F21] text-[40px] leading-[100%] pb-3 lg:pb-6
      sm:text-[52px] md:text-[64px] lg:hidden font-lgvanastasia-regular`}
        >
          ისწავლე ონლაინ საუკეთესო
        </span>
        <span
          className={`hidden lg:block text-[#0C0F21]  leading-[100%] pb-6 xl:pb-[19px]
      text-[84px] xl:text-[102px] font-lgvanastasia-regular`}
        >
          ისწავლე ონლაინ
        </span>
      </div>

      <div className="relative pb-4 md:pb-3 lg:pb-[22px] xl:pb-[25px]">
        <span
          className={`text-[#0C0F21] text-[40px] leading-[100%]  px-[26px] py-2
       sm:text-[52px] sm:p-2 md:text-[64px] lg:hidden font-lgvanastasia-regular`}
        >
          რეპეტიტორებთან
        </span>
        <span
          className={`hidden lg:block text-[84px] leading-[100%]   p-2
        xl:text-[102px] xl:px-[15px] xl:pt-[9px] xl:pb-[21px] font-lgvanastasia-regular`}
        >
          საუკეთესო რეპეტიტორებთან
        </span>
      </div>
      <span
        className="font-helveticaneue-regular text-xs leading-4 text-[#737373] text-center pb-6 sm:text-sm sm:leading-5 lg:text-base lg:leading-[24px] lg:pb-8
      w-[288px] sm:w-[400px] md:w-[488px] lg:w-[696px] xl:w-[584px] 2xl:w-[676px] 3xl:w-[779px]"
      >
        ჩვენი პლატფორმა აკავშირებს ქართველ სტუდენტებს კვალიფიციურ რეპეტიტორებთან
        ყველა საგანში
      </span>
      {!userExist && (
        <div className="flex justify-center items-center gap-4 lg:gap-[14px]">
          <Link
            href="/register?role=STUDENT"
            className="font-helveticaneue-medium text-xs leading-4 px-[34px] py-[14px] rounded-[40px] bg-[#FFD52A] cursor-pointer
          sm:text-sm sm:leading-5 lg:px-[44px] lg:py-[19px] text-[#0C0F21]
          transition-transform duration-300 hover:animate-[shakeScale_0.7s_linear]"
          >
            <span className="hidden sm:inline">გახდი მოსწავლე</span>
            <span className="inline sm:hidden">მოსწავლე</span>
          </Link>
          <Link
            href="/register?role=TEACHER"
            className="font-helveticaneue-medium text-xs leading-4 px-[34px] py-[14px] rounded-[40px] bg-[#F6F7FB] cursor-pointer
          sm:text-sm sm:leading-5 lg:px-[44px] lg:py-[19px] text-[#0C0F21]
         transition-transform duration-300 hover:animate-[shakeScale_0.7s_linear]"
          >
            <span className="hidden sm:inline">გახდი რეპეტიტორი</span>
            <span className="inline sm:hidden">რეპეტიტორი</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Hero;
