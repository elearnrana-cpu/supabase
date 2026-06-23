import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function getSession() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function requireAdmin() {
  const user = await getSession();
  if (!user) {
    redirect("/admin/login");
  }
  if (user.email !== process.env.ADMIN_EMAIL) {
    redirect("/admin/login");
  }
  return user;
}