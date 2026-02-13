// /app/api/students/all-students/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const students = await prisma.user.findMany({
      where: { role: "STUDENT" },
      include: {
        StudentProfile: true,
        bookedLessonsAsStudent: true,
        studentReviews: true,
      },
    });

    return NextResponse.json({ students });
  } catch (error) {
    console.error("Failed to fetch students:", error);
    return NextResponse.json(
      { error: "Failed to fetch students" },
      { status: 500 }
    );
  }
}
