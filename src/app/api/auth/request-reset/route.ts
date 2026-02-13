import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import sgMail from "@sendgrid/mail";

export const runtime = "nodejs";

// Load env variables
const SENDGRID_API_KEY = process.env.SENDGRID_PASS;
const VERIFIED_SENDER = process.env.SENDGRID_USER; // Must be verified in SendGrid

if (!SENDGRID_API_KEY) {
  throw new Error("SENDGRID_PASS is not defined in .env");
}
if (!VERIFIED_SENDER) {
  throw new Error("SENDGRID_USER is not defined in .env");
}

// Set SendGrid API key
sgMail.setApiKey(SENDGRID_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min

    // Save OTP in DB
    await prisma.user.update({
      where: { email },
      data: {
        otpCode: otp,
        otpExpiresAt: expiresAt,
      },
    });

    // Send email via SendGrid
    await sgMail.send({
      to: email,
      from: VERIFIED_SENDER as string, // <<< ეს TypeScript-ისთვის გვაჩვენებს, რომ სტრინგია
      subject: "Password Reset OTP",
      text: `Your OTP code is ${otp}. It expires in 5 minutes.`,
    });

    return NextResponse.json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error("REQUEST-RESET ERROR:", err);
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Server error" },
      { status: 500 }
    );
  }
}
