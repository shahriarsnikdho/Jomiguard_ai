import React, { useState } from 'react';
import { X, FolderPlus } from 'lucide-react';
import { LandCase, CaseStatus } from '../../types';

interface CreateCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (landCase: LandCase) => void;
  initialData?: LandCase | null;
}

export const CreateCaseModal: React.FC<CreateCaseModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [caseReference, setCaseReference] = useState(
    initialData?.caseReference || `BD-CASE-2026-${Math.floor(100 + Math.random() * 900)}`
  );
  const [district, setDistrict] = useState(initialData?.district || 'Dhaka');
  const [upazila, setUpazila] = useState(initialData?.upazila || '');
  const [mouza, setMouza] = useState(initialData?.mouza || '');
  const [status, setStatus] = useState<CaseStatus>(initialData?.status || 'active');
  const [notes, setNotes] = useState(initialData?.notes || '');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Case title is required.');
      return;
    }
    if (!district.trim() || !upazila.trim() || !mouza.trim()) {
      setError('District, Upazila, and Mouza are mandatory jurisdictional fields.');
      return;
    }

    const newCase: LandCase = {
      id: initialData?.id || `case_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      title: title.trim(),
      caseReference: caseReference.trim(),
      district: district.trim(),
      upazila: upazila.trim(),
      mouza: mouza.trim(),
      notes: notes.trim(),
      status,
      createdAt: initialData?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      documentIds: initialData?.documentIds || [],
    };

    onSave(newCase);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-900 font-semibold text-base">
            <FolderPlus className="w-5 h-5 text-[#176B45]" />
            <span>{initialData ? 'Edit Land Case' : 'Create New Land Case'}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 text-red-700 text-xs rounded-md border border-red-200">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Case Title / Property Reference *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Gazipur Sadar Mouza Dag 125 Title Audit"
              className="w-full text-sm px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#176B45]/20 focus:border-[#176B45]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Internal Case Ref #
              </label>
              <input
                type="text"
                value={caseReference}
                onChange={(e) => setCaseReference(e.target.value)}
                className="w-full text-sm font-mono px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#176B45]/20 focus:border-[#176B45]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as CaseStatus)}
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#176B45]/20 focus:border-[#176B45]"
              >
                <option value="active">Active (চালু)</option>
                <option value="under_review">Under Review (পর্যালোচনাধীন)</option>
                <option value="completed">Completed (সম্পন্ন)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                District (জেলা) *
              </label>
              <input
                type="text"
                required
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                placeholder="e.g. Gazipur, Dhaka"
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#176B45]/20 focus:border-[#176B45]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Upazila (উপজেলা) *
              </label>
              <input
                type="text"
                required
                value={upazila}
                onChange={(e) => setUpazila(e.target.value)}
                placeholder="e.g. Gazipur Sadar"
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#176B45]/20 focus:border-[#176B45]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Mouza (মৌজা) *
              </label>
              <input
                type="text"
                required
                value={mouza}
                onChange={(e) => setMouza(e.target.value)}
                placeholder="e.g. Demo Mouza"
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#176B45]/20 focus:border-[#176B45]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Case Notes & Objectives
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notes on known dispute, deed numbers to cross-check, or mutation inquiries..."
              className="w-full text-sm px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#176B45]/20 focus:border-[#176B45]"
            />
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-medium text-white bg-[#176B45] hover:bg-[#125335] rounded-md transition-colors shadow-xs"
            >
              {initialData ? 'Update Case' : 'Create Case File'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
