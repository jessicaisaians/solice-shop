import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/sidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") redirect("/login");

  return (
    <div className="flex min-h-screen bg-stone-50">
      <AdminSidebar userName={session.user.name ?? "Admin"} />
      <main className="flex-1 overflow-auto p-8">{children}</main>
    </div>
  );
}