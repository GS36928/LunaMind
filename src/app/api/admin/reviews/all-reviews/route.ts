// /app/api/admin/reviews/all-reviews/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const reviews = await prisma.review.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        teacher: { select: { firstName: true, lastName: true, email: true } },
        student: { select: { firstName: true, lastName: true, email: true } },
      },
    });

    return NextResponse.json({ reviews }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch all reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}
