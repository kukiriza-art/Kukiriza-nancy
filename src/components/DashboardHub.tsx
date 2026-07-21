import React, { useState } from 'react';
import { PageConfig, PlannerState } from '../types';
import { PAGES } from '../data/pages';
import { 
  Calendar, 
  Layers, 
  TrendingUp, 
  Clock, 
  Briefcase, 
  Search, 
  ArrowRight, 
  ChevronRight,
  Sparkles,
  Award
} from 'lucide-react';

interface DashboardHubProps {
  state: PlannerState;
  customTexts: { [key: string]: string };
  onNavigateToSection: (section: string, pageId?: number) => void;
  user?: { id: string; email: string; display_name: string; avatar_url: string } | null;
}

export const DashboardHub: React.FC<DashboardHubProps> = ({
  state,
  customTexts,
  onNavigateToSection,
  user
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Fixed/current local time representation: July 4, 2026
  const today = new Date('2026-07-04T10:59:31-07:00');
  
  // Calculate appropriate greeting based on hours (10:59 AM -> Morning)
  const hours = today.getHours();
  const displayName = user ? user.display_name : 'Operator';
  const greeting = hours < 12 
    ? `Good Morning, ${displayName}` 
    : hours < 17 
      ? `Good Afternoon, ${displayName}` 
      : `Good Evening, ${displayName}`;

  const formattedDate = today.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // 1. Year Progress Calculation (Average of annual goals)
  const totalGoals = state.annualGoals.length;
  const avgGoalProgress = totalGoals > 0 
    ? Math.round(state.annualGoals.reduce((sum, g) => sum + g.progress, 0) / totalGoals)
    : 0;

  // 2. Count Active Projects (In Progress)
  const activeProjectsCount = state.projects.filter(p => p.status === 'In Progress').length;

  // 3. Simple Search matches across all 24 templates
  const searchResults = searchQuery.trim() !== ''
    ? PAGES.filter(p => 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.desc && p.desc.toLowerCase().includes(searchQuery.toLowerCase())) ||
        p.section.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  // Configuration for the exactly 5 Navigation cards as requested
  const navigationCards = [
    {
      id: 'year',
      title: 'Year',
      value: '2026',
      subtext: 'Year Workspace',
      icon: <Calendar className="h-5 w-5 text-indigo-400" />,
      targetSection: 'Year Planning',
      defaultPageId: 2, // Annual Vision
      extraElement: (
        <div className="w-full mt-3 space-y-1.5" id="year-progress-indicator">
          <div className="flex justify-between text-[10px] text-gray-400 font-mono">
            <span>Goal Progress</span>
            <span className="text-indigo-400 font-bold">{avgGoalProgress}%</span>
          </div>
          <div className="w-full bg-gray-800/80 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-indigo-500 to-indigo-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${avgGoalProgress}%` }}
            />
          </div>
        </div>
      )
    },
    {
      id: 'month',
      title: 'Month',
      value: 'July',
      subtext: 'Month Workspace',
      icon: <Layers className="h-5 w-5 text-emerald-400" />,
      targetSection: 'Monthly Dashboards',
      defaultPageId: 12, // July Dashboard
      extraElement: null
    },
    {
      id: 'week',
      title: 'Week',
      value: 'Week 27',
      subtext: 'Week Workspace',
      icon: <TrendingUp className="h-5 w-5 text-amber-400" />,
      targetSection: 'Weekly Planning',
      defaultPageId: 18, // Weekly Roadmap
      extraElement: null
    },
    {
      id: 'today',
      title: 'Today',
      value: 'Saturday, July 4',
      subtext: 'Daily Workspace',
      icon: <Clock className="h-5 w-5 text-rose-400" />,
      targetSection: 'Daily Planning',
      defaultPageId: 19, // Daily Command Center
      extraElement: null
    },
    {
      id: 'projects',
      title: 'Projects',
      value: `${activeProjectsCount} Active Projects`,
      subtext: 'Project Workspace',
      icon: <Briefcase className="h-5 w-5 text-sky-400" />,
      targetSection: 'Project Management',
      defaultPageId: 20, // Projects Portfolio Meter
      extraElement: null
    }
  ];

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#121316] p-6 lg:p-12 flex flex-col items-center">
      <div className="w-full max-w-4xl space-y-10 py-6">
        
        {/* HEADER SECTION - Minimal, elegant, houses search + greeting */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-gray-800/50 pb-8 gap-6">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-indigo-400 tracking-widest uppercase block">
              OPERATIONAL PORTAL
            </span>
            <h2 className="text-white text-2xl lg:text-3xl font-extrabold font-sans tracking-tight">
              {greeting}
            </h2>
            <p className="text-xs text-gray-400 font-sans tracking-wide">
              {formattedDate}
            </p>
          </div>

          {/* Minimal Elegant Search Bar inside Header */}
          <div className="relative w-full md:w-80 shrink-0">
            <label htmlFor="hub-header-search-input" className="sr-only">Search planner entries</label>
            <input
              type="text"
              id="hub-header-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects, goals, notes..."
              className="w-full bg-[#1C1E22] border border-gray-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all font-sans"
            />
            <Search className="absolute left-3.5 top-3 text-gray-500 h-3.5 w-3.5" />
            
            {searchQuery.trim() !== '' && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-[9px] font-bold text-gray-400 hover:text-white bg-gray-800 px-1.5 py-0.5 rounded transition"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* SEARCH RESULTS OVERLAY PANEL */}
        {searchQuery.trim() !== '' && (
          <div className="bg-[#1C1E22] border border-gray-800 rounded-xl p-4 shadow-2xl space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
            <h3 className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
              Search Results ({searchResults.length})
            </h3>
            {searchResults.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-64 overflow-y-auto custom-scrollbar">
                {searchResults.map(p => (
                  <button
                    key={p.id}
                    onClick={() => onNavigateToSection(p.section, p.id)}
                    className="flex items-start text-left p-2.5 rounded-lg hover:bg-[#25282E] group transition border border-transparent hover:border-gray-800/80"
                    id={`search-result-page-${p.id}`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-1.5">
                        <span className="text-[9px] font-mono text-gray-500 font-bold bg-gray-800 px-1.5 py-0.5 rounded">
                          Page {String(p.id).padStart(2, '0')}
                        </span>
                        <span className="text-xs font-bold text-gray-200 truncate group-hover:text-indigo-400 transition">
                          {p.title}
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-400 mt-1 truncate">
                        {p.desc || p.section}
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-600 group-hover:text-white shrink-0 ml-2 self-center transition-transform group-hover:translate-x-0.5" />
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-500 italic py-2">
                No matching page templates found. Try searching "Vision", "Projects", or a month like "January".
              </p>
            )}
          </div>
        )}

        {/* 5 NAVIGATION CARDS GRID - Calm, premium, uncluttered */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center space-x-1.5">
              <Award className="h-4 w-4 text-indigo-500" />
              <span>Operational Navigation Hierarchy</span>
            </h3>
            <span className="text-[9px] font-mono text-gray-600 bg-gray-900 px-2 py-0.5 rounded border border-gray-850">
              SINGLE-LEVEL CHANNELS
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" id="dashboard-cards-grid">
            {navigationCards.map(card => (
              <div
                key={card.id}
                onClick={() => onNavigateToSection(card.targetSection, card.defaultPageId)}
                className="bg-[#1C1E22] hover:bg-[#22252B] border border-gray-800 hover:border-indigo-500/30 rounded-xl p-6 shadow-lg shadow-black/10 cursor-pointer flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden h-44"
                id={`nav-card-${card.id}`}
              >
                {/* Accent border highlight on hover */}
                <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-gray-400 uppercase font-bold tracking-widest font-mono">
                      {card.title}
                    </span>
                    <div className="bg-[#151619] border border-gray-800 p-2 rounded-lg group-hover:bg-indigo-600/10 transition-colors">
                      {card.icon}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-white font-extrabold text-lg tracking-tight group-hover:text-indigo-400 transition-colors flex items-center">
                      <span>{card.value}</span>
                      <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all ml-2 text-indigo-400" />
                    </h4>
                  </div>
                </div>

                <div className="border-t border-gray-800/50 pt-3 flex items-center justify-between">
                  <span className="text-[10px] text-gray-500 font-semibold tracking-wide uppercase">
                    {card.subtext}
                  </span>
                  {card.extraElement}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* REFINED CALM FOOTER */}
        <div className="bg-[#151619] border border-gray-850 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs gap-3 font-sans">
          <p className="text-gray-400 font-medium">
            Tap any card above to drills down into your customized interactive canvas templates.
          </p>
          <span className="text-[9px] text-gray-500 font-mono text-right uppercase tracking-wider">
            Execute Systems • Clean Slate
          </span>
        </div>

      </div>
    </div>
  );
};
