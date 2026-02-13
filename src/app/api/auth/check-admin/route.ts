// app/api/auth/check-admin/route.ts
import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/admin-session";

export async function GET() {
  try {
    const user = await getCurrentAdmin();

    if (!user) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.json(
      { message: "Authentication failed" },
      { status: 500 }
    );
  }
}
