import React from 'react';
import type { WorkflowStage, WorkflowStageStatus } from '../../types/agent';
import { cn } from '../../lib/utils';
import {
  Eye,
  ShieldCheck,
  RefreshCw,
  BarChart2,
  FileText,
  UserCheck,
  Check,
  X,
  Loader2,
} from 'lucide-react';

export interface AgentWorkflowProps {
  currentStage: WorkflowStage;
  workflowStages?: Record<WorkflowStage, WorkflowStageStatus>;
  className?: string;
}

const STAGE_CONFIG: {
  stage: WorkflowStage;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { stage: 'OBSERVE', label: 'Observe', description: 'Stream Ingestion', icon: Eye },
  { stage: 'VERIFY', label: 'Verify', description: 'Anomaly Detection', icon: ShieldCheck },
  { stage: 'RECHECK', label: 'Recheck', description: 'Temporal Buffer', icon: RefreshCw },
  { stage: 'ASSESS', label: 'Assess', description: 'Severity Analysis', icon: BarChart2 },
  { stage: 'REPORT', label: 'Report', description: 'Dossier Generation', icon: FileText },
  { stage: 'HUMAN_REVIEW', label: 'Human Review', description: 'Inspector Signoff', icon: UserCheck },
];

const STAGE_ORDER: WorkflowStage[] = [
  'OBSERVE',
  'VERIFY',
  'RECHECK',
  'ASSESS',
  'REPORT',
  'HUMAN_REVIEW',
];

export const AgentWorkflow: React.FC<AgentWorkflowProps> = ({
  currentStage,
  workflowStages,
  className,
}) => {
  const currentIdx = STAGE_ORDER.indexOf(currentStage);

  const getStageStatus = (stage: WorkflowStage): WorkflowStageStatus => {
    if (workflowStages && workflowStages[stage]) {
      return workflowStages[stage];
    }
    const idx = STAGE_ORDER.indexOf(stage);
    if (idx < currentIdx) return 'COMPLETED';
    if (idx === currentIdx) return 'RUNNING';
    return 'PENDING';
  };

  return (
    <div className={cn('w-full rounded-card glass-surface p-6', className)}>
      {/* Header bar */}
      <div className="flex items-center justify-between pb-5 mb-6 border-b border-white/[0.08]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-white font-bold">
            Autonomous Agent Inspection Pipeline
          </h3>
        </div>
        <div className="flex items-center gap-2 font-mono text-[10px] text-slate-400">
          <span className="uppercase tracking-[0.15em]">Active Stage:</span>
          <span className="text-white font-bold px-2 py-0.5 rounded bg-white/[0.06] border border-white/10">
            {currentStage}
          </span>
        </div>
      </div>

      {/* Stepper container: Horizontal on desktop (md), Vertical on mobile */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 md:gap-0 relative">
        {STAGE_CONFIG.map((item, idx) => {
          const status = getStageStatus(item.stage);
          const Icon = item.icon;
          const isLast = idx === STAGE_CONFIG.length - 1;
          const nextStatus = !isLast ? getStageStatus(STAGE_CONFIG[idx + 1].stage) : 'PENDING';

          return (
            <React.Fragment key={item.stage}>
              {/* Step Node */}
              <div className="flex md:flex-col items-center md:items-center gap-4 md:gap-2.5 z-10 group relative flex-1">
                {/* Node Circle */}
                <div
                  className={cn(
                    'w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 relative shrink-0',
                    status === 'COMPLETED' &&
                      'bg-white/[0.08] border-2 border-white/60 text-white shadow-[0_0_15px_rgba(255,255,255,0.15)]',
                    status === 'RUNNING' &&
                      'bg-[#121212] border-2 border-white text-white shadow-[0_0_20px_rgba(255,255,255,0.25)] ring-4 ring-white/[0.12]',
                    status === 'FAILED' &&
                      'bg-rose-500/10 border-2 border-rose-500 text-rose-400 shadow-[0_0_15px_rgba(229,72,77,0.2)]',
                    status === 'PENDING' &&
                      'bg-[#0a0a0a] border border-white/[0.1] text-slate-500'
                  )}
                >
                  {status === 'COMPLETED' ? (
                    <Check className="w-5 h-5 stroke-[2.5]" />
                  ) : status === 'RUNNING' ? (
                    <>
                      <Loader2 className="w-5 h-5 stroke-[2] animate-spin text-white absolute" />
                      <Icon className="w-4 h-4 text-white/40" />
                    </>
                  ) : status === 'FAILED' ? (
                    <X className="w-5 h-5 stroke-[2.5]" />
                  ) : (
                    <Icon className="w-4 h-4 stroke-[1.75]" />
                  )}
                </div>

                {/* Node Labels */}
                <div className="flex flex-col md:items-center text-left md:text-center min-w-0">
                  <div className="flex items-center gap-1.5 md:justify-center">
                    <span
                      className={cn(
                        'font-mono text-xs font-bold uppercase tracking-[0.1em] transition-colors',
                        status === 'RUNNING'
                          ? 'text-white'
                          : status === 'COMPLETED'
                          ? 'text-slate-200'
                          : status === 'FAILED'
                          ? 'text-rose-400'
                          : 'text-slate-500'
                      )}
                    >
                      {item.label}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-sans truncate hidden sm:block">
                    {item.description}
                  </span>
                  <span
                    className={cn(
                      'font-mono text-[9px] uppercase tracking-wider mt-0.5 font-semibold',
                      status === 'COMPLETED' && 'text-emerald-400',
                      status === 'RUNNING' && 'text-white',
                      status === 'FAILED' && 'text-rose-400',
                      status === 'PENDING' && 'text-slate-600'
                    )}
                  >
                    {status}
                  </span>
                </div>
              </div>

              {/* Connecting Line (Horizontal on desktop, vertical on mobile) */}
              {!isLast && (
                <div className="md:flex-1 flex md:items-center justify-center my-[-4px] md:my-0 md:mx-[-8px] z-0">
                  {/* Desktop horizontal connector */}
                  <div className="hidden md:block w-full h-[2px] relative overflow-hidden bg-white/[0.08] rounded-full">
                    <div
                      className={cn(
                        'h-full transition-all duration-700',
                        status === 'COMPLETED'
                          ? nextStatus === 'PENDING'
                            ? 'w-full bg-gradient-to-r from-white/70 to-white/20'
                            : 'w-full bg-white/70'
                          : status === 'RUNNING'
                          ? 'w-1/2 bg-gradient-to-r from-white to-transparent animate-pulse'
                          : 'w-0'
                      )}
                    />
                  </div>

                  {/* Mobile vertical connector */}
                  <div className="md:hidden w-[2px] h-6 ml-5 my-1 bg-white/[0.08]">
                    <div
                      className={cn(
                        'w-full transition-all duration-700',
                        status === 'COMPLETED' ? 'h-full bg-white/70' : 'h-0'
                      )}
                    />
                  </div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
