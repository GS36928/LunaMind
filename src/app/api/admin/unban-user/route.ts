// src/app/api/admin/unban-user/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jwtVerify } from "jose";

/**
 * POST /api/admin/unban-user
 * Admin endpoint to unban a user
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

    // 2. Get user ID to unban
    const { userId } = await req.json();
    
    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    // 3. Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // 4. Check if user is actually banned
    if (!user.banned) {
      return NextResponse.json(
        { error: "User is not banned" },
        { status: 400 }
      );
    }

    // 5. Unban the user
    await prisma.user.update({
      where: { id: userId },
      data: {
        banned: false,
        banReason: null,
        isActive: true,
      },
    });

    // 6. Log the unban action
    await prisma.adminLog.create({
      data: {
        userId: payload.id as string,
        action: "UNBAN_USER",
        targetId: userId,
        details: {
          unbannedUserId: userId,
          unbannedUserEmail: user.email,
          unbannedUserRole: user.role,
          previousBanReason: user.banReason,
        },
      },
    });

    // TODO: Send unban notification email
    // await sendUnbanNotificationEmail(user.email);

    return NextResponse.json({
      success: true,
      message: "User unbanned successfully",
      unbannedUser: {
        id: userId,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
      },
    });
  } catch (error) {
    console.error("Unban user error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
