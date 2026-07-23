import React, { useState, useEffect } from 'react';
import { PageConfig } from '../types';
import { PAGES } from '../data/pages';
import { Search, Compass, Layers, CheckCircle2, Sliders, ArrowLeft, Download, ChevronDown, ChevronRight, X } from 'lucide-react';

interface SidebarProps {
  activePageId: number;
  onPageSelect: (id: number) => void;
  customTexts: { [key: string]: string };
  selectedSection?: string | null;
  onBackToDashboard?: () => void;
  user?: { id: string; email: string; display_name: string; avatar_url: string } | null;
  onGoogleLogin?: () => void;
  isLoginInitiating?: boolean;
  onLogout?: () => void;
  onInstallClick?: () => void;
  isOpen?: boolean;
  onClose?: () => void;
  theme?: any;
  playSystemSound?: (type: 'click' | 'success' | 'warning' | 'theme') => void;
  selectedMonthIdx: number;
  setSelectedMonthIdx: (idx: number) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activePageId,
  onPageSelect,
  customTexts,
  selectedSection = null,
  onBackToDashboard,
  user = null,
  onGoogleLogin,
  isLoginInitiating = false,
  onLogout,
  onInstallClick,
  isOpen = false,
  onClose,
  theme,
  playSystemSound,
  selectedMonthIdx,
  setSelectedMonthIdx
}) => {
  const effectiveTheme = theme || {
    primary: '#6366f1',
    text: 'text-indigo-400',
    bg: 'bg-indigo-500',
    hoverBg: 'hover:bg-indigo-600',
    border: 'border-[#e4e4e7]/10',
    hoverBorder: 'hover:border-[#6366f1]',
    shadow: 'shadow-[#6366f1]/20',
    accentTextHover: 'group-hover:text-[#6366f1]',
    focusRing: 'focus:ring-[#6366f1]',
    focusBorder: 'focus:border-indigo-500',
    fromTo: 'from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400',
    btnBg: 'bg-indigo-600 hover:bg-indigo-500',
    badgeText: 'text-indigo-300',
    badgeBg: 'bg-indigo-600/10',
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [collapsedSections, setCollapsedSections] = useState<{[key: string]: boolean}>(() => {
    const initial: {[key: string]: boolean} = {};
    const activePage = PAGES.find(p => p.id === activePageId);
    const activeSection = activePage ? activePage.section : '';
    PAGES.forEach(p => {
      if (p.section !== activeSection) {
        initial[p.section] = true;
      }
    });
    return initial;
  });

  // Automatically expand the section of the active page when it changes
  useEffect(() => {
    const activePage = PAGES.find(p => p.id === activePageId);
    if (activePage) {
      setCollapsedSections(prev => ({
        ...prev,
        [activePage.section]: false
      }));
    }
  }, [activePageId]);

  const toggleSection = (sectionName: string) => {
    setCollapsedSections(prev => ({
      ...prev,
      [sectionName]: !prev[sectionName]
    }));
  };

  // Filter pages based on search query AND selectedSection
  const filteredPages = PAGES.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.section.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSection = selectedSection ? p.section === selectedSection : true;
    return matchesSearch && matchesSection;
  });

  // Group pages by section
  const sections = Array.from(new Set(filteredPages.map(p => p.section)));

  return (
    <aside className={`fixed inset-y-0 left-0 z-50 lg:relative lg:flex w-80 bg-[#141416] border-r border-[#e4e4e7]/10 flex-col shrink-0 select-none transition-transform duration-300 ${
      isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
    }`}>
      {/* Brand Header */}
      <div className="p-6 border-b border-[#e4e4e7]/10 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-3">
          <div className={`w-8 h-8 rounded ${effectiveTheme.bg} flex items-center justify-center font-bold text-white text-xs tracking-wider shadow-lg shadow-${effectiveTheme.primary}/20`}>
            EP
          </div>
          <div>
            <span className="font-syne font-extrabold text-xs text-[#e4e4e7] uppercase tracking-wider block">
              Execute OS
            </span>
            <span className="text-[9px] font-mono text-[#e4e4e7]/40 uppercase tracking-widest block">
              Operational Hub
            </span>
          </div>
        </div>
        {onClose && (
          <button 
            onClick={() => {
              if (playSystemSound) playSystemSound('click');
              onClose();
            }}
            className="lg:hidden text-gray-400 hover:text-white p-1 rounded-md transition"
            id="mobile-sidebar-close-btn"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Back to Dashboard Button */}
      {onBackToDashboard && (
        <div className="px-4 py-3 border-b border-[#e4e4e7]/10 bg-[#0c0c0e]/40 flex items-center shrink-0">
          <button
            onClick={() => {
              if (playSystemSound) playSystemSound('click');
              onBackToDashboard();
            }}
            className={`text-[#e4e4e7]/60 hover:${effectiveTheme.text} text-xs font-mono uppercase tracking-wider px-2.5 py-1.5 rounded hover:bg-white/5 transition flex items-center space-x-2 w-full`}
            id="back-to-dashboard-btn"
          >
            <ArrowLeft className={`h-3.5 w-3.5 ${effectiveTheme.text}`} />
            <span>Dashboard Hub</span>
          </button>
        </div>
      )}

      {/* Search Input Panel */}
      <div className="p-4 border-b border-[#e4e4e7]/10">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="SYSTEM_SEARCH..."
            aria-label="Search pages or sections"
            className={`w-full bg-[#0c0c0e] border border-[#e4e4e7]/15 rounded-md py-2 pl-9 pr-3 text-xs font-mono text-[#e4e4e7] placeholder-[#e4e4e7]/30 focus:outline-none focus:${effectiveTheme.focusBorder} focus:ring-1 focus:${effectiveTheme.focusRing} transition-all`}
            id="page-search-input"
          />
          <Search className="absolute left-3 top-2.5 text-[#e4e4e7]/30 h-3.5 w-3.5" />
        </div>
      </div>

      {/* Pages List Grouped */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-4">
        {sections.map(sectionName => {
          const sectionPages = filteredPages.filter(p => p.section === sectionName);
          if (sectionPages.length === 0) return null;

          const isCollapsed = collapsedSections[sectionName];

          return (
            <div key={sectionName} className="space-y-1">
              {/* Section Header */}
              <button
                type="button"
                onClick={() => {
                  if (playSystemSound) playSystemSound('click');
                  toggleSection(sectionName);
                }}
                className={`w-full text-left text-[10px] font-mono font-bold uppercase tracking-widest ${effectiveTheme.text} px-3 py-2 flex items-center justify-between hover:bg-white/5 rounded-lg transition focus:outline-none`}
              >
                <div className="flex items-center space-x-1.5">
                  {isCollapsed ? (
                    <ChevronRight className="h-3.5 w-3.5 opacity-60" />
                  ) : (
                    <ChevronDown className="h-3.5 w-3.5" />
                  )}
                  <span>{sectionName}</span>
                </div>
                <span className="text-[8px] font-mono text-[#e4e4e7]/50 bg-[#e4e4e7]/5 px-1.5 py-0.2 rounded border border-[#e4e4e7]/10">
                  {sectionPages.length}
                </span>
              </button>

              {/* Section Pages */}
              {!isCollapsed && (
                sectionName === 'Monthly Dashboards' ? (
                  <div className="grid grid-cols-4 gap-1 p-1.5 bg-[#0c0c0e]/40 rounded-lg border border-[#e4e4e7]/5">
                    {[
                      { num: '01', name: 'Jan', index: 0 },
                      { num: '02', name: 'Feb', index: 1 },
                      { num: '03', name: 'Mar', index: 2 },
                      { num: '04', name: 'Apr', index: 3 },
                      { num: '05', name: 'May', index: 4 },
                      { num: '06', name: 'Jun', index: 5 },
                      { num: '07', name: 'Jul', index: 6 },
                      { num: '08', name: 'Aug', index: 7 },
                      { num: '09', name: 'Sep', index: 8 },
                      { num: '10', name: 'Oct', index: 9 },
                      { num: '11', name: 'Nov', index: 10 },
                      { num: '12', name: 'Dec', index: 11 }
                    ].map(m => {
                      const isActive = activePageId === 6 && selectedMonthIdx === m.index;
                      const isCustomized = Object.keys(customTexts).some(k => 
                        k.startsWith(`month_${m.num}`)
                      );

                      return (
                        <button
                          key={m.num}
                          onClick={() => {
                            if (playSystemSound) playSystemSound('click');
                            onPageSelect(6);
                            setSelectedMonthIdx(m.index);
                          }}
                          title={`${m.name} Monthly Dashboard`}
                          className={`py-1.5 text-center rounded text-[10px] font-mono uppercase tracking-wider transition-all border relative focus:outline-none focus:ring-1 focus:${effectiveTheme.focusRing} ${
                            isActive
                              ? `${effectiveTheme.bg} text-[#0c0c0e] font-extrabold border-transparent`
                              : `bg-transparent text-[#e4e4e7]/40 ${effectiveTheme.badgeBg} hover:text-[#e4e4e7] border-transparent`
                          }`}
                          id={`sidebar-month-btn-${m.num}`}
                        >
                          {m.name}
                          {isCustomized && !isActive && (
                            <span className="absolute top-0.5 right-0.5 w-1 h-1 rounded-full bg-emerald-400" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="space-y-0.5">
                    {sectionPages.map(page => {
                      const isActive = activePageId === page.id;
                      
                      // Check if this page has customized edits
                      const isCustomized = Object.keys(customTexts).some(k => 
                        k.startsWith(`calendar_focus_${page.id}`) ||
                        k.startsWith(`q_${page.q}_`) ||
                        (page.type === 'monthly_dashboard' && k.startsWith(`month_${page.num}`)) ||
                        k.startsWith(`weekly_day_focus`) ||
                        (page.type === 'daily_center_a' && (k.startsWith('daily_gratitude') || k.startsWith('daily_metric') || k.startsWith('daily_todo'))) ||
                        (page.type === 'daily_center_b' && k.startsWith('daily_b_')) ||
                        (page.type === 'portfolio_audit' && k.startsWith('audit_')) ||
                        (page.type === 'lessons_reflections' && k.startsWith('lessons_'))
                      );

                      return (
                        <button
                          key={page.id}
                          onClick={() => {
                            if (playSystemSound) playSystemSound('click');
                            onPageSelect(page.id);
                          }}
                          aria-label={`Select page ${page.id}: ${page.title}`}
                          className={`w-full text-left flex items-center justify-between px-3 py-2 rounded-md transition-all border focus:outline-none focus:ring-1 focus:${effectiveTheme.focusRing} ${
                            isActive
                              ? `${effectiveTheme.badgeBg} ${effectiveTheme.text} font-semibold ${effectiveTheme.border} shadow-sm`
                              : 'text-[#e4e4e7]/60 hover:bg-white/5 hover:text-[#e4e4e7] border-transparent'
                          }`}
                          id={`sidebar-page-btn-${page.id}`}
                        >
                          <div className="truncate flex items-center space-x-2">
                            <span className="w-5 text-[#e4e4e7]/30 text-right font-mono text-[10px]">
                              [{String(page.id).padStart(2, '0')}]
                            </span>
                            <span className="truncate text-xs font-mono uppercase tracking-wider">
                              {page.title}
                            </span>
                          </div>
                          
                          {/* Interactive indicators */}
                          <div className="flex items-center space-x-1.5 shrink-0">
                            {isCustomized && (
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" title="Contains custom live edits" />
                            )}
                            <CheckCircle2 className={`h-3 w-3 ${isActive ? effectiveTheme.text : 'text-[#e4e4e7]/10'}`} />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )
              )}
            </div>
          );
        })}

        {filteredPages.length === 0 && (
          <div className="text-center py-8 text-[#e4e4e7]/40 font-mono text-xs">
            NO_MATCH_FOUND
          </div>
        )}
      </div>

      {/* Sidebar Controls at the bottom */}
      <div className="p-4 border-t border-[#e4e4e7]/10 bg-[#0c0c0e]/30 space-y-2">
        {/* Download App Button */}
        <button
          onClick={onInstallClick}
          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs py-2 px-3 rounded font-mono font-bold uppercase tracking-wider flex items-center justify-center space-x-1.5 transition active:scale-95 shadow-sm shadow-emerald-600/10 cursor-pointer"
          id="download-app-btn"
        >
          <Download className="h-3.5 w-3.5" />
          <span>Download App</span>
        </button>

        {/* Google Login Button */}
        {user ? (
          <div className="flex flex-col space-y-2 border-t border-[#e4e4e7]/5 pt-2">
            <div className="flex items-center space-x-2 px-1">
              <img
                src={user.avatar_url}
                alt={user.display_name}
                className="w-6 h-6 rounded-full border border-transparent object-cover"
                style={{ borderColor: `${effectiveTheme.primary}4c` }}
                referrerPolicy="no-referrer"
              />
              <span className="text-[11px] font-mono text-[#e4e4e7]/80 truncate">
                {user.display_name}
              </span>
            </div>
            <button
              onClick={() => {
                if (playSystemSound) playSystemSound('click');
                onLogout && onLogout();
              }}
              className="w-full bg-transparent hover:bg-red-950/20 hover:text-red-400 text-gray-400 text-[10px] py-1.5 rounded border border-[#e4e4e7]/10 hover:border-red-900/40 transition active:scale-95 font-mono uppercase tracking-wider cursor-pointer"
              id="header-logout-btn"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <button
            onClick={() => {
              if (playSystemSound) playSystemSound('click');
              onGoogleLogin && onGoogleLogin();
            }}
            disabled={isLoginInitiating}
            className={`w-full bg-[#1c1e22] hover:${effectiveTheme.badgeBg} border border-[#e4e4e7]/15 text-[#e4e4e7] text-xs py-2 px-3 rounded font-mono font-bold uppercase tracking-wider flex items-center justify-center space-x-2 active:scale-95 transition disabled:opacity-50 cursor-pointer`}
            id="header-login-btn"
          >
            {isLoginInitiating ? (
              <div className={`w-3.5 h-3.5 border-2 border-transparent border-t-${effectiveTheme.primary} rounded-full animate-spin`} style={{ borderTopColor: effectiveTheme.primary }} />
            ) : (
              <svg className="w-3.5 h-3.5" style={{ color: effectiveTheme.primary }} viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            )}
            <span>Connect Google</span>
          </button>
        )}
      </div>

      {/* Footer Branding inside Sidebar */}
      <div className="p-4 border-t border-[#e4e4e7]/10 bg-[#0c0c0e]/50 flex items-center justify-between">
        <div className="flex items-center space-x-1.5">
          <Compass className={`h-3.5 w-3.5 ${effectiveTheme.text} animate-spin-slow`} />
          <span className="text-[9px] font-mono font-bold text-[#e4e4e7]/50 tracking-wider">A5 VECTOR COMPILER</span>
        </div>
        <span className={`text-[9px] font-mono font-bold ${effectiveTheme.text}`}>v2.1 PRO</span>
      </div>
    </aside>
  );
};
