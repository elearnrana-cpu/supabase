import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function BlogListPage() {
  const supabase = await createClient();

  const { data: posts, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("published", true)
    .order("published_at", { ascending: false });

  if (error) {
    console.error("Error fetching blog posts:", error);
    return <div>Error loading posts</div>;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Link href="/" className="inline-flex items-center text-sm font-medium mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to home
      </Link>

      <h1 className="text-3xl font-bold mb-8">Blog</h1>

      <div className="space-y-6">
        {posts.map((post) => (
          <article key={post.id} className="border-b pb-6">
            <Link href={`/blog/${post.slug}`}>
              <h2 className="text-xl font-semibold hover:underline">{post.title}</h2>
            </Link>
            <p className="text-muted-foreground mt-2">{post.excerpt}</p>
            <time className="text-sm text-muted-foreground">
              {new Date(post.published_at || post.created_at).toLocaleDateString()}
            </time>
          </article>
        ))}
      </div>
    </div>
  );
}