import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Enamul Hasan Rana | Portfolio",
  description: "Web Developer, App Developer, Digital Marketer, and AI Automation learner from Dhaka, Bangladesh.",
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}