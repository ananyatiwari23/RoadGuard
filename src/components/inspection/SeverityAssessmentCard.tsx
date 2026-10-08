import React from 'react';
import type { Severity } from '../../types/inspection';
import { SeverityBadge } from '../ui/SeverityBadge';
import { ConfidenceBar } from '../ui/ConfidenceBar';
import { PersistenceIndicator } from '../evidence/PersistenceIndicator';
import { cn } from '../../lib/utils';
import { AlertCircle, MapPin, Ruler, Navigation, Wrench } from 'lucide-react';

export interface SeverityAssessmentCardProps {
  damageType: string;
  confidence: number;
  severity: Severity;
  roadPosition: string;
  persistenceFrames: number;
  damageSize?: string;
  lane?: string;
  recommendation: string;
  className?: string;
}

export const SeverityAssessmentCard: React.FC<SeverityAssessmentCardProps> = ({
  damageType,
  confidence,
  severity,
  roadPosition,
  persistenceFrames,
  damageSize,
  lane,
  recommendation,
  className,
}) => {
  return (
    <div
      className={cn(
        'rounded-card glass-surface p-6 border border-white/[0.08] flex flex-col gap-5',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.08]">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-400 stroke-[1.75]" />
          <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-white font-bold">
            Autonomous Severity Assessment
          </h3>
        </div>
        <SeverityBadge severity={severity} size="sm" showIcon />
      </div>

      {/* Main Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Damage Type & Size */}
        <div className="rounded-lg bg-white/[0.02] border border-white/[0.05] p-3.5 space-y-1.5">
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
            Detected Anomaly
          </div>
          <div className="text-sm font-bold text-white font-mono">{damageType}</div>
          {damageSize && (
            <div className="flex items-center gap-1.5 text-xs text-slate-300 font-mono pt-1">
              <Ruler className="w-3.5 h-3.5 text-slate-500" />
              <span>Aperture: {damageSize}</span>
            </div>
          )}
        </div>

        {/* Location & Lane */}
        <div className="rounded-lg bg-white/[0.02] border border-white/[0.05] p-3.5 space-y-1.5">
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
            Road Position
          </div>
          <div className="flex items-start gap-1.5 text-xs text-slate-200 font-mono">
            <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
            <span className="leading-snug">{roadPosition}</span>
          </div>
          {lane && (
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono pt-1">
              <Navigation className="w-3 h-3 text-slate-500" />
              <span>{lane}</span>
            </div>
          )}
        </div>
      </div>

      {/* Metrics Row: Confidence + Persistence */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        <div className="rounded-lg bg-white/[0.02] border border-white/[0.05] p-3.5">
          <ConfidenceBar confidence={confidence} size="sm" />
        </div>
        <div className="flex items-center justify-start md:justify-end">
          <PersistenceIndicator count={persistenceFrames} total={7} />
        </div>
      </div>

      {/* Maintenance Recommendation Banner */}
      <div className="rounded-lg bg-white/[0.03] border border-white/[0.08] p-4 flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-white/[0.05] border border-white/10 flex items-center justify-center text-slate-300 shrink-0 mt-0.5">
          <Wrench className="w-4 h-4 stroke-[1.75]" />
        </div>
        <div className="space-y-1">
          <div className="font-mono text-[10px] uppercase tracking-wider text-slate-400 font-bold">
            Actionable Recommendation
          </div>
          <p className="text-xs text-slate-200 font-sans leading-relaxed">
            {recommendation}
          </p>
        </div>
      </div>
    </div>
  );
};
