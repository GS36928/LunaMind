import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { teacherId, subject, day, time, price, studentId } =
      await req.json();

    if (!studentId || !teacherId || !subject || !day || !time || !price) {
      return NextResponse.json(
        { error: "ყველა ველი სავალდებულოა" },
        { status: 400 }
      );
    }

    // შეამოწმე სტუდენტი არსებობს თუ არა
    const studentExists = await prisma.user.findUnique({
      where: { id: studentId },
    });
    if (!studentExists) {
      return NextResponse.json(
        { error: "სტუდენტი არ არსებობს" },
        { status: 400 }
      );
    }

    // **შეამოწმე, რომ ლესონი არსებობს**
    const lesson = await prisma.lesson.findFirst({
      where: {
        teacherId,
        subject,
        day,
        time,
      },
    });

    if (!lesson) {
      return NextResponse.json(
        { error: "ეს ლესონი უკვე დაკავებულია ან არ არსებობს" },
        { status: 400 }
      );
    }

    // 1️⃣ შექმენი ჩანიშნული ლესონი - დაამატე date და link ველები
    const bookedLesson = await prisma.bookedLesson.create({
      data: {
        studentId,
        teacherId,
        subject,
        day,
        date: lesson.date, // ✅ დაემატა date
        time,
        price,
        duration: lesson.duration, // ✅ დაემატა duration
        link: lesson.link, // ✅ დაემატა link
        comment: lesson.comment, // ✅ დაემატა comment (თუ არის)
      },
    });

    // 2️⃣ წაშალე ლესონი თავისუფალიდან
    await prisma.lesson.delete({
      where: { id: lesson.id },
    });

    return NextResponse.json({ bookedLesson });
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Server error" },
      { status: 500 }
    );
  }
}
