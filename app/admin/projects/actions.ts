"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function deleteProject(formData: FormData) {
  const id = formData.get("id") as string;
  const supabase = createAdminClient();

  const { error } = await supabase.from("projects").delete().eq("id", id);

  if (error) {
    console.error("Error deleting project:", error);
    return;
  }

  revalidatePath("/admin/projects");
}