import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // დარწმუნდი რომ prisma client სწორად გაქვს
import { getCurrentUser } from "@/lib/session";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "TEACHER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const teacherProfile = await prisma.teacherProfile.findUnique({
      where: { userId: user.id },
      include: { teacherSubjects: true },
    });

    if (!teacherProfile) {
      return NextResponse.json(
        { error: "Teacher profile not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(teacherProfile.teacherSubjects);
  } catch (error) {
    console.error("Error fetching teacher subjects:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
