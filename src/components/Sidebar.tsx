import React, { useState } from 'react';
import { PageConfig } from '../types';
import { PAGES } from '../data/pages';
import { Search, Compass, Layers, CheckCircle2, Sliders, ArrowLeft } from 'lucide-react';

interface SidebarProps {
  activePageId: number;
  onPageSelect: (id: number) => void;
  customTexts: { [key: string]: string };
  selectedSection?: string | null;
  onBackToDashboard?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activePageId,
  onPageSelect,
  customTexts,
  selectedSection = null,
  onBackToDashboard
}) => {
  const [searchQuery, setSearchQuery] = useState('');

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
    <aside className="hidden lg:flex w-80 bg-[#1C1E22] border-r border-gray-800 flex-col shrink-0 select-none">
      {/* Back to Dashboard Button */}
      {onBackToDashboard && (
        <div className="p-3 border-b border-gray-800 bg-[#151619] flex items-center shrink-0">
          <button
            onClick={onBackToDashboard}
            className="text-gray-400 hover:text-white text-xs font-semibold px-2.5 py-1.5 rounded-md hover:bg-gray-800 transition flex items-center space-x-2 w-full"
            id="back-to-dashboard-btn"
          >
            <ArrowLeft className="h-4 w-4 text-indigo-400" />
            <span>Back to Dashboard</span>
          </button>
        </div>
      )}

      {/* Search Input Panel */}
      <div className="p-4 border-b border-gray-800">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search pages or sections..."
            aria-label="Search pages or sections"
            className="w-full bg-[#121316] border border-gray-700 rounded-md py-2 pl-9 pr-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 transition-all"
            id="page-search-input"
          />
          <Search className="absolute left-3 top-2.5 text-gray-500 h-3.5 w-3.5" />
        </div>
      </div>

      {/* Pages List Grouped */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-4">
        {sections.map(sectionName => {
          const sectionPages = filteredPages.filter(p => p.section === sectionName);
          if (sectionPages.length === 0) return null;

          return (
            <div key={sectionName} className="space-y-1">
              {/* Section Header */}
              <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500 px-3 py-1.5 font-sans flex items-center justify-between">
                <span>{sectionName}</span>
                <span className="text-[9px] font-mono text-gray-600 bg-gray-800/30 px-1.5 py-0.2 rounded">
                  {sectionPages.length}
                </span>
              </div>

              {/* Section Pages */}
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
                      onClick={() => onPageSelect(page.id)}
                      aria-label={`Select page ${page.id}: ${page.title}`}
                      className={`w-full text-left flex items-center justify-between px-3 py-2.5 rounded-md transition-all border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        isActive
                          ? 'bg-indigo-600/15 text-indigo-300 font-semibold border-indigo-500/40 shadow-inner'
                          : 'text-gray-400 hover:bg-[#25282E] hover:text-white border-transparent'
                      }`}
                      id={`sidebar-page-btn-${page.id}`}
                    >
                      <div className="truncate flex items-center space-x-2">
                        <span className="w-5 text-gray-500 text-right font-mono text-[11px]">
                          {String(page.id).padStart(2, '0')}
                        </span>
                        <span className="truncate text-xs font-sans tracking-tight">
                          {page.title}
                        </span>
                      </div>
                      
                      {/* Interactive indicators */}
                      <div className="flex items-center space-x-1 shrink-0">
                        {isCustomized && (
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" title="Contains custom live edits" />
                        )}
                        <CheckCircle2 className={`h-3 w-3 ${isActive ? 'text-indigo-400' : 'text-gray-700 group-hover:text-gray-500'}`} />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}

        {filteredPages.length === 0 && (
          <div className="text-center py-8 text-gray-500 text-xs">
            No pages found matching search query.
          </div>
        )}
      </div>

      {/* Footer Branding inside Sidebar */}
      <div className="p-4 border-t border-gray-800 bg-[#16171a] flex items-center justify-between">
        <div className="flex items-center space-x-1.5">
          <Compass className="h-4 w-4 text-indigo-400 animate-spin-slow" />
          <span className="text-[10px] font-bold text-gray-400 tracking-wider">A5 VECTOR COMPILER</span>
        </div>
        <span className="text-[9px] font-mono font-semibold text-gray-600">v2.0 PRO</span>
      </div>
    </aside>
  );
};
