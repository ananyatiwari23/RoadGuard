import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';

export const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#080808] text-[#FFFFFF] flex flex-col antialiased selection:bg-white selection:text-black">
      {/* Horizontal Top Navigation */}
      <Navbar />

      {/* Main Content Viewport: Fluid 92vw Width */}
      <main className="flex-1 w-[92vw] mx-auto py-12 md:py-16">
        <Outlet />
      </main>

      {/* Minimal Obsidian Footer */}
      <footer className="w-full border-t border-white/[0.08] py-8 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">
        <div className="w-[92vw] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>ROADGUARD — AUTONOMOUS ROAD INSPECTION SYSTEM</span>
          <span>ARM GRAVITON3 × OPENCV 5 COOL × RDD2022</span>
        </div>
      </footer>
    </div>
  );
};

export default AppLayout;
