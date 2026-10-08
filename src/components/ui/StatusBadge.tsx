import React from 'react';
import type { InspectionStatus } from '../../types/agent';
import type { ReportStatus } from '../../types/report';
import { cn } from '../../lib/utils';

export type BadgeStatus = InspectionStatus | ReportStatus;

export interface StatusBadgeProps {
  status: BadgeStatus;
  size?: 'sm' | 'md' | 'lg';
  showDot?: boolean;
  className?: string;
}

const STATUS_CONFIG: Record<
  BadgeStatus,
  { label: string; bg: string; text: string; border: string; dot: string; pulse?: boolean }
> = {
  // Agent & Inspection Pipeline States
  UPLOADED: {
    label: 'UPLOADED',
    bg: 'bg-white/[0.04]',
    text: 'text-slate-400',
    border: 'border-white/[0.08]',
    dot: 'bg-slate-400',
  },
  PROCESSING: {
    label: 'PROCESSING',
    bg: 'bg-white/[0.06]',
    text: 'text-slate-300',
    border: 'border-white/10',
    dot: 'bg-slate-300',
    pulse: true,
  },
  OBSERVING: {
    label: 'OBSERVING',
    bg: 'bg-sky-500/10',
    text: 'text-sky-300',
    border: 'border-sky-500/20',
    dot: 'bg-sky-400',
    pulse: true,
  },
  DETECTING: {
    label: 'DETECTING',
    bg: 'bg-amber-500/10',
    text: 'text-amber-300',
    border: 'border-amber-500/20',
    dot: 'bg-amber-400',
    pulse: true,
  },
  VERIFYING: {
    label: 'VERIFYING',
    bg: 'bg-amber-500/10',
    text: 'text-amber-300',
    border: 'border-amber-500/20',
    dot: 'bg-amber-400',
    pulse: true,
  },
  REINSPECTING: {
    label: 'RE-INSPECTING',
    bg: 'bg-indigo-500/10',
    text: 'text-indigo-300',
    border: 'border-indigo-500/20',
    dot: 'bg-indigo-400',
    pulse: true,
  },
  ASSESSING: {
    label: 'ASSESSING',
    bg: 'bg-purple-500/10',
    text: 'text-purple-300',
    border: 'border-purple-500/20',
    dot: 'bg-purple-400',
    pulse: true,
  },
  REPORT_GENERATING: {
    label: 'GENERATING REPORT',
    bg: 'bg-sky-500/10',
    text: 'text-sky-300',
    border: 'border-sky-500/20',
    dot: 'bg-sky-400',
    pulse: true,
  },
  WAITING_FOR_APPROVAL: {
    label: 'WAITING APPROVAL',
    bg: 'bg-amber-500/15',
    text: 'text-amber-300',
    border: 'border-amber-500/30',
    dot: 'bg-amber-400',
    pulse: true,
  },
  PENDING: {
    label: 'PENDING APPROVAL',
    bg: 'bg-amber-500/15',
    text: 'text-amber-300',
    border: 'border-amber-500/30',
    dot: 'bg-amber-400',
    pulse: true,
  },
  APPROVED: {
    label: 'APPROVED',
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-300',
    border: 'border-emerald-500/20',
    dot: 'bg-emerald-400',
  },
  REJECTED: {
    label: 'REJECTED',
    bg: 'bg-rose-500/10',
    text: 'text-rose-300',
    border: 'border-rose-500/20',
    dot: 'bg-rose-400',
  },
  CLOSED: {
    label: 'CLOSED',
    bg: 'bg-white/[0.03]',
    text: 'text-slate-400',
    border: 'border-white/[0.06]',
    dot: 'bg-slate-500',
  },
};

const SIZE_STYLES = {
  sm: 'text-[9px] px-2 py-0.5 gap-1.5',
  md: 'text-[10px] px-2.5 py-1 gap-2',
  lg: 'text-xs px-3 py-1.5 gap-2.5',
};

const DOT_SIZES = {
  sm: 'w-1 h-1',
  md: 'w-1.5 h-1.5',
  lg: 'w-2 h-2',
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  showDot = true,
  className,
}) => {
  const config = STATUS_CONFIG[status] || {
    label: status,
    bg: 'bg-white/[0.04]',
    text: 'text-slate-300',
    border: 'border-white/10',
    dot: 'bg-slate-400',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center font-mono uppercase tracking-[0.15em] rounded border transition-colors select-none font-medium',
        config.bg,
        config.text,
        config.border,
        SIZE_STYLES[size],
        className
      )}
    >
      {showDot && (
        <span
          className={cn(
            'rounded-full shrink-0',
            config.dot,
            DOT_SIZES[size],
            config.pulse && 'animate-pulse'
          )}
        />
      )}
      {config.label}
    </span>
  );
};
