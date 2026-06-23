import { createAdminClient } from "@/lib/supabase/admin";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Plus, Edit, Trash2 } from "lucide-react";
import { deleteProject } from "./actions";

export default async function ProjectsPage() {
  const supabase = createAdminClient();
  const { data: projects, error } = await supabase
    .from("projects")
    .select("id, title, summary, published, sort_order")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching projects:", error);
    return <div>Error loading projects</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Projects</h1>
        <Button asChild>
          <Link href="/admin/projects/new">
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Link>
        </Button>
      </div>

      <div className="space-y-4">
        {projects?.map((project) => (
          <Card key={project.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">{project.title}</CardTitle>
              <div className="flex gap-2">
                <Link href={`/admin/projects/${project.id}`}>
                  <Edit className="h-4 w-4" />
                </Link>
                <form action={deleteProject}>
                  <input type="hidden" name="id" value={project.id} />
                  <button type="submit">
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </button>
                </form>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{project.summary}</p>
              <div className="flex gap-2 mt-2">
                <span className={`text-xs px-2 py-1 rounded-full ${project.published ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                  {project.published ? "Published" : "Draft"}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}