import React from 'react';
import type { AgentState } from '../../types/agent';
import { cn } from '../../lib/utils';
import { StatusBadge } from '../ui/StatusBadge';
import { ConfidenceBar } from '../ui/ConfidenceBar';
import { Bot, Cpu, Sparkles } from 'lucide-react';

export interface AgentDecisionCardProps {
  state: AgentState;
  confidence?: number;
  className?: string;
}

export const AgentDecisionCard: React.FC<AgentDecisionCardProps> = ({
  state,
  confidence,
  className,
}) => {
  // Find latest reasoning event
  const latestEvent = state.events.length > 0 ? state.events[state.events.length - 1] : null;

  return (
    <div
      className={cn(
        'rounded-card glass-surface p-6 border border-white/[0.08] relative overflow-hidden',
        className
      )}
    >
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-white/[0.02] rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white/[0.05] border border-white/10 flex items-center justify-center text-slate-200">
            <Bot className="w-4 h-4 stroke-[1.75]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs uppercase tracking-[0.15em] text-white font-bold">
                Agent Decision Matrix
              </span>
              <span className="text-[10px] font-mono text-slate-500">
                #{state.inspectionId}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
              <Cpu className="w-3 h-3 text-slate-500" />
              <span>ARM NEON Pipeline</span>
            </div>
          </div>
        </div>

        <StatusBadge status={state.status} size="sm" />
      </div>

      {/* Main details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Current Stage */}
        <div className="rounded-lg bg-white/[0.02] border border-white/[0.05] p-3">
          <div className="font-mono text-[10px] uppercase tracking-wider text-slate-400 mb-1">
            Current Stage
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-sm font-bold text-white tracking-wide">
              {state.currentStage}
            </span>
          </div>
        </div>

        {/* Confidence metric */}
        {confidence !== undefined && (
          <div className="rounded-lg bg-white/[0.02] border border-white/[0.05] p-3 flex flex-col justify-center">
            <ConfidenceBar confidence={confidence} size="sm" />
          </div>
        )}
      </div>

      {/* Latest Agent Reasoning Quote */}
      <div className="rounded-lg bg-white/[0.03] border border-white/[0.08] p-3.5 relative">
        <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">
          <Sparkles className="w-3 h-3 text-amber-300" />
          <span>Latest Autonomous Reasoning</span>
        </div>

        {latestEvent ? (
          <div className="space-y-1">
            <p className="text-xs text-slate-200 font-sans leading-relaxed">
              "{latestEvent.message}"
            </p>
            <div className="flex items-center gap-2 pt-1 font-mono text-[9px] text-slate-500">
              <span>Timestamp: {latestEvent.timestamp}</span>
              <span>•</span>
              <span className="uppercase">Level: {latestEvent.level}</span>
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-500 italic font-mono">
            Awaiting agent evaluation step...
          </p>
        )}
      </div>
    </div>
  );
};
