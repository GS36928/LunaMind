import Link from "next/link";
import { PackageText } from "./Text";

const Packages = ({
  forWho,
  color,
  buttonText,
  containerWidth,
  userExist,
}: {
  forWho: string;
  color: string;
  buttonText: string;
  containerWidth?: string;
  userExist: string | undefined;
}) => {
  const studentPackages = [
    {
      title: "ქულების გაუმჯობესება",
      desc: "მიაღწიე სასურველ შედეგებს გამოცდებზე გამოცდილი რეპეტიტორების დახმარებით.",
    },
    {
      title: "მოქნილი განრიგი",
      desc: "სწავლა როცა გინდა — თავად აირჩიე შენთვის სასურველი დრო და ტემპი.",
    },
    {
      title: "ინდივიდუალური ყურადღება",
      desc: "გაიუმჯობესე ცოდნა პერსონალური მიდგომის და მიზნობრივი გაკვეთილების საშუალებით.",
    },
    {
      title: "ვერიფიცირებული რეპეტიტორები",
      desc: "ისწავლე მხოლოდ სანდო და გადამოწმებულ მასწავლებლებთან.",
    },
  ];

  const teacherPackages = [
    {
      title: "ახალი მოსწავლეების მოზიდვა",
      desc: "იპოვე ახალი სტუდენტები მარტივად და გაზარდე შენი მასწავლებლის კარიერა.",
    },
    {
      title: "დამატებითი შემოსავალი",
      desc: "მიიღე სტაბილური შემოსავალი შენი ცოდნის გაზიარებით.",
    },
    {
      title: "სასურველი განრიგი",
      desc: "შექმენი მოქნილი სამუშაო განრიგი და იმუშავე მხოლოდ მაშინ, როცა შენ გინდა.",
    },
    {
      title: "პროფესიული განვითარება",
      desc: "გააუმჯობესე შენი უნარები და განვითარდი მუდმივად მასწავლებლის როლში.",
    },
  ];

  const packagesToRender =
    forWho === "მოსწავლეებისთვის" ? studentPackages : teacherPackages;

  return (
    <div
      className={`${color} rounded-2xl p-8 ${containerWidth} flex flex-col justify-between`}
    >
      <div>
        <div className="flex flex-col gap-3">
          <span className="text-[#0C0F21] text-[32px] leading-[100%] font-lgvanastasia-regular lg:text-[44px]">
            {forWho}
          </span>
          <p className="text-[#737373] text-sm leading-5 font-helveticaneue-regular">
            {forWho === "მოსწავლეებისთვის"
              ? "რატომ უნდა აირჩიოთ ჩვენი პლატფორმა სწავლისთვის"
              : "რატომ უნდა გახდეთ ჩვენი პლატფორმის წევრი"}
          </p>
        </div>
        <div className="flex flex-col gap-5 mt-6">
          {packagesToRender.map((pkg, index) => (
            <PackageText
              key={index}
              title={pkg.title}
              desc={pkg.desc}
              forWho={forWho}
            />
          ))}
        </div>
      </div>
      {!userExist && (
        <div
          className={`mt-6 w-fit mx-auto py-4 px-8 rounded-[26px]  cursor-pointer ${
            forWho === "მოსწავლეებისთვის" ? "bg-[#FFD52A]" : "bg-[#0077FF]"
          }`}
        >
          <Link
            href={
              forWho === "მოსწავლეებისთვის"
                ? "/register?role=STUDENT"
                : "/register?role=TEACHER"
            }
            className="flex items-center justify-center"
          >
            <span
              className={`text-sm leading-5 font-helveticaneue-medium ${
                forWho === "მოსწავლეებისთვის" ? "text-[#0C0F21]" : "text-[#fff]"
              }`}
            >
              {buttonText}
            </span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Packages;
