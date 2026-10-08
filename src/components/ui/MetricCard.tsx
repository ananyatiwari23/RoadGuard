import React from 'react';
import { cn } from '../../lib/utils';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

export interface MetricCardProps {
  label: string;
  value: string | number;
  delta?: {
    value: string | number;
    positive?: boolean;
    neutral?: boolean;
  };
  icon?: React.ComponentType<{ className?: string }>;
  description?: string;
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  delta,
  icon: Icon,
  description,
  className,
}) => {
  return (
    <div
      className={cn(
        'rounded-card glass-surface p-5 flex flex-col justify-between transition-all duration-300 hover:border-white/20 relative overflow-hidden group',
        className
      )}
    >
      {/* Background glow accent */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-white/[0.015] rounded-full blur-2xl pointer-events-none group-hover:bg-white/[0.03] transition-colors" />

      {/* Header with label + icon */}
      <div className="flex items-center justify-between mb-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-400">
          {label}
        </span>
        {Icon && (
          <div className="w-7 h-7 rounded-lg bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-slate-400 group-hover:text-slate-200 transition-colors">
            <Icon className="w-3.5 h-3.5 stroke-[1.75]" />
          </div>
        )}
      </div>

      {/* Value */}
      <div className="flex items-baseline gap-2 mb-1">
        <div className="font-mono text-2xl font-bold tracking-tight text-white">
          {value}
        </div>
      </div>

      {/* Delta and description footer */}
      {(delta || description) && (
        <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/[0.04]">
          {delta && (
            <span
              className={cn(
                'inline-flex items-center gap-0.5 font-mono text-[11px] font-semibold rounded px-1.5 py-0.5',
                delta.neutral
                  ? 'text-slate-400 bg-white/[0.04]'
                  : delta.positive
                  ? 'text-emerald-400 bg-emerald-500/10'
                  : 'text-rose-400 bg-rose-500/10'
              )}
            >
              {delta.neutral ? (
                <Minus className="w-3 h-3" />
              ) : delta.positive ? (
                <ArrowUpRight className="w-3 h-3" />
              ) : (
                <ArrowDownRight className="w-3 h-3" />
              )}
              {delta.value}
            </span>
          )}
          {description && (
            <span className="text-[11px] text-slate-500 line-clamp-1">{description}</span>
          )}
        </div>
      )}
    </div>
  );
};
