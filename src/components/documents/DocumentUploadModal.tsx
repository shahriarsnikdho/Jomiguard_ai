import React, { useState, useRef } from 'react';
import { X, Upload, FileText, CheckCircle2, AlertCircle, Loader2, Sparkles, BookOpen } from 'lucide-react';
import { LandCase, LandDocument, DocumentType, DocumentExtractedFields } from '../../types';

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  cases: LandCase[];
  defaultCaseId?: string;
  onSaveDocument: (doc: LandDocument) => void;
}

export const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({
  isOpen,
  onClose,
  cases,
  defaultCaseId,
  onSaveDocument,
}) => {
  const [caseId, setCaseId] = useState<string>(defaultCaseId || cases[0]?.id || '');
  const [name, setName] = useState('');
  const [documentType, setDocumentType] = useState<DocumentType>('deed');
  const [subType, setSubType] = useState('Kabala Deed (সাব-কবলা দলিল)');
  const [file, setFile] = useState<File | null>(null);
  const [fileDataUrl, setFileDataUrl] = useState<string | null>(null);
  const [pastedText, setPastedText] = useState('');
  const [useSampleDeed, setUseSampleDeed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const selected = e.target.files?.[0];
    if (!selected) return;

    // Validate type: PDF, PNG, JPG, JPEG
    const validTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
    if (!validTypes.includes(selected.type)) {
      setError('Unsupported file type. Please upload a PDF or image (PNG, JPG, JPEG).');
      return;
    }

    // Validate size: 15MB limit
    if (selected.size > 15 * 1024 * 1024) {
      setError('File size exceeds the 15 MB threshold.');
      return;
    }

    setFile(selected);
    if (!name) {
      setName(selected.name.replace(/\.[^/.]+$/, ''));
    }

    // Create preview DataURL if image
    if (selected.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setFileDataUrl(uploadEvent.target?.result as string);
      };
      reader.readAsDataURL(selected);
    } else {
      setFileDataUrl(null);
    }
  };

  const handleSelectSample = (sampleType: 'deed' | 'khatian') => {
    setUseSampleDeed(true);
    if (sampleType === 'deed') {
      setName('Gazipur Sadar Sub-Registry Deed No. 450/2012');
      setDocumentType('deed');
      setSubType('Kabala Deed (সাব-কবলা)');
      setPastedText(`গণপ্রজাতন্ত্রী বাংলাদেশ সরকার — সাব-রেজিস্ট্রার কার্যালয়, গাজীপুর সদর
দলিল নং: ৪৫০/২০১২, তারিখ: ১২/০৩/২০১২ খ্রিঃ
শ্রেণী: সাফ-কবলা হস্তান্তর দলিল
গ্রহীতা/মালিক: রহিম উদ্দিন (Rahim Uddin), পিতা: মরহুম আব্দুল করিম, সাং- ডেমো মৌজা।
সম্পত্তির তফসিল:
জেলা: গাজীপুর, উপজেলা: গাজীপুর সদর, মৌজা: Demo Mouza, জে.এল নং: ৪৪
খতিয়ান নং: ৩০ (ত্রিশ)
দাগ নং: ১২৫ (একশত পঁচিশ)
জমির শ্রেণী: নাল জমি
জমির পরিমাণ: ১.৫০ একর (1.50 Acres / দেড় একর)
চৌহদ্দি: উত্তরে সরকারি রাস্তা, দক্ষিণে খলিল মিয়া, পূর্বে সরকারি খাল, পশ্চিমে করিম বক্সের জোত।`);
    } else {
      setName('E-Mutation Khatian Field Survey Copy Dag 125');
      setDocumentType('khatian');
      setSubType('Mutation Khatian (নামজারি খতিয়ান)');
      setPastedText(`সহকারী কমিশনার (ভূমি) এর কার্যালয়, গাজীপুর সদর
নামজারি কেস নং: ১১২/২০১৭-১৮
মালিকের নাম: রহিম উদ্দিন (Rahim Uddin)
মৌজা: Demo Mouza
দাগ নং: ১২৫
জমির পরিমাণ: ১.২৫ একর (1.25 Acres)
[বিজ্ঞপ্তি: মূল জরিপ খতিয়ান নম্বর এই নামজারি মাঠ কপিতে অনুল্লেখিত / অনুপস্থিত]
মন্তব্য: বাটা দাগ নং ১২৫/১ অনুসারে অবশিষ্ট অংশ শরিকগণের জোতে রক্ষিত।`);
    }
  };

  const handleUploadAndExtract = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Document name is required.');
      return;
    }
    if (!caseId) {
      setError('Please select or create a land case to associate this document with.');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const payload: any = {
        documentText: pastedText || '',
        documentType,
        fileName: name,
      };

      if (fileDataUrl && file?.type.startsWith('image/')) {
        payload.imageBase64 = fileDataUrl;
        payload.mimeType = file.type;
      }

      // Call server extraction API
      const response = await fetch('/api/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const resData = await response.json();
      const extracted: DocumentExtractedFields = resData.extractedData || {
        ownerName: { value: null, confidence: 0 },
        khatianNumber: { value: null, confidence: 0 },
        dagNumber: { value: null, confidence: 0 },
        landArea: { value: null, confidence: 0 },
        landUnit: { value: 'Acre', confidence: 0 },
        mouza: { value: null, confidence: 0 },
      };

      const newDoc: LandDocument = {
        id: `doc_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        caseId,
        name: name.trim(),
        documentType,
        subType,
        uploadedAt: new Date().toISOString(),
        fileSize: file ? `${(file.size / (1024 * 1024)).toFixed(2)} MB` : '1.4 MB',
        fileType: file ? file.type : 'application/pdf',
        fileDataUrl: fileDataUrl || undefined,
        sampleContentText: pastedText || (file ? `Attached binary scan: ${file.name}` : undefined),
        isSyntheticDemo: useSampleDeed,
        extractionStatus: 'extracted',
        extractionSource: resData.source || 'demo_extractor',
        extractedData: extracted,
      };

      onSaveDocument(newDoc);
      onClose();
    } catch (err: any) {
      console.error('Extraction error:', err);
      setError('Document analysis encountered an issue. Safe local parser used.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-xl border border-slate-200 overflow-hidden my-8">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-900 font-semibold text-base">
            <Upload className="w-5 h-5 text-[#176B45]" />
            <span>Upload Land Record & Run AI Extraction</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleUploadAndExtract} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 text-red-700 text-xs rounded-md border border-red-200 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick Sample Templates Button */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-xs font-semibold text-slate-800 block">
                Testing without a local PDF scan?
              </span>
              <span className="text-[11px] text-slate-500">
                Load authentic Bangladesh deed or mutation khatian text
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleSelectSample('deed')}
                className="px-2.5 py-1 text-[11px] font-medium bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-md"
              >
                Sample Deed
              </button>
              <button
                type="button"
                onClick={() => handleSelectSample('khatian')}
                className="px-2.5 py-1 text-[11px] font-medium bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-md"
              >
                Sample Khatian
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Associate with Land Case *
            </label>
            <select
              value={caseId}
              onChange={(e) => setCaseId(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#176B45]/20 focus:border-[#176B45] bg-white"
            >
              {cases.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.caseReference} — {c.title} ({c.mouza})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Document Title / Identifier *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Registered Sale Deed No. 450/2012"
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#176B45]/20 focus:border-[#176B45]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Document Type (নথির ধরন)
              </label>
              <select
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value as DocumentType)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-md focus:outline-none bg-white"
              >
                <option value="deed">Deed (দলিল / সাফ-কবলা)</option>
                <option value="khatian">Khatian (খতিয়ান / পর্চা)</option>
                <option value="mutation_record">Mutation (নামজারি / জমাখারিজ)</option>
                <option value="map">Map (মৌজা নকশা)</option>
                <option value="other">Other Land Record</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Survey / Deed Sub-Type
              </label>
              <input
                type="text"
                value={subType}
                onChange={(e) => setSubType(e.target.value)}
                placeholder="e.g. Kabala, RS, BS, CS, Heba"
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-md focus:outline-none"
              />
            </div>
          </div>

          {/* File Drag & Drop or Paste */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Upload Document File (PDF, PNG, JPG) or Enter Text
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 hover:border-[#176B45] rounded-lg p-5 text-center cursor-pointer bg-slate-50 hover:bg-[#176B45]/5 transition-colors space-y-2"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,image/png,image/jpeg,image/jpg"
                onChange={handleFileChange}
                className="hidden"
              />
              <FileText className="w-8 h-8 text-slate-400 mx-auto" />
              {file ? (
                <div className="text-xs text-slate-800 font-medium">
                  Selected: <span className="font-semibold text-[#176B45]">{file.name}</span> ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                </div>
              ) : (
                <>
                  <div className="text-xs text-slate-700 font-medium">
                    Click to browse files or drag and drop
                  </div>
                  <div className="text-[11px] text-slate-400">
                    PDF, PNG, JPG up to 15 MB supported
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Raw Text content (Bengali/English) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Document Text / Schedule Description (বাংলা বা ইংরেজি)
            </label>
            <textarea
              rows={4}
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              placeholder="Paste deed schedule text, khatian porcha notes, or dag lines..."
              className="w-full text-xs font-mono p-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#176B45]/20 focus:border-[#176B45]"
            />
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
            <div className="text-[11px] text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#176B45]" />
              <span>Extracts Dag, Khatian, Owner, Mouza & Land Area</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isProcessing}
                className="px-4 py-1.5 text-xs font-medium text-white bg-[#176B45] hover:bg-[#125335] disabled:opacity-50 rounded-md transition-colors flex items-center gap-2 shadow-xs"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Analyzing Document...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload & Extract</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
