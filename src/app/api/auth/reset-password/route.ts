import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
  try {
    const { email, otp, newPassword } = await req.json();

    if (!email || !otp || !newPassword)
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.otpCode || !user.otpExpiresAt)
      return NextResponse.json(
        { message: "OTP not requested" },
        { status: 400 }
      );

    if (user.otpCode !== otp)
      return NextResponse.json({ message: "Invalid OTP" }, { status: 400 });

    if (user.otpExpiresAt < new Date())
      return NextResponse.json({ message: "OTP expired" }, { status: 400 });

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { email },
      data: {
        passwordHash: hashedPassword,
        otpCode: null,
        otpExpiresAt: null,
      },
    });

    return NextResponse.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("RESET-PASSWORD ERROR:", err);
    return NextResponse.json(
      { message: (err as Error).message || "Server error" },
      { status: 500 }
    );
  }
}
