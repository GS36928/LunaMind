// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

// middleware.ts - გაასწორე login ლოგიკა
export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const url = req.nextUrl.clone();

  console.log("🔍 Middleware triggered:", {
    pathname: url.pathname,
    hasToken: !!token,
  });

  // 1️⃣ თუ token არ არის → login-ზე ნება დართო წვდომას
  if (!token) {
    console.log("❌ No token found");
    if (url.pathname === "/login") {
      return NextResponse.next(); // ნება დართო login-ზე
    }
    if (
      url.pathname.startsWith("/dashboard") ||
      url.pathname.startsWith("/questions")
    ) {
      console.log("🔒 Redirecting to login");
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.next();
  }

  // 2️⃣ decode JWT
  let userId: string | undefined;
  let role: "STUDENT" | "TEACHER" | undefined;

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const { payload } = await jwtVerify(token, secret);
    userId = payload.id as string;
    role = payload.role as "STUDENT" | "TEACHER";
    console.log("✅ JWT verified:", { userId, role });
  } catch (error) {
    console.log("❌ JWT verification failed:", error);
    // თუ token არასწორია, წაშალე ის და გადაიყვანე login-ზე
    const response = NextResponse.redirect(new URL("/login", req.url));
    response.cookies.delete("token");
    return response;
  }

  // 3️⃣ თუ მომხმარებელი უკვე ავთენტიფიცირებულია და არის /login-ზე
  if (url.pathname === "/login" && userId && role) {
    console.log("✅ User already authenticated, redirecting from login...");

    // ✅ მარტივი რედირექტი - ნუ შეამოწმებ პროფილს აქ
    // პირდაპირ გადაიყვანე questions-ზე, პროფილის შემოწმება questions გვერდი გააკეთებს
    return NextResponse.redirect(new URL("/questions", req.url));
  }

  // 4️⃣ Dashboard - შევამოწმოთ რომ მხოლოდ დასრულებული პროფილით შეუდის
  if (url.pathname.startsWith("/dashboard") && userId && role) {
    try {
      console.log("📋 Checking profile completion for dashboard...");

      const res = await fetch(
        `${
          process.env.NEXTAUTH_URL || req.nextUrl.origin
        }/api/check-profile?userId=${userId}&role=${role}`,
        {
          headers: {
            Cookie: req.cookies.toString(),
            "Cache-Control": "no-cache",
          },
        }
      );

      if (res.ok) {
        const data = await res.json();
        console.log("📊 Profile check result:", data);

        if (!data.completed) {
          console.log("❌ Profile not completed - redirecting to questions");
          return NextResponse.redirect(new URL("/questions", req.url));
        }
        console.log("✅ Profile completed - allowing dashboard access");
      }
    } catch (e) {
      console.error("❌ Profile check error:", e);
      return NextResponse.redirect(new URL("/questions", req.url));
    }
  }

  // 5️⃣ Questions - თუ პროფილი უკვე დასრულებულია, გადაიყვანე dashboard-ზე
  if (url.pathname.startsWith("/questions") && userId && role) {
    try {
      console.log("📋 Checking if profile is already completed...");

      const res = await fetch(
        `${
          process.env.NEXTAUTH_URL || req.nextUrl.origin
        }/api/check-profile?userId=${userId}&role=${role}`,
        {
          headers: {
            Cookie: req.cookies.toString(),
            "Cache-Control": "no-cache",
          },
        }
      );

      if (res.ok) {
        const data = await res.json();
        console.log("📊 Profile status for questions:", data);

        if (data.completed) {
          console.log(
            "✅ Profile already completed - redirecting to dashboard"
          );
          return NextResponse.redirect(new URL("/dashboard", req.url));
        }
        console.log("📝 Profile not completed - allowing questions access");
      }
    } catch (e) {
      console.error("❌ Profile check error, allowing questions:", e);
    }
  }

  console.log("✅ All checks passed - allowing access");
  return NextResponse.next();
}
