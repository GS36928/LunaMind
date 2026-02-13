type Props = {
  subject: string;
  color: string;
  count: number;
};

const SubjectSpin = ({ subject, color, count }: Props) => {
  return (
    <div
      className="hidden lg:flex rounded-2xl self-start h-[235px] items-center justify-center w-full xl:h-[195px]"
      style={{ backgroundColor: color }}
    >
      <div className="text-center text-[#0C0F21] font-helveticaneue-regular">
        <span className="block text-base font-semibold">{subject}</span>
        <span className="block text-sm">
          {count > 0
            ? `${count} ვერიფიცირებული რეპეტიტორი`
            : "რეპეტიტორი მალე დაემატება"}
        </span>
      </div>
    </div>
  );
};

export default SubjectSpin;
