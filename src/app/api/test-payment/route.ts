// app/api/test-payment/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { lessonId, studentId, teacherId, teacherProfileId } =
      await req.json();

    console.log("🧪 Test payment with:", {
      lessonId,
      studentId,
      teacherId,
      teacherProfileId,
    });

    // 1. შევამოწმოთ lesson
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
    });

    if (!lesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    // 2. შევქმნათ bookedLesson
    const bookedLesson = await prisma.bookedLesson.create({
      data: {
        studentId,
        teacherId,
        subject: lesson.subject,
        day: lesson.day,
        time: lesson.time,
        price: 22, // test price
        date: new Date(),
        duration: lesson.duration,
      },
    });

    // 3. წავშალოთ lesson
    await prisma.lesson.delete({
      where: { id: lessonId },
    });

    return NextResponse.json({
      success: true,
      message: "Test payment processed",
      bookedLessonId: bookedLesson.id,
    });
  } catch (error) {
    console.error("❌ Test payment error:", error);
    return NextResponse.json({ error: "Test failed" }, { status: 500 });
  }
}
