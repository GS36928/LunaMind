// app/login/page.tsx
import { getCurrentUser } from "@/lib/session";
import LoginPageClient from "./LoginPageClient";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function LoginPage() {
  const user = await getCurrentUser();

  if (user) {
    return null;
  }

  return <LoginPageClient />;
}
