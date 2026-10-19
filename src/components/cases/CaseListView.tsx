import React, { useState } from 'react';
import {
  FolderGit2,
  Search,
  Filter,
  Plus,
  MapPin,
  Calendar,
  FileText,
  GitCompare,
  ArrowRight,
  Trash2,
  Edit2,
} from 'lucide-react';
import { LandCase } from '../../types';

interface CaseListViewProps {
  cases: LandCase[];
  onOpenCase: (caseId: string) => void;
  onNewCase: () => void;
  onEditCase: (c: LandCase) => void;
  onDeleteCase: (caseId: string) => void;
  onStartComparison: (caseId: string) => void;
}

export const CaseListView: React.FC<CaseListViewProps> = ({
  cases,
  onOpenCase,
  onNewCase,
  onEditCase,
  onDeleteCase,
  onStartComparison,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [districtFilter, setDistrictFilter] = useState<string>('all');

  const districts = Array.from(new Set(cases.map((c) => c.district))).filter(Boolean);

  const filteredCases = cases.filter((c) => {
    const matchSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.caseReference.toLowerCase().includes(search.toLowerCase()) ||
      c.mouza.toLowerCase().includes(search.toLowerCase()) ||
      c.upazila.toLowerCase().includes(search.toLowerCase()) ||
      c.district.toLowerCase().includes(search.toLowerCase());

    const matchStatus = statusFilter === 'all' || c.status === statusFilter;
    const matchDistrict = districtFilter === 'all' || c.district === districtFilter;

    return matchSearch && matchStatus && matchDistrict;
  });

  const getStatusBadge = (status: LandCase['status']) => {
    switch (status) {
      case 'active':
        return <span className="text-xs font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-sm">Active</span>;
      case 'under_review':
        return <span className="text-xs font-medium text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-sm">Under Review</span>;
      case 'completed':
        return <span className="text-xs font-medium text-slate-800 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-sm">Completed</span>;
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Land Cases</h2>
          <p className="text-xs text-slate-500">
            Manage Bangladesh land dispute dossiers, title chain documents, and cross-comparisons
          </p>
        </div>
        <button
          onClick={onNewCase}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-white bg-[#176B45] hover:bg-[#125335] rounded-md transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Create Case File</span>
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
            placeholder="Search by case title, reference, Mouza, Upazila or District..."
            className="w-full text-xs pl-9 pr-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#176B45]/20 focus:border-[#176B45]"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs px-3 py-2 border border-slate-200 rounded-md focus:outline-none bg-white text-slate-700"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="under_review">Under Review</option>
            <option value="completed">Completed</option>
          </select>

          <select
            value={districtFilter}
            onChange={(e) => setDistrictFilter(e.target.value)}
            className="text-xs px-3 py-2 border border-slate-200 rounded-md focus:outline-none bg-white text-slate-700"
          >
            <option value="all">All Districts</option>
            {districts.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Cases List */}
      {filteredCases.length === 0 ? (
        <div className="p-12 text-center bg-white border border-slate-200 rounded-lg space-y-3">
          <FolderGit2 className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-semibold text-slate-800">No Land Cases Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            No land cases match your search query or filters. You can clear your filters or create a new case.
          </p>
          <button
            onClick={onNewCase}
            className="px-4 py-2 text-xs font-medium text-white bg-[#176B45] hover:bg-[#125335] rounded-md transition-colors inline-flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create New Case</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCases.map((c) => (
            <div
              key={c.id}
              className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col justify-between hover:border-slate-300 transition-all space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-sm">
                    {c.caseReference}
                  </span>
                  {getStatusBadge(c.status)}
                </div>

                <div>
                  <h3
                    onClick={() => onOpenCase(c.id)}
                    className="font-bold text-sm text-slate-900 hover:text-[#176B45] cursor-pointer transition-colors leading-snug line-clamp-2"
                  >
                    {c.title}
                  </h3>
                  <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>
                      {c.mouza}, {c.upazila}, {c.district}
                    </span>
                  </div>
                </div>

                {c.notes && (
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed bg-slate-50 p-2 rounded-md">
                    {c.notes}
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-mono tabular-nums">{c.documentIds.length}</span>
                  <span>docs</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onStartComparison(c.id)}
                    title="Compare documents in this case"
                    className="p-1.5 text-slate-600 hover:text-[#176B45] hover:bg-slate-100 rounded-md transition-colors"
                  >
                    <GitCompare className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onEditCase(c)}
                    title="Edit Case details"
                    className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      if (window.confirm(`Are you sure you want to delete case "${c.title}"?`)) {
                        onDeleteCase(c.id);
                      }
                    }}
                    title="Delete Case"
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onOpenCase(c.id)}
                    className="ml-1 inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-[#176B45] hover:text-white hover:bg-[#176B45] border border-[#176B45]/30 rounded-md transition-all"
                  >
                    <span>Open</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
