import { createAdminClient } from "@/lib/supabase/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { markRead } from "./actions";

export default async function MessagesPage() {
  const supabase = createAdminClient();
  const { data: messages, error } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching messages:", error);
    return <div>Error loading messages</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Messages</h1>

      <div className="space-y-4">
        {messages?.map((message) => (
          <Card key={message.id}>
            <CardHeader>
              <CardTitle className="text-lg">{message.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{message.email}</p>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{message.message}</p>
              <div className="flex items-center justify-between">
                <span className={`text-xs px-2 py-1 rounded-full ${message.read ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                  {message.read ? "Read" : "Unread"}
                </span>
                {!message.read && (
                  <form action={markRead}>
                    <input type="hidden" name="id" value={message.id} />
                    <Button size="sm">Mark as Read</Button>
                  </form>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}