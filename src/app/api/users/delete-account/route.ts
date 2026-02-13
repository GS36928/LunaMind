// src/app/api/users/delete-account/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jwtVerify } from "jose";
import bcrypt from "bcryptjs";

/**
 * DELETE /api/users/delete-account
 * Allow users to delete their own account
 * GDPR Right to Erasure compliance
 * 
 * Requires password confirmation for security
 */
export async function DELETE(req: Request) {
  try {
    // 1. Verify authentication
    const token = req.headers.get("cookie")?.split("token=")[1]?.split(";")[0];
    
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized - please login" },
        { status: 401 }
      );
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const { payload } = await jwtVerify(token, secret);
    const userId = payload.id as string;

    // 2. Get password confirmation
    const { password, confirmText } = await req.json();
    
    if (!password) {
      return NextResponse.json(
        { error: "Password is required to confirm deletion" },
        { status: 400 }
      );
    }

    // 3. Require user to type "DELETE MY ACCOUNT"
    if (confirmText !== "DELETE MY ACCOUNT") {
      return NextResponse.json(
        { error: "Please type 'DELETE MY ACCOUNT' to confirm" },
        { status: 400 }
      );
    }

    // 4. Verify password
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        StudentProfile: true,
        TeacherProfile: true,
        bookedLessonsAsTeacher: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Incorrect password" },
        { status: 401 }
      );
    }

    // 5. Check for upcoming booked lessons as teacher
    if (user.role === "TEACHER" && user.bookedLessonsAsTeacher.length > 0) {
      const upcomingLessons = user.bookedLessonsAsTeacher.filter((lesson) => {
        return new Date(lesson.date) > new Date();
      });

      if (upcomingLessons.length > 0) {
        return NextResponse.json(
          {
            error: "Cannot delete account with upcoming lessons",
            details: `You have ${upcomingLessons.length} upcoming lessons. Please complete or cancel them first.`,
            upcomingLessons: upcomingLessons.map((l) => ({
              subject: l.subject,
              date: l.date,
              time: l.time,
            })),
          },
          { status: 400 }
        );
      }
    }

    // 6. Delete the account
    // Cascade will delete related data automatically
    await prisma.user.delete({
      where: { id: userId },
    });

    // TODO: Delete Cloudinary files
    // if (user.image) { await cloudinary.uploader.destroy(...) }

    // TODO: Send account deletion confirmation email
    // await sendAccountDeletionEmail(user.email);

    // 7. Clear the cookie
    const response = NextResponse.json({
      success: true,
      message: "Your account has been permanently deleted",
    });

    response.cookies.delete("token");

    return response;
  } catch (error) {
    console.error("Delete account error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
