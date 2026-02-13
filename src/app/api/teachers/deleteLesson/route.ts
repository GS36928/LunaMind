// app/api/teachers/deleteLesson/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(req: NextRequest) {
  try {
    const { lessonId } = await req.json();

    if (!lessonId) {
      return NextResponse.json(
        { error: "გაკვეთილის ID არ მოიძებნა" },
        { status: 400 }
      );
    }

    // ვშლით გაკვეთილს
    await prisma.lesson.delete({
      where: { id: lessonId },
    });

    return NextResponse.json(
      { message: "გაკვეთილი წარმატებით წაიშალა" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "გაკვეთილის წაშლა ვერ მოხერხდა" },
      { status: 500 }
    );
  }
}
