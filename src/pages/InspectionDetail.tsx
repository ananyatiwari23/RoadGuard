import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getInspectionDetail } from '../services/api';
import { Inspection, DAMAGE_CLASSES, mapStatusToWorkflowStage } from '../types';
import { StatusBadge } from '../components/ui/StatusBadge';
import { SeverityBadge } from '../components/ui/SeverityBadge';
import { DamageClassChip } from '../components/ui/DamageClassChip';
import { AgentWorkflow } from '../components/agent/AgentWorkflow';
import { EventLog } from '../components/agent/EventLog';
import { DetectionPanel } from '../components/inspection/DetectionPanel';
import { SeverityAssessmentCard } from '../components/inspection/SeverityAssessmentCard';
import { EvidenceGallery } from '../components/evidence/EvidenceGallery';
import { LoadingState } from '../components/ui/LoadingState';
import { ErrorState } from '../components/ui/ErrorState';
import {
  ArrowLeft,
  ExternalLink,
  Radio,
  FileText,
  Cpu,
  Zap,
  MapPin,
  Calendar,
  Layers,
  HardDrive,
  Camera,
  CheckCircle,
} from 'lucide-react';

export const InspectionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const inspectionId = id || 'INSP-2026-0881';

  const [inspection, setInspection] = useState<Inspection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const data = await getInspectionDetail(inspectionId);
        setInspection(data);
      } catch (err: any) {
        setError(err?.message || 'Inspection telemetry record not found.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [inspectionId]);

  if (loading) {
    return <LoadingState variant="card" count={3} />;
  }

  if (error || !inspection) {
    return (
      <ErrorState
        title="RECORD NOT FOUND"
        reason={error || `Inspection record ${inspectionId} does not exist.`}
        onRetry={() => navigate('/history')}
      />
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Back Navigation & Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          to="/history"
          className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          BACK TO INSPECTION ARCHIVE
        </Link>

        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">
          SECURE AUDIT RECORD // HASH: 8f9b...a1c3
        </div>
      </div>

      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-2">
            <span>AUDIT TELEMETRY RECORD</span>
            <span>//</span>
            <span className="text-white font-bold">{inspection.id}</span>
          </div>
          <h1 className="font-sans font-semibold text-4xl sm:text-5xl tracking-tighter leading-[0.9] text-white">
            {DAMAGE_CLASSES[inspection.damageClass]?.label || inspection.damageClass} Assessment
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              {inspection.createdAt}
            </span>
            <span>·</span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              {inspection.location || 'Highway Corridor Segment 12'}
            </span>
            <span>·</span>
            <span className="flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-slate-500" />
              {inspection.inputType} RUN ({inspection.totalFrames || 7} Frames)
            </span>
          </div>
        </div>

        {/* Status Pills and Action CTA Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge status={inspection.status} />
          <SeverityBadge severity={inspection.severity} />

          <Link
            to={`/inspections/${inspection.id}/live`}
            className="flex items-center gap-2 px-4 py-2.5 rounded-card border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] text-white font-mono text-[11px] uppercase tracking-[0.2em] transition-all"
          >
            <Radio className="w-3.5 h-3.5 text-slate-400" />
            LIVE COCKPIT
          </Link>

          <Link
            to={`/reports/${inspection.id}`}
            className="flex items-center gap-2 px-4 py-2.5 rounded-card silver-gradient-bg text-black font-mono text-[11px] font-bold uppercase tracking-[0.2em] hover:opacity-90 shadow-[0_0_20px_rgba(255,255,255,0.15)] transition-all"
          >
            <FileText className="w-3.5 h-3.5 stroke-[2]" />
            REPORT BRIEF
          </Link>
        </div>
      </div>

      {/* Signature Agent Workflow Pipeline */}
      <AgentWorkflow
        currentStage={mapStatusToWorkflowStage(inspection.status)}
      />

      {/* Hardware & Hardware Acceleration Telemetry Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-card glass-surface border border-white/[0.06]">
          <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.2em] text-slate-500 mb-1">
            <Cpu className="w-3.5 h-3.5 text-slate-400" />
            <span>ACCELERATOR</span>
          </div>
          <div className="font-mono text-sm text-white font-semibold">AWS Graviton3 ARM</div>
          <div className="font-mono text-[10px] text-slate-500 mt-0.5">c7g.2xlarge NEON</div>
        </div>

        <div className="p-4 rounded-card glass-surface border border-white/[0.06]">
          <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.2em] text-slate-500 mb-1">
            <Zap className="w-3.5 h-3.5 text-slate-400" />
            <span>VISION ENGINE</span>
          </div>
          <div className="font-mono text-sm text-white font-semibold">OpenCV 5.0.0 (COOL)</div>
          <div className="font-mono text-[10px] text-slate-500 mt-0.5">Kernel JIT Compiled</div>
        </div>

        <div className="p-4 rounded-card glass-surface border border-white/[0.06]">
          <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.2em] text-slate-500 mb-1">
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            <span>TEMPORAL LOCK</span>
          </div>
          <div className="font-mono text-sm text-white font-semibold">
            {inspection.persistenceFrames} / {inspection.totalFrames || 7} Frames
          </div>
          <div className="font-mono text-[10px] text-slate-500 mt-0.5">
            Confirmed Persistent
          </div>
        </div>

        <div className="p-4 rounded-card glass-surface border border-white/[0.06]">
          <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.2em] text-slate-500 mb-1">
            <HardDrive className="w-3.5 h-3.5 text-slate-400" />
            <span>LATENCY PROFILE</span>
          </div>
          <div className="font-mono text-sm text-white font-semibold">14.8 ms / Frame</div>
          <div className="font-mono text-[10px] text-slate-500 mt-0.5">4.2x Faster vs x86</div>
        </div>
      </div>

      {/* Detection & Severity Assessment */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DetectionPanel
          damageClass={inspection.damageClass}
          confidence={inspection.confidence}
        />
        <SeverityAssessmentCard
          damageType={DAMAGE_CLASSES[inspection.damageClass]?.label || inspection.damageClass}
          confidence={inspection.confidence}
          severity={inspection.severity}
          roadPosition={inspection.location || 'Lane 2 (Direct Wheelpath)'}
          persistenceFrames={inspection.persistenceFrames}
          recommendation={inspection.severity === 'HIGH' ? 'Full-depth asphalt patching within 24 hours. Mill surrounding 2m radius.' : 'Standard preventive joint sealing.'}
        />
      </div>

      {/* Temporal Evidence Frames */}
      {inspection.evidence && inspection.evidence.length > 0 && (
        <EvidenceGallery
          frames={inspection.evidence}
        />
      )}

      {/* Complete Agent Reasoning Log */}
      <EventLog
        events={inspection.events || []}
        title="IMMUTABLE AUDIT LOG & AGENT REASONING FEED"
      />
    </div>
  );
};

export default InspectionDetail;
