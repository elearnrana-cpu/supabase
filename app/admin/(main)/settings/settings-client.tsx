"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Profile {
  id: string;
  name: string;
  title: string;
  tagline: string;
  bio: string;
  avatar_url: string;
  resume_url: string;
  skills: string[];
  socials: Record<string, string>;
}

export function SettingsClient({ profile }: { profile: Profile | null }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    const supabase = createClient();

    const name = formData.get("name") as string;
    const title = formData.get("title") as string;
    const tagline = formData.get("tagline") as string;
    const bio = formData.get("bio") as string;
    const skills = formData.get("skills") as string;

    const { error } = await supabase.from("profile").upsert({
      id: profile?.id || undefined,
      name,
      title,
      tagline,
      bio,
      skills: skills.split(",").map((s) => s.trim()).filter(Boolean),
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Profile updated");
      router.refresh();
    }
    setIsSubmitting(false);
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" defaultValue={profile?.name || ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" defaultValue={profile?.title || ""} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tagline">Tagline</Label>
              <Input id="tagline" name="tagline" defaultValue={profile?.tagline || ""} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea id="bio" name="bio" rows={5} defaultValue={profile?.bio || ""} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="skills">Skills (comma-separated)</Label>
              <Input id="skills" name="skills" defaultValue={profile?.skills?.join(", ") || ""} />
            </div>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}