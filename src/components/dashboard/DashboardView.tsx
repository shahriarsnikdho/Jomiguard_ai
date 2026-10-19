import React from 'react';
import {
  FolderGit2,
  FileText,
  GitCompare,
  AlertTriangle,
  ArrowRight,
  Plus,
  Upload,
  Play,
  Calendar,
  MapPin,
  FileCheck2,
  ShieldAlert,
  Award,
} from 'lucide-react';
import { LandCase, LandDocument, ComparisonResult, ComparisonReport } from '../../types';

interface DashboardViewProps {
  cases: LandCase[];
  documents: LandDocument[];
  comparisons: ComparisonResult[];
  reports: ComparisonReport[];
  onOpenCase: (caseId: string) => void;
  onOpenReport: (reportId: string) => void;
  onNewCase: () => void;
  onUploadDoc: () => void;
  onStartComparison: (caseId?: string) => void;
  onRunDemoCase001: () => void;
  onOpenHackathonDossier?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  cases,
  documents,
  comparisons,
  reports,
  onOpenCase,
  onOpenReport,
  onNewCase,
  onUploadDoc,
  onStartComparison,
  onRunDemoCase001,
  onOpenHackathonDossier,
}) => {
  // Compute items requiring manual review across cases
  const itemsRequiringReview = comparisons.reduce((sum, c) => sum + (c.statusCounts.MISMATCH + c.statusCounts.UNCERTAIN), 0);

  const getStatusBadge = (status: LandCase['status']) => {
    switch (status) {
      case 'active':
        return <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-sm">Active · চালু</span>;
      case 'under_review':
        return <span className="text-xs font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-sm">Under Review · প্রক্রিয়াধীন</span>;
      case 'completed':
        return <span className="text-xs font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded-sm">Completed · সম্পন্ন</span>;
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* LandTech 2026 Hackathon Banner */}
      <div className="p-3.5 bg-gradient-to-r from-emerald-950 via-[#176B45] to-[#125335] text-white rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/10 rounded-md">
            <Award className="w-5 h-5 text-[#D6A84F]" />
          </div>
          <div className="text-xs leading-relaxed">
            <span className="font-bold text-sm tracking-tight text-white block">
              LandTech 2026 — DIU LandTech Innovation Hackathon
            </span>
            <span className="text-emerald-100 text-[11px]">
              Track: Digital Land Records & Verification · Problem P3: Catch Fraud & Multi-Survey Discrepancies
            </span>
          </div>
        </div>

        {onOpenHackathonDossier && (
          <button
            onClick={onOpenHackathonDossier}
            className="px-3 py-1.5 text-xs font-semibold text-slate-900 bg-[#D6A84F] hover:bg-[#c49842] rounded-md transition-colors shrink-0 flex items-center gap-1.5 shadow-xs"
          >
            <span>View Hackathon Dossier</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Disclaimer Banner */}
      <div className="p-4 bg-slate-100 border border-slate-200 rounded-lg flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-[#176B45] shrink-0 mt-0.5" />
        <div className="text-xs text-slate-600 leading-relaxed">
          <strong className="text-slate-900 font-semibold">Preliminary Document Screening Assistant:</strong>{' '}
          JomiGuard AI compares land deeds and survey khatians to highlight textual inconsistencies and omitted records.
          Differences do not prove fraud or determine legal ownership. Always verify original records with the Assistant Commissioner (Land) or Sub-Registry Office.
        </div>
      </div>

      {/* Acceptance Test Hero Callout */}
      <div className="bg-white border border-[#176B45]/30 rounded-xl p-5 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#176B45]/5 rounded-bl-full pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-[#176B45] uppercase tracking-wider">
                Benchmark Acceptance Test Scenario
              </span>
              <span className="text-slate-400">·</span>
              <span className="text-xs font-mono text-slate-500">BD-CASE-2026-001</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              Demo Land Case 001: 1.50 Acre Deed vs 1.25 Acre Mutation Khatian
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Verifies the core acceptance scenario: <strong>Dag 125</strong> (MATCH), <strong>Mouza</strong> (MATCH), <strong>Owner Rahim Uddin</strong> (MATCH), <strong>Khatian</strong> (MISSING), and <strong>Land Area</strong> (MISMATCH delta: 0.25 acres).
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onRunDemoCase001}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#176B45] hover:bg-[#125335] rounded-md transition-colors flex items-center gap-2 shadow-xs"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Launch Case 001 Comparison</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Metric Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white border border-slate-200 rounded-lg space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Total Land Cases</span>
            <FolderGit2 className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900">
            {cases.length}
          </div>
          <div className="text-[11px] text-slate-400">Active land dispute files</div>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-lg space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Documents Loaded</span>
            <FileText className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900">
            {documents.length}
          </div>
          <div className="text-[11px] text-slate-400">Deeds, khatians & maps</div>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-lg space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Comparisons Completed</span>
            <GitCompare className="w-4 h-4 text-[#176B45]" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900">
            {comparisons.length}
          </div>
          <div className="text-[11px] text-slate-400">Dual-document audits</div>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-lg space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Items Requiring Review</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-amber-700">
            {itemsRequiringReview}
          </div>
          <div className="text-[11px] text-slate-400">Area & khatian discrepancies</div>
        </div>
      </div>

      {/* Main Grid: Recent Cases & Recent Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent Cases */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-lg overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Recent Land Cases</h3>
              <p className="text-xs text-slate-500">Active property titles under preliminary review</p>
            </div>
            <button
              onClick={onNewCase}
              className="text-xs text-[#176B45] hover:text-[#125335] font-medium flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Case</span>
            </button>
          </div>

          <div className="divide-y divide-slate-100 overflow-x-auto">
            {cases.slice(0, 5).map((c) => (
              <div
                key={c.id}
                onClick={() => onOpenCase(c.id)}
                className="p-4 hover:bg-slate-50 transition-colors cursor-pointer flex items-center justify-between gap-4"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm text-slate-900 truncate">
                      {c.title}
                    </span>
                    {getStatusBadge(c.status)}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="font-mono">{c.caseReference}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {c.mouza}, {c.upazila}, {c.district}
                    </span>
                    <span>·</span>
                    <span>{c.documentIds.length} Docs attached</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onStartComparison(c.id);
                    }}
                    className="px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
                  >
                    Compare
                  </button>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Quick Actions & Recent Screening Reports */}
        <div className="space-y-6">
          {/* Quick Actions Panel */}
          <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-3">
            <h3 className="text-sm font-semibold text-slate-900">Quick Workflow Actions</h3>
            <div className="space-y-2">
              <button
                onClick={onNewCase}
                className="w-full text-left p-2.5 rounded-lg border border-slate-200 hover:border-[#176B45]/40 hover:bg-[#176B45]/5 transition-colors flex items-center gap-3 text-xs font-medium text-slate-800"
              >
                <div className="w-7 h-7 rounded-md bg-[#176B45]/10 text-[#176B45] flex items-center justify-center shrink-0">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-slate-900 font-semibold">Open New Land Case</div>
                  <div className="text-slate-500 text-[11px]">Register metadata and mouza</div>
                </div>
              </button>

              <button
                onClick={onUploadDoc}
                className="w-full text-left p-2.5 rounded-lg border border-slate-200 hover:border-[#176B45]/40 hover:bg-[#176B45]/5 transition-colors flex items-center gap-3 text-xs font-medium text-slate-800"
              >
                <div className="w-7 h-7 rounded-md bg-amber-500/10 text-amber-700 flex items-center justify-center shrink-0">
                  <Upload className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-slate-900 font-semibold">Upload Deed / Khatian</div>
                  <div className="text-slate-500 text-[11px]">PDF or image document scan</div>
                </div>
              </button>

              <button
                onClick={() => onStartComparison()}
                className="w-full text-left p-2.5 rounded-lg border border-slate-200 hover:border-[#176B45]/40 hover:bg-[#176B45]/5 transition-colors flex items-center gap-3 text-xs font-medium text-slate-800"
              >
                <div className="w-7 h-7 rounded-md bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                  <GitCompare className="w-4 h-4 text-[#176B45]" />
                </div>
                <div>
                  <div className="text-slate-900 font-semibold">Run Dual Document Audit</div>
                  <div className="text-slate-500 text-[11px]">Field-by-field cross screening</div>
                </div>
              </button>
            </div>
          </div>

          {/* Generated Reports list */}
          <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900">Generated Reports</h3>
              <FileCheck2 className="w-4 h-4 text-slate-400" />
            </div>

            {reports.length === 0 ? (
              <p className="text-xs text-slate-500">No reports generated yet.</p>
            ) : (
              <div className="space-y-2">
                {reports.slice(0, 3).map((r) => (
                  <div
                    key={r.id}
                    onClick={() => onOpenReport(r.id)}
                    className="p-2.5 rounded-md border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-900 truncate">
                        {r.caseTitle}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {new Date(r.generatedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="text-slate-500 text-[11px] flex items-center gap-2">
                      <span className="text-emerald-700 font-medium font-mono tabular-nums">
                        {r.comparisonResult.statusCounts.MATCH} Matches
                      </span>
                      <span>·</span>
                      <span className="text-amber-700 font-medium font-mono tabular-nums">
                        {r.comparisonResult.statusCounts.MISMATCH} Discrepancy
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
