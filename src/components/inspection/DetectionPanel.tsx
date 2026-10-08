import React from 'react';
import type { DamageClass } from '../../types/inspection';
import { DAMAGE_CLASS_META } from '../../types/inspection';
import { DamageClassChip } from '../ui/DamageClassChip';
import { ConfidenceBar } from '../ui/ConfidenceBar';
import { cn } from '../../lib/utils';
import { Target, Layers, Info } from 'lucide-react';

export interface AlternateClassPrediction {
  damageClass: DamageClass;
  confidence: number;
}

export interface DetectionPanelProps {
  damageClass: DamageClass;
  confidence: number;
  alternateClasses?: AlternateClassPrediction[];
  onSelectClass?: (damageClass: DamageClass) => void;
  className?: string;
}

const ALL_CLASSES: DamageClass[] = ['D00', 'D10', 'D20', 'D40'];

export const DetectionPanel: React.FC<DetectionPanelProps> = ({
  damageClass,
  confidence,
  alternateClasses,
  onSelectClass,
  className,
}) => {
  const meta = DAMAGE_CLASS_META[damageClass];

  // If no alternateClasses provided, build them from other classes with lower scores
  const alternatives =
    alternateClasses ||
    ALL_CLASSES.filter((c) => c !== damageClass).map((c, idx) => ({
      damageClass: c,
      confidence: Math.max(5, Math.round((100 - confidence) / (idx + 2))),
    }));

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
          <Target className="w-4 h-4 text-rose-400 stroke-[1.75]" />
          <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-white font-bold">
            Damage Classification
          </h3>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500">
          RDD2022 STANDARDS
        </span>
      </div>

      {/* Primary Detection Showcase */}
      <div className="rounded-lg bg-white/[0.02] border border-white/[0.08] p-4 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1">
              Primary Detection Class
            </div>
            <div className="flex items-center gap-2">
              <DamageClassChip damageClass={damageClass} size="md" active />
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-mono text-slate-500 uppercase">Class Code</span>
            <div className="text-lg font-mono font-bold text-white">{damageClass}</div>
          </div>
        </div>

        {meta && (
          <p className="text-xs text-slate-300 font-sans leading-relaxed flex items-start gap-1.5 pt-1">
            <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
            <span>{meta.description}</span>
          </p>
        )}

        {/* Confidence bar */}
        <div className="pt-2">
          <ConfidenceBar confidence={confidence} size="md" />
        </div>
      </div>

      {/* Alternate Class Candidate Chips */}
      {alternatives.length > 0 && (
        <div className="space-y-2.5">
          <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-slate-400">
            <Layers className="w-3 h-3 text-slate-500" />
            <span>Alternate Candidates (Softmax Distribution)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {alternatives.map((alt) => (
              <div
                key={alt.damageClass}
                onClick={() => onSelectClass && onSelectClass(alt.damageClass)}
                className={cn(
                  'rounded bg-white/[0.02] border border-white/[0.06] p-2.5 flex items-center justify-between transition-colors',
                  onSelectClass && 'cursor-pointer hover:border-white/20 hover:bg-white/[0.04]'
                )}
              >
                <DamageClassChip damageClass={alt.damageClass} size="sm" />
                <span className="font-mono text-xs text-slate-400 font-semibold">
                  {alt.confidence}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
