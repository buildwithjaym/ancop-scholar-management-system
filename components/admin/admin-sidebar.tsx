"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  FileText,
  UploadCloud,
  Bell,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Shield,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const menu = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/admin" },
  { label: "Scholars", icon: Users, href: "/admin/scholars" },
  { label: "Batches", icon: FolderKanban, href: "/admin/batches" },
  { label: "Requirements", icon: FileText, href: "/admin/requirements" },
  { label: "Submissions", icon: UploadCloud, href: "/admin/submissions" },
  { label: "Notifications", icon: Bell, href: "/admin/notifications" },
  { label: "Reports", icon: BarChart3, href: "/admin/reports" },
  { label: "Settings", icon: Settings, href: "/admin/settings" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  async function handleLogout() {
    setLoading(true);

    try {
      await supabase.auth.signOut();
      router.replace("/login");
    } finally {
      setTimeout(() => setLoading(false), 600);
    }
  }

  const SidebarContent = () => (
    <div className="h-full flex flex-col bg-gradient-to-b from-[#042a1a] via-[#064a2f] to-[#031d12] text-white">

      {/* HEADER */}
      <div className="shrink-0 px-5 py-6 border-b border-white/10">
        <div className="flex items-center gap-3">

          <div className="w-11 h-11 rounded-xl overflow-hidden bg-white shadow-md">
            <Image src="/logo.jpg" alt="logo" width={44} height={44} />
          </div>

          <div className="leading-tight">
            <p className="text-[10px] text-emerald-300 flex items-center gap-1">
              <Shield size={12} />
              SYSTEM v1
            </p>
            <h1 className="text-sm font-semibold tracking-wide">
              ANCOP ScholarHub
            </h1>
          </div>

        </div>
      </div>

      {/* MENU */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-hidden">
        <div className="flex flex-col gap-1">

          {menu.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 relative
                  ${
                    active
                      ? "bg-emerald-500/20 border border-emerald-400/30"
                      : "hover:bg-white/10"
                  }`}
              >
                <Icon
                  size={18}
                  className={`transition ${
                    active ? "text-emerald-300" : "text-white/60 group-hover:text-white"
                  }`}
                />

                <span
                  className={`text-sm transition ${
                    active ? "text-white font-medium" : "text-white/70 group-hover:text-white"
                  }`}
                >
                  {item.label}
                </span>

                {/* ACTIVE INDICATOR */}
                {active && (
                  <span className="absolute right-3 w-1.5 h-6 bg-emerald-400 rounded-full" />
                )}
              </Link>
            );
          })}

        </div>
      </nav>

      {/* FOOTER */}
      <div className="shrink-0 px-4 py-4 border-t border-white/10">

        <button
          onClick={handleLogout}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl
          bg-red-500/10 border border-red-400/30
          hover:bg-red-500/20 transition"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-red-300 border-t-transparent animate-spin rounded-full" />
          ) : (
            <LogOut size={16} />
          )}

          <span className="text-sm">
            {loading ? "Signing out..." : "Logout"}
          </span>
        </button>

        <p className="text-[10px] text-white/30 text-center mt-3">
          Secure • ANCOP Network
        </p>

      </div>
    </div>
  );

  return (
    <>
      {/* MOBILE TOP BAR (MENU RIGHT SIDE FIXED) */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-[#04321f] flex items-center justify-between px-4 z-50 border-b border-white/10">

        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-white overflow-hidden">
            <Image src="/logo.jpg" alt="logo" width={28} height={28} />
          </div>

          <span className="text-white font-semibold text-sm">
            ANCOP Admin
          </span>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="text-white p-2 rounded-lg hover:bg-white/10"
        >
          <Menu />
        </button>

      </div>

      {/* OVERLAY */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/50 z-40"
        />
      )}

      {/* MOBILE DRAWER */}
      <aside
        className={`md:hidden fixed top-0 right-0 z-50 w-80 h-full transform transition-transform duration-300
        ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <SidebarContent />
      </aside>

      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-72">
        <SidebarContent />
      </aside>
    </>
  );
}