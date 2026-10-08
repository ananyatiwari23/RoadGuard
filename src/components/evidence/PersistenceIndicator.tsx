import React from 'react';
import type { FrameEvidenceStatus } from '../../types/evidence';
import { cn } from '../../lib/utils';
import { ShieldCheck, Layers } from 'lucide-react';

export interface PersistenceIndicatorProps {
  count: number;
  total?: number;
  status?: FrameEvidenceStatus;
  showIcon?: boolean;
  className?: string;
}

export const PersistenceIndicator: React.FC<PersistenceIndicatorProps> = ({
  count,
  total = 7,
  status,
  showIcon = true,
  className,
}) => {
  const isSatisfied = count >= 5; // Multi-frame persistence gate

  return (
    <div
      className={cn(
        'inline-flex items-center gap-3 rounded-lg bg-white/[0.03] border border-white/[0.08] px-3 py-1.5 font-mono select-none',
        className
      )}
    >
      {showIcon && (
        <div className="flex items-center text-slate-400">
          {isSatisfied ? (
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 stroke-[2]" />
          ) : (
            <Layers className="w-3.5 h-3.5 text-slate-400 stroke-[1.75]" />
          )}
        </div>
      )}

      {/* Label and Count */}
      <div className="flex items-center gap-1.5 text-xs">
        <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">
          Persistence:
        </span>
        <span className="font-bold text-white tracking-tight">
          {count} / {total}
        </span>
        <span className="text-[10px] text-slate-500">frames</span>
      </div>

      {/* Visual Dot Sequence */}
      <div className="flex items-center gap-1.5 pl-1 border-l border-white/10">
        {Array.from({ length: total }).map((_, idx) => {
          const filled = idx < count;
          return (
            <span
              key={idx}
              title={`Frame ${idx + 1}`}
              className={cn(
                'w-2 h-2 rounded-full transition-all duration-300',
                filled
                  ? isSatisfied
                    ? 'bg-emerald-400 shadow-[0_0_6px_rgba(48,164,108,0.6)]'
                    : 'bg-amber-400 shadow-[0_0_6px_rgba(245,165,36,0.4)]'
                  : 'bg-white/10 border border-white/[0.08]'
              )}
            />
          );
        })}
      </div>

      {status && (
        <span
          className={cn(
            'text-[9px] uppercase px-1.5 py-0.5 rounded font-bold tracking-wider ml-1',
            status === 'CONFIRMED'
              ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
              : status === 'DETECTED'
              ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
              : 'bg-white/[0.04] text-slate-400 border border-white/10'
          )}
        >
          {status}
        </span>
      )}
    </div>
  );
};
