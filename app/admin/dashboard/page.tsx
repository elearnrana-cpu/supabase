import { createAdminClient } from "@/lib/supabase/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function DashboardPage() {
  const supabase = createAdminClient();

  const [{ data: projects }, { data: blogPosts }, { data: messages }] = await Promise.all([
    supabase.from("projects").select("id, title, published").eq("published", false),
    supabase.from("blog_posts").select("id, title, published").eq("published", false),
    supabase.from("contact_messages").select("id, name, email").eq("read", false),
  ]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{projects?.length || 0}</div>
            <p className="text-sm text-muted-foreground">Total projects</p>
            <Button asChild className="mt-4 w-full">
              <Link href="/admin/projects">Manage Projects</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Blog Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{blogPosts?.length || 0}</div>
            <p className="text-sm text-muted-foreground">Total blog posts</p>
            <Button asChild className="mt-4 w-full">
              <Link href="/admin/blog">Manage Blog</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{messages?.length || 0}</div>
            <p className="text-sm text-muted-foreground">Unread messages</p>
            <Button asChild className="mt-4 w-full">
              <Link href="/admin/messages">View Messages</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}