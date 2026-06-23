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

export default function NewProjectPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    const supabase = createClient();

    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string;
    const summary = formData.get("summary") as string;
    const content = formData.get("content") as string;
    const demoUrl = formData.get("demo_url") as string;
    const repoUrl = formData.get("repo_url") as string;
    const tags = formData.get("tags") as string;
    const published = formData.get("published") === "on";

    const { error } = await supabase.from("projects").insert({
      title,
      slug,
      summary,
      content,
      demo_url: demoUrl || null,
      repo_url: repoUrl || null,
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      published,
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Project created");
      router.push("/admin/projects");
    }
    setIsSubmitting(false);
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">New Project</h1>
      <Card>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input id="slug" name="slug" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="summary">Summary</Label>
              <Textarea id="summary" name="summary" rows={3} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content (HTML)</Label>
              <Textarea id="content" name="content" rows={10} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="demo_url">Demo URL</Label>
                <Input id="demo_url" name="demo_url" type="url" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="repo_url">Repo URL</Label>
                <Input id="repo_url" name="repo_url" type="url" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input id="tags" name="tags" placeholder="React, TypeScript, Next.js" />
            </div>

            <div className="flex items-center space-x-2">
              <input type="checkbox" id="published" name="published" />
              <Label htmlFor="published">Publish immediately</Label>
            </div>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Project"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}