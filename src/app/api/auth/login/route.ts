// app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose"; // ✅ იცვლება jsonwebtoken-დან jose-ზე

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user)
    return NextResponse.json(
      { message: "არასწორი ელფოსტა ან პაროლი" },
      { status: 401 }
    );

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid)
    return NextResponse.json(
      { message: "არასწორი ელფოსტა ან პაროლი" },
      { status: 401 }
    );

  // ✅ jose-ით ტოკენის გენერირება
  const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
  const token = await new SignJWT({
    id: user.id,
    email: user.email,
    role: user.role, // ✅ დაამატეთ role თუ გაქვთ
  })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(secret);

  const response = NextResponse.json({
    message: "წარმატებით შედით",
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
  });

  // ✅ Set HttpOnly cookie
  response.cookies.set({
    name: "token",
    value: token,
    httpOnly: true,
    path: "/",
    maxAge: 7 * 24 * 60 * 60, // 7 days to match JWT expiration
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return response;
}
