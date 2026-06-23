"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    const form = e.currentTarget;
    const data = new FormData(form);

    const res = await fetch("/api/contact", {
      method: "POST",
      body: JSON.stringify({
        name: data.get("name"),
        email: data.get("email"),
        message: data.get("message"),
      }),
      headers: { "Content-Type": "application/json" },
    });

    setSending(false);
    if (res.ok) {
      setSent(true);
      form.reset();
    }
  }

  if (sent) {
    return <p className="text-green-600">Thanks! Your message has been sent.</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          name="name"
          placeholder="Name"
          required
          className="px-3 py-2 border rounded-md bg-background"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          className="px-3 py-2 border rounded-md bg-background"
        />
      </div>
      <textarea
        name="message"
        placeholder="Message"
        required
        className="w-full px-3 py-2 border rounded-md bg-background"
        rows={5}
      />
      <Button type="submit" disabled={sending}>
        {sending ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}