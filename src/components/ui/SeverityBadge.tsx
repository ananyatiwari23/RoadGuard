import React from 'react';
import type { Severity } from '../../types/inspection';
import { cn } from '../../lib/utils';
import { AlertCircle, AlertTriangle, CheckCircle2 } from 'lucide-react';

export interface SeverityBadgeProps {
  severity: Severity;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

const SEVERITY_CONFIG: Record<
  Severity,
  { label: string; bg: string; text: string; border: string; icon: React.FC<{ className?: string }> }
> = {
  LOW: {
    label: 'LOW SEVERITY',
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    border: 'border-emerald-500/25',
    icon: CheckCircle2,
  },
  MEDIUM: {
    label: 'MEDIUM SEVERITY',
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    border: 'border-amber-500/25',
    icon: AlertTriangle,
  },
  HIGH: {
    label: 'HIGH SEVERITY',
    bg: 'bg-rose-500/10',
    text: 'text-rose-400',
    border: 'border-rose-500/25',
    icon: AlertCircle,
  },
};

const SIZE_STYLES = {
  sm: 'text-[9px] px-2 py-0.5 gap-1',
  md: 'text-[10px] px-2.5 py-1 gap-1.5',
  lg: 'text-xs px-3 py-1.5 gap-2',
};

const ICON_SIZES = {
  sm: 'w-2.5 h-2.5',
  md: 'w-3 h-3',
  lg: 'w-3.5 h-3.5',
};

export const SeverityBadge: React.FC<SeverityBadgeProps> = ({
  severity,
  size = 'md',
  showIcon = false,
  className,
}) => {
  const config = SEVERITY_CONFIG[severity] || SEVERITY_CONFIG.LOW;
  const Icon = config.icon;

  return (
    <span
      className={cn(
        'inline-flex items-center font-mono uppercase tracking-[0.15em] rounded border transition-colors select-none font-semibold',
        config.bg,
        config.text,
        config.border,
        SIZE_STYLES[size],
        className
      )}
    >
      {showIcon && <Icon className={cn('shrink-0 stroke-[2]', ICON_SIZES[size])} />}
      {config.label}
    </span>
  );
};
