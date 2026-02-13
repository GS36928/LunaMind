// src/lib/emailService.ts
import sgMail from "@sendgrid/mail";

const SENDGRID_API_KEY = process.env.SENDGRID_PASS;
const VERIFIED_SENDER = process.env.SENDGRID_USER || "no-reply@evcts.ge";

if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY);
} else {
  console.warn("⚠️ SENDGRID_PASS not configured - emails will not be sent");
}

export interface LessonEmailData {
  studentEmail: string;
  studentName: string;
  teacherEmail: string;
  teacherName: string;
  subject: string;
  day: string;
  date: Date;
  time: string;
  price: number;
  duration?: number;
  link?: string;
  comment?: string;
}

/**
 * Send booking confirmation emails to both student and teacher
 * Called immediately after successful payment
 */
export async function sendBookingConfirmationEmails(
  lesson: LessonEmailData
): Promise<void> {
  if (!SENDGRID_API_KEY || !VERIFIED_SENDER) {
    console.error("❌ SendGrid not configured - skipping confirmation email");
    return;
  }

  const formattedDate = new Date(lesson.date).toLocaleString("ka-GE", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Email to Student
  const studentEmailContent = {
    to: lesson.studentEmail,
    from: VERIFIED_SENDER,
    subject: `✅ გაკვეთილის დადასტურება - ${lesson.subject}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 12px 12px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🎉 გაკვეთილი დაჯავშნილია!</h1>
        </div>
        
        <div style="background: white; padding: 30px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px;">
          <p style="font-size: 16px; color: #1a202c; margin-bottom: 20px;">
            გილოცავთ! თქვენი გაკვეთილი წარმატებით დაიჯავშნა.
          </p>
          
          <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
            <p style="margin: 8px 0;"><strong style="color: #065f46;">👨‍🏫 მასწავლებელი:</strong> ${lesson.teacherName}</p>
            <p style="margin: 8px 0;"><strong style="color: #065f46;">📚 საგანი:</strong> ${lesson.subject}</p>
            <p style="margin: 8px 0;"><strong style="color: #065f46;">📅 თარიღი:</strong> ${formattedDate}</p>
            <p style="margin: 8px 0;"><strong style="color: #065f46;">⏰ დრო:</strong> ${lesson.time}</p>
            <p style="margin: 8px 0;"><strong style="color: #065f46;">💰 ფასი:</strong> ${lesson.price} ₾</p>
            ${
              lesson.duration
                ? `<p style="margin: 8px 0;"><strong style="color: #065f46;">⏳ ხანგრძლივობა:</strong> ${lesson.duration} საათი</p>`
                : ""
            }
            ${
              lesson.comment
                ? `<p style="margin: 8px 0;"><strong style="color: #065f46;">💬 კომენტარი:</strong> ${lesson.comment}</p>`
                : ""
            }
          </div>
          
          ${
            lesson.link
              ? `
          <div style="background: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6;">
            <p style="margin: 0 0 10px 0;"><strong style="color: #1e40af;">🔗 შეხვედრის ლინკი:</strong></p>
            <a href="${lesson.link}" 
               style="display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; 
                      text-decoration: none; border-radius: 6px; font-weight: bold;">
              შეხვედრაზე შესვლა
            </a>
            <p style="margin: 10px 0 0 0; font-size: 14px; color: #64748b;">
              ლინკი: <a href="${lesson.link}" style="color: #3b82f6;">${lesson.link}</a>
            </p>
          </div>
          `
              : ""
          }
          
          <div style="background: #fef3c7; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <p style="margin: 0; color: #92400e; font-size: 14px;">
              ⏰ გაკვეთილამდე 15 წუთით ადრე მიიღებთ შეხსენების ელფოსტას.
            </p>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
            <p style="color: #64748b; font-size: 14px; margin: 5px 0;">
              კითხვები? დაგვიკავშირდით: <a href="mailto:support@evcts.ge" style="color: #3b82f6;">support@evcts.ge</a>
            </p>
            <p style="color: #94a3b8; font-size: 12px; margin: 15px 0 0 0;">
              ეს არის ავტომატური შეტყობინება, გთხოვთ არ უპასუხოთ.
            </p>
          </div>
        </div>
      </div>
    `,
  };

  // Email to Teacher
  const teacherEmailContent = {
    to: lesson.teacherEmail,
    from: VERIFIED_SENDER,
    subject: `🔔 ახალი სტუდენტი - ${lesson.subject}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 30px; border-radius: 12px 12px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🎓 ახალი სტუდენტი!</h1>
        </div>
        
        <div style="background: white; padding: 30px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px;">
          <p style="font-size: 16px; color: #1a202c; margin-bottom: 20px;">
            გილოცავთ! თქვენ გაქვთ ახალი სტუდენტი.
          </p>
          
          <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
            <p style="margin: 8px 0;"><strong style="color: #78350f;">👤 სტუდენტი:</strong> ${lesson.studentName}</p>
            <p style="margin: 8px 0;"><strong style="color: #78350f;">📚 საგანი:</strong> ${lesson.subject}</p>
            <p style="margin: 8px 0;"><strong style="color: #78350f;">📅 თარიღი:</strong> ${formattedDate}</p>
            <p style="margin: 8px 0;"><strong style="color: #78350f;">⏰ დრო:</strong> ${lesson.time}</p>
            <p style="margin: 8px 0;"><strong style="color: #78350f;">💰 შემოსავალი:</strong> ${lesson.price} ₾</p>
            ${
              lesson.duration
                ? `<p style="margin: 8px 0;"><strong style="color: #78350f;">⏳ ხანგრძლივობა:</strong> ${lesson.duration} საათი</p>`
                : ""
            }
          </div>
          
          ${
            lesson.link
              ? `
          <div style="background: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6;">
            <p style="margin: 0 0 10px 0;"><strong style="color: #1e40af;">🔗 შეხვედრის ლინკი:</strong></p>
            <a href="${lesson.link}" 
               style="display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; 
                      text-decoration: none; border-radius: 6px; font-weight: bold;">
              შეხვედრაზე შესვლა
            </a>
          </div>
          `
              : ""
          }
          
          <div style="background: #dbeafe; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <p style="margin: 0; color: #1e3a8a; font-size: 14px;">
              💡 გაკვეთილამდე 15 წუთით ადრე მიიღებთ შეხსენების ელფოსტას.
            </p>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
            <p style="color: #94a3b8; font-size: 12px; margin: 0;">
              ეს არის ავტომატური შეტყობინება, გთხოვთ არ უპასუხოთ.
            </p>
          </div>
        </div>
      </div>
    `,
  };

  try {
    await Promise.all([
      sgMail.send(studentEmailContent),
      sgMail.send(teacherEmailContent),
    ]);
    console.log(
      `✅ Booking confirmation emails sent to ${lesson.studentEmail} and ${lesson.teacherEmail}`
    );
  } catch (error) {
    console.error("❌ Failed to send booking confirmation emails:", error);
    // Don't throw - we don't want email failure to break the booking
    throw error; // Actually, let's throw so we know about failures
  }
}

/**
 * Send reminder emails 15 minutes before lesson
 * Called by cron job
 */
export async function sendLessonReminderEmails(
  lesson: LessonEmailData
): Promise<void> {
  if (!SENDGRID_API_KEY || !VERIFIED_SENDER) {
    console.error("❌ SendGrid not configured - skipping reminder email");
    return;
  }

  const formattedTime = new Date(lesson.date).toLocaleString("ka-GE", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const reminderHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 30px; border-radius: 12px 12px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px;">🔔 გაკვეთილის შეხსენება!</h1>
      </div>
      
      <div style="background: white; padding: 30px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px;">
        <div style="background: #fee2e2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ef4444;">
          <p style="margin: 0 0 15px 0; font-size: 18px; font-weight: bold; color: #991b1b;">
            ⏰ თქვენი გაკვეთილი იწყება 15 წუთში!
          </p>
          <p style="margin: 8px 0;"><strong>👤 სტუდენტი:</strong> ${lesson.studentName}</p>
          <p style="margin: 8px 0;"><strong>👨‍🏫 მასწავლებელი:</strong> ${lesson.teacherName}</p>
          <p style="margin: 8px 0;"><strong>📚 საგანი:</strong> ${lesson.subject}</p>
          <p style="margin: 8px 0;"><strong>⏰ დრო:</strong> ${formattedTime}</p>
          <p style="margin: 8px 0;"><strong>💰 ფასი:</strong> ${lesson.price} ₾</p>
          ${lesson.duration ? `<p style="margin: 8px 0;"><strong>⏳ ხანგრძლივობა:</strong> ${lesson.duration} საათი</p>` : ""}
          ${lesson.comment ? `<p style="margin: 8px 0;"><strong>💬 კომენტარი:</strong> ${lesson.comment}</p>` : ""}
        </div>
        
        ${
          lesson.link
            ? `
        <div style="text-align: center; margin: 30px 0;">
          <a href="${lesson.link}" 
             style="display: inline-block; background: #10b981; color: white; padding: 16px 32px; 
                    text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
            🚀 შეხვედრაზე შესვლა
          </a>
        </div>
        `
            : ""
        }
        
        <p style="color: #64748b; font-size: 14px; text-align: center; margin-top: 20px;">
          გთხოვთ მოემზადოთ გაკვეთილისთვის!
        </p>
      </div>
    </div>
  `;

  try {
    await Promise.all([
      sgMail.send({
        to: lesson.studentEmail,
        from: VERIFIED_SENDER,
        subject: `🔔 გაკვეთილის შეხსენება - ${lesson.subject} (15 წუთში)`,
        html: reminderHtml,
      }),
      sgMail.send({
        to: lesson.teacherEmail,
        from: VERIFIED_SENDER,
        subject: `🔔 გაკვეთილის შეხსენება - ${lesson.subject} (15 წუთში)`,
        html: reminderHtml,
      }),
    ]);
    console.log(
      `✅ Reminder emails sent to ${lesson.studentEmail} and ${lesson.teacherEmail}`
    );
  } catch (error) {
    console.error("❌ Failed to send reminder emails:", error);
    throw error;
  }
}
