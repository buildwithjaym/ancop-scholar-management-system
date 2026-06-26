"use server";

import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

type LoginResponse =
  | {
      success: true;
      role: "admin" | "scholar";
      mustChangePassword: boolean;
      userId: string;
    }
  | {
      success: false;
      error: string;
    };



export async function loginAction(formData: FormData) {
  const email = String(formData.get("email"));
  const password = String(formData.get("password"));

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    return {
      success: false,
      error: error?.message ?? "Invalid credentials",
    };
  }

  const userId = data.user.id;

  const { data: profile, error: profileError } = await supabaseAdmin
    .from("profiles")
    .select("role, must_change_password")
    .eq("id", userId)
    .single();

  if (profileError || !profile) {
    return {
      success: false,
      error: "Profile not found",
    };
  }

  return {
    success: true,
    role: profile.role,
    mustChangePassword: profile.must_change_password,
  };
}