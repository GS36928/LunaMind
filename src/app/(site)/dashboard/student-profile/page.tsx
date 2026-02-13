// app/dashboard/student-profile/page.tsx
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import NavBar from "../../../../../components/dashboard/NavBar";
import PersonalInfo from "../../../../../components/student-profile/PersonalInfo";

function isStudent(user: { role: string }): user is { role: "STUDENT" } {
  return user.role === "STUDENT";
}

export default async function StudentProfilePage() {
  const user = await getCurrentUser();

  // Redirect if not logged in
  if (!user) {
    redirect("/login");
  }

  // Redirect if not a STUDENT
  if (!isStudent(user)) {
    redirect("/dashboard");
  }

  // Fix image type: convert null -> undefined
  const safeUser = {
    ...user,
    image: user.image ?? undefined, // string | undefined
  };

  return (
    <div className="bg-[#F6F5FA]">
      <div className="bg-[#F6F5FA] min-h-screen px-4 lg:px-6 3xl:px-[160px] max-w-[1920px] 3xl:mx-auto pb-[70px] lg:pb-8">
        {/* 🔹 Reuse your existing NavBar with the same user */}
        <NavBar user={safeUser} />
        <PersonalInfo user={safeUser} />
      </div>
    </div>
  );
}
