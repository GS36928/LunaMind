// types/dashboard.ts
export type UserRole = "STUDENT" | "TEACHER" | "ADMIN" | "SUPER_ADMIN";

export interface BaseUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface StudentUser extends BaseUser {
  role: "STUDENT";
}

export interface TeacherUser extends BaseUser {
  role: "TEACHER";
}

export type DashboardUser = BaseUser & {
  role: UserRole;
};

export type StudentTeacherUser = StudentUser | TeacherUser;
