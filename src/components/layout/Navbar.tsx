import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useThemeStore } from '../../store/useThemeStore';
import {
  ChevronDown,
  Menu,
  X,
  Sun,
  Moon,
  ArrowUpRight,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useThemeStore();

  const [inspectionsOpen, setInspectionsOpen] = useState(false);
  const [performanceOpen, setPerformanceOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const inspectionsRef = useRef<HTMLDivElement>(null);
  const performanceRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on route change
  useEffect(() => {
    setInspectionsOpen(false);
    setPerformanceOpen(false);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Click outside listener for dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inspectionsRef.current && !inspectionsRef.current.contains(event.target as Node)) {
        setInspectionsOpen(false);
      }
      if (performanceRef.current && !performanceRef.current.contains(event.target as Node)) {
        setPerformanceOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isInspectionsActive =
    location.pathname === '/new' ||
    location.pathname.startsWith('/live') ||
    location.pathname === '/history' ||
    location.pathname.startsWith('/inspection');

  const isPerformanceActive =
    location.pathname === '/performance' || location.pathname === '/evaluation';

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-[#080808]/85 backdrop-blur-2xl border-b border-white/[0.08] transition-colors">
        <div className="w-[92vw] mx-auto py-4 flex items-center justify-between gap-6">
          {/* LEFT: Brand */}
          <NavLink to="/" className="flex items-center gap-3 shrink-0 group">
            <span className="font-mono text-sm tracking-[0.3em] uppercase text-silver-gradient font-bold group-hover:opacity-90 transition-opacity">
              ROADGUARD
            </span>
          </NavLink>

          {/* CENTER: Desktop Nav Links (hidden below 900px) */}
          <nav className="hidden min-[900px]:flex items-center gap-8">
            {/* Dashboard Link */}
            <NavLink
              to="/"
              className={({ isActive }) =>
                `font-mono text-[11px] uppercase tracking-[0.2em] transition-colors relative py-1 ${
                  isActive ? 'text-white' : 'text-slate-400 hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span>Dashboard</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[1px] bg-silver-gradient" />
                  )}
                </>
              )}
            </NavLink>

            {/* Inspections Dropdown */}
            <div className="relative" ref={inspectionsRef}>
              <button
                type="button"
                onClick={() => {
                  setInspectionsOpen(!inspectionsOpen);
                  setPerformanceOpen(false);
                }}
                className={`font-mono text-[11px] uppercase tracking-[0.2em] transition-colors flex items-center gap-1.5 py-1 ${
                  isInspectionsActive ? 'text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>Inspections</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 stroke-[1.5] ${
                    inspectionsOpen ? 'rotate-180' : ''
                  }`}
                />
                {isInspectionsActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[1px] bg-silver-gradient" />
                )}
              </button>

              {/* Dropdown Menu */}
              {inspectionsOpen && (
                <div className="absolute top-full left-0 mt-3 w-56 p-2 rounded-card glass-dropdown shadow-2xl animate-in fade-in zoom-in-95 duration-150 z-50">
                  <NavLink
                    to="/new"
                    className="block px-3 py-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/[0.04] transition-colors"
                  >
                    <div className="font-mono text-[11px] uppercase tracking-[0.2em]">New Inspection</div>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">Upload image or video</div>
                  </NavLink>
                  <NavLink
                    to="/live/INSP-2026-0881"
                    className="block px-3 py-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/[0.04] transition-colors"
                  >
                    <div className="font-mono text-[11px] uppercase tracking-[0.2em] flex items-center justify-between">
                      <span>Live Inspection</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded border border-white/20 text-slate-300">DEMO</span>
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">Real-time agent driver</div>
                  </NavLink>
                  <NavLink
                    to="/history"
                    className="block px-3 py-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/[0.04] transition-colors"
                  >
                    <div className="font-mono text-[11px] uppercase tracking-[0.2em]">Inspection History</div>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">Archive & search log</div>
                  </NavLink>
                </div>
              )}
            </div>

            {/* Reports Link */}
            <NavLink
              to="/reports"
              className={({ isActive }) =>
                `font-mono text-[11px] uppercase tracking-[0.2em] transition-colors relative py-1 ${
                  isActive ? 'text-white' : 'text-slate-400 hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span>Reports</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[1px] bg-silver-gradient" />
                  )}
                </>
              )}
            </NavLink>

            {/* Performance Dropdown */}
            <div className="relative" ref={performanceRef}>
              <button
                type="button"
                onClick={() => {
                  setPerformanceOpen(!performanceOpen);
                  setInspectionsOpen(false);
                }}
                className={`font-mono text-[11px] uppercase tracking-[0.2em] transition-colors flex items-center gap-1.5 py-1 ${
                  isPerformanceActive ? 'text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>Performance</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 stroke-[1.5] ${
                    performanceOpen ? 'rotate-180' : ''
                  }`}
                />
                {isPerformanceActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[1px] bg-silver-gradient" />
                )}
              </button>

              {/* Dropdown Menu */}
              {performanceOpen && (
                <div className="absolute top-full left-0 mt-3 w-56 p-2 rounded-card glass-dropdown shadow-2xl animate-in fade-in zoom-in-95 duration-150 z-50">
                  <NavLink
                    to="/performance"
                    className="block px-3 py-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/[0.04] transition-colors"
                  >
                    <div className="font-mono text-[11px] uppercase tracking-[0.2em]">COOL Benchmark</div>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">ARM Graviton vs x86</div>
                  </NavLink>
                  <NavLink
                    to="/evaluation"
                    className="block px-3 py-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/[0.04] transition-colors"
                  >
                    <div className="font-mono text-[11px] uppercase tracking-[0.2em]">Model Evaluation</div>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">RDD2022 confusion matrix</div>
                  </NavLink>
                </div>
              )}
            </div>

            {/* Architecture Link */}
            <NavLink
              to="/architecture"
              className={({ isActive }) =>
                `font-mono text-[11px] uppercase tracking-[0.2em] transition-colors relative py-1 ${
                  isActive ? 'text-white' : 'text-slate-400 hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span>Architecture</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[1px] bg-silver-gradient" />
                  )}
                </>
              )}
            </NavLink>
          </nav>

          {/* RIGHT: Header widgets & CTA */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              title={isDark ? 'Switch to Light' : 'Switch to Dark'}
              className="p-2 rounded-card border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.06] text-slate-300 hover:text-white transition-colors"
            >
              {isDark ? (
                <Sun className="w-4 h-4 stroke-[1.5]" />
              ) : (
                <Moon className="w-4 h-4 stroke-[1.5]" />
              )}
            </button>

            {/* Primary CTA (Desktop) */}
            <button
              type="button"
              onClick={() => navigate('/new')}
              className="hidden min-[900px]:inline-flex items-center gap-2 px-4 py-2 rounded-card btn-silver font-mono text-[11px] font-bold uppercase tracking-[0.2em]"
            >
              <span>NEW INSPECTION</span>
              <ArrowUpRight className="w-3.5 h-3.5 stroke-[2]" />
            </button>

            {/* Mobile Menu Hamburger (Below 900px) */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="min-[900px]:hidden p-2 rounded-card border border-white/[0.08] bg-white/[0.02] text-slate-300 hover:text-white"
            >
              <Menu className="w-5 h-5 stroke-[1.5]" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Full-Screen Frosted Glass Overlay (Below 900px) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-[#080808]/95 backdrop-blur-3xl flex flex-col justify-between p-8 animate-in fade-in duration-200">
          {/* Mobile Overlay Header */}
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-6">
            <span className="font-mono text-xs tracking-[0.3em] uppercase text-silver-gradient font-bold">
              ROADGUARD NAVIGATION
            </span>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-card border border-white/[0.08] text-slate-400 hover:text-white"
            >
              <X className="w-6 h-6 stroke-[1.5]" />
            </button>
          </div>

          {/* All 8 Route Links */}
          <div className="flex-1 flex flex-col justify-center space-y-6 py-8 font-mono uppercase tracking-[0.2em]">
            <NavLink
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base text-slate-300 hover:text-white hover:translate-x-1 transition-transform"
            >
              01 — DASHBOARD
            </NavLink>
            <NavLink
              to="/new"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base text-slate-300 hover:text-white hover:translate-x-1 transition-transform"
            >
              02 — NEW INSPECTION
            </NavLink>
            <NavLink
              to="/live/INSP-2026-0881"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base text-slate-300 hover:text-white hover:translate-x-1 transition-transform"
            >
              03 — LIVE INSPECTION (DEMO)
            </NavLink>
            <NavLink
              to="/history"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base text-slate-300 hover:text-white hover:translate-x-1 transition-transform"
            >
              04 — INSPECTION HISTORY
            </NavLink>
            <NavLink
              to="/reports"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base text-slate-300 hover:text-white hover:translate-x-1 transition-transform"
            >
              05 — MAINTENANCE REPORTS
            </NavLink>
            <NavLink
              to="/performance"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base text-slate-300 hover:text-white hover:translate-x-1 transition-transform"
            >
              06 — COOL BENCHMARK
            </NavLink>
            <NavLink
              to="/evaluation"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base text-slate-300 hover:text-white hover:translate-x-1 transition-transform"
            >
              07 — MODEL EVALUATION
            </NavLink>
            <NavLink
              to="/architecture"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base text-slate-300 hover:text-white hover:translate-x-1 transition-transform"
            >
              08 — SYSTEM ARCHITECTURE
            </NavLink>
          </div>

          {/* Mobile Overlay Footer */}
          <div className="border-t border-white/[0.08] pt-6 flex items-center justify-between font-mono text-[10px] text-slate-500 uppercase tracking-[0.2em]">
            <span>SYSTEM ONLINE</span>
            <span>OPENCV 5 + COOL</span>
          </div>
        </div>
      )}
    </>
  );
};
