// app/api/debug/db-check/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // შევამოწმოთ რომ ბაზასთან კავშირი მუშაობს
    const lessonCount = await prisma.lesson.count();
    const bookedLessonCount = await prisma.bookedLesson.count();

    return NextResponse.json({
      dbConnected: true,
      lessonCount,
      bookedLessonCount,
    });
  } catch (error) {
    console.error("❌ DB connection error:", error);
    return NextResponse.json(
      {
        dbConnected: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
