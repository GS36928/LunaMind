"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminNavbar from "../../../../../components/admin/AdminNavbar";
import DashboardCount from "../../../../../components/admin/DashboardCount";

interface User {
  id: string;
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
}

const DashboardPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState({
    teacherCount: 0,
    studentCount: 0,
    totalUsers: 0,
    superAdminCount: 0,
    adminCount: 0,
  });

  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/check-admin", {
          method: "GET",
          credentials: "include",
        });
        if (!res.ok) {
          router.push("/admin");
          return;
        }
        const data = await res.json();
        setUser(data.user);
        setIsLoading(false);
      } catch (err) {
        console.error(err);
        router.push("/admin");
      }
    };
    checkAuth();
  }, [router]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/admin/stats");
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error(err);
      }
    };
    if (!isLoading) fetchStats();
  }, [isLoading]);

  if (isLoading)
    return (
      <div className="h-screen bg-[#081028] flex justify-center items-center text-white">
        Loading...
      </div>
    );

  return (
    <div className="h-screen bg-[#081028] grid grid-cols-5 px-4 py-4 gap-4">
      {/* Sidebar */}
      <AdminNavbar user={user} />

      {/* Main Content */}
      <div className="bg-gradient-to-br from-[#0A1330] to-[#151F45] col-span-4 rounded-2xl shadow-2xl border border-[#1A2450] p-8">
        <h2 className="text-3xl font-bold text-white mb-8">
          Dashboard Overview
        </h2>
        <div className="grid grid-cols-4 gap-4">
          <DashboardCount
            title="მასწავლებელი"
            number={stats.teacherCount.toString()}
          />
          <DashboardCount
            title="მოსწავლე"
            number={stats.studentCount.toString()}
          />
          <DashboardCount
            title="იუზერების რაოდენობა"
            number={stats.totalUsers.toString()}
          />
          <DashboardCount
            title="სუპერ ადმინი"
            number={stats.superAdminCount.toString()}
          />
          <DashboardCount title="ადმინი" number={stats.adminCount.toString()} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
