"use client";

import React, { useEffect, useRef, useState } from "react";
import StudentInfo from "../student-profile/StudentInfo";
import Card from "../student-profile/Card";
import LessonsHistory from "../student-profile/LessonsHistory";

export type Tab = "personal" | "cards" | "lessons";

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  role: "STUDENT" | "TEACHER";
  image?: string | undefined;
};

interface TabsContentProps {
  activeTab: Tab;
  handleTabChange: (tab: Tab) => void;
  user: User;
  fullName: string;
  setFullName: React.Dispatch<React.SetStateAction<string>>;
}

const TabsContent: React.FC<TabsContentProps> = ({
  activeTab,
  handleTabChange,
  user,
  fullName,
  setFullName,
}) => {
  const tabRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0 });

  // Update underline position on activeTab change
  useEffect(() => {
    const currentIndex = ["personal", "cards", "lessons"].indexOf(activeTab);
    const currentTab = tabRefs.current[currentIndex];
    if (currentTab) {
      setUnderlineStyle({
        left: currentTab.offsetLeft,
        width: currentTab.offsetWidth,
      });
    }
  }, [activeTab]);

  return (
    <div>
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
                onClick={() => handleTabChange(tab)}
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
            style={{ left: underlineStyle.left, width: underlineStyle.width }}
          />
        </div>

        {/* Base HR line */}
        <hr className="text-[#F1F1F1] mt-2" />
      </div>

      {/* Tab content */}
      {activeTab === "personal" && (
        <StudentInfo
          user={user}
          fullName={fullName}
          setFullName={setFullName}
        />
      )}
      {activeTab === "cards" && <Card />}
      {activeTab === "lessons" && <LessonsHistory />}
    </div>
  );
};

export default TabsContent;
