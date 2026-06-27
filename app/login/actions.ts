"use server";

import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

type Role = "admin" | "scholar";

type LoginResponse =
  | {
      success: true;
      role: Role;
      mustChangePassword: boolean;
      isActive: boolean;
      userId: string;
    }
  | {
      success: false;
      error: string;
    };

function isValidRole(role: unknown): role is Role {
  return role === "admin" || role === "scholar";
}

export async function loginAction(
  formData: FormData
): Promise<LoginResponse> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();

  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return {
      success: false,
      error: "Email and password are required.",
    };
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    return {
      success: false,
      error: "Invalid email or password.",
    };
  }

  const userId = data.user.id;

  const { data: profile, error: profileError } = await supabaseAdmin
    .from("profiles")
    .select("role, must_change_password, is_active")
    .eq("id", userId)
    .maybeSingle();

  if (profileError) {
    await supabase.auth.signOut();

    return {
      success: false,
      error: "Unable to verify account profile.",
    };
  }

  if (!profile) {
    await supabase.auth.signOut();

    return {
      success: false,
      error: "Profile not found. Please contact the administrator.",
    };
  }

  if (!isValidRole(profile.role)) {
    await supabase.auth.signOut();

    return {
      success: false,
      error: "Invalid account role. Please contact the administrator.",
    };
  }

  if (profile.is_active !== true) {
    await supabase.auth.signOut();

    return {
      success: false,
      error: "Your account is inactive. Please contact the administrator.",
    };
  }

  return {
    success: true,
    userId,
    role: profile.role,
    isActive: profile.is_active,
    mustChangePassword: profile.must_change_password === true,
  };
}