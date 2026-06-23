import { createAdminClient } from "@/lib/supabase/admin";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Plus, Edit, Trash2 } from "lucide-react";
import { deletePost } from "./actions";

export default async function BlogPage() {
  const supabase = createAdminClient();
  const { data: posts, error } = await supabase
    .from("blog_posts")
    .select("id, title, published, published_at")
    .order("published_at", { ascending: false });

  if (error) {
    console.error("Error fetching blog posts:", error);
    return <div>Error loading posts</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Blog Posts</h1>
        <Button asChild>
          <Link href="/admin/blog/new">
            <Plus className="mr-2 h-4 w-4" />
            New Post
          </Link>
        </Button>
      </div>

      <div className="space-y-4">
        {posts?.map((post) => (
          <Card key={post.id} className="flex items-center justify-between">
            <CardHeader>
              <CardTitle className="text-lg">{post.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-4">
              <span className={`text-xs px-2 py-1 rounded-full ${post.published ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                {post.published ? "Published" : "Draft"}
              </span>
              <Link href={`/admin/blog/${post.id}`}>
                <Edit className="h-4 w-4" />
              </Link>
              <form action={deletePost}>
                <input type="hidden" name="id" value={post.id} />
                <button type="submit">
                  <Trash2 className="h-4 w-4 text-destructive" />
                </button>
              </form>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}