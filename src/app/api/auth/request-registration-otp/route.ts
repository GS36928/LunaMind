// app/api/auth/request-registration-otp/route.ts
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
    const { email, fullName, phone, role } = await req.json();

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { message: "ეს ელ.ფოსტა უკვე გამოყენებულია" },
        { status: 400 }
      );
    }

    // Generate OTP (6-digit code)
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store registration data in JSON format
    const registrationData = JSON.stringify({ fullName, phone, role });

    // Delete any existing verification token for this email
    await prisma.verificationToken.deleteMany({ where: { identifier: email } });

    // Store OTP + registration data
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token: `${otpCode}|${registrationData}`,
        expires: expiresAt,
      },
    });

    // Send email via SendGrid
    await sgMail.send({
      to: email,
      from: VERIFIED_SENDER as string, // verified sender
      subject: "რეგისტრაციის დასადასტურებელი კოდი - Evectus",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h2 style="color: #0C0F21; margin-bottom: 10px;">Evectus</h2>
            <h3 style="color: #333; margin-bottom: 20px;">მეილის დადასტურება</h3>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <p style="color: #333; margin-bottom: 15px;">გამარჯობა <strong>${fullName}</strong>,</p>
            <p style="color: #333; margin-bottom: 20px;">გმადლობთ რომ რეგისტრირდით Evectus-ზე. თქვენი რეგისტრაციის დასადასტურებლად გამოიყენეთ ქვემოთ მოცემული ერთჯერადი კოდი:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <div style="display: inline-block; background-color: #FFD52A; color: #0C0F21; padding: 15px 30px; border-radius: 8px; font-size: 24px; font-weight: bold; letter-spacing: 5px;">
                ${otpCode}
              </div>
            </div>
            
            <p style="color: #666; font-size: 14px; text-align: center; margin-bottom: 10px;">
              ეს კოდი მოქმედებს <strong>10 წუთის</strong> განმავლობაში
            </p>
          </div>
          
          <div style="border-top: 1px solid #e0e0e0; padding-top: 20px; text-align: center;">
            <p style="color: #666; font-size: 12px; margin-bottom: 5px;">
              თუ თქვენ არ გაიარეთ რეგისტრაცია Evectus-ზე, გთხოვთ უგულებელყოთ ეს მეილი.
            </p>
            <p style="color: #999; font-size: 12px;">
              © 2024 Evectus. ყველა უფლება დაცულია.
            </p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({
      message: "ერთჯერადი კოდი გამოგზავნილია თქვენს ელ.ფოსტაზე",
    });
  } catch (error) {
    console.error("Registration OTP error:", error);
    return NextResponse.json(
      { message: "დაფიქსირდა შეცდომა. გთხოვთ სცადოთ თავიდან." },
      { status: 500 }
    );
  }
}
