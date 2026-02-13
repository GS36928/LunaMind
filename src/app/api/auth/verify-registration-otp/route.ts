// app/api/auth/verify-registration-otp/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json();

    // Get verification token from database
    const verificationToken = await prisma.verificationToken.findFirst({
      where: { identifier: email },
    });

    if (!verificationToken) {
      return NextResponse.json(
        { message: "არასწორი ელ.ფოსტა ან კოდი" },
        { status: 400 }
      );
    }

    // Extract only OTP from token (remove registrationDataJson since it's not used)
    const [storedOtp] = verificationToken.token.split("|");

    if (storedOtp !== otp) {
      return NextResponse.json(
        { message: "არასწორი ერთჯერადი კოდი" },
        { status: 400 }
      );
    }

    if (new Date() > verificationToken.expires) {
      // Clean up expired token
      await prisma.verificationToken.deleteMany({
        where: { identifier: email },
      });
      return NextResponse.json(
        { message: "ერთჯერადი კოდი ვადაგასულია" },
        { status: 400 }
      );
    }

    // Generate a unique verified token
    const verifiedToken =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);

    // Store verified token in database
    await prisma.verificationToken.create({
      data: {
        identifier: `verified_${email}`,
        token: verifiedToken,
        expires: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
      },
    });

    // Delete the OTP token
    await prisma.verificationToken.deleteMany({
      where: { identifier: email },
    });

    return NextResponse.json({
      message: "OTP verified successfully",
      verifiedToken: verifiedToken, // Send back the verified token
    });
  } catch (error) {
    console.error("OTP verification error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
