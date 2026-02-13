"use client";

import React, { useRef, useState, useEffect } from "react";
import { Camera } from "react-coolicons";
import OurLessons from "../dashboard/OurLessons";
import PremiumStats from "../dashboard/PremiumStats";
import Image from "next/image";
import Card from "../student-profile/Card";
import LessonsHistory from "../student-profile/LessonsHistory";
import TeacherInfo from "./TeacherInfo";
import { useBookedLessons } from "@/hooks/useBookedLessons";
import { useTeacherProfile } from "@/hooks/useTeacherProfile";

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  role: "STUDENT" | "TEACHER";
  image?: string;
};

interface PersonalInfoProps {
  user: User;
}

type Tab = "personal" | "cards" | "lessons";

const PersonalInfo: React.FC<PersonalInfoProps> = ({ user }) => {
  const { data: lessons } = useBookedLessons({ teacherId: user?.id });
  const [fullName, setFullName] = useState(
    user.firstName + " " + user.lastName
  );
  const [activeTab, setActiveTab] = useState<Tab>("personal");
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const tabRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch teacher profile
  const {
    data: teacherProfile,
    isLoading,
    isError,
  } = useTeacherProfile(user.role === "TEACHER" ? user.id : undefined);

  // Tabs underline animation
  useEffect(() => {
    const index = ["personal", "cards", "lessons"].indexOf(activeTab);
    const el = tabRefs.current[index];
    if (el) setUnderlineStyle({ left: el.offsetLeft, width: el.offsetWidth });
  }, [activeTab]);

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
      if (data.imageUrl) setProfileImage(data.imageUrl);
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed");
    }
  };

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const userWithProfile = teacherProfile
    ? { ...user, TeacherProfile: teacherProfile }
    : user;

  if (isLoading) return <div>იტვირთება...</div>;
  if (isError) return <div>შეცდომა პროფილის წამოღებისას</div>;

  return (
    <div className="lg:grid lg:grid-cols-[1fr_2fr] xl:grid-cols-[1fr_3fr] lg:gap-4 relative pb-20">
      {/* Sidebar */}
      <div className="hidden lg:flex flex-col lg:order-1 order-2 sticky top-6 h-fit self-start">
        <OurLessons
          profilePage={true}
          teacher={user.role === "TEACHER"}
          lessons={lessons}
        />
        <PremiumStats profilePage={true} />
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:order-2">
        <div className="bg-white p-4 rounded-2xl mt-8 lg:mt-6">
          {/* Header */}
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
                  {user.role === "TEACHER" ? "რეპეტიტორი" : "სტუდენტი"}
                </span>
                <span className="text-xs leading-4 text-[#737373] font-helveticaneue-regular mt-4">
                  რეგისტრაციის თარიღი: 25 აგვისტო, 2025
                </span>
              </div>
            </div>

            {/* Camera */}
            {user.role === "TEACHER" && (
              <div
                className="flex items-center justify-center mt-3 gap-[10px] bg-[#EBECF0] py-3 rounded-xl cursor-pointer sm:px-[20px] sm:h-[48px]"
                onClick={handleCameraClick}
              >
                <Camera className="text-[#737373]" />
                <span className="text-sm leading-5 text-[#737373] font-helveticaneue-regular">
                  ფოტოს შეცვლა
                </span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
              </div>
            )}
          </div>

          <hr className="text-[#F1F1F1] my-4" />

          {/* Tabs */}
          <div className="scroll-wrapper relative">
            <div className="flex w-full overflow-x-auto gap-6 py-2">
              {(["personal", "cards", "lessons"] as Tab[]).map((tab, index) => {
                const label =
                  tab === "personal"
                    ? "პირადი ინფორმაცია"
                    : tab === "cards"
                    ? "ბარათები"
                    : "გაკვეთილების ისტორია";
                return (
                  <span
                    key={tab}
                    ref={(el: HTMLSpanElement | null) => {
                      tabRefs.current[index] = el;
                    }}
                    onClick={() => setActiveTab(tab)}
                    className={`shrink-0 text-sm leading-5 cursor-pointer px-2 py-4 relative ${
                      activeTab === tab
                        ? "text-[#080808] font-helveticaneue-medium"
                        : "text-[#737373] font-helveticaneue-regular hover:text-[#080808] transition-colors"
                    }`}
                  >
                    {label}
                  </span>
                );
              })}

              {/* Underline */}
              <span
                className="absolute bottom-0 h-1 bg-yellow-400 rounded-full transition-all duration-200"
                style={{
                  left: underlineStyle.left,
                  width: underlineStyle.width,
                }}
              />
            </div>
            <hr className="text-[#F1F1F1] mt-2" />
          </div>

          {/* Content */}
          {activeTab === "personal" && teacherProfile && (
            <TeacherInfo
              user={userWithProfile}
              fullName={fullName}
              setFullName={setFullName}
            />
          )}
          {activeTab === "cards" && <Card />}
          {activeTab === "lessons" && <LessonsHistory />}
        </div>

        {/* Mobile sidebar */}
        <div className="md:grid md:grid-cols-2 md:gap-4 lg:hidden">
          <OurLessons
            profilePage={true}
            teacher={user.role === "TEACHER"}
            lessons={lessons}
          />
          <PremiumStats profilePage={true} />
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo;
