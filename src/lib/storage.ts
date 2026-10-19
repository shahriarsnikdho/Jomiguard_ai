/**
 * JomiGuard AI — Storage Manager
 * Handles local browser persistence, initial seeding, and data lifecycle.
 */

import { LandCase, LandDocument, ComparisonResult, ComparisonReport } from '../types';
import { INITIAL_DEMO_CASES, INITIAL_DEMO_DOCUMENTS, createInitialDemoReport } from './demoData';

const STORAGE_KEYS = {
  CASES: 'jomiguard_cases_v1',
  DOCUMENTS: 'jomiguard_documents_v1',
  COMPARISONS: 'jomiguard_comparisons_v1',
  REPORTS: 'jomiguard_reports_v1',
  INIT_FLAG: 'jomiguard_initialized_v1',
};

export class StorageManager {
  private static isInitialized = false;

  public static initialize(): void {
    if (typeof window === 'undefined') return;

    const initialized = localStorage.getItem(STORAGE_KEYS.INIT_FLAG);
    if (!initialized) {
      this.resetToDemoDefaults();
    }
    this.isInitialized = true;
  }

  public static resetToDemoDefaults(): void {
    if (typeof window === 'undefined') return;

    const initialReport = createInitialDemoReport();
    localStorage.setItem(STORAGE_KEYS.CASES, JSON.stringify(INITIAL_DEMO_CASES));
    localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(INITIAL_DEMO_DOCUMENTS));
    localStorage.setItem(STORAGE_KEYS.COMPARISONS, JSON.stringify([initialReport.comparisonResult]));
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify([initialReport]));
    localStorage.setItem(STORAGE_KEYS.INIT_FLAG, 'true');
  }

  // CASES
  public static getCases(): LandCase[] {
    this.ensureInit();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CASES);
      return data ? JSON.parse(data) : INITIAL_DEMO_CASES;
    } catch {
      return INITIAL_DEMO_CASES;
    }
  }

  public static getCaseById(id: string): LandCase | null {
    const cases = this.getCases();
    return cases.find((c) => c.id === id) || null;
  }

  public static saveCase(landCase: LandCase): void {
    const cases = this.getCases();
    const idx = cases.findIndex((c) => c.id === landCase.id);
    if (idx >= 0) {
      cases[idx] = { ...landCase, updatedAt: new Date().toISOString() };
    } else {
      cases.unshift(landCase);
    }
    localStorage.setItem(STORAGE_KEYS.CASES, JSON.stringify(cases));
  }

  public static deleteCase(id: string): void {
    const cases = this.getCases().filter((c) => c.id !== id);
    localStorage.setItem(STORAGE_KEYS.CASES, JSON.stringify(cases));

    // Also remove associated documents
    const docs = this.getDocuments().filter((d) => d.caseId !== id);
    localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(docs));
  }

  // DOCUMENTS
  public static getDocuments(): LandDocument[] {
    this.ensureInit();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DOCUMENTS);
      return data ? JSON.parse(data) : INITIAL_DEMO_DOCUMENTS;
    } catch {
      return INITIAL_DEMO_DOCUMENTS;
    }
  }

  public static getDocumentsByCaseId(caseId: string): LandDocument[] {
    const docs = this.getDocuments();
    return docs.filter((d) => d.caseId === caseId);
  }

  public static getDocumentById(id: string): LandDocument | null {
    const docs = this.getDocuments();
    return docs.find((d) => d.id === id) || null;
  }

  public static saveDocument(doc: LandDocument): void {
    const docs = this.getDocuments();
    const idx = docs.findIndex((d) => d.id === doc.id);
    if (idx >= 0) {
      docs[idx] = doc;
    } else {
      docs.unshift(doc);
    }
    localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(docs));

    // Update case documentIds
    const targetCase = this.getCaseById(doc.caseId);
    if (targetCase && !targetCase.documentIds.includes(doc.id)) {
      targetCase.documentIds.push(doc.id);
      this.saveCase(targetCase);
    }
  }

  public static deleteDocument(id: string): void {
    const docs = this.getDocuments().filter((d) => d.id !== id);
    localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(docs));

    // Remove from case references
    const cases = this.getCases();
    cases.forEach((c) => {
      if (c.documentIds.includes(id)) {
        c.documentIds = c.documentIds.filter((docId) => docId !== id);
        this.saveCase(c);
      }
    });
  }

  // COMPARISONS
  public static getComparisons(): ComparisonResult[] {
    this.ensureInit();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.COMPARISONS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  public static saveComparison(cmp: ComparisonResult): void {
    const cmps = this.getComparisons();
    cmps.unshift(cmp);
    localStorage.setItem(STORAGE_KEYS.COMPARISONS, JSON.stringify(cmps.slice(0, 50)));
  }

  // REPORTS
  public static getReports(): ComparisonReport[] {
    this.ensureInit();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.REPORTS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  public static getReportById(id: string): ComparisonReport | null {
    const reports = this.getReports();
    return reports.find((r) => r.id === id) || null;
  }

  public static saveReport(report: ComparisonReport): void {
    const reports = this.getReports();
    const idx = reports.findIndex((r) => r.id === report.id);
    if (idx >= 0) {
      reports[idx] = report;
    } else {
      reports.unshift(report);
    }
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
  }

  public static updateChecklistItem(reportId: string, itemId: string, done: boolean): void {
    const reports = this.getReports();
    const report = reports.find((r) => r.id === reportId);
    if (report) {
      const item = report.manualVerificationChecklist.find((c) => c.id === itemId);
      if (item) {
        item.done = done;
        this.saveReport(report);
      }
    }
  }

  private static ensureInit(): void {
    if (!this.isInitialized && typeof window !== 'undefined') {
      this.initialize();
    }
  }
}
