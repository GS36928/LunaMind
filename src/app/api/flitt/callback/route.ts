import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const orderStatus = body.order_status;
    const responseStatus = body.response_status;

    // Extract reservation data from order_id
    let reservationData = null;
    const orderId = body.order_id;

    try {
      // Extract lessonId and studentId from order_id format: order_TIMESTAMP_LESSONID_STUDENTID
      // Format: order_TIMESTAMP_LESSONID_STUDENTID (last 8 chars of each)
      const orderIdParts = orderId.split('_');
      if (orderIdParts.length >= 4) {
        const encodedLessonId = orderIdParts[orderIdParts.length - 2];
        const encodedStudentId = orderIdParts[orderIdParts.length - 1];
        
        // Find lesson by matching the last 8 characters of its ID
        const lesson = await prisma.lesson.findFirst({
          where: {
            id: {
              endsWith: encodedLessonId
            }
          },
          include: {
            TeacherProfile: {
              include: {
                teacherSubjects: true,
              },
            },
          },
        });

        // Find student by matching the last 8 characters of their ID
        const student = await prisma.user.findFirst({
          where: {
            id: {
              endsWith: encodedStudentId
            },
            role: 'STUDENT'
          }
        });

        if (lesson && student) {
          reservationData = {
            lessonId: lesson.id,
            studentId: student.id,
            teacherProfileId: lesson.teacherProfileId,
          };
        }
      } else if (orderIdParts.length >= 3) {
        // Fallback: try old format with just lessonId
        const encodedLessonId = orderIdParts[orderIdParts.length - 1];
        
        const lesson = await prisma.lesson.findFirst({
          where: {
            id: {
              endsWith: encodedLessonId
            }
          },
          include: {
            TeacherProfile: {
              include: {
                teacherSubjects: true,
              },
            },
          },
        });

        if (lesson) {
          reservationData = {
            lessonId: lesson.id,
            teacherProfileId: lesson.teacherProfileId,
          };
        }
      }

      // Try merchant_data or additional_info for studentId (fallback)
      if (!reservationData?.studentId && body.merchant_data && body.merchant_data.trim()) {
        try {
          const merchantData = JSON.parse(body.merchant_data);
          if (merchantData.studentId) {
            if (!reservationData) reservationData = {};
            reservationData.studentId = merchantData.studentId;
          }
        } catch {
          try {
            const decoded = Buffer.from(body.merchant_data, 'base64').toString('utf-8');
            const data = JSON.parse(decoded);
            if (data.studentId) {
              if (!reservationData) reservationData = {};
              reservationData.studentId = data.studentId;
            }
          } catch {}
        }
      }

      // Try additional_info (fallback)
      if (!reservationData?.studentId && body.additional_info) {
        try {
          const additionalInfo = typeof body.additional_info === 'string' 
            ? JSON.parse(body.additional_info)
            : body.additional_info;
          
          if (additionalInfo.reservation_data && typeof additionalInfo.reservation_data === 'string') {
            try {
              const decoded = Buffer.from(additionalInfo.reservation_data, 'base64').toString('utf-8');
              const data = JSON.parse(decoded);
              if (data.studentId) {
                if (!reservationData) reservationData = {};
                reservationData.studentId = data.studentId;
                reservationData.lessonId = data.lessonId || reservationData?.lessonId;
                reservationData.teacherProfileId = data.teacherProfileId || reservationData?.teacherProfileId;
              }
            } catch {}
          }
        } catch {}
      }
    } catch (err) {
      console.error("Error extracting reservation_data:", err);
    }

    // Process payment if approved
    if (orderStatus === "approved" && responseStatus === "success") {
      if (!reservationData) {
        console.error("Callback: No reservationData found for order_id:", orderId);
        return NextResponse.json(
          { message: "Callback received but no reservationData" },
          { status: 200 }
        );
      }

      // Validate required fields
      if (
        !reservationData.lessonId ||
        !reservationData.studentId ||
        !reservationData.teacherProfileId
      ) {
        console.error("Callback: Missing required fields in reservationData:", reservationData);
        return NextResponse.json(
          { message: "Callback received but missing required fields" },
          { status: 200 }
        );
      }

      // Find lesson
      const existingLesson = await prisma.lesson.findUnique({
        where: { id: reservationData.lessonId },
        include: {
          teacher: true,
          TeacherProfile: {
            include: {
              teacherSubjects: true,
            },
          },
        },
      });

      if (!existingLesson) {
        console.error("Callback: Lesson not found with ID:", reservationData.lessonId);
        return NextResponse.json(
          { message: "Callback received but lesson not found" },
          { status: 200 }
        );
      }

      // Find teacher profile
      const teacherProfile = await prisma.teacherProfile.findUnique({
        where: { id: reservationData.teacherProfileId },
        select: { userId: true },
      });

      if (!teacherProfile) {
        console.error("Callback: TeacherProfile not found for ID:", reservationData.teacherProfileId);
        return NextResponse.json(
          { message: "Callback received but teacher profile not found" },
          { status: 200 }
        );
      }

      const teacherUserId = teacherProfile.userId;

      // Calculate price
      let price: number;
      if (reservationData && 'price' in reservationData && reservationData.price) {
        price = reservationData.price as number;
      } else {
        const teacherSubjects = existingLesson.TeacherProfile.teacherSubjects;
        price = teacherSubjects?.[0]?.price ?? 0;
      }

      // Create BookedLesson
      if (!reservationData || !('studentId' in reservationData) || !reservationData.studentId) {
        throw new Error("studentId is required but not found in reservationData");
      }
      
      const studentId = reservationData.studentId as string;
      
      await prisma.bookedLesson.create({
        data: {
          studentId: studentId,
          teacherId: teacherUserId,
          subject: existingLesson.subject,
          day: existingLesson.day,
          date: existingLesson.date,
          time: existingLesson.time,
          price,
          duration: existingLesson.duration,
          comment: existingLesson.comment,
          link: existingLesson.link,
        },
      });

      // Delete original lesson
      await prisma.lesson.delete({ where: { id: existingLesson.id } });

      return NextResponse.json(
        { message: "Callback processed successfully" },
        { status: 200 }
      );
    } else {
      // Payment not approved or failed - still return 200 to Flitt
      return NextResponse.json(
        { message: "Payment not approved" },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Callback error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
