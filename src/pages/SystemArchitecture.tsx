import React, { useState } from 'react';
import {
  Camera,
  Cloud,
  Cpu,
  Zap,
  Bot,
  UserCheck,
  ArrowDown,
  Layers,
  Database,
  ShieldCheck,
  Server,
  Code,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

interface ArchitectureNode {
  id: string;
  category: 'EDGE' | 'CLOUD' | 'COMPUTE' | 'VISION' | 'AGENT' | 'HUMAN';
  stepNumber: string;
  title: string;
  subtitle: string;
  description: string;
  techStack: string[];
  latency: string;
  protocols: string;
  details: {
    purpose: string;
    inputs: string;
    outputs: string;
    failureHandling: string;
  };
  codeSnippet?: string;
}

const ARCHITECTURE_NODES: ArchitectureNode[] = [
  {
    id: 'edge-ingress',
    category: 'EDGE',
    stepNumber: '01',
    title: 'Edge Ingress & Sensor Ingestion',
    subtitle: 'Municipal Fleet & Mobile Dashcam Ingress',
    description:
      'Continuous 4K 60FPS video capture from municipal patrol trucks, sanitation vehicles, and transit buses with synchronized GPS NMEA coordinates.',
    techStack: ['Dashcam Optic 4K HDR', 'GPS / IMU Telemetry', 'H.265 / HEVC', 'mTLS Streaming'],
    latency: '< 150 ms upload burst',
    protocols: 'HTTPS / WebRTC / S3 Multipart Upload',
    details: {
      purpose: 'Capture real-world pavement conditions across municipal road networks without dedicated survey hardware.',
      inputs: 'Raw optical road video streams, vehicle velocity vectors, timestamped GNSS fixes.',
      outputs: 'Signed S3 upload manifest and partitioned video chunks.',
      failureHandling: 'Local flash ring buffer (128GB) stores encrypted frames during cellular dead zones.',
    },
    codeSnippet: `// Edge Fleet Video Ingestion Manifest
{
  "vehicle_id": "MUNI-PATROL-114",
  "gps_coordinates": { "lat": 34.0522, "lng": -118.2437 },
  "speed_mph": 38.4,
  "codec": "H.265",
  "resolution": "3840x2160@60fps",
  "telemetry_stream_id": "corr-405-n-20261007"
}`,
  },
  {
    id: 'cloud-orchestration',
    category: 'CLOUD',
    stepNumber: '02',
    title: 'Serverless Orchestration & Storage',
    subtitle: 'Amazon S3 & DynamoDB Pavement Store',
    description:
      'Zero-idle serverless pipeline that extracts keyframe sequences, shards work across compute instances, and tracks state machine lifecycle.',
    techStack: ['AWS S3 Intelligent-Tiering', 'DynamoDB', 'AWS Lambda', 'Amazon EventBridge'],
    latency: '18 ms event fan-out',
    protocols: 'REST API / S3 Event Notifications',
    details: {
      purpose: 'Decouple high-bandwidth media ingestion from compute execution while providing an immutable audit trail.',
      inputs: 'Multipart S3 video uploads and upload metadata.',
      outputs: 'Frame extraction events and DynamoDB inspection documents with unique IDs.',
      failureHandling: 'Dead-letter queues (SQS DLQ) with automated 3x retry on failed chunk extraction.',
    },
    codeSnippet: `// DynamoDB Inspection Schema
{
  "InspectionId": "INSP-2026-0881",
  "CreatedAt": "2026-10-07T10:32:00Z",
  "Status": "WAITING_FOR_APPROVAL",
  "DamageClass": "D40",
  "Confidence": 91.4,
  "PersistenceFrames": 7,
  "S3KeyOriginal": "s3://roadguard-raw/runs/0881.mp4",
  "S3KeyEvidence": "s3://roadguard-evidence/0881/"
}`,
  },
  {
    id: 'graviton-compute',
    category: 'COMPUTE',
    stepNumber: '03',
    title: 'AWS Graviton3 Hardware Acceleration',
    subtitle: 'ARM64 c7g.4xlarge Dedicated Fleet',
    description:
      'Custom 64-bit ARM Neoverse V1 cores with NEON SIMD vectorization units delivering 3.42x latency improvement and 73.8% cost savings versus legacy x86.',
    techStack: ['AWS Graviton3 (ARM64)', 'NEON SIMD Registers', 'bfloat16 & INT8', 'Amazon Linux 2023'],
    latency: '14.1 ms per frame',
    protocols: 'PCIe 5.0 / DDR5 Memory Bus',
    details: {
      purpose: 'Deliver high-throughput tensor and image filtering operations at lowest cloud wattage and cost per mile.',
      inputs: 'Decoded video frames loaded directly into memory.',
      outputs: 'Vectorized tensor buffers ready for OpenCV 5 graph kernels.',
      failureHandling: 'Auto-scaling group with minimum 2 instances in multi-AZ configuration.',
    },
    codeSnippet: `// ARM NEON Vectorized Kernel (C++ / OpenCV)
#include <arm_neon.h>
void apply_contrast_neon(uint8_t* src, uint8_t* dst, int len) {
  uint8x16_t vscale = vdupq_n_u8(1.2f);
  for (int i = 0; i < len; i += 16) {
    uint8x16_t data = vld1q_u8(src + i);
    uint8x16_t result = vqmulq_u8(data, vscale);
    vst1q_u8(dst + i, result);
  }
}`,
  },
  {
    id: 'opencv-cool',
    category: 'VISION',
    stepNumber: '04',
    title: 'OpenCV 5 COOL Vision Engine',
    subtitle: 'Optimized Pavement Anomaly Detection',
    description:
      'Computer Vision Optimization & Open-Source Library (COOL) pipeline executing CLAHE filtering, contour analysis, and YOLOv8 INT8 quantization.',
    techStack: ['OpenCV 5.0.0 (COOL)', 'Graph API (G-API)', 'INT8 Quantization', 'Soft-NMS Filter'],
    latency: '8.4 ms detector pass',
    protocols: 'In-Memory G-API Pipelines',
    details: {
      purpose: 'Filter environmental noise (rain reflections, shadows) and localize distress anomalies with pixel-level precision.',
      inputs: 'Raw asphalt image frames.',
      outputs: 'Bounding boxes, class probabilities (D00-D40), and visual contour overlays.',
      failureHandling: 'Graceful fallback to standard bilateral filter if specular glare saturates camera sensor.',
    },
    codeSnippet: `// OpenCV 5 G-API Pipeline Definition
cv::GComputation pipeline([]() {
  cv::GMat in;
  cv::GMat preprocessed = cv::gapi::equalizeHist(in);
  cv::GMat edges = cv::gapi::Canny(preprocessed, 50, 150);
  cv::GOpaque<Detections> out = cv::gapi::infer<RDDNet>(preprocessed);
  return cv::GComputation(cv::GIn(in), cv::GOut(out, edges));
});`,
  },
  {
    id: 'agentic-loop',
    category: 'AGENT',
    stepNumber: '05',
    title: 'RoadGuard Agentic Decision Loop',
    subtitle: 'Multi-Frame Temporal Persistence Engine',
    description:
      'Multi-stage agent that observes initial candidates, verifies confidence, requests re-inspection buffers when uncertain, and confirms persistence across consecutive frames.',
    techStack: ['Temporal Voting Engine', 'Markov Decision Process', 'Severity Scorer', 'Rule Engine'],
    latency: '22 ms consensus loop',
    protocols: 'State Machine Event Stream',
    details: {
      purpose: 'Eliminate false positives by requiring damage to persist across temporal frames before generating work orders.',
      inputs: 'Stream of frame-by-frame detections from OpenCV COOL.',
      outputs: 'Consensus distress classification, severity assessment, and generated report brief.',
      failureHandling: 'Low confidence automatically triggers re-inspection buffer request; discarded if non-persistent.',
    },
    codeSnippet: `// Agentic Re-inspection & Persistence Consensus
async function evaluatePersistence(frameStream: Detection[]) {
  const candidate = frameStream[0];
  if (candidate.confidence < 0.75) {
    // Low confidence guard: request additional temporal frames
    const recheckFrames = await bufferService.requestWindow(candidate.time, 7);
    const confirmedCount = recheckFrames.filter(f => f.hasMatch(candidate)).length;
    if (confirmedCount >= 5) {
      return { status: "CONFIRMED", confidence: 0.91, severity: "HIGH" };
    }
    return { status: "DISCARDED_TRANSIENT" };
  }
}`,
  },
  {
    id: 'human-governance',
    category: 'HUMAN',
    stepNumber: '06',
    title: 'Human-in-the-Loop Municipal Sign-off',
    subtitle: 'Mandatory Supervisory Review Gate',
    description:
      'Strict governance interface requiring certified municipal engineers to review high-severity work orders before contractor dispatch.',
    techStack: ['Role-Based Access Control', 'Digital Signatures', 'Municipal ERP Export', 'Work Order PDF'],
    latency: 'Asynchronous (Supervisor SLA)',
    protocols: 'REST Webhooks / Open311 Protocol',
    details: {
      purpose: 'Ensure municipal accountability and prevent erroneous road closures or unnecessary public spending.',
      inputs: 'Evidence-backed maintenance brief with multi-frame filmstrip.',
      outputs: 'Authorized work order, contractor dispatch ticket, or documented rejection reason.',
      failureHandling: 'Rejection returns feedback to training archive for active learning re-training.',
    },
    codeSnippet: `// Municipal Sign-off Authorization Payload
{
  "work_order_id": "REP-2026-0881",
  "inspection_id": "INSP-2026-0881",
  "authorized_by": "Sarah Chen, PE",
  "supervisor_badge": "PW-4482",
  "status": "APPROVED",
  "dispatch_priority": "CRITICAL_24HR",
  "contractor_payload": {
    "material": "Hot-Mix Asphalt (HMA)",
    "square_meters": 1.4,
    "closure_lane": 2
  }
}`,
  },
];

export const SystemArchitecture: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<ArchitectureNode>(ARCHITECTURE_NODES[4]); // Default to Agentic Loop
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  const filteredNodes = ARCHITECTURE_NODES.filter(
    (n) => filterCategory === 'ALL' || n.category === filterCategory
  );

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-2">
            CLOUD & HARDWARE PIPELINE SPECIFICATION // SYSTEM TOPOLOGY
          </div>
          <h1 className="font-sans font-semibold text-4xl sm:text-5xl tracking-tighter leading-[0.9] text-white">
            System Architecture
          </h1>
          <p className="text-slate-400 text-sm mt-3 font-light max-w-2xl font-sans">
            End-to-end telemetry overview tracing data flow from edge patrol fleet to AWS Graviton3 compute, OpenCV 5 COOL accelerated kernels, the agentic reasoning loop, and human supervisory sign-off.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.15em] text-slate-400 bg-white/[0.03] border border-white/10 px-4 py-2 rounded-card">
          <Server className="w-3.5 h-3.5 text-slate-400" />
          <span>PRODUCTION BLUEPRINT v2.4</span>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-slate-500 mr-2">
          FOCUS LAYER:
        </span>
        {[
          { id: 'ALL', label: 'ALL LAYERS' },
          { id: 'EDGE', label: 'EDGE & SENSORS' },
          { id: 'CLOUD', label: 'CLOUD INGESTION' },
          { id: 'COMPUTE', label: 'GRAVITON ARM' },
          { id: 'VISION', label: 'OPENCV COOL' },
          { id: 'AGENT', label: 'AGENTIC ENGINE' },
          { id: 'HUMAN', label: 'HUMAN GOVERNANCE' },
        ].map((btn) => (
          <button
            key={btn.id}
            onClick={() => setFilterCategory(btn.id)}
            className={`font-mono text-[11px] uppercase tracking-[0.2em] px-3.5 py-1.5 rounded-lg transition-all ${
              filterCategory === btn.id
                ? 'bg-white/15 text-white font-bold border border-white/20'
                : 'text-slate-400 hover:text-white border border-transparent'
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Main Architecture Workspace: Left Vertical Flow (7 cols), Right Inspector (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Vertical Pipeline Nodes (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {filteredNodes.map((node, index) => {
            const isSelected = selectedNode.id === node.id;
            return (
              <div key={node.id} className="relative">
                {/* Node Card */}
                <div
                  onClick={() => setSelectedNode(node)}
                  className={`p-6 rounded-card transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-white/[0.06] border-white/30 shadow-[0_0_25px_rgba(255,255,255,0.06)]'
                      : 'glass-surface border-white/[0.08] hover:border-white/20 hover:bg-white/[0.03]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-white/[0.08] text-white border border-white/15">
                        {node.stepNumber}
                      </span>
                      <div>
                        <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-slate-500">
                          {node.category} LAYER
                        </span>
                        <h3 className="font-sans font-semibold text-2xl text-white">
                          {node.title}
                        </h3>
                      </div>
                    </div>

                    <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-slate-400 text-right">
                      {node.latency}
                    </div>
                  </div>

                  <p className="font-sans text-xs text-slate-400 font-light leading-relaxed mb-4">
                    {node.description}
                  </p>

                  {/* Tech Tags */}
                  <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-white/[0.06]">
                    {node.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 rounded bg-white/[0.03] text-slate-300 border border-white/10"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Connector Arrow (if not last) */}
                {index < filteredNodes.length - 1 && (
                  <div className="flex justify-center my-2 text-slate-600">
                    <ArrowDown className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right Column: Node Deep-Dive Inspector (5 cols, sticky) */}
        <div className="lg:col-span-5 sticky top-24 space-y-6">
          <div className="p-8 rounded-card glass-surface border border-white/20 space-y-6 bg-black/80">
            {/* Inspector Header */}
            <div className="pb-4 border-b border-white/[0.08]">
              <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-1">
                <span>COMPONENT INSPECTOR</span>
                <span className="text-white font-bold">{selectedNode.stepNumber} // {selectedNode.category}</span>
              </div>
              <h2 className="font-sans font-semibold text-3xl text-white">
                {selectedNode.title}
              </h2>
              <p className="font-mono text-xs text-slate-400 mt-1">
                {selectedNode.subtitle}
              </p>
            </div>

            {/* Spec Attributes */}
            <div className="grid grid-cols-2 gap-4 font-mono text-xs">
              <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06]">
                <span className="text-slate-500 text-[9px] uppercase tracking-wider block mb-1">
                  LATENCY PROFILE
                </span>
                <span className="text-white font-bold">{selectedNode.latency}</span>
              </div>
              <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06]">
                <span className="text-slate-500 text-[9px] uppercase tracking-wider block mb-1">
                  COMMUNICATION PROTOCOL
                </span>
                <span className="text-white font-semibold truncate block">{selectedNode.protocols}</span>
              </div>
            </div>

            {/* Functional Details */}
            <div className="space-y-3 font-sans text-xs">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500 block mb-1">
                  ARCHITECTURAL PURPOSE
                </span>
                <p className="text-slate-300 font-light leading-relaxed">
                  {selectedNode.details.purpose}
                </p>
              </div>

              <div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500 block mb-1">
                  PRIMARY INPUTS & UPSTREAM DEPENDENCIES
                </span>
                <p className="text-slate-400 font-light">
                  {selectedNode.details.inputs}
                </p>
              </div>

              <div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500 block mb-1">
                  DOWNSTREAM OUTPUTS & CONTRACTS
                </span>
                <p className="text-slate-400 font-light">
                  {selectedNode.details.outputs}
                </p>
              </div>

              <div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500 block mb-1">
                  RESILIENCE & FAULT TOLERANCE
                </span>
                <p className="text-slate-400 font-light">
                  {selectedNode.details.failureHandling}
                </p>
              </div>
            </div>

            {/* Code / Schema Payload Snippet */}
            {selectedNode.codeSnippet && (
              <div className="pt-4 border-t border-white/[0.08]">
                <div className="flex items-center justify-between mb-2 font-mono text-[10px] uppercase tracking-wider text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <Code className="w-3.5 h-3.5" />
                    TECHNICAL ARTIFACT SPEC
                  </span>
                </div>
                <pre className="p-4 rounded-lg bg-black/90 border border-white/10 font-mono text-[11px] text-slate-300 overflow-x-auto leading-relaxed max-h-64">
                  <code>{selectedNode.codeSnippet}</code>
                </pre>
              </div>
            )}
          </div>

          {/* Architectural Design Principles Box */}
          <div className="p-6 rounded-card glass-surface border border-white/[0.08] space-y-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500 block">
              CORE PRINCIPLES
            </span>
            <div className="space-y-2 text-xs font-sans text-slate-300 font-light">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span><strong>No Single-Shot Decisions:</strong> Evidence is gathered across temporal frames before raising alerts.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span><strong>Hardware-Conscious Vision:</strong> ARM Graviton3 NEON SIMD ensures continuous 60 FPS scanning at 73.8% lower cost.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span><strong>Mandatory Human Authorization:</strong> Zero autonomous contractor dispatch without engineer sign-off.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemArchitecture;
