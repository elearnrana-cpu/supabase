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

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_url: string;
  published: boolean;
  published_at: string | null;
}

export default function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const coverUrlRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    params.then(({ id }) => {
      const supabase = createClient();
      supabase.from("blog_posts").select("*").eq("id", id).single().then(({ data, error }) => {
        if (error) toast.error("Failed to load post");
        else setPost(data);
      });
    });
  }, [params]);

  async function handleSubmit(formData: FormData) {
    if (!post) return;
    setIsSubmitting(true);
    const supabase = createClient();

    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string;
    const excerpt = formData.get("excerpt") as string;
    const content = formData.get("content") as string;
    const coverUrl = formData.get("cover_url") as string;
    const published = formData.get("published") === "on";
    const publishedAt = published && !post.published ? new Date().toISOString() : post.published_at;

    const { error } = await supabase.from("blog_posts").update({
      title, slug, excerpt, content,
      cover_url: coverUrl || null,
      published, published_at: publishedAt,
    }).eq("id", post.id);

    if (error) toast.error(error.message);
    else { toast.success("Post updated"); router.push("/admin/blog"); }
    setIsSubmitting(false);
  }

  if (!post) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Edit Blog Post</h1>
      <Card>
        <CardHeader><CardTitle>Post Details</CardTitle></CardHeader>
        <CardContent>
          <form action={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" defaultValue={post.title} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input id="slug" name="slug" defaultValue={post.slug} required />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Cover Image</Label>
              <ImageUpload onUpload={(url) => { if (coverUrlRef.current) coverUrlRef.current.value = url; }} currentUrl={post.cover_url} />
              <input ref={coverUrlRef} type="hidden" name="cover_url" defaultValue={post.cover_url} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea id="excerpt" name="excerpt" rows={3} defaultValue={post.excerpt} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content (HTML)</Label>
              <Textarea id="content" name="content" rows={15} defaultValue={post.content} />
            </div>

            <div className="flex items-center space-x-2">
              <input type="checkbox" id="published" name="published" defaultChecked={post.published} />
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