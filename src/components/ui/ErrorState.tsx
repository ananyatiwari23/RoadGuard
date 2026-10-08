import React from 'react';
import { cn } from '../../lib/utils';
import { AlertTriangle, RotateCcw } from 'lucide-react';

export interface ErrorStateProps {
  title?: string;
  reason?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'UNABLE TO COMPLETE OPERATION',
  reason = 'An unexpected system error occurred while processing the agent request.',
  onRetry,
  className,
}) => {
  return (
    <div
      className={cn(
        'rounded-card glass-surface p-8 border border-rose-500/20 bg-rose-500/[0.02] flex flex-col items-center justify-center text-center',
        className
      )}
    >
      <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-4">
        <AlertTriangle className="w-6 h-6 stroke-[1.75]" />
      </div>

      <h4 className="font-mono text-xs uppercase tracking-[0.2em] text-rose-300 mb-2 font-bold">
        {title}
      </h4>

      <p className="text-xs text-slate-400 max-w-md leading-relaxed mb-6 font-mono">
        {reason}
      </p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 rounded text-xs font-mono font-semibold uppercase tracking-[0.1em] border border-white/20 hover:border-white/40 bg-white/[0.04] hover:bg-white/[0.08] text-white flex items-center gap-2 transition-all cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 stroke-[2]" />
          RETRY OPERATION
        </button>
      )}
    </div>
  );
};
