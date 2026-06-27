import { createClient } from "@/lib/supabase/server";
import AdminDashboard from "@/components/admin/admin-dashboard";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const [
    { count: totalScholars },
    { count: activeScholars },
    { count: atRiskScholars },
    { count: pendingReviews },
    { data: submissions },
    { data: notifications },
  ] = await Promise.all([
    supabase.from("scholar_profiles").select("*", { count: "exact", head: true }),

    supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("role", "scholar")
      .eq("is_active", true),

    supabase
      .from("academic_records")
      .select("*", { count: "exact", head: true })
      .or("gwa.lt.83,enrolled_units.lt.18"),

    supabase
      .from("submissions")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending"),

    supabase.from("submissions").select("status, submitted_at"),

    supabase
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(6),
  ]);

  return (
    <AdminDashboard
      totalScholars={totalScholars ?? 0}
      activeScholars={activeScholars ?? 0}
      atRiskScholars={atRiskScholars ?? 0}
      pendingReviews={pendingReviews ?? 0}
      submissions={submissions ?? []}
      notifications={notifications ?? []}
    />
  );
}