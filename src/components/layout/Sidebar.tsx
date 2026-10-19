import React from 'react';
import {
  LayoutDashboard,
  FolderGit2,
  FileText,
  GitCompare,
  FileCheck2,
  Compass,
  Settings,
  ShieldAlert,
  ChevronRight,
  Award,
} from 'lucide-react';
import { Logo } from '../brand/Logo';

export type NavigationTab =
  | 'dashboard'
  | 'cases'
  | 'documents'
  | 'comparison'
  | 'reports'
  | 'explorer'
  | 'hackathon'
  | 'settings';

interface SidebarProps {
  currentTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
  casesCount: number;
  docsCount: number;
  reportsCount: number;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onTabChange,
  casesCount,
  docsCount,
  reportsCount,
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const navItems: { id: NavigationTab; label: string; labelBn: string; icon: React.FC<any>; count?: number }[] = [
    { id: 'dashboard', label: 'Dashboard', labelBn: 'ড্যাশবোর্ড', icon: LayoutDashboard },
    { id: 'cases', label: 'Land Cases', labelBn: 'জমির কেস', icon: FolderGit2, count: casesCount },
    { id: 'documents', label: 'Documents', labelBn: 'দলিল ও খতিয়ান', icon: FileText, count: docsCount },
    { id: 'comparison', label: 'AI Comparison', labelBn: 'এআই তুলনা', icon: GitCompare },
    { id: 'reports', label: 'Reports', labelBn: 'প্রতিবেদন', icon: FileCheck2, count: reportsCount },
    { id: 'explorer', label: 'Data Explorer', labelBn: 'ল্যান্ড এক্সপ্লোরার', icon: Compass },
    { id: 'hackathon', label: 'LandTech 2026', labelBn: 'হ্যাকথন ডজিয়ার', icon: Award },
    { id: 'settings', label: 'Settings', labelBn: 'সেটিংস', icon: Settings },
  ];

  const handleSelect = (tab: NavigationTab) => {
    onTabChange(tab);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-xs"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-200 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top: Logo & Nav */}
        <div>
          <div className="h-16 px-5 border-b border-slate-200 flex items-center justify-between">
            <Logo size="md" />
          </div>

          <div className="px-3 py-4">
            <span className="px-3 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
              Main Menu
            </span>
            <nav className="mt-2 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-[#176B45]/10 text-[#176B45]'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`w-4 h-4 shrink-0 ${
                          isActive ? 'text-[#176B45]' : 'text-slate-400'
                        }`}
                      />
                      <div className="flex flex-col text-left">
                        <span className="leading-tight">{item.label}</span>
                        <span className="text-[10px] text-slate-400 font-normal leading-tight">
                          {item.labelBn}
                        </span>
                      </div>
                    </div>

                    {item.count !== undefined && item.count > 0 && (
                      <span
                        className={`text-xs px-2 py-0.5 rounded-md font-mono tabular-nums ${
                          isActive
                            ? 'bg-[#176B45] text-white'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Bottom: Screening Notice & Disclaimer Box */}
        <div className="p-4 border-t border-slate-200">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1.5">
            <div className="flex items-center gap-1.5 text-slate-700 font-semibold text-[11px]">
              <ShieldAlert className="w-3.5 h-3.5 text-[#D6A84F] shrink-0" />
              <span>Preliminary Assistant</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              JomiGuard AI detects discrepancies for manual verification. Not an official government registry.
            </p>
          </div>

          <div className="mt-3 text-[11px] text-slate-400 text-center">
            JomiGuard AI MVP · Bangladesh
          </div>
        </div>
      </aside>
    </>
  );
};
