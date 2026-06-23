import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: project, error } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (error || !project) {
    notFound();
  }

  return (
    <article className="container mx-auto max-w-3xl px-4 py-12">
      <Link href="/" className="inline-flex items-center text-sm font-medium mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to home
      </Link>

      {project.cover_url && (
        <img
          src={project.cover_url}
          alt={project.title}
          className="w-full h-64 object-cover rounded-lg mb-8"
        />
      )}

      <h1 className="text-4xl font-bold mb-4">{project.title}</h1>

      <div className="flex gap-2 mb-6">
        {project.tags?.map((tag: string) => (
          <span key={tag} className="text-xs px-2 py-1 bg-secondary rounded-full">
            {tag}
          </span>
        ))}
      </div>

      <div className="prose lg:prose-lg" dangerouslySetInnerHTML={{ __html: project.content }} />

      <div className="mt-8 flex gap-4">
        {project.demo_url && (
          <Button asChild>
            <Link href={project.demo_url} target="_blank">
              Live Demo
            </Link>
          </Button>
        )}
        {project.repo_url && (
          <Button variant="outline" asChild>
            <Link href={project.repo_url} target="_blank">
              View on GitHub
            </Link>
          </Button>
        )}
      </div>
    </article>
  );
}