"use client";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import MobileNav from "@/components/layout/MobileNav";
import MobilePlayer from "@/components/layout/MobilePlayer";
import HomePage from "@/pages/home/MobilePlayer";

const page = () => {
   return (
    <div className="flex h-screen bg-background">
      
      {/* Sidebar (Desktop only) */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        
        {/* Top Navbar */}
        <Navbar />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4">
          <h1 className="text-2xl font-bold">Welcome to Musify 🎵</h1>
          <HomePage/>
        </main>

        {/* Mobile Player */}
        <div className="lg:hidden">
          <MobilePlayer />
        </div>
      </div>

      {/* Mobile Bottom Nav */}
      <div className="lg:hidden">
        <MobileNav />
      </div>
    </div>
  );
}

export default page
