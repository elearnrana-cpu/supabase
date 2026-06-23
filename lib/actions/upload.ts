"use server";

import { createAdminClient } from "@/lib/supabase/admin";

export async function uploadImage(formData: FormData) {
  const file = formData.get("file") as File;
  if (!file) {
    return { error: "No file provided" };
  }

  const supabase = createAdminClient();
  const ext = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage.from("media").upload(fileName, file);

  if (error) {
    return { error: error.message };
  }

  const { data: urlData } = supabase.storage.from("media").getPublicUrl(fileName);
  return { url: urlData.publicUrl };
}