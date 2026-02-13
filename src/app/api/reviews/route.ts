import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { studentId, teacherId, rating, comment } = await req.json();

    if (!studentId || !teacherId || !rating) {
      return NextResponse.json(
        { error: "ყველა ველი აუცილებელია: studentId, teacherId, rating" },
        { status: 400 }
      );
    }

    // ბოლო რევიუს შემოწმება
    const lastReview = await prisma.review.findFirst({
      where: { studentId, teacherId },
      orderBy: { createdAt: "desc" },
    });

    if (lastReview) {
      const sevenDaysLater = new Date(lastReview.createdAt);
      sevenDaysLater.setDate(sevenDaysLater.getDate() + 7);

      if (new Date() < sevenDaysLater) {
        return NextResponse.json(
          { error: "შეგიძლიათ რევიუს დაწერა მხოლოდ კვირაში ერთხელ" },
          { status: 400 }
        );
      }
    }

    const review = await prisma.review.create({
      data: { studentId, teacherId, rating, comment },
    });

    return NextResponse.json(
      { message: "შეფასება შენახულია", review },
      { status: 201 }
    );
  } catch (error) {
    console.error("Review POST error:", error);
    return NextResponse.json({ error: "სერვერის შეცდომა" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get("studentId");
    const teacherId = searchParams.get("teacherId");

    if (!studentId && !teacherId) {
      return NextResponse.json(
        { error: "studentId ან teacherId აუცილებელია" },
        { status: 400 }
      );
    }

    const where: {
      studentId?: string;
      teacherId?: string;
    } = {};
    if (studentId) where.studentId = studentId;
    if (teacherId) where.teacherId = teacherId;

    const reviews = await prisma.review.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        teacher: { select: { firstName: true, lastName: true } },
        student: { select: { firstName: true, lastName: true } },
      },
    });

    return NextResponse.json({ reviews }, { status: 200 });
  } catch (err) {
    console.error("Review GET error:", err);
    return NextResponse.json({ error: "სერვერის შეცდომა" }, { status: 500 });
  }
}
