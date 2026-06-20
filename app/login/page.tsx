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

      toast.success("Welcome back");
      router.replace("/dashboard");
    } catch {
      toast.error("System error", {
        description: "Unable to sign in. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative isolate min-h-dvh w-full overflow-x-hidden bg-[#04100b] px-4 py-6 sm:px-6 sm:py-10">
      {/* Grid background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.055]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)
          `,
          backgroundSize: "44px 44px",
        }}
      />

      {/* Background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 -top-40 h-[420px] w-[420px] rounded-full bg-emerald-500/15 blur-[110px] sm:h-[560px] sm:w-[560px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-48 -right-40 h-[420px] w-[420px] rounded-full bg-green-400/10 blur-[120px] sm:h-[560px] sm:w-[560px]"
      />

      {/* Centering container */}
      <div className="relative z-10 mx-auto flex min-h-[calc(100dvh-3rem)] w-full max-w-[430px] items-center justify-center sm:min-h-[calc(100dvh-5rem)]">
        {/* Login card */}
        <section
          aria-labelledby="login-heading"
          className="
            w-full
            rounded-[26px]
            border border-white/[0.10]
            bg-[#12251d]/85
            px-5 py-6
            shadow-[0_30px_90px_-35px_rgba(0,0,0,0.95)]
            backdrop-blur-xl
            sm:rounded-[30px]
            sm:px-8 sm:py-8
          "
        >
          {/* Header */}
          <header className="mb-6 text-center sm:mb-7">
            <div
              className="
                mx-auto mb-4
                flex h-14 w-14
                items-center justify-center
                rounded-full
                border border-white/10
                bg-white/[0.08]
                shadow-[0_10px_35px_-15px_rgba(16,185,129,0.7)]
                sm:h-16 sm:w-16
              "
            >
              <Image
                src="/logo.jpg"
                alt="ANCOP logo"
                width={44}
                height={44}
                priority
                className="h-10 w-10 rounded-full object-cover sm:h-11 sm:w-11"
              />
            </div>

            <h1
              id="login-heading"
              className="text-lg font-semibold leading-tight tracking-[-0.02em] text-white sm:text-xl"
            >
              ANCOP Scholar Management System
            </h1>

            <p className="mx-auto mt-2 max-w-[340px] text-xs leading-relaxed text-white/50 sm:text-sm">
              Simplifying scholarship management through centralized
              submissions, tracking, and communication.
            </p>
          </header>

          {/* Form */}
          <form className="space-y-3.5" onSubmit={handleSubmit}>
            {/* Email */}
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>

              <div className="relative">
                <Mail
                  aria-hidden="true"
                  className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-white/35"
                />

                <input
                  id="email"
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  autoCapitalize="none"
                  spellCheck={false}
                  placeholder="Email address"
                  disabled={loading}
                  required
                  className="
                    h-12 w-full rounded-2xl
                    border border-white/10
                    bg-white/[0.07]
                    pl-11 pr-4
                    text-base text-white
                    outline-none
                    transition
                    placeholder:text-white/35
                    hover:border-white/20
                    focus:border-emerald-400/80
                    focus:bg-white/[0.09]
                    focus:ring-4 focus:ring-emerald-400/10
                    disabled:cursor-not-allowed disabled:opacity-60
                    sm:h-13 sm:text-sm
                  "
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>

              <div className="relative">
                <LockKeyhole
                  aria-hidden="true"
                  className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-white/35"
                />

                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Password"
                  disabled={loading}
                  required
                  className="
                    h-12 w-full rounded-2xl
                    border border-white/10
                    bg-white/[0.07]
                    pl-11 pr-12
                    text-base text-white
                    outline-none
                    transition
                    placeholder:text-white/35
                    hover:border-white/20
                    focus:border-emerald-400/80
                    focus:bg-white/[0.09]
                    focus:ring-4 focus:ring-emerald-400/10
                    disabled:cursor-not-allowed disabled:opacity-60
                    sm:h-13 sm:text-sm
                  "
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  disabled={loading}
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                  aria-pressed={showPassword}
                  className="
                    absolute right-2 top-1/2
                    flex h-9 w-9 -translate-y-1/2
                    items-center justify-center
                    rounded-lg
                    text-white/40
                    transition
                    hover:bg-white/[0.07]
                    hover:text-white/75
                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-emerald-400
                    disabled:cursor-not-allowed
                  "
                >
                  {showPassword ? (
                    <EyeOff aria-hidden="true" size={18} />
                  ) : (
                    <Eye aria-hidden="true" size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="
                flex h-12 w-full
                items-center justify-center gap-2
                rounded-2xl
                bg-emerald-500
                px-5
                text-sm font-semibold text-white
                shadow-[0_12px_35px_-14px_rgba(16,185,129,0.9)]
                transition
                hover:bg-emerald-400
                focus-visible:outline-none
                focus-visible:ring-4
                focus-visible:ring-emerald-400/25
                active:scale-[0.99]
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              {loading ? (
                <>
                  <LoaderCircle
                    aria-hidden="true"
                    className="h-4 w-4 animate-spin"
                  />
                  <span>Signing in...</span>
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          {/* Footer */}
          <footer className="mt-5 text-center">
            <p className="text-[10px] text-white/30 sm:text-xs">
              Authorized access only
            </p>
          </footer>
        </section>
      </div>
    </main>
  );
}