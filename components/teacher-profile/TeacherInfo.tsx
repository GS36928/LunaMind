"use client";
import { useClickOutside } from "@/hooks/useClickOutside";
import React, { useState, useEffect, useRef } from "react";
import { CaretDownSm, CaretUpSm, TrashFull } from "react-coolicons";
import toast from "react-hot-toast";

// Types (უცვლელი)
export type TeacherSubject = {
  id: string;
  teacherId: string;
  name: string;
  price: number;
};

type TeacherProfile = {
  age?: number;
  city?: string;
  teacherSubjects?: TeacherSubject[];
  education?: "BACHELOR" | "MASTER" | "DOCTORATE" | "OTHER";
  experienceYears?: "0-1" | "2-5" | "6-10" | "10+";
  preferredAgeGroups?: string[];
  hasCertificate?: boolean;
  offersFreeIntroLesson?: boolean;
  hasIntroVideo?: boolean;
  goal?:
    | "ახალი მოსწავლეების მოვნა"
    | "გამოცდილების გაზიარება"
    | "დამატებითი შემოსავლის მიღება"
    | "პროფესიული ზრდა, განვითარება";
  howDidYouHearAboutUs?: "მეგობრისგან" | "სოციალური ქსელიდან" | "რეკლამიდან";
  certificateDescription?: string;
  certificateFiles?: string[];
  introVideoUrl?: string;
};

type User = {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber?: string;
  role: "STUDENT" | "TEACHER";
  TeacherProfile?: TeacherProfile;
};

// Props (უცვლელი)
interface TeacherInfoProps {
  user: User;
  fullName: string;
  setFullName: (val: string) => void;
}

interface InputTeacherInfoProps {
  value: string | number;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
}

interface BooleanToggleProps {
  value: boolean;
  onChange: () => void;
  label?: string;
}

// Input component (უცვლელი)
const InputTeacherInfo: React.FC<InputTeacherInfoProps> = ({
  value,
  onChange,
  placeholder,
  className,
}) => (
  <input
    type="text"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    className={`w-full border border-[#F1F1F1] rounded-xl text-sm leading-5 text-[#000000] font-helveticaneue-regular p-4 focus:outline-none ${className}`}
  />
);

// Boolean toggle component (უცვლელი)
const BooleanToggle: React.FC<BooleanToggleProps> = ({ value, onChange }) => (
  <div className="grid grid-cols-2 gap-2 items-center mt-2">
    <span
      className={`border border-[#F0C514] rounded-xl text-sm leading-5 text-[#000000] font-helveticaneue-medium px-3 py-4 text-start ${
        value ? "bg-[#F0C5141A]" : ""
      }`}
      onClick={onChange}
    >
      კი
    </span>
    <span
      className={`border border-[#F0C514] rounded-xl text-sm leading-5 text-[#000000] font-helveticaneue-medium px-3 py-4 text-start ${
        !value ? "bg-[#F0C5141A]" : ""
      }`}
      onClick={onChange}
    >
      არა
    </span>
  </div>
);

// Helper function for education labels (უცვლელი)
const getEducationLabel = (education: TeacherProfile["education"]): string => {
  switch (education) {
    case "BACHELOR":
      return "ბაკალავრი";
    case "MASTER":
      return "მაგისტრი";
    case "DOCTORATE":
      return "დოქტორი";
    case "OTHER":
      return "სხვა";
    default:
      return "აირჩიე ხარისხი";
  }
};

// Helper function to extract filename from URL (უცვლელი)
const getFileNameFromUrl = (url: string): string => {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    return pathname.split("/").pop() || "File";
  } catch {
    return "File";
  }
};

const TeacherInfo: React.FC<TeacherInfoProps> = ({
  user,
  fullName,
  setFullName,
}) => {
  const profile = user.TeacherProfile;

  // Personal info (უცვლელი)
  const [age, setAge] = useState(profile?.age?.toString() || "");
  const [phone, setPhone] = useState(user.phoneNumber || "");
  const [email, setEmail] = useState(user.email || "");
  const [city, setCity] = useState(profile?.city || "");

  // Subjects (უცვლელი)
  const [subjects, setSubjects] = useState<TeacherSubject[]>(
    profile?.teacherSubjects || []
  );

  // Dropdowns (უცვლელი)
  const educationOptions: TeacherProfile["education"][] = [
    "BACHELOR",
    "MASTER",
    "DOCTORATE",
    "OTHER",
  ];
  const [education, setEducation] = useState<
    TeacherProfile["education"] | undefined
  >(profile?.education);
  const [openEducationDropdown, setOpenEducationDropdown] = useState(false);

  const experienceOptions: TeacherProfile["experienceYears"][] = [
    "0-1",
    "2-5",
    "6-10",
    "10+",
  ];
  const [experienceYears, setExperienceYears] = useState<
    TeacherProfile["experienceYears"]
  >(profile?.experienceYears);
  const [openExperienceDropdown, setOpenExperienceDropdown] = useState(false);

  const ageGroupsOptions: string[] = [
    "დაწყებითი კლასები",
    "საშუალო კლასები",
    "აბიტურიენტები",
    "სტუდენტები",
    "მოზრდილები",
  ];
  const [preferredAgeGroups, setPreferredAgeGroups] = useState<string[]>(
    profile?.preferredAgeGroups || []
  );

  const [hasCertificate, setHasCertificate] = useState(
    profile?.hasCertificate || false
  );
  const [certificateDescription, setCertificateDescription] = useState(
    profile?.certificateDescription || ""
  );

  // 🆕 QuestionsClient-ის სტილის ფაილების მენეჯმენტი
  const [certificateFiles, setCertificateFiles] = useState<File[]>([]);
  const [introVideoFile, setIntroVideoFile] = useState<File | null>(null);
  const [existingCertificateFiles, setExistingCertificateFiles] = useState<
    string[]
  >(profile?.certificateFiles || []);
  const [existingIntroVideoUrl, setExistingIntroVideoUrl] = useState<
    string | undefined
  >(profile?.introVideoUrl);

  const [offersFreeIntroLesson, setOffersFreeIntroLesson] = useState(
    profile?.offersFreeIntroLesson || false
  );
  const [hasIntroVideo, setHasIntroVideo] = useState(
    profile?.hasIntroVideo || false
  );

  const goalOptions: TeacherProfile["goal"][] = [
    "ახალი მოსწავლეების მოვნა",
    "გამოცდილების გაზიარება",
    "დამატებითი შემოსავლის მიღება",
    "პროფესიული ზრდა, განვითარება",
  ];
  const [goal, setGoal] = useState<TeacherProfile["goal"]>(profile?.goal);
  const [openGoalDropdown, setOpenGoalDropdown] = useState(false);

  const hearAboutUsOptions: TeacherProfile["howDidYouHearAboutUs"][] = [
    "მეგობრისგან",
    "სოციალური ქსელიდან",
    "რეკლამიდან",
  ];
  const [howDidYouHearAboutUs, setHowDidYouHearAboutUs] = useState<
    TeacherProfile["howDidYouHearAboutUs"]
  >(profile?.howDidYouHearAboutUs);
  const [openHearDropdown, setOpenHearDropdown] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  // Load existing data when profile changes
  useEffect(() => {
    if (profile) {
      setExistingCertificateFiles(profile.certificateFiles || []);
      setExistingIntroVideoUrl(profile.introVideoUrl);
    }
  }, [profile]);

  const closeOthers = (except: string) => {
    if (except !== "education") setOpenEducationDropdown(false);
    if (except !== "experience") setOpenExperienceDropdown(false);
    if (except !== "goal") setOpenGoalDropdown(false);
    if (except !== "hear") setOpenHearDropdown(false);
  };

  // Subjects helpers (უცვლელი)
  const allSubjects: string[] = [
    "მათემატიკა",
    "ქართული",
    "ისტორია",
    "გეოგრაფია",
    "ქიმია",
    "ფიზიკა",
    "ბიოლოგია",
    "ხელოვნება",
    "ინგლისური",
    "რუსული",
    "გერმანული",
    "ესპანური",
    "ფრანგული",
    "დაწყებითი კლასები",
  ];

  const handleSubjectChange = (
    index: number,
    key: keyof TeacherSubject,
    value: string | number
  ) => {
    setSubjects((prev) =>
      prev.map((s, i) => (i === index ? { ...s, [key]: value } : s))
    );
  };

  // 🆕 ფაილების დამუშავება
  const handleCertificateFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setCertificateFiles(filesArray);
    }
  };

  const handleIntroVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIntroVideoFile(e.target.files[0]);
    }
  };

  // 🆕 წაშლის ფუნქციები
  const handleDeleteCertificate = async (fileUrl: string) => {
    if (!confirm("დარწმუნებული ხართ, რომ გსურთ ამ სერტიფიკატის წაშლა?")) {
      return;
    }

    try {
      const response = await fetch("/api/teachers/deleteFile", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          fileUrl,
          fileType: "certificate",
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setExistingCertificateFiles((prev) =>
          prev.filter((url) => url !== fileUrl)
        );
        toast.success("სერტიფიკატი წარმატებით წაიშალა");
      } else {
        throw new Error(data.error || "Failed to delete certificate");
      }
    } catch (error) {
      console.error("Error deleting certificate:", error);
      toast.error("სერტიფიკატის წაშლა ვერ მოხერხდა");
    }
  };

  const handleDeleteVideo = async () => {
    if (!existingIntroVideoUrl) return;

    if (!confirm("დარწმუნებული ხართ, რომ გსურთ ვიდეოს წაშლა?")) {
      return;
    }

    try {
      const response = await fetch("/api/teachers/deleteFile", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          fileUrl: existingIntroVideoUrl,
          fileType: "video",
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setExistingIntroVideoUrl(undefined);
        setIntroVideoFile(null);
        toast.success("ვიდეო წარმატებით წაიშალა");
      } else {
        throw new Error(data.error || "Failed to delete video");
      }
    } catch (error) {
      console.error("Error deleting video:", error);
      toast.error("ვიდეოს წაშლა ვერ მოხერხდა");
    }
  };

  // 🆕 განახლების ფუნქცია - FormData-ს გამოყენებით
  const handleUpdate = async () => {
    try {
      setIsLoading(true);

      // შექმენი FormData
      const formData = new FormData();
      formData.append("userId", user.id);

      // User basic info
      const nameParts = fullName.trim().split(" ");
      formData.append("firstName", nameParts[0] || "");
      formData.append("lastName", nameParts.slice(1).join(" ") || "");
      if (email) formData.append("email", email);
      if (phone) formData.append("phoneNumber", phone);

      // TeacherProfile data
      if (age) formData.append("age", age);
      if (city) formData.append("city", city);
      if (education) formData.append("education", education);
      if (experienceYears) formData.append("experienceYears", experienceYears);
      formData.append("preferredAgeGroups", JSON.stringify(preferredAgeGroups));
      formData.append("hasCertificate", hasCertificate.toString());
      formData.append(
        "offersFreeIntroLesson",
        offersFreeIntroLesson.toString()
      );
      formData.append("hasIntroVideo", hasIntroVideo.toString());
      if (goal) formData.append("goal", goal);
      if (howDidYouHearAboutUs)
        formData.append("howDidYouHearAboutUs", howDidYouHearAboutUs);
      if (certificateDescription)
        formData.append("certificateDescription", certificateDescription);

      // Subjects
      formData.append(
        "teacherSubjects",
        JSON.stringify(subjects.filter((s) => s.price > 0))
      );

      // Existing files
      formData.append(
        "existingCertificateFiles",
        JSON.stringify(existingCertificateFiles)
      );
      if (existingIntroVideoUrl) {
        formData.append("existingIntroVideoUrl", existingIntroVideoUrl);
      }

      // New files
      certificateFiles.forEach((file) => {
        formData.append("certificateFiles", file);
      });

      if (introVideoFile) {
        formData.append("introVideo", introVideoFile);
      }

      console.log("📤 Sending form data with files:", {
        certificateFiles: certificateFiles.length,
        introVideo: !!introVideoFile,
        existingCertificates: existingCertificateFiles.length,
      });

      // გამოიყენე PATCH მეთოდი და FormData
      const response = await fetch("/api/teachers/updateProfile", {
        method: "PATCH",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("❌ Server error response:", data);
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      if (data.success) {
        console.log("✅ Profile updated successfully:", data);
        toast.success("პროფილი წარმატებით განახლდა!");

        // განაახლე ატვირთული ფაილების URL-ები
        if (data.uploadedCertificateUrls) {
          setExistingCertificateFiles(data.uploadedCertificateUrls);
        }
        if (data.uploadedVideoUrl) {
          setExistingIntroVideoUrl(data.uploadedVideoUrl);
        }

        // გაასუფთავე ახალი ფაილების სია
        setCertificateFiles([]);
        setIntroVideoFile(null);
      } else {
        console.error("❌ Update failed:", data);
        toast.error("პროფილის განახლება ვერ მოხერხდა.");
      }
    } catch (err: unknown) {
      console.error("💥 Update failed:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      toast.error(`პროფილის განახლება ვერ მოხერხდა: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const educationRef = useRef<HTMLDivElement>(null);
  const experienceRef = useRef<HTMLDivElement>(null);
  const goalRef = useRef<HTMLDivElement>(null);
  const hearRef = useRef<HTMLDivElement>(null);

  useClickOutside(educationRef, () => setOpenEducationDropdown(false));
  useClickOutside(experienceRef, () => setOpenExperienceDropdown(false));
  useClickOutside(goalRef, () => setOpenGoalDropdown(false));
  useClickOutside(hearRef, () => setOpenHearDropdown(false));

  return (
    <div className="mt-4 flex flex-col gap-4">
      {/* Personal Info (უცვლელი) */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <InputTeacherInfo
          value={fullName}
          onChange={setFullName}
          placeholder="სრული სახელი"
        />
        <InputTeacherInfo value={age} onChange={setAge} placeholder="ასაკი" />
      </div>
      <div className="flex flex-col gap-4 sm:flex-row">
        <InputTeacherInfo
          value={phone}
          onChange={setPhone}
          placeholder="ტელეფონი"
        />
        <InputTeacherInfo
          value={email}
          onChange={setEmail}
          placeholder="Email"
        />
      </div>
      <div className="flex flex-col gap-4 sm:flex-row">
        <InputTeacherInfo
          value={city}
          onChange={setCity}
          placeholder="ქალაქი"
        />
      </div>

      {/* Subjects (უცვლელი) */}
      <div>
        <h3 className="text-sm leading-5 text-[#737373] font-helveticaneue-regular">
          საგნები და ფასები
        </h3>
        <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {allSubjects.map((sub) => {
            const isSelected = subjects.some((s) => s.name === sub);
            return (
              <button
                key={sub}
                type="button"
                onClick={() => {
                  if (isSelected)
                    setSubjects((prev) => prev.filter((s) => s.name !== sub));
                  else
                    setSubjects((prev) => [
                      ...prev,
                      {
                        id: Date.now().toString(),
                        teacherId: user.id,
                        name: sub,
                        price: 0,
                      },
                    ]);
                }}
                className={`border border-[#F0C514] rounded-xl text-sm leading-5 text-[#000000] font-helveticaneue-medium px-3 py-4 text-start ${
                  isSelected ? "bg-[#F0C5141A]" : ""
                }`}
              >
                {sub}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Subjects (უცვლელი) */}
      {subjects.length > 0 && (
        <div>
          <h3 className="text-sm leading-5 text-[#737373] font-helveticaneue-regular">
            არჩეული საგნები
          </h3>
          <div className="flex flex-col gap-2 mt-2">
            {subjects.map((s, idx) => (
              <div key={s.id} className="grid grid-cols-2 gap-2 xl:grid-cols-6">
                <span className="border border-[#F0C514] bg-[#F0C5141A] rounded-xl text-sm leading-5 text-[#000000] font-helveticaneue-medium px-3 py-4 xl:col-span-2 2xl:col-span-1">
                  {s.name}
                </span>
                <div className="flex items-center gap-2 xl:col-span-1">
                  <InputTeacherInfo
                    value={s.price}
                    onChange={(val) =>
                      handleSubjectChange(idx, "price", Number(val))
                    }
                    placeholder="ფასი"
                  />
                  <TrashFull
                    width={24}
                    height={24}
                    color="#D80303"
                    className="cursor-pointer"
                    onClick={() =>
                      setSubjects((prev) =>
                        prev.filter((sub) => sub.id !== s.id)
                      )
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Higher Education Dropdown (უცვლელი) */}
      <div className="w-full max-w-lg" ref={educationRef}>
        <h3 className="text-sm leading-5 text-[#737373] font-helveticaneue-regular">
          უმაღლესი განათლება
        </h3>
        <div className="relative mt-2">
          <button
            type="button"
            className={`w-full border border-[#EBECF0]  px-2 py-[18px] text-left text-sm leading-5 font-helveticaneue-medium flex justify-between items-center
              ${openEducationDropdown ? "rounded-t-xl" : "rounded-xl"}`}
            onClick={() => {
              setOpenEducationDropdown(!openEducationDropdown);
              closeOthers("education");
            }}
          >
            {getEducationLabel(education)}{" "}
            <span>
              {openEducationDropdown ? (
                <CaretUpSm color="#969696" width={24} height={24} />
              ) : (
                <CaretDownSm color="#969696" width={24} height={24} />
              )}
            </span>
          </button>
          {openEducationDropdown && (
            <ul className="absolute z-10 mt-0 w-full bg-white border border-[#EBECF0] rounded-b-xl shadow-lg">
              {educationOptions.map((opt) => (
                <li
                  key={opt}
                  onClick={() => {
                    setEducation(opt);
                    setOpenEducationDropdown(false);
                  }}
                  className={`px-2 py-[18px] text-sm cursor-pointer font-helveticaneue-medium hover:bg-[#F0C5141A] ${
                    education === opt ? "bg-[#F0C5141A] font-semibold" : ""
                  }`}
                >
                  {getEducationLabel(opt)}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Experience Years Dropdown (უცვლელი) */}
      <div className="w-full max-w-lg" ref={experienceRef}>
        <h3 className="text-sm leading-5 text-[#737373] font-helveticaneue-regular">
          რამდენ წლიანი გამოცდილება გაქვს სწავლების მიმართულებით?
        </h3>
        <div className="relative mt-2">
          <button
            type="button"
            className={`w-full border border-[#EBECF0]  px-2 py-[18px] text-left text-sm leading-5 font-helveticaneue-medium flex justify-between items-center
              ${openExperienceDropdown ? "rounded-t-xl" : "rounded-xl"}`}
            onClick={() => {
              setOpenExperienceDropdown(!openExperienceDropdown);
              closeOthers("experience");
            }}
          >
            {experienceYears || "აირჩიე"}{" "}
            {openExperienceDropdown ? (
              <CaretUpSm color="#969696" width={24} height={24} />
            ) : (
              <CaretDownSm color="#969696" width={24} height={24} />
            )}
          </button>
          {openExperienceDropdown && (
            <ul className="absolute z-10 mt-0 w-full bg-white border border-[#EBECF0] rounded-b-xl shadow-lg">
              {experienceOptions.map((opt) => (
                <li
                  key={opt}
                  onClick={() => {
                    setExperienceYears(opt);
                    setOpenExperienceDropdown(false);
                  }}
                  className={`px-2 py-[18px] text-sm cursor-pointer font-helveticaneue-medium hover:bg-[#F0C5141A] ${
                    experienceYears === opt
                      ? "bg-[#F0C5141A] font-semibold"
                      : ""
                  }`}
                >
                  {opt}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Preferred Age Groups Multi-Select (უცვლელი) */}
      <div>
        <h3 className="text-sm leading-5 text-[#737373] font-helveticaneue-regular">
          რომელ ასაკობრივ ჯგუფთან ისურვებდით მუშაობას?
        </h3>
        <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {ageGroupsOptions.map((opt) => {
            const isSelected = preferredAgeGroups.includes(opt);
            return (
              <button
                key={opt}
                type="button"
                onClick={() => {
                  if (isSelected)
                    setPreferredAgeGroups((prev) =>
                      prev.filter((a) => a !== opt)
                    );
                  else setPreferredAgeGroups((prev) => [...prev, opt]);
                }}
                className={`border border-[#F0C514] rounded-xl text-sm leading-5 text-[#000000] font-helveticaneue-medium px-3 py-4 text-start ${
                  isSelected && "bg-[#F0C5141A]"
                }`}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </div>

      {/* Boolean fields with conditional file uploads */}
      <div>
        <h3 className="text-sm leading-5 text-[#737373] font-helveticaneue-regular">
          გაქვს თუ არა სპეციალური სერთიფიკატი ან განათლება შენს სფეროში?
        </h3>
        <BooleanToggle
          value={hasCertificate}
          onChange={() => setHasCertificate((prev) => !prev)}
        />

        {/* Certificate details section */}
        {hasCertificate && (
          <div className="mt-6 space-y-5 p-5 rounded-2xl bg-gradient-to-r from-[#f9fafb] to-[#eef1f4] border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
            <h3 className="font-helveticaneue-medium text-[#0C0F21] text-base">
              🏅 სერტიფიკატის დეტალები
            </h3>

            {/* Description */}
            <div>
              <label className="block text-sm font-helveticaneue-regular text-[#0C0F21] mb-2">
                სერტიფიკატის აღწერა *
              </label>
              <input
                type="text"
                value={certificateDescription}
                onChange={(e) => setCertificateDescription(e.target.value)}
                className="w-full py-3 px-4 border border-gray-200 rounded-xl text-[#000000] 
        text-sm font-helveticaneue-regular shadow-sm
        focus:outline-none focus:ring-2 focus:ring-[#FFD52A] focus:border-0 transition-all duration-300"
                placeholder="მიუთითეთ სერტიფიკატის დეტალები..."
              />
            </div>

            {/* Existing certificates */}
            {existingCertificateFiles.length > 0 && (
              <div>
                <label className="block text-sm font-helveticaneue-regular text-[#0C0F21] mb-2">
                  არსებული სერტიფიკატები:
                </label>
                <div className="space-y-2">
                  {existingCertificateFiles.map((fileUrl, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gradient-to-r from-[#f9fafb] to-[#eef1f4] p-3 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300"
                    >
                      <div className="flex flex-col">
                        <a
                          href={fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-helveticaneue-medium text-[#0C0F21] hover:text-blue-600 transition-colors"
                        >
                          📄 {getFileNameFromUrl(fileUrl)}
                        </a>
                        <span className="text-xs text-[#6B7280]">
                          (დააწკაპუნეთ ნახვისთვის)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteCertificate(fileUrl)}
                        className="flex items-center justify-center w-8 h-8 rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition-colors duration-200"
                        title="ფაილის წაშლა"
                      >
                        <TrashFull width={16} height={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload new certificates */}
            <div>
              <label className="block text-sm font-helveticaneue-regular text-[#0C0F21] mb-2">
                {existingCertificateFiles.length > 0
                  ? "დაამატეთ ახალი სერტიფიკატები"
                  : "ატვირთეთ სერტიფიკატები (PDF/სურათი) *"}
              </label>
              <input
                type="file"
                multiple
                onChange={handleCertificateFileChange}
                className="w-full py-3 px-4 border border-gray-200 rounded-xl text-[#000000] 
        text-sm font-helveticaneue-regular shadow-sm
        focus:outline-none focus:ring-2 focus:ring-[#FFD52A] focus:border-0 transition-all duration-300"
                accept=".pdf,.jpg,.jpeg,.png"
              />
              <p className="text-xs text-[#737373] mt-1">
                მაქსიმალური ზომა: 10MB ფაილზე (PDF, JPG, PNG)
              </p>
              {certificateFiles.length > 0 && (
                <p className="text-xs text-green-600 mt-1">
                  {certificateFiles.length} ახალი ფაილი არჩეულია
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      <div>
        <h3 className="text-sm leading-5 text-[#737373] font-helveticaneue-regular">
          გსურთ თუ არა გაცნობითი ხასიათის გაკვეთილის ჩატარება უფასოდ?
        </h3>
        <BooleanToggle
          label="უფასო გაკვეთილი"
          value={offersFreeIntroLesson}
          onChange={() => setOffersFreeIntroLesson((prev) => !prev)}
        />
      </div>

      <div>
        <h3 className="text-sm leading-5 text-[#737373] font-helveticaneue-regular">
          გსურთ თუ არა წინასწარ ჩაწერილი გაცნობითი ვიდეო თქვენს პროფილზე?
        </h3>
        <BooleanToggle
          label="გაცნობითი ვიდეო"
          value={hasIntroVideo}
          onChange={() => setHasIntroVideo((prev) => !prev)}
        />

        {/* Intro video upload section */}
        {hasIntroVideo && (
          <div className="mt-6 space-y-4 p-4 border border-[#EBEBEB] rounded-[12px] bg-gray-50">
            <h3 className="font-helveticaneue-medium text-[#0C0F21] text-sm">
              გაცნობითი ვიდეო
            </h3>

            {/* Existing video */}
            {existingIntroVideoUrl && (
              <div className="mt-4">
                <label className="block text-sm font-helveticaneue-regular text-[#0C0F21] mb-2">
                  არსებული ვიდეო:
                </label>

                <div className="flex items-center justify-between bg-gradient-to-r from-[#f9fafb] to-[#eef1f4] p-3 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
                  <div className="flex flex-col">
                    <a
                      href={existingIntroVideoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-helveticaneue-medium text-[#0C0F21] hover:text-blue-600 transition-colors"
                    >
                      🎥 {getFileNameFromUrl(existingIntroVideoUrl)}
                    </a>
                    <span className="text-xs text-[#6B7280]">
                      (დააწკაპუნეთ ნახვისთვის)
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleDeleteVideo}
                    className="flex items-center justify-center w-8 h-8 rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition-colors duration-200"
                    title="ვიდეოს წაშლა"
                  >
                    <TrashFull width={16} height={16} />
                  </button>
                </div>
              </div>
            )}

            {/* New video upload */}
            <div>
              <label className="block text-sm font-helveticaneue-regular text-[#0C0F21] mb-2">
                {existingIntroVideoUrl
                  ? "შეცვალეთ ვიდეო"
                  : "ატვირთეთ გაცნობითი ვიდეო *"}
              </label>
              <input
                type="file"
                onChange={handleIntroVideoChange}
                className="w-full py-3 px-4 border border-[#EBEBEB] rounded-[8px] text-[#000000] 
                text-sm leading-5 font-helveticaneue-regular
                focus:outline-none focus:ring-2 focus:ring-[#FFD52A] focus:border-0 transition-all duration-300 ease-in-out"
                accept="video/*"
              />
              <p className="text-xs text-[#737373] mt-1">
                მაქსიმალური ზომა: 40MB
              </p>
              {introVideoFile && (
                <p className="text-xs text-green-600 mt-1">
                  ახალი ვიდეო არჩეულია: {introVideoFile.name}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Goal Dropdown (უცვლელი) */}
      <div className="w-full max-w-lg" ref={goalRef}>
        <h3 className="text-sm leading-5 text-[#737373] font-helveticaneue-regular">
          რა არის თქვენი მთავარი მიზანი ჩვენს პლატფორმაზე?
        </h3>
        <div className="relative mt-2">
          <button
            type="button"
            className={`w-full border border-[#EBECF0]  px-2 py-[18px] text-left text-sm leading-5 font-helveticaneue-medium flex justify-between items-center
              ${openGoalDropdown ? "rounded-t-xl" : "rounded-xl"}`}
            onClick={() => {
              setOpenGoalDropdown(!openGoalDropdown);
              closeOthers("goal");
            }}
          >
            {goal || "აირჩიე მიზანი"}{" "}
            {openGoalDropdown ? (
              <CaretUpSm color="#969696" width={24} height={24} />
            ) : (
              <CaretDownSm color="#969696" width={24} height={24} />
            )}
          </button>
          {openGoalDropdown && (
            <ul className="absolute z-10 mt-0 w-full bg-white border border-[#EBECF0] rounded-b-xl shadow-lg">
              {goalOptions.map((opt) => (
                <li
                  key={opt}
                  onClick={() => {
                    setGoal(opt);
                    setOpenGoalDropdown(false);
                  }}
                  className={`px-2 py-[18px] text-sm cursor-pointer font-helveticaneue-medium hover:bg-[#F0C5141A] ${
                    goal === opt ? "bg-[#F0C5141A] font-semibold" : ""
                  }`}
                >
                  {opt}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* How Did You Hear About Us Dropdown (უცვლელი) */}
      <div className="w-full max-w-lg" ref={hearRef}>
        <h3 className="text-sm leading-5 text-[#737373] font-helveticaneue-regular">
          როგორ გაიგეთ ჩვენს შესახებ?
        </h3>
        <div className="relative mt-2">
          <button
            type="button"
            className={`w-full border border-[#EBECF0]  px-2 py-[18px] text-left text-sm leading-5 font-helveticaneue-medium flex justify-between items-center
              ${openHearDropdown ? "rounded-t-xl" : "rounded-xl"}`}
            onClick={() => {
              setOpenHearDropdown(!openHearDropdown);
              closeOthers("hear");
            }}
          >
            {howDidYouHearAboutUs || "აირჩიე"}{" "}
            {openHearDropdown ? (
              <CaretUpSm color="#969696" width={24} height={24} />
            ) : (
              <CaretDownSm color="#969696" width={24} height={24} />
            )}
          </button>
          {openHearDropdown && (
            <ul className="absolute z-10 mt-0 w-full bg-white border border-[#EBECF0] rounded-b-xl shadow-lg">
              {hearAboutUsOptions.map((opt) => (
                <li
                  key={opt}
                  onClick={() => {
                    setHowDidYouHearAboutUs(opt);
                    setOpenHearDropdown(false);
                  }}
                  className={`px-2 py-[18px] text-sm cursor-pointer font-helveticaneue-medium hover:bg-[#F0C5141A] ${
                    howDidYouHearAboutUs === opt
                      ? "bg-[#F0C5141A] font-semibold"
                      : ""
                  }`}
                >
                  {opt}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <hr className="mt-4 border border-[#F1F1F1]" />
      <div className="flex justify-center lg:justify-end">
        <button
          className="mt-3 px-9 py-4 bg-[#F0C514] text-black rounded-[50px] text-sm leading-5 font-helveticaneue-medium hover:bg-[#ddb500] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          onClick={handleUpdate}
          disabled={isLoading}
        >
          {isLoading ? "იტვირთება..." : "ცვლილებების შენახვა"}
        </button>
      </div>
    </div>
  );
};

export default TeacherInfo;
