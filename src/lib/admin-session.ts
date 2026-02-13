// lib/admin-session.ts
import { prisma } from "./prisma";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

export async function getCurrentAdmin() {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get("admin-token");

  if (!tokenCookie) return null;

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const { payload } = await jwtVerify(tokenCookie.value, secret);

    const user = await prisma.user.findUnique({
      where: {
        id: payload.id as string,
        role: { in: ["ADMIN", "SUPER_ADMIN"] },
        isActive: true,
        banned: false,
      },
      select: {
        id: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true,
        isActive: true,
        banned: true,
      },
    });

    if (!user) return null;
    return user;
  } catch (err) {
    console.error("Invalid admin JWT:", err);
    return null;
  }
}
