"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ImageUpload } from "@/components/admin/image-upload";

interface Project {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  cover_url: string;
  demo_url: string;
  repo_url: string;
  tags: string[];
  published: boolean;
}

export default function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const coverUrlRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    params.then(({ id }) => {
      const supabase = createClient();
      supabase.from("projects").select("*").eq("id", id).single().then(({ data, error }) => {
        if (error) toast.error("Failed to load project");
        else setProject(data);
      });
    });
  }, [params]);

  async function handleSubmit(formData: FormData) {
    if (!project) return;
    setIsSubmitting(true);
    const supabase = createClient();

    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string;
    const summary = formData.get("summary") as string;
    const content = formData.get("content") as string;
    const coverUrl = formData.get("cover_url") as string;
    const demoUrl = formData.get("demo_url") as string;
    const repoUrl = formData.get("repo_url") as string;
    const tags = formData.get("tags") as string;
    const published = formData.get("published") === "on";

    const { error } = await supabase.from("projects").update({
      title, slug, summary, content,
      cover_url: coverUrl || null,
      demo_url: demoUrl || null,
      repo_url: repoUrl || null,
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      published,
    }).eq("id", project.id);

    if (error) toast.error(error.message);
    else { toast.success("Project updated"); router.push("/admin/projects"); }
    setIsSubmitting(false);
  }

  if (!project) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Edit Project</h1>
      <Card>
        <CardHeader><CardTitle>Project Details</CardTitle></CardHeader>
        <CardContent>
          <form action={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" defaultValue={project.title} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input id="slug" name="slug" defaultValue={project.slug} required />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Cover Image</Label>
              <ImageUpload onUpload={(url) => { if (coverUrlRef.current) coverUrlRef.current.value = url; }} currentUrl={project.cover_url} />
              <input ref={coverUrlRef} type="hidden" name="cover_url" defaultValue={project.cover_url} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="summary">Summary</Label>
              <Textarea id="summary" name="summary" rows={3} defaultValue={project.summary} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content (HTML)</Label>
              <Textarea id="content" name="content" rows={10} defaultValue={project.content} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="demo_url">Demo URL</Label>
                <Input id="demo_url" name="demo_url" type="url" defaultValue={project.demo_url || ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="repo_url">Repo URL</Label>
                <Input id="repo_url" name="repo_url" type="url" defaultValue={project.repo_url || ""} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input id="tags" name="tags" defaultValue={project.tags?.join(", ") || ""} />
            </div>

            <div className="flex items-center space-x-2">
              <input type="checkbox" id="published" name="published" defaultChecked={project.published} />
              <Label htmlFor="published">Published</Label>
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