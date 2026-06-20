"use client";

import Image from "next/image";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Eye, EyeOff, LoaderCircle, LockKeyhole, Mail } from "lucide-react";

import { loginAction } from "./actions";

export default function LoginPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;

    const formData = new FormData(e.currentTarget);

    setLoading(true);

    try {
      const res = await loginAction(formData);

      if (!res.success) {
        toast.error("Login failed", {
          description: res.error ?? "Invalid credentials",
        });
        return;
      }

      toast.success("Welcome back");
      router.replace("/dashboard");
    } catch {
      toast.error("System error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-svh w-full flex items-center justify-center bg-[#050d0a] px-4 overflow-hidden">

      {/* GRID */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.75) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.75) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />

      {/* GLOW */}
      <div className="absolute -top-40 -left-40 h-[520px] w-[520px] bg-emerald-500/20 blur-[120px]" />
      <div className="absolute -bottom-40 -right-40 h-[520px] w-[520px] bg-green-400/10 blur-[140px]" />

      {/* CENTER WRAPPER */}
      <div className="relative z-10 w-full max-w-[440px]">

        {/* CARD */}
        <div className="
          rounded-3xl
          border border-white/10
          bg-white/5 backdrop-blur-2xl
          shadow-[0_40px_120px_-50px_rgba(0,0,0,0.8)]
          
          p-5 sm:p-7
          max-h-[90vh]
          overflow-y-auto
        ">

          {/* HEADER */}
          <div className="text-center mb-5 sm:mb-6">

            {/* LOGO (FIXED SCALE) */}
            <div className="
              mx-auto mb-3
              flex items-center justify-center
              h-14 w-14 sm:h-16 sm:w-16
              rounded-full
              bg-white/10 border border-white/10
            ">
              <Image
                src="/logo.jpg"
                alt="logo"
                width={44}
                height={44}
                className="rounded-full"
              />
            </div>

            <h1 className="text-white text-lg sm:text-xl font-semibold">
              ANCOP Scholar Management System
            </h1>

            <p className="text-white/50 text-xs sm:text-sm mt-2 leading-snug">
              Simplifying scholarship management through centralized submissions,
              tracking, and communication.
            </p>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">

            {/* EMAIL */}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 w-4 h-4" />

              <input
                name="email"
                type="email"
                placeholder="Email address"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder:text-white/40 outline-none focus:border-emerald-400"
                required
              />
            </div>

            {/* PASSWORD */}
            <div className="relative">
              <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 w-4 h-4" />

              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full pl-10 pr-10 py-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder:text-white/40 outline-none focus:border-emerald-400"
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* BUTTON */}
            <button
              disabled={loading}
              className="
                w-full flex items-center justify-center gap-2
                py-3 rounded-xl
                bg-emerald-500 hover:bg-emerald-600
                text-white font-medium
                transition
                disabled:opacity-60
              "
            >
              {loading ? (
                <>
                  <LoaderCircle className="animate-spin w-4 h-4" />
                  Signing in
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          {/* FOOTER */}
          <p className="text-center text-white/30 text-[11px] sm:text-xs mt-5">
            Authorized access only
          </p>
        </div>
      </div>
    </main>
  );
}