import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function GET(req: Request) {
  const url = new URL(req.url);

  const subjects = url.searchParams.get("subjects")?.split(",") || [];
  const days = url.searchParams.get("days")?.split(",") || [];
  const time = url.searchParams.get("time") || "";
  const minPrice = url.searchParams.get("minPrice");
  const maxPrice = url.searchParams.get("maxPrice");

  // Prisma-ის ტიპი სწორად
  const where: Prisma.TeacherProfileWhereInput = {};

  if (subjects.length > 0 || minPrice || maxPrice) {
    where.teacherSubjects = {
      some: {
        ...(subjects.length > 0 && { name: { in: subjects } }),
        ...(minPrice || maxPrice
          ? {
              price: {
                gte: minPrice ? Number(minPrice) : 0,
                lte: maxPrice ? Number(maxPrice) : Number.MAX_SAFE_INTEGER,
              },
            }
          : {}),
      },
    };
  }

  if (days.length > 0 || time) {
    where.lessons = {
      some: {
        ...(days.length > 0 && { day: { in: days } }),
        ...(time && { time }),
      },
    };
  }

  const teachers = await prisma.teacherProfile.findMany({
    where,
    include: {
      user: true,
      teacherSubjects: true,
      lessons: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ teachers });
}
