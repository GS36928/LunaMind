import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email)
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );

    const user = await prisma.user.findUnique({ where: { email } });
    return NextResponse.json({ exists: !!user });
  } catch (err) {
    console.error("CHECK-EMAIL ERROR:", err);
    return NextResponse.json(
      { exists: false, message: "Server error" },
      { status: 500 }
    );
  }
}
