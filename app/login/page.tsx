"use client";

import Image from "next/image";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
  Mail,
} from "lucide-react";

import { loginAction } from "./actions";

export default function LoginPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (loading) return;

    const formData = new FormData(event.currentTarget);
    setLoading(true);

    try {
      const response = await loginAction(formData);

      if (!response.success) {
        toast.error("Login failed", {
          description: response.error ?? "Invalid email or password.",
        });
        return;
      }

      if (!response.success) {
        toast.error("Login failed", {
          description: response.error ?? "Invalid email or password.",
        });
        return;
      }


      if (response.mustChangePassword) {
        toast.success("Password update required");
        router.replace("/reset-password");
        return;
      }

      if (response.role === "admin") {
        toast.success("Welcome Admin");
        router.replace("/admin");
        return;
      }

      if (response.role === "scholar") {
        toast.success("Welcome Scholar");
        router.replace("/scholar");
        return;
      }
    } catch {
      toast.error("System error", {
        description: "Unable to sign in. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative h-dvh w-full overflow-hidden bg-[#04100b] px-4">

      {/* GRID */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)",
          backgroundSize: "46px 46px",
        }}
      />

      {/* GLOW */}
      <div className="pointer-events-none absolute -left-20 -top-20 h-[420px] w-[420px] rounded-full bg-emerald-500/20 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-32 -right-20 h-[420px] w-[420px] rounded-full bg-green-400/10 blur-[120px]" />

      {/* CENTER */}
      <div className="relative z-10 flex h-dvh items-center justify-center">

        {/* CARD (ENLARGED) */}
        <section className="w-full max-w-[520px] rounded-3xl border border-white/10 bg-[#12251d]/90 px-8 py-10 shadow-2xl backdrop-blur-xl">

          {/* HEADER */}
          <header className="mb-8 text-center">

            <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-white/10 shadow-lg">
              <Image
                src="/logo.jpg"
                alt="Logo"
                width={64}
                height={64}
                className="h-14 w-14 rounded-full object-cover"
              />
            </div>

            <h1 className="text-2xl font-bold text-white">
              ANCOP ScholarHub
            </h1>

            <p className="mt-2 text-sm text-white/50">
              Centralized scholarship management platform
            </p>
          </header>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* EMAIL */}
            <div className="relative flex h-14 items-center rounded-2xl border border-white/10 bg-white/5 px-4 focus-within:border-emerald-400/70 focus-within:ring-4 focus-within:ring-emerald-400/10">

              <Mail className="h-5 w-5 text-white/40" />

              <input
                name="email"
                type="email"
                placeholder="Email address"
                disabled={loading}
                required
                className="w-full bg-transparent px-4 text-base text-white outline-none placeholder:text-white/40"
              />
            </div>

            {/* PASSWORD */}
            <div className="relative flex h-14 items-center rounded-2xl border border-white/10 bg-white/5 px-4 focus-within:border-emerald-400/70 focus-within:ring-4 focus-within:ring-emerald-400/10">

              <LockKeyhole className="h-5 w-5 text-white/40" />

              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                disabled={loading}
                required
                className="w-full bg-transparent px-4 text-base text-white outline-none placeholder:text-white/40"
              />

              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="flex h-10 w-10 items-center justify-center rounded-lg text-white/50 hover:bg-white/10 hover:text-white"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            <div className="flex items-center justify-end">
              <button
                type="button"
                onClick={() =>
                  toast.info("Coming soon", {
                    description:
                      "Password recovery feature is currently under development. Please contact admin if you need access immediately.",
                  })
                }
                className="text-xs text-emerald-300/70 hover:text-emerald-200 transition"
              >
                Forgot password?
              </button>
            </div>
            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-emerald-500 text-base font-semibold text-white transition hover:bg-emerald-400 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <LoaderCircle className="h-5 w-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          {/* FOOTER */}
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