// app/dashboard/page.tsx
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import DashboardClient from "./DashboardClient";
import { StudentTeacherUser } from "../../../../types/dashboard";

// Type guard: ensure only STUDENT or TEACHER
function isStudentOrTeacher(user: {
  role: string;
}): user is { role: "STUDENT" | "TEACHER" } {
  return user.role === "STUDENT" || user.role === "TEACHER";
}

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  // Redirect anyone who is not STUDENT or TEACHER
  if (!isStudentOrTeacher(user)) {
    redirect("/login"); // or redirect to "/" if you want
  }

  let profile;
  if (user.role === "STUDENT") {
    profile = await prisma.studentProfile.findUnique({
      where: { userId: user.id },
    });
  } else if (user.role === "TEACHER") {
    profile = await prisma.teacherProfile.findUnique({
      where: { userId: user.id },
    });
  }

  // if (!profile || !profile.completed) {
  //   redirect("/onboarding");
  // }

  if (!profile || !profile.completed) {
    redirect("/questions");
  }

  const dashboardUser: StudentTeacherUser = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
  };

  return <DashboardClient user={dashboardUser} />;
}
