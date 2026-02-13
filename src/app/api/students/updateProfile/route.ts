import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest) {
  try {
    const { userId, data } = await req.json();

    // Separate user fields vs studentProfile fields
    const { firstName, lastName, email, phoneNumber, StudentProfile } = data;

    // Update User fields if they exist
    if (firstName || lastName || email || phoneNumber) {
      await prisma.user.update({
        where: { id: userId },
        data: { firstName, lastName, email, phoneNumber },
      });
    }

    // Update StudentProfile fields if they exist
    if (StudentProfile) {
      await prisma.studentProfile.update({
        where: { userId },
        data: StudentProfile,
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Update profile error:", err);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
