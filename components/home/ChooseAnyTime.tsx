import { CalendarDays } from "react-coolicons";
import TutorsType from "./TutorsType";

const ChooseAnyTime = () => {
  const days = [
    { name: "ორშაბათი", color: "from-[#FFD52A] to-[#FFE873]" },
    { name: "სამშაბათი", color: "from-[#8FF2B3] to-[#B5FFD9]" },
    { name: "ოთხშაბათი", color: "from-[#F15A24] to-[#FF8B66]" },
    { name: "ხუთშაბათი", color: "from-[#6FC3E2] to-[#A9E8F9]" },
    { name: "პარასკევი", color: "from-[#9859C7] to-[#C89AF7]" },
    { name: "შაბათი", color: "from-[#94EB60] to-[#C6FFA4]" },
    { name: "კვირა", color: "from-[#FF7FFE] to-[#FFB2FF]" },
  ];

  return (
    <div className="text-center flex flex-col gap-3 w-full sm:gap-5 lg:order-1 lg:w-[20%] lg:gap-3">
      <p className="text-sm leading-5 font-helveticaneue-regular text-[#939393] w-[288px] mx-auto lg:w-full lg:text-xs">
        შენ შეგიძლია სწავლისთვის აირჩიო კვირის ნებისმიერი დღე
      </p>

      <div className="rounded-[16px] bg-[#F6F7FB] h-[242px] flex items-center justify-center p-[16px] sm:hidden lg:flex lg:h-full lg:rounded-4xl">
        <div className="w-full h-full bg-white rounded-xl lg:rounded-[30px] flex flex-col justify-center">
          <ul className="flex flex-col gap-2 w-full px-4 overflow-y-scroll scrollbar-hide">
            {days.map((day, index) => (
              <li
                key={index}
                className={`flex items-center justify-center gap-2 text-[#0C0F21] text-sm font-helveticaneue-regular py-2 rounded-xl bg-gradient-to-r ${day.color} shadow-sm hover:shadow-md hover:scale-[1.03] transition-all duration-300`}
              >
                <CalendarDays />
                <span className="inline-block w-[90px] text-start ">
                  {day.name}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="gap-4 hidden sm:flex lg:hidden">
        <div className="rounded-[16px] bg-[#F6F7FB] h-[242px] sm:h-[282px] flex items-center justify-center p-[16px] sm:w-1/2">
          <div className="w-full h-full bg-white rounded-xl overflow-y-scroll scrollbar-hide">
            <ul className="flex flex-col gap-2 w-full px-4">
              {days.map((day, index) => (
                <li
                  key={index}
                  className={`flex items-center justify-center gap-2 text-[#0C0F21] text-sm font-helveticaneue-regular py-2 rounded-xl bg-gradient-to-r ${day.color} shadow-sm hover:shadow-md hover:scale-[1.03] transition-all duration-300`}
                >
                  <CalendarDays />
                  <span className="inline-block w-[90px] text-start">
                    {day.name}ss
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <TutorsType />
      </div>
    </div>
  );
};

export default ChooseAnyTime;
