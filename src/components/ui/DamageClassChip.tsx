import React from 'react';
import type { DamageClass } from '../../types/inspection';
import { DAMAGE_CLASS_META } from '../../types/inspection';
import { cn } from '../../lib/utils';

export interface DamageClassChipProps {
  damageClass: DamageClass;
  size?: 'sm' | 'md';
  showDescription?: boolean;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

const CLASS_ACCENTS: Record<DamageClass, { border: string; bg: string; text: string; dot: string }> = {
  D00: {
    border: 'border-blue-500/30',
    bg: 'bg-blue-500/10',
    text: 'text-blue-300',
    dot: 'bg-blue-400',
  },
  D10: {
    border: 'border-cyan-500/30',
    bg: 'bg-cyan-500/10',
    text: 'text-cyan-300',
    dot: 'bg-cyan-400',
  },
  D20: {
    border: 'border-amber-500/30',
    bg: 'bg-amber-500/10',
    text: 'text-amber-300',
    dot: 'bg-amber-400',
  },
  D40: {
    border: 'border-rose-500/30',
    bg: 'bg-rose-500/10',
    text: 'text-rose-300',
    dot: 'bg-rose-400',
  },
};

export const DamageClassChip: React.FC<DamageClassChipProps> = ({
  damageClass,
  size = 'md',
  showDescription = false,
  active = false,
  onClick,
  className,
}) => {
  const meta = DAMAGE_CLASS_META[damageClass];
  const accent = CLASS_ACCENTS[damageClass] || CLASS_ACCENTS.D40;

  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      title={meta ? `${meta.label}: ${meta.description}` : damageClass}
      className={cn(
        'inline-flex items-center gap-1.5 rounded font-mono transition-all duration-200 select-none border',
        accent.bg,
        accent.border,
        onClick && 'cursor-pointer hover:border-white/40 active:scale-95',
        active && 'ring-2 ring-white/40 bg-white/[0.08]',
        size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs',
        className
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', accent.dot)} />
      <span className="font-bold text-white tracking-wider">{damageClass}</span>
      {meta && (
        <span className={cn('font-normal opacity-90 truncate', accent.text)}>
          {meta.label}
        </span>
      )}
      {showDescription && meta && (
        <span className="text-[10px] text-slate-400 hidden sm:inline ml-1 border-l border-white/10 pl-1.5">
          {meta.description}
        </span>
      )}
    </div>
  );
};
