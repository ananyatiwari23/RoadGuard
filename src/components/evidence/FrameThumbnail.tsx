import React from 'react';
import type { FrameEvidence, FrameEvidenceStatus } from '../../types/evidence';
import { cn } from '../../lib/utils';

export interface FrameThumbnailProps {
  frame: FrameEvidence;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
}

const STATUS_DOT: Record<FrameEvidenceStatus, { dot: string; label: string; text: string }> = {
  NO_DAMAGE: { dot: 'bg-slate-500', label: 'CLEAN', text: 'text-slate-400' },
  POSSIBLE: { dot: 'bg-amber-400 animate-pulse', label: 'POSSIBLE', text: 'text-amber-300' },
  DETECTED: { dot: 'bg-orange-400', label: 'DETECTED', text: 'text-orange-300' },
  CONFIRMED: { dot: 'bg-rose-400', label: 'CONFIRMED', text: 'text-rose-300' },
};

export const FrameThumbnail: React.FC<FrameThumbnailProps> = ({
  frame,
  isActive = false,
  onClick,
  className,
}) => {
  const statusInfo = STATUS_DOT[frame.status] || STATUS_DOT.NO_DAMAGE;

  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={cn(
        'relative rounded-lg overflow-hidden border transition-all duration-200 group bg-[#080808] aspect-[16/9] flex-shrink-0 select-none',
        isActive
          ? 'border-white ring-2 ring-white/50 shadow-[0_0_15px_rgba(255,255,255,0.2)]'
          : 'border-white/[0.08] hover:border-white/30',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {/* Frame image (prefers annotated if present) */}
      <img
        src={frame.annotatedUrl || frame.imageUrl}
        alt={`Frame #${frame.frameNumber}`}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        loading="lazy"
      />

      {/* Frame Number Tag (top left) */}
      <div className="absolute top-1.5 left-1.5 bg-[#080808]/90 border border-white/10 rounded px-1.5 py-0.5 text-[9px] font-mono text-slate-300">
        F#{String(frame.frameNumber).padStart(4, '0')}
      </div>

      {/* Status dot + label (top right) */}
      <div className="absolute top-1.5 right-1.5 bg-[#080808]/90 border border-white/10 rounded px-1.5 py-0.5 flex items-center gap-1.5">
        <span className={cn('w-1.5 h-1.5 rounded-full', statusInfo.dot)} />
        <span className={cn('text-[8px] font-mono uppercase tracking-wider font-bold', statusInfo.text)}>
          {statusInfo.label}
        </span>
      </div>

      {/* Confidence Pill (bottom right) */}
      <div className="absolute bottom-1.5 right-1.5 bg-[#080808]/90 border border-white/10 rounded px-1.5 py-0.5 font-mono text-[9px] font-bold text-white">
        {frame.confidence}%
      </div>

      {/* Timestamp (bottom left) */}
      <div className="absolute bottom-1.5 left-1.5 font-mono text-[8px] text-slate-400 bg-black/60 px-1 rounded">
        {frame.timestamp}
      </div>
    </div>
  );
};
