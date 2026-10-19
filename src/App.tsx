/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Sidebar, NavigationTab } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { DashboardView } from './components/dashboard/DashboardView';
import { CaseListView } from './components/cases/CaseListView';
import { CaseDetailView } from './components/cases/CaseDetailView';
import { CreateCaseModal } from './components/cases/CreateCaseModal';
import { DocumentListView } from './components/documents/DocumentListView';
import { DocumentUploadModal } from './components/documents/DocumentUploadModal';
import { DocumentInspectModal } from './components/documents/DocumentInspectModal';
import { ComparisonView } from './components/comparison/ComparisonView';
import { ReportListView } from './components/reports/ReportListView';
import { ReportView } from './components/reports/ReportView';
import { DataExplorerView } from './components/explorer/DataExplorerView';
import { HackathonDossierView } from './components/hackathon/HackathonDossierView';
import { SettingsView } from './components/settings/SettingsView';
import { StorageManager } from './lib/storage';
import { LandCase, LandDocument, ComparisonReport } from './types';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavigationTab>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [geminiReady, setGeminiReady] = useState(false);

  // Core Data States
  const [cases, setCases] = useState<LandCase[]>([]);
  const [documents, setDocuments] = useState<LandDocument[]>([]);
  const [reports, setReports] = useState<ComparisonReport[]>([]);

  // Navigation Drill-downs
  const [activeCaseId, setActiveCaseId] = useState<string | null>(null);
  const [activeReportId, setActiveReportId] = useState<string | null>(null);
  const [comparisonPreload, setComparisonPreload] = useState<{
    caseId?: string;
    docAId?: string;
    docBId?: string;
  }>({});

  // Modals
  const [isCreateCaseOpen, setIsCreateCaseOpen] = useState(false);
  const [editingCase, setEditingCase] = useState<LandCase | null>(null);
  const [isUploadDocOpen, setIsUploadDocOpen] = useState(false);
  const [uploadTargetCaseId, setUploadTargetCaseId] = useState<string | undefined>(undefined);
  const [inspectingDoc, setInspectingDoc] = useState<LandDocument | null>(null);

  // Initialize data on mount
  useEffect(() => {
    StorageManager.initialize();
    loadAllData();

    // Check server status
    fetch('/api/status')
      .then((res) => res.json())
      .then((data) => {
        setGeminiReady(Boolean(data.geminiConfigured));
      })
      .catch(() => {
        setGeminiReady(false);
      });
  }, []);

  const loadAllData = () => {
    setCases(StorageManager.getCases());
    setDocuments(StorageManager.getDocuments());
    setReports(StorageManager.getReports());
  };

  // Case Handlers
  const handleSaveCase = (newCase: LandCase) => {
    StorageManager.saveCase(newCase);
    loadAllData();
    setEditingCase(null);
  };

  const handleDeleteCase = (caseId: string) => {
    StorageManager.deleteCase(caseId);
    if (activeCaseId === caseId) setActiveCaseId(null);
    loadAllData();
  };

  // Document Handlers
  const handleSaveDocument = (newDoc: LandDocument) => {
    StorageManager.saveDocument(newDoc);
    loadAllData();
  };

  const handleDeleteDocument = (docId: string) => {
    StorageManager.deleteDocument(docId);
    if (inspectingDoc?.id === docId) setInspectingDoc(null);
    loadAllData();
  };

  // Report Handlers
  const handleSaveReport = (newReport: ComparisonReport) => {
    StorageManager.saveReport(newReport);
    loadAllData();
  };

  const handleDeleteReport = (reportId: string) => {
    const updated = reports.filter((r) => r.id !== reportId);
    localStorage.setItem('jomiguard_reports_v1', JSON.stringify(updated));
    if (activeReportId === reportId) setActiveReportId(null);
    loadAllData();
  };

  const handleToggleChecklist = (reportId: string, itemId: string, done: boolean) => {
    StorageManager.updateChecklistItem(reportId, itemId, done);
    loadAllData();
  };

  // Quick Action: Launch Benchmark Acceptance Test 001
  const handleRunDemoCase001 = () => {
    const case001 = cases.find((c) => c.id === 'case_demo_001');
    if (case001) {
      const caseDocs = documents.filter((d) => d.caseId === case001.id);
      setComparisonPreload({
        caseId: case001.id,
        docAId: caseDocs[0]?.id,
        docBId: caseDocs[1]?.id,
      });
      setCurrentTab('comparison');
    }
  };

  const handleStartComparison = (caseId?: string, docAId?: string, docBId?: string) => {
    setComparisonPreload({
      caseId: caseId || cases[0]?.id,
      docAId,
      docBId,
    });
    setCurrentTab('comparison');
  };

  const handleResetDemoData = () => {
    StorageManager.resetToDemoDefaults();
    loadAllData();
    setActiveCaseId(null);
    setActiveReportId(null);
    setCurrentTab('dashboard');
  };

  // Active sub-views
  const activeCase = activeCaseId ? cases.find((c) => c.id === activeCaseId) : null;
  const activeReport = activeReportId ? reports.find((r) => r.id === activeReportId) : null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#24312B] flex flex-col lg:flex-row">
      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        onTabChange={(tab) => {
          setCurrentTab(tab);
          setActiveCaseId(null);
          setActiveReportId(null);
        }}
        casesCount={cases.length}
        docsCount={documents.length}
        reportsCount={reports.length}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          currentTab={currentTab}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onNewCase={() => {
            setEditingCase(null);
            setIsCreateCaseOpen(true);
          }}
          onUploadDoc={() => {
            setUploadTargetCaseId(undefined);
            setIsUploadDocOpen(true);
          }}
          onStartComparison={() => handleStartComparison()}
          geminiReady={geminiReady}
        />

        <main className="flex-1 overflow-y-auto">
          {/* TAB: DASHBOARD */}
          {currentTab === 'dashboard' && (
            <DashboardView
              cases={cases}
              documents={documents}
              comparisons={StorageManager.getComparisons()}
              reports={reports}
              onOpenCase={(id) => {
                setActiveCaseId(id);
                setCurrentTab('cases');
              }}
              onOpenReport={(id) => {
                setActiveReportId(id);
                setCurrentTab('reports');
              }}
              onNewCase={() => {
                setEditingCase(null);
                setIsCreateCaseOpen(true);
              }}
              onUploadDoc={() => {
                setUploadTargetCaseId(undefined);
                setIsUploadDocOpen(true);
              }}
              onStartComparison={(cId) => handleStartComparison(cId)}
              onRunDemoCase001={handleRunDemoCase001}
              onOpenHackathonDossier={() => setCurrentTab('hackathon')}
            />
          )}

          {/* TAB: LAND CASES */}
          {currentTab === 'cases' && (
            <>
              {activeCase ? (
                <CaseDetailView
                  landCase={activeCase}
                  documents={documents.filter((d) => d.caseId === activeCase.id)}
                  reports={reports}
                  onBack={() => setActiveCaseId(null)}
                  onEditCase={() => {
                    setEditingCase(activeCase);
                    setIsCreateCaseOpen(true);
                  }}
                  onUploadDocToCase={(caseId) => {
                    setUploadTargetCaseId(caseId);
                    setIsUploadDocOpen(true);
                  }}
                  onInspectDoc={(doc) => setInspectingDoc(doc)}
                  onDeleteDoc={handleDeleteDocument}
                  onStartComparison={(caseId, docA, docB) =>
                    handleStartComparison(caseId, docA, docB)
                  }
                  onOpenReport={(id) => {
                    setActiveReportId(id);
                    setCurrentTab('reports');
                  }}
                />
              ) : (
                <CaseListView
                  cases={cases}
                  onOpenCase={(id) => setActiveCaseId(id)}
                  onNewCase={() => {
                    setEditingCase(null);
                    setIsCreateCaseOpen(true);
                  }}
                  onEditCase={(c) => {
                    setEditingCase(c);
                    setIsCreateCaseOpen(true);
                  }}
                  onDeleteCase={handleDeleteCase}
                  onStartComparison={(id) => handleStartComparison(id)}
                />
              )}
            </>
          )}

          {/* TAB: DOCUMENTS */}
          {currentTab === 'documents' && (
            <DocumentListView
              documents={documents}
              cases={cases}
              onUploadDoc={() => {
                setUploadTargetCaseId(undefined);
                setIsUploadDocOpen(true);
              }}
              onInspectDoc={(doc) => setInspectingDoc(doc)}
              onDeleteDoc={handleDeleteDocument}
              onStartComparison={(caseId, docAId) => handleStartComparison(caseId, docAId)}
            />
          )}

          {/* TAB: AI COMPARISON */}
          {currentTab === 'comparison' && (
            <ComparisonView
              cases={cases}
              documents={documents}
              initialCaseId={comparisonPreload.caseId}
              initialDocAId={comparisonPreload.docAId}
              initialDocBId={comparisonPreload.docBId}
              onSaveReport={handleSaveReport}
              onOpenReport={(id) => {
                setActiveReportId(id);
                setCurrentTab('reports');
              }}
            />
          )}

          {/* TAB: REPORTS */}
          {currentTab === 'reports' && (
            <>
              {activeReport ? (
                <ReportView
                  report={activeReport}
                  onBack={() => setActiveReportId(null)}
                  onToggleChecklist={handleToggleChecklist}
                />
              ) : (
                <ReportListView
                  reports={reports}
                  onOpenReport={(id) => setActiveReportId(id)}
                  onDeleteReport={handleDeleteReport}
                  onNewComparison={() => setCurrentTab('comparison')}
                />
              )}
            </>
          )}

          {/* TAB: DATA EXPLORER */}
          {currentTab === 'explorer' && <DataExplorerView />}

          {/* TAB: HACKATHON DOSSIER */}
          {currentTab === 'hackathon' && <HackathonDossierView />}

          {/* TAB: SETTINGS */}
          {currentTab === 'settings' && (
            <SettingsView
              onResetDemoData={handleResetDemoData}
              geminiReady={geminiReady}
            />
          )}
        </main>
      </div>

      {/* Global Modals */}
      <CreateCaseModal
        isOpen={isCreateCaseOpen}
        onClose={() => {
          setIsCreateCaseOpen(false);
          setEditingCase(null);
        }}
        onSave={handleSaveCase}
        initialData={editingCase}
      />

      <DocumentUploadModal
        isOpen={isUploadDocOpen}
        onClose={() => setIsUploadDocOpen(false)}
        cases={cases}
        defaultCaseId={uploadTargetCaseId}
        onSaveDocument={handleSaveDocument}
      />

      <DocumentInspectModal
        isOpen={Boolean(inspectingDoc)}
        onClose={() => setInspectingDoc(null)}
        document={inspectingDoc}
        onUpdateDocument={(updated) => {
          handleSaveDocument(updated);
          setInspectingDoc(updated);
        }}
      />
    </div>
  );
}
