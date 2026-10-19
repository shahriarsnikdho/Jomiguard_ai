import React from 'react';
import {
  FileCheck2,
  Calendar,
  ArrowRight,
  Printer,
  Trash2,
  ShieldAlert,
  GitCompare,
} from 'lucide-react';
import { ComparisonReport } from '../../types';

interface ReportListViewProps {
  reports: ComparisonReport[];
  onOpenReport: (reportId: string) => void;
  onDeleteReport: (reportId: string) => void;
  onNewComparison: () => void;
}

export const ReportListView: React.FC<ReportListViewProps> = ({
  reports,
  onOpenReport,
  onDeleteReport,
  onNewComparison,
}) => {
  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Screening Reports Archive</h2>
          <p className="text-xs text-slate-500">
            Archived document comparison audits, checklist progress, and exportable PDF dossiers
          </p>
        </div>
        <button
          onClick={onNewComparison}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-white bg-[#176B45] hover:bg-[#125335] rounded-md transition-colors shadow-xs"
        >
          <GitCompare className="w-4 h-4" />
          <span>New Comparison Audit</span>
        </button>
      </div>

      {reports.length === 0 ? (
        <div className="p-12 text-center bg-white border border-slate-200 rounded-lg space-y-3">
          <FileCheck2 className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-semibold text-slate-800">No Screening Reports Yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Run an AI Comparison between two documents in any case to generate and export an official screening report.
          </p>
          <button
            onClick={onNewComparison}
            className="px-4 py-2 text-xs font-medium text-white bg-[#176B45] hover:bg-[#125335] rounded-md transition-colors inline-flex items-center gap-1.5"
          >
            <GitCompare className="w-3.5 h-3.5" />
            <span>Start First Comparison</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reports.map((report) => {
            const counts = report.comparisonResult.statusCounts;
            const completedChecklistCount = report.manualVerificationChecklist.filter(
              (c) => c.done
            ).length;

            return (
              <div
                key={report.id}
                className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col justify-between hover:border-slate-300 transition-all space-y-4 shadow-xs"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-sm">
                      {report.caseReference}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {new Date(report.generatedAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div>
                    <h3
                      onClick={() => onOpenReport(report.id)}
                      className="font-bold text-sm text-slate-900 hover:text-[#176B45] cursor-pointer transition-colors leading-snug"
                    >
                      {report.caseTitle}
                    </h3>
                    <div className="mt-1 text-xs text-slate-500 line-clamp-1">
                      {report.comparisonResult.docAName} vs {report.comparisonResult.docBName}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-mono">
                    <span className="text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-sm border border-emerald-200">
                      {counts.MATCH} Matches
                    </span>
                    <span className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded-sm border border-amber-200">
                      {counts.MISMATCH} Discrepancy
                    </span>
                    <span className="text-slate-600 bg-slate-100 px-2 py-0.5 rounded-sm">
                      {counts.MISSING} Missing
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-md leading-relaxed line-clamp-2 font-sans">
                    {report.executiveSummaryBn}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">
                    Checklist: <strong>{completedChecklistCount}/{report.manualVerificationChecklist.length}</strong>
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        if (window.confirm('Delete this saved screening report?')) {
                          onDeleteReport(report.id);
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded-md hover:bg-red-50"
                      title="Delete Report"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => onOpenReport(report.id)}
                      className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold text-white bg-[#176B45] hover:bg-[#125335] rounded-md transition-colors"
                    >
                      <span>View & Print</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
