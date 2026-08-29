// app/(main)/layout.tsx
import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import MainLayoutWrapper from "@/components/layout/MainLayoutWrapper";

export const metadata: Metadata = {
  title:       { default: "Musify", template: "%s · Musify" },
  description: "Your music, everywhere.",
};

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return <MainLayoutWrapper>{children}</MainLayoutWrapper>;
}