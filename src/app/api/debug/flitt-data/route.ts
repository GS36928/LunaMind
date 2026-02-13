// app/api/debug/flitt-data/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // ნახე რა lessons არსებობს
    const lessons = await prisma.lesson.findMany({
      take: 10,
      select: {
        id: true,
        teacherId: true,
        teacherProfileId: true,
        subject: true,
        day: true,
        time: true,
        teacher: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            TeacherProfile: {
              select: { id: true },
            },
          },
        },
      },
    });

    return NextResponse.json({
      receivedData: body,
      lessons,
    });
  } catch {
    return NextResponse.json({ error: "Debug failed" }, { status: 500 });
  }
}
