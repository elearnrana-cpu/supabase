"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ImageUpload } from "@/components/admin/image-upload";

export default function NewBlogPostPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const coverUrlRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    const supabase = createClient();

    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string;
    const excerpt = formData.get("excerpt") as string;
    const content = formData.get("content") as string;
    const coverUrl = formData.get("cover_url") as string;
    const published = formData.get("published") === "on";
    const publishedAt = published ? new Date().toISOString() : null;

    const { error } = await supabase.from("blog_posts").insert({
      title,
      slug,
      excerpt,
      content,
      cover_url: coverUrl || null,
      published,
      published_at: publishedAt,
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Post created");
      router.push("/admin/blog");
    }
    setIsSubmitting(false);
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">New Blog Post</h1>
      <Card>
        <CardHeader>
          <CardTitle>Post Details</CardTitle>
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
              <Label>Cover Image</Label>
              <ImageUpload
                onUpload={(url) => {
                  if (coverUrlRef.current) coverUrlRef.current.value = url;
                }}
              />
              <input ref={coverUrlRef} type="hidden" name="cover_url" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea id="excerpt" name="excerpt" rows={3} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content (HTML)</Label>
              <Textarea id="content" name="content" rows={15} />
            </div>

            <div className="flex items-center space-x-2">
              <input type="checkbox" id="published" name="published" />
              <Label htmlFor="published">Publish immediately</Label>
            </div>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Post"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}