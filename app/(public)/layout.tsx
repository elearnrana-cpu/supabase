import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rana's Portfolio",
  description: "Personal portfolio showcasing projects and skills",
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}