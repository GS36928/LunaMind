// app/api/auth/admin-logout/route.ts
import { NextResponse } from "next/server";

export async function POST() {
  try {
    // Create response
    const response = NextResponse.json({
      message: "Successfully logged out",
    });

    // Clear the admin-token cookie
    response.cookies.set({
      name: "admin-token",
      value: "",
      httpOnly: true,
      path: "/",
      maxAge: 0, // Immediately expire
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    // Also clear regular token if exists
    response.cookies.set({
      name: "token",
      value: "",
      httpOnly: true,
      path: "/",
      maxAge: 0,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ message: "Logout failed" }, { status: 500 });
  }
}
