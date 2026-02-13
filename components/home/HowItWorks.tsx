import { ChevronRightDuo, WavyCheck } from "react-coolicons";

const Check = () => {
  return (
    <div className="bg-[#F6F7FB] rounded-full p-[14px] w-fit">
      <WavyCheck color="black" width={24} height={24} />
    </div>
  );
};

const HowItWorksBox = ({ title }: { title: string }) => {
  return (
    <div className="flex flex-col gap-5 items-center">
      <Check />
      <div className="flex flex-col gap-2 items-center text-center">
        <span className="text-base leading-6 text-[#0C0F21] font-helveticaneue-medium !font-bold">
          {title}
        </span>
      </div>
    </div>
  );
};

const HowItWorks = () => {
  return (
    <div className="mt-[32px] md-[44px] lg:mt-[52px] xl:mt-[64px] 3xl:mt-[84px] flex flex-col gap-8">
      <div className="flex flex-col gap-3 items-center">
        <span className="font-lgvanastasia-regular text-[40px] leading-[100%] text-[#000000] 2xl:text-[64px] 2xl:leading-[52px]">
          როგორ მუშაობს?
        </span>
        <span className="text-[#939393] font-helveticaneue-regular text-base leading-6">
          მარტივი 3 ნაბიჯი თქვენი სწავლის დასაწყებად
        </span>
      </div>
      <div className="flex flex-col gap-2 md:gap-0 md:flex-row justify-evenly lg:items-center ">
        <HowItWorksBox title="მოძებნეთ რეპეტიტორი" />
        <div className="hidden md:block">
          <ChevronRightDuo width={124} height={124} color="#DBDBDB" />
        </div>
        <HowItWorksBox title="აირჩიეთ გაკვეთილი" />
        <div className="hidden md:block">
          <ChevronRightDuo width={124} height={124} color="#DBDBDB" />
        </div>
        <HowItWorksBox title="დაიწყეთ სწავლა" />
      </div>
    </div>
  );
};

export default HowItWorks;
