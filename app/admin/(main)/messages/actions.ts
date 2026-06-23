"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function markRead(formData: FormData) {
  const id = formData.get("id") as string;
  const supabase = createAdminClient();

  const { error } = await supabase
    .from("contact_messages")
    .update({ read: true })
    .eq("id", id);

  if (error) {
    console.error("Error marking message as read:", error);
    return;
  }

  revalidatePath("/admin/messages");
}