"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
  Mail,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (loading) return;

    const formData = new FormData(e.currentTarget);

    const email = String(formData.get("email") || "")
      .toLowerCase()
      .trim();

    const password = String(formData.get("password") || "")
      .trim();

    if (!email || !password) {
      toast.error("Missing credentials");
      return;
    }

    setLoading(true);

    const loadingToast = toast.loading("Signing you in...");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error || !data.user) {
        toast.dismiss(loadingToast);
        toast.error("Login failed. Check your credentials.");
        setLoading(false);
        return;
      }

      const userId = data.user.id;

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id, role, is_active, must_change_password, full_name, avatar_url")
        .eq("id", userId)
        .limit(1)
        .maybeSingle();

      toast.dismiss(loadingToast);

      // HARD FIX: RLS or missing profile
      if (profileError || !profile) {
        await supabase.auth.signOut();
        toast.error("Unable to read profile (RLS or missing data)");
        setLoading(false);
        return;
      }

      // inactive account
      if (!profile.is_active) {
        await supabase.auth.signOut();
        toast.error("Account inactive");
        setLoading(false);
        return;
      }

      // force password update
      if (profile.must_change_password) {
        toast.info("Password update required");
        router.replace("/reset-password");
        return;
      }

      // WELCOME MESSAGE
      toast.success(
        `Welcome ${profile.full_name || "User"}`
      );

      // ROLE ROUTING
      if (profile.role === "admin") {
        router.replace("/admin");
        return;
      }

      if (profile.role === "scholar") {
        router.replace("/scholar");
        return;
      }

      await supabase.auth.signOut();
      toast.error("Invalid role");

    } catch (err) {
      toast.error("Unexpected system error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative h-dvh w-full overflow-hidden bg-[#04100b] px-4">

      <div className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)",
          backgroundSize: "46px 46px",
        }}
      />

      <div className="pointer-events-none absolute -left-20 -top-20 h-[420px] w-[420px] rounded-full bg-emerald-500/20 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-32 -right-20 h-[420px] w-[420px] rounded-full bg-green-400/10 blur-[120px]" />

      <div className="relative z-10 flex h-dvh items-center justify-center">

        <section className="w-full max-w-[520px] rounded-3xl border border-white/10 bg-[#12251d]/90 px-8 py-10 shadow-2xl backdrop-blur-xl">

          <header className="mb-8 text-center">
            <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-white/10">
              <Image src="/logo.jpg" alt="logo" width={64} height={64} className="rounded-full object-cover" />
            </div>

            <h1 className="text-2xl font-bold text-white">
              ANCOP ScholarHub
            </h1>

            <p className="mt-2 text-sm text-white/50">
              Scholarship Command System
            </p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-5">

            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 h-14">
              <Mail className="h-5 w-5 text-white/40" />
              <input
                name="email"
                type="email"
                placeholder="Email"
                className="w-full bg-transparent text-white outline-none"
                disabled={loading}
              />
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 h-14">
              <LockKeyhole className="h-5 w-5 text-white/40" />

              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full bg-transparent text-white outline-none"
                disabled={loading}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-white/60"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="h-14 w-full rounded-2xl bg-emerald-500 text-white font-semibold flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <LoaderCircle className="animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </button>

          </form>

          <footer className="mt-6 text-center">
            <p className="text-xs text-white/30">
              Authorized access only
            </p>
          </footer>

        </section>
      </div>
    </main>
  );
}