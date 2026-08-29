"use client";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import MobileNav from "./MobileNav";
import AudioProvider from "@/components/player/AudioProvider";
import RightPlayerSidebar from "./RightPlayerSidebar";
import GlobalPlayerBar from "@/components/player/GlobalPlayerBar";
import { usePlayerStore } from "@/store/playerStore";

export default function MainLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { currentTrack, isQueueOpen } = usePlayerStore();

  return (
    <div className="flex h-dvh overflow-hidden bg-[var(--bg-base)] w-full relative">
      {/* Audio engine — mounted once */}
      <AudioProvider />

      {/* Left Sidebar */}
      <Sidebar />

      {/* Center Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative">
        <Navbar />
        <main
          className={`flex-1 overflow-y-auto page-content animate-fade-in transition-all ${
            currentTrack && !isQueueOpen ? "pb-24 lg:pb-24" : "pb-16 lg:pb-6"
          }`}
        >
          {children}
        </main>
      </div>

      {/* Right Sidebar — opens when user plays music or toggles queue */}
      <RightPlayerSidebar />

      {/* Floating Bottom Player Bar */}
      <GlobalPlayerBar />

      <MobileNav />
    </div>
  );
}
