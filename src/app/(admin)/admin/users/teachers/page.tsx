"use client";

import React, { useState } from "react";
import AdminNavbar from "../../../../../../components/admin/AdminNavbar";
import { useTeachers } from "@/hooks/useTeachers";
import Image from "next/image";
import { CloseCircle, TrashFull, Check } from "react-coolicons";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import toast from "react-hot-toast";

type Teacher = {
  id: string;
  userId: string;
  age: number | null;
  city: string | null;
  profession: string | null;
  education: string | null;
  currentStep: number;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
  goal: string | null;
  experienceYears: string | null;
  preferredAgeGroups: string[];
  hasCertificate: boolean | null;
  certificateDescription: string | null;
  certificateFiles: string[];
  offersFreeIntroLesson: boolean | null;
  hasIntroVideo: boolean | null;
  introVideoUrl: string | null;
  howDidYouHearAboutUs: string | null;
  user: {
    id: string;
    role: string;
    firstName?: string;
    lastName?: string;
    email: string;
    emailVerified: string | null;
    phoneNumber: string;
    image?: string | null;
    acceptedTerms: boolean;
    acceptedPrivacy: boolean;
    isActive: boolean;
    banned: boolean;
    banReason: string | null;
  };
  teacherSubjects: {
    id: string;
    teacherId: string;
    name: string;
    price: number;
  }[];
  lessons: [];
};

const AdminTeacher: React.FC = () => {
  const { user, isLoading } = useAdminAuth();
  const [expandedTeacher, setExpandedTeacher] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  
  const [showBanModal, setShowBanModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUserName, setSelectedUserName] = useState<string>("");
  const [banReason, setBanReason] = useState("");

  const { data, refetch } = useTeachers();

  const toggleExpand = (teacherId: string) => {
    setExpandedTeacher(expandedTeacher === teacherId ? null : teacherId);
  };

  const filteredTeachers = data?.teachers?.filter((teacher: Teacher) => {
    const fullName = `${teacher.user.firstName || ""} ${
      teacher.user.lastName || ""
    }`.toLowerCase();
    const email = teacher.user.email.toLowerCase();
    const searchLower = searchTerm.toLowerCase();

    return fullName.includes(searchLower) || email.includes(searchLower);
  });

  const handleDeleteUser = async (userId: string, userName: string) => {
    const confirmed = window.confirm(
      `დარწმუნებული ხართ, რომ გსურთ ${userName}-ის ᲡᲐᲛᲣᲓᲐᲛᲝᲓ წაშლა?\n\nწაიშლება:\n• მომხმარებლის ანგარიში\n• ყველა გაკვეთილი\n• ყველა ჯავშანი\n• ყველა შეფასება\n• ყველა ფაილი\n\nეს მოქმედება შეუქცევადია!`
    );

    if (!confirmed) return;

    setActionLoading(true);
    try {
      const res = await fetch("/api/admin/delete-user", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ userId }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(`${userName} წარმატებით წაიშალა`);
        refetch();
      } else {
        toast.error(data.error || "მომხმარებლის წაშლა ვერ მოხერხდა");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("დაფიქსირდა შეცდომა");
    } finally {
      setActionLoading(false);
    }
  };

  const handleBanUser = (userId: string, userName: string) => {
    setSelectedUserId(userId);
    setSelectedUserName(userName);
    setBanReason("");
    setShowBanModal(true);
  };

  const submitBan = async () => {
    if (!selectedUserId) return;

    if (banReason.trim().length < 10) {
      toast.error("ბანის მიზეზი უნდა იყოს მინიმუმ 10 სიმბოლო");
      return;
    }

    setActionLoading(true);
    try {
      const res = await fetch("/api/admin/ban-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ 
          userId: selectedUserId, 
          banReason: banReason.trim() 
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("მომხმარებელი დაიბლოკა წარმატებით");
        setShowBanModal(false);
        setSelectedUserId(null);
        setSelectedUserName("");
        setBanReason("");
        refetch();
      } else {
        toast.error(data.error || "ბლოკირება ვერ მოხერხდა");
      }
    } catch (error) {
      console.error("Ban error:", error);
      toast.error("დაფიქსირდა შეცდომა");
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnbanUser = async (userId: string, userName: string) => {
    const confirmed = window.confirm(
      `დარწმუნებული ხართ, რომ გსურთ ${userName}-ის განბლოკვა?`
    );

    if (!confirmed) return;

    setActionLoading(true);
    try {
      const res = await fetch("/api/admin/unban-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ userId }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(`${userName} განიბლოკა წარმატებით`);
        refetch();
      } else {
        toast.error(data.error || "განბლოკვა ვერ მოხერხდა");
      }
    } catch (error) {
      console.error("Unban error:", error);
      toast.error("დაფიქსირდა შეცდომა");
    } finally {
      setActionLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen bg-[#081028] flex justify-center items-center text-white">
        იტვირთება...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#081028] grid grid-cols-5 px-4 py-4 gap-4">
      <AdminNavbar user={user} />

      <div className="bg-gradient-to-br from-[#0A1330] to-[#151F45] col-span-4 rounded-2xl shadow-2xl border border-[#1A2450] p-8 flex flex-col h-[calc(100vh-2rem)]">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-white">
            მასწავლებლების მართვა ({filteredTeachers?.length || 0})
          </h2>

          <div className="relative w-80">
            <input
              type="text"
              placeholder="ძებნა სახელით ან ელფოსტით..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 bg-[#0A1330] border border-[#2A3650] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          {filteredTeachers?.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
              <p className="text-xl mb-2">მასწავლებელი არ მოიძებნა</p>
              <p className="text-sm">
                {searchTerm
                  ? `შედეგები არ არის "${searchTerm}"-სთვის`
                  : "მასწავლებლები არ არის ხელმისაწვდომი"}
              </p>
            </div>
          ) : (
            <ul className="h-full overflow-y-auto pr-2 custom-scrollbar space-y-4">
              {filteredTeachers?.map((item: Teacher) => (
                <li
                  key={item.id}
                  className="text-white border border-[#2A3650] rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div
                    className="flex items-center gap-4 p-4 cursor-pointer hover:bg-[#1A2450] transition-colors"
                    onClick={() => toggleExpand(item.id)}
                  >
                    <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                      <Image
                        src={item.user.image || "/images/default-profile.png"}
                        alt={item.user.firstName || "სურათი"}
                        width={64}
                        height={64}
                        className="object-cover w-full h-full"
                      />
                    </div>

                    <div className="flex-1 flex flex-col justify-between h-full">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold text-white">
                            {item.user.firstName} {item.user.lastName}
                          </h3>
                          <p className="text-gray-400 text-sm">
                            {item.user.email}
                          </p>
                          <p className="text-gray-400 text-sm">
                            {item.user.phoneNumber}
                          </p>
                          
                          {item.user.banned && (
                            <div className="mt-2 bg-red-900 border border-red-500 rounded px-3 py-1.5 inline-block">
                              <p className="text-red-300 text-sm font-bold">
                                ⛔ დაბლოკილია: {item.user.banReason}
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col justify-between items-end h-full">
                          <span
                            className={`px-3 py-1 rounded text-xs font-medium ${
                              item.completed ? "bg-green-500" : "bg-yellow-500"
                            }`}
                          >
                            {item.completed
                              ? "დასრულებული"
                              : `ნაბიჯი ${item.currentStep}`}
                          </span>
                          <span className="text-gray-400 mt-2">
                            {expandedTeacher === item.id ? "▲" : "▼"}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-3 justify-end" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleDeleteUser(
                            item.user.id,
                            `${item.user.firstName} ${item.user.lastName}`
                          )}
                          disabled={actionLoading}
                          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="მომხმარებლის წაშლა"
                        >
                          <TrashFull className="w-4 h-4" />
                          <span className="text-sm font-medium">წაშლა</span>
                        </button>

                        {item.user.banned ? (
                          <button
                            onClick={() => handleUnbanUser(
                              item.user.id,
                              `${item.user.firstName} ${item.user.lastName}`
                            )}
                            disabled={actionLoading}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="განბლოკვა"
                          >
                            <Check className="w-4 h-4" />
                            <span className="text-sm font-medium">განბლოკვა</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleBanUser(
                              item.user.id,
                              `${item.user.firstName} ${item.user.lastName}`
                            )}
                            disabled={actionLoading}
                            className="flex items-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="დაბლოკვა"
                          >
                            <CloseCircle className="w-4 h-4" />
                            <span className="text-sm font-medium">დაბლოკვა</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {expandedTeacher === item.id && (
                    <div className="p-4 bg-[#0A1330] border-t border-[#2A3650]">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h3 className="font-bold text-lg mb-2">
                            საბაზისო ინფორმაცია
                          </h3>
                          <div className="space-y-2 text-sm">
                            <p>
                              <span className="font-semibold">ასაკი:</span>{" "}
                              {item.age || "არ არის მითითებული"}
                            </p>
                            <p>
                              <span className="font-semibold">ქალაქი:</span>{" "}
                              {item.city || "არ არის მითითებული"}
                            </p>
                            <p>
                              <span className="font-semibold">განათლება:</span>{" "}
                              {item.education || "არ არის მითითებული"}
                            </p>
                            <p>
                              <span className="font-semibold">გამოცდილება:</span>{" "}
                              {item.experienceYears || "არ არის მითითებული"}
                            </p>
                          </div>
                        </div>

                        <div>
                          <h3 className="font-bold text-lg mb-2">
                            პროფესიული ინფორმაცია
                          </h3>
                          <div className="space-y-2 text-sm">
                            <p>
                              <span className="font-semibold">პროფესია:</span>{" "}
                              {item.profession || "არ არის მითითებული"}
                            </p>
                            <p>
                              <span className="font-semibold">სერთიფიკატი:</span>{" "}
                              {item.hasCertificate ? "კი" : "არა"}
                            </p>
                          </div>
                        </div>

                        {item.teacherSubjects.length > 0 && (
                          <div className="col-span-2">
                            <h3 className="font-bold text-lg mb-2">საგნები</h3>
                            <div className="flex flex-wrap gap-2">
                              {item.teacherSubjects.map((subject) => (
                                <span
                                  key={subject.id}
                                  className="bg-[#1A2450] px-3 py-1 rounded-full text-sm"
                                >
                                  {subject.name} - ₾{subject.price}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {showBanModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0A1330] border-2 border-yellow-500 rounded-lg p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold text-yellow-400 mb-4">
              ⚠️ მომხმარებლის დაბლოკვა
            </h3>
            
            <p className="text-white mb-2">
              დაბლოკვა: <strong>{selectedUserName}</strong>
            </p>
            
            <p className="text-gray-300 mb-4">
              გთხოვთ მიუთითოთ დაბლოკვის მიზეზი (მინიმუმ 10 სიმბოლო):
            </p>

            <textarea
              value={banReason}
              onChange={(e) => setBanReason(e.target.value)}
              className="w-full px-4 py-3 bg-[#1A2450] border border-[#2A3650] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500 min-h-[120px] resize-none"
              placeholder="მაგ: წესების დარღვევა, შეურაცხმყოფელი კომენტარები, სპამი..."
              disabled={actionLoading}
            />

            <p className="text-gray-400 text-sm mt-2">
              სიმბოლოები: {banReason.length} / 10 მინიმუმ
            </p>

            <div className="flex gap-3 mt-6">
              <button
                onClick={submitBan}
                disabled={actionLoading || banReason.trim().length < 10}
                className="flex-1 bg-yellow-600 text-white px-4 py-3 rounded-lg hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
              >
                {actionLoading ? "იბლოკება..." : "დაბლოკვა"}
              </button>
              <button
                onClick={() => {
                  setShowBanModal(false);
                  setSelectedUserId(null);
                  setSelectedUserName("");
                  setBanReason("");
                }}
                disabled={actionLoading}
                className="flex-1 bg-gray-600 text-white px-4 py-3 rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-colors"
              >
                გაუქმება
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTeacher;
