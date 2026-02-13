// app/dashboard/DashboardClient.tsx
"use client";

import StudentPage from "../../../../components/dashboard/StudentPage";
import TeacherProfile from "../../../../components/dashboard/TeacherProfile";
import { StudentTeacherUser } from "../../../../types/dashboard";

interface DashboardClientProps {
  user: StudentTeacherUser; // მხოლოდ STUDENT და TEACHER
}

const DashboardClient: React.FC<DashboardClientProps> = ({ user }) => {
  if (user.role === "STUDENT") {
    return (
      <div className="bg-[#F6F5FA] h-screen">
        <StudentPage user={user} />
      </div>
    );
  } else {
    return (
      <div className="bg-[#F6F5FA] h-screen">
        <TeacherProfile user={user} />
      </div>
    );
  }
};

export default DashboardClient;
