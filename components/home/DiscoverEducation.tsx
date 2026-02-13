import React from "react";
import { discoveryEducationData } from "../../constants/data";
import { SectionHeader } from "../ui/Text";

const DiscoverEducation = () => {
  return (
    <div className="pt-8 sm:pt-11 lg:pt-[52px] xl:pt-[64px] 3xl:pt-[84px]">
      <SectionHeader
        title="აღმოაჩინე პერსონალიზებული განათლების ახალი შესაძლებლობა"
        description="ჩვენ გვჯერა, რომ ტექნოლოგიებს შეუძლიათ სწავლის გამოცდილების შეცვლა"
      />
      <div className="flex flex-col gap-3 md:px-[22px] lg:px-0 lg:flex-row lg:gap-[16px] xl:gap-6">
        {discoveryEducationData.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className="inline-flex items-start flex-col gap-3 border border-[#EDEDED] p-4 rounded-3xl 2xl:gap-4"
            >
              <div
                className={`p-[10px] rounded-full inline-flex items-center justify-center`}
                style={{ backgroundColor: item?.backgroundColor }}
              >
                {typeof Icon !== "string" && <Icon color="white" />}
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-[#0C0F21] text-base leading-6 font-helveticaneue-medium">
                  {item?.title}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DiscoverEducation;
