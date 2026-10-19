import React from 'react';
import {
  ArrowLeft,
  FolderGit2,
  MapPin,
  Calendar,
  FileText,
  Upload,
  GitCompare,
  Edit2,
  FileCheck2,
  ExternalLink,
  Trash2,
  ShieldCheck,
} from 'lucide-react';
import { LandCase, LandDocument, ComparisonReport } from '../../types';

interface CaseDetailViewProps {
  landCase: LandCase;
  documents: LandDocument[];
  reports: ComparisonReport[];
  onBack: () => void;
  onEditCase: () => void;
  onUploadDocToCase: (caseId: string) => void;
  onInspectDoc: (doc: LandDocument) => void;
  onDeleteDoc: (docId: string) => void;
  onStartComparison: (caseId: string, docAId?: string, docBId?: string) => void;
  onOpenReport: (reportId: string) => void;
}

export const CaseDetailView: React.FC<CaseDetailViewProps> = ({
  landCase,
  documents,
  reports,
  onBack,
  onEditCase,
  onUploadDocToCase,
  onInspectDoc,
  onDeleteDoc,
  onStartComparison,
  onOpenReport,
}) => {
  const caseReports = reports.filter((r) => r.caseId === landCase.id);

  const getDocTypeBadge = (type: LandDocument['documentType']) => {
    switch (type) {
      case 'deed':
        return <span className="text-[11px] font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-sm">Deed · সাফ-কবলা দলিল</span>;
      case 'khatian':
        return <span className="text-[11px] font-medium text-blue-800 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-sm">Khatian · খতিয়ান রেকর্ড</span>;
      case 'mutation_record':
        return <span className="text-[11px] font-medium text-purple-800 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-sm">Mutation · নামজারি পরোয়ানা</span>;
      case 'map':
        return <span className="text-[11px] font-medium text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-sm">Map · মৌজা নকশা</span>;
      default:
        return <span className="text-[11px] font-medium text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-sm">Other Record</span>;
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-white border border-slate-200 rounded-md transition-colors"
            title="Return to case directory"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-sm">
                {landCase.caseReference}
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs capitalize text-emerald-700 font-medium font-mono">
                {landCase.status.replace('_', ' ')}
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-1">{landCase.title}</h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onEditCase}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Edit Metadata</span>
          </button>

          <button
            onClick={() => onUploadDocToCase(landCase.id)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Attach Document</span>
          </button>

          {documents.length >= 2 && (
            <button
              onClick={() => onStartComparison(landCase.id, documents[0].id, documents[1].id)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-[#176B45] hover:bg-[#125335] rounded-md transition-colors shadow-xs"
            >
              <GitCompare className="w-4 h-4" />
              <span>Compare 2 Documents</span>
            </button>
          )}
        </div>
      </div>

      {/* Case Metadata Card */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4">
        <h3 className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-2">
          Case Dossier Information
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block mb-0.5">District (জেলা)</span>
            <span className="font-semibold text-slate-800">{landCase.district}</span>
          </div>

          <div>
            <span className="text-slate-400 block mb-0.5">Upazila / Thana (উপজেলা)</span>
            <span className="font-semibold text-slate-800">{landCase.upazila}</span>
          </div>

          <div>
            <span className="text-slate-400 block mb-0.5">Mouza (মৌজা)</span>
            <span className="font-semibold text-slate-800">{landCase.mouza}</span>
          </div>

          <div>
            <span className="text-slate-400 block mb-0.5">Created Date</span>
            <span className="font-mono text-slate-800">
              {new Date(landCase.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        {landCase.notes && (
          <div className="text-xs bg-slate-50 p-3 rounded-md border border-slate-100">
            <span className="font-semibold text-slate-700 block mb-1">Notes & Invariant Audit Goals:</span>
            <p className="text-slate-600 leading-relaxed">{landCase.notes}</p>
          </div>
        )}
      </div>

      {/* Attached Documents Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Attached Documents ({documents.length})
            </h3>
            <p className="text-xs text-slate-500">
              Original land records, extracted metadata fields, and evidence snippets
            </p>
          </div>

          <button
            onClick={() => onUploadDocToCase(landCase.id)}
            className="text-xs text-[#176B45] hover:text-[#125335] font-semibold flex items-center gap-1"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Add Document</span>
          </button>
        </div>

        {documents.length === 0 ? (
          <div className="p-8 text-center bg-white border border-slate-200 rounded-lg space-y-2">
            <FileText className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-xs text-slate-600">No documents attached to this case file yet.</p>
            <button
              onClick={() => onUploadDocToCase(landCase.id)}
              className="text-xs px-3 py-1.5 bg-[#176B45] text-white rounded-md hover:bg-[#125335]"
            >
              Attach First Document
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {documents.map((doc, idx) => {
              const ef = doc.extractedData;
              return (
                <div
                  key={doc.id}
                  className="bg-white border border-slate-200 rounded-lg p-4 space-y-3 hover:border-slate-300 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">
                          {idx === 0 ? 'Document A:' : idx === 1 ? 'Document B:' : `Doc ${idx + 1}:`}
                        </span>
                        <span className="text-sm font-semibold text-slate-800">{doc.name}</span>
                        {getDocTypeBadge(doc.documentType)}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-400">
                        <span>{doc.subType || doc.fileType}</span>
                        <span>·</span>
                        <span>{doc.fileSize}</span>
                        <span>·</span>
                        <span className="text-emerald-700 font-medium">
                          Extraction: {doc.extractionSource === 'gemini_3.8_flash' ? 'Gemini 3.8 Flash' : 'Certified Demo Parser'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onInspectDoc(doc)}
                        className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors flex items-center gap-1.5"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Inspect Fields</span>
                      </button>

                      <button
                        onClick={() => {
                          if (window.confirm(`Remove document "${doc.name}" from this case?`)) {
                            onDeleteDoc(doc.id);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-red-600 rounded-md hover:bg-red-50"
                        title="Remove document"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Extracted Fields Summary Row */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
                    <div className="p-2 bg-slate-50 rounded-md">
                      <span className="text-slate-400 block text-[10px]">Owner Name</span>
                      <span className="font-semibold text-slate-900 truncate block">
                        {ef.ownerName?.value || <span className="text-slate-400 italic font-normal">Missing</span>}
                      </span>
                    </div>

                    <div className="p-2 bg-slate-50 rounded-md">
                      <span className="text-slate-400 block text-[10px]">Khatian #</span>
                      <span className="font-semibold text-slate-900 font-mono block">
                        {ef.khatianNumber?.value || <span className="text-slate-400 italic font-normal">Missing</span>}
                      </span>
                    </div>

                    <div className="p-2 bg-slate-50 rounded-md">
                      <span className="text-slate-400 block text-[10px]">Dag / Plot #</span>
                      <span className="font-semibold text-slate-900 font-mono block">
                        {ef.dagNumber?.value || <span className="text-slate-400 italic font-normal">Missing</span>}
                      </span>
                    </div>

                    <div className="p-2 bg-slate-50 rounded-md">
                      <span className="text-slate-400 block text-[10px]">Land Area</span>
                      <span className="font-semibold text-slate-900 font-mono block">
                        {ef.landArea?.value !== null && ef.landArea?.value !== undefined
                          ? `${ef.landArea.value} ${ef.landUnit?.value || 'Acre'}`
                          : <span className="text-slate-400 italic font-normal">Missing</span>}
                      </span>
                    </div>

                    <div className="p-2 bg-slate-50 rounded-md">
                      <span className="text-slate-400 block text-[10px]">Mouza</span>
                      <span className="font-semibold text-slate-900 truncate block">
                        {ef.mouza?.value || <span className="text-slate-400 italic font-normal">Missing</span>}
                      </span>
                    </div>

                    <div className="p-2 bg-slate-50 rounded-md">
                      <span className="text-slate-400 block text-[10px]">Deed / Date</span>
                      <span className="font-semibold text-slate-900 font-mono text-[11px] truncate block">
                        {ef.deedNumber?.value || ef.documentDate?.value || <span className="text-slate-400 italic font-normal">N/A</span>}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Associated Reports */}
      {caseReports.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Generated Screening Reports ({caseReports.length})
              </h3>
              <p className="text-xs text-slate-500">
                Historical comparison audits and discrepancy checklists
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {caseReports.map((r) => (
              <div
                key={r.id}
                onClick={() => onOpenReport(r.id)}
                className="bg-white border border-slate-200 rounded-lg p-4 hover:border-slate-300 transition-colors cursor-pointer space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-slate-500">{r.caseReference}</span>
                  <span className="text-xs text-slate-400">
                    {new Date(r.generatedAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="font-bold text-sm text-slate-900">{r.caseTitle}</div>

                <div className="flex items-center gap-3 text-xs">
                  <span className="text-emerald-700 font-semibold font-mono tabular-nums">
                    {r.comparisonResult.statusCounts.MATCH} Matches
                  </span>
                  <span>·</span>
                  <span className="text-amber-700 font-semibold font-mono tabular-nums">
                    {r.comparisonResult.statusCounts.MISMATCH} Discrepancies
                  </span>
                  <span>·</span>
                  <span className="text-slate-500 font-mono tabular-nums">
                    {r.comparisonResult.statusCounts.MISSING} Missing
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
