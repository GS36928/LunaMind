"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, type FC } from "react";
import {
  CaretDownMd,
  CreditCard01,
  Folders,
  House01,
  LogOut,
  Star,
  UserCircle,
  UsersGroup,
  Settings as SettingsIcon,
} from "react-coolicons";
import { usePathname } from "next/navigation";
import { useLogout } from "@/hooks/useLogout";
import { useClickOutside } from "@/hooks/useClickOutside";
import { Evectus } from "../ui/Icons";

type NavigationItem = {
  id: number;
  title: string;
  path: string;
  icon?: string | FC<{ color?: string; fill?: string; size: number }>;
};

const studentNavigation: NavigationItem[] = [
  { id: 1, title: "მიმოხილვა", path: "/dashboard", icon: House01 },
  { id: 2, title: "რეპეტიტორები", path: "/dashboard/tutors", icon: UsersGroup },
  { id: 3, title: "შეფასებები", path: "/dashboard/reviews", icon: Star },
];

const teacherNavigation: NavigationItem[] = [
  { id: 1, title: "მიმოხილვა", path: "/dashboard", icon: House01 },
  { id: 3, title: "შეფასებები", path: "/dashboard/reviews", icon: Star },
];

type StudentUser = {
  id: string;
  firstName: string;
  lastName: string;
  role: "STUDENT" | "TEACHER" | "ADMIN" | "SUPER_ADMIN";
  image?: string;
};

type NavBarProps = {
  user: StudentUser;
};

const NavBar: FC<NavBarProps> = ({ user }) => {
  const pathname = usePathname();
  const { logout } = useLogout();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useClickOutside(dropdownRef, () => setOpen(false));

  const navigation =
    user.role === "TEACHER" ? teacherNavigation : studentNavigation;

  const getProfileLinkWithTab = (tab: string) => {
    const baseLink =
      user.role === "TEACHER"
        ? "/dashboard/teacher-profile"
        : "/dashboard/student-profile";
    return `${baseLink}#${tab}`;
  };

  return (
    <div
      className="pt-8 text-center sm:text-start 3xl:px-[160px] max-w-[1920px] 3xl:mx-auto lg:pt-[28px] lg:flex lg:justify-between lg:items-center
    xl:pt-8 w-full"
    >
      <Link
        href={"/"}
        className="lg:w-2/5 cursor-pointer flex items-center gap-2"
      >
        <Evectus />
        <span className="text-[32px] leading-[100%] text-[#0C0F21] font-freeman-regular">
          EVECTUS
        </span>
      </Link>

      <ul
        className="flex items-center fixed bottom-0 left-1/2 -translate-x-1/2 w-fit justify-center bg-[#EBECF0] p-3 rounded-[60px] z-50
        lg:static lg:justify-start lg:w-auto lg:rounded-[60px] lg:p-3 xl:p-2 xl:gap-1 xl:rounded-[50px]"
      >
        {navigation.map((item) => {
          const isActive =
            pathname === item.path ||
            (pathname.startsWith(item.path) && item.path !== "/dashboard");

          return (
            <Link
              href={item?.path}
              key={item.id}
              className={`text-xs leading-4 flex items-center gap-1 ${
                isActive
                  ? "pl-3 pr-[20px] py-[10px] bg-black rounded-[100px] xl:bg-[#080808] xl:p-0 "
                  : "py-[10px]"
              }`}
            >
              {isActive ? (
                <>
                  <div className="block xl:hidden">
                    {item.icon && (
                      <item.icon color="#fff" size={24} fill="white" />
                    )}
                  </div>
                  <span
                    className="xl:!font-helveticaneue-regular text-xs leading-4 text-[#fff] !font-helveticaneue-medium xl:text-white
                    xl:text-sm xl:leading-5 xl:px-5 xl:py-[14px]"
                  >
                    {item.title}
                  </span>
                </>
              ) : (
                <div className="">
                  <div className="p-[10px] block xl:hidden">
                    {item.icon && <item.icon color="#080A0D" size={24} />}
                  </div>
                  <div className="hidden xl:block">
                    <span className="text-sm leading-5 text-[#737373] px-5 py-3 font-helveticaneue-regular">
                      {item.title}
                    </span>
                  </div>
                </div>
              )}
            </Link>
          );
        })}
        <Link href={getProfileLinkWithTab("personal")}>
          <div className="w-11 h-11 rounded-full relative overflow-hidden lg:hidden ml-2">
            <Image
              src={user?.image || "/images/default-profile.png"}
              alt="user"
              fill
              className="object-cover"
            />
          </div>
        </Link>
        <div className="lg:hidden ml-2 pr-2" onClick={logout}>
          <LogOut />
        </div>
      </ul>

      <div
        className="relative hidden lg:block cursor-pointer"
        ref={dropdownRef}
      >
        <div
          className={`hidden lg:flex bg-[#EBECF0]  px-4 py-3 items-center gap-2  ${
            open ? "rounded-t-2xl" : "rounded-[50px]"
          }`}
          onClick={() => setOpen((prev) => !prev)}
        >
          <div className="w-10 h-10 rounded-full relative overflow-hidden">
            <Image
              src={user?.image || "/images/default-profile.png"}
              alt="user"
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-sm leading-5 text-[#000000] font-helveticaneue-medium">
              {user?.firstName + " " + user?.lastName}
            </span>
            <p className="text-xs leading-[18px] text-[#767676] font-helveticaneue-regular">
              {user.role === "TEACHER" ? "რეპეტიტორი" : "მოსწავლის პროფილი"}
            </p>
          </div>
          <div>
            <CaretDownMd color="#737373" />
          </div>
        </div>

        {open && (
          <div className="absolute w-full bg-[#EBECF0] rounded-b-xl overflow-hidden z-50">
            <Link
              href={getProfileLinkWithTab("personal")}
              className="px-4 py-4 w-full  hover:bg-[#DCDCDC] border-t border-[#D2D2D2] flex items-center gap-2"
              onClick={() => setOpen(false)}
            >
              <UserCircle width={20} height={20} />
              <span className="text-sm leading-5 text-black font-helveticaneue-medium">
                პირადი მონაცემები
              </span>
            </Link>
            <Link
              href={getProfileLinkWithTab("cards")}
              className="px-4 py-4 w-full  hover:bg-[#DCDCDC] border-t border-[#D2D2D2] flex items-center gap-2"
              onClick={() => setOpen(false)}
            >
              <CreditCard01 width={20} height={20} />
              <span className="text-sm leading-5 text-black font-helveticaneue-medium">
                ჩემი ბარათები
              </span>
            </Link>
            <Link
              href={getProfileLinkWithTab("lessons")}
              className="px-4 py-4 w-full  hover:bg-[#DCDCDC] border-t border-[#D2D2D2] flex items-center gap-2"
              onClick={() => setOpen(false)}
            >
              <Folders width={20} height={20} />
              <span className="text-sm leading-5 text-black font-helveticaneue-medium">
                გაკვეთილების ისტორია
              </span>
            </Link>
            {/* 🔥 NEW: SETTINGS LINK */}
            <Link
              href="/dashboard/settings"
              className="px-4 py-4 w-full  hover:bg-[#DCDCDC] border-t border-[#D2D2D2] flex items-center gap-2"
              onClick={() => setOpen(false)}
            >
              <SettingsIcon width={20} height={20} />
              <span className="text-sm leading-5 text-black font-helveticaneue-medium">
                პარამეტრები
              </span>
            </Link>
            <button
              onClick={() => {
                logout();
                setOpen(false);
              }}
              className="px-4 py-4 w-full  hover:bg-[#DCDCDC] border-t border-[#D2D2D2] flex items-center gap-2"
            >
              <LogOut width={20} height={20} />
              <span className="text-sm leading-5 text-black font-helveticaneue-medium">
                გასვლა
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NavBar;
