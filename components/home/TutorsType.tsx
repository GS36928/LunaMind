import { subjectsData } from "../../constants/data";

const TutorsType = () => {
  const firstColumn = subjectsData.slice(0, 3);
  const secondColumn = subjectsData.slice(3, 6);
  const thirdColumn = subjectsData.slice(0, 2);
  const fourthColumn = subjectsData.slice(0, 3);

  return (
    <div className="hidden sm:flex sm:flex-col justify-between h-[282px] bg-[#F6F7FB] rounded-4xl sm:w-1/2 px-4 pt-4 lg:w-full lg:h-full lg:pb-4 xl:pb-0">
      <div className="flex gap-2 w-full">
        <div className="flex flex-col gap-2 w-1/2 lg:hidden 2xl:flex">
          {firstColumn.map((item) => {
            const Icon = item?.icon;
            const Id = item?.id;
            return (
              <div
                key={item?.id}
                className={`flex items-center gap-1 py-2 px-[6.5px] bg-white rounded-xl ${
                  Id === 2 || Id === 4
                    ? "flex-col text-center"
                    : "flex-row text-start"
                }`}
              >
                <Icon />
                <div className="flex flex-col">
                  <span className="text-xs leading-4 text-[#0C0F21] font-helveticaneue-medium">
                    {item?.title}
                  </span>
                  <span className="text-[#939393] text-[10px] leading-3.5 font-helveticaneue-regular">
                    რეპეტიტორი
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col gap-2 w-1/2 lg:hidden 2xl:flex">
          {secondColumn.map((item) => {
            const Icon = item?.icon;
            const Id = item?.id;
            return (
              <div
                key={item?.id}
                className={`flex items-center gap-1 py-2 px-[6.5px] bg-white rounded-xl ${
                  Id === 2 || Id === 4
                    ? "flex-col text-center"
                    : "flex-row text-start"
                }`}
              >
                <Icon />
                <div className="flex flex-col">
                  <span className="text-xs leading-4 text-[#0C0F21] font-helveticaneue-medium">
                    {item?.title}
                  </span>
                  <span className="text-[#939393] text-[10px] leading-3.5 font-helveticaneue-regular">
                    რეპეტიტორი
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="hidden flex-col gap-[14px] lg:flex lg:justify-center mx-auto w-full xl:pb-[26px] xl:hidden">
          {thirdColumn.map((item) => {
            const Icon = item?.icon;
            const Id = item?.id;
            return (
              <div
                key={item?.id}
                className={`flex items-center gap-1 py-2 px-[6.5px] bg-white rounded-xl ${
                  Id === 2 || Id === 4
                    ? "flex-col text-center"
                    : "flex-row text-center"
                }  xl:justify-center  `}
              >
                <Icon />
                <div className="flex flex-col">
                  <span className="text-xs leading-4 text-[#0C0F21] font-helveticaneue-medium">
                    {item?.title}
                  </span>
                  <span className="text-[#939393] text-[10px] leading-3.5 font-helveticaneue-regular">
                    რეპეტიტორი
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        <div className="hidden flex-col gap-[8px] xl:flex xl:justify-center mx-auto w-full 2xl:hidden">
          {fourthColumn.map((item) => {
            const Icon = item?.icon;
            const Id = item?.id;
            return (
              <div
                key={item?.id}
                className={`flex items-center gap-1 py-2 px-[6.5px] bg-white rounded-xl ${
                  Id === 2 || Id === 4
                    ? "flex-col text-center"
                    : "flex-row text-center"
                }  xl:justify-center  `}
              >
                <Icon />
                <div className="flex flex-col">
                  <span className="text-xs leading-4 text-[#0C0F21] font-helveticaneue-medium">
                    {item?.title}
                  </span>
                  <span className="text-[#939393] text-[10px] leading-3.5 font-helveticaneue-regular">
                    რეპეტიტორი
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="w-full text-center text-xs leading-4 font-helveticaneue-regular text-[#737373] pb-[26px] pt-[18px] lg:hidden xl:block xl:pb-[20px] 3xl:pb-6">
        მიიღე საუკეთესო გამოცდილება
      </div>
    </div>
  );
};

export default TutorsType;
