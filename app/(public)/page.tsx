import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowRight, ExternalLink, Mail, GitBranch, Link2 } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

async function getProfile() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("profile").select("*").single();
  if (error) {
    console.error("Error fetching profile:", error);
    return null;
  }
  return data;
}

async function getProjects() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("published", true)
    .order("sort_order", { ascending: true });
  if (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
  return data;
}

async function getBlogPosts() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("published", true)
    .order("published_at", { ascending: false })
    .limit(3);
  if (error) {
    console.error("Error fetching blog posts:", error);
    return [];
  }
  return data;
}

export default async function HomePage() {
  const profile = await getProfile();
  const projects = await getProjects();
  const blogPosts = await getBlogPosts();

  return (
    <div className="min-h-screen">
      <header className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold">
          {profile?.name || "Portfolio"}
        </Link>
        <nav className="flex items-center space-x-6">
          <Link href="#projects" className="text-sm font-medium hover:underline">
            Projects
          </Link>
          <Link href="#about" className="text-sm font-medium hover:underline">
            About
          </Link>
          <Link href="#blog" className="text-sm font-medium hover:underline">
            Blog
          </Link>
          <ThemeToggle />
        </nav>
      </header>

      <main className="container mx-auto px-4 py-8">
        <section className="py-20 text-center">
          <h1 className="text-4xl font-bold sm:text-5xl">{profile?.name}</h1>
          <p className="mt-2 text-xl text-muted-foreground">{profile?.title || "Developer"}</p>
          <p className="mt-1 text-lg text-muted-foreground">{profile?.tagline}</p>
          <div className="mt-6 flex justify-center space-x-4">
            <Button asChild>
              <Link href="#projects">
                View Projects
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href={profile?.socials && (profile.socials as Record<string, string>).email ? `mailto:${(profile.socials as Record<string, string>).email}` : "mailto:hello@rana.dev"}>
                <Mail className="mr-2 h-4 w-4" />
                Contact Me
              </Link>
            </Button>
          </div>
        </section>

        <section id="projects" className="py-16">
          <h2 className="text-3xl font-bold mb-8">Projects</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Card key={project.id} className="group">
                <CardHeader>
                  <CardTitle>{project.title}</CardTitle>
                  <CardDescription>{project.summary}</CardDescription>
                </CardHeader>
                {project.cover_url && (
                  <img
                    src={project.cover_url}
                    alt={project.title}
                    className="h-48 w-full rounded-t-lg object-cover"
                  />
                )}
                <CardContent>
                  <div className="flex gap-2 mb-4">
                    {project.tags?.map((tag: string) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-1 bg-secondary rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    {project.demo_url && (
                      <Button size="sm" asChild>
                        <Link href={project.demo_url} target="_blank">
                          Demo
                          <ExternalLink className="ml-2 h-3 w-3" />
                        </Link>
                      </Button>
                    )}
                    {project.repo_url && (
                      <Button size="sm" variant="outline" asChild>
                        <Link href={project.repo_url} target="_blank">
                          <GitBranch className="h-3 w-3" />
                        </Link>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section id="about" className="py-16">
          <Card>
            <CardHeader>
              <CardTitle>About Me</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{profile?.bio}</p>
              <div className="flex flex-wrap gap-4 mb-4">
                {profile?.socials && Object.entries(profile.socials as Record<string, string>).map(([name, url]) => {
                  const icons: Record<string, typeof Link2> = { github: GitBranch, facebook: Link2, x: Link2, email: Mail, phone: Link2 };
                  const Icon = icons[name] || Link2;
                  return url ? (
                    <Link key={name} href={url.startsWith("http") ? url : `mailto:${url}`} target={url.startsWith("http") ? "_blank" : undefined} className="flex items-center gap-1 text-sm hover:underline">
                      <Icon className="h-4 w-4" />
                      {name === "phone" ? url : name}
                    </Link>
                  ) : null;
                })}
              </div>
            </CardContent>
          </Card>
        </section>

        <section id="blog" className="py-16">
          <h2 className="text-3xl font-bold mb-8">Latest Posts</h2>
          <div className="space-y-4">
            {blogPosts.map((post) => (
              <Card key={post.id}>
                <CardHeader>
                  <CardTitle>{post.title}</CardTitle>
                  <CardDescription>{post.excerpt}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href={`/blog/${post.slug}`} className="text-sm font-medium hover:underline">
                    Read more
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="py-16">
          <Card>
            <CardHeader>
              <CardTitle>Get in Touch</CardTitle>
            </CardHeader>
            <CardContent>
              <form action="/api/contact" method="post" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    required
                    className="px-3 py-2 border rounded-md"
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    required
                    className="px-3 py-2 border rounded-md"
                  />
                </div>
                <textarea
                  name="message"
                  placeholder="Message"
                  required
                  className="w-full px-3 py-2 border rounded-md"
                  rows={5}
                />
                <Button type="submit">Send Message</Button>
              </form>
            </CardContent>
          </Card>
        </section>
      </main>

      <footer className="border-t py-6 text-center">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} {profile?.name || "Rana"}. All rights reserved.
        </p>
      </footer>
    </div>
  );
}