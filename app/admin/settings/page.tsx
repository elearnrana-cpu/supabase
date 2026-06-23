import { createAdminClient } from "@/lib/supabase/admin";
import { SettingsClient } from "./settings-client";

export default async function SettingsPage() {
  const supabase = createAdminClient();
  const { data: profile } = await supabase.from("profile").select("*").single();

  return <SettingsClient profile={profile} />;
}