import React, { useEffect, useRef } from 'react';
import type { AgentEvent } from '../../types/agent';
import { cn } from '../../lib/utils';
import { Terminal } from 'lucide-react';

export interface EventLogProps {
  events: AgentEvent[];
  title?: string;
  maxHeight?: string;
  autoScroll?: boolean;
  className?: string;
}

const LEVEL_CONFIG: Record<
  AgentEvent['level'],
  { dot: string; text: string; tag: string; border: string }
> = {
  info: {
    dot: 'bg-sky-400',
    text: 'text-slate-300',
    tag: 'text-sky-300 bg-sky-500/10 border-sky-500/20',
    border: 'border-white/[0.04]',
  },
  action: {
    dot: 'bg-indigo-400',
    text: 'text-indigo-200',
    tag: 'text-indigo-300 bg-indigo-500/10 border-indigo-500/20',
    border: 'border-indigo-500/15',
  },
  warning: {
    dot: 'bg-amber-400',
    text: 'text-amber-200',
    tag: 'text-amber-300 bg-amber-500/10 border-amber-500/20',
    border: 'border-amber-500/15',
  },
  success: {
    dot: 'bg-emerald-400',
    text: 'text-emerald-200',
    tag: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/20',
    border: 'border-emerald-500/15',
  },
  alert: {
    dot: 'bg-rose-400 animate-pulse',
    text: 'text-rose-200 font-semibold',
    tag: 'text-rose-300 bg-rose-500/15 border-rose-500/30',
    border: 'border-rose-500/25',
  },
  error: {
    dot: 'bg-rose-500',
    text: 'text-rose-300 font-semibold',
    tag: 'text-rose-400 bg-rose-500/20 border-rose-500/40',
    border: 'border-rose-500/30',
  },
};

export const EventLog: React.FC<EventLogProps> = ({
  events,
  title = 'AGENT REASONING STREAM',
  maxHeight = 'max-h-80',
  autoScroll = true,
  className,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoScroll && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [events.length, autoScroll]);

  return (
    <div
      className={cn(
        'rounded-card glass-surface overflow-hidden flex flex-col border border-white/[0.08]',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.08] bg-white/[0.015]">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-slate-400 stroke-[1.75]" />
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-300 font-bold">
            {title}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono text-[10px] text-slate-500 uppercase tracking-widest">
            {events.length} EVENTS
          </span>
        </div>
      </div>

      {/* Feed list */}
      <div
        ref={containerRef}
        className={cn(
          'p-3.5 space-y-2 overflow-y-auto font-mono text-xs select-text',
          maxHeight
        )}
      >
        {events.length === 0 ? (
          <div className="py-8 text-center text-slate-600 italic font-mono text-[11px]">
            Awaiting autonomous reasoning stream events...
          </div>
        ) : (
          events.map((evt) => {
            const levelStyle = LEVEL_CONFIG[evt.level] || LEVEL_CONFIG.info;

            return (
              <div
                key={evt.id}
                className={cn(
                  'flex items-start gap-2.5 p-2 rounded bg-white/[0.015] hover:bg-white/[0.04] transition-colors border leading-relaxed',
                  levelStyle.border
                )}
              >
                {/* Level Dot */}
                <div className="pt-1.5 shrink-0">
                  <span className={cn('w-1.5 h-1.5 rounded-full block', levelStyle.dot)} />
                </div>

                {/* Timestamp */}
                <span className="text-slate-500 select-none shrink-0 text-[10px] font-mono tracking-wider pt-0.5">
                  [{evt.timestamp}]
                </span>

                {/* Stage Tag */}
                {evt.stage && (
                  <span
                    className={cn(
                      'text-[9px] uppercase px-1.5 py-0.5 rounded border font-mono tracking-wider shrink-0 font-medium',
                      levelStyle.tag
                    )}
                  >
                    {evt.stage}
                  </span>
                )}

                {/* Message */}
                <div className={cn('flex-1 text-[11px] font-sans break-words', levelStyle.text)}>
                  {evt.message}
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};
