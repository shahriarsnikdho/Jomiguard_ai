import React from 'react';
import { Menu, Plus, Upload, GitCompare, Sparkles, CheckCircle2, Award } from 'lucide-react';
import { NavigationTab } from './Sidebar';

interface HeaderProps {
  currentTab: NavigationTab;
  onOpenMobileMenu: () => void;
  onNewCase: () => void;
  onUploadDoc: () => void;
  onStartComparison: () => void;
  geminiReady?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onOpenMobileMenu,
  onNewCase,
  onUploadDoc,
  onStartComparison,
  geminiReady = false,
}) => {
  const getTabTitle = () => {
    switch (currentTab) {
      case 'dashboard':
        return { en: 'Dashboard', bn: 'পর্যবেক্ষণ ড্যাশবোর্ড' };
      case 'cases':
        return { en: 'Land Cases', bn: 'জমির মোকদ্দমা ও কেস ফাইল' };
      case 'documents':
        return { en: 'Document Repository', bn: 'দলিল ও খতিয়ান সংগ্রহ' };
      case 'comparison':
        return { en: 'AI Document Comparison', bn: 'দ্বৈত দলিল ও খতিয়ান তুলনা' };
      case 'reports':
        return { en: 'Screening Reports', bn: 'যাচাই ও বিশ্লেষণ প্রতিবেদন' };
      case 'explorer':
        return { en: 'Bangladesh Land Data Explorer', bn: 'ভূমি আইন ও সরকারি পোর্টাল' };
      case 'hackathon':
        return { en: 'LandTech 2026 Hackathon Dossier', bn: 'ডিআইইউ ল্যান্ডটেক হ্যাকথন ডজিয়ার ও পিচ' };
      case 'settings':
        return { en: 'System Settings', bn: 'কনফিগারেশন ও ইউনিট কনভার্টার' };
      default:
        return { en: 'JomiGuard AI', bn: 'ভূমি নিরীক্ষা' };
    }
  };

  const { en, bn } = getTabTitle();

  return (
    <header className="h-16 px-4 md:px-8 bg-white border-b border-slate-200 flex items-center justify-between gap-4 sticky top-0 z-30">
      {/* Zone 1: Breadcrumb / Current View */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-1.5 text-slate-600 hover:text-slate-900 rounded-md hover:bg-slate-100"
          aria-label="Open mobile navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">JomiGuard AI</span>
            <span className="text-slate-300">/</span>
            <h1 className="text-sm md:text-base font-semibold text-slate-900">{en}</h1>
          </div>
          <span className="text-[11px] text-slate-500 hidden sm:inline">{bn}</span>
        </div>
      </div>

      {/* Zone 2: Mode & Engine Status */}
      <div className="hidden md:flex items-center gap-2 text-xs">
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-800 rounded-md border border-slate-200">
          <Award className="w-3.5 h-3.5 text-[#176B45]" />
          <span className="font-semibold text-slate-700">DIU LandTech 2026</span>
          <span className="text-slate-400">·</span>
          <span className="text-xs font-mono font-medium text-[#176B45]">Track P3</span>
        </div>

        {geminiReady ? (
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-md border border-emerald-200">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span className="font-medium">Gemini 3.8 Flash Online</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-800 rounded-md border border-amber-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
            <span className="font-medium">Certified Local Demo Engine</span>
          </div>
        )}
      </div>

      {/* Zone 3: Quick Action CTAs */}
      <div className="flex items-center gap-2">
        <button
          onClick={onUploadDoc}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload Doc</span>
        </button>

        <button
          onClick={onStartComparison}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors"
        >
          <GitCompare className="w-3.5 h-3.5 text-[#176B45]" />
          <span>Compare</span>
        </button>

        <button
          onClick={onNewCase}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-[#176B45] hover:bg-[#125335] rounded-md transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>New Case</span>
        </button>
      </div>
    </header>
  );
};
