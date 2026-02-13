// app/api/teachers/updateLesson/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(req: NextRequest) {
  try {
    const {
      lessonId,
      teacherId,
      subject,
      days,
      time,
      duration,
      comment,
      link,
    } = await req.json();

    if (!lessonId || !teacherId || !subject || !days || !time || !duration) {
      return NextResponse.json(
        { error: "მონაცემები არასრულია" },
        { status: 400 }
      );
    }

    // ვიღებთ teacherProfileId-ს
    const teacherProfile = await prisma.teacherProfile.findUnique({
      where: { userId: teacherId },
    });

    if (!teacherProfile) {
      return NextResponse.json(
        { error: "TeacherProfile არ მოიძებნა" },
        { status: 404 }
      );
    }

    const today = new Date();
    const dayMap: Record<string, number> = {
      ორშაბათი: 1,
      სამშაბათი: 2,
      ოთხშაბათი: 3,
      ხუთშაბათი: 4,
      პარასკევი: 5,
      შაბათი: 6,
      კვირა: 0,
    };

    // ვშლით ძველ გაკვეთილებს და ვქმნით ახალს
    await prisma.lesson.deleteMany({
      where: { id: lessonId },
    });

    const lessons = days.map((day: string) => {
      const lessonDate = new Date(today);
      const targetDay = dayMap[day];
      const diff = (targetDay + 7 - lessonDate.getDay()) % 7;
      lessonDate.setDate(lessonDate.getDate() + diff);

      return prisma.lesson.create({
        data: {
          teacherId,
          teacherProfileId: teacherProfile.id,
          subject,
          day,
          date: lessonDate,
          time,
          duration: parseFloat(duration),
          comment,
          link,
        },
      });
    });

    const updatedLessons = await Promise.all(lessons);
    return NextResponse.json(updatedLessons[0], { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "შეცდომა მოხდა" }, { status: 500 });
  }
}
