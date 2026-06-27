"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { markPasswordAsChanged } from "./actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  LoaderCircle,
} from "lucide-react";

export default function ResetPasswordPage() {
  const supabase = createClient();
  const router = useRouter();

  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"admin" | "scholar" | null>(null);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);

  const minLength = 8;

  const isLengthValid = password.length >= minLength;
  const isMatch =
    password.length > 0 &&
    confirmPassword.length > 0 &&
    password === confirmPassword;

  useEffect(() => {
    async function loadUser() {
      const { data: auth } = await supabase.auth.getUser();

      if (!auth.user) return;

      setUserId(auth.user.id);
      setEmail(auth.user.email ?? "");

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", auth.user.id)
        .single();

      if (profile?.role) {
        setRole(profile.role);
      }
    }

    loadUser();
  }, []);

  function validate() {
    if (!password || !confirmPassword) {
      toast.error("All fields are required");
      return false;
    }

    if (!isLengthValid) {
      toast.error("Password must be at least 8 characters");
      return false;
    }

    if (!isMatch) {
      toast.error("Passwords do not match");
      return false;
    }

    return true;
  }

  async function handleUpdatePassword() {
    if (loading) return;
    if (!validate()) return;

    setLoading(true);

    try {
      // 1. update auth password
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      // 2. update profile via SERVER (bypasses RLS)
      const result = await markPasswordAsChanged(userId);

      if (!result.success) {
        toast.error("Password updated but profile sync failed");
        return;
      }

      toast.success("Password updated successfully");

      // 3. redirect by role
      if (role === "admin") {
        router.replace("/admin");
        return;
      }

      if (role === "scholar") {
        router.replace("/scholar");
        return;
      }

      router.replace("/login");
    } catch {
      toast.error("Unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="h-dvh flex items-center justify-center bg-[#04100b] px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#12251d]/90 p-6">

        {/* HEADER */}
        <h1 className="text-xl font-semibold text-white mb-1">
          Reset Password
        </h1>

        <p className="text-sm text-white/50 mb-6">
          Update your password to continue
        </p>

        {/* EMAIL */}
        <div className="flex items-center gap-2 h-12 px-4 rounded-xl bg-white/5 border border-white/10 mb-3 opacity-70">
          <Mail className="h-4 w-4 text-white/40" />
          <input
            value={email}
            disabled
            className="w-full bg-transparent text-white text-sm outline-none"
          />
        </div>

        {/* PASSWORD */}
        <div className="mb-1 text-xs text-white/40 flex justify-between">
          <span>Password</span>
          <span>
            {password.length}/{minLength}
          </span>
        </div>

        <div className="flex items-center gap-2 h-12 px-4 rounded-xl bg-white/5 border border-white/10">
          <Lock className="h-4 w-4 text-white/40" />

          <input
            type={showPass ? "text" : "password"}
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-transparent text-white text-sm outline-none"
          />

          <button type="button" onClick={() => setShowPass(!showPass)}>
            {showPass ? (
              <EyeOff className="h-4 w-4 text-white/50" />
            ) : (
              <Eye className="h-4 w-4 text-white/50" />
            )}
          </button>
        </div>

        {/* PASSWORD STATUS */}
        <div className="text-xs mt-1 mb-3">
          {isLengthValid ? (
            <span className="text-green-400">✓ Minimum length met</span>
          ) : (
            <span className="text-red-400">
              Must be at least {minLength} characters
            </span>
          )}
        </div>

        {/* CONFIRM PASSWORD */}
        <div className="flex items-center gap-2 h-12 px-4 rounded-xl bg-white/5 border border-white/10">
          <Lock className="h-4 w-4 text-white/40" />

          <input
            type={showConfirm ? "text" : "password"}
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full bg-transparent text-white text-sm outline-none"
          />

          <button type="button" onClick={() => setShowConfirm(!showConfirm)}>
            {showConfirm ? (
              <EyeOff className="h-4 w-4 text-white/50" />
            ) : (
              <Eye className="h-4 w-4 text-white/50" />
            )}
          </button>
        </div>

        {/* MATCH STATUS */}
        <div className="text-xs mt-1 mb-5">
          {confirmPassword.length > 0 ? (
            isMatch ? (
              <span className="text-green-400">✓ Passwords match</span>
            ) : (
              <span className="text-red-400">✗ Passwords do not match</span>
            )
          ) : (
            <span className="text-white/30">
              Re-enter password to confirm
            </span>
          )}
        </div>

        {/* BUTTON */}
        <button
          onClick={handleUpdatePassword}
          disabled={loading}
          className="w-full h-12 rounded-xl bg-emerald-500 text-white font-semibold flex items-center justify-center gap-2 hover:bg-emerald-400 disabled:opacity-60"
        >
          {loading ? (
            <>
              <LoaderCircle className="h-4 w-4 animate-spin" />
              Updating...
            </>
          ) : (
            "Update Password"
          )}
        </button>
      </div>
    </main>
  );
}