"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function AccountSettingsPage() {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmText, setConfirmText] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDeleteAccount = async () => {
    // Validation
    if (!password) {
      toast.error("გთხოვთ შეიყვანოთ პაროლი");
      return;
    }

    // 🔥 CHANGED: Now checks for Georgian text "წაშლა"
    if (confirmText !== "წაშლა") {
      toast.error('გთხოვთ ჩაწეროთ: წაშლა');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/users/delete-account", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ 
          password, 
          confirmText: "DELETE MY ACCOUNT" // Backend still expects this
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("თქვენი ანგარიში წაიშალა წარმატებით");
        setTimeout(() => {
          router.push("/");
        }, 2000);
      } else {
        toast.error(data.error || "ანგარიშის წაშლა ვერ მოხერხდა");
      }
    } catch (error) {
      console.error("Delete account error:", error);
      toast.error("დაფიქსირდა შეცდომა");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A1330] to-[#151F45] p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            ანგარიშის პარამეტრები
          </h1>
          <p className="text-gray-400">
            მართეთ თქვენი ანგარიში და პირადი მონაცემები
          </p>
        </div>

        {/* Profile Settings Card */}
        <div className="bg-[#1A2450] border border-[#2A3650] rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-white mb-4">
            📋 პროფილის ინფორმაცია
          </h2>
          <p className="text-gray-300 mb-4">
            თქვენ შეგიძლიათ შეცვალოთ თქვენი პროფილის ინფორმაცია დაშბორდიდან.
          </p>
          <button
            onClick={() => router.push("/dashboard")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            პროფილის რედაქტირება
          </button>
        </div>

        {/* Privacy Settings Card */}
        <div className="bg-[#1A2450] border border-[#2A3650] rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-white mb-4">
            🔒 კონფიდენციალურობა
          </h2>
          <p className="text-gray-300">
            თქვენი პირადი მონაცემები დაცულია და არ გაიზიარება მესამე მხარესთან.
          </p>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-950 border-2 border-red-500 rounded-lg p-6">
          <h2 className="text-xl font-bold text-red-400 mb-2">
            ⚠️ საშიშროების ზონა
          </h2>
          <p className="text-red-300 mb-4">
            ანგარიშის წაშლის შემდეგ აღდგენა შეუძლებელია. გთხოვთ იყოთ ფრთხილად.
          </p>

          <div className="bg-red-900 border border-red-700 rounded-lg p-4 mb-4">
            <p className="text-white font-semibold mb-2">
              ანგარიშის წაშლის შემდეგ:
            </p>
            <ul className="list-disc list-inside text-red-200 space-y-1">
              <li>წაიშლება თქვენი პროფილი და პირადი ინფორმაცია</li>
              <li>წაიშლება ყველა თქვენი გაკვეთილი</li>
              <li>წაიშლება ყველა დაჯავშნილი გაკვეთილი</li>
              <li>წაიშლება ყველა შეფასება და კომენტარი</li>
              <li>წაიშლება ყველა ატვირთული ფაილი</li>
            </ul>
          </div>

          <button
            onClick={() => setShowDeleteModal(true)}
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold"
          >
            🗑️ ანგარიშის წაშლა
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0A1330] border-2 border-red-500 rounded-lg p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold text-red-400 mb-4">
              ⚠️ ანგარიშის წაშლა
            </h3>

            <div className="bg-red-950 border border-red-700 rounded-lg p-4 mb-4">
              <p className="text-white font-semibold mb-2">
                ეს მოქმედება <strong className="text-red-400">შეუქცევადია</strong>!
              </p>
              <p className="text-red-200 text-sm">
                მუდმივად წაიშლება:
              </p>
              <ul className="list-disc list-inside text-red-200 text-sm mt-2 space-y-1">
                <li>პროფილი და პირადი ინფორმაცია</li>
                <li>ყველა გაკვეთილი და ჯავშანი</li>
                <li>ყველა შეფასება</li>
                <li>ყველა ფაილი</li>
              </ul>
            </div>

            <div className="mb-4">
              <label className="block text-white font-semibold mb-2">
                დაადასტურეთ თქვენი პაროლი:
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#1A2450] border border-[#2A3650] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                placeholder="შეიყვანეთ პაროლი"
                disabled={loading}
              />
            </div>

            <div className="mb-6">
              <label className="block text-white font-semibold mb-2">
                ჩაწერეთ <code className="bg-red-900 px-2 py-1 rounded text-red-300">წაშლა</code> დასადასტურებლად:
              </label>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                className="w-full bg-[#1A2450] border border-[#2A3650] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                placeholder="წაშლა"
                disabled={loading}
              />
              {confirmText && confirmText !== "წაშლა" && (
                <p className="text-red-400 text-sm mt-1">
                  ჩაწერეთ ზუსტად: წაშლა
                </p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleDeleteAccount}
                disabled={loading || !password || confirmText !== "წაშლა"}
                className="flex-1 bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
              >
                {loading ? "იშლება..." : "✓ დადასტურება და წაშლა"}
              </button>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setPassword("");
                  setConfirmText("");
                }}
                disabled={loading}
                className="flex-1 bg-gray-600 text-white px-4 py-3 rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-colors"
              >
                გაუქმება
              </button>
            </div>

            <p className="text-gray-400 text-xs mt-4 text-center">
              წაშლის შემდეგ დაუყოვნებლივ გამოხვალთ სისტემიდან
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
