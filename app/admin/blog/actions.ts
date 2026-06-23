"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function deletePost(formData: FormData) {
  const id = formData.get("id") as string;
  const supabase = createAdminClient();

  const { error } = await supabase.from("blog_posts").delete().eq("id", id);

  if (error) {
    console.error("Error deleting post:", error);
    return;
  }

  revalidatePath("/admin/blog");
}