import React, { useState } from 'react';
import type { Severity, DamageClass } from '../../types/inspection';
import type { ReportStatus } from '../../types/report';
import { SeverityBadge } from '../ui/SeverityBadge';
import { DamageClassChip } from '../ui/DamageClassChip';
import { cn } from '../../lib/utils';
import {
  UserCheck,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  X,
  FileCheck,
} from 'lucide-react';

export interface ApprovalCardProps {
  inspectionId: string;
  severity: Severity;
  damageClass: DamageClass;
  confidence: number;
  roadPosition: string;
  recommendation: string;
  status: ReportStatus | 'WAITING_FOR_APPROVAL';
  reviewerNote?: string;
  rejectedReason?: string;
  onApprove?: (note?: string) => void;
  onReject?: (reason: string) => void;
  className?: string;
}

export const ApprovalCard: React.FC<ApprovalCardProps> = ({
  inspectionId,
  severity,
  damageClass,
  confidence,
  roadPosition,
  recommendation,
  status,
  reviewerNote,
  rejectedReason,
  onApprove,
  onReject,
  className,
}) => {
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReasonInput, setRejectReasonInput] = useState('');
  const [approveNoteInput, setApproveNoteInput] = useState('');
  const [showApproveNote, setShowApproveNote] = useState(false);

  const isPending = status === 'WAITING_FOR_APPROVAL' || status === 'PENDING';
  const isApproved = status === 'APPROVED';
  const isRejected = status === 'REJECTED';

  const handleConfirmReject = () => {
    if (rejectReasonInput.trim().length >= 10 && onReject) {
      onReject(rejectReasonInput.trim());
      setShowRejectModal(false);
      setRejectReasonInput('');
    }
  };

  const handleConfirmApprove = () => {
    if (onApprove) {
      onApprove(approveNoteInput.trim() || undefined);
      setShowApproveNote(false);
      setApproveNoteInput('');
    }
  };

  return (
    <div
      className={cn(
        'rounded-card glass-surface border p-6 flex flex-col gap-5 relative overflow-hidden',
        isPending
          ? 'border-amber-500/30 bg-amber-500/[0.02]'
          : isApproved
          ? 'border-emerald-500/30 bg-emerald-500/[0.02]'
          : 'border-rose-500/30 bg-rose-500/[0.02]',
        className
      )}
    >
      {/* Banner */}
      <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
        <div className="flex items-center gap-2.5">
          {isPending ? (
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <ShieldAlert className="w-4 h-4 stroke-[2]" />
            </div>
          ) : isApproved ? (
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-4 h-4 stroke-[2]" />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <XCircle className="w-4 h-4 stroke-[2]" />
            </div>
          )}

          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-white font-bold">
                {isPending
                  ? 'HUMAN REVIEW REQUIRED'
                  : isApproved
                  ? 'WORK ORDER AUTHORIZED'
                  : 'REPORT OVERTURNED / REJECTED'}
              </h3>
            </div>
            <span className="text-[10px] font-mono text-slate-400">
              Inspection Dossier: #{inspectionId}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <DamageClassChip damageClass={damageClass} size="sm" />
          <SeverityBadge severity={severity} size="sm" showIcon />
        </div>
      </div>

      {/* Safety Policy Notice for HIGH severity */}
      {severity === 'HIGH' && isPending && (
        <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-3 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-200/90 font-sans leading-relaxed">
            <span className="font-semibold text-amber-200">SAFETY POLICY GATE:</span> HIGH severity detections cannot be auto-dispatched by autonomous agents. Explicit human engineering authorization is mandatory.
          </p>
        </div>
      )}

      {/* Summary details */}
      <div className="space-y-2 text-xs font-mono">
        <div className="flex items-center justify-between text-slate-300">
          <span className="text-slate-500 uppercase tracking-wider text-[10px]">Location:</span>
          <span>{roadPosition}</span>
        </div>
        <div className="flex items-center justify-between text-slate-300">
          <span className="text-slate-500 uppercase tracking-wider text-[10px]">Confidence:</span>
          <span className={confidence >= 75 ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
            {confidence}%
          </span>
        </div>
        <div className="pt-2 border-t border-white/[0.04]">
          <span className="text-slate-500 uppercase tracking-wider text-[10px] block mb-1">
            Recommendation:
          </span>
          <p className="text-slate-200 font-sans text-xs leading-relaxed">
            {recommendation}
          </p>
        </div>
      </div>

      {/* Audit feedback if already approved or rejected */}
      {isApproved && reviewerNote && (
        <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3 text-xs font-sans text-emerald-200">
          <span className="font-mono text-[10px] uppercase tracking-wider block text-emerald-400 font-bold mb-1">
            Reviewer Note:
          </span>
          "{reviewerNote}"
        </div>
      )}

      {isRejected && rejectedReason && (
        <div className="rounded-lg bg-rose-500/10 border border-rose-500/20 p-3 text-xs font-sans text-rose-200">
          <span className="font-mono text-[10px] uppercase tracking-wider block text-rose-400 font-bold mb-1">
            Rejection Rationale:
          </span>
          "{rejectedReason}"
        </div>
      )}

      {/* Pending Action Controls */}
      {isPending && (
        <div className="space-y-3 pt-2">
          {showApproveNote ? (
            <div className="space-y-2 bg-white/[0.02] border border-white/10 rounded-lg p-3">
              <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-300">
                Optional Inspector Note (Work Order Dispatch):
              </label>
              <input
                type="text"
                value={approveNoteInput}
                onChange={(e) => setApproveNoteInput(e.target.value)}
                placeholder="e.g. Verified road depression; authorized emergency cold-mix dispatch."
                className="w-full bg-[#121212] border border-white/15 rounded px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-white/40 font-sans"
              />
              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  onClick={() => setShowApproveNote(false)}
                  className="px-3 py-1 text-xs font-mono text-slate-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmApprove}
                  className="px-3 py-1 bg-emerald-500 text-black rounded text-xs font-mono font-bold uppercase tracking-wider cursor-pointer"
                >
                  Confirm Authorization
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={() => setShowApproveNote(true)}
                className="flex-1 btn-silver py-2.5 rounded font-mono text-xs font-bold uppercase tracking-[0.15em] flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                <UserCheck className="w-4 h-4" />
                APPROVE DISPATCH
              </button>

              <button
                onClick={() => setShowRejectModal(true)}
                className="px-4 py-2.5 rounded border border-rose-500/40 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 font-mono text-xs font-bold uppercase tracking-[0.15em] flex items-center gap-2 cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
                REJECT
              </button>
            </div>
          )}
        </div>
      )}

      {/* Reject Reason Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="rounded-card glass-surface border border-rose-500/30 bg-[#0e0e0e] max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2 text-rose-400">
                <AlertTriangle className="w-4 h-4" />
                <h4 className="font-mono text-xs uppercase tracking-wider font-bold">
                  Overturn / Reject Inspection
                </h4>
              </div>
              <button
                onClick={() => setShowRejectModal(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              Please document the technical reason for rejecting this autonomous inspection report (minimum 10 characters).
            </p>

            <textarea
              rows={3}
              value={rejectReasonInput}
              onChange={(e) => setRejectReasonInput(e.target.value)}
              placeholder="e.g. Visual shadow from roadside overpass mistaken for asphalt void cavity."
              className="w-full bg-[#141414] border border-white/15 rounded-lg p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-400/60 font-sans resize-none"
            />

            <div className="flex items-center justify-between pt-2">
              <span className="font-mono text-[10px] text-slate-500">
                {rejectReasonInput.length}/10 chars min
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowRejectModal(false)}
                  className="px-3 py-1.5 text-xs font-mono text-slate-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmReject}
                  disabled={rejectReasonInput.trim().length < 10}
                  className="px-4 py-1.5 rounded bg-rose-500 text-white font-mono text-xs font-bold uppercase tracking-wider disabled:opacity-40 disabled:cursor-not-allowed hover:bg-rose-600 transition-colors cursor-pointer"
                >
                  Submit Rejection
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
