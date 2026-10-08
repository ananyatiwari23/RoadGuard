import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getInspectionHistory } from '../services/api';
import { InspectionSummary, DamageClass, Severity, DAMAGE_CLASSES } from '../types';
import { StatusBadge } from '../components/ui/StatusBadge';
import { SeverityBadge } from '../components/ui/SeverityBadge';
import { DamageClassChip } from '../components/ui/DamageClassChip';
import { ConfidenceBar } from '../components/ui/ConfidenceBar';
import { LoadingState } from '../components/ui/LoadingState';
import { EmptyState } from '../components/ui/EmptyState';
import { ErrorState } from '../components/ui/ErrorState';
import {
  Search,
  Filter,
  LayoutGrid,
  List,
  Video,
  Image as ImageIcon,
  ArrowRight,
  ExternalLink,
  SlidersHorizontal,
  RotateCcw,
  Download,
  Calendar,
  Layers,
  Sparkles,
} from 'lucide-react';

export const InspectionHistory: React.FC = () => {
  const navigate = useNavigate();
  const [inspections, setInspections] = useState<InspectionSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMediaType, setSelectedMediaType] = useState<'all' | 'VIDEO' | 'IMAGE'>('all');
  const [selectedDamageClass, setSelectedDamageClass] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const loadData = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getInspectionHistory();
      setInspections(data);
    } catch (err: any) {
      console.error('Failed to load inspection history:', err);
      setError(err?.message || 'Failed to load inspection telemetry.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Filtered Inspections
  const filteredInspections = useMemo(() => {
    return inspections.filter((item) => {
      // Search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesId = item.id.toLowerCase().includes(query);
        const label = DAMAGE_CLASSES[item.damageClass]?.label || '';
        const matchesType = item.damageClass.toLowerCase().includes(query) || label.toLowerCase().includes(query);
        if (!matchesId && !matchesType) {
          return false;
        }
      }

      // Media type
      if (selectedMediaType !== 'all' && item.inputType !== selectedMediaType) {
        return false;
      }

      // Damage class
      if (selectedDamageClass !== 'all' && item.damageClass !== selectedDamageClass) {
        return false;
      }

      // Severity
      if (selectedSeverity !== 'all' && item.severity !== selectedSeverity) {
        return false;
      }

      // Status
      if (selectedStatus !== 'all' && item.status !== selectedStatus) {
        return false;
      }

      return true;
    });
  }, [inspections, searchQuery, selectedMediaType, selectedDamageClass, selectedSeverity, selectedStatus]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedMediaType('all');
    setSelectedDamageClass('all');
    setSelectedSeverity('all');
    setSelectedStatus('all');
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Input Type', 'Damage Class', 'Damage Label', 'Confidence', 'Frames Checked', 'Severity', 'Status', 'Date'];
    const rows = filteredInspections.map((i) => [
      i.id,
      i.inputType,
      i.damageClass,
      `"${DAMAGE_CLASSES[i.damageClass]?.label || i.damageClass}"`,
      `${i.confidence}%`,
      i.framesChecked,
      i.severity,
      i.status,
      `"${i.createdAt}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `roadguard_inspections_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // KPI calculations
  const totalCount = inspections.length;
  const highSeverityCount = inspections.filter((i) => i.severity === 'HIGH').length;
  const pendingCount = inspections.filter((i) => i.status === 'WAITING_FOR_APPROVAL').length;
  const approvedCount = inspections.filter((i) => i.status === 'APPROVED').length;

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Page Title & KPI Banner */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-2">
            AUDIT ARCHIVE // HISTORICAL TELEMETRY
          </div>
          <h1 className="font-sans font-semibold text-4xl sm:text-5xl tracking-tighter leading-[0.9] text-white">
            Inspection History & Audit Trail
          </h1>
          <p className="text-slate-400 text-sm mt-3 font-light max-w-2xl font-sans">
            Comprehensive audit registry of all autonomous video runs, still observations, temporal persistence checks, and municipal sign-offs.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2.5 rounded-card border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] text-white font-mono text-[11px] uppercase tracking-[0.2em] transition-all"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            EXPORT CSV
          </button>
          <Link
            to="/new"
            className="flex items-center gap-2 px-5 py-2.5 rounded-card silver-gradient-bg text-black font-mono text-[11px] font-bold uppercase tracking-[0.2em] hover:opacity-90 shadow-[0_0_20px_rgba(255,255,255,0.15)] transition-all"
          >
            NEW INSPECTION
          </Link>
        </div>
      </div>

      {/* KPI Counters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-card glass-surface border border-white/[0.06]">
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-slate-500 block mb-1">
            TOTAL INSPECTIONS
          </span>
          <div className="font-sans font-semibold text-3xl text-white">{totalCount}</div>
        </div>
        <div className="p-4 rounded-card glass-surface border border-white/[0.06]">
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-slate-500 block mb-1">
            HIGH HAZARDS
          </span>
          <div className="font-sans font-semibold text-3xl" style={{ color: '#E5484D' }}>
            {highSeverityCount}
          </div>
        </div>
        <div className="p-4 rounded-card glass-surface border border-white/[0.06]">
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-slate-500 block mb-1">
            WAITING APPROVAL
          </span>
          <div className="font-sans font-semibold text-3xl" style={{ color: '#F5A524' }}>
            {pendingCount}
          </div>
        </div>
        <div className="p-4 rounded-card glass-surface border border-white/[0.06]">
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-slate-500 block mb-1">
            AUTHORIZED SIGNOFFS
          </span>
          <div className="font-sans font-semibold text-3xl" style={{ color: '#30A46C' }}>
            {approvedCount}
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-5 rounded-card glass-surface border border-white/[0.08] space-y-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 stroke-[1.5]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ID or damage type..."
              className="w-full pl-10 pr-4 py-2 bg-black/40 border border-white/10 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-white/30 font-sans"
            />
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 p-1 bg-black/50 border border-white/10 rounded-lg self-start md:self-auto">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded transition-colors ${
                viewMode === 'table' ? 'bg-white/15 text-white' : 'text-slate-500 hover:text-slate-300'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded transition-colors ${
                viewMode === 'grid' ? 'bg-white/15 text-white' : 'text-slate-500 hover:text-slate-300'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter Dropdowns Bar */}
        <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-white/[0.06] text-xs font-mono">
          <div className="flex items-center gap-1.5 text-slate-500 uppercase tracking-[0.15em] text-[10px] mr-2">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>FILTERS:</span>
          </div>

          {/* Media Type */}
          <select
            value={selectedMediaType}
            onChange={(e) => setSelectedMediaType(e.target.value as any)}
            className="bg-black/60 border border-white/10 text-slate-300 text-[11px] px-3 py-1.5 rounded-lg focus:outline-none focus:border-white/30"
          >
            <option value="all">MEDIA: ALL</option>
            <option value="VIDEO">VIDEO ONLY</option>
            <option value="IMAGE">IMAGE ONLY</option>
          </select>

          {/* Damage Class */}
          <select
            value={selectedDamageClass}
            onChange={(e) => setSelectedDamageClass(e.target.value)}
            className="bg-black/60 border border-white/10 text-slate-300 text-[11px] px-3 py-1.5 rounded-lg focus:outline-none focus:border-white/30"
          >
            <option value="all">CLASS: ALL</option>
            <option value="D00">D00 — LONGITUDINAL</option>
            <option value="D10">D10 — TRANSVERSE</option>
            <option value="D20">D20 — ALLIGATOR</option>
            <option value="D40">D40 — POTHOLE</option>
          </select>

          {/* Severity */}
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="bg-black/60 border border-white/10 text-slate-300 text-[11px] px-3 py-1.5 rounded-lg focus:outline-none focus:border-white/30"
          >
            <option value="all">SEVERITY: ALL</option>
            <option value="HIGH">HIGH SEVERITY</option>
            <option value="MEDIUM">MEDIUM SEVERITY</option>
            <option value="LOW">LOW SEVERITY</option>
          </select>

          {/* Status */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-black/60 border border-white/10 text-slate-300 text-[11px] px-3 py-1.5 rounded-lg focus:outline-none focus:border-white/30"
          >
            <option value="all">STATUS: ALL</option>
            <option value="WAITING_FOR_APPROVAL">PENDING APPROVAL</option>
            <option value="APPROVED">APPROVED</option>
            <option value="REJECTED">REJECTED</option>
            <option value="PROCESSING">PROCESSING</option>
            <option value="CLOSED">CLOSED</option>
          </select>

          {/* Reset Filters */}
          {(searchQuery ||
            selectedMediaType !== 'all' ||
            selectedDamageClass !== 'all' ||
            selectedSeverity !== 'all' ||
            selectedStatus !== 'all') && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-white uppercase tracking-[0.15em] ml-auto px-2 py-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              CLEAR FILTERS
            </button>
          )}
        </div>
      </div>

      {/* Main Results Display */}
      {error ? (
        <ErrorState
          title="INSPECTION ARCHIVE OFFLINE"
          reason={error}
          onRetry={loadData}
        />
      ) : loading ? (
        <LoadingState variant={viewMode === 'table' ? 'table' : 'card'} count={5} />
      ) : filteredInspections.length === 0 ? (
        <EmptyState
          title="NO MATCHING INSPECTIONS"
          description="No inspection logs match your current search queries and filter parameters."
          action={{
            label: "RESET ALL FILTERS",
            onClick: resetFilters,
          }}
        />
      ) : viewMode === 'table' ? (
        <div className="rounded-card glass-surface overflow-hidden border border-white/[0.08]">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/[0.08] bg-white/[0.01] font-mono text-[9px] uppercase tracking-[0.2em] text-slate-500">
                  <th className="py-4 px-5">ID & TIMESTAMP</th>
                  <th className="py-4 px-4">TYPE</th>
                  <th className="py-4 px-4">RDD2022 DAMAGE</th>
                  <th className="py-4 px-4">CONFIDENCE</th>
                  <th className="py-4 px-4">FRAMES CHECKED</th>
                  <th className="py-4 px-4">SEVERITY</th>
                  <th className="py-4 px-4">LIFECYCLE STATUS</th>
                  <th className="py-4 px-5 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04] text-xs font-sans">
                {filteredInspections.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-white/[0.02] transition-colors group"
                  >
                    {/* ID & Date */}
                    <td className="py-4 px-5">
                      <div className="font-mono text-xs font-semibold text-white tracking-wider">
                        {item.id}
                      </div>
                      <div className="font-mono text-[10px] text-slate-500 mt-0.5">
                        {item.createdAt}
                      </div>
                    </td>

                    {/* Input Media */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        {item.inputType === 'VIDEO' ? (
                          <span className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-slate-300 bg-white/[0.04] border border-white/10 px-2 py-0.5 rounded">
                            <Video className="w-3 h-3 text-slate-400" />
                            VIDEO
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-slate-300 bg-white/[0.04] border border-white/10 px-2 py-0.5 rounded">
                            <ImageIcon className="w-3 h-3 text-slate-400" />
                            IMAGE
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Damage */}
                    <td className="py-4 px-4">
                      <DamageClassChip
                        damageClass={item.damageClass as DamageClass}
                        size="sm"
                      />
                    </td>

                    {/* Confidence */}
                    <td className="py-4 px-4 font-mono text-xs text-white">
                      <span className="font-bold">{item.confidence}%</span>
                    </td>

                    {/* Frames Checked */}
                    <td className="py-4 px-4 font-mono text-xs text-slate-300">
                      {item.framesChecked} frames
                    </td>

                    {/* Severity */}
                    <td className="py-4 px-4">
                      <SeverityBadge severity={item.severity as Severity} size="sm" />
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4">
                      <StatusBadge status={item.status as any} size="sm" />
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/live/${item.id}`}
                          className="px-3 py-1.5 rounded-lg border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] text-white font-mono text-[10px] uppercase tracking-[0.15em] transition-colors"
                        >
                          COCKPIT
                        </Link>
                        <Link
                          to={`/inspection/${item.id}`}
                          className="p-1.5 rounded-lg border border-white/10 hover:bg-white/[0.06] text-slate-400 hover:text-white transition-colors"
                          title="View Telemetry Record"
                        >
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List (below 768px) */}
          <div className="md:hidden divide-y divide-white/[0.06] p-4 space-y-4">
            {filteredInspections.map((item) => (
              <div key={item.id} className="pt-3 first:pt-0 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-white">{item.id}</span>
                  <span className="font-mono text-[10px] text-slate-500">{item.createdAt}</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <DamageClassChip damageClass={item.damageClass} size="sm" />
                  <div className="flex items-center gap-2">
                    <SeverityBadge severity={item.severity} size="sm" />
                    <StatusBadge status={item.status as any} size="sm" />
                  </div>
                </div>
                <div className="flex items-center justify-between font-mono text-[10px] text-slate-400">
                  <span>Confidence: {item.confidence}%</span>
                  <span>{item.framesChecked} frames</span>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <Link
                    to={`/live/${item.id}`}
                    className="flex-1 text-center py-1.5 rounded-lg border border-white/10 bg-white/[0.03] text-white font-mono text-[10px] uppercase tracking-wider"
                  >
                    Cockpit
                  </Link>
                  <Link
                    to={`/inspection/${item.id}`}
                    className="flex-1 text-center py-1.5 rounded-lg silver-gradient-bg text-black font-mono text-[10px] font-bold uppercase tracking-wider"
                  >
                    Details
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Table Footer */}
          <div className="p-4 border-t border-white/[0.06] bg-white/[0.01] flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">
            <span>
              SHOWING {filteredInspections.length} OF {inspections.length} AUDIT RECORDS
            </span>
            <span>OPENCV 5 COOL HARDWARE ACCELERATED</span>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInspections.map((item) => (
            <Link
              key={item.id}
              to={`/inspection/${item.id}`}
              className="block rounded-card glass-surface p-5 hover:border-white/20 border border-white/[0.08] transition-all group"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.08]">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded border border-white/[0.08] bg-white/[0.02] text-slate-400">
                    {item.inputType === 'VIDEO' ? (
                      <Video className="w-3.5 h-3.5 stroke-[1.5]" />
                    ) : (
                      <ImageIcon className="w-3.5 h-3.5 stroke-[1.5]" />
                    )}
                  </div>
                  <div>
                    <span className="font-mono text-xs font-bold text-white group-hover:text-silver-gradient transition-colors">
                      {item.id}
                    </span>
                    <div className="font-mono text-[10px] text-slate-500 uppercase tracking-[0.15em] mt-0.5">
                      {item.createdAt}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <SeverityBadge severity={item.severity} size="sm" />
                  <StatusBadge status={item.status} size="sm" />
                </div>
              </div>

              <div className="pt-4 space-y-3">
                <div className="grid grid-cols-2 gap-3 items-center">
                  <div>
                    <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-slate-500 block mb-1">
                      CLASSIFICATION
                    </span>
                    <DamageClassChip
                      damageClass={item.damageClass}
                      size="sm"
                    />
                  </div>

                  <div>
                    <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-slate-500 block mb-1">
                      CONFIDENCE
                    </span>
                    <ConfidenceBar confidence={item.confidence} size="sm" />
                  </div>
                </div>

                <div className="flex items-center justify-between font-mono text-[10px] text-slate-500 uppercase tracking-[0.15em] pt-2 border-t border-white/[0.06]">
                  <span>{item.framesChecked} FRAMES INGESTED</span>
                  <span className="flex items-center gap-1 text-slate-300 group-hover:text-white transition-colors">
                    OPEN INSPECTION <ArrowRight className="w-3 h-3 stroke-[2]" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default InspectionHistory;
