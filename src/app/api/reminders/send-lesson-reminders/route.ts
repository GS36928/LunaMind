import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import sgMail from "@sendgrid/mail";

export const runtime = "nodejs";

// SendGrid API key
const SENDGRID_API_KEY = process.env.SENDGRID_PASS;
const VERIFIED_SENDER = process.env.SENDGRID_USER;

if (!SENDGRID_API_KEY) throw new Error("SENDGRID_PASS is not defined in .env");
if (!VERIFIED_SENDER) throw new Error("SENDGRID_USER is not defined in .env");

sgMail.setApiKey(SENDGRID_API_KEY);

interface Student {
  email: string;
  firstName: string;
  lastName: string;
}

interface Teacher {
  email: string;
  firstName: string;
  lastName: string;
}

interface BookedLesson {
  id: string;
  student: Student;
  teacher: Teacher;
  subject: string;
  date: Date;
  time: string;
  price: number;
  duration?: number;
  comment?: string;
  link?: string;
}

interface Result {
  lessonId: string;
  student: string;
  studentName: string;
  lessonTime: Date;
  status: string;
  error?: string;
}

export async function GET() {
  try {
    const now = new Date();
    const fifteenMinutesFromNow = new Date(now.getTime() + 15 * 60 * 1000);

    const upcomingBookedLessons = (await prisma.bookedLesson.findMany({
      where: {
        date: {
          gte: now,
          lte: fifteenMinutesFromNow,
        },
      },
      include: {
        student: { select: { email: true, firstName: true, lastName: true } },
        teacher: { select: { email: true, firstName: true, lastName: true } },
      },
    })) as BookedLesson[];

    const results: Result[] = [];

    for (const lesson of upcomingBookedLessons) {
      try {
        const lessonDateTime = new Date(lesson.date);
        const [hours, minutes] = lesson.time.split(":").map(Number);
        lessonDateTime.setHours(hours, minutes, 0, 0);

        await sendReminderEmail(lesson, lessonDateTime);

        results.push({
          lessonId: lesson.id,
          student: lesson.student.email,
          studentName: `${lesson.student.firstName} ${lesson.student.lastName}`,
          lessonTime: lessonDateTime,
          status: "reminder_sent",
        });
      } catch (error) {
        const lessonDateTime = new Date(lesson.date);
        const [hours, minutes] = lesson.time.split(":").map(Number);
        lessonDateTime.setHours(hours, minutes, 0, 0);

        results.push({
          lessonId: lesson.id,
          student: lesson.student.email,
          studentName: `${lesson.student.firstName} ${lesson.student.lastName}`,
          lessonTime: lessonDateTime,
          status: "error",
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    return NextResponse.json({
      message: "Reminders processed successfully",
      timestamp: now.toISOString(),
      checkRange: {
        from: now.toISOString(),
        to: fifteenMinutesFromNow.toISOString(),
      },
      remindersSent: results.filter((r) => r.status === "reminder_sent").length,
      errors: results.filter((r) => r.status === "error").length,
      details: results,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to process reminders",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

async function sendReminderEmail(lesson: BookedLesson, lessonDateTime: Date) {
  const formattedTime = lessonDateTime.toLocaleString("ka-GE", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const mailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #4F46E5;">გაკვეთილის შეხსენება</h2>
      <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>👤 სტუდენტი:</strong> ${lesson.student.firstName} ${
    lesson.student.lastName
  }</p>
        <p><strong>👨‍🏫 მასწავლებელი:</strong> ${lesson.teacher.firstName} ${
    lesson.teacher.lastName
  }</p>
        <p><strong>📚 საგანი:</strong> ${lesson.subject}</p>
        <p><strong>⏰ დრო:</strong> ${formattedTime}</p>
        <p><strong>💰 ფასი:</strong> ${lesson.price} ₾</p>
        ${
          lesson.duration
            ? `<p><strong>⏳ ხანგრძლივობა:</strong> ${lesson.duration} საათი</p>`
            : ""
        }
        ${
          lesson.comment
            ? `<p><strong>💬 კომენტარი:</strong> ${lesson.comment}</p>`
            : ""
        }
        ${
          lesson.link
            ? `<p><strong>🔗 ლინკი:</strong> <a href="${lesson.link}">${lesson.link}</a></p>`
            : ""
        }
      </div>
      <p style="color: #64748b;">გაკვეთილი იწყება <strong>15 წუთში</strong>. გთხოვთ, მოემზადოთ!</p>
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
        <p style="color: #94a3b8; font-size: 14px;">ეს არის ავტომატური შეტყობინება, გთხოვთ არ უპასუხოთ.</p>
      </div>
    </div>
  `;

  await Promise.all([
    sgMail.send({
      to: lesson.student.email,
      from: VERIFIED_SENDER as string,
      subject: `🔔 გაკვეთილის შეხსენება - ${lesson.subject}`,
      html: mailHtml,
    }),
    sgMail.send({
      to: lesson.teacher.email,
      from: VERIFIED_SENDER as string,
      subject: `🔔 გაკვეთილის შეხსენება - ${lesson.subject}`,
      html: mailHtml,
    }),
  ]);
}
