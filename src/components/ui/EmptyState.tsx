import React from 'react';
import { cn } from '../../lib/utils';
import { Inbox } from 'lucide-react';

export interface EmptyStateProps {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: React.ComponentType<{ className?: string }>;
  };
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = Inbox,
  title,
  description,
  action,
  className,
}) => {
  const ActionIcon = action?.icon;

  return (
    <div
      className={cn(
        'rounded-card glass-surface p-10 flex flex-col items-center justify-center text-center border-dashed border-white/10',
        className
      )}
    >
      <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-slate-400 mb-4">
        <Icon className="w-6 h-6 stroke-[1.5]" />
      </div>

      <h4 className="font-mono text-xs uppercase tracking-[0.2em] text-slate-200 mb-1.5">
        {title}
      </h4>

      {description && (
        <p className="text-xs text-slate-400 max-w-sm leading-relaxed mb-5 font-sans">
          {description}
        </p>
      )}

      {action && (
        <button
          onClick={action.onClick}
          className="btn-silver px-4 py-2 rounded text-xs font-mono font-semibold uppercase tracking-[0.1em] flex items-center gap-2 cursor-pointer"
        >
          {ActionIcon && <ActionIcon className="w-3.5 h-3.5" />}
          {action.label}
        </button>
      )}
    </div>
  );
};
