import { getSession, requireAdmin } from "@/lib/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, FolderKanban, Newspaper, MessageSquare, Settings, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAdmin();

  async function handleSignOut() {
    "use server";
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/admin/login");
  }

  const navItems = [
    { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/admin/projects", icon: FolderKanban, label: "Projects" },
    { href: "/admin/blog", icon: Newspaper, label: "Blog" },
    { href: "/admin/messages", icon: MessageSquare, label: "Messages" },
    { href: "/admin/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <div className="grid min-h-screen md:grid-cols-[220px_1fr]">
      <aside className="hidden w-full max-w-xs flex-col border-r bg-muted/40 md:flex">
        <div className="flex h-14 items-center justify-between border-b px-4 py-3">
          <Link href="/admin" className="font-semibold">
            Admin Panel
          </Link>
        </div>
        <nav className="flex flex-col gap-y-2 p-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
          <form action={handleSignOut} className="mt-auto">
            <Button variant="ghost" className="w-full justify-start">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </form>
        </nav>
      </aside>
      <main className="flex flex-col gap-4 p-4 md:p-6">{children}</main>
    </div>
  );
}