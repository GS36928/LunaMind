import React, { ReactNode } from "react";
import { Facebook, Instagram } from "../ui/Icons";
import Link from "next/link";

type SocialMediaIconsProps = {
  children: ReactNode;
};

const liClass = "text-sm leading-5 font-helveticaneue-regular text-[#939393]";
const spanClass =
  "font-helveticaneue-medium text-base leading-5 text-white !font-bold";

const SocialMediaIcons: React.FC<SocialMediaIconsProps> = ({ children }) => {
  return (
    <div className="border border-white/10 rounded-xl w-10 h-10 relative">
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
};

const Footer = ({ userExist }: { userExist?: string | null }) => {
  return (
    <div className="bg-[#080A16] w-full mt-8 md:mt-11 lg:mt-[52px] xl:mt-[64px] 2xl:mt-[54px] 3xl:mt-[64px] pb-20 lg:pb-10">
      <div className="pt-[64px] px-4 md:px-6 lg:px-11 flex flex-col gap-8 lg:flex-row lg:gap-8 2xl:px-[80px] 2xl:gap-0 2xl:justify-between 3xl:max-w-[1600px] 3xl:gap-16 3xl:mx-auto 3xl:px-[160px]">
        <div className="flex flex-col gap-2 2xl:w-[517px]">
          <span className="font-freeman-regular text-[#fff] text-[32px] leading-[100%]">
            EVECTUS
          </span>
          <span className="text-[#939393] text-sm leading-5">
            Evectus არის თანამედროვე საგანმანათლებლო პლატფორმა, რომელიც
            აერთიანებს მასწავლებლებსა და მოსწავლეებს ერთ კომფორტულ სივრცეში.
            ჩვენი მიზანია, ყველას მივცეთ შესაძლებლობა ისწავლოს მარტივად,
            თანამედროვე მეთოდებით და საკუთარი ტემპით – სადაც არ უნდა
            იმყოფებოდეს. <br />
            <br />
            Evectus-ზე თითოეული გაკვეთილი ტარდება ისე, რომ სწავლა იყოს არა
            მხოლოდ შედეგიანი, არამედ სასიამოვნო გამოცდილებაც. ჩვენ გვჯერა, რომ
            განათლება ყველასთვის ხელმისაწვდომი უნდა იყოს და სწორედ ამიტომ ვქმნით
            მომავალს, სადაც სწავლა არის თავისუფლება.
          </span>
        </div>
        <div className="flex flex-col gap-8 sm:flex-row sm:gap-0 sm:justify-between lg:gap-8 2xl:gap-16">
          <div className="flex flex-col gap-4">
            <span className={`${spanClass}`}>მომსახურება</span>
            <ul className="flex flex-col gap-3">
              {!userExist ? (
                <>
                  <Link href="/register?role=STUDENT" className={`${liClass}`}>
                    სტუდენტებისთვის
                  </Link>
                  <Link href="/register?role=STUDENT" className={`${liClass}`}>
                    დაწყებითი კლასებისთვის
                  </Link>
                  <Link href="/register?role=TEACHER" className={`${liClass}`}>
                    მასწავლებლებისთვის
                  </Link>
                </>
              ) : (
                <>
                  <li className={`${liClass}`}>სტუდენტებისთვის</li>
                  <li className={`${liClass}`}>დაწყებითი კლასებისთვის</li>
                  <li className={`${liClass}`}>მასწავლებლებისთვის</li>
                </>
              )}
            </ul>
          </div>
          <div className="flex flex-col gap-4">
            <span className={`${spanClass}`}>მხარდაჭერა</span>
            <ul className="flex flex-col gap-3">
              <Link href={"/confidentiality"} className={`${liClass}`}>
                კონფიდენციალურობა
              </Link>
              <Link href={"/terms-and-conditions"} className={`${liClass}`}>
                გამოყენების პოლიტიკა
              </Link>
              <Link href={"/return-policy"} className={`${liClass}`}>
                დაბრუნების პოლიტიკა
              </Link>
            </ul>
          </div>
          <div className="flex flex-col gap-4">
            <span className={`${spanClass}`}>დახმარება</span>
            <ul className="flex flex-col gap-3">
              <li className={`${liClass}`}>info@evectus.ge</li>
            </ul>
            <div className="flex gap-3">
              <Link
                target="_blank"
                href={"https://www.facebook.com/profile.php?id=61583831033359"}
              >
                <SocialMediaIcons>
                  <Facebook />
                </SocialMediaIcons>
              </Link>
              <Link
                target="_blank"
                href={"https://www.instagram.com/evectusacademy/"}
              >
                <SocialMediaIcons>
                  <Instagram />
                </SocialMediaIcons>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <hr className="border-t border-white/10 mt-10" />
      <div
        className="mt-10 flex flex-col gap-5 
      px-4 md:px-6 lg:px-11 lg:flex-row lg:gap-0 lg:justify-between 2xl:px-20 2xl:gap-0 2xl:justify-start 3xl:max-w-[1600px] 3xl:gap-16 3xl:mx-auto 3xl:px-[160px] 3xl:justify-between"
      >
        <span className="text-sm leading-5 text-[#939393] font-helveticaneue-regular 2xl:w-1/2 3xl:w-full">
          © 2025 ევექტუსი. ყველა უფლება დაცულია
        </span>
        <div className="flex flex-col gap-4 sm:flex-row lg:gap-6 2xl:w-1/2 3xl:w-full 3xl:justify-end">
          <Link
            href={"/confidentiality"}
            className="text-sm leading-5 text-white font-helveticaneue-regular underline"
          >
            კონფიდენციალურობა
          </Link>
          <Link
            href={"/terms-and-conditions"}
            className="text-sm leading-5 text-white font-helveticaneue-regular underline"
          >
            წესები და პირობები
          </Link>
          <Link
            href={"/return-policy"}
            className="text-sm leading-5 text-white font-helveticaneue-regular underline"
          >
            დაბრუნების პოლიტიკა
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Footer;
