import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  getInspectionHistory,
  getModelEvaluation,
  getAgentState,
} from '../services/api';
import type { InspectionSummary } from '../types/inspection';
import type { ModelEvaluation } from '../types/evaluation';
import type { AgentEvent } from '../types/agent';
import { MetricCard } from '../components/ui/MetricCard';
import { StatusBadge } from '../components/ui/StatusBadge';
import { SeverityBadge } from '../components/ui/SeverityBadge';
import { DamageClassChip } from '../components/ui/DamageClassChip';
import { ConfidenceBar } from '../components/ui/ConfidenceBar';
import { LoadingState } from '../components/ui/LoadingState';
import { EmptyState } from '../components/ui/EmptyState';
import { ErrorState } from '../components/ui/ErrorState';
import { EventLog } from '../components/agent/EventLog';
import {
  Activity,
  AlertTriangle,
  Clock,
  Target,
  FileText,
  ArrowRight,
  ArrowUpRight,
  Play,
  Plus,
  Image as ImageIcon,
  Video,
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const [inspections, setInspections] = useState<InspectionSummary[]>([]);
  const [modelEval, setModelEval] = useState<ModelEvaluation | null>(null);
  const [agentEvents, setAgentEvents] = useState<AgentEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all dashboard telemetry
  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [history, evaluation, agentState] = await Promise.all([
        getInspectionHistory(),
        getModelEvaluation(),
        getAgentState('RG-0001'),
      ]);

      setInspections(history);
      setModelEval(evaluation);

      // Order newest events first (~8 latest)
      const sortedEvents = [...agentState.events].reverse().slice(0, 8);
      setAgentEvents(sortedEvents);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to retrieve telemetry data.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Periodic refresh for agent activity feed every 10 seconds
  useEffect(() => {
    const timer = window.setInterval(async () => {
      try {
        const agentState = await getAgentState('RG-0001');
        const sortedEvents = [...agentState.events].reverse().slice(0, 8);
        setAgentEvents(sortedEvents);
      } catch {
        // Silently continue polling
      }
    }, 10000);

    return () => clearInterval(timer);
  }, []);

  if (loading) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="h-40 rounded-card glass-surface border border-white/[0.08] animate-pulse" />
        <LoadingState variant="card" count={5} />
        <LoadingState variant="table" count={6} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ErrorState
          title="COMMAND TELEMETRY OFFLINE"
          reason={error}
          onRetry={loadDashboardData}
        />
      </div>
    );
  }

  // Derive real KPI metrics from API results only
  const totalInspections = inspections.length;
  const activeInspections = inspections.filter(
    (i) => !['APPROVED', 'REJECTED', 'CLOSED'].includes(i.status)
  ).length;
  const highSeverityIssues = inspections.filter(
    (i) => i.severity === 'HIGH' && i.status !== 'CLOSED'
  ).length;
  const reportsPending = inspections.filter(
    (i) => i.status === 'WAITING_FOR_APPROVAL'
  ).length;
  const accuracyPct = modelEval ? `${modelEval.mAP.toFixed(1)}%` : '—';

  // 8 latest inspections sorted desc by createdAt
  const recentInspections = [...inspections]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 8);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* 1. HERO BAND — Compact, max-height ~40vh, prevents pushing KPIs below fold on 1080p */}
      <section className="relative rounded-card glass-surface p-6 sm:p-8 border border-white/[0.08] overflow-hidden">
        {/* Subtle ambient lighting */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/[0.015] rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl space-y-3 relative z-10">
          {/* Mono label */}
          <div className="inline-flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-400 font-semibold">
              AGENTIC ROAD INSPECTION
            </span>
          </div>

          {/* Headline (Geist Sans 500-600, ~48px, normal style, letter-spacing -0.02em, line-height 1.05) */}
          <h1 className="font-sans font-semibold text-3xl sm:text-4xl lg:text-[46px] text-white tracking-[-0.02em] leading-[1.05]">
            Autonomous road-inspection system.
          </h1>

          {/* One-line subhead */}
          <p className="font-sans text-sm sm:text-base text-slate-400 font-normal leading-snug">
            Multi-frame verification for pavement distress.
          </p>

          {/* CTAs */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate('/new')}
              className="btn-silver px-5 py-2.5 rounded font-mono text-xs font-semibold uppercase tracking-[0.15em] flex items-center gap-2 cursor-pointer shadow-lg hover:shadow-white/10 transition-all"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>NEW INSPECTION</span>
            </button>

            <button
              onClick={() => navigate('/live/RG-0001')}
              className="px-5 py-2.5 rounded border border-white/20 hover:border-white/40 bg-white/[0.03] hover:bg-white/[0.08] text-white font-mono text-xs font-semibold uppercase tracking-[0.15em] flex items-center gap-2 cursor-pointer transition-all"
            >
              <Play className="w-3.5 h-3.5 stroke-[2]" />
              <span>VIEW LIVE DEMO</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. KPI ROW — 5 MetricCards in responsive grid (2 cols mobile / 3 cols tablet / 5 cols desktop) */}
      <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <MetricCard
          label="Total Inspections"
          value={totalInspections}
          icon={FileText}
        />
        <MetricCard
          label="Active Inspections"
          value={activeInspections}
          icon={Activity}
          delta={
            activeInspections > 0
              ? { value: `${activeInspections} in pipeline`, neutral: true }
              : undefined
          }
        />
        <MetricCard
          label="High Severity Issues"
          value={highSeverityIssues}
          icon={AlertTriangle}
          delta={
            highSeverityIssues > 0
              ? { value: 'Requires human review', positive: false }
              : undefined
          }
        />
        <MetricCard
          label="Reports Pending"
          value={reportsPending}
          icon={Clock}
          delta={
            reportsPending > 0
              ? { value: `${reportsPending} awaiting`, neutral: true }
              : undefined
          }
        />
        <MetricCard
          label="Detection Accuracy"
          value={accuracyPct}
          description="sample data"
          icon={Target}
        />
      </section>

      {/* 3. TWO-COLUMN SECTION (2/3 + 1/3 on desktop, stacked on mobile) */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* LEFT (2/3) — Recent Inspections Table */}
        <div className="lg:col-span-2 rounded-card glass-surface border border-white/[0.08] p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/[0.06]">
            <div>
              <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-white font-bold">
                Recent Inspections
              </h2>
              <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                8 latest autonomous inspection passes sorted by creation time
              </p>
            </div>
            <Link
              to="/history"
              className="font-mono text-[11px] text-slate-400 hover:text-white uppercase tracking-wider flex items-center gap-1 transition-colors"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {recentInspections.length === 0 ? (
            <EmptyState
              title="NO INSPECTIONS RECORDED"
              description="Initiate an automated survey to populate pavement telemetry data."
              action={{
                label: "START INSPECTION",
                onClick: () => navigate('/new'),
              }}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/[0.06] text-[10px] font-mono uppercase tracking-[0.15em] text-slate-500">
                    <th className="py-2.5 px-3">ID</th>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Damage</th>
                    <th className="py-2.5 px-3">Severity</th>
                    <th className="py-2.5 px-3 min-w-[120px]">Confidence</th>
                    <th className="py-2.5 px-3">Frames</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-2 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.03]">
                  {recentInspections.map((insp) => (
                    <tr
                      key={insp.id}
                      onClick={() => navigate(`/inspection/${insp.id}`)}
                      className="group hover:bg-white/[0.03] transition-colors cursor-pointer text-xs font-mono"
                    >
                      {/* ID */}
                      <td className="py-3 px-3 font-bold text-white group-hover:text-silver-gradient transition-colors">
                        {insp.id}
                      </td>

                      {/* Date */}
                      <td className="py-3 px-3 text-slate-400 text-[11px]">
                        {new Date(insp.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>

                      {/* Damage */}
                      <td className="py-3 px-3">
                        <DamageClassChip damageClass={insp.damageClass} size="sm" />
                      </td>

                      {/* Severity */}
                      <td className="py-3 px-3">
                        <SeverityBadge severity={insp.severity} size="sm" />
                      </td>

                      {/* Confidence */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <ConfidenceBar
                            confidence={insp.confidence}
                            size="sm"
                            showLabel={false}
                          />
                          <span className="text-[10px] text-slate-300 w-8 text-right shrink-0">
                            {insp.confidence}%
                          </span>
                        </div>
                      </td>

                      {/* Frames Checked */}
                      <td className="py-3 px-3 text-slate-400 text-[11px]">
                        {insp.framesChecked}f
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3">
                        <StatusBadge status={insp.status} size="sm" />
                      </td>

                      {/* Action Arrow */}
                      <td className="py-3 px-2 text-right">
                        <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white transition-colors ml-auto" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* RIGHT (1/3) — Recent Agent Activity */}
        <div className="lg:col-span-1 flex flex-col gap-3">
          <EventLog
            events={agentEvents}
            title="RECENT AGENT ACTIVITY"
            maxHeight="max-h-[460px]"
            autoScroll={false}
          />
        </div>
      </section>

      {/* 4. QUICK ACTIONS ROW */}
      <section className="rounded-card glass-surface p-5 border border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500 block mb-1">
            RAPID WORKFLOW DISPATCH
          </span>
          <h3 className="font-sans font-semibold text-sm text-white">
            Quick Inspection Actions
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => navigate('/new?type=image')}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 text-white font-mono text-xs font-medium uppercase tracking-[0.1em] flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <ImageIcon className="w-3.5 h-3.5 text-slate-400" />
            <span>New Image Inspection</span>
          </button>

          <button
            onClick={() => navigate('/new?type=video')}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 text-white font-mono text-xs font-medium uppercase tracking-[0.1em] flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Video className="w-3.5 h-3.5 text-slate-400" />
            <span>New Video Inspection</span>
          </button>

          <button
            onClick={() => navigate('/history')}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 text-white font-mono text-xs font-medium uppercase tracking-[0.1em] flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <span>View All Inspections</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
