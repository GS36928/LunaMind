import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import QuestionsClient from "./QuestionsClient";
import { prisma } from "@/lib/prisma";

export default async function QuestionsPage() {
  const user = await getCurrentUser();

  // 1️⃣ თუ მომხმარებელი არ არსებობს → login
  if (!user) return redirect("/login");

  if (user.role !== "STUDENT" && user.role !== "TEACHER") {
    return redirect("/"); // ❗ ADMIN და სხვა როლები ბლოკი
  }

  // 2️⃣ მიიღე profile პირდაპირ server-side
  const profile =
    user.role === "STUDENT"
      ? await prisma.studentProfile.findUnique({ where: { userId: user.id } })
      : await prisma.teacherProfile.findUnique({ where: { userId: user.id } });

  const currentStep = profile?.currentStep ?? 0;

  // 3️⃣ თუ უკვე დასრულებულია → dashboard
  const totalQuestions = user.role === "STUDENT" ? 8 : 13;
  if (currentStep >= totalQuestions - 1) {
    return redirect("/dashboard"); // ✅ პირდაპირ dashboard
  }

  // 4️⃣ თუ ჯერ დასრულებული არ არის → render client-side component
  return (
    <QuestionsClient
      userId={user.id}
      role={user.role}
      initialStep={currentStep}
    />
  );
}
