// app/api/auth/admin-login/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { Role } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { message: "არასწორი ელფოსტა ან პაროლი" },
        { status: 401 }
      );
    }

    // Ensure user is ADMIN or SUPER_ADMIN
    if (user.role !== Role.ADMIN && user.role !== Role.SUPER_ADMIN) {
      return NextResponse.json(
        { message: "არ გაქვთ ადმინის პრივილეგიები" },
        { status: 403 }
      );
    }

    // Check active / banned
    if (!user.isActive || user.banned) {
      return NextResponse.json(
        { message: "თქვენი ანგარიში დაბლოკილია" },
        { status: 403 }
      );
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.passwordHash);

    if (!validPassword) {
      return NextResponse.json(
        { message: "არასწორი ელფოსტა ან პაროლი" },
        { status: 401 }
      );
    }

    // Log admin login
    await prisma.adminLog.create({
      data: {
        action: "ADMIN_LOGIN",
        userId: user.id,
        details: {
          ip: req.headers.get("x-forwarded-for") || "unknown",
          userAgent: req.headers.get("user-agent"),
          timestamp: new Date().toISOString(),
        },
      },
    });

    // Generate JWT
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

    const token = await new SignJWT({
      id: user.id,
      email: user.email,
      role: user.role,
      isAdmin: true,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("8h")
      .sign(secret);

    const response = NextResponse.json({
      message: "წარმატებით შედით ადმინ პანელში",
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });

    // Set cookie
    response.cookies.set({
      name: "admin-token",
      value: token,
      httpOnly: true,
      path: "/",
      maxAge: 8 * 3600,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    return response;
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json({ message: "სერვერის შეცდომა" }, { status: 500 });
  }
}
