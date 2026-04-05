// app/(main)/layout.tsx
import type { Metadata } from "next";
import Sidebar      from "@/components/layout/Sidebar";
import Navbar       from "@/components/layout/Navbar";
import MobileNav    from "@/components/layout/MobileNav";
import MobilePlayer from "@/components/layout/MobilePlayer";
import AudioProvider from "@/components/player/AudioProvider";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

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

  return (
    <div
      className="
        lg:grid
        lg:grid-cols-[var(--sidebar-width)_1fr]
        h-dvh overflow-hidden
        bg-[var(--bg-base)]
      "
    >
      {/* ✅ Audio engine — mounted once, no UI, runs forever */}
      <AudioProvider />

      <Sidebar />

      <div className="flex flex-col min-h-0 overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto page-content animate-fade-in">
          {children}
        </main>
      </div>

      <MobilePlayer />
      <MobileNav />
    </div>
  );
}