import Packages from "../ui/Packages";

const OurPackages = ({
  id,
  userExist,
}: {
  id: string;
  userExist: string | undefined;
}) => {
  return (
    <div
      className="pt-[32px] 2xl:pt-[52px] flex flex-col justify-center items-center"
      id={id}
    >
      <div className="w-full flex flex-col gap-6 lg:flex-row">
        <Packages
          color="bg-[#F6F7FB]"
          forWho="მოსწავლეებისთვის"
          buttonText="გახდი მოსწავლე"
          containerWidth="2xl:w-[40%]"
          userExist={userExist}
        />
        <Packages
          color="bg-[#E3EFFF]"
          forWho="რეპეტიტორებისთვის"
          buttonText="გახდი რეპეტიტორი"
          containerWidth="2xl:w-[60%]"
          userExist={userExist}
        />
      </div>
    </div>
  );
};

export default OurPackages;
