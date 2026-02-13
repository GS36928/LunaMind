// app/api/teachers/[id]/profile/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // ✅ params არის Promise
) {
  try {
    const { id } = await params; // ✅ await params
    const teacherProfile = await prisma.teacherProfile.findUnique({
      where: { userId: id },
      select: { id: true },
    });

    if (!teacherProfile) {
      return NextResponse.json(
        { error: "Teacher profile not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ teacherProfileId: teacherProfile.id });
  } catch (error) {
    console.error("Error getting teacher profile:", error);
    return NextResponse.json(
      { error: "Failed to get teacher profile" },
      { status: 500 }
    );
  }
}
