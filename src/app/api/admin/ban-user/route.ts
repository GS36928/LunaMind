// src/app/api/admin/ban-user/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jwtVerify } from "jose";

/**
 * POST /api/admin/ban-user
 * Admin endpoint to ban a user from the platform
 * Banned users cannot login
 */
export async function POST(req: Request) {
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

    // 2. Get ban details
    const { userId, banReason } = await req.json();
    
    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    if (!banReason || banReason.trim().length < 10) {
      return NextResponse.json(
        { error: "banReason is required (minimum 10 characters)" },
        { status: 400 }
      );
    }

    // 3. Prevent self-ban
    if (payload.id === userId) {
      return NextResponse.json(
        { error: "Cannot ban yourself" },
        { status: 400 }
      );
    }

    // 4. Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // 5. Prevent banning other admins (SUPER_ADMIN can ban ADMINs)
    if (user.role === "ADMIN" || user.role === "SUPER_ADMIN") {
      if (adminRole !== "SUPER_ADMIN") {
        return NextResponse.json(
          { error: "Only SUPER_ADMIN can ban other admins" },
          { status: 403 }
        );
      }
    }

    // 6. Check if already banned
    if (user.banned) {
      return NextResponse.json(
        { error: "User is already banned" },
        { status: 400 }
      );
    }

    // 7. Ban the user
    await prisma.user.update({
      where: { id: userId },
      data: {
        banned: true,
        banReason: banReason.trim(),
        isActive: false,
      },
    });

    // 8. Log the ban action
    await prisma.adminLog.create({
      data: {
        userId: payload.id as string,
        action: "BAN_USER",
        targetId: userId,
        details: {
          bannedUserId: userId,
          bannedUserEmail: user.email,
          bannedUserRole: user.role,
          banReason: banReason.trim(),
        },
      },
    });

    // TODO: Invalidate user's session
    // Force logout by deleting all sessions
    await prisma.session.deleteMany({
      where: { userId },
    });

    // TODO: Send ban notification email
    // await sendBanNotificationEmail(user.email, banReason);

    return NextResponse.json({
      success: true,
      message: "User banned successfully",
      bannedUser: {
        id: userId,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        banReason: banReason.trim(),
      },
    });
  } catch (error) {
    console.error("Ban user error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
