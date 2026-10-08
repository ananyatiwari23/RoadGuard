import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getInspectionHistory, getInspectionDetail, getReport } from '../services/api';
import { Inspection, Severity, Report } from '../types';
import { ReportPreview } from '../components/inspection/ReportPreview';
import { LoadingState } from '../components/ui/LoadingState';
import { EmptyState } from '../components/ui/EmptyState';
import {
  FileText,
  Search,
  Filter,
  CheckCircle,
  AlertTriangle,
  Clock,
  Download,
  SlidersHorizontal,
  RotateCcw,
} from 'lucide-react';

export const Reports: React.FC = () => {
  const navigate = useNavigate();
  const [inspections, setInspections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<'all' | Severity>('all');

  useEffect(() => {
    async function loadReports() {
      setLoading(true);
      try {
        const summaries = await getInspectionHistory();
        const fullInspections = await Promise.all(
          summaries.map(async (s) => {
            const insp = await getInspectionDetail(s.id);
            if (insp.reportId) {
              try {
                const rep = await getReport(insp.id);
                return { ...insp, report: rep };
              } catch {
                return insp;
              }
            }
            return insp;
          })
        );
        const withReports = fullInspections.filter(
          (insp) => insp.reportId || ['WAITING_FOR_APPROVAL', 'APPROVED', 'REJECTED'].includes(insp.status)
        );
        setInspections(withReports);
      } catch (err) {
        console.error('Failed to load reports:', err);
      } finally {
        setLoading(false);
      }
    }
    loadReports();
  }, []);

  const filteredInspections = useMemo(() => {
    return inspections.filter((insp) => {
      // Tab filter
      if (activeTab === 'pending' && insp.status !== 'WAITING_FOR_APPROVAL') return false;
      if (activeTab === 'approved' && insp.status !== 'APPROVED') return false;
      if (activeTab === 'rejected' && insp.status !== 'REJECTED') return false;

      // Severity filter
      if (severityFilter !== 'all' && insp.severity !== severityFilter) return false;

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesId = (insp.report?.id || '').toLowerCase().includes(query) || insp.id.toLowerCase().includes(query);
        const matchesTitle = insp.title.toLowerCase().includes(query);
        const matchesLocation = (insp.roadPosition || insp.location || '').toLowerCase().includes(query);
        const matchesRecommendation = (insp.report?.recommendation || '').toLowerCase().includes(query);
        if (!matchesId && !matchesTitle && !matchesLocation && !matchesRecommendation) {
          return false;
        }
      }

      return true;
    });
  }, [inspections, activeTab, severityFilter, searchQuery]);

  // Counts
  const totalCount = inspections.length;
  const pendingCount = inspections.filter((i) => i.status === 'WAITING_FOR_APPROVAL').length;
  const approvedCount = inspections.filter((i) => i.status === 'APPROVED').length;
  const highSeverityCount = inspections.filter((i) => i.severity === 'HIGH').length;

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-2">
            MUNICIPAL WORK ORDERS // CERTIFIED ENGINEERING BRIEFS
          </div>
          <h1 className="font-sans font-semibold text-4xl sm:text-5xl tracking-tighter leading-[0.9] text-white">
            Maintenance Reports
          </h1>
          <p className="text-slate-400 text-sm mt-3 font-light max-w-2xl font-sans">
            Official pavement repair briefs generated with multi-frame OpenCV 5 evidence packets, engineering recommendations, and municipal sign-off status.
          </p>
        </div>

        {/* Header Action */}
        <div className="flex items-center gap-3">
          <Link
            to="/history"
            className="flex items-center gap-2 px-4 py-2.5 rounded-card border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] text-white font-mono text-[11px] uppercase tracking-[0.2em] transition-all"
          >
            INSPECTION ARCHIVE
          </Link>
          <Link
            to="/inspections/new"
            className="flex items-center gap-2 px-5 py-2.5 rounded-card silver-gradient-bg text-black font-mono text-[11px] font-bold uppercase tracking-[0.2em] hover:opacity-90 shadow-[0_0_20px_rgba(255,255,255,0.15)] transition-all"
          >
            NEW INSPECTION
          </Link>
        </div>
      </div>

      {/* Metric Counters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-card glass-surface border border-white/[0.06]">
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-slate-500 block mb-1">
            ACTIVE BRIEFS
          </span>
          <div className="font-sans font-semibold text-3xl text-white">{totalCount}</div>
        </div>
        <div className="p-4 rounded-card glass-surface border border-white/[0.06]">
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-slate-500 block mb-1">
            AWAITING SIGN-OFF
          </span>
          <div className="font-sans font-semibold text-3xl" style={{ color: '#F5A524' }}>
            {pendingCount}
          </div>
        </div>
        <div className="p-4 rounded-card glass-surface border border-white/[0.06]">
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-slate-500 block mb-1">
            AUTHORIZED DISPATCH
          </span>
          <div className="font-sans font-semibold text-3xl" style={{ color: '#30A46C' }}>
            {approvedCount}
          </div>
        </div>
        <div className="p-4 rounded-card glass-surface border border-white/[0.06]">
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-slate-500 block mb-1">
            HIGH HAZARD REPAIRS
          </span>
          <div className="font-sans font-semibold text-3xl" style={{ color: '#E5484D' }}>
            {highSeverityCount}
          </div>
        </div>
      </div>

      {/* Filter and Tab Bar */}
      <div className="space-y-4">
        {/* Primary Status Tabs */}
        <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-white/[0.08]">
          {[
            { id: 'all', label: `ALL WORK ORDERS (${totalCount})` },
            { id: 'pending', label: `AWAITING SIGN-OFF (${pendingCount})` },
            { id: 'approved', label: `AUTHORIZED (${approvedCount})` },
            { id: 'rejected', label: `REJECTED (${inspections.filter((i) => i.status === 'REJECTED').length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`font-mono text-[11px] uppercase tracking-[0.2em] px-4 py-2 rounded-lg transition-all ${
                activeTab === tab.id
                  ? 'bg-white/15 text-white font-bold border border-white/20'
                  : 'text-slate-400 hover:text-white border border-transparent'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Secondary Search & Severity Filter */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 stroke-[1.5]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reports by ID, location, or repair type..."
              className="w-full pl-10 pr-4 py-2 bg-black/40 border border-white/10 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-white/30 font-sans"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.15em] text-slate-500">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>SEVERITY:</span>
            </div>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value as any)}
              className="bg-black/60 border border-white/10 text-slate-300 text-[11px] font-mono px-3 py-1.5 rounded-lg focus:outline-none focus:border-white/30"
            >
              <option value="all">ALL SEVERITIES</option>
              <option value="HIGH">HIGH SEVERITY</option>
              <option value="MEDIUM">MEDIUM SEVERITY</option>
              <option value="LOW">LOW SEVERITY</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reports Grid */}
      {loading ? (
        <LoadingState variant="card" count={6} />
      ) : filteredInspections.length === 0 ? (
        <EmptyState
          title="NO WORK ORDERS FOUND"
          description="No maintenance reports match your current filter and search criteria."
          action={{
            label: "RESET FILTERS",
            onClick: () => {
              setActiveTab('all');
              setSearchQuery('');
              setSeverityFilter('all');
            },
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInspections.map((insp) => {
            const rep: Report = insp.report || {
              id: insp.reportId || `REP-${insp.id.replace('INSP-', '')}`,
              inspectionId: insp.id,
              status: (insp.status === 'APPROVED' ? 'APPROVED' : insp.status === 'REJECTED' ? 'REJECTED' : 'PENDING'),
              severity: insp.severity || 'LOW',
              damageClass: insp.damageClass || 'D00',
              confidence: insp.confidence || 0,
              roadPosition: insp.roadPosition || insp.location || 'Unknown',
              persistenceFrames: insp.persistenceFrames || 0,
              recommendation: 'Standard autonomous pavement assessment work order.',
              evidence: insp.evidence || [],
              generatedAt: insp.createdAt || new Date().toISOString(),
            };
            return (
              <ReportPreview
                key={insp.id}
                report={rep}
                onClick={() => navigate(`/reports/${insp.id}`)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Reports;
