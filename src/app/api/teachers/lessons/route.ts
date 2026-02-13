import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    // URL-დან teacherId-ის ამოღება
    const { searchParams } = new URL(request.url);
    const teacherId = searchParams.get("teacherId");

    if (!teacherId) {
      return NextResponse.json(
        { error: "Teacher ID is required" },
        { status: 400 }
      );
    }

    // მხოლოდ ამ მასწავლებლის გაკვეთილების წამოღება
    const lessons = await prisma.lesson.findMany({
      where: {
        teacherId: teacherId,
      },
      orderBy: { date: "asc" },
      include: {
        teacher: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    console.log(`Found ${lessons.length} lessons for teacher ${teacherId}`);

    return NextResponse.json(lessons, { status: 200 });
  } catch (error) {
    console.error("Error fetching lessons:", error);
    return NextResponse.json(
      { error: "Failed to fetch lessons" },
      { status: 500 }
    );
  }
}
