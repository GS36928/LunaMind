"use client";

import {
  House01,
  UsersGroup,
  Settings,
  BookOpen,
  LogOut,
  Book,
} from "react-coolicons";
import { useRouter, usePathname } from "next/navigation";

interface User {
  id: string;
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
}

interface AdminNavbarProps {
  user: User | null;
}

const AdminNavbar: React.FC<AdminNavbarProps> = ({ user }) => {
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    {
      icon: <House01 />,
      label: "Dashboard",
      color: "#CB3CFF",
      href: "/admin/dashboard",
    },
    {
      icon: <UsersGroup />,
      label: "Users",
      color: "#AEB9E1",
      href: "/admin/users",
    },
    {
      icon: <BookOpen />,
      label: "Review",
      color: "#AEB9E1",
      href: "/admin/review",
    },
    {
      icon: <Book />,
      label: "BookedLessons",
      color: "#AEB9E1",
      href: "/admin/bookedLessons",
    },
    {
      icon: <BookOpen />,
      label: "Messages",
      color: "#AEB9E1",
      href: "/admin/messages",
    },
    {
      icon: <BookOpen />,
      label: "Payments",
      color: "#AEB9E1",
      href: "/admin/payments",
    },
    {
      icon: <Settings />,
      label: "Settings",
      color: "#AEB9E1",
      href: "/admin/settings",
    },
  ];

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/admin-logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) router.push("/admin");
    } catch (err) {
      console.error("Logout error:", err);
      router.push("/admin");
    }
  };

  return (
    <div className="bg-[#0A1330] col-span-1 rounded-2xl p-6 shadow-2xl border border-[#1A2450] flex flex-col">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Evectus</h1>
        <p className="text-[#AEB9E1] text-sm mt-1">AdminPanel</p>
      </div>

      <nav className="space-y-2 flex-1">
        {menuItems.map((item, index) => {
          const isActive = pathname === item.href;
          return (
            <div
              key={index}
              onClick={() => router.push(item.href)}
              className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 group ${
                isActive
                  ? "bg-[#CB3CFF]/10 border border-[#CB3CFF]/20 shadow-lg shadow-[#CB3CFF]/5"
                  : "hover:bg-[#1A2450] hover:border hover:border-[#2D3A6E]"
              }`}
            >
              <div
                className={`transition-transform duration-200 group-hover:scale-110 ${
                  isActive ? "scale-110" : ""
                }`}
                style={{ color: isActive ? item.color : "#AEB9E1" }}
              >
                {item.icon}
              </div>
              <p
                className={`text-base font-semibold transition-all duration-200 ${
                  isActive
                    ? "text-[#CB3CFF] drop-shadow-lg"
                    : "text-[#AEB9E1] group-hover:text-white"
                }`}
              >
                {item.label}
              </p>
              {isActive && (
                <div className="ml-auto w-2 h-2 bg-[#CB3CFF] rounded-full shadow-lg shadow-[#CB3CFF]"></div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="space-y-4 pt-6 border-t border-[#1A2450]">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-[#1A2450] cursor-pointer hover:bg-[#2D3A6E] transition-all duration-200">
          <div className="w-10 h-10 bg-gradient-to-br from-[#CB3CFF] to-[#6C63FF] rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">
              {user?.firstName?.[0] || user?.email?.[0]?.toUpperCase() || "A"}
            </span>
          </div>
          <div className="flex-1">
            <p className="text-white font-semibold text-sm">
              {user?.firstName && user?.lastName
                ? `${user.firstName} ${user.lastName}`
                : user?.email || "Admin User"}
            </p>
            <p className="text-[#AEB9E1] text-xs capitalize">
              {user?.role?.toLowerCase().replace("_", " ") || "Super Admin"}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 hover:border-red-500/30 hover:text-red-300 transition-all duration-200 group"
        >
          <LogOut className="transition-transform duration-200 group-hover:scale-110" />
          <p className="text-base font-semibold">Log Out</p>
        </button>
      </div>
    </div>
  );
};

export default AdminNavbar;
