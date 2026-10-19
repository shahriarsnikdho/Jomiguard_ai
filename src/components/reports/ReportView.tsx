import React from 'react';
import {
  Printer,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  FileCheck2,
  Share2,
  Calendar,
  Building2,
  CheckSquare,
  Square,
} from 'lucide-react';
import { ComparisonReport } from '../../types';
import { Logo } from '../brand/Logo';

interface ReportViewProps {
  report: ComparisonReport;
  onBack: () => void;
  onToggleChecklist: (reportId: string, itemId: string, done: boolean) => void;
}

export const ReportView: React.FC<ReportViewProps> = ({
  report,
  onBack,
  onToggleChecklist,
}) => {
  const { comparisonResult } = report;

  const handlePrint = () => {
    window.print();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'MATCH':
        return <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-sm">MATCH · মিল</span>;
      case 'MISMATCH':
        return <span className="text-[11px] font-bold text-amber-900 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-sm">MISMATCH · অমিল</span>;
      case 'MISSING':
        return <span className="text-[11px] font-bold text-slate-700 bg-slate-100 border border-slate-300 px-2 py-0.5 rounded-sm">MISSING · অনুল্লেখিত</span>;
      case 'UNCERTAIN':
        return <span className="text-[11px] font-bold text-blue-900 bg-blue-100 border border-blue-300 px-2 py-0.5 rounded-sm">UNCERTAIN · অনিশ্চিত</span>;
      default:
        return null;
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
      {/* Top Action Bar (Hidden in Print) */}
      <div className="flex items-center justify-between no-print">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-md transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Reports Directory</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#176B45] hover:bg-[#125335] rounded-md transition-colors shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save as PDF</span>
          </button>
        </div>
      </div>

      {/* Main Printable Document Card */}
      <div className="bg-white border border-slate-300 rounded-xl p-8 md:p-12 shadow-sm space-y-8 print-container">
        {/* Synthetic Demo Watermark Banner */}
        {report.isDemoData && (
          <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-md text-center text-xs font-bold text-amber-900 tracking-wide uppercase">
            DEMO ONLY — SYNTHETIC DATA FOR PRELIMINARY DOCUMENT SCREENING
          </div>
        )}

        {/* Official Header & Letterhead */}
        <div className="border-b-2 border-slate-900 pb-6 flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-2">
            <Logo size="lg" />
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Land Document Discrepancy & Verification Screening Report
            </h1>
            <p className="text-xs text-slate-500 font-sans">
              জমির দলিল ও খতিয়ান নিরীক্ষা প্রতিবেদন — প্রাথমিক যাচাইকরণ
            </p>
          </div>

          <div className="text-right text-xs space-y-1 font-mono shrink-0">
            <div>
              <span className="text-slate-400">Report ID: </span>
              <strong className="text-slate-900">{report.id}</strong>
            </div>
            <div>
              <span className="text-slate-400">Case Ref: </span>
              <strong className="text-slate-900">{report.caseReference}</strong>
            </div>
            <div>
              <span className="text-slate-400">Date Generated: </span>
              <span className="text-slate-700">
                {new Date(report.generatedAt).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Case & Document Dossier Metadata */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs bg-slate-50 p-4 rounded-lg border border-slate-200">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase">Case Title</span>
            <span className="font-semibold text-slate-900">{report.caseTitle}</span>
          </div>

          <div>
            <span className="text-slate-400 block text-[10px] uppercase">Document A</span>
            <span className="font-semibold text-slate-900 truncate block">
              {comparisonResult.docAName}
            </span>
            <span className="text-[10px] text-slate-500 capitalize">{comparisonResult.docAType}</span>
          </div>

          <div>
            <span className="text-slate-400 block text-[10px] uppercase">Document B</span>
            <span className="font-semibold text-slate-900 truncate block">
              {comparisonResult.docBName}
            </span>
            <span className="text-[10px] text-slate-500 capitalize">{comparisonResult.docBType}</span>
          </div>

          <div>
            <span className="text-slate-400 block text-[10px] uppercase">Overall Screening</span>
            <span
              className={`font-bold uppercase ${
                comparisonResult.overallVerdict === 'consistent'
                  ? 'text-emerald-700'
                  : 'text-amber-800'
              }`}
            >
              {comparisonResult.overallVerdict.replace('_', ' ')}
            </span>
          </div>
        </div>

        {/* Executive Summary in Simple Bengali (সহজ বাংলায় সংক্ষিপ্ত সারসংক্ষেপ) */}
        <div className="p-5 bg-slate-50 border border-slate-300 rounded-lg space-y-2">
          <div className="flex items-center gap-2 text-sm font-bold text-[#176B45]">
            <CheckCircle2 className="w-4 h-4 text-[#176B45]" />
            <span>সহজ বাংলায় সংক্ষিপ্ত সারসংক্ষেপ (Executive Summary in Bengali):</span>
          </div>
          <p className="text-xs text-slate-800 leading-relaxed font-sans whitespace-pre-wrap">
            {report.executiveSummaryBn}
          </p>
        </div>

        {/* English Executive Summary */}
        <div className="p-5 bg-white border border-slate-200 rounded-lg space-y-2">
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
            Executive Summary (English):
          </span>
          <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
            {report.executiveSummaryEn}
          </p>
        </div>

        {/* Comparison Result Table */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-2">
            Field-by-Field Analysis Matrix
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-200">
              <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Field Name</th>
                  <th className="py-2.5 px-3">Document A Value</th>
                  <th className="py-2.5 px-3">Document B Value</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Analysis & Discrepancy Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {comparisonResult.fields.map((field) => (
                  <tr key={field.fieldKey} className="align-top">
                    <td className="py-2.5 px-3 font-semibold text-slate-900">
                      <div>{field.labelEn}</div>
                      <div className="text-[10px] text-slate-400 font-normal">{field.labelBn}</div>
                    </td>

                    <td className="py-2.5 px-3 font-mono font-medium text-slate-800">
                      {field.docAValue || <span className="text-slate-400 italic">[Missing]</span>}
                    </td>

                    <td className="py-2.5 px-3 font-mono font-medium text-slate-800">
                      {field.docBValue || <span className="text-slate-400 italic">[Missing]</span>}
                    </td>

                    <td className="py-2.5 px-3">{getStatusBadge(field.status)}</td>

                    <td className="py-2.5 px-3 text-slate-700 leading-relaxed space-y-1">
                      <div>{field.explanation}</div>
                      <div className="text-[11px] text-slate-500 font-sans">{field.explanationBn}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Manual Verification Checklist */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h3 className="text-sm font-bold text-slate-900">
              Recommended Manual Verification Checklist
            </h3>
            <span className="text-xs text-slate-500 no-print">Click checkboxes to mark progress</span>
          </div>

          <div className="space-y-2">
            {report.manualVerificationChecklist.map((item) => (
              <div
                key={item.id}
                onClick={() => onToggleChecklist(report.id, item.id, !item.done)}
                className={`p-3 rounded-lg border transition-colors flex items-start gap-3 cursor-pointer ${
                  item.done
                    ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                    : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'
                }`}
              >
                <button
                  type="button"
                  className="mt-0.5 text-slate-600 shrink-0"
                >
                  {item.done ? (
                    <CheckSquare className="w-4 h-4 text-[#176B45]" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-400" />
                  )}
                </button>

                <div className="space-y-1 text-xs">
                  <div className={`font-semibold ${item.done ? 'line-through text-slate-500' : ''}`}>
                    {item.taskEn}
                  </div>
                  <div className="text-[11px] text-slate-600 font-sans">
                    {item.taskBn}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-1">
                    <Building2 className="w-3 h-3 text-slate-400" />
                    <span>Authority: <strong>{item.authority}</strong></span>
                    <span>·</span>
                    <span className="uppercase font-semibold text-[#176B45]">
                      Priority: {item.priority}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mandatory Official Disclaimer & Legal Limitations */}
        <div className="p-5 border-t-2 border-slate-200 bg-slate-50 rounded-lg space-y-3 text-xs leading-relaxed text-slate-600">
          <div className="flex items-center gap-2 text-slate-900 font-bold">
            <ShieldCheck className="w-4 h-4 text-[#176B45]" />
            <span>Legal Disclaimer & Limitation of Liability:</span>
          </div>

          <p>
            {report.disclaimerEn}
          </p>

          <p className="font-sans text-[11px] text-slate-700">
            {report.disclaimerBn}
          </p>

          <div className="pt-2 text-[10px] text-slate-400 border-t border-slate-200">
            JomiGuard AI acts strictly as an automated heuristic and optical screening aid. It does not replace the Assistant Commissioner (Land), Sub-Registrar, or a judicial title search.
          </div>
        </div>
      </div>
    </div>
  );
};
