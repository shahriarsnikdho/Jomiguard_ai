import React, { useState, useEffect } from 'react';
import {
  GitCompare,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  ShieldAlert,
  FileCheck2,
  FileText,
  Play,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { LandCase, LandDocument, ComparisonResult, ComparisonStatus, ComparisonReport } from '../../types';
import { executeDocumentComparison } from '../../lib/comparisonEngine';

interface ComparisonViewProps {
  cases: LandCase[];
  documents: LandDocument[];
  initialCaseId?: string;
  initialDocAId?: string;
  initialDocBId?: string;
  onSaveReport: (report: ComparisonReport) => void;
  onOpenReport: (reportId: string) => void;
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({
  cases,
  documents,
  initialCaseId,
  initialDocAId,
  initialDocBId,
  onSaveReport,
  onOpenReport,
}) => {
  const [selectedCaseId, setSelectedCaseId] = useState<string>(
    initialCaseId || cases[0]?.id || ''
  );

  const availableDocs = documents.filter((d) => d.caseId === selectedCaseId);

  const [docAId, setDocAId] = useState<string>(
    initialDocAId || availableDocs[0]?.id || ''
  );
  const [docBId, setDocBId] = useState<string>(
    initialDocBId || availableDocs[1]?.id || ''
  );

  const [comparisonResult, setComparisonResult] = useState<ComparisonResult | null>(null);

  // Synchronize document selections when case changes
  useEffect(() => {
    const docs = documents.filter((d) => d.caseId === selectedCaseId);
    if (docs.length >= 2) {
      // If previous selection isn't in current case, select first 2
      const hasA = docs.some((d) => d.id === docAId);
      const hasB = docs.some((d) => d.id === docBId);
      if (!hasA) setDocAId(docs[0].id);
      if (!hasB || docs[0].id === docs[1]?.id) setDocBId(docs[1]?.id || '');
    }
  }, [selectedCaseId]);

  // Execute comparison when documents or case change
  useEffect(() => {
    if (!docAId || !docBId || docAId === docBId) {
      setComparisonResult(null);
      return;
    }

    const docA = documents.find((d) => d.id === docAId);
    const docB = documents.find((d) => d.id === docBId);
    const targetCase = cases.find((c) => c.id === selectedCaseId);

    if (docA && docB && targetCase) {
      const result = executeDocumentComparison(docA, docB, targetCase.title, targetCase.caseReference);
      setComparisonResult(result);
    }
  }, [docAId, docBId, selectedCaseId, documents]);

  const handleGenerateReport = () => {
    if (!comparisonResult) return;

    const targetCase = cases.find((c) => c.id === selectedCaseId);
    const report: ComparisonReport = {
      id: `report_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      comparisonId: comparisonResult.id,
      caseId: selectedCaseId,
      caseReference: comparisonResult.caseReference,
      caseTitle: comparisonResult.caseTitle,
      generatedAt: new Date().toISOString(),
      executiveSummaryBn: comparisonResult.summaryBn,
      executiveSummaryEn: comparisonResult.summaryEn,
      comparisonResult,
      manualVerificationChecklist: [
        {
          id: 'chk_field_1',
          taskEn: 'Inspect AC Land register for Khatian & Dag lineage.',
          taskBn: 'উপজেলা সহকারী কমিশনার (ভূমি) এসিল্যান্ড অফিসে নামজারি রেকর্ড ও জোত রেজিস্টার যাচাই করুন।',
          authority: 'AC Land Office',
          priority: 'high',
          done: false,
        },
        {
          id: 'chk_field_2',
          taskEn: 'Verify deed volume index at Sub-Registry Office.',
          taskBn: 'সাব-রেজিস্ট্রি অফিসের বালাম বই থেকে দলিলের প্রামাণ্যতা নিশ্চিত করুন।',
          authority: 'Sub-Registry Office',
          priority: 'high',
          done: false,
        },
        {
          id: 'chk_field_3',
          taskEn: 'Obtain certified Khatian copy from DC Record Room.',
          taskBn: 'জেলা প্রশাসকের রেকর্ড রুম থেকে সার্টিফাইড পর্চা উত্তোলন করুন।',
          authority: 'DC Record Room',
          priority: 'medium',
          done: false,
        },
      ],
      disclaimerEn:
        'AI-assisted preliminary screening only. Differences do not prove fraud or determine legal ownership. Verify original records with the appropriate authority or a qualified professional.',
      disclaimerBn:
        'এআই-সহায়তাপ্রাপ্ত প্রাথমিক বাছাইকরণ রিপোর্ট মাত্র। তথ্যের অমিল কোনোভাবেই জালিয়াতি বা মালিকানার চূড়ান্ত প্রামাণ্যতা নির্ধারণ করে না। প্রয়োজনীয় মূল নথি সংশ্লিষ্ট ভূমি কর্তৃপক্ষ বা যোগ্য আইনজীবীর মাধ্যমে যাচাই করুন।',
      isDemoData: true,
    };

    onSaveReport(report);
    onOpenReport(report.id);
  };

  const getStatusBadge = (status: ComparisonStatus) => {
    switch (status) {
      case 'MATCH':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2.5 py-1 rounded-sm">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>MATCH · মিল</span>
          </span>
        );
      case 'MISMATCH':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-900 bg-amber-100 border border-amber-300 px-2.5 py-1 rounded-sm">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>MISMATCH · অমিল</span>
          </span>
        );
      case 'MISSING':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 bg-slate-100 border border-slate-300 px-2.5 py-1 rounded-sm">
            <HelpCircle className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span>MISSING · অনুল্লেখিত</span>
          </span>
        );
      case 'UNCERTAIN':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-900 bg-blue-100 border border-blue-300 px-2.5 py-1 rounded-sm">
            <AlertTriangle className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span>UNCERTAIN · অনিশ্চিত</span>
          </span>
        );
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">AI Document Comparison Engine</h2>
          <p className="text-xs text-slate-500">
            Deterministic dual-document field alignment, discrepancy detection, and audit reconciliation
          </p>
        </div>

        {comparisonResult && (
          <button
            onClick={handleGenerateReport}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#176B45] hover:bg-[#125335] rounded-md transition-colors shadow-xs"
          >
            <FileCheck2 className="w-4 h-4" />
            <span>Generate Official Report</span>
          </button>
        )}
      </div>

      {/* Mandatory Regulatory Disclaimer */}
      <div className="p-4 bg-slate-100 border border-slate-300 rounded-lg flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-[#176B45] shrink-0 mt-0.5" />
        <div className="text-xs text-slate-700 leading-relaxed">
          <strong className="text-slate-900 font-bold">Preliminary Screening Disclaimer:</strong>{' '}
          AI-assisted preliminary screening only. Differences do not prove fraud or determine legal ownership.
          A discrepancy in area or omitted khatian number is common across survey revisions (CS, SA, RS, BS) and mutations.
          Verify original records with the Assistant Commissioner (Land) or a qualified advocate.
        </div>
      </div>

      {/* Document Selection Control Center */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Comparison Parameters
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Select Case */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Select Land Case File
            </label>
            <select
              value={selectedCaseId}
              onChange={(e) => setSelectedCaseId(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-md focus:outline-none bg-white font-medium"
            >
              {cases.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.caseReference} — {c.title}
                </option>
              ))}
            </select>
          </div>

          {/* Select Document A */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Document A (Primary / Baseline)
            </label>
            <select
              value={docAId}
              onChange={(e) => setDocAId(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-md focus:outline-none bg-white font-medium"
            >
              {availableDocs.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.documentType})
                </option>
              ))}
            </select>
          </div>

          {/* Select Document B */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Document B (Secondary / Comparison)
            </label>
            <select
              value={docBId}
              onChange={(e) => setDocBId(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-md focus:outline-none bg-white font-medium"
            >
              {availableDocs.map((d) => (
                <option key={d.id} value={d.id} disabled={d.id === docAId}>
                  {d.name} ({d.documentType}) {d.id === docAId ? '(Already selected as Doc A)' : ''}
                </option>
              ))}
            </select>
          </div>
        </div>

        {availableDocs.length < 2 && (
          <div className="p-3 bg-amber-50 text-amber-800 text-xs rounded-md border border-amber-200">
            This case file has fewer than 2 documents attached. Please attach another document to execute dual comparison.
          </div>
        )}
      </div>

      {/* Comparison Results Card */}
      {comparisonResult && (
        <div className="space-y-6">
          {/* Status Breakdown Bar */}
          <div className="bg-white border border-slate-200 rounded-lg p-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-xs font-medium">
              <span className="text-slate-500">Screening Status:</span>
              <div className="flex items-center gap-1.5 text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md font-mono tabular-nums">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>{comparisonResult.statusCounts.MATCH} MATCH</span>
              </div>
              <div className="flex items-center gap-1.5 text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md font-mono tabular-nums">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>{comparisonResult.statusCounts.MISMATCH} MISMATCH</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md font-mono tabular-nums">
                <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
                <span>{comparisonResult.statusCounts.MISSING} MISSING</span>
              </div>
              {comparisonResult.statusCounts.UNCERTAIN > 0 && (
                <div className="flex items-center gap-1.5 text-blue-800 bg-blue-50 px-2.5 py-1 rounded-md font-mono tabular-nums">
                  <AlertTriangle className="w-3.5 h-3.5 text-blue-600" />
                  <span>{comparisonResult.statusCounts.UNCERTAIN} UNCERTAIN</span>
                </div>
              )}
            </div>

            <div className="text-xs text-slate-500">
              Overall Result:{' '}
              <strong
                className={`uppercase ${
                  comparisonResult.overallVerdict === 'consistent'
                    ? 'text-emerald-700'
                    : 'text-amber-700'
                }`}
              >
                {comparisonResult.overallVerdict.replace('_', ' ')}
              </strong>
            </div>
          </div>

          {/* Executive Summaries */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-1">
              <span className="text-xs font-semibold text-[#176B45] block">
                বাংলায় বিশ্লেষণ সারসংক্ষেপ:
              </span>
              <p className="text-xs text-slate-800 leading-relaxed font-sans">
                {comparisonResult.summaryBn}
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-1">
              <span className="text-xs font-semibold text-slate-700 block">
                Executive Screening Summary (English):
              </span>
              <p className="text-xs text-slate-800 leading-relaxed">
                {comparisonResult.summaryEn}
              </p>
            </div>
          </div>

          {/* Detailed Field Comparison Table */}
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">
                Deterministic Field Comparison Matrix
              </h3>
              <span className="text-xs text-slate-500">7 Core Registry Invariants</span>
            </div>

            <div className="divide-y divide-slate-200">
              {comparisonResult.fields.map((field) => (
                <div key={field.fieldKey} className="p-5 hover:bg-slate-50 transition-colors space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="font-bold text-sm text-slate-900">
                        {field.labelEn}
                      </span>
                      <span className="text-xs text-slate-400 ml-2 font-normal">
                        ({field.labelBn})
                      </span>
                    </div>
                    {getStatusBadge(field.status)}
                  </div>

                  {/* Side-by-side Document Values */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                      <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                        Document A ({comparisonResult.docAName})
                      </div>
                      <div className="text-sm font-bold font-mono text-slate-900">
                        {field.docAValue || (
                          <span className="text-slate-400 italic font-normal">
                            [Value Missing / Omitted]
                          </span>
                        )}
                      </div>
                      {field.evidenceA && (
                        <div className="text-[11px] text-slate-500 italic bg-white p-1.5 rounded-sm border border-slate-100">
                          Evidence: "{field.evidenceA}"
                        </div>
                      )}
                    </div>

                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                      <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                        Document B ({comparisonResult.docBName})
                      </div>
                      <div className="text-sm font-bold font-mono text-slate-900">
                        {field.docBValue || (
                          <span className="text-slate-400 italic font-normal">
                            [Value Missing / Omitted]
                          </span>
                        )}
                      </div>
                      {field.evidenceB && (
                        <div className="text-[11px] text-slate-500 italic bg-white p-1.5 rounded-sm border border-slate-100">
                          Evidence: "{field.evidenceB}"
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Explanations & Recommended Manual Action */}
                  <div className="text-xs space-y-1.5 pt-1">
                    <div className="text-slate-700 leading-relaxed">
                      <strong>Analysis:</strong> {field.explanation}
                    </div>
                    <div className="text-slate-600 leading-relaxed font-sans text-[11px]">
                      <strong>বিশ্লেষণ:</strong> {field.explanationBn}
                    </div>

                    <div className="p-2.5 bg-[#176B45]/5 border border-[#176B45]/20 rounded-md text-[11px] text-[#176B45] leading-relaxed">
                      <strong className="text-slate-900">Recommended Verification Action:</strong>{' '}
                      {field.recommendedAction} ({field.recommendedActionBn})
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
