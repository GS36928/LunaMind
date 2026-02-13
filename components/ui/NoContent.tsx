import { CalendarAdd, CircleWarning } from "react-coolicons";

const NoContent = ({
  desc,
  needBtn = true,
  btnText,
}: {
  desc: string;
  needBtn?: boolean;
  btnText?: string;
}) => {
  return (
    <div className="flex flex-col items-center text-center gap-2">
      <div className="flex flex-col gap-3 items-center text-center">
        <CircleWarning className="text-[#737373]" />
        <span className="text-sm leading-5 text-[#737373] font-helveticaneue-regular">
          {desc}
        </span>
      </div>
      <hr className="w-full h-[1px] bg-[#EBECF0] border-0 " />
      {needBtn && (
        <div className="flex gap-2 items-center justify-center bg-[#F6F5FA] rounded-xl py-4 px-2 sm:px-[36px] ">
          <CalendarAdd color="#7D3FFF" />
          <span className="text-sm leading-5 font-helveticaneue-regular text-[#080808]">
            {btnText}
          </span>
        </div>
      )}
    </div>
  );
};

export default NoContent;
