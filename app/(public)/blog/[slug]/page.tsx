import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import sanitizeHtml from "sanitize-html";

interface BlogPostProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogPost({ params }: BlogPostProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: post, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error || !post) {
    notFound();
  }

  const sanitizedContent = sanitizeHtml(post.content, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img", "a", "p", "div", "span", "h1", "h2", "h3", "h4", "h5", "h6", "ul", "ol", "li", "blockquote", "code", "pre"]),
    allowedAttributes: {
      a: ["href", "title"],
      img: ["src", "alt", "width", "height"],
    },
  });

  return (
    <article className="container mx-auto max-w-3xl px-4 py-12">
      <Link href="/blog" className="inline-flex items-center text-sm font-medium mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to blog
      </Link>

      {post.cover_url && (
        <img
          src={post.cover_url}
          alt={post.title}
          className="w-full h-64 object-cover rounded-lg mb-8"
        />
      )}

      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

      <div
        className="prose lg:prose-lg"
        dangerouslySetInnerHTML={{ __html: sanitizedContent }}
      />
    </article>
  );
}