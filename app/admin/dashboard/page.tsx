import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import AdminDashboardClient from "./AdminDashboardClient";
import { validateSession } from "@/api/lib/sessions";

/**
 * Server component: verifies the session cookie before rendering.
 * If not authenticated, redirects to /admin/login immediately (no flash).
 * Session is validated directly (no internal HTTP call that would be blocked
 * by the middleware's Basic Auth guard).
 */
export default async function AdminDashboardPage() {
  const [cookieStore, headerStore] = await Promise.all([cookies(), headers()]);
  const token = cookieStore.get("admin_token")?.value;

  if (!token) redirect("/admin/login");

  // Forward the real browser UA so the session fingerprint check passes
  const ua = headerStore.get("user-agent") ?? "";

  const session = await validateSession(token, ua);
  if (!session) redirect("/admin/login");

  const user = {
    email: session.user_email,
    role: session.user_role,
    name: session.user_name,
    sessionId: session.id,
  };

  return <AdminDashboardClient user={user} />;
}
