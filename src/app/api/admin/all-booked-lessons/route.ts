// /app/api/admin/all-booked-lessons/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const lessons = await prisma.bookedLesson.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        student: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        teacher: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({ lessons }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch booked lessons:", error);
    return NextResponse.json(
      { error: "Failed to fetch booked lessons" },
      { status: 500 }
    );
  }
}
