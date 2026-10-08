import React from 'react';
import { cn } from '../../lib/utils';

export interface LoadingStateProps {
  variant?: 'card' | 'table' | 'list';
  count?: number;
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  variant = 'card',
  count = 3,
  className,
}) => {
  const items = Array.from({ length: count });

  if (variant === 'card') {
    return (
      <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4', className)}>
        {items.map((_, i) => (
          <div
            key={i}
            className="rounded-card glass-surface p-5 space-y-4 border border-white/[0.08] animate-pulse"
          >
            <div className="flex items-center justify-between">
              <div className="h-4 w-24 bg-white/10 rounded" />
              <div className="h-5 w-16 bg-white/10 rounded-full" />
            </div>
            <div className="space-y-2">
              <div className="h-6 w-3/4 bg-white/15 rounded" />
              <div className="h-3 w-1/2 bg-white/5 rounded" />
            </div>
            <div className="pt-3 border-t border-white/[0.04] flex items-center justify-between">
              <div className="h-3 w-20 bg-white/10 rounded" />
              <div className="h-3 w-14 bg-white/10 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'table') {
    return (
      <div className={cn('rounded-card glass-surface overflow-hidden border border-white/[0.08]', className)}>
        {/* Header skeleton */}
        <div className="px-6 py-4 border-b border-white/[0.08] bg-white/[0.02] flex items-center justify-between">
          <div className="h-4 w-32 bg-white/15 rounded" />
          <div className="h-4 w-20 bg-white/10 rounded" />
        </div>
        {/* Rows */}
        <div className="divide-y divide-white/[0.04]">
          {items.map((_, i) => (
            <div key={i} className="px-6 py-4.5 flex items-center justify-between animate-pulse">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded bg-white/10" />
                <div className="space-y-1.5">
                  <div className="h-4 w-40 bg-white/15 rounded" />
                  <div className="h-3 w-24 bg-white/5 rounded" />
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="h-5 w-20 bg-white/10 rounded" />
                <div className="h-5 w-16 bg-white/10 rounded" />
                <div className="h-4 w-12 bg-white/5 rounded hidden md:block" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 'list' variant
  return (
    <div className={cn('space-y-3', className)}>
      {items.map((_, i) => (
        <div
          key={i}
          className="rounded-lg glass-surface p-4 flex items-center justify-between border border-white/[0.06] animate-pulse"
        >
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-white/10" />
            <div className="space-y-1">
              <div className="h-3.5 w-48 bg-white/15 rounded" />
              <div className="h-2.5 w-28 bg-white/5 rounded" />
            </div>
          </div>
          <div className="h-4 w-16 bg-white/10 rounded" />
        </div>
      ))}
    </div>
  );
};
