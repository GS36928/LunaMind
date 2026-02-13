// lib/session.ts
import { prisma } from "./prisma";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function getCurrentUser() {
  // ✅ await cookies() because in this environment it's a Promise
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get("token");

  if (!tokenCookie) return null;

  try {
    const decoded = jwt.verify(tokenCookie.value, process.env.JWT_SECRET!) as {
      id: string;
    };
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      include: { StudentProfile: true }, // fetch profile along with user
    });
    if (!user) return null;
    console.log(user);
    return user;
  } catch (err) {
    console.error("Invalid JWT:", err);
    return null;
  }
}
