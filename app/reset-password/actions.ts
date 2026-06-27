"use server";

import { supabaseAdmin } from "@/lib/supabase/admin";

export async function markPasswordAsChanged(userId: string) {
  const { error } = await supabaseAdmin
    .from("profiles")
    .update({ must_change_password: false })
    .eq("id", userId);

  if (error) {
    return {
      success: false,
      error: error.message,
    };
  }

  return { success: true };
}