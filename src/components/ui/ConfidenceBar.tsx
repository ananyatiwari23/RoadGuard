import React from 'react';
import { cn } from '../../lib/utils';

export interface ConfidenceBarProps {
  confidence: number; // 0 to 100
  threshold?: number; // default 75
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const HEIGHT_STYLES = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-3.5',
};

export const ConfidenceBar: React.FC<ConfidenceBarProps> = ({
  confidence,
  threshold = 75,
  showLabel = true,
  size = 'md',
  className,
}) => {
  const clamped = Math.max(0, Math.min(100, Math.round(confidence)));
  const isAboveThreshold = clamped >= threshold;

  return (
    <div className={cn('w-full flex flex-col gap-1.5', className)}>
      {showLabel && (
        <div className="flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-1.5 text-slate-400">
            <span className="text-[10px] uppercase tracking-[0.15em]">Confidence</span>
            <span className="text-[10px] text-slate-500">(Gate: {threshold}%)</span>
          </div>
          <div className="flex items-center gap-1">
            <span
              className={cn(
                'font-bold tracking-tight',
                isAboveThreshold ? 'text-emerald-400' : 'text-amber-400'
              )}
            >
              {clamped}%
            </span>
          </div>
        </div>
      )}

      {/* Progress track */}
      <div
        className={cn(
          'w-full bg-[#121212] border border-white/[0.08] rounded-full overflow-hidden relative',
          HEIGHT_STYLES[size]
        )}
      >
        {/* 75% Threshold indicator line */}
        <div
          className="absolute top-0 bottom-0 w-[2px] bg-white/30 z-10 pointer-events-none"
          style={{ left: `${threshold}%` }}
          title={`Autonomous Gate: ${threshold}%`}
        />

        {/* Animated fill */}
        <div
          className={cn(
            'h-full rounded-full transition-all duration-700 ease-out relative',
            isAboveThreshold
              ? 'bg-gradient-to-r from-emerald-500/80 to-emerald-400 shadow-[0_0_12px_rgba(48,164,108,0.4)]'
              : 'bg-gradient-to-r from-amber-600/80 to-amber-400 shadow-[0_0_12px_rgba(245,165,36,0.3)]'
          )}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};
