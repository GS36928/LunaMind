"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminNavbar from "../../../../../components/admin/AdminNavbar";
import Link from "next/link";

interface User {
  id: string;
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
}

const AdminUsers: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check authentication
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

  if (isLoading) {
    return (
      <div className="h-screen bg-[#081028] flex justify-center items-center text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#081028] grid grid-cols-5 px-4 py-4 gap-4">
      {/* Sidebar */}
      <AdminNavbar user={user} />

      {/* Main Content */}
      <div className="bg-linear-to-br from-[#0A1330] to-[#151F45] col-span-4 rounded-2xl shadow-2xl border border-[#1A2450] p-8">
        <h2 className="text-3xl font-bold text-white mb-8">Users Management</h2>
        <div className="grid grid-cols-2 h-[80%] gap-4">
          <Link
            href={"/admin/users/teachers"}
            className="bg-[#1c2650] p-4 rounded-2xl flex justify-center items-center text-white font-bold cursor-pointer hover:bg-[#7E89AC]"
          >
            მასწავლებელი
          </Link>
          <Link
            href={"/admin/users/students"}
            className="bg-[#1A2450] p-4 rounded-2xl flex justify-center items-center text-white font-bold cursor-pointer hover:bg-[#7E89AC]"
          >
            მოსწავლე
          </Link>
          <div className="bg-[#1A2450] p-4 rounded-2xl flex justify-center items-center text-white font-bold cursor-pointer hover:bg-[#7E89AC]">
            ადმინი
          </div>
          <div className="bg-[#1A2450] p-4 rounded-2xl flex justify-center items-center text-white font-bold cursor-pointer hover:bg-[#7E89AC]">
            სუპერ ადმინი
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
