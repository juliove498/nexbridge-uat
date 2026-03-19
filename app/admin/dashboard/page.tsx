import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import AdminDashboardClient from "./AdminDashboardClient";

/**
 * Server component: verifies the session cookie before rendering.
 * If not authenticated, redirects to /admin/login immediately (no flash).
 */
export default async function AdminDashboardPage() {
  const [cookieStore, headerStore] = await Promise.all([cookies(), headers()]);
  const token = cookieStore.get("admin_token")?.value;

  if (!token) redirect("/admin/login");

  // Forward the real browser UA so the session fingerprint check passes
  const ua = headerStore.get("user-agent") ?? "";

  // Verify session via the API route (keeps DB logic in one place)
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"}/api/admin/me`,
    {
      headers: {
        cookie: `admin_token=${token}`,
        "user-agent": ua,
      },
      cache: "no-store",
    },
  );

  if (!res.ok) redirect("/admin/login");

  const user = (await res.json()) as {
    email: string;
    role: string;
    name: string | null;
    sessionId: number;
  };

  return <AdminDashboardClient user={user} />;
}
