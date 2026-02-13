import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const teacherCount = await prisma.user.count({
      where: { role: "TEACHER" },
    });

    const studentCount = await prisma.user.count({
      where: { role: "STUDENT" },
    });

    const adminCount = await prisma.user.count({
      where: { role: "ADMIN" },
    });

    const superAdminCount = await prisma.user.count({
      where: { role: "SUPER_ADMIN" },
    });

    const totalUsers = await prisma.user.count();

    return NextResponse.json({
      teacherCount,
      studentCount,
      adminCount,
      superAdminCount,
      totalUsers,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
