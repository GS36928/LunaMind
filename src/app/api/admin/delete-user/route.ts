// src/app/api/admin/delete-user/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jwtVerify } from "jose";

/**
 * DELETE /api/admin/delete-user
 * Admin endpoint to permanently delete a user and all their data
 * 
 * GDPR compliant - deletes all user data:
 * - User account
 * - Profile (Student/Teacher)
 * - Lessons (created by teacher)
 * - Booked lessons (as student or teacher)
 * - Reviews (given and received)
 * - Uploaded files (TODO: delete from Cloudinary)
 */
export async function DELETE(req: Request) {
  try {
    // 1. Verify admin authentication
    const token = req.headers.get("cookie")?.split("token=")[1]?.split(";")[0];
    
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized - no token" },
        { status: 401 }
      );
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const { payload } = await jwtVerify(token, secret);
    
    const adminRole = payload.role as string;
    if (adminRole !== "ADMIN" && adminRole !== "SUPER_ADMIN") {
      return NextResponse.json(
        { error: "Forbidden - admin access required" },
        { status: 403 }
      );
    }

    // 2. Get user ID to delete
    const { userId } = await req.json();
    
    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    // 3. Prevent self-deletion
    if (payload.id === userId) {
      return NextResponse.json(
        { error: "Cannot delete your own account from admin panel. Use account settings." },
        { status: 400 }
      );
    }

    // 4. Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        StudentProfile: true,
        TeacherProfile: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // 5. Prevent deleting other admins (SUPER_ADMIN can delete ADMINs)
    if (user.role === "ADMIN" || user.role === "SUPER_ADMIN") {
      if (adminRole !== "SUPER_ADMIN") {
        return NextResponse.json(
          { error: "Only SUPER_ADMIN can delete other admins" },
          { status: 403 }
        );
      }
    }

    // 6. Log the deletion action
    await prisma.adminLog.create({
      data: {
        userId: payload.id as string,
        action: "DELETE_USER",
        details: {
          deletedUserId: userId,
          deletedUserEmail: user.email,
          deletedUserRole: user.role,
          deletedUserName: `${user.firstName} ${user.lastName}`,
        },
      },
    });

    // 7. Delete user (cascade will delete related data)
    // Prisma schema has onDelete: Cascade set up
    await prisma.user.delete({
      where: { id: userId },
    });

    // TODO: Delete Cloudinary files
    // if (user.image) {
    //   await cloudinary.uploader.destroy(getPublicId(user.image));
    // }
    // if (user.TeacherProfile?.certificateFiles) {
    //   for (const file of user.TeacherProfile.certificateFiles) {
    //     await cloudinary.uploader.destroy(getPublicId(file));
    //   }
    // }

    return NextResponse.json({
      success: true,
      message: "User deleted successfully",
      deletedUser: {
        id: userId,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Delete user error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
