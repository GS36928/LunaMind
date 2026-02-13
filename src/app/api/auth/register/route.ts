// src/app/api/register/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import type { Role } from "@prisma/client";
import { emailRegex, isValidPassword, isValidPhone } from "@/utils/validation";

interface RegisterRequest {
  fullName: string;
  role: Role;
  email: string;
  phoneNumber: string;
  password: string;
  acceptedTerms: boolean;
  acceptedPrivacy: boolean;
  verifiedToken?: string;
}

// Prisma P2002 Guard – NO ANY
function isPrismaUniqueError(
  err: unknown
): err is { code: "P2002"; meta?: { target?: string[] } } {
  return (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    (err as { code: unknown }).code === "P2002"
  );
}

export async function POST(req: Request) {
  try {
    const body: RegisterRequest = await req.json();

    const fullName = body.fullName.trim();
    const email = body.email.trim().toLowerCase();
    const phoneNumber = body.phoneNumber.trim();
    const password = body.password;
    const role = body.role;
    const acceptedTerms = body.acceptedTerms;
    const acceptedPrivacy = body.acceptedPrivacy;
    const verifiedToken = body.verifiedToken;

    if (!fullName || !role || !email || !phoneNumber || !password) {
      return NextResponse.json(
        { message: "ყველა ველი სავალდებულოა" },
        { status: 400 }
      );
    }

    if (!verifiedToken) {
      return NextResponse.json(
        { message: "გთხოვთ ჯერ დაადასტუროთ თქვენი მეილი" },
        { status: 400 }
      );
    }

    const verification = await prisma.verificationToken.findFirst({
      where: { identifier: `verified_${email}`, token: verifiedToken },
    });

    if (!verification) {
      return NextResponse.json(
        { message: "არასწორი ვერიფიკაციის კოდი" },
        { status: 400 }
      );
    }

    if (new Date() > verification.expires) {
      await prisma.verificationToken.deleteMany({
        where: { identifier: `verified_${email}` },
      });
      return NextResponse.json(
        { message: "ვერიფიკაციის ვადა გაუვიდა" },
        { status: 400 }
      );
    }

    const [firstName, ...lastNameParts] = fullName.split(" ");
    const lastName = lastNameParts.join(" ") || "";

    if (firstName.length < 2 || lastName.length < 2) {
      return NextResponse.json(
        { message: "სახელი და გვარი უნდა იყოს მინიმუმ 2 ასო" },
        { status: 400 }
      );
    }

    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: "ელფოსტა არასწორია" },
        { status: 400 }
      );
    }

    if (!isValidPassword(password)) {
      return NextResponse.json(
        {
          message:
            "პაროლი უნდა შეიცავდეს მინიმუმ 8 სიმბოლოს, ერთ დიდ ასოს და ერთ ციფრს",
        },
        { status: 400 }
      );
    }

    if (!isValidPhone(phoneNumber)) {
      return NextResponse.json(
        { message: "ტელეფონი არასწორია" },
        { status: 400 }
      );
    }

    if (!acceptedTerms || !acceptedPrivacy) {
      return NextResponse.json(
        { message: "უნდა დაეთანხმო წესებს და პოლიტიკას" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // CREATE USER WITH UNIQUE CHECK
    let user;
    try {
      user = await prisma.user.create({
        data: {
          role,
          firstName,
          lastName,
          email,
          phoneNumber,
          passwordHash: hashedPassword,
          acceptedTerms,
          acceptedPrivacy,
          emailVerified: new Date(),
        },
      });
    } catch (err: unknown) {
      let message = "უცნობი სერვერის შეცდომა";

      if (isPrismaUniqueError(err)) {
        const target = err.meta?.target ?? [];

        if (target.includes("email")) message = "ელფოსტა უკვე დაკავებულია";
        if (target.includes("phoneNumber")) message = "ნომერი უკვე დაკავებულია";

        return NextResponse.json({ message }, { status: 400 });
      }

      if (err instanceof Error) message = err.message;
      return NextResponse.json({ message }, { status: 500 });
    }

    if (role === "STUDENT") {
      await prisma.studentProfile.create({ data: { userId: user.id } });
    } else if (role === "TEACHER") {
      await prisma.teacherProfile.create({ data: { userId: user.id } });
    }

    await prisma.verificationToken.deleteMany({
      where: { identifier: `verified_${email}` },
    });

    const safeUser = {
      id: user.id,
      firstName,
      lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
    };

    return NextResponse.json(
      { message: "რეგისტრაცია წარმატებულია", user: safeUser },
      { status: 201 }
    );
  } catch (err: unknown) {
    console.error(err);
    const message =
      err instanceof Error ? err.message : "უცნობი სერვერის შეცდომა";
    return NextResponse.json({ message }, { status: 500 });
  }
}
