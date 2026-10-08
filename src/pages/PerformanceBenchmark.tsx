import React, { useState, useEffect } from 'react';
import { getBenchmarkResults } from '../services/api';
import { BenchmarkResult } from '../types';
import { LoadingState } from '../components/ui/LoadingState';
import { ErrorState } from '../components/ui/ErrorState';
import { EmptyState } from '../components/ui/EmptyState';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  Cpu,
  Zap,
  TrendingDown,
  DollarSign,
  Gauge,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  Server,
  Calculator,
} from 'lucide-react';

export const PerformanceBenchmark: React.FC = () => {
  const [benchmark, setBenchmark] = useState<BenchmarkResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [framesPerMonth, setFramesPerMonth] = useState<number>(500000);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getBenchmarkResults();
      setBenchmark(data);
    } catch (err: any) {
      console.error('Failed to load benchmarks:', err);
      setError(err?.message || 'Failed to load hardware benchmark telemetry.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return <LoadingState variant="card" count={3} />;
  }

  if (error) {
    return (
      <ErrorState
        title="BENCHMARK TELEMETRY OFFLINE"
        reason={error}
        onRetry={loadData}
      />
    );
  }

  if (!benchmark || !benchmark.x86 || !benchmark.armCool) {
    return (
      <EmptyState
        title="NO BENCHMARK TELEMETRY"
        description="Hardware benchmark comparison data is currently unavailable."
        action={{ label: 'RETRY', onClick: loadData }}
      />
    );
  }

  const { x86, armCool } = benchmark;

  // Derived speedup & improvements
  const speedupRatio = (x86.latencyMs / (armCool.latencyMs || 1)).toFixed(2);
  const throughputExpansionPct = Math.round(
    ((armCool.throughputImgSec - x86.throughputImgSec) / (x86.throughputImgSec || 1)) * 100
  );
  const cpuReductionPct = Math.round(
    ((x86.cpuPct - armCool.cpuPct) / (x86.cpuPct || 1)) * 100
  );
  const costSavingsPct = (
    ((x86.costPer1kImg - armCool.costPer1kImg) / (x86.costPer1kImg || 1)) * 100
  ).toFixed(1);

  // Chart data formatting
  const latencyData = [
    {
      name: 'Inference Latency',
      standard: x86.latencyMs,
      optimized: armCool.latencyMs,
      unit: 'ms/image',
    },
    {
      name: 'CPU Core Utilization',
      standard: x86.cpuPct,
      optimized: armCool.cpuPct,
      unit: '% core load',
    },
  ];

  const throughputData = [
    {
      name: 'Pavement Scan Throughput',
      standard: x86.throughputImgSec,
      optimized: armCool.throughputImgSec,
      unit: 'FPS',
    },
  ];

  // Cost calculations
  const x86Cost = (framesPerMonth / 1000) * x86.costPer1kImg;
  const armCost = (framesPerMonth / 1000) * armCool.costPer1kImg;
  const monthlySavings = x86Cost - armCost;
  const annualSavings = monthlySavings * 12;

  // Metrics comparison breakdown
  const metricsTableRows = [
    {
      metric: 'Inference Latency',
      standard: `${x86.latencyMs} ms`,
      optimized: `${armCool.latencyMs} ms`,
      advantage: `${speedupRatio}x speedup`,
      reason: 'NEON 128-bit SIMD registers & cache-locality kernels.',
    },
    {
      metric: 'Inspection Throughput',
      standard: `${x86.throughputImgSec} FPS`,
      optimized: `${armCool.throughputImgSec} FPS`,
      advantage: `+${throughputExpansionPct}%`,
      reason: 'G-API pipelined asynchronous buffer dispatching.',
    },
    {
      metric: 'CPU Core Load',
      standard: `${x86.cpuPct}%`,
      optimized: `${armCool.cpuPct}%`,
      advantage: `-${cpuReductionPct}%`,
      reason: 'Fused multiply-accumulate & zero-copy memory transfers.',
    },
    {
      metric: 'Cost per 1,000 Images',
      standard: `$${x86.costPer1kImg.toFixed(3)}`,
      optimized: `$${armCool.costPer1kImg.toFixed(3)}`,
      advantage: `-${costSavingsPct}%`,
      reason: 'ARM Graviton3 hourly pricing + 3.42x faster execution.',
    },
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-2">
            HARDWARE ACCELERATION HARNESS // OPENCV 5 COOL
          </div>
          <h1 className="font-sans font-semibold text-4xl sm:text-5xl tracking-tighter leading-[0.9] text-white">
            COOL & Graviton Benchmarks
          </h1>
          <p className="text-slate-400 text-sm mt-3 font-light max-w-2xl font-sans">
            Head-to-head empirical metrics measuring OpenCV 5 + COOL (Computer Vision Optimization & Open-Source Library) kernel execution on AWS Graviton3 (ARM NEON) vs Legacy x86_64 architecture.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.15em] text-slate-400 bg-white/[0.03] border border-white/10 px-4 py-2 rounded-card">
          <Server className="w-3.5 h-3.5 text-slate-400" />
          <span>HARNESS: {benchmark.date || 'October 2026'}</span>
        </div>
      </div>

      {/* KPI Headline Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-6 rounded-card glass-surface border border-white/[0.08] relative overflow-hidden group">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em]">LATENCY SPEEDUP</span>
            <Gauge className="w-4 h-4 text-slate-400" />
          </div>
          <div className="font-sans font-semibold text-4xl text-white">{speedupRatio}x</div>
          <div className="font-mono text-[11px] text-slate-400 mt-2">
            {armCool.latencyMs} ms <span className="text-slate-600">vs {x86.latencyMs} ms on x86</span>
          </div>
        </div>

        <div className="p-6 rounded-card glass-surface border border-white/[0.08] relative overflow-hidden group">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em]">THROUGHPUT EXPANSION</span>
            <Zap className="w-4 h-4 text-slate-400" />
          </div>
          <div className="font-sans font-semibold text-4xl text-white">+{throughputExpansionPct}%</div>
          <div className="font-mono text-[11px] text-slate-400 mt-2">
            {armCool.throughputImgSec} FPS <span className="text-slate-600">vs {x86.throughputImgSec} FPS baseline</span>
          </div>
        </div>

        <div className="p-6 rounded-card glass-surface border border-white/[0.08] relative overflow-hidden group">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em]">CPU CORE LOAD</span>
            <TrendingDown className="w-4 h-4 text-slate-400" />
          </div>
          <div className="font-sans font-semibold text-4xl text-white">-{cpuReductionPct}%</div>
          <div className="font-mono text-[11px] text-slate-400 mt-2">
            {armCool.cpuPct}% <span className="text-slate-600">vs {x86.cpuPct}% core saturation</span>
          </div>
        </div>

        <div className="p-6 rounded-card glass-surface border border-white/[0.08] relative overflow-hidden group">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em]">CLOUD COST EFFICIENCY</span>
            <DollarSign className="w-4 h-4 text-slate-400" />
          </div>
          <div className="font-sans font-semibold text-4xl text-white">{costSavingsPct}%</div>
          <div className="font-mono text-[11px] text-slate-400 mt-2">
            ${armCool.costPer1kImg.toFixed(3)} <span className="text-slate-600">per 1k frames vs ${x86.costPer1kImg.toFixed(3)}</span>
          </div>
        </div>
      </div>

      {/* Visual Chart Grids */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Latency & CPU Load Bar Chart */}
        <div className="p-6 rounded-card glass-surface border border-white/[0.08] space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500 block">
                COMPUTE EFFICIENCY
              </span>
              <h3 className="font-sans font-semibold text-2xl text-white">
                Latency & Core Load Comparison
              </h3>
            </div>
            <span className="font-mono text-[9px] uppercase tracking-[0.15em] px-2.5 py-1 rounded bg-white/[0.04] border border-white/10 text-slate-400">
              LOWER IS BETTER
            </span>
          </div>

          <div className="w-full font-mono text-xs" style={{ height: 288, minHeight: 288 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={latencyData} margin={{ top: 20, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="#94A3B8" tick={{ fill: '#94A3B8', fontSize: 11 }} />
                <YAxis stroke="#94A3B8" tick={{ fill: '#94A3B8', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0c0c0c',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: '8px',
                    color: '#fff',
                    fontFamily: 'monospace',
                  }}
                />
                <Legend
                  wrapperStyle={{ paddingTop: 10, fontFamily: 'monospace', fontSize: 11 }}
                />
                <Bar dataKey="standard" name="Standard x86_64 (Intel)" fill="#525252" radius={[4, 4, 0, 0]} />
                <Bar dataKey="optimized" name="ARM Graviton3 + COOL" fill="#F8FAFC" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="font-sans text-xs text-slate-400 leading-relaxed font-light">
            OpenCV 5 COOL kernels with ARM NEON vectorization reduce processing time from {x86.latencyMs}ms to {armCool.latencyMs}ms per frame, ensuring sustained 60 FPS real-time processing without core thermal throttling.
          </p>
        </div>

        {/* Throughput Bar Chart */}
        <div className="p-6 rounded-card glass-surface border border-white/[0.08] space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500 block">
                PROCESSING CAPACITY
              </span>
              <h3 className="font-sans font-semibold text-2xl text-white">
                Sustained Scan Throughput (FPS)
              </h3>
            </div>
            <span className="font-mono text-[9px] uppercase tracking-[0.15em] px-2.5 py-1 rounded bg-white/[0.04] border border-white/10 text-slate-400">
              HIGHER IS BETTER
            </span>
          </div>

          <div className="w-full font-mono text-xs" style={{ height: 288, minHeight: 288 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={throughputData} margin={{ top: 20, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="#94A3B8" tick={{ fill: '#94A3B8', fontSize: 11 }} />
                <YAxis stroke="#94A3B8" tick={{ fill: '#94A3B8', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0c0c0c',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: '8px',
                    color: '#fff',
                    fontFamily: 'monospace',
                  }}
                />
                <Legend
                  wrapperStyle={{ paddingTop: 10, fontFamily: 'monospace', fontSize: 11 }}
                />
                <Bar dataKey="standard" name="Standard x86_64 (Intel)" fill="#525252" radius={[4, 4, 0, 0]} />
                <Bar dataKey="optimized" name="ARM Graviton3 + COOL" fill="#F8FAFC" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="font-sans text-xs text-slate-400 leading-relaxed font-light">
            Throughput increases from {x86.throughputImgSec} to {armCool.throughputImgSec} frames per second (+{throughputExpansionPct}%). A single Graviton3 instance can simultaneously ingest multiple 4K camera streams in real-time patrol vehicle sweeps.
          </p>
        </div>
      </div>

      {/* Comprehensive Benchmark Table */}
      <div className="rounded-card glass-surface border border-white/[0.08] overflow-hidden">
        <div className="p-6 border-b border-white/[0.08] flex items-center justify-between">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-1">
              SYSTEM LEVEL BREAKDOWN
            </div>
            <h3 className="font-sans font-semibold text-2xl text-white">
              Standard Platform vs Accelerated Stack
            </h3>
          </div>
          <span className="font-mono text-[10px] text-slate-400 uppercase tracking-widest hidden sm:inline">
            4K RES (3840x2160)
          </span>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-white/[0.08] bg-white/[0.01] text-slate-500 text-[9px] uppercase tracking-[0.2em]">
                <th className="py-4 px-6">PERFORMANCE METRIC</th>
                <th className="py-4 px-6">STANDARD x86_64</th>
                <th className="py-4 px-6">ARM GRAVITON3 + COOL</th>
                <th className="py-4 px-6">MEASURED ADVANTAGE</th>
                <th className="py-4 px-6">ARCHITECTURAL REASON</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {(metricsTableRows || []).map((row) => (
                <tr key={row.metric} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-6 font-semibold text-white">
                    {row.metric}
                  </td>
                  <td className="py-4 px-6 text-slate-400">
                    {row.standard}
                  </td>
                  <td className="py-4 px-6 text-white font-bold">
                    {row.optimized}
                  </td>
                  <td className="py-4 px-6 text-slate-200">
                    <span className="px-2 py-0.5 rounded bg-white/[0.08] border border-white/20">
                      {row.advantage}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-slate-400 font-sans text-xs font-light">
                    {row.reason}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card List (below 768px) */}
        <div className="md:hidden divide-y divide-white/[0.06] p-4 space-y-4">
          {(metricsTableRows || []).map((row) => (
            <div key={row.metric} className="pt-3 first:pt-0 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white text-xs">{row.metric}</span>
                <span className="px-2 py-0.5 rounded bg-white/[0.08] border border-white/20 text-slate-200 text-[10px] font-mono">
                  {row.advantage}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 font-mono text-[11px] bg-white/[0.02] p-2 rounded border border-white/[0.04]">
                <div>
                  <span className="block text-[9px] text-slate-500 uppercase tracking-wider">STANDARD x86</span>
                  <span className="text-slate-400">{row.standard}</span>
                </div>
                <div>
                  <span className="block text-[9px] text-slate-500 uppercase tracking-wider">ARM + COOL</span>
                  <span className="text-white font-bold">{row.optimized}</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 font-sans font-light leading-relaxed">
                {row.reason}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Cloud Economics ROI Calculator */}
      <div className="rounded-card glass-surface border border-white/[0.08] p-8 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-white/[0.08]">
          <div>
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-1">
              <Calculator className="w-3.5 h-3.5" />
              <span>MUNICIPAL SAVINGS MODEL</span>
            </div>
            <h3 className="font-sans font-semibold text-2xl text-white">
              Cloud Infrastructure ROI Estimator
            </h3>
          </div>
          <div className="font-mono text-xs text-slate-400">
            BASED ON AWS US-WEST-2 REGION PRICING
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-slate-400">ESTIMATED MONTHLY INSPECTION FRAMES:</span>
            <span className="text-white font-bold text-sm">{framesPerMonth.toLocaleString()} FRAMES</span>
          </div>
          <input
            type="range"
            min={100000}
            max={5000000}
            step={100000}
            value={framesPerMonth}
            onChange={(e) => setFramesPerMonth(Number(e.target.value))}
            className="w-full accent-white h-2 bg-white/10 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-500">
            <span>100K FRAMES (Small Municipality)</span>
            <span>2.5M FRAMES (State Corridor)</span>
            <span>5.0M FRAMES (National Highway Network)</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-white/[0.06]">
          <div className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.06]">
            <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500 block mb-1">
              STANDARD X86_64 COST
            </span>
            <div className="font-sans font-semibold text-2xl text-slate-300">
              ${x86Cost.toFixed(2)} <span className="text-xs font-mono font-normal">/ mo</span>
            </div>
            <span className="font-mono text-[10px] text-slate-500 mt-1 block">
              ${(x86Cost * 12).toFixed(2)} annually
            </span>
          </div>

          <div className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.06]">
            <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500 block mb-1">
              ARM GRAVITON3 + COOL COST
            </span>
            <div className="font-sans font-semibold text-2xl text-white">
              ${armCost.toFixed(2)} <span className="text-xs font-mono font-normal">/ mo</span>
            </div>
            <span className="font-mono text-[10px] text-slate-500 mt-1 block">
              ${(armCost * 12).toFixed(2)} annually
            </span>
          </div>

          <div className="p-4 rounded-lg bg-white/[0.04] border border-white/20">
            <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-400 block mb-1">
              ANNUAL TAXPAYER SAVINGS
            </span>
            <div className="font-sans font-semibold text-2xl text-white">
              ${annualSavings.toFixed(2)}
            </div>
            <span className="font-mono text-[10px] text-emerald-400/80 mt-1 block font-bold">
              {costSavingsPct}% NET OPERATIONAL REDUCTION
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceBenchmark;
