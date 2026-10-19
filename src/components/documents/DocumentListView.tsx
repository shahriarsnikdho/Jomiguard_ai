import React, { useState } from 'react';
import {
  FileText,
  Search,
  Filter,
  Upload,
  Eye,
  Trash2,
  GitCompare,
  Plus,
  Calendar,
  ExternalLink,
} from 'lucide-react';
import { LandDocument, LandCase, DocumentType } from '../../types';

interface DocumentListViewProps {
  documents: LandDocument[];
  cases: LandCase[];
  onUploadDoc: () => void;
  onInspectDoc: (doc: LandDocument) => void;
  onDeleteDoc: (docId: string) => void;
  onStartComparison: (caseId: string, docAId?: string) => void;
}

export const DocumentListView: React.FC<DocumentListViewProps> = ({
  documents,
  cases,
  onUploadDoc,
  onInspectDoc,
  onDeleteDoc,
  onStartComparison,
}) => {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [caseFilter, setCaseFilter] = useState<string>('all');

  const filteredDocs = documents.filter((d) => {
    const matchSearch =
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      (d.extractedData.ownerName?.value || '').toLowerCase().includes(search.toLowerCase()) ||
      (d.extractedData.mouza?.value || '').toLowerCase().includes(search.toLowerCase()) ||
      (d.extractedData.dagNumber?.value || '').includes(search);

    const matchType = typeFilter === 'all' || d.documentType === typeFilter;
    const matchCase = caseFilter === 'all' || d.caseId === caseFilter;

    return matchSearch && matchType && matchCase;
  });

  const getDocTypeBadge = (type: DocumentType) => {
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
        return <span className="text-[11px] font-medium text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-sm">Other</span>;
    }
  };

  const getCaseName = (cId: string) => {
    const c = cases.find((item) => item.id === cId);
    return c ? `${c.caseReference} (${c.title})` : 'Unassigned';
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Document Repository</h2>
          <p className="text-xs text-slate-500">
            Registered deeds, survey khatians, mutation certificates, and extracted fields
          </p>
        </div>
        <button
          onClick={onUploadDoc}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-white bg-[#176B45] hover:bg-[#125335] rounded-md transition-colors shadow-xs"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white border border-slate-200 rounded-lg flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by document name, owner, Mouza, or Dag number..."
            className="w-full text-xs pl-9 pr-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#176B45]/20 focus:border-[#176B45]"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="text-xs px-3 py-2 border border-slate-200 rounded-md focus:outline-none bg-white text-slate-700"
          >
            <option value="all">All Document Types</option>
            <option value="deed">Deed (দলিল)</option>
            <option value="khatian">Khatian (খতিয়ান)</option>
            <option value="mutation_record">Mutation (নামজারি)</option>
            <option value="map">Map (মৌজা নকশা)</option>
          </select>

          <select
            value={caseFilter}
            onChange={(e) => setCaseFilter(e.target.value)}
            className="text-xs px-3 py-2 border border-slate-200 rounded-md focus:outline-none bg-white text-slate-700 max-w-xs"
          >
            <option value="all">All Cases</option>
            {cases.map((c) => (
              <option key={c.id} value={c.id}>
                {c.caseReference}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Documents Table */}
      {filteredDocs.length === 0 ? (
        <div className="p-12 text-center bg-white border border-slate-200 rounded-lg space-y-3">
          <FileText className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-semibold text-slate-800">No Documents Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Upload a land deed or survey khatian scan to start screening.
          </p>
          <button
            onClick={onUploadDoc}
            className="px-4 py-2 text-xs font-medium text-white bg-[#176B45] hover:bg-[#125335] rounded-md transition-colors inline-flex items-center gap-1.5"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Document</span>
          </button>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Document Details</th>
                  <th className="py-3 px-4">Case Dossier</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Dag / Khatian</th>
                  <th className="py-3 px-4">Owner & Area</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDocs.map((doc) => {
                  const ef = doc.extractedData;
                  return (
                    <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900">{doc.name}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {doc.fileSize} · {doc.fileType} · {new Date(doc.uploadedAt).toLocaleDateString()}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="text-slate-800 font-medium">{getCaseName(doc.caseId)}</div>
                      </td>

                      <td className="py-3 px-4">{getDocTypeBadge(doc.documentType)}</td>

                      <td className="py-3 px-4">
                        <div className="space-y-0.5">
                          <div>
                            <span className="text-slate-400">Dag: </span>
                            <span className="font-mono font-semibold text-slate-800">
                              {ef.dagNumber?.value || 'Missing'}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-400">Khatian: </span>
                            <span className="font-mono font-semibold text-slate-800">
                              {ef.khatianNumber?.value || <span className="text-amber-700 italic">Missing</span>}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="space-y-0.5">
                          <div className="font-semibold text-slate-900 truncate max-w-xs">
                            {ef.ownerName?.value || 'Omitted'}
                          </div>
                          <div className="text-slate-600 font-mono text-[11px]">
                            {ef.landArea?.value !== null && ef.landArea?.value !== undefined
                              ? `${ef.landArea.value} ${ef.landUnit?.value || 'Acre'}`
                              : 'Area missing'}
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onInspectDoc(doc)}
                            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-md transition-colors"
                            title="Inspect Extracted Fields"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => onStartComparison(doc.caseId, doc.id)}
                            className="p-1.5 text-slate-600 hover:text-[#176B45] hover:bg-slate-200 rounded-md transition-colors"
                            title="Compare against another document"
                          >
                            <GitCompare className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => {
                              if (window.confirm(`Delete document "${doc.name}"?`)) {
                                onDeleteDoc(doc.id);
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                            title="Delete Document"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
