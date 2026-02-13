// app/onboarding/page.tsx
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import QuestionsClient from "../questions/QuestionsClient";
import { Role } from "@prisma/client";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function OnboardingPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role === Role.ADMIN || user.role === Role.SUPER_ADMIN) {
    redirect("/admin/dashboard");
  }

  let profile;
  let currentStep = 0;

  if (user.role === "STUDENT") {
    profile = await prisma.studentProfile.findUnique({
      where: { userId: user.id },
    });
  } else if (user.role === "TEACHER") {
    profile = await prisma.teacherProfile.findUnique({
      where: { userId: user.id },
    });
  }

  if (profile?.completed) {
    redirect("/dashboard");
  }

  if (profile?.currentStep) {
    currentStep = profile.currentStep;
  }

  return (
    <QuestionsClient
      userId={user.id}
      role={user.role as "STUDENT" | "TEACHER"}
      initialStep={currentStep}
    />
  );
}
