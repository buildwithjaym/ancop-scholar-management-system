import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/admin-sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <div className="min-h-screen bg-gray-50">

      <AdminSidebar />

      {/* IMPORTANT: proper offset */}
      <main className="md:ml-63 min-h-screen pt-14 md:pt-0">
        <div className="p-6 max-w-[1600px] mx-auto">
          {children}
        </div>
      </main>

    </div>
  );
}