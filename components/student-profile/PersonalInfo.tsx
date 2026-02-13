"use client";

import React, { useEffect, useRef, useState } from "react";
import { Camera } from "react-coolicons";
import OurLessons from "../dashboard/OurLessons";
import PremiumStats from "../dashboard/PremiumStats";
import Image from "next/image";
import TabsContent from "../ui/TabsContent";
import { useBookedLessons } from "@/hooks/useBookedLessons";

type User = {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  role: "STUDENT" | "TEACHER";
  image?: string | undefined;
};

interface PersonalInfoProps {
  user: User;
}

type Tab = "personal" | "cards" | "lessons";

const PersonalInfo: React.FC<PersonalInfoProps> = ({ user }) => {
  const { data: lessons } = useBookedLessons({ studentId: user?.id });

  const [fullName, setFullName] = useState(
    user.firstName + " " + user.lastName
  );
  const [activeTab, setActiveTab] = useState<Tab>("personal");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 🔹 ტაბის ცვლილება როგორც NavBar-იდან, ისე შიგნიდან
  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    // 🔹 URL-ის განახლება როცა ტაბს შიგნიდან ვცვლით
    window.history.replaceState(null, "", `#${tab}`);
  };

  // 🔹 hashchange event listener
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "") as Tab;
      if (hash && ["personal", "cards", "lessons"].includes(hash)) {
        setActiveTab(hash);
      }
    };

    // ჩატვირთვისას შევამოწმოთ
    handleHashChange();

    // დავამატოთ event listener
    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;

    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", user.id);

    try {
      const res = await fetch("/api/students/uploadProfileImage", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.imageUrl) {
        setProfileImage(data.imageUrl);
      }
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  };

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="lg:grid lg:grid-cols-[1fr_2fr] xl:grid-cols-[1fr_3fr] lg:gap-4 relative">
      <div className="hidden lg:flex flex-col lg:order-1 order-2 sticky top-6 h-fit self-start">
        <div className="w-full">
          <OurLessons profilePage={true} lessons={lessons} />
        </div>
        <div className="w-full">
          <PremiumStats profilePage={true} />
        </div>
      </div>
      <div className="flex flex-col lg:order-2">
        <div className="bg-white p-4 rounded-2xl mt-8 lg:mt-6 ">
          <div className="sm:flex sm:justify-between sm:items-center">
            <div className="flex gap-2 items-center">
              <div className="w-[84px] h-[84px] rounded-full xl:w-[124px] xl:h-[124px] relative overflow-hidden">
                <Image
                  src={
                    profileImage || user.image || "/images/default-profile.png"
                  }
                  alt="user"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-helveticaneue-medium !font-bold text-base leading-6 text-[#080808]">
                  {fullName}
                </span>
                <span className="text-sm leading-5 text-[#737373] font-helveticaneue-regular mt-1">
                  მოსწავლე
                </span>
                <span className="text-xs leading-4 text-[#737373] font-helveticaneue-regular mt-4">
                  რეგისტრაციის თარიღი: 25 აგვისტო, 2025
                </span>
              </div>
            </div>
            <div
              className="flex items-center justify-center mt-3 gap-[10px] bg-[#EBECF0] py-3 rounded-xl cursor-pointer sm:px-[20px] sm:h-[48px]"
              onClick={handleCameraClick}
            >
              <Camera className="text-[#737373] " />
              <span className="text-sm leading-5 text-[#737373] font-helveticaneue-regular">
                ფოტოს შეცვლა
              </span>

              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
            </div>
          </div>
          <hr className="text-[#F1F1F1] my-4" />
          <TabsContent
            activeTab={activeTab}
            handleTabChange={handleTabChange}
            user={user}
            fullName={fullName}
            setFullName={setFullName}
          />
        </div>

        <div className="md:grid md:grid-cols-2 md:gap-4 lg:hidden">
          <OurLessons profilePage={true} lessons={lessons} />
          <PremiumStats profilePage={true} />
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo;
