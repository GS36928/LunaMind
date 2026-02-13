import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// app/api/check-profile/route.ts
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const role = searchParams.get("role");

  if (!userId || !role) {
    return NextResponse.json({ error: "Missing params" }, { status: 400 });
  }

  let profile = null;

  if (role === "STUDENT") {
    profile = await prisma.studentProfile.findUnique({
      where: { userId },
    });
  } else if (role === "TEACHER") {
    profile = await prisma.teacherProfile.findUnique({
      where: { userId },
    });
  }

  if (!profile) {
    return NextResponse.json({ exists: false, completed: false });
  }

  // ✅ სწორი ლოგიკა: თუ completed: true არის DB-ში, მაშინ პროფილი დასრულებულია
  const completed = profile.completed === true;

  return NextResponse.json({
    exists: true,
    completed: completed,
    currentStep: profile.currentStep,
  });
}
