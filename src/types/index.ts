/**
 * JomiGuard AI — Core Domain Data Types
 */

export type DocumentType = 'deed' | 'khatian' | 'mutation_record' | 'map' | 'other';
export type CaseStatus = 'active' | 'under_review' | 'completed';
export type ComparisonStatus = 'MATCH' | 'MISMATCH' | 'MISSING' | 'UNCERTAIN';
export type ExtractionStatus = 'pending' | 'extracted' | 'verified' | 'failed';
export type ExtractionSource = 'gemini_3.8_flash' | 'demo_extractor' | 'manual';

export interface ExtractedField<T = string | number | null> {
  value: T;
  confidence: number;
  isManualEdit?: boolean;
  evidenceSnippet?: string;
  pageNumber?: number;
  notes?: string;
}

export interface DocumentExtractedFields {
  ownerName: ExtractedField<string | null>;
  coOwners?: ExtractedField<string[]>;
  deedNumber?: ExtractedField<string | null>;
  documentDate?: ExtractedField<string | null>;
  khatianNumber: ExtractedField<string | null>;
  khatianType?: ExtractedField<string | null>; // CS, SA, RS, BS, City Survey
  dagNumber: ExtractedField<string | null>;
  mouza: ExtractedField<string | null>;
  jlNumber?: ExtractedField<string | null>;
  upazila?: ExtractedField<string | null>;
  district?: ExtractedField<string | null>;
  landArea: ExtractedField<number | null>;
  landUnit: ExtractedField<string | null>; // 'Acre', 'Decimal', 'Shotok', 'Katha', 'Bigha'
  rawSnippet?: string;
  notes?: string;
}

export interface LandDocument {
  id: string;
  caseId: string;
  name: string;
  documentType: DocumentType;
  subType?: string;
  uploadedAt: string;
  fileSize: string;
  fileType: string;
  fileDataUrl?: string; // For thumbnail/preview
  isSyntheticDemo?: boolean;
  sampleContentText?: string;
  extractedData: DocumentExtractedFields;
  extractionStatus: ExtractionStatus;
  extractionSource: ExtractionSource;
}

export interface LandCase {
  id: string;
  title: string;
  caseReference: string;
  district: string;
  upazila: string;
  mouza: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  status: CaseStatus;
  documentIds: string[];
}

export interface ComparisonField {
  fieldKey: string;
  labelEn: string;
  labelBn: string;
  docAValue: string | null;
  docBValue: string | null;
  docAOriginalUnit?: string | null;
  docBOriginalUnit?: string | null;
  status: ComparisonStatus;
  explanation: string;
  explanationBn: string;
  evidenceA?: string;
  evidenceB?: string;
  recommendedAction: string;
  recommendedActionBn: string;
}

export interface ComparisonResult {
  id: string;
  caseId: string;
  caseTitle: string;
  caseReference: string;
  docAId: string;
  docBId: string;
  docAName: string;
  docBName: string;
  docAType: DocumentType;
  docBType: DocumentType;
  timestamp: string;
  fields: ComparisonField[];
  summaryEn: string;
  summaryBn: string;
  statusCounts: {
    MATCH: number;
    MISMATCH: number;
    MISSING: number;
    UNCERTAIN: number;
  };
  overallVerdict: 'consistent' | 'discrepancies_detected' | 'insufficient_data';
}

export interface VerificationChecklistItem {
  id: string;
  taskEn: string;
  taskBn: string;
  authority: string;
  priority: 'high' | 'medium' | 'low';
  done?: boolean;
}

export interface ComparisonReport {
  id: string;
  comparisonId: string;
  caseId: string;
  caseReference: string;
  caseTitle: string;
  generatedAt: string;
  executiveSummaryBn: string;
  executiveSummaryEn: string;
  comparisonResult: ComparisonResult;
  manualVerificationChecklist: VerificationChecklistItem[];
  disclaimerEn: string;
  disclaimerBn: string;
  isDemoData: boolean;
}

export interface SystemStatus {
  status: string;
  product: string;
  geminiConfigured: boolean;
  serverTime: string;
  mode: 'live_gemini' | 'demo_mode';
}
