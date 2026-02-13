import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json();
    if (!email || !otp)
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.otpCode || !user.otpExpiresAt) {
      return NextResponse.json(
        { message: "OTP not requested" },
        { status: 400 }
      );
    }

    if (user.otpCode !== otp)
      return NextResponse.json({ message: "Invalid OTP" }, { status: 400 });
    if (user.otpExpiresAt < new Date())
      return NextResponse.json({ message: "OTP expired" }, { status: 400 });

    return NextResponse.json({ message: "OTP verified successfully" });
  } catch (err) {
    console.error("VERIFY-OTP ERROR:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
