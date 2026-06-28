import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

/**
 * Auth gate for everything under /dashboard (editor + preview). We verify the
 * session here AND in every server action (defense in depth) — the recommended
 * Next.js pattern (check close to the data, not only in a proxy).
 */
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await getSession())) redirect("/login");
  return children;
}
