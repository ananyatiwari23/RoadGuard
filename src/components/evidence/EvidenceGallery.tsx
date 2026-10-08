import React, { useState } from 'react';
import type { FrameEvidence } from '../../types/evidence';
import { FrameThumbnail } from './FrameThumbnail';
import { ConfidenceBar } from '../ui/ConfidenceBar';
import { EmptyState } from '../ui/EmptyState';
import { cn } from '../../lib/utils';
import { Layers, X, Sparkles, Sliders, ChevronLeft, ChevronRight } from 'lucide-react';

export interface EvidenceGalleryProps {
  frames: FrameEvidence[];
  title?: string;
  className?: string;
}

export const EvidenceGallery: React.FC<EvidenceGalleryProps> = ({
  frames,
  title,
  className,
}) => {
  const [lightboxFrameIndex, setLightboxFrameIndex] = useState<number | null>(null);
  const [showAnnotated, setShowAnnotated] = useState(true);

  if (!frames || frames.length === 0) {
    return (
      <EmptyState
        title="NO FRAME EVIDENCE AVAILABLE"
        description="Frames will populate as the autonomous pipeline processes the road inspection sequence."
        className={className}
      />
    );
  }

  const selectedFrame = lightboxFrameIndex !== null ? frames[lightboxFrameIndex] : null;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxFrameIndex !== null && lightboxFrameIndex > 0) {
      setLightboxFrameIndex(lightboxFrameIndex - 1);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxFrameIndex !== null && lightboxFrameIndex < frames.length - 1) {
      setLightboxFrameIndex(lightboxFrameIndex + 1);
    }
  };

  return (
    <div
      className={cn(
        'rounded-card glass-surface p-6 border border-white/[0.08] flex flex-col',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-4 mb-5 border-b border-white/[0.08]">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-slate-300 stroke-[1.75]" />
          <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-white font-bold">
            {title || `${frames.length} SUPPORTING FRAMES`}
          </h3>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-slate-500">
          CLICK FRAME TO ENLARGE
        </span>
      </div>

      {/* Grid of Frame Thumbnails */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {frames.map((frame, idx) => (
          <FrameThumbnail
            key={frame.frameNumber}
            frame={frame}
            isActive={lightboxFrameIndex === idx}
            onClick={() => setLightboxFrameIndex(idx)}
          />
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedFrame && lightboxFrameIndex !== null && (
        <div
          onClick={() => setLightboxFrameIndex(null)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="rounded-card glass-surface border border-white/20 bg-[#0a0a0a] max-w-4xl w-full overflow-hidden flex flex-col shadow-2xl relative"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded bg-white/[0.08] border border-white/15 font-mono text-xs font-bold text-white tracking-wider">
                  FRAME #{String(selectedFrame.frameNumber).padStart(4, '0')}
                </span>
                <span className="font-mono text-xs text-slate-400">
                  [{selectedFrame.timestamp}]
                </span>
                <span
                  className={cn(
                    'text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold',
                    selectedFrame.status === 'CONFIRMED'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : selectedFrame.status === 'DETECTED'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-white/10 text-slate-300'
                  )}
                >
                  {selectedFrame.status}
                </span>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowAnnotated(!showAnnotated)}
                  className="px-3 py-1 rounded bg-white/[0.05] hover:bg-white/[0.1] border border-white/15 font-mono text-[10px] text-slate-300 uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Sliders className="w-3 h-3" />
                  {showAnnotated ? 'SHOW RAW FRAME' : 'SHOW OVERLAY'}
                </button>
                <button
                  onClick={() => setLightboxFrameIndex(null)}
                  className="w-7 h-7 rounded bg-white/[0.05] hover:bg-white/10 border border-white/15 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
                  title="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body / Image Viewport */}
            <div className="relative bg-black aspect-[16/9] flex items-center justify-center overflow-hidden">
              <img
                src={showAnnotated ? selectedFrame.annotatedUrl || selectedFrame.imageUrl : selectedFrame.imageUrl}
                alt={`Enlarged frame ${selectedFrame.frameNumber}`}
                className="w-full h-full object-contain"
              />

              {/* Prev Button */}
              {lightboxFrameIndex > 0 && (
                <button
                  onClick={handlePrev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/70 border border-white/20 flex items-center justify-center text-white hover:bg-black/90 transition-all cursor-pointer shadow-lg"
                  title="Previous Frame"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}

              {/* Next Button */}
              {lightboxFrameIndex < frames.length - 1 && (
                <button
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/70 border border-white/20 flex items-center justify-center text-white hover:bg-black/90 transition-all cursor-pointer shadow-lg"
                  title="Next Frame"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-white/[0.02] border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex-1 w-full sm:w-auto">
                <ConfidenceBar confidence={selectedFrame.confidence} size="md" />
              </div>
              {selectedFrame.detection && (
                <div className="flex items-center gap-3 font-mono text-xs text-slate-300">
                  <span className="text-[10px] text-slate-500 uppercase">Detection Lock:</span>
                  <span className="px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/20 text-rose-300 font-bold">
                    {selectedFrame.detection.damageClass}
                  </span>
                  <span className="text-slate-400">
                    BBox: [{selectedFrame.detection.bbox.x}%, {selectedFrame.detection.bbox.y}%]
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
