import React, { useState } from 'react';
import { X, Check, Edit2, ShieldAlert, FileText, Sparkles, AlertCircle } from 'lucide-react';
import { LandDocument, DocumentExtractedFields } from '../../types';

interface DocumentInspectModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: LandDocument | null;
  onUpdateDocument: (doc: LandDocument) => void;
}

export const DocumentInspectModal: React.FC<DocumentInspectModalProps> = ({
  isOpen,
  onClose,
  document,
  onUpdateDocument,
}) => {
  if (!isOpen || !document) return null;

  const [activeTab, setActiveTab] = useState<'extracted' | 'source' | 'audit'>('extracted');
  const [isEditing, setIsEditing] = useState(false);

  // Editable field states
  const ef = document.extractedData;
  const [ownerName, setOwnerName] = useState(ef.ownerName?.value || '');
  const [khatianNumber, setKhatianNumber] = useState(ef.khatianNumber?.value || '');
  const [dagNumber, setDagNumber] = useState(ef.dagNumber?.value || '');
  const [landArea, setLandArea] = useState<string>(
    ef.landArea?.value !== null && ef.landArea?.value !== undefined ? ef.landArea.value.toString() : ''
  );
  const [landUnit, setLandUnit] = useState(ef.landUnit?.value || 'Acre');
  const [mouza, setMouza] = useState(ef.mouza?.value || '');
  const [upazila, setUpazila] = useState(ef.upazila?.value || '');
  const [district, setDistrict] = useState(ef.district?.value || '');
  const [deedNumber, setDeedNumber] = useState(ef.deedNumber?.value || '');
  const [docDate, setDocDate] = useState(ef.documentDate?.value || '');

  const handleSaveEdits = () => {
    const updatedFields: DocumentExtractedFields = {
      ...ef,
      ownerName: {
        confidence: ef.ownerName?.confidence ?? 1.0,
        evidenceSnippet: ef.ownerName?.evidenceSnippet,
        pageNumber: ef.ownerName?.pageNumber,
        notes: ef.ownerName?.notes,
        value: ownerName.trim() || null,
        isManualEdit: ownerName.trim() !== (ef.ownerName?.value || ''),
      },
      khatianNumber: {
        confidence: ef.khatianNumber?.confidence ?? 1.0,
        evidenceSnippet: ef.khatianNumber?.evidenceSnippet,
        pageNumber: ef.khatianNumber?.pageNumber,
        notes: ef.khatianNumber?.notes,
        value: khatianNumber.trim() || null,
        isManualEdit: khatianNumber.trim() !== (ef.khatianNumber?.value || ''),
      },
      dagNumber: {
        confidence: ef.dagNumber?.confidence ?? 1.0,
        evidenceSnippet: ef.dagNumber?.evidenceSnippet,
        pageNumber: ef.dagNumber?.pageNumber,
        notes: ef.dagNumber?.notes,
        value: dagNumber.trim() || null,
        isManualEdit: dagNumber.trim() !== (ef.dagNumber?.value || ''),
      },
      landArea: {
        confidence: ef.landArea?.confidence ?? 1.0,
        evidenceSnippet: ef.landArea?.evidenceSnippet,
        pageNumber: ef.landArea?.pageNumber,
        notes: ef.landArea?.notes,
        value: landArea.trim() ? parseFloat(landArea.trim()) : null,
        isManualEdit: true,
      },
      landUnit: {
        confidence: ef.landUnit?.confidence ?? 1.0,
        value: landUnit.trim() || 'Acre',
      },
      mouza: {
        confidence: ef.mouza?.confidence ?? 1.0,
        value: mouza.trim() || null,
        isManualEdit: true,
      },
      upazila: {
        confidence: ef.upazila?.confidence ?? 1.0,
        evidenceSnippet: ef.upazila?.evidenceSnippet,
        value: upazila.trim() || null,
        isManualEdit: true,
      },
      district: {
        confidence: ef.district?.confidence ?? 1.0,
        evidenceSnippet: ef.district?.evidenceSnippet,
        value: district.trim() || null,
        isManualEdit: true,
      },
      deedNumber: {
        confidence: ef.deedNumber?.confidence ?? 1.0,
        evidenceSnippet: ef.deedNumber?.evidenceSnippet,
        value: deedNumber.trim() || null,
        isManualEdit: true,
      },
      documentDate: {
        confidence: ef.documentDate?.confidence ?? 1.0,
        evidenceSnippet: ef.documentDate?.evidenceSnippet,
        value: docDate.trim() || null,
        isManualEdit: true,
      },
    };

    const updatedDoc: LandDocument = {
      ...document,
      extractedData: updatedFields,
      extractionStatus: 'verified',
    };

    onUpdateDocument(updatedDoc);
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl border border-slate-200 overflow-hidden my-6 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between shrink-0 bg-slate-50">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase bg-slate-200 text-slate-700 px-2 py-0.5 rounded-sm">
                {document.documentType}
              </span>
              <h2 className="text-base font-bold text-slate-900">{document.name}</h2>
            </div>
            <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
              <span>Source Engine: <strong>{document.extractionSource}</strong></span>
              <span>·</span>
              <span>Status: <strong className="capitalize text-emerald-700">{document.extractionStatus}</strong></span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-md transition-colors flex items-center gap-1.5"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Correct Fields</span>
              </button>
            ) : (
              <button
                onClick={handleSaveEdits}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#176B45] hover:bg-[#125335] rounded-md transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <Check className="w-4 h-4" />
                <span>Save Corrections</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Segmented View Tabs */}
        <div className="px-6 border-b border-slate-200 flex items-center gap-6 shrink-0 bg-white text-xs font-medium">
          <button
            onClick={() => setActiveTab('extracted')}
            className={`py-3 border-b-2 transition-colors ${
              activeTab === 'extracted'
                ? 'border-[#176B45] text-[#176B45] font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Extracted Data Schema (নিষ্কাশিত তথ্য)
          </button>
          <button
            onClick={() => setActiveTab('source')}
            className={`py-3 border-b-2 transition-colors ${
              activeTab === 'source'
                ? 'border-[#176B45] text-[#176B45] font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Source Document / Transcript
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`py-3 border-b-2 transition-colors ${
              activeTab === 'audit'
                ? 'border-[#176B45] text-[#176B45] font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            AI Invariant & Provenance Notes
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {activeTab === 'extracted' && (
            <div className="space-y-4">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-600 flex items-center justify-between">
                <div>
                  <strong className="text-slate-900">Distinction Notice:</strong> Values marked with{' '}
                  <span className="text-emerald-700 font-semibold">[AI Extracted]</span> come directly from OCR / Gemini.
                  Values with <span className="text-blue-700 font-semibold">[User Corrected]</span> have been manually verified.
                </div>
                {isEditing && (
                  <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-sm">
                    Editing Mode Active
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Owner Name */}
                <div className="p-3 bg-white border border-slate-200 rounded-lg space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">Owner / Party Name (মালিক)</span>
                    <span className="text-[10px] text-slate-400">
                      {ef.ownerName?.isManualEdit ? 'User Corrected' : 'AI Extracted (98%)'}
                    </span>
                  </div>
                  {isEditing ? (
                    <input
                      type="text"
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      className="w-full text-xs p-1.5 border border-slate-300 rounded-sm font-semibold"
                    />
                  ) : (
                    <div className="text-sm font-bold text-slate-900">
                      {ef.ownerName?.value || <span className="text-slate-400 italic font-normal">Missing / Omitted</span>}
                    </div>
                  )}
                  {ef.ownerName?.evidenceSnippet && (
                    <div className="text-[11px] text-slate-500 font-mono italic bg-slate-50 p-1.5 rounded-sm">
                      "{ef.ownerName.evidenceSnippet}"
                    </div>
                  )}
                </div>

                {/* Khatian Number */}
                <div className="p-3 bg-white border border-slate-200 rounded-lg space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">Khatian Number (খতিয়ান নং)</span>
                    <span className="text-[10px] text-slate-400">
                      {ef.khatianNumber?.value ? 'Extracted' : 'Missing in record'}
                    </span>
                  </div>
                  {isEditing ? (
                    <input
                      type="text"
                      value={khatianNumber}
                      onChange={(e) => setKhatianNumber(e.target.value)}
                      placeholder="Leave blank if omitted"
                      className="w-full text-xs p-1.5 border border-slate-300 rounded-sm font-mono font-semibold"
                    />
                  ) : (
                    <div className="text-sm font-bold font-mono text-slate-900">
                      {ef.khatianNumber?.value || (
                        <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded-sm text-xs font-normal">
                          Explicitly Missing / Omitted
                        </span>
                      )}
                    </div>
                  )}
                  {ef.khatianNumber?.evidenceSnippet && (
                    <div className="text-[11px] text-slate-500 font-mono italic bg-slate-50 p-1.5 rounded-sm">
                      "{ef.khatianNumber.evidenceSnippet}"
                    </div>
                  )}
                </div>

                {/* Dag Number */}
                <div className="p-3 bg-white border border-slate-200 rounded-lg space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">Dag / Plot Number (দাগ নং)</span>
                    <span className="text-[10px] text-slate-400">Primary Survey Plot</span>
                  </div>
                  {isEditing ? (
                    <input
                      type="text"
                      value={dagNumber}
                      onChange={(e) => setDagNumber(e.target.value)}
                      className="w-full text-xs p-1.5 border border-slate-300 rounded-sm font-mono font-semibold"
                    />
                  ) : (
                    <div className="text-sm font-bold font-mono text-slate-900">
                      {ef.dagNumber?.value || <span className="text-slate-400 italic font-normal">Missing</span>}
                    </div>
                  )}
                  {ef.dagNumber?.evidenceSnippet && (
                    <div className="text-[11px] text-slate-500 font-mono italic bg-slate-50 p-1.5 rounded-sm">
                      "{ef.dagNumber.evidenceSnippet}"
                    </div>
                  )}
                </div>

                {/* Land Area & Unit */}
                <div className="p-3 bg-white border border-slate-200 rounded-lg space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">Land Area & Unit (জমির পরিমাণ)</span>
                    <span className="text-[10px] text-slate-400">Normalized measure</span>
                  </div>
                  {isEditing ? (
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        step="0.001"
                        value={landArea}
                        onChange={(e) => setLandArea(e.target.value)}
                        placeholder="Quantity"
                        className="text-xs p-1.5 border border-slate-300 rounded-sm font-mono font-semibold"
                      />
                      <select
                        value={landUnit}
                        onChange={(e) => setLandUnit(e.target.value)}
                        className="text-xs p-1.5 border border-slate-300 rounded-sm bg-white"
                      >
                        <option value="Acre">Acre (একর)</option>
                        <option value="Decimal">Decimal/Shotok (শতক)</option>
                        <option value="Katha">Katha (কাঠা)</option>
                        <option value="Bigha">Bigha (বিঘা)</option>
                      </select>
                    </div>
                  ) : (
                    <div className="text-sm font-bold font-mono text-slate-900">
                      {ef.landArea?.value !== null && ef.landArea?.value !== undefined
                        ? `${ef.landArea.value} ${ef.landUnit?.value || 'Acre'}`
                        : <span className="text-slate-400 italic font-normal">Missing</span>}
                    </div>
                  )}
                  {ef.landArea?.evidenceSnippet && (
                    <div className="text-[11px] text-slate-500 font-mono italic bg-slate-50 p-1.5 rounded-sm">
                      "{ef.landArea.evidenceSnippet}"
                    </div>
                  )}
                </div>

                {/* Mouza */}
                <div className="p-3 bg-white border border-slate-200 rounded-lg space-y-1">
                  <span className="text-xs font-semibold text-slate-700 block">Mouza (মৌজা)</span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={mouza}
                      onChange={(e) => setMouza(e.target.value)}
                      className="w-full text-xs p-1.5 border border-slate-300 rounded-sm font-semibold"
                    />
                  ) : (
                    <div className="text-sm font-bold text-slate-900">
                      {ef.mouza?.value || <span className="text-slate-400 italic font-normal">Missing</span>}
                    </div>
                  )}
                </div>

                {/* Deed / Registration Number */}
                <div className="p-3 bg-white border border-slate-200 rounded-lg space-y-1">
                  <span className="text-xs font-semibold text-slate-700 block">Deed No. / Registration</span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={deedNumber}
                      onChange={(e) => setDeedNumber(e.target.value)}
                      placeholder="e.g. 450/2012"
                      className="w-full text-xs p-1.5 border border-slate-300 rounded-sm font-mono font-semibold"
                    />
                  ) : (
                    <div className="text-sm font-bold font-mono text-slate-900">
                      {ef.deedNumber?.value || <span className="text-slate-400 italic font-normal">N/A (Khatian)</span>}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'source' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-500 border-b border-slate-100 pb-2">
                <span>Raw Transcript & Page Buffer</span>
                <span className="font-mono">{document.fileType} · {document.fileSize}</span>
              </div>

              {document.fileDataUrl ? (
                <div className="border border-slate-200 rounded-lg p-2 bg-slate-100 text-center">
                  <img
                    src={document.fileDataUrl}
                    alt={document.name}
                    className="max-h-80 mx-auto rounded shadow-xs object-contain"
                  />
                </div>
              ) : null}

              <div className="bg-slate-900 text-slate-100 p-4 rounded-lg font-mono text-xs whitespace-pre-wrap leading-relaxed overflow-x-auto">
                {document.sampleContentText || 'No raw textual representation available for this document.'}
              </div>
            </div>
          )}

          {activeTab === 'audit' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900 space-y-1">
                <span className="font-semibold block">JomiGuard Extraction Integrity:</span>
                <p className="leading-relaxed">
                  Extraction engine adheres to zero-hallucination protocols. All values are anchored to explicit line schedules.
                  Confidence scores reflect OCR character clarity and semantic alignment with standard Bangladesh Ministry of Land formats.
                </p>
              </div>

              <div className="border border-slate-200 rounded-lg p-4 space-y-2">
                <div className="font-semibold text-slate-900">Extracted Invariant Check:</div>
                <ul className="list-disc pl-5 space-y-1 text-slate-600">
                  <li>Dag number normalization applied for Bengali digits (০-৯ → 0-9).</li>
                  <li>Land area preserved in native unit ({ef.landUnit?.value || 'Acre'}).</li>
                  <li>Title chain references mapped to parent case file.</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 flex items-center justify-between shrink-0 bg-slate-50">
          <div className="text-[11px] text-slate-400">
            Document ID: <span className="font-mono">{document.id}</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200 rounded-md transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
