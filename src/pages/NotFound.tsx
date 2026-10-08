import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-[72vh] flex items-center justify-center py-12 px-4 animate-in fade-in duration-500">
      <div className="relative max-w-xl w-full p-8 md:p-12 rounded-card glass-surface border border-white/[0.08] shadow-2xl flex flex-col items-center text-center">
        {/* Subtle Ambient Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 bg-white/[0.02] blur-3xl pointer-events-none" />

        {/* Decorative Icon */}
        <div className="w-16 h-16 rounded-full border border-white/10 bg-white/[0.02] flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(255,255,255,0.03)]">
          <Compass className="w-8 h-8 text-slate-300 stroke-[1.5]" />
        </div>

        {/* Mono Label */}
        <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-slate-400 mb-3 px-3 py-1 rounded-full border border-white/[0.06] bg-white/[0.02]">
          404 // ROUTE ANOMALY
        </div>

        {/* Headline */}
        <h1 className="font-sans font-semibold text-4xl sm:text-5xl text-white tracking-tighter leading-tight mb-4">
          Sector not found.
        </h1>

        {/* Subhead */}
        <p className="text-slate-400 text-sm font-light max-w-md mx-auto leading-relaxed mb-8">
          The requested roadway telemetry coordinate, inspection run, or sector log does not exist within the active patrol grid.
        </p>

        {/* Two CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
          <Link
            to="/"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-card silver-gradient-bg text-black font-mono text-[11px] font-bold uppercase tracking-[0.2em] hover:opacity-90 shadow-[0_0_20px_rgba(255,255,255,0.15)] transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5 stroke-[2.5]" />
            RETURN TO DASHBOARD
          </Link>
          <Link
            to="/history"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-card border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] text-white font-mono text-[11px] uppercase tracking-[0.2em] transition-all"
          >
            VIEW ALL INSPECTIONS
          </Link>
        </div>

        {/* Technical Footer */}
        <div className="mt-8 pt-6 border-t border-white/[0.06] flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.15em] text-slate-500 w-full">
          <span>GRID: LAT 34.0522° N // LON 118.2437° W</span>
          <span>STATUS: UNMAPPED ROUTE</span>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
