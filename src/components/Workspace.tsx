import React, { useState, useEffect } from 'react';
import { PageConfig, PlannerState } from '../types';
import { generateSVGString } from '../utils/svgGenerator';
import { 
  Minus, 
  Plus, 
  SlidersHorizontal, 
  CheckSquare, 
  Target, 
  Calendar as CalendarIcon, 
  Settings, 
  TrendingUp, 
  PiggyBank,
  Check,
  Eye,
  FileText,
  Briefcase,
  Smile,
  Star,
  ClipboardList,
  Sparkles,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  PlusCircle,
  Trash2,
  Calendar,
  ArrowRight,
  BookOpen,
  Heart,
  Award,
  Compass,
  Layers,
  X,
  DollarSign,
  AlertCircle,
  ArrowUpRight,
  Moon,
  Clock,
  Paperclip,
  Search,
  ArrowLeft,
  Archive,
  Activity
} from 'lucide-react';
import { motion } from 'motion/react';
import { TodayWorkspace } from './TodayWorkspace';
import { ProjectsWorkspace } from './ProjectsWorkspace';

interface WorkspaceProps {
  activePage: PageConfig;
  state: PlannerState;
  customTexts: { [key: string]: string };
  onCustomTextChange: (key: string, value: string) => void;
  onStateChange?: (updatedState: PlannerState) => void;
  onPageSelect?: (pageId: number) => void;
  
  // Lifted UI states
  todayTab: 'overview' | 'schedule' | 'tasks' | 'blocking' | 'habits' | 'notes' | 'reflection';
  setTodayTab: React.Dispatch<React.SetStateAction<'overview' | 'schedule' | 'tasks' | 'blocking' | 'habits' | 'notes' | 'reflection'>>;
  weekTab: 'overview' | 'priorities' | 'calendar' | 'schedule' | 'tasks' | 'habits' | 'goals' | 'notes' | 'review';
  setWeekTab: React.Dispatch<React.SetStateAction<'overview' | 'priorities' | 'calendar' | 'schedule' | 'tasks' | 'habits' | 'goals' | 'notes' | 'review'>>;
  monthTab: 'overview' | 'calendar' | 'goals' | 'habits' | 'projects' | 'budget' | 'notes' | 'review';
  setMonthTab: React.Dispatch<React.SetStateAction<'overview' | 'calendar' | 'goals' | 'habits' | 'projects' | 'budget' | 'notes' | 'review'>>;
  selectedProjectId: number | null;
  setSelectedProjectId: React.Dispatch<React.SetStateAction<number | null>>;
  projectTab: 'overview' | 'objectives' | 'tasks' | 'milestones' | 'notes' | 'attachments' | 'timeline' | 'activity' | 'reviews';
  setProjectTab: React.Dispatch<React.SetStateAction<'overview' | 'objectives' | 'tasks' | 'milestones' | 'notes' | 'attachments' | 'timeline' | 'activity' | 'reviews'>>;
  selectedDate: number;
  setSelectedDate: React.Dispatch<React.SetStateAction<number>>;
}

export const Workspace: React.FC<WorkspaceProps> = ({
  activePage,
  state,
  customTexts,
  onCustomTextChange,
  onStateChange,
  onPageSelect,
  todayTab,
  setTodayTab,
  weekTab,
  setWeekTab,
  monthTab,
  setMonthTab,
  selectedProjectId,
  setSelectedProjectId,
  projectTab,
  setProjectTab,
  selectedDate,
  setSelectedDate
}) => {
  const [scale, setScale] = useState<number>(0.80);
  const [mobileMode, setMobileMode] = useState<'edit' | 'preview'>('edit');
  const [activeWeek, setActiveWeek] = useState<number>(1);
  const [projectFilter, setProjectFilter] = useState<'all' | 'active' | 'completed' | 'archived'>('all');
  const [projectSearch, setProjectSearch] = useState<string>('');
  const [expandedWeekReview, setExpandedWeekReview] = useState<{[key: string]: boolean}>({
    wins: true,
    challenges: false,
    lessons: false,
    goals: false,
    habits: false,
    reflection: false,
    nextPriorities: false
  });

  // Accordion collapsed/expanded states for Year Workspace
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({
    overview: true,
    vision: false,
    goals: false,
    lifeAreas: false,
    projects: false,
    quarterly: false,
    calendar: false,
    keyMetrics: false,
    review: false
  });

  const toggleSection = (sec: string) => {
    setExpandedSections(prev => ({ ...prev, [sec]: !prev[sec] }));
  };

  const [goalsCategory, setGoalsCategory] = useState<string>('All');

  // Automatically adjust initial scale based on window height to fit nicely
  useEffect(() => {
    const handleResize = () => {
      if (window.innerHeight < 900) {
        setScale(0.70);
      } else {
        setScale(0.80);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleZoomIn = () => {
    setScale(prev => Math.min(1.5, Math.round((prev + 0.05) * 100) / 100));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(0.5, Math.round((prev - 0.05) * 100) / 100));
  };

  const handleResetZoom = () => {
    setScale(0.80);
  };

  const monthNum = activePage.num || '01';
  const monthName = activePage.month || 'January';

  // Helper to fetch custom text
  const getVal = (key: string, fallback: string) => {
    return customTexts[key] !== undefined ? customTexts[key] : fallback;
  };

  // Streamlined fields mapped with persistent localStorage customTexts keys
  
  // 1. Projects (3 total)
  const proj1_name = getVal(`month_${monthNum}_proj1_name`, 'Web Architecture Launch');
  const proj1_start = getVal(`month_${monthNum}_proj1_start`, '04/01');
  const proj1_end = getVal(`month_${monthNum}_proj1_end`, '04/12');
  const proj1_progress = getVal(`month_${monthNum}_proj1_progress`, '65');

  const proj2_name = getVal(`month_${monthNum}_proj2_name`, 'Financial Portfolio Sync');
  const proj2_start = getVal(`month_${monthNum}_proj2_start`, '04/10');
  const proj2_end = getVal(`month_${monthNum}_proj2_end`, '04/22');
  const proj2_progress = getVal(`month_${monthNum}_proj2_progress`, '30');

  const proj3_name = getVal(`month_${monthNum}_proj3_name`, 'Content Brand Campaign');
  const proj3_start = getVal(`month_${monthNum}_proj3_start`, '04/15');
  const proj3_end = getVal(`month_${monthNum}_proj3_end`, '04/28');
  const proj3_progress = getVal(`month_${monthNum}_proj3_progress`, '10');

  // 2. Savings Tracker
  const savings_goal_desc = getVal(`month_${monthNum}_savings_goal_desc`, 'Q2 Reserve Base');
  const savings_target = getVal(`month_${monthNum}_savings_target`, '$3,000');
  const savings_saved = getVal(`month_${monthNum}_savings_saved`, '$1,950');
  const savings_progress = getVal(`month_${monthNum}_savings_progress`, '65');

  // 3. Habits Monday to Sunday states
  const habit1_name = getVal(`month_${monthNum}_habit1_name`, 'Early Morning Wake-up');
  const habit1_mon = getVal(`month_${monthNum}_habit1_mon`, 'true') === 'true';
  const habit1_tue = getVal(`month_${monthNum}_habit1_tue`, 'true') === 'true';
  const habit1_wed = getVal(`month_${monthNum}_habit1_wed`, 'true') === 'true';
  const habit1_thu = getVal(`month_${monthNum}_habit1_thu`, 'false') === 'true';
  const habit1_fri = getVal(`month_${monthNum}_habit1_fri`, 'true') === 'true';
  const habit1_sat = getVal(`month_${monthNum}_habit1_sat`, 'false') === 'true';
  const habit1_sun = getVal(`month_${monthNum}_habit1_sun`, 'false') === 'true';

  const habit2_name = getVal(`month_${monthNum}_habit2_name`, 'Deep Work Loop (2hr)');
  const habit2_mon = getVal(`month_${monthNum}_habit2_mon`, 'true') === 'true';
  const habit2_tue = getVal(`month_${monthNum}_habit2_tue`, 'true') === 'true';
  const habit2_wed = getVal(`month_${monthNum}_habit2_wed`, 'false') === 'true';
  const habit2_thu = getVal(`month_${monthNum}_habit2_thu`, 'true') === 'true';
  const habit2_fri = getVal(`month_${monthNum}_habit2_fri`, 'true') === 'true';
  const habit2_sat = getVal(`month_${monthNum}_habit2_sat`, 'false') === 'true';
  const habit2_sun = getVal(`month_${monthNum}_habit2_sun`, 'false') === 'true';

  const habit3_name = getVal(`month_${monthNum}_habit3_name`, 'Daily Cardio Routine');
  const habit3_mon = getVal(`month_${monthNum}_habit3_mon`, 'false') === 'true';
  const habit3_tue = getVal(`month_${monthNum}_habit3_tue`, 'true') === 'true';
  const habit3_wed = getVal(`month_${monthNum}_habit3_wed`, 'true') === 'true';
  const habit3_thu = getVal(`month_${monthNum}_habit3_thu`, 'false') === 'true';
  const habit3_fri = getVal(`month_${monthNum}_habit3_fri`, 'true') === 'true';
  const habit3_sat = getVal(`month_${monthNum}_habit3_sat`, 'true') === 'true';
  const habit3_sun = getVal(`month_${monthNum}_habit3_sun`, 'false') === 'true';

  // 4. Daily To-Dos
  const daily1_text = getVal(`month_${monthNum}_daily1_text`, 'Refine product architecture slides');
  const daily1_done = getVal(`month_${monthNum}_daily1_done`, 'true') === 'true';
  const daily2_text = getVal(`month_${monthNum}_daily2_text`, 'Coordinate with backend developers');
  const daily2_done = getVal(`month_${monthNum}_daily2_done`, 'true') === 'true';
  const daily3_text = getVal(`month_${monthNum}_daily3_text`, 'Review weekly cashflow metrics');
  const daily3_done = getVal(`month_${monthNum}_daily3_done`, 'false') === 'true';
  const daily4_text = getVal(`month_${monthNum}_daily4_text`, 'Plan next sprint milestones');
  const daily4_done = getVal(`month_${monthNum}_daily4_done`, 'false') === 'true';
  const daily5_text = getVal(`month_${monthNum}_daily5_text`, 'Recharge personal reading goals');
  const daily5_done = getVal(`month_${monthNum}_daily5_done`, 'false') === 'true';

  // 5. Daily Assessment & Reflection Rating
  const daily_rating = getVal(`month_${monthNum}_daily_rating`, '4');
  const daily_reflection = getVal(`month_${monthNum}_daily_reflection`, 'Productive sprint review; completed key mockups. Need to clear backlog tomorrow.');

  // 6. Weekly Analysis
  const weekly_analysis = getVal(`month_${monthNum}_weekly_analysis`, 'Weekly performance score was high. Web architecture timeline completed ahead of schedule. Savings pipeline is well on target at 65%. Daily habit consistency remains stable across early wake-up routines.');

  // Generate the high-fidelity SVG string for the active page
  const svgString = generateSVGString(activePage, state);

  return (
    <main className="flex-1 bg-[#121316] flex flex-col overflow-hidden relative select-none" id="workspace-main-panel">
      
      {/* MOBILE TOGGLE BAR */}
      <div className="lg:hidden flex border-b border-gray-800 shrink-0 bg-[#1C1E22]">
        <button
          onClick={() => setMobileMode('edit')}
          className={`flex-1 py-3 text-center text-xs font-semibold flex items-center justify-center space-x-1.5 ${
            mobileMode === 'edit' ? 'bg-[#151619] text-indigo-400 border-b-2 border-indigo-500' : 'text-gray-400'
          }`}
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          <span>Edit Month</span>
        </button>
        <button
          onClick={() => setMobileMode('preview')}
          className={`flex-1 py-3 text-center text-xs font-semibold flex items-center justify-center space-x-1.5 ${
            mobileMode === 'preview' ? 'bg-[#151619] text-indigo-400 border-b-2 border-indigo-500' : 'text-gray-400'
          }`}
        >
          <Eye className="h-3.5 w-3.5" />
          <span>A5 Blueprint Preview</span>
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT COLUMN: EDIT FORM (Responsive visibility) */}
        <div className={`w-full lg:w-[460px] shrink-0 border-r border-gray-800 bg-[#1C1E22] flex flex-col overflow-y-auto custom-scrollbar p-5 space-y-5 ${
          mobileMode === 'edit' ? 'block' : 'hidden lg:block'
        }`} id="workspace-left-editor">
          
          {activePage.section === 'Year Planning' ? (
            <>
              {/* Header */}
              <div className="border-b border-gray-800/60 pb-3 flex justify-between items-center animate-fade-in">
                <div>
                  <span className="text-[9px] font-bold text-indigo-400 tracking-widest uppercase block mb-0.5">Strategic Workspace</span>
                  <h2 className="text-white text-base font-bold font-sans tracking-tight">Year Workspace</h2>
                  <p className="text-[11px] text-gray-400">Plan and coordinate your strategic annual objectives.</p>
                </div>
                <div className="flex space-x-1 items-center bg-gray-900 px-2.5 py-1 rounded border border-gray-800 shrink-0">
                  <span className="text-[10px] text-gray-400 font-mono">ID:</span>
                  <span className="text-[10px] text-indigo-400 font-bold font-mono">{activePage.id}</span>
                </div>
              </div>

              {/* SECTION 1: YEAR OVERVIEW */}
              <div className="space-y-3 bg-[#151619] p-3.5 rounded-xl border border-gray-800/80 animate-fade-in">
                <button 
                  onClick={() => toggleSection('overview')}
                  className="w-full text-xs font-bold text-gray-200 flex items-center justify-between text-left focus:outline-none"
                >
                  <div className="flex items-center space-x-2">
                    <Compass className="h-4 w-4 text-indigo-400" />
                    <span className="tracking-wide">🌐 1. YEAR OVERVIEW & METRICS</span>
                  </div>
                  {expandedSections.overview ? <ChevronDown className="h-4 w-4 text-gray-400" /> : <ChevronRight className="h-4 w-4 text-gray-400" />}
                </button>

                {expandedSections.overview && (
                  <div className="space-y-3 pt-2 border-t border-gray-800/60">
                    {/* General Stats */}
                    <div className="grid grid-cols-2 gap-2.5">
                      <div className="p-2.5 bg-[#1C1E22] rounded-lg border border-gray-850">
                        <label className="block text-[9px] text-gray-400 font-semibold uppercase tracking-wider mb-0.5">Operating Year</label>
                        <input
                          type="text"
                          value={getVal('cover_year', '2027')}
                          onChange={(e) => onCustomTextChange('cover_year', e.target.value)}
                          className="w-full bg-[#121316] border border-gray-800 rounded px-2 py-1 text-xs text-white font-mono font-bold focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>
                      <div className="p-2.5 bg-[#1C1E22] rounded-lg border border-gray-850 flex flex-col justify-between">
                        <div>
                          <label className="block text-[9px] text-gray-400 font-semibold uppercase tracking-wider">Year Progress</label>
                          <span className="text-sm font-bold text-emerald-400 font-mono mt-0.5 block">
                            {(() => {
                              const total = state.annualGoals?.length || 0;
                              return total > 0 ? Math.round(state.annualGoals.reduce((sum, g) => sum + (g.progress || 0), 0) / total) : 0;
                            })()}% Complete
                          </span>
                        </div>
                        <div className="w-full bg-[#121316] h-1.5 rounded-full overflow-hidden mt-1">
                          <div 
                            className="bg-emerald-500 h-full transition-all duration-300"
                            style={{ 
                              width: `${(() => {
                                const total = state.annualGoals?.length || 0;
                                return total > 0 ? Math.round(state.annualGoals.reduce((sum, g) => sum + (g.progress || 0), 0) / total) : 0;
                              })()}%` 
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Theme and Mission Summary */}
                    <div className="p-3 bg-[#1C1E22] rounded-lg border border-gray-850 space-y-2">
                      <div>
                        <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest block">Annual Theme</span>
                        <p className="text-xs text-gray-200 font-medium font-sans mt-0.5">
                          “{getVal('vision_words', 'SYSTEMS, DISCIPLINE, REVENUE')}”
                        </p>
                      </div>
                      <div className="border-t border-gray-800/60 pt-2">
                        <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest block">Annual Mission</span>
                        <p className="text-xs text-gray-300 font-sans leading-relaxed mt-0.5 italic">
                          {getVal('horizon_mission', 'Launch version 2 of POS-Productivity toolkit and secure 3 strategic brand partners before Q3.')}
                        </p>
                      </div>
                    </div>

                    {/* Gateway Quick Jumps */}
                    <div className="space-y-1.5">
                      <label className="block text-[9px] text-gray-400 font-bold uppercase tracking-wider mb-1">Strategic Planning Sheets (Jump to View)</label>
                      <div className="grid grid-cols-1 gap-1.5">
                        {[
                          { id: 2, name: 'Annual Vision & Goals', desc: 'Core life pillars & commitments', activeIcon: Target },
                          { id: 3, name: '2027 Year Horizon Map', desc: '12-month calendar & major themes', activeIcon: Compass },
                          { id: 4, name: 'Quarterly Strategy Roadmap', desc: 'Milestones & strategy breakdown', activeIcon: Layers },
                          { id: 5, name: 'System Performance OKRs', desc: 'YTD index & mechanical scorecards', activeIcon: TrendingUp },
                          { id: 22, name: 'Life Balance Wheel Review', desc: 'Mappable life categories wheel', activeIcon: Smile },
                          { id: 23, name: 'Next Year Blueprint', desc: 'Continuous forward-looking blueprint', activeIcon: Sparkles },
                          { id: 24, name: 'Year Review Summary', desc: 'Win tallies & annual retrospectives', activeIcon: FileText },
                        ].map((sheet) => {
                          const IconComp = sheet.activeIcon;
                          const isActive = activePage.id === sheet.id;
                          return (
                            <button
                              key={sheet.id}
                              type="button"
                              onClick={() => onPageSelect?.(sheet.id)}
                              className={`w-full p-2.5 rounded-lg flex items-center justify-between text-left transition-all ${
                                isActive 
                                  ? 'bg-[#4f46e5]/15 border border-indigo-500/30 text-white font-semibold' 
                                  : 'bg-[#1C1E22] border border-gray-850 hover:bg-[#22252a] text-gray-300'
                              }`}
                            >
                              <div className="flex items-center space-x-2.5">
                                <IconComp className={`h-4 w-4 ${isActive ? 'text-indigo-400' : 'text-gray-400'}`} />
                                <div>
                                  <span className="text-xs font-semibold block leading-tight">{sheet.name}</span>
                                  <span className="text-[10px] text-gray-500 block leading-tight mt-0.5">{sheet.desc}</span>
                                </div>
                              </div>
                              <div className="flex items-center space-x-1">
                                <span className="text-[9px] text-gray-500 font-mono">P.{sheet.id}</span>
                                <ArrowRight className="h-3 w-3 text-gray-500" />
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* SECTION 2: VISION & ANNUAL MISSION */}
              <div className="space-y-3 bg-[#151619] p-3.5 rounded-xl border border-gray-800/80 animate-fade-in">
                <button 
                  onClick={() => toggleSection('vision')}
                  className="w-full text-xs font-bold text-gray-200 flex items-center justify-between text-left focus:outline-none"
                >
                  <div className="flex items-center space-x-2">
                    <Target className="h-4 w-4 text-indigo-400" />
                    <span className="tracking-wide">🎯 2. VISION & ANNUAL MISSION</span>
                  </div>
                  {expandedSections.vision ? <ChevronDown className="h-4 w-4 text-gray-400" /> : <ChevronRight className="h-4 w-4 text-gray-400" />}
                </button>

                {expandedSections.vision && (
                  <div className="space-y-3 pt-2 border-t border-gray-800/60 text-xs">
                    <div>
                      <label className="block text-[10px] text-gray-400 font-semibold mb-1">Theme / Words of the Year (Comma Separated)</label>
                      <input
                        type="text"
                        value={getVal('vision_words', 'SYSTEMS, DISCIPLINE, REVENUE')}
                        onChange={(e) => onCustomTextChange('vision_words', e.target.value)}
                        className="w-full bg-[#121316] border border-gray-800 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        placeholder="e.g. SYSTEMS, DISCIPLINE, REVENUE"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] text-gray-400 font-semibold mb-1">Personal Vision (North Star Statement)</label>
                      <textarea
                        value={getVal('horizon_north_star', 'Become the type of person who executes flawlessly every day with standardized high-performance habits.')}
                        onChange={(e) => onCustomTextChange('horizon_north_star', e.target.value)}
                        className="w-full h-16 bg-[#121316] border border-gray-800 rounded p-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder-gray-650 resize-none leading-relaxed"
                        placeholder="Write down your overarching vision statement..."
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] text-gray-400 font-semibold mb-1">Annual Mission Statement</label>
                      <textarea
                        value={getVal('horizon_mission', 'Launch version 2 of POS-Productivity toolkit and secure 3 strategic brand partners before Q3.')}
                        onChange={(e) => onCustomTextChange('horizon_mission', e.target.value)}
                        className="w-full h-16 bg-[#121316] border border-gray-800 rounded p-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder-gray-650 resize-none leading-relaxed"
                        placeholder="State your clear annual target mission..."
                      />
                    </div>

                    <div className="border-t border-gray-800/60 pt-2.5 space-y-2">
                      <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">Success Metrics (2x2 Grid)</span>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[9px] text-gray-500 font-semibold uppercase mb-0.5 font-sans">Revenue Target</label>
                          <input
                            type="text"
                            value={getVal('vision_metric_revenue', '$150,000')}
                            onChange={(e) => onCustomTextChange('vision_metric_revenue', e.target.value)}
                            className="w-full bg-[#121316] border border-gray-800 rounded px-2 py-1 text-xs text-white font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] text-gray-500 font-semibold uppercase mb-0.5 font-sans">Savings Goal</label>
                          <input
                            type="text"
                            value={getVal('vision_metric_savings', '$45,000')}
                            onChange={(e) => onCustomTextChange('vision_metric_savings', e.target.value)}
                            className="w-full bg-[#121316] border border-gray-800 rounded px-2 py-1 text-xs text-white font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] text-gray-500 font-semibold uppercase mb-0.5 font-sans">Fitness Standard</label>
                          <input
                            type="text"
                            value={getVal('vision_metric_fitness', '< 12%')}
                            onChange={(e) => onCustomTextChange('vision_metric_fitness', e.target.value)}
                            className="w-full bg-[#121316] border border-gray-800 rounded px-2 py-1 text-xs text-white font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] text-gray-500 font-semibold uppercase mb-0.5 font-sans">Travel Target</label>
                          <input
                            type="text"
                            value={getVal('vision_metric_countries', '4 Visited')}
                            onChange={(e) => onCustomTextChange('vision_metric_countries', e.target.value)}
                            className="w-full bg-[#121316] border border-gray-800 rounded px-2 py-1 text-xs text-white font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* SECTION 3: ANNUAL COMMITMENT GOALS */}
              <div className="space-y-3 bg-[#151619] p-3.5 rounded-xl border border-gray-800/80 animate-fade-in">
                <button 
                  onClick={() => toggleSection('goals')}
                  className="w-full text-xs font-bold text-gray-200 flex items-center justify-between text-left focus:outline-none"
                >
                  <div className="flex items-center space-x-2">
                    <Target className="h-4 w-4 text-indigo-400" />
                    <span className="tracking-wide font-sans">🏆 3. ANNUAL COMMITMENT GOALS</span>
                  </div>
                  {expandedSections.goals ? <ChevronDown className="h-4 w-4 text-gray-400" /> : <ChevronRight className="h-4 w-4 text-gray-400" />}
                </button>

                {expandedSections.goals && (
                  <div className="space-y-3 pt-2 border-t border-gray-800/60 text-xs">
                    {/* Category Selector Filter */}
                    <div className="flex flex-wrap gap-1.5 border-b border-gray-800/40 pb-2.5">
                      {['All', 'Personal', 'Career', 'Business', 'Financial', 'Health', 'Learning', 'Relationships', 'Spiritual'].map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setGoalsCategory(cat)}
                          className={`px-2 py-0.5 rounded text-[10px] font-medium transition-all ${
                            goalsCategory === cat 
                              ? 'bg-[#4f46e5] text-white font-bold' 
                              : 'bg-gray-900 text-gray-400 hover:text-white'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>

                    {/* Goals List */}
                    <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-1">
                      {state.annualGoals
                        .map((g, idx) => ({ g, idx }))
                        .filter(({ g }) => goalsCategory === 'All' || g.pillar?.toLowerCase() === goalsCategory.toLowerCase())
                        .map(({ g, idx }) => (
                          <div key={idx} className="p-2.5 bg-[#1C1E22] rounded-lg border border-gray-850 space-y-2 relative">
                            {/* Header / Delete */}
                            <div className="flex justify-between items-center">
                              <span className="px-1.5 py-0.5 bg-gray-900 text-[9px] font-bold text-indigo-400 rounded border border-gray-800 font-mono">
                                {g.pillar || 'General'}
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  if (!onStateChange) return;
                                  const updated = state.annualGoals.filter((_, i) => i !== idx);
                                  onStateChange({ ...state, annualGoals: updated });
                                }}
                                className="text-gray-500 hover:text-rose-400 transition-colors p-1"
                                title="Delete Goal"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>

                            {/* Milestone Goal Name */}
                            <input
                              type="text"
                              value={g.milestone}
                              onChange={(e) => {
                                if (!onStateChange) return;
                                const updated = [...state.annualGoals];
                                updated[idx] = { ...updated[idx], milestone: e.target.value };
                                onStateChange({ ...state, annualGoals: updated });
                              }}
                              className="w-full bg-[#121316] border border-gray-800 rounded px-2 py-1 text-xs text-white focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                              placeholder="Commitment Goal Description..."
                            />

                            {/* Slider Progress */}
                            <div className="space-y-1">
                              <div className="flex justify-between text-[10px]">
                                <span className="text-gray-500 font-sans">Progress</span>
                                <span className="font-mono text-indigo-400 font-bold">{g.progress}%</span>
                              </div>
                              <input
                                type="range"
                                min="0"
                                max="100"
                                value={g.progress}
                                onChange={(e) => {
                                  if (!onStateChange) return;
                                  const updated = [...state.annualGoals];
                                  updated[idx] = { ...updated[idx], progress: parseInt(e.target.value) };
                                  onStateChange({ ...state, annualGoals: updated });
                                }}
                                className="w-full accent-indigo-500 h-1 bg-gray-800 rounded cursor-pointer"
                              />
                            </div>

                            {/* Status, Target Date & Notes */}
                            <div className="grid grid-cols-2 gap-2 text-[10px]">
                              <div>
                                <label className="block text-gray-500 mb-0.5 font-sans">Status</label>
                                <select
                                  value={g.status || 'Planned'}
                                  onChange={(e) => {
                                    if (!onStateChange) return;
                                    const updated = [...state.annualGoals];
                                    updated[idx] = { ...updated[idx], status: e.target.value as any };
                                    onStateChange({ ...state, annualGoals: updated });
                                  }}
                                  className="w-full bg-[#121316] border border-gray-800 rounded px-1.5 py-0.5 text-gray-300 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                                >
                                  <option value="Planned">Planned</option>
                                  <option value="In Progress">In Progress</option>
                                  <option value="Completed">Completed</option>
                                  <option value="Blocked">Blocked</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-gray-500 mb-0.5 font-sans">Target Date</label>
                                <input
                                  type="text"
                                  value={g.targetDate || 'Q4'}
                                  onChange={(e) => {
                                    if (!onStateChange) return;
                                    const updated = [...state.annualGoals];
                                    updated[idx] = { ...updated[idx], targetDate: e.target.value };
                                    onStateChange({ ...state, annualGoals: updated });
                                  }}
                                  className="w-full bg-[#121316] border border-gray-800 rounded px-1.5 py-0.5 text-gray-300 text-center font-mono focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                                />
                              </div>
                            </div>

                            <div>
                              <textarea
                                value={g.notes || ''}
                                onChange={(e) => {
                                  if (!onStateChange) return;
                                  const updated = [...state.annualGoals];
                                  updated[idx] = { ...updated[idx], notes: e.target.value };
                                  onStateChange({ ...state, annualGoals: updated });
                                }}
                                className="w-full h-12 bg-[#121316] border border-gray-800 rounded p-1.5 text-[10px] text-gray-300 resize-none leading-relaxed font-sans focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                                placeholder="Goal Notes, KPI metrics or constraints..."
                              />
                            </div>
                          </div>
                        ))}

                      {state.annualGoals.filter(g => goalsCategory === 'All' || g.pillar?.toLowerCase() === goalsCategory.toLowerCase()).length === 0 && (
                        <p className="text-center text-gray-500 py-4 font-sans italic text-[11px]">No goals declared in {goalsCategory}.</p>
                      )}
                    </div>

                    {/* Add Goal Button */}
                    <button
                      type="button"
                      onClick={() => {
                        if (!onStateChange) return;
                        const newGoal = {
                          pillar: goalsCategory === 'All' ? 'Business' : goalsCategory,
                          milestone: '',
                          progress: 0,
                          status: 'Planned' as const,
                          targetDate: 'Q4',
                          notes: ''
                        };
                        onStateChange({ ...state, annualGoals: [...state.annualGoals, newGoal] });
                      }}
                      className="w-full py-2 bg-indigo-600/10 hover:bg-indigo-600/20 border border-indigo-500/30 rounded-lg text-indigo-400 font-semibold text-xs flex items-center justify-center space-x-1.5 transition-all"
                    >
                      <PlusCircle className="h-4 w-4" />
                      <span>Add Commitment Goal {goalsCategory !== 'All' ? `(${goalsCategory})` : ''}</span>
                    </button>
                  </div>
                )}
              </div>

              {/* SECTION 4: LIFE AREAS */}
              <div className="space-y-3 bg-[#151619] p-3.5 rounded-xl border border-gray-800/80 animate-fade-in">
                <button 
                  onClick={() => toggleSection('lifeAreas')}
                  className="w-full text-xs font-bold text-gray-200 flex items-center justify-between text-left focus:outline-none"
                >
                  <div className="flex items-center space-x-2">
                    <Smile className="h-4 w-4 text-indigo-400" />
                    <span className="tracking-wide">🧭 4. LIFE AREAS (WHEEL OF LIFE)</span>
                  </div>
                  {expandedSections.lifeAreas ? <ChevronDown className="h-4 w-4 text-gray-400" /> : <ChevronRight className="h-4 w-4 text-gray-400" />}
                </button>

                {expandedSections.lifeAreas && (
                  <div className="space-y-3.5 pt-2 border-t border-gray-800/60 text-xs">
                    <div className="grid grid-cols-2 gap-3 bg-[#1C1E22] p-2.5 rounded-lg border border-gray-850">
                      {[
                        { key: 'productivity', label: 'Productivity' },
                        { key: 'happiness', label: 'Happiness' },
                        { key: 'health', label: 'Health' },
                        { key: 'financial', label: 'Financial' },
                        { key: 'relationships', label: 'Relationships' },
                        { key: 'growth', label: 'Growth' },
                        { key: 'fun', label: 'Fun & Leisure' },
                        { key: 'environment', label: 'Environment' }
                      ].map(({ key, label }) => (
                        <div key={key} className="space-y-1">
                          <div className="flex justify-between items-center text-[10px]">
                            <span className="text-gray-400 font-medium font-sans">{label}</span>
                            <span className="font-mono text-indigo-400 font-bold">{(state.yearScores as any)[key] || 0}/10</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="10"
                            step="1"
                            value={(state.yearScores as any)[key] || 0}
                            onChange={(e) => {
                              if (!onStateChange) return;
                              onStateChange({
                                ...state,
                                yearScores: {
                                  ...state.yearScores,
                                  [key]: parseInt(e.target.value)
                                }
                              });
                            }}
                            className="w-full accent-indigo-500 h-1 bg-gray-800 rounded cursor-pointer"
                          />
                        </div>
                      ))}
                    </div>

                    <div>
                      <label className="block text-[10px] text-gray-400 font-semibold mb-1 font-sans">Priority Review &amp; Strategic Focus Note</label>
                      <textarea
                        value={getVal('life_blueprint_priority', 'Pillar Alignments: Double down on physical training schedules to optimize sleep patterns, and scale automated testing blocks to avoid cognitive exhaustion.')}
                        onChange={(e) => onCustomTextChange('life_blueprint_priority', e.target.value)}
                        className="w-full h-16 bg-[#121316] border border-gray-800 rounded p-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder-gray-650 resize-none leading-relaxed font-sans"
                        placeholder="Define focus priorities to fix low scores in life areas..."
                      />
                    </div>

                    <div className="flex justify-between items-center p-2.5 bg-[#1C1E22] rounded-lg border border-gray-850">
                      <span className="text-[10px] text-gray-400 font-semibold font-sans">Blueprint Progress Ratio</span>
                      <input
                        type="text"
                        value={getVal('life_year_progress_ratio', '76%')}
                        onChange={(e) => onCustomTextChange('life_year_progress_ratio', e.target.value)}
                        className="w-16 text-center bg-[#121316] border border-gray-800 rounded px-1.5 py-0.5 text-xs text-white font-mono font-bold focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* SECTION 5: ANNUAL PROJECTS OVERVIEW */}
              <div className="space-y-3 bg-[#151619] p-3.5 rounded-xl border border-gray-800/80 animate-fade-in">
                <button 
                  onClick={() => toggleSection('projects')}
                  className="w-full text-xs font-bold text-gray-200 flex items-center justify-between text-left focus:outline-none"
                >
                  <div className="flex items-center space-x-2">
                    <Briefcase className="h-4 w-4 text-indigo-400" />
                    <span className="tracking-wide font-sans">💼 5. ANNUAL PROJECTS OVERVIEW</span>
                  </div>
                  {expandedSections.projects ? <ChevronDown className="h-4 w-4 text-gray-400" /> : <ChevronRight className="h-4 w-4 text-gray-400" />}
                </button>

                {expandedSections.projects && (
                  <div className="space-y-3 pt-2 border-t border-gray-800/60 text-xs">
                    <div className="space-y-2">
                      {state.projects && state.projects.map((proj, idx) => (
                        <div key={idx} className="p-2.5 bg-[#1C1E22] rounded-lg border border-gray-850 flex items-center justify-between">
                          <div>
                            <span className="text-white font-semibold block text-xs font-sans">{proj.name || 'Unnamed Project'}</span>
                            <span className="text-[10px] text-gray-500 font-mono">Due: {proj.due || 'N/A'}</span>
                          </div>
                          <div className="text-right">
                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold block mb-1 font-mono uppercase ${
                              proj.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                              proj.status === 'Blocked' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                              proj.status === 'Planning' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' :
                              'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            }`}>
                              {proj.status}
                            </span>
                            <span className="text-[10px] font-mono text-gray-400">{proj.pct || 0}% Done</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => onPageSelect?.(20)}
                      className="w-full py-2 bg-indigo-600/10 hover:bg-indigo-600/20 border border-indigo-500/30 rounded-lg text-indigo-400 font-semibold text-xs flex items-center justify-center space-x-1.5 transition-all"
                    >
                      <span>Open Project Portfolio Workspace</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </div>

              {/* SECTION 6: QUARTERLY PLANNING & ROADMAP */}
              <div className="space-y-3 bg-[#151619] p-3.5 rounded-xl border border-gray-800/80 animate-fade-in">
                <button 
                  onClick={() => toggleSection('quarterly')}
                  className="w-full text-xs font-bold text-gray-200 flex items-center justify-between text-left focus:outline-none"
                >
                  <div className="flex items-center space-x-2">
                    <Layers className="h-4 w-4 text-indigo-400" />
                    <span className="tracking-wide font-sans">📊 6. QUARTERLY PLANNING &amp; ROADMAP</span>
                  </div>
                  {expandedSections.quarterly ? <ChevronDown className="h-4 w-4 text-gray-400" /> : <ChevronRight className="h-4 w-4 text-gray-400" />}
                </button>

                {expandedSections.quarterly && (
                  <div className="space-y-3 pt-2 border-t border-gray-800/60 text-xs">
                    {['Q1', 'Q2', 'Q3', 'Q4'].map((q) => {
                      const qKey = q.toLowerCase();
                      return (
                        <div key={q} className="p-2.5 bg-[#1C1E22] rounded-lg border border-gray-850 space-y-2 animate-fade-in">
                          <span className="font-bold text-indigo-400 text-xs block uppercase font-mono tracking-wider">{q} Strategy Sprint</span>
                          
                          <div>
                            <label className="block text-[9px] text-gray-500 mb-0.5 uppercase font-semibold font-sans">Objective Focus</label>
                            <input
                              type="text"
                              value={getVal(`${qKey}_focus`, q === 'Q1' ? 'Standardize core productivity systems and scale software pipelines.' : q === 'Q2' ? 'Launch SaaS platforms and build high-ticket brand pipelines.' : q === 'Q3' ? 'Refine operational margins & scale performance frameworks.' : 'Complete yearly blueprint audits & transition architectures.')}
                              onChange={(e) => onCustomTextChange(`${qKey}_focus`, e.target.value)}
                              className="w-full bg-[#121316] border border-gray-800 rounded px-2 py-1 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-sans"
                            />
                          </div>

                          <div className="grid grid-cols-1 gap-1.5 border-t border-gray-800/50 pt-1.5">
                            <label className="block text-[9px] text-gray-500 uppercase font-semibold font-sans">Key Milestones</label>
                            {[1, 2].map((num) => (
                              <div key={num} className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  checked={getVal(`${qKey}_m${num}_done`, 'false') === 'true'}
                                  onChange={(e) => onCustomTextChange(`${qKey}_m${num}_done`, e.target.checked ? 'true' : 'false')}
                                  className="accent-indigo-500 h-3.5 w-3.5 rounded bg-gray-900 border-gray-800 cursor-pointer"
                                />
                                <input
                                  type="text"
                                  value={getVal(`${qKey}_m${num}`, num === 1 ? `Deploy architectural system modules` : `Achieve targeted KPI checkpoints`)}
                                  onChange={(e) => onCustomTextChange(`${qKey}_m${num}`, e.target.value)}
                                  className="flex-1 bg-[#121316] border border-gray-800 rounded px-2 py-0.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-sans"
                                />
                              </div>
                            ))}
                          </div>

                          <div className="space-y-1 border-t border-gray-800/50 pt-1.5">
                            <div className="flex justify-between items-center text-[10px]">
                              <span className="text-gray-500 uppercase font-semibold font-sans">Strategy Scorecard Progress</span>
                              <span className="font-mono text-indigo-400 font-bold">{getVal(`${qKey}_status`, q === 'Q1' ? '75' : q === 'Q2' ? '40' : '0')}%</span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={parseInt(getVal(`${qKey}_status`, q === 'Q1' ? '75' : q === 'Q2' ? '40' : '0'))}
                              onChange={(e) => onCustomTextChange(`${qKey}_status`, e.target.value)}
                              className="w-full accent-indigo-500 h-1 bg-gray-800 rounded cursor-pointer"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* SECTION 7: ANNUAL CALENDAR */}
              <div className="space-y-3 bg-[#151619] p-3.5 rounded-xl border border-gray-800/80 animate-fade-in">
                <button 
                  onClick={() => toggleSection('calendar')}
                  className="w-full text-xs font-bold text-gray-200 flex items-center justify-between text-left focus:outline-none"
                >
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-indigo-400" />
                    <span className="tracking-wide font-sans">📅 7. ANNUAL CALENDAR NAVIGATION</span>
                  </div>
                  {expandedSections.calendar ? <ChevronDown className="h-4 w-4 text-gray-400" /> : <ChevronRight className="h-4 w-4 text-gray-400" />}
                </button>

                {expandedSections.calendar && (
                  <div className="space-y-2.5 pt-2 border-t border-gray-800/60 text-xs">
                    <p className="text-[10px] text-gray-400 italic mb-2 leading-relaxed font-sans">
                      Click any month below to instantly switch the Workspace to that Month's Dashboard:
                    </p>
                    <div className="grid grid-cols-3 gap-1.5 font-mono">
                      {[
                        { id: 6, name: 'Jan' },
                        { id: 7, name: 'Feb' },
                        { id: 8, name: 'Mar' },
                        { id: 9, name: 'Apr' },
                        { id: 10, name: 'May' },
                        { id: 11, name: 'Jun' },
                        { id: 12, name: 'Jul' },
                        { id: 13, name: 'Aug' },
                        { id: 14, name: 'Sep' },
                        { id: 15, name: 'Oct' },
                        { id: 16, name: 'Nov' },
                        { id: 17, name: 'Dec' }
                      ].map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => onPageSelect?.(m.id)}
                          className="bg-[#1C1E22] hover:bg-[#4f46e5]/10 border border-gray-850 hover:border-indigo-500/30 p-2 rounded-lg text-center transition-all group font-mono"
                        >
                          <span className="text-gray-300 group-hover:text-white font-bold block text-xs">{m.name}</span>
                          <span className="text-[9px] text-gray-500 block">P.{m.id}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* SECTION 8: STRATEGIC KEY METRICS */}
              <div className="space-y-3 bg-[#151619] p-3.5 rounded-xl border border-gray-800/80 animate-fade-in">
                <button 
                  onClick={() => toggleSection('keyMetrics')}
                  className="w-full text-xs font-bold text-gray-200 flex items-center justify-between text-left focus:outline-none"
                >
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-indigo-400" />
                    <span className="tracking-wide font-sans">📈 8. STRATEGIC KEY METRICS</span>
                  </div>
                  {expandedSections.keyMetrics ? <ChevronDown className="h-4 w-4 text-gray-400" /> : <ChevronRight className="h-4 w-4 text-gray-400" />}
                </button>

                {expandedSections.keyMetrics && (
                  <div className="space-y-2 pt-2 border-t border-gray-800/60 text-xs">
                    <div className="grid grid-cols-2 gap-2 text-center font-sans">
                      <div className="bg-[#1C1E22] p-2.5 rounded-lg border border-gray-850">
                        <span className="text-[9px] text-gray-500 font-bold uppercase block leading-tight font-sans">Goals Cleared</span>
                        <span className="text-sm font-bold text-white font-mono block mt-1">
                          {state.annualGoals.filter(g => g.progress === 100).length} / {state.annualGoals.length}
                        </span>
                      </div>
                      <div className="bg-[#1C1E22] p-2.5 rounded-lg border border-gray-850">
                        <span className="text-[9px] text-gray-500 font-bold uppercase block leading-tight font-sans">Active Projects</span>
                        <span className="text-sm font-bold text-white font-mono block mt-1">
                          {state.projects.filter(p => p.status === 'In Progress').length} Active
                        </span>
                      </div>
                      <div className="bg-[#1C1E22] p-2.5 rounded-lg border border-gray-850">
                        <span className="text-[9px] text-gray-500 font-bold uppercase block leading-tight font-sans">Life Wheel Balance</span>
                        <span className="text-sm font-bold text-white font-mono block mt-1">
                          {(() => {
                            const scores = Object.values(state.yearScores) as number[];
                            const total = scores.reduce((sum, s) => sum + (Number(s) || 0), 0);
                            const avg = total / (scores.length || 1);
                            return avg.toFixed(1);
                          })()}/10
                        </span>
                      </div>
                      <div className="bg-[#1C1E22] p-2.5 rounded-lg border border-gray-850">
                        <span className="text-[9px] text-gray-500 font-bold uppercase block leading-tight font-sans">Sprints Achieved</span>
                        <span className="text-sm font-bold text-white font-mono block mt-1">
                          {(() => {
                            let count = 0;
                            ['q1', 'q2', 'q3', 'q4'].forEach(q => {
                              if (getVal(`${q}_m1_done`, 'false') === 'true') count++;
                              if (getVal(`${q}_m2_done`, 'false') === 'true') count++;
                            });
                            return count;
                          })()} Milestones
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* SECTION 9: YEAR REVIEW & RETROSPECTIVE */}
              <div className="space-y-3 bg-[#151619] p-3.5 rounded-xl border border-gray-800/80 animate-fade-in">
                <button 
                  onClick={() => toggleSection('review')}
                  className="w-full text-xs font-bold text-gray-200 flex items-center justify-between text-left focus:outline-none"
                >
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-indigo-400" />
                    <span className="tracking-wide font-sans">📝 9. YEAR REVIEW &amp; RETROSPECTIVE</span>
                  </div>
                  {expandedSections.review ? <ChevronDown className="h-4 w-4 text-gray-400" /> : <ChevronRight className="h-4 w-4 text-gray-400" />}
                </button>

                {expandedSections.review && (
                  <div className="space-y-3 pt-2 border-t border-gray-800/60 text-xs">
                    <div className="space-y-2 bg-[#1C1E22] p-2.5 rounded-lg border border-gray-850 animate-fade-in">
                      <span className="text-[10px] text-indigo-400 font-bold uppercase block tracking-wider font-sans">Achievements &amp; Wins</span>
                      {[1, 2, 3].map((num) => (
                        <div key={num} className="space-y-1 border-b border-gray-800/40 pb-1.5 last:border-0 last:pb-0">
                          <label className="block text-[9px] text-gray-500 font-semibold mb-0.5 font-sans">Win #{num} Title</label>
                          <input
                            type="text"
                            value={getVal(`review_win_${num}_title`, num === 1 ? 'Scaled Operational Margins & Business Revenue' : num === 2 ? 'Flawless Daily Routine Synchronization' : 'Advanced Architecture Certification Completed')}
                            onChange={(e) => onCustomTextChange(`review_win_${num}_title`, e.target.value)}
                            className="w-full bg-[#121316] border border-gray-800 rounded px-2 py-0.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-sans"
                          />
                          <label className="block text-[9px] text-gray-500 font-semibold mb-0.5 font-sans">Win #{num} Details</label>
                          <textarea
                            value={getVal(`review_win_${num}_desc`, 'Completed targets successfully and verified vector output margins.')}
                            onChange={(e) => onCustomTextChange(`review_win_${num}_desc`, e.target.value)}
                            className="w-full h-10 bg-[#121316] border border-gray-800 rounded p-1.5 text-[10px] text-gray-300 resize-none leading-relaxed font-sans focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                        </div>
                      ))}
                    </div>

                    <div>
                      <label className="block text-[10px] text-gray-400 font-semibold mb-1 font-sans">Critical Blockades &amp; Challenges Solved</label>
                      <textarea
                        value={getVal('lessons_challenges', 'Technical Blockades: Resolved infinite loop rendering anomalies across preview canvases and structured D3 visualization hooks. Solved time-blocking friction in Q2.')}
                        onChange={(e) => onCustomTextChange('lessons_challenges', e.target.value)}
                        className="w-full h-16 bg-[#121316] border border-gray-800 rounded p-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder-gray-650 resize-none leading-relaxed font-sans"
                        placeholder="Detail major challenges and their direct solutions..."
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] text-gray-400 font-semibold mb-1 font-sans">Strategic Lessons &amp; Reflections</label>
                      <textarea
                        value={getVal('review_perspective', 'Systems over goals. Focus heavily on automated triggers and standardizing constraints rather than manual willpower. Keep cognitive stress low by blocking focus slots.')}
                        onChange={(e) => onCustomTextChange('review_perspective', e.target.value)}
                        className="w-full h-16 bg-[#121316] border border-gray-800 rounded p-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder-gray-650 resize-none leading-relaxed font-sans"
                        placeholder="Detail what the strategic year has taught you..."
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] text-gray-400 font-semibold mb-1 font-sans">Preparation &amp; Future Commendation</label>
                      <textarea
                        value={getVal('review_commitment_text', 'I commit to scaling my operational structures further, maintaining strict boundaries for deep work blocks, and refining the personal operating systems framework daily.')}
                        onChange={(e) => onCustomTextChange('review_commitment_text', e.target.value)}
                        className="w-full h-16 bg-[#121316] border border-gray-800 rounded p-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder-gray-650 resize-none leading-relaxed font-sans"
                        placeholder="Write down future commitments or retrospective sign-offs..."
                      />
                    </div>

                    <div className="flex justify-between items-center p-2.5 bg-[#1C1E22] rounded-lg border border-gray-850">
                      <span className="text-[10px] text-gray-400 font-semibold font-sans">Signature Date</span>
                      <input
                        type="text"
                        value={getVal('review_signature_date', '12 / 31 / 2027')}
                        onChange={(e) => onCustomTextChange('review_signature_date', e.target.value)}
                        className="w-32 text-center bg-[#121316] border border-gray-800 rounded px-1.5 py-0.5 text-xs text-white font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : activePage.id === 18 ? (
            <>
              {/* Breadcrumbs & Week Pagination Header */}
              <div className="flex flex-col space-y-2 border-b border-gray-800/60 pb-3 animate-fade-in">
                <div className="flex items-center justify-between text-[11px] text-gray-400 bg-gray-900/40 p-1.5 px-3.5 rounded-lg border border-gray-850">
                  <button 
                    onClick={() => onPageSelect?.(2)} 
                    className="hover:text-white transition font-semibold flex items-center space-x-1"
                  >
                    <span>📅 Year</span>
                  </button>
                  <ChevronRight className="h-3 w-3 text-gray-700" />
                  <button 
                    onClick={() => onPageSelect?.(12)} 
                    className="hover:text-white transition font-semibold flex items-center space-x-1"
                  >
                    <span>🌙 Month</span>
                  </button>
                  <ChevronRight className="h-3 w-3 text-gray-700" />
                  <button 
                    onClick={() => onPageSelect?.(18)} 
                    className="text-indigo-400 font-bold hover:text-white transition font-semibold flex items-center space-x-1"
                  >
                    <span>📈 Week</span>
                  </button>
                  <ChevronRight className="h-3 w-3 text-gray-700" />
                  <button 
                    onClick={() => onPageSelect?.(19)} 
                    className="hover:text-white transition font-semibold flex items-center space-x-1"
                  >
                    <span>🕒 Today</span>
                  </button>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button 
                    disabled={activeWeek === 1}
                    onClick={() => {
                      setActiveWeek(prev => Math.max(1, prev - 1));
                    }}
                    className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg border border-gray-800 disabled:opacity-30 disabled:pointer-events-none transition flex items-center space-x-1"
                    title="Previous Week"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                    <span className="text-[10px] font-bold hidden sm:inline">Prev</span>
                  </button>

                  <div className="text-center">
                    <span className="text-[9px] font-bold text-indigo-400 tracking-widest uppercase block mb-0.5">Weekly Execution Center</span>
                    <h2 className="text-white text-base font-bold font-sans tracking-tight leading-none">Week 0{activeWeek} Workspace</h2>
                  </div>

                  <button 
                    disabled={activeWeek === 5}
                    onClick={() => {
                      setActiveWeek(prev => Math.min(5, prev + 1));
                    }}
                    className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg border border-gray-800 disabled:opacity-30 disabled:pointer-events-none transition flex items-center space-x-1"
                    title="Next Week"
                  >
                    <span className="text-[10px] font-bold hidden sm:inline">Next</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Sub-Tab Switcher Bar */}
              <div className="flex items-center space-x-1 bg-[#151619] p-1 rounded-lg border border-gray-850 shrink-0 overflow-x-auto custom-scrollbar whitespace-nowrap scrollbar-none animate-fade-in">
                {[
                  { id: 'overview', label: 'Overview', icon: Compass },
                  { id: 'priorities', label: 'Priorities', icon: SlidersHorizontal },
                  { id: 'calendar', label: 'Calendar', icon: CalendarIcon },
                  { id: 'schedule', label: 'Schedule', icon: ClipboardList },
                  { id: 'tasks', label: 'Tasks', icon: CheckSquare },
                  { id: 'habits', label: 'Habits', icon: Settings },
                  { id: 'goals', label: 'Goals', icon: Target },
                  { id: 'notes', label: 'Notes', icon: FileText },
                  { id: 'review', label: 'Review', icon: Smile }
                ].map((tab) => {
                  const TabIcon = tab.icon;
                  const isActive = weekTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setWeekTab(tab.id as any)}
                      className={`px-3 py-1.5 rounded-md text-[11px] font-bold uppercase tracking-wider flex items-center space-x-1.5 transition ${
                        isActive 
                          ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/20 shadow-inner' 
                          : 'text-gray-400 hover:text-white hover:bg-[#1E2024] border border-transparent'
                      }`}
                    >
                      <TabIcon className="h-3.5 w-3.5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Week Tab Contents */}
              <div className="flex-1 space-y-4 pt-1">
                {/* 1. OVERVIEW TAB */}
                {weekTab === 'overview' && (
                  <div className="space-y-4 animate-fade-in">
                    {/* Weekly Progress Card */}
                    {(() => {
                      const prioritiesCount = 3;
                      const prioritiesCompleted = [
                        getVal(`w${activeWeek}_priority_1_done`, 'false') === 'true',
                        getVal(`w${activeWeek}_priority_2_done`, 'false') === 'true',
                        getVal(`w${activeWeek}_priority_3_done`, 'false') === 'true'
                      ].filter(Boolean).length;

                      const wTasksCount = parseInt(getVal(`w${activeWeek}_tasks_count`, '3')) || 0;
                      let completedTasks = 0;
                      for (let i = 0; i < wTasksCount; i++) {
                        if (getVal(`w${activeWeek}_task_${i}_done`, 'false') === 'true' && getVal(`w${activeWeek}_task_${i}_deleted`, 'false') !== 'true') {
                          completedTasks++;
                        }
                      }

                      const habitCompletions = [
                        'mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'
                      ].reduce((sum, day) => {
                        let count = 0;
                        if (getVal(`w${activeWeek}_habit1_${day}`, 'false') === 'true') count++;
                        if (getVal(`w${activeWeek}_habit2_${day}`, 'false') === 'true') count++;
                        if (getVal(`w${activeWeek}_habit3_${day}`, 'false') === 'true') count++;
                        return sum + count;
                      }, 0);

                      const totalHabitSlots = 21;
                      const progressPercentage = Math.round(
                        ((prioritiesCompleted / prioritiesCount) * 0.4 +
                        (wTasksCount > 0 ? (completedTasks / wTasksCount) * 0.4 : 0.4) +
                        (habitCompletions / totalHabitSlots) * 0.2) * 100
                      );

                      return (
                        <>
                          <div className="bg-gradient-to-br from-indigo-950/40 via-[#151619] to-[#151619] p-4 rounded-xl border border-indigo-500/10 space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest font-mono">Week Performance Index</span>
                              <span className="text-xs font-mono font-bold text-indigo-300">{progressPercentage}% OPTIMAL</span>
                            </div>
                            <div className="w-full bg-gray-900 h-2.5 rounded-full overflow-hidden border border-gray-800">
                              <div 
                                className="bg-gradient-to-r from-indigo-500 to-indigo-400 h-full transition-all duration-500"
                                style={{ width: `${progressPercentage}%` }}
                              />
                            </div>
                            <p className="text-[11px] text-gray-400 leading-relaxed font-sans">
                              Combined metric tracking <strong>{prioritiesCompleted}/3</strong> strategic priorities, <strong>{completedTasks}/{wTasksCount}</strong> active tasks, and <strong>{habitCompletions}/21</strong> habit checkpoints.
                            </p>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <button 
                              onClick={() => setWeekTab('priorities')}
                              className="p-3 bg-[#151619] hover:bg-[#1c1d22] text-left rounded-xl border border-gray-850 hover:border-indigo-500/20 transition group"
                            >
                              <div className="flex justify-between items-start">
                                <SlidersHorizontal className="h-4 w-4 text-indigo-400 group-hover:scale-110 transition" />
                                <span className="text-[10px] font-mono font-bold text-gray-500">P.1</span>
                              </div>
                              <h4 className="text-xs font-bold text-gray-200 mt-2">Priorities</h4>
                              <p className="text-[10px] text-gray-400 mt-1">
                                {prioritiesCompleted} / 3 Completed
                              </p>
                            </button>

                            <button 
                              onClick={() => setWeekTab('tasks')}
                              className="p-3 bg-[#151619] hover:bg-[#1c1d22] text-left rounded-xl border border-gray-850 hover:border-indigo-500/20 transition group"
                            >
                              <div className="flex justify-between items-start">
                                <CheckSquare className="h-4 w-4 text-emerald-400 group-hover:scale-110 transition" />
                                <span className="text-[10px] font-mono font-bold text-gray-500">P.2</span>
                              </div>
                              <h4 className="text-xs font-bold text-gray-200 mt-2">Tasks</h4>
                              <p className="text-[10px] text-gray-400 mt-1">
                                {completedTasks} / {wTasksCount} Done
                              </p>
                            </button>

                            <button 
                              onClick={() => setWeekTab('calendar')}
                              className="p-3 bg-[#151619] hover:bg-[#1c1d22] text-left rounded-xl border border-gray-850 hover:border-indigo-500/20 transition group"
                            >
                              <div className="flex justify-between items-start">
                                <CalendarIcon className="h-4 w-4 text-amber-400 group-hover:scale-110 transition" />
                                <span className="text-[10px] font-mono font-bold text-gray-500">P.3</span>
                              </div>
                              <h4 className="text-xs font-bold text-gray-200 mt-2">Daily Calendar</h4>
                              <p className="text-[10px] text-gray-400 mt-1">
                                Select &amp; Jump to Daily
                              </p>
                            </button>

                            <button 
                              onClick={() => setWeekTab('habits')}
                              className="p-3 bg-[#151619] hover:bg-[#1c1d22] text-left rounded-xl border border-gray-850 hover:border-indigo-500/20 transition group"
                            >
                              <div className="flex justify-between items-start">
                                <Settings className="h-4 w-4 text-purple-400 group-hover:scale-110 transition" />
                                <span className="text-[10px] font-mono font-bold text-gray-500">P.4</span>
                              </div>
                              <h4 className="text-xs font-bold text-gray-200 mt-2">Weekly Habits</h4>
                              <p className="text-[10px] text-gray-400 mt-1">
                                {Math.round((habitCompletions / 21) * 100)}% Consistency
                              </p>
                            </button>

                            <button 
                              onClick={() => setWeekTab('goals')}
                              className="p-3 bg-[#151619] hover:bg-[#1c1d22] text-left rounded-xl border border-gray-850 hover:border-indigo-500/20 transition group"
                            >
                              <div className="flex justify-between items-start">
                                <Target className="h-4 w-4 text-rose-400 group-hover:scale-110 transition" />
                                <span className="text-[10px] font-mono font-bold text-gray-500">P.5</span>
                              </div>
                              <h4 className="text-xs font-bold text-gray-200 mt-2">Monthly Goals</h4>
                              <p className="text-[10px] text-gray-400 mt-1">
                                Assigned Goal Tracker
                              </p>
                            </button>

                            <button 
                              onClick={() => setWeekTab('review')}
                              className="p-3 bg-[#151619] hover:bg-[#1c1d22] text-left rounded-xl border border-gray-850 hover:border-indigo-500/20 transition group"
                            >
                              <div className="flex justify-between items-start">
                                <Smile className="h-4 w-4 text-cyan-400 group-hover:scale-110 transition" />
                                <span className="text-[10px] font-mono font-bold text-gray-500">P.6</span>
                              </div>
                              <h4 className="text-xs font-bold text-gray-200 mt-2">Weekly Review</h4>
                              <p className="text-[10px] text-gray-400 mt-1">
                                Wins &amp; Retrospectives
                              </p>
                            </button>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                )}

                {/* 2. PRIORITIES TAB */}
                {weekTab === 'priorities' && (
                  <div className="space-y-4 animate-fade-in">
                    {/* Weekly Focus */}
                    <div className="bg-[#151619] p-3.5 rounded-xl border border-gray-850 space-y-2">
                      <label className="block text-[10px] text-indigo-400 font-bold uppercase tracking-wider font-sans">⚡ Weekly Focus &amp; Objective</label>
                      <p className="text-[10px] text-gray-400 leading-relaxed font-sans mb-1">
                        Define the primary strategic alignment and main theme of this week. (Reflected in SVG)
                      </p>
                      <textarea
                        value={getVal(`w${activeWeek}_focus`, 
                          activeWeek === 1 ? 'Prototype architecture, draft schema patterns, establish endpoints.' :
                          activeWeek === 2 ? 'Design system, core UI grids implementation, logic functions.' :
                          activeWeek === 3 ? 'Integrate API connections, run system audits, optimize slow queries.' :
                          activeWeek === 4 ? 'Perform production dry runs, launch closed testing, document code.' :
                          'Initiate strategic retrospectives, plan next cycle metrics and sprints.'
                        )}
                        onChange={(e) => onCustomTextChange(`w${activeWeek}_focus`, e.target.value)}
                        className="w-full h-16 bg-[#121316] border border-gray-800 rounded p-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder-gray-700 resize-none font-sans"
                        placeholder="Detail the focal operations of this week..."
                      />
                    </div>

                    {/* Top Priorities List */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center px-1">
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">🎯 Top 3 Priorities</span>
                        <span className="text-[10px] text-indigo-400 font-bold font-mono">Week 0{activeWeek}</span>
                      </div>

                      {[
                        { num: 1, key: `w${activeWeek}_p1`, label: 'Priority 1 (Reflected in SVG)' },
                        { num: 2, key: `w${activeWeek}_p2`, label: 'Priority 2 (Reflected in SVG)' },
                        { num: 3, key: `w${activeWeek}_p3`, label: 'Priority 3 (Secondary Alignment)' }
                      ].map((p) => {
                        const defaultFocusText = p.num === 1 
                          ? (activeWeek === 1 ? 'DB Setup' : activeWeek === 2 ? 'Component Kit' : activeWeek === 3 ? 'API Connection' : activeWeek === 4 ? 'Secure Testing' : 'Retrospective Loop')
                          : p.num === 2
                          ? (activeWeek === 1 ? 'Auth Module' : activeWeek === 2 ? 'Responsive Layout' : activeWeek === 3 ? 'Query Speed Check' : activeWeek === 4 ? 'Code Review' : 'Next Cycle Setup')
                          : 'Optimize bundle size & static assets';
                        const pText = getVal(p.key, defaultFocusText);
                        const isDone = getVal(`w${activeWeek}_priority_${p.num}_done`, 'false') === 'true';
                        const pLevel = getVal(`w${activeWeek}_priority_${p.num}_level`, 'High');
                        const pNotes = getVal(`w${activeWeek}_priority_${p.num}_notes`, '');

                        return (
                          <div key={p.num} className="bg-[#151619] p-3.5 rounded-xl border border-gray-850 space-y-3">
                            <div className="flex items-center space-x-2.5">
                              <button
                                type="button"
                                onClick={() => onCustomTextChange(`w${activeWeek}_priority_${p.num}_done`, isDone ? 'false' : 'true')}
                                className={`h-5 w-5 rounded border flex items-center justify-center shrink-0 transition ${
                                  isDone 
                                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-inner' 
                                    : 'border-gray-800 hover:border-gray-700 bg-[#121316]'
                                }`}
                              >
                                {isDone && <Check className="h-3.5 w-3.5" />}
                              </button>
                              <div className="flex-1">
                                <span className="text-[9px] text-gray-500 font-bold uppercase block tracking-wider mb-0.5">{p.label}</span>
                                <input
                                  type="text"
                                  value={pText}
                                  onChange={(e) => onCustomTextChange(p.key, e.target.value)}
                                  className="w-full bg-transparent border-none p-0 text-xs text-white font-bold placeholder-gray-600 focus:outline-none focus:ring-0"
                                  placeholder={`Define Priority ${p.num}...`}
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-[10px] pt-2 border-t border-gray-850/60">
                              <div>
                                <label className="block text-[9px] text-gray-500 font-bold uppercase tracking-wider mb-0.5">Priority Level</label>
                                <select
                                  value={pLevel}
                                  onChange={(e) => onCustomTextChange(`w${activeWeek}_priority_${p.num}_level`, e.target.value)}
                                  className="w-full bg-[#121316] border border-gray-800 rounded px-1.5 py-0.5 text-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                >
                                  <option value="High">🔴 High Priority</option>
                                  <option value="Medium">🟡 Medium Priority</option>
                                  <option value="Low">🟢 Low Priority</option>
                                </select>
                              </div>

                              <div>
                                <label className="block text-[9px] text-gray-500 font-bold uppercase tracking-wider mb-0.5">Focus Area / Scope</label>
                                <input
                                  type="text"
                                  value={pNotes}
                                  onChange={(e) => onCustomTextChange(`w${activeWeek}_priority_${p.num}_notes`, e.target.value)}
                                  className="w-full bg-[#121316] border border-gray-800 rounded px-2 py-0.5 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                  placeholder="Context or notes..."
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Operational Status Select */}
                    <div className="bg-[#151619] p-3.5 rounded-xl border border-gray-850 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Operational Status</span>
                        <span className="text-[9px] text-gray-500 block">Status of Week 0{activeWeek} on SVG roadmap</span>
                      </div>
                      <select
                        value={getVal(`w${activeWeek}_status`, activeWeek <= 2 ? 'Completed' : activeWeek === 3 ? 'In Progress' : 'Planned')}
                        onChange={(e) => onCustomTextChange(`w${activeWeek}_status`, e.target.value)}
                        className="bg-[#121316] border border-gray-800 rounded px-2.5 py-1 text-xs text-white font-bold font-sans focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      >
                        <option value="Completed">🟢 Completed</option>
                        <option value="In Progress">🟡 In Progress</option>
                        <option value="Planned">⚪ Planned</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* 3. CALENDAR TAB */}
                {weekTab === 'calendar' && (
                  <div className="space-y-4 animate-fade-in">
                    {/* Horizontal Calendar Strip */}
                    <div className="bg-[#151619] p-3.5 rounded-xl border border-gray-850 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">📅 Horizontal Week Calendar Strip</span>
                        <span className="text-[9px] font-bold text-indigo-400 tracking-wider">Select Day to Schedule</span>
                      </div>
                      
                      <div className="grid grid-cols-7 gap-1">
                        {(() => {
                          const getWeekDays = (weekNum: number, monthIdx: number) => {
                            const startDays = [4, 0, 0, 3, 5, 1, 3, 6, 2, 4, 0, 2]; // 2027 start days offset (0=Mon, 6=Sun)
                            const dayCounts = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
                            const startDayOffset = startDays[monthIdx] || 0;
                            const totalDays = dayCounts[monthIdx] || 31;
                            
                            const grid: Array<number | null> = [];
                            for (let i = 0; i < startDayOffset; i++) {
                              grid.push(null);
                            }
                            for (let i = 1; i <= totalDays; i++) {
                              grid.push(i);
                            }
                            
                            const weekStartIdx = (weekNum - 1) * 7;
                            return grid.slice(weekStartIdx, weekStartIdx + 7);
                          };

                          const currentMonthIdx = 6; // July
                          const daysList = getWeekDays(activeWeek, currentMonthIdx);
                          const dayNames = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
                          
                          return daysList.map((dayNum, i) => {
                            const isSelected = selectedDate === dayNum;
                            const isBlank = dayNum === null;
                            const hasEvents = dayNum !== null && getVal(`month_${monthNum}_day_${dayNum}_events`, '').trim() !== '';
                            
                            return (
                              <button
                                key={i}
                                disabled={isBlank}
                                onClick={() => {
                                  if (dayNum !== null) setSelectedDate(dayNum);
                                }}
                                className={`py-2 rounded-lg flex flex-col items-center justify-between text-center border transition relative ${
                                  isBlank 
                                    ? 'bg-transparent border-transparent opacity-10 pointer-events-none'
                                    : isSelected
                                      ? 'bg-indigo-600/20 border-indigo-500 text-white'
                                      : 'bg-[#1C1E22] border-gray-850 hover:bg-[#22252a] text-gray-300'
                                }`}
                              >
                                <span className="text-[8px] font-bold text-gray-500 block mb-1">{dayNames[i]}</span>
                                <span className="text-xs font-mono font-bold">{dayNum || ''}</span>
                                {hasEvents && (
                                  <span className="absolute bottom-1 h-1 w-1 bg-indigo-400 rounded-full" />
                                )}
                              </button>
                            );
                          });
                        })()}
                      </div>
                    </div>

                    {/* Day Events Details */}
                    {selectedDate && (
                      <div className="bg-[#151619] p-3.5 rounded-xl border border-gray-850 space-y-3.5 animate-fade-in">
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="text-[9px] text-indigo-400 font-bold uppercase tracking-widest font-mono">Day Schedule details</span>
                            <h4 className="text-xs font-bold text-white mt-0.5">{monthName} {selectedDate} Appointment Ledger</h4>
                          </div>
                          
                          <button
                            onClick={() => onPageSelect?.(19)}
                            className="px-2.5 py-1 text-[10px] bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded flex items-center space-x-1.5 transition"
                          >
                            <span>Jump to Today</span>
                            <ArrowUpRight className="h-3 w-3" />
                          </button>
                        </div>

                        <div className="space-y-1.5">
                          <label className="block text-[9px] text-gray-500 font-semibold uppercase tracking-wider">Scheduled Events &amp; Appointments</label>
                          <textarea
                            value={getVal(`month_${monthNum}_day_${selectedDate}_events`, '')}
                            onChange={(e) => onCustomTextChange(`month_${monthNum}_day_${selectedDate}_events`, e.target.value)}
                            className="w-full h-24 bg-[#121316] border border-gray-800 rounded p-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder-gray-700 resize-none font-sans leading-relaxed"
                            placeholder="Detail structured appointments, events or key time commitments for this day..."
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 4. SCHEDULE TAB */}
                {weekTab === 'schedule' && (
                  <div className="space-y-4 animate-fade-in">
                    {/* Daily Time Block Planner */}
                    <div className="bg-[#151619] p-3.5 rounded-xl border border-gray-850 space-y-3.5">
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-[9px] text-indigo-400 font-bold uppercase tracking-widest font-mono">Time blocking</span>
                          <h4 className="text-xs font-bold text-white">Daily Schedule Blocks (Day {selectedDate})</h4>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const defaultTimes = ['05:00 - 06:00', '06:00 - 08:30', '08:30 - 09:30', '09:30 - 12:00', '12:00 - 13:00', '13:00 - 17:00'];
                            const defaultTexts = [
                              'Initiation & Morning Intention Setup',
                              'DEEP WORK SPRINT [Project Prototype Deployment]',
                              'Athletic Training Protocol Block',
                              'Team Sync Meetings & Inbox Pipeline Clearance',
                              'Structured Strategy Reflection Checkpoint',
                              'Secondary Execution Sprint & Client Review Work'
                            ];
                            defaultTimes.forEach((time, idx) => {
                              onCustomTextChange(`w${activeWeek}_day_${selectedDate}_sched_${idx}_time`, time);
                              onCustomTextChange(`w${activeWeek}_day_${selectedDate}_sched_${idx}_text`, defaultTexts[idx]);
                            });
                          }}
                          className="text-[9px] bg-[#1C1E22] hover:bg-[#22252a] text-gray-400 hover:text-white px-2 py-0.5 rounded border border-gray-800 transition"
                        >
                          Load Defaults
                        </button>
                      </div>

                      <div className="space-y-2.5">
                        {[0, 1, 2, 3, 4, 5].map((idx) => {
                          const sTime = getVal(`w${activeWeek}_day_${selectedDate}_sched_${idx}_time`, idx === 0 ? '05:00 - 06:00' : idx === 1 ? '06:00 - 08:30' : idx === 2 ? '08:30 - 09:30' : idx === 3 ? '09:30 - 12:00' : idx === 4 ? '12:00 - 13:00' : '13:00 - 17:00');
                          const sText = getVal(`w${activeWeek}_day_${selectedDate}_sched_${idx}_text`, idx === 0 ? 'Initiation & Morning Intention Setup' : idx === 1 ? 'DEEP WORK SPRINT [Project Prototype Deployment]' : idx === 2 ? 'Athletic Training Protocol Block' : idx === 3 ? 'Team Sync Meetings & Inbox Pipeline Clearance' : idx === 4 ? 'Structured Strategy Reflection Checkpoint' : 'Secondary Execution Sprint & Client Review Work');

                          const handleMoveUp = () => {
                            if (idx === 0) return;
                            const prevTime = getVal(`w${activeWeek}_day_${selectedDate}_sched_${idx-1}_time`, '');
                            const prevText = getVal(`w${activeWeek}_day_${selectedDate}_sched_${idx-1}_text`, '');
                            onCustomTextChange(`w${activeWeek}_day_${selectedDate}_sched_${idx-1}_time`, sTime);
                            onCustomTextChange(`w${activeWeek}_day_${selectedDate}_sched_${idx-1}_text`, sText);
                            onCustomTextChange(`w${activeWeek}_day_${selectedDate}_sched_${idx}_time`, prevTime);
                            onCustomTextChange(`w${activeWeek}_day_${selectedDate}_sched_${idx}_text`, prevText);
                          };

                          const handleMoveDown = () => {
                            if (idx === 5) return;
                            const nextTime = getVal(`w${activeWeek}_day_${selectedDate}_sched_${idx+1}_time`, '');
                            const nextText = getVal(`w${activeWeek}_day_${selectedDate}_sched_${idx+1}_text`, '');
                            onCustomTextChange(`w${activeWeek}_day_${selectedDate}_sched_${idx+1}_time`, sTime);
                            onCustomTextChange(`w${activeWeek}_day_${selectedDate}_sched_${idx+1}_text`, sText);
                            onCustomTextChange(`w${activeWeek}_day_${selectedDate}_sched_${idx}_time`, nextTime);
                            onCustomTextChange(`w${activeWeek}_day_${selectedDate}_sched_${idx}_text`, nextText);
                          };

                          return (
                            <div key={idx} className="flex items-center space-x-2 bg-[#1C1E22] p-2 rounded-lg border border-gray-850 text-xs">
                              <input
                                type="text"
                                value={sTime}
                                onChange={(e) => onCustomTextChange(`w${activeWeek}_day_${selectedDate}_sched_${idx}_time`, e.target.value)}
                                className="w-24 bg-[#121316] border border-gray-800 rounded px-1.5 py-0.5 text-center font-mono text-[10px] text-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                placeholder="00:00 - 00:00"
                              />
                              <input
                                type="text"
                                value={sText}
                                onChange={(e) => onCustomTextChange(`w${activeWeek}_day_${selectedDate}_sched_${idx}_text`, e.target.value)}
                                className="flex-1 bg-transparent border-none p-0 text-xs text-white focus:outline-none focus:ring-0 placeholder-gray-700"
                                placeholder="Enter timeblock activity..."
                              />
                              <div className="flex flex-col space-y-0.5 shrink-0">
                                <button
                                  type="button"
                                  disabled={idx === 0}
                                  onClick={handleMoveUp}
                                  className="p-0.5 hover:bg-gray-800 rounded disabled:opacity-25"
                                >
                                  <ChevronRight className="h-3 w-3 -rotate-90 text-gray-400" />
                                </button>
                                <button
                                  type="button"
                                  disabled={idx === 5}
                                  onClick={handleMoveDown}
                                  className="p-0.5 hover:bg-gray-800 rounded disabled:opacity-25"
                                >
                                  <ChevronRight className="h-3 w-3 rotate-90 text-gray-400" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* 5. TASKS TAB */}
                {weekTab === 'tasks' && (
                  <div className="space-y-4 animate-fade-in">
                    {(() => {
                      const wTasksCount = parseInt(getVal(`w${activeWeek}_tasks_count`, '3')) || 0;
                      
                      const tasksList = [];
                      for (let i = 0; i < wTasksCount; i++) {
                        const isDeleted = getVal(`w${activeWeek}_task_${i}_deleted`, 'false') === 'true';
                        if (!isDeleted) {
                          tasksList.push({
                            id: i,
                            text: getVal(`w${activeWeek}_task_${i}_text`, i === 0 ? 'Deploy strategic blueprint framework' : i === 1 ? 'Schedule brand advisory review loops' : 'Consolidate fiscal Q2 accounting logs'),
                            done: getVal(`w${activeWeek}_task_${i}_done`, 'false') === 'true',
                            priority: getVal(`w${activeWeek}_task_${i}_priority`, 'Medium'),
                            due: getVal(`w${activeWeek}_task_${i}_due`, '07/12'),
                            project: getVal(`w${activeWeek}_task_${i}_project`, proj1_name)
                          });
                        }
                      }

                      return (
                        <>
                          {/* Task List Header */}
                          <div className="bg-[#151619] p-3.5 rounded-xl border border-gray-850 space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">📋 Unlimited Weekly Task Ledger</span>
                              <button
                                type="button"
                                onClick={() => {
                                  const nextId = wTasksCount;
                                  onCustomTextChange(`w${activeWeek}_tasks_count`, String(nextId + 1));
                                  onCustomTextChange(`w${activeWeek}_task_${nextId}_text`, '');
                                  onCustomTextChange(`w${activeWeek}_task_${nextId}_done`, 'false');
                                  onCustomTextChange(`w${activeWeek}_task_${nextId}_priority`, 'Medium');
                                  onCustomTextChange(`w${activeWeek}_task_${nextId}_due`, `07/${12 + (nextId % 5)}`);
                                  onCustomTextChange(`w${activeWeek}_task_${nextId}_project`, proj1_name);
                                  onCustomTextChange(`w${activeWeek}_task_${nextId}_deleted`, 'false');
                                }}
                                className="px-2.5 py-1 text-[10px] bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded flex items-center space-x-1 transition"
                              >
                                <Plus className="h-3 w-3" />
                                <span>Add Task</span>
                              </button>
                            </div>
                          </div>

                          {/* Tasks render */}
                          <div className="space-y-2.5">
                            {tasksList.length === 0 ? (
                              <div className="text-center py-6 bg-[#151619] rounded-xl border border-gray-850">
                                <p className="text-xs text-gray-500">No tasks found. Click "Add Task" to declare new objectives.</p>
                              </div>
                            ) : (
                              tasksList.map((t) => (
                                <div key={t.id} className="bg-[#151619] p-3.5 rounded-xl border border-gray-850 space-y-3.5 transition hover:border-gray-800">
                                  <div className="flex items-center justify-between space-x-2">
                                    <div className="flex items-center space-x-2.5 flex-1">
                                      <button
                                        type="button"
                                        onClick={() => onCustomTextChange(`w${activeWeek}_task_${t.id}_done`, t.done ? 'false' : 'true')}
                                        className={`h-4.5 w-4.5 rounded border flex items-center justify-center shrink-0 transition ${
                                          t.done 
                                            ? 'bg-indigo-600 border-indigo-500 text-white shadow-inner' 
                                            : 'border-gray-800 hover:border-gray-700 bg-[#121316]'
                                        }`}
                                      >
                                        {t.done && <Check className="h-3 w-3" />}
                                      </button>
                                      <input
                                        type="text"
                                        value={t.text}
                                        onChange={(e) => onCustomTextChange(`w${activeWeek}_task_${t.id}_text`, e.target.value)}
                                        className={`w-full bg-transparent border-none p-0 text-xs text-white placeholder-gray-700 focus:outline-none focus:ring-0 ${
                                          t.done ? 'line-through text-gray-500 font-medium' : 'font-bold'
                                        }`}
                                        placeholder="Define task objective..."
                                      />
                                    </div>

                                    <button
                                      type="button"
                                      onClick={() => onCustomTextChange(`w${activeWeek}_task_${t.id}_deleted`, 'true')}
                                      className="p-1 text-gray-600 hover:text-red-400 hover:bg-red-500/10 rounded transition shrink-0"
                                      title="Delete Task"
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                  </div>

                                  <div className="grid grid-cols-3 gap-2 text-[10px] pt-2 border-t border-gray-850/60">
                                    <div>
                                      <label className="block text-[9px] text-gray-500 font-bold uppercase tracking-wider mb-0.5">Priority</label>
                                      <select
                                        value={t.priority}
                                        onChange={(e) => onCustomTextChange(`w${activeWeek}_task_${t.id}_priority`, e.target.value)}
                                        className="w-full bg-[#121316] border border-gray-800 rounded px-1 py-0.5 text-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                      >
                                        <option value="High">🔴 High</option>
                                        <option value="Medium">🟡 Medium</option>
                                        <option value="Low">🟢 Low</option>
                                      </select>
                                    </div>

                                    <div>
                                      <label className="block text-[9px] text-gray-500 font-bold uppercase tracking-wider mb-0.5">Due Date</label>
                                      <input
                                        type="text"
                                        value={t.due}
                                        onChange={(e) => onCustomTextChange(`w${activeWeek}_task_${t.id}_due`, e.target.value)}
                                        className="w-full bg-[#121316] border border-gray-800 rounded px-2 py-0.5 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                                        placeholder="e.g. 07/15"
                                      />
                                    </div>

                                    <div>
                                      <label className="block text-[9px] text-gray-500 font-bold uppercase tracking-wider mb-0.5">Project Alignment</label>
                                      <select
                                        value={t.project}
                                        onChange={(e) => onCustomTextChange(`w${activeWeek}_task_${t.id}_project`, e.target.value)}
                                        className="w-full bg-[#121316] border border-gray-800 rounded px-1 py-0.5 text-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 truncate"
                                      >
                                        <option value={proj1_name}>{proj1_name}</option>
                                        <option value={proj2_name}>{proj2_name}</option>
                                        <option value={proj3_name}>{proj3_name}</option>
                                      </select>
                                    </div>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </>
                      );
                    })()}
                  </div>
                )}

                {/* 6. HABITS TAB */}
                {weekTab === 'habits' && (
                  <div className="space-y-4 animate-fade-in">
                    {/* Habit Grid Card */}
                    <div className="bg-[#151619] p-3.5 rounded-xl border border-gray-850 space-y-4">
                      <div className="flex justify-between items-center pb-1 border-b border-gray-850/60">
                        <div>
                          <span className="text-[9px] text-indigo-400 font-bold uppercase tracking-widest font-mono">Routine execution</span>
                          <h4 className="text-xs font-bold text-white mt-0.5">Weekly Habit Tracker Grid</h4>
                        </div>
                        <span className="text-[10px] text-indigo-400 font-bold font-mono">Week 0{activeWeek}</span>
                      </div>

                      <div className="space-y-4">
                        {[
                          { id: 1, name: getVal(`month_${monthNum}_habit1_name`, 'Early Morning Wake-up') },
                          { id: 2, name: getVal(`month_${monthNum}_habit2_name`, 'Deep Work Loop (2hr)') },
                          { id: 3, name: getVal(`month_${monthNum}_habit3_name`, 'Daily Cardio Routine') }
                        ].map((h) => {
                          const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
                          const dayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
                          
                          let compCount = 0;
                          days.forEach(d => {
                            if (getVal(`w${activeWeek}_habit${h.id}_${d}`, 'false') === 'true') {
                              compCount++;
                            }
                          });
                          const compPct = Math.round((compCount / 7) * 100);

                          return (
                            <div key={h.id} className="space-y-2">
                              <div className="flex justify-between items-center text-xs">
                                <span className="font-bold text-gray-200">{h.name}</span>
                                <span className="text-[10px] font-mono font-bold text-indigo-400">{compPct}% ({compCount}/7)</span>
                              </div>

                              <div className="grid grid-cols-7 gap-1">
                                {days.map((d, i) => {
                                  const isDone = getVal(`w${activeWeek}_habit${h.id}_${d}`, 'false') === 'true';
                                  return (
                                    <button
                                      key={d}
                                      type="button"
                                      onClick={() => onCustomTextChange(`w${activeWeek}_habit${h.id}_${d}`, isDone ? 'false' : 'true')}
                                      className={`py-2 rounded-lg border text-center font-mono font-bold flex flex-col items-center justify-center transition ${
                                        isDone
                                          ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                                          : 'bg-[#1C1E22] border-gray-850 text-gray-500 hover:text-white'
                                      }`}
                                    >
                                      <span className="text-[8px] text-gray-500 mb-0.5 uppercase">{dayLabels[i]}</span>
                                      <span className="text-[10px]">
                                        {isDone ? '✓' : '•'}
                                      </span>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* 7. GOALS TAB */}
                {weekTab === 'goals' && (
                  <div className="space-y-4 animate-fade-in">
                    {(() => {
                      const gCount = parseInt(getVal(`month_${monthNum}_goals_count`, '3')) || 0;
                      
                      const monthlyGoalsList = [];
                      for (let i = 0; i < gCount; i++) {
                        const isDeleted = getVal(`month_${monthNum}_goal_${i}_deleted`, 'false') === 'true';
                        if (!isDeleted) {
                          monthlyGoalsList.push({
                            id: i,
                            text: getVal(`month_${monthNum}_goal_${i}_text`, i === 0 ? 'Scale enterprise revenue loops to target thresholds' : i === 1 ? 'Deploy final static assets pipeline' : 'Secure strategic partners approval'),
                            done: getVal(`month_${monthNum}_goal_${i}_done`, 'false') === 'true',
                            priority: getVal(`month_${monthNum}_goal_${i}_priority`, 'Medium'),
                            due: getVal(`month_${monthNum}_goal_${i}_due`, '12/31'),
                            weekAssigned: getVal(`month_${monthNum}_goal_${i}_week_assigned`, 'all')
                          });
                        }
                      }

                      const assignedGoals = monthlyGoalsList.filter(g => 
                        g.weekAssigned === 'all' || g.weekAssigned === String(activeWeek)
                      );

                      return (
                        <>
                          <div className="bg-[#151619] p-3.5 rounded-xl border border-gray-850 space-y-3">
                            <div className="flex justify-between items-center pb-1 border-b border-gray-850/60">
                              <div>
                                <span className="text-[9px] text-rose-400 font-bold uppercase tracking-widest font-mono">Month aligned</span>
                                <h4 className="text-xs font-bold text-white mt-0.5">Goals Assigned to Week 0{activeWeek}</h4>
                              </div>
                              <span className="text-[10px] text-rose-400 font-bold font-mono">YTD Linked</span>
                            </div>

                            <p className="text-[11px] text-gray-400 leading-relaxed font-sans">
                              These goals are synchronized with your <strong>{monthName} Monthly Dashboard</strong>. Update status here to contribute directly to monthly progress.
                            </p>
                          </div>

                          <div className="space-y-2.5">
                            {assignedGoals.length === 0 ? (
                              <div className="text-center py-6 bg-[#151619] rounded-xl border border-gray-850">
                                <p className="text-xs text-gray-500">No monthly goals currently assigned to Week {activeWeek}.</p>
                                <p className="text-[10px] text-indigo-400 mt-2">Use the mapping dropdown below to assign goals to this week.</p>
                              </div>
                            ) : (
                              assignedGoals.map((g) => (
                                <div key={g.id} className="bg-[#151619] p-3.5 rounded-xl border border-gray-850 space-y-3">
                                  <div className="flex items-start space-x-2.5">
                                    <button
                                      type="button"
                                      onClick={() => onCustomTextChange(`month_${monthNum}_goal_${g.id}_done`, g.done ? 'false' : 'true')}
                                      className={`h-4.5 w-4.5 rounded border flex items-center justify-center shrink-0 mt-0.5 transition ${
                                        g.done 
                                          ? 'bg-indigo-600 border-indigo-500 text-white' 
                                          : 'border-gray-800 hover:border-gray-700 bg-[#121316]'
                                      }`}
                                    >
                                      {g.done && <Check className="h-3 w-3" />}
                                    </button>
                                    <div className="flex-1">
                                      <span className={`text-xs text-white ${g.done ? 'line-through text-gray-500 font-medium' : 'font-bold'}`}>
                                        {g.text}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-2 gap-2 text-[10px] pt-2 border-t border-gray-850/60">
                                    <div className="flex items-center justify-between bg-[#121316] p-1 px-2.5 rounded border border-gray-800">
                                      <span className="text-gray-500 uppercase font-bold text-[8px] tracking-wider">Priority</span>
                                      <span className="text-gray-300 font-bold">{g.priority === 'High' ? '🔴 High' : g.priority === 'Medium' ? '🟡 Medium' : '🟢 Low'}</span>
                                    </div>

                                    <div className="flex items-center justify-between bg-[#121316] p-1 px-2.5 rounded border border-gray-800">
                                      <span className="text-gray-500 uppercase font-bold text-[8px] tracking-wider">Due Date</span>
                                      <span className="text-gray-300 font-mono font-bold">{g.due}</span>
                                    </div>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>

                          {/* Goal Map Alignment */}
                          <div className="bg-[#151619] p-3.5 rounded-xl border border-gray-850 space-y-3">
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block border-b border-gray-850 pb-1.5 font-sans">🔄 Map Monthly Goals Alignment</span>
                            <div className="space-y-2">
                              {monthlyGoalsList.map((g) => (
                                <div key={g.id} className="flex justify-between items-center text-xs p-1.5 bg-[#1C1E22] rounded border border-gray-850">
                                  <span className="font-semibold text-gray-300 truncate max-w-[200px]">{g.text}</span>
                                  <select
                                    value={g.weekAssigned}
                                    onChange={(e) => onCustomTextChange(`month_${monthNum}_goal_${g.id}_week_assigned`, e.target.value)}
                                    className="bg-[#121316] border border-gray-800 rounded px-1.5 py-0.5 text-[10px] text-indigo-400 font-bold focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                  >
                                    <option value="all">All Weeks</option>
                                    <option value="1">Week 1</option>
                                    <option value="2">Week 2</option>
                                    <option value="3">Week 3</option>
                                    <option value="4">Week 4</option>
                                    <option value="5">Week 5</option>
                                    <option value="none">Unassigned</option>
                                  </select>
                                </div>
                              ))}
                            </div>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                )}

                {/* 8. NOTES TAB */}
                {weekTab === 'notes' && (
                  <div className="space-y-4 animate-fade-in">
                    {/* Stationery lined paper notes */}
                    <div className="bg-[#151619] p-4 rounded-xl border border-gray-850 space-y-3">
                      <div className="flex justify-between items-center border-b border-gray-850/60 pb-1.5">
                        <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest font-mono">Stationery Sandbox</span>
                        <span className="text-[9px] text-gray-500 font-mono">Week 0{activeWeek} Workspace Ledger</span>
                      </div>

                      <div className="relative">
                        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(#22252a_1px,transparent_1px)] bg-[size:100%_20px] opacity-20" />
                        <textarea
                          value={getVal(`w${activeWeek}_notes`, '• Brainstorming: Draft pos-framework component models.\n• Meeting reminder: Standup sync scheduled for Wednesday at 09:30 UTC.\n• Client review: Sync pipeline metrics and deliverables before Q3 end.')}
                          onChange={(e) => onCustomTextChange(`w${activeWeek}_notes`, e.target.value)}
                          className="w-full h-80 bg-transparent border-none p-2 text-xs text-white font-mono focus:outline-none focus:ring-0 leading-[20px] resize-none relative z-10"
                          placeholder="Compose weekly observations, thoughts, brainstorming loops, or miscellaneous logs..."
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 9. REVIEW TAB */}
                {weekTab === 'review' && (
                  <div className="space-y-3 animate-fade-in">
                    <div className="flex justify-between items-center px-1 mb-1">
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">🏆 Retrospective Weekly Audit</span>
                      <button
                        type="button"
                        onClick={() => {
                          const allOpen = Object.values(expandedWeekReview).every(Boolean);
                          setExpandedWeekReview({
                            wins: !allOpen,
                            challenges: !allOpen,
                            lessons: !allOpen,
                            goals: !allOpen,
                            habits: !allOpen,
                            reflection: !allOpen,
                            nextPriorities: !allOpen
                          });
                        }}
                        className="text-[10px] text-indigo-400 font-bold hover:text-white transition"
                      >
                        {Object.values(expandedWeekReview).every(Boolean) ? 'Collapse All' : 'Expand All'}
                      </button>
                    </div>

                    {[
                      { id: 'wins', label: '🏆 1. Weekly Accomplishments & Wins', key: `w${activeWeek}_review_wins`, placeholder: '- Deployed functional database schemas successfully ahead of schedule.\n- Solidified core user authentication framework and routes.\n- Secured secondary branding layouts.' },
                      { id: 'challenges', label: '⚠️ 2. Challenges, Frictions & Solutions', key: `w${activeWeek}_review_challenges`, placeholder: '- Observed bundle sizing latency; optimized bundle tree-shaking rules in esbuild config.\n- Realigned communications bottlenecks.' },
                      { id: 'lessons', label: '📚 3. Core Lessons & Tactical Takeaways', key: `w${activeWeek}_review_lessons`, placeholder: '- Incremental builds and robust linting save critical refactoring fatigue during late production phases.' },
                      { id: 'goals', label: '🎯 4. Strategic Goal Performance Audit', key: `w${activeWeek}_review_goals_notes`, placeholder: '- Revenue aligns perfectly with projections.\n- Testing coverage is stable.' },
                      { id: 'habits', label: '⚡ 5. Habit Consistency Scorecard', key: `w${activeWeek}_review_habits_notes`, placeholder: '- Wake-up routine was perfectly adhered to.\n- Deep work loop was fully completed.' },
                      { id: 'reflection', label: '🧠 6. Deep Personal Reflection & Meditation', key: `w${activeWeek}_review_reflection`, placeholder: '- Maintaining structured schedules reduces fatigue and boosts daily clarity.' },
                      { id: 'nextPriorities', label: '⏭️ 7. Priorities Carry-Over for Next Week', key: `w${activeWeek}_review_next_priorities`, placeholder: '- Initiate closed-alpha testing loops with focus groups.\n- Sync budgets balance ledger.' }
                    ].map((item) => {
                      const isOpen = expandedWeekReview[item.id];
                      const content = getVal(item.key, item.placeholder);

                      return (
                        <div key={item.id} className="bg-[#151619] p-3.5 rounded-xl border border-gray-850 space-y-2.5">
                          <button
                            type="button"
                            onClick={() => setExpandedWeekReview(prev => ({ ...prev, [item.id]: !prev[item.id] }))}
                            className="w-full text-xs font-bold text-gray-200 flex items-center justify-between text-left focus:outline-none"
                          >
                            <span>{item.label}</span>
                            {isOpen ? <ChevronDown className="h-4 w-4 text-gray-500" /> : <ChevronRight className="h-4 w-4 text-gray-500" />}
                          </button>

                          {isOpen && (
                            <div className="pt-2 border-t border-gray-850/60 animate-fade-in">
                              <textarea
                                value={content}
                                onChange={(e) => onCustomTextChange(item.key, e.target.value)}
                                className="w-full h-24 bg-[#121316] border border-gray-800 rounded p-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder-gray-700 resize-none font-sans leading-relaxed"
                                placeholder="Detail retrospective review metrics..."
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          ) : activePage.id === 19 ? (
            <TodayWorkspace
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              todayTab={todayTab}
              setTodayTab={setTodayTab}
              state={state}
              onStateChange={onStateChange}
              customTexts={customTexts}
              onCustomTextChange={onCustomTextChange}
              onPageSelect={onPageSelect}
            />
          ) : (activePage.id === 20 || activePage.id === 21) ? (
            <ProjectsWorkspace
              selectedProjectId={selectedProjectId}
              setSelectedProjectId={setSelectedProjectId}
              projectTab={projectTab}
              setProjectTab={setProjectTab}
              projectFilter={projectFilter}
              setProjectFilter={setProjectFilter}
              projectSearch={projectSearch}
              setProjectSearch={setProjectSearch}
              state={state}
              onStateChange={onStateChange}
              customTexts={customTexts}
              onCustomTextChange={onCustomTextChange}
              onPageSelect={onPageSelect}
              activePage={activePage}
              selectedDate={selectedDate}
            />
          ) : (
            <>
              {/* Breadcrumbs & Month Pagination Header */}
              <div className="flex flex-col space-y-2 border-b border-gray-800/60 pb-3 animate-fade-in">
                <div className="flex items-center justify-between text-[11px] text-gray-400 bg-gray-900/40 p-1.5 px-3.5 rounded-lg border border-gray-850">
                  <button 
                    onClick={() => onPageSelect?.(2)} 
                    className={`hover:text-white transition font-semibold flex items-center space-x-1 ${
                      activePage.section === 'Year Planning' ? 'text-indigo-400 font-bold' : ''
                    }`}
                  >
                    <span>📅 Year</span>
                  </button>
                  <ChevronRight className="h-3 w-3 text-gray-700" />
                  <button 
                    onClick={() => onPageSelect?.(12)} 
                    className={`hover:text-white transition font-semibold flex items-center space-x-1 ${
                      activePage.section === 'Monthly Dashboards' ? 'text-indigo-400 font-bold' : ''
                    }`}
                  >
                    <span>🌙 Month</span>
                  </button>
                  <ChevronRight className="h-3 w-3 text-gray-700" />
                  <button 
                    onClick={() => onPageSelect?.(18)} 
                    className={`hover:text-white transition font-semibold flex items-center space-x-1 ${
                      activePage.id === 18 ? 'text-indigo-400 font-bold' : ''
                    }`}
                  >
                    <span>📈 Week</span>
                  </button>
                  <ChevronRight className="h-3 w-3 text-gray-700" />
                  <button 
                    onClick={() => onPageSelect?.(19)} 
                    className={`hover:text-white transition font-semibold flex items-center space-x-1 ${
                      activePage.id === 19 ? 'text-indigo-400 font-bold' : ''
                    }`}
                  >
                    <span>🕒 Today</span>
                  </button>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button 
                    disabled={activePage.id <= 6}
                    onClick={() => {
                      onPageSelect?.(activePage.id - 1);
                      setMonthTab('overview');
                    }}
                    className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg border border-gray-800 disabled:opacity-30 disabled:pointer-events-none transition flex items-center space-x-1"
                    title="Previous Month"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                    <span className="text-[10px] font-bold hidden sm:inline">Prev</span>
                  </button>

                  <div className="text-center">
                    <span className="text-[9px] font-bold text-indigo-400 tracking-widest uppercase block mb-0.5">Interactive Month Workspace</span>
                    <h2 className="text-white text-base font-bold font-sans tracking-tight leading-none">{monthName} Dashboard</h2>
                  </div>

                  <button 
                    disabled={activePage.id >= 17}
                    onClick={() => {
                      onPageSelect?.(activePage.id + 1);
                      setMonthTab('overview');
                    }}
                    className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg border border-gray-800 disabled:opacity-30 disabled:pointer-events-none transition flex items-center space-x-1"
                    title="Next Month"
                  >
                    <span className="text-[10px] font-bold hidden sm:inline">Next</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Sleek Sub-Tab Switcher Bar */}
              <div className="flex items-center space-x-1 bg-[#151619] p-1 rounded-lg border border-gray-850 shrink-0 overflow-x-auto custom-scrollbar whitespace-nowrap scrollbar-none animate-fade-in">
                {[
                  { id: 'overview', label: 'Overview', icon: Compass },
                  { id: 'calendar', label: 'Calendar', icon: CalendarIcon },
                  { id: 'goals', label: 'Goals', icon: Target },
                  { id: 'habits', label: 'Habits', icon: Settings },
                  { id: 'projects', label: 'Projects', icon: Briefcase },
                  { id: 'budget', label: 'Budget', icon: PiggyBank },
                  { id: 'notes', label: 'Notes', icon: FileText },
                  { id: 'review', label: 'Review', icon: Smile }
                ].map((tab) => {
                  const TabIcon = tab.icon;
                  const isActive = monthTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setMonthTab(tab.id as any)}
                      className={`px-3 py-1.5 rounded-md text-[11px] font-bold uppercase tracking-wider flex items-center space-x-1.5 transition ${
                        isActive 
                          ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/20 shadow-inner' 
                          : 'text-gray-400 hover:text-white hover:bg-[#1E2024] border border-transparent'
                      }`}
                    >
                      <TabIcon className="h-3.5 w-3.5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Sub-Tab Contents */}
              <div className="flex-1 space-y-4 pt-1">
                
                {/* 1. OVERVIEW TAB */}
                {monthTab === 'overview' && (
                  <div className="space-y-4 animate-fade-in">
                    {/* Month Progress Hero Card */}
                    {(() => {
                      // Calculations
                      const hChecksCount = [
                        habit1_mon, habit1_tue, habit1_wed, habit1_thu, habit1_fri, habit1_sat, habit1_sun,
                        habit2_mon, habit2_tue, habit2_wed, habit2_thu, habit2_fri, habit2_sat, habit2_sun,
                        habit3_mon, habit3_tue, habit3_wed, habit3_thu, habit3_fri, habit3_sat, habit3_sun,
                      ].filter(Boolean).length;
                      const habitCompletionPercent = Math.round((hChecksCount / 21) * 100);

                      const dailyChecksCount = [
                        daily1_done, daily2_done, daily3_done, daily4_done, daily5_done
                      ].filter(Boolean).length;
                      const dailyPercent = Math.round((dailyChecksCount / 5) * 100);

                      const overallMonthProgress = Math.round(
                        ((Number(proj1_progress) + Number(proj2_progress) + Number(proj3_progress)) / 3 +
                        habitCompletionPercent +
                        dailyPercent) / 3
                      );

                      // Goals count
                      const gCount = parseInt(getVal(`month_${monthNum}_goals_count`, '0')) || 0;
                      let gCompleted = 0;
                      if (gCount === 0) {
                        // Prepopulated fallback mock
                        gCompleted = 1;
                      } else {
                        for (let i = 0; i < gCount; i++) {
                          if (getVal(`month_${monthNum}_goal_${i}_done`, 'false') === 'true') gCompleted++;
                        }
                      }
                      const goalsTotal = gCount === 0 ? 3 : gCount;

                      return (
                        <>
                          <div className="bg-gradient-to-br from-[#1E2024] to-[#151619] p-4.5 rounded-xl border border-gray-800 shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-5 opacity-5">
                              <Compass className="h-28 w-28 text-white" />
                            </div>
                            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block mb-1">AGGREGATE STANDING</span>
                            <h3 className="text-white text-base font-bold font-sans tracking-tight mb-2">Monthly Execution Standing</h3>
                            
                            <div className="space-y-3 pt-1">
                              <div className="flex justify-between text-xs">
                                <span className="text-gray-400 font-medium">Overall Progress</span>
                                <span className="text-indigo-400 font-mono font-bold">{overallMonthProgress}% Completed</span>
                              </div>
                              <div className="w-full bg-gray-900 h-2 rounded-full overflow-hidden border border-gray-800">
                                <div className="bg-indigo-500 h-full rounded-full transition-all duration-300" style={{ width: `${overallMonthProgress}%` }} />
                              </div>
                              <p className="text-[11px] text-gray-500 font-sans leading-relaxed">
                                Computed from 3 active projects, 21 habit tracking slots, and daily workflow checklist parameters.
                              </p>
                            </div>
                          </div>

                          {/* Quick Stats Bento Grid */}
                          <div className="grid grid-cols-2 gap-3">
                            <button 
                              onClick={() => setMonthTab('calendar')}
                              className="bg-[#151619] p-3 rounded-xl border border-gray-850 hover:border-gray-700 hover:bg-[#1C1E22] text-left transition group"
                            >
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider block font-sans">Active Calendar</span>
                                <ArrowRight className="h-3 w-3 text-gray-600 group-hover:text-indigo-400 transition" />
                              </div>
                              <span className="text-sm font-bold text-white block">2027 Grid</span>
                              <span className="text-[10px] text-indigo-400 font-medium mt-1 block">View Scheduled Events</span>
                            </button>

                            <button 
                              onClick={() => setMonthTab('goals')}
                              className="bg-[#151619] p-3 rounded-xl border border-gray-850 hover:border-gray-700 hover:bg-[#1C1E22] text-left transition group"
                            >
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider block font-sans">Monthly Goals</span>
                                <ArrowRight className="h-3 w-3 text-gray-600 group-hover:text-indigo-400 transition" />
                              </div>
                              <span className="text-sm font-bold text-white block font-mono">{gCompleted} / {goalsTotal} Done</span>
                              <span className="text-[10px] text-indigo-400 font-medium mt-1 block">Manage &amp; Add Goals</span>
                            </button>

                            <button 
                              onClick={() => setMonthTab('habits')}
                              className="bg-[#151619] p-3 rounded-xl border border-gray-850 hover:border-gray-700 hover:bg-[#1C1E22] text-left transition group"
                            >
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider block font-sans">Habit Grid</span>
                                <ArrowRight className="h-3 w-3 text-gray-600 group-hover:text-indigo-400 transition" />
                              </div>
                              <span className="text-sm font-bold text-white block font-mono">{habitCompletionPercent}%</span>
                              <span className="text-[10px] text-indigo-400 font-medium mt-1 block">{hChecksCount} of 21 boxes marked</span>
                            </button>

                            <button 
                              onClick={() => setMonthTab('budget')}
                              className="bg-[#151619] p-3 rounded-xl border border-gray-850 hover:border-gray-700 hover:bg-[#1C1E22] text-left transition group"
                            >
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider block font-sans">Budget Tracker</span>
                                <ArrowRight className="h-3 w-3 text-gray-600 group-hover:text-indigo-400 transition" />
                              </div>
                              <span className="text-sm font-bold text-white block">{savings_saved} Saved</span>
                              <span className="text-[10px] text-emerald-400 font-medium mt-1 block">Target: {savings_target}</span>
                            </button>
                          </div>

                          {/* Active Projects Quickview */}
                          <div className="bg-[#151619] p-3.5 rounded-xl border border-gray-850 space-y-2">
                            <div className="flex justify-between items-center pb-1.5 border-b border-gray-800">
                              <h4 className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Active Month Projects</h4>
                              <button onClick={() => setMonthTab('projects')} className="text-[10px] text-indigo-400 font-semibold hover:underline">Full timelines</button>
                            </div>
                            <div className="space-y-2.5 pt-1">
                              {[
                                { name: proj1_name, progress: proj1_progress },
                                { name: proj2_name, progress: proj2_progress },
                                { name: proj3_name, progress: proj3_progress }
                              ].map((p, idx) => (
                                <div key={idx} className="space-y-1">
                                  <div className="flex justify-between text-xs">
                                    <span className="text-gray-200 truncate pr-4 max-w-[250px]">{p.name || `Project ${idx+1}`}</span>
                                    <span className="text-gray-400 font-mono text-[10px]">{p.progress}%</span>
                                  </div>
                                  <div className="w-full bg-gray-900 h-1 rounded-full overflow-hidden">
                                    <div className="bg-indigo-500 h-full" style={{ width: `${p.progress}%` }} />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Upcoming Important Dates */}
                          <div className="bg-[#151619] p-3.5 rounded-xl border border-gray-850 space-y-2">
                            <h4 className="text-[10px] text-gray-400 font-bold uppercase tracking-wider pb-1.5 border-b border-gray-800">📅 Upcoming Important Dates</h4>
                            <div className="space-y-2 text-xs pt-1">
                              {[
                                { date: '01', defaultText: 'Month Kickoff Review' },
                                { date: '10', defaultText: 'Web Architecture Sprint Milestone' },
                                { date: '15', defaultText: 'Financial Sync Audit Checkpoint' },
                                { date: '28', defaultText: 'Content Brand Launch & Retrospective' }
                              ].map((item, idx) => {
                                const valKey = `month_${monthNum}_upcoming_date_${item.date}`;
                                const customText = getVal(valKey, item.defaultText);
                                return (
                                  <div key={idx} className="flex items-center space-x-2.5 bg-[#1C1E22] p-2 rounded-lg border border-gray-850">
                                    <span className="w-6 text-center font-mono font-bold text-[10px] text-indigo-400 bg-indigo-500/10 py-1 rounded shrink-0">{item.date}</span>
                                    <input
                                      type="text"
                                      value={customText}
                                      onChange={(e) => onCustomTextChange(valKey, e.target.value)}
                                      className="flex-1 bg-transparent border-none text-xs text-white focus:outline-none p-0 focus:ring-0 placeholder-gray-700"
                                      placeholder="Schedule an important date..."
                                    />
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                )}

                {/* 2. CALENDAR TAB */}
                {monthTab === 'calendar' && (
                  <div className="space-y-4 animate-fade-in">
                    {/* Interactive Calendar Grid */}
                    {(() => {
                      // Generate days grid
                      const dayCounts = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
                      const startDays = [4, 0, 0, 3, 5, 1, 3, 6, 2, 4, 0, 2]; // 2027 starting days of week
                      const activeMonthIdx = (parseInt(monthNum) || 1) - 1;
                      const startDay = startDays[activeMonthIdx] !== undefined ? startDays[activeMonthIdx] : 0;
                      const daysCount = dayCounts[activeMonthIdx] || 31;

                      const blanks = Array.from({ length: startDay });
                      const days = Array.from({ length: daysCount }, (_, i) => i + 1);
                      const weekdayNames = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

                      const activeDayEventsKey = `month_${monthNum}_day_${selectedDate}_events`;
                      const activeDayEvents = getVal(activeDayEventsKey, '');

                      return (
                        <>
                          <div className="bg-[#151619] p-3.5 rounded-xl border border-gray-850">
                            <span className="text-[9px] text-indigo-400 font-bold uppercase tracking-widest block mb-2 text-center">Interactive 2027 Calendar Matrix</span>
                            
                            {/* Days labels */}
                            <div className="grid grid-cols-7 gap-1 text-center font-sans font-bold text-gray-500 text-[10px] border-b border-gray-800 pb-1.5 mb-1.5">
                              {weekdayNames.map((w, idx) => <span key={idx}>{w}</span>)}
                            </div>

                            {/* Grid cells */}
                            <div className="grid grid-cols-7 gap-1 text-center">
                              {blanks.map((_, idx) => (
                                <div key={`b-${idx}`} className="h-9 rounded bg-[#1C1E22]/20 opacity-20 border border-transparent" />
                              ))}
                              {days.map((d) => {
                                const isSelected = selectedDate === d;
                                const hasEvents = getVal(`month_${monthNum}_day_${d}_events`, '').trim().length > 0;
                                return (
                                  <button
                                    key={d}
                                    onClick={() => setSelectedDate(d)}
                                    className={`h-9 rounded border text-xs font-semibold font-sans relative flex flex-col items-center justify-center transition-all ${
                                      isSelected
                                        ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg'
                                        : 'bg-[#1C1E22] border-gray-800/80 hover:border-gray-700 text-gray-300'
                                    }`}
                                  >
                                    <span>{d}</span>
                                    {hasEvents && (
                                      <span className={`w-1 h-1 rounded-full absolute bottom-1 ${isSelected ? 'bg-white' : 'bg-indigo-400 animate-pulse'}`} />
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* Detail Panel for selected date */}
                          <div className="bg-[#151619] p-3.5 rounded-xl border border-gray-850 space-y-3.5 animate-fade-in">
                            <div className="flex items-center justify-between border-b border-gray-800 pb-2">
                              <span className="text-xs font-bold text-gray-200">📅 {monthName} {selectedDate}, 2027 Details</span>
                              
                              <button
                                onClick={() => onPageSelect?.(19)}
                                className="px-2 py-1 bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30 border border-indigo-500/30 rounded text-[10px] font-bold uppercase tracking-wider flex items-center space-x-1 transition"
                              >
                                <span>Navigate to Daily Planning</span>
                                <ArrowUpRight className="h-3 w-3" />
                              </button>
                            </div>

                            {/* Scheduled events on this day */}
                            <div className="space-y-1">
                              <label htmlFor="active-day-events-textarea" className="block text-[10px] text-gray-500 font-semibold uppercase">Daily Scheduled Events &amp; Notes</label>
                              <textarea
                                id="active-day-events-textarea"
                                value={activeDayEvents}
                                onChange={(e) => onCustomTextChange(activeDayEventsKey, e.target.value)}
                                placeholder="E.g. 10:00 AM Architect review meeting, Prepare slides..."
                                className="w-full h-16 bg-[#121316] border border-gray-800 rounded p-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder-gray-700 resize-none font-sans leading-relaxed"
                              />
                            </div>

                            {/* Daily Assessment & Checklist Quick Sync */}
                            <div className="grid grid-cols-2 gap-3 text-xs pt-1.5 border-t border-gray-800/60">
                              <div>
                                <span className="block text-[9px] text-gray-500 font-bold uppercase mb-1">End of Day Rating</span>
                                <div className="flex items-center space-x-0.5">
                                  {[1, 2, 3, 4, 5].map((starNum) => {
                                    const isLit = starNum <= parseInt(daily_rating);
                                    return (
                                      <button
                                        key={starNum}
                                        onClick={() => onCustomTextChange(`month_${monthNum}_daily_rating`, String(starNum))}
                                        className="p-0.5 focus:outline-none"
                                      >
                                        <Star className={`h-3.5 w-3.5 ${isLit ? 'text-amber-400 fill-amber-400' : 'text-gray-700 hover:text-gray-500'}`} />
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                              <div>
                                <span className="block text-[9px] text-gray-500 font-bold uppercase mb-1">Reflection status</span>
                                <span className="text-[10px] text-gray-400 italic truncate max-w-full block" title={daily_reflection}>
                                  "{daily_reflection.substring(0, 30)}..."
                                </span>
                              </div>
                            </div>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                )}

                {/* 3. MONTHLY GOALS TAB */}
                {monthTab === 'goals' && (
                  <div className="space-y-4 animate-fade-in">
                    {/* Header */}
                    <div className="flex items-center justify-between pb-1 border-b border-gray-800/60">
                      <div>
                        <h4 className="text-xs font-bold text-gray-200">🎯 MONTHLY TARGET GOALS</h4>
                        <p className="text-[10px] text-gray-500">Manage, prioritize, and check off monthly milestones.</p>
                      </div>
                      
                      <button
                        onClick={() => {
                          const gCount = parseInt(getVal(`month_${monthNum}_goals_count`, '0')) || 0;
                          const nextIdx = gCount === 0 ? 3 : gCount;
                          onCustomTextChange(`month_${monthNum}_goals_count`, String(nextIdx + 1));
                          onCustomTextChange(`month_${monthNum}_goal_${nextIdx}_text`, 'Define target goal...');
                          onCustomTextChange(`month_${monthNum}_goal_${nextIdx}_done`, 'false');
                          onCustomTextChange(`month_${monthNum}_goal_${nextIdx}_priority`, 'Medium');
                          onCustomTextChange(`month_${monthNum}_goal_${nextIdx}_due`, '07/31');
                          onCustomTextChange(`month_${monthNum}_goal_${nextIdx}_notes`, '');
                        }}
                        className="px-2 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-[10px] font-bold uppercase tracking-wider flex items-center space-x-1.5 transition"
                      >
                        <PlusCircle className="h-3.5 w-3.5" />
                        <span>Add Goal</span>
                      </button>
                    </div>

                    {/* Goals List (unlimited goals) */}
                    {(() => {
                      const gCount = parseInt(getVal(`month_${monthNum}_goals_count`, '0')) || 0;
                      const goalsList: Array<{id: number, text: string, done: boolean, priority: 'High'|'Medium'|'Low', due: string, notes: string}> = [];
                      
                      if (gCount === 0) {
                        // Load fallback defaults
                        goalsList.push(
                          { id: 0, text: 'Establish robust architecture testing framework', done: false, priority: 'High', due: '07/12', notes: 'Verify vector output integrity' },
                          { id: 1, text: 'Synchronize financial reserve calculations', done: true, priority: 'High', due: '07/18', notes: 'Saved targets synced' },
                          { id: 2, text: 'Calibrate cardio training cycles', done: false, priority: 'Medium', due: '07/25', notes: 'Commit to weekly routines' }
                        );
                      } else {
                        for (let i = 0; i < gCount; i++) {
                          const isDeleted = getVal(`month_${monthNum}_goal_${i}_deleted`, 'false') === 'true';
                          if (!isDeleted) {
                            goalsList.push({
                              id: i,
                              text: getVal(`month_${monthNum}_goal_${i}_text`, 'Define target goal...'),
                              done: getVal(`month_${monthNum}_goal_${i}_done`, 'false') === 'true',
                              priority: getVal(`month_${monthNum}_goal_${i}_priority`, 'Medium') as any,
                              due: getVal(`month_${monthNum}_goal_${i}_due`, '07/31'),
                              notes: getVal(`month_${monthNum}_goal_${i}_notes`, '')
                            });
                          }
                        }
                      }

                      return (
                        <div className="space-y-3">
                          {goalsList.map((g) => {
                            return (
                              <div key={g.id} className="bg-[#151619] p-3 rounded-xl border border-gray-850 space-y-2.5 animate-fade-in relative group">
                                <div className="flex items-start space-x-2.5">
                                  {/* Toggle box */}
                                  <button
                                    onClick={() => onCustomTextChange(`month_${monthNum}_goal_${g.id}_done`, g.done ? 'false' : 'true')}
                                    className={`w-4.5 h-4.5 rounded border mt-0.5 flex items-center justify-center transition-all shrink-0 ${
                                      g.done
                                        ? 'bg-indigo-600 border-indigo-500 text-white'
                                        : 'bg-[#121316] border-gray-800 hover:border-gray-700 text-transparent'
                                    }`}
                                    aria-label="Toggle Goal Status"
                                  >
                                    <Check className="h-3 w-3 stroke-[3px]" />
                                  </button>

                                  {/* Goal description text */}
                                  <input
                                    type="text"
                                    value={g.text}
                                    onChange={(e) => {
                                      // Force initialize goals counter if we were using fallback
                                      if (gCount === 0) {
                                        onCustomTextChange(`month_${monthNum}_goals_count`, '3');
                                        onCustomTextChange(`month_${monthNum}_goal_0_text`, 'Establish robust architecture testing framework');
                                        onCustomTextChange(`month_${monthNum}_goal_1_text`, 'Synchronize financial reserve calculations');
                                        onCustomTextChange(`month_${monthNum}_goal_2_text`, 'Calibrate cardio training cycles');
                                      }
                                      onCustomTextChange(`month_${monthNum}_goal_${g.id}_text`, e.target.value);
                                    }}
                                    className={`flex-1 bg-transparent border-none text-xs font-semibold p-0 focus:ring-0 focus:outline-none ${
                                      g.done ? 'line-through text-gray-500' : 'text-gray-200'
                                    }`}
                                  />

                                  {/* Delete button */}
                                  <button
                                    onClick={() => {
                                      if (gCount === 0) {
                                        // Initialize first
                                        onCustomTextChange(`month_${monthNum}_goals_count`, '3');
                                        onCustomTextChange(`month_${monthNum}_goal_0_deleted`, 'false');
                                        onCustomTextChange(`month_${monthNum}_goal_1_deleted`, 'false');
                                        onCustomTextChange(`month_${monthNum}_goal_2_deleted`, 'false');
                                      }
                                      onCustomTextChange(`month_${monthNum}_goal_${g.id}_deleted`, 'true');
                                    }}
                                    className="p-1 text-gray-600 hover:text-red-400 rounded hover:bg-red-500/10 transition shrink-0"
                                    title="Delete Goal"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </div>

                                {/* Goals detail inputs (priority, due date, notes) */}
                                <div className="grid grid-cols-3 gap-2 text-[11px] pt-2 border-t border-gray-850/60">
                                  <div>
                                    <label className="block text-[9px] text-gray-500 font-bold uppercase mb-0.5">Priority</label>
                                    <select
                                      value={g.priority}
                                      onChange={(e) => {
                                        if (gCount === 0) onCustomTextChange(`month_${monthNum}_goals_count`, '3');
                                        onCustomTextChange(`month_${monthNum}_goal_${g.id}_priority`, e.target.value);
                                      }}
                                      className="w-full bg-[#121316] border border-gray-800 rounded px-1.5 py-0.5 text-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                    >
                                      <option value="High">🔴 High</option>
                                      <option value="Medium">🟡 Medium</option>
                                      <option value="Low">🟢 Low</option>
                                    </select>
                                  </div>

                                  <div>
                                    <label className="block text-[9px] text-gray-500 font-bold uppercase mb-0.5">Target Date</label>
                                    <input
                                      type="text"
                                      value={g.due}
                                      onChange={(e) => {
                                        if (gCount === 0) onCustomTextChange(`month_${monthNum}_goals_count`, '3');
                                        onCustomTextChange(`month_${monthNum}_goal_${g.id}_due`, e.target.value);
                                      }}
                                      placeholder="MM/DD"
                                      className="w-full bg-[#121316] border border-gray-800 rounded px-1.5 py-0.5 text-center font-mono text-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-[9px] text-gray-500 font-bold uppercase mb-0.5">Context Notes</label>
                                    <input
                                      type="text"
                                      value={g.notes}
                                      onChange={(e) => {
                                        if (gCount === 0) onCustomTextChange(`month_${monthNum}_goals_count`, '3');
                                        onCustomTextChange(`month_${monthNum}_goal_${g.id}_notes`, e.target.value);
                                      }}
                                      placeholder="Notes..."
                                      className="w-full bg-[#121316] border border-gray-800 rounded px-1.5 py-0.5 text-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                    />
                                  </div>
                                </div>
                              </div>
                            );
                          })}

                          {goalsList.length === 0 && (
                            <div className="text-center py-8 text-gray-500 text-xs border border-dashed border-gray-800 rounded-xl">
                              No target goals established yet. Add your first goal above.
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                )}

                {/* 4. HABIT TRACKER TAB */}
                {monthTab === 'habits' && (
                  <div className="space-y-4 animate-fade-in">
                    <div className="flex items-center justify-between pb-1 border-b border-gray-800/60">
                      <div>
                        <h4 className="text-xs font-bold text-gray-200">📅 HABIT TRACKING GRID</h4>
                        <p className="text-[10px] text-gray-500">Monitor routine streaks and monthly consistency parameters.</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {[
                        { name: habit1_name, prefix: 'habit1', days: [habit1_mon, habit1_tue, habit1_wed, habit1_thu, habit1_fri, habit1_sat, habit1_sun] },
                        { name: habit2_name, prefix: 'habit2', days: [habit2_mon, habit2_tue, habit2_wed, habit2_thu, habit2_fri, habit2_sat, habit2_sun] },
                        { name: habit3_name, prefix: 'habit3', days: [habit3_mon, habit3_tue, habit3_wed, habit3_thu, habit3_fri, habit3_sat, habit3_sun] }
                      ].map((habit, idx) => {
                        const completedCount = habit.days.filter(Boolean).length;
                        const consistencyPct = Math.round((completedCount / 7) * 100);
                        
                        return (
                          <div key={idx} className="p-3 bg-[#151619] rounded-xl border border-gray-850 space-y-3 animate-fade-in">
                            <div className="flex justify-between items-center">
                              <input
                                type="text"
                                value={habit.name}
                                onChange={(e) => onCustomTextChange(`month_${monthNum}_${habit.prefix}_name`, e.target.value)}
                                className="bg-transparent border-none text-xs font-bold text-gray-200 focus:outline-none focus:ring-0 p-0 truncate max-w-[200px]"
                                placeholder={`Habit ${idx+1} Title...`}
                              />
                              <div className="flex items-center space-x-2 text-[10px] text-gray-400 font-mono">
                                <span>Streak: {completedCount}/7 days</span>
                                <span className="bg-indigo-500/10 text-indigo-400 px-1.5 py-0.5 rounded font-bold">{consistencyPct}% Consistency</span>
                              </div>
                            </div>

                            {/* Mon to Sun checklist buttons */}
                            <div className="grid grid-cols-7 gap-1.5 text-center">
                              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((dayChar, dIdx) => {
                                const dayKeys = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
                                const key = `month_${monthNum}_${habit.prefix}_${dayKeys[dIdx]}`;
                                const isChecked = habit.days[dIdx];
                                return (
                                  <div key={dIdx} className="flex flex-col items-center space-y-1">
                                    <span className="text-[9px] text-gray-500 font-semibold">{dayChar}</span>
                                    <button
                                      onClick={() => onCustomTextChange(key, isChecked ? 'false' : 'true')}
                                      className={`w-7.5 h-7.5 rounded border flex items-center justify-center transition-all focus:outline-none ${
                                        isChecked
                                          ? 'bg-indigo-600 border-indigo-500 text-white shadow shadow-indigo-600/10'
                                          : 'bg-[#121316] border-gray-800 hover:border-gray-700 text-transparent'
                                      }`}
                                    >
                                      <Check className="h-3.5 w-3.5 stroke-[3.5px]" />
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 5. PROJECTS TAB */}
                {monthTab === 'projects' && (
                  <div className="space-y-4 animate-fade-in">
                    <div className="flex items-center justify-between pb-1 border-b border-gray-800/60">
                      <div>
                        <h4 className="text-xs font-bold text-gray-200">🚀 MONTHLY PROJECT TIMELINES</h4>
                        <p className="text-[10px] text-gray-500">Track milestones and project completion progress metrics.</p>
                      </div>
                      
                      <button
                        onClick={() => onPageSelect?.(20)}
                        className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-[10px] font-bold uppercase tracking-wider flex items-center space-x-1.5 transition"
                      >
                        <span>Open Project Workspace</span>
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <div className="space-y-3.5">
                      {[
                        { label: 'Project Slot 1', name: proj1_name, start: proj1_start, end: proj1_end, progress: proj1_progress, prefix: 'proj1' },
                        { label: 'Project Slot 2', name: proj2_name, start: proj2_start, end: proj2_end, progress: proj2_progress, prefix: 'proj2' },
                        { label: 'Project Slot 3', name: proj3_name, start: proj3_start, end: proj3_end, progress: proj3_progress, prefix: 'proj3' }
                      ].map((proj, idx) => (
                        <div key={idx} className="space-y-2.5 p-3 bg-[#151619] rounded-xl border border-gray-850 animate-fade-in">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-gray-400">{proj.label}</span>
                            <span className="font-mono text-indigo-400 font-semibold bg-indigo-500/10 px-2 py-0.5 rounded">{proj.progress}% Completed</span>
                          </div>
                          
                          <input
                            type="text"
                            value={proj.name}
                            onChange={(e) => onCustomTextChange(`month_${monthNum}_${proj.prefix}_name`, e.target.value)}
                            className="w-full bg-[#121316] border border-gray-800 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-sans"
                            placeholder="Enter project title..."
                          />

                          <div className="grid grid-cols-2 gap-3 text-xs">
                            <div>
                              <label className="block text-[9px] text-gray-500 font-semibold mb-0.5">Start Milestone Date</label>
                              <input
                                type="text"
                                value={proj.start}
                                onChange={(e) => onCustomTextChange(`month_${monthNum}_${proj.prefix}_start`, e.target.value)}
                                className="w-full bg-[#121316] border border-gray-800 rounded px-2 py-1 text-xs text-white focus:outline-none text-center font-mono"
                                placeholder="MM/DD"
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] text-gray-500 font-semibold mb-0.5">End Milestone Date</label>
                              <input
                                type="text"
                                value={proj.end}
                                onChange={(e) => onCustomTextChange(`month_${monthNum}_${proj.prefix}_end`, e.target.value)}
                                className="w-full bg-[#121316] border border-gray-800 rounded px-2 py-1 text-xs text-white focus:outline-none text-center font-mono"
                                placeholder="MM/DD"
                              />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="block text-[9px] text-gray-500 font-semibold">Adjust Progress slider</label>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={proj.progress}
                              onChange={(e) => onCustomTextChange(`month_${monthNum}_${proj.prefix}_progress`, e.target.value)}
                              className="w-full h-1.5 bg-gray-800 rounded appearance-none cursor-pointer accent-indigo-500"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 6. BUDGET TAB */}
                {monthTab === 'budget' && (
                  <div className="space-y-4 animate-fade-in">
                    <div className="flex items-center justify-between pb-1 border-b border-gray-800/60">
                      <div>
                        <h4 className="text-xs font-bold text-gray-200">💰 BUDGET &amp; SAVINGS SYSTEM</h4>
                        <p className="text-[10px] text-gray-500">Plan and manage monthly capital flow and target savings.</p>
                      </div>
                    </div>

                    {/* Integrated Savings Tracker (linked to SVG) */}
                    <div className="bg-[#151619] p-3.5 rounded-xl border border-gray-850 space-y-3 animate-fade-in">
                      <div className="flex justify-between items-center pb-1.5 border-b border-gray-800">
                        <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block font-sans">Active Savings Core (Blueprint Sync)</span>
                        <span className="font-mono text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">{savings_progress}%</span>
                      </div>
                      
                      <div className="space-y-2.5">
                        <div className="space-y-0.5">
                          <label className="block text-[9px] text-gray-500 font-semibold mb-0.5">Savings Target Description</label>
                          <input
                            type="text"
                            value={savings_goal_desc}
                            onChange={(e) => onCustomTextChange(`month_${monthNum}_savings_goal_desc`, e.target.value)}
                            className="w-full bg-[#121316] border border-gray-800 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-sans"
                            placeholder="e.g. Q2 Reserve Base"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <label className="block text-[9px] text-gray-500 font-semibold mb-0.5">Target Amount</label>
                            <input
                              type="text"
                              value={savings_target}
                              onChange={(e) => onCustomTextChange(`month_${monthNum}_savings_target`, e.target.value)}
                              className="w-full bg-[#121316] border border-gray-800 rounded px-2 py-1 text-xs text-white focus:outline-none text-center font-mono"
                              placeholder="e.g. $5,000"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] text-gray-500 font-semibold mb-0.5">Current Saved</label>
                            <input
                              type="text"
                              value={savings_saved}
                              onChange={(e) => onCustomTextChange(`month_${monthNum}_savings_saved`, e.target.value)}
                              className="w-full bg-[#121316] border border-gray-800 rounded px-2 py-1 text-xs text-white focus:outline-none text-center font-mono"
                              placeholder="e.g. $3,200"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="block text-[9px] text-gray-500 font-semibold">Adjust Savings Slider</label>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={savings_progress}
                            onChange={(e) => onCustomTextChange(`month_${monthNum}_savings_progress`, e.target.value)}
                            className="w-full h-1.5 bg-gray-800 rounded appearance-none cursor-pointer accent-emerald-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Custom Income Tracking Grid */}
                    <div className="bg-[#151619] p-3.5 rounded-xl border border-gray-850 space-y-3 animate-fade-in">
                      <div className="flex justify-between items-center pb-1.5 border-b border-gray-800">
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block font-sans">1. INFLOW / INCOME TRACKING</span>
                        <button
                          onClick={() => {
                            const count = parseInt(getVal(`month_${monthNum}_income_count`, '3')) || 3;
                            onCustomTextChange(`month_${monthNum}_income_count`, String(count + 1));
                          }}
                          className="text-[10px] text-indigo-400 font-bold flex items-center space-x-1 hover:underline"
                        >
                          <PlusCircle className="h-3.5 w-3.5" />
                          <span>Add Inflow</span>
                        </button>
                      </div>

                      <div className="space-y-2.5">
                        {(() => {
                          const count = parseInt(getVal(`month_${monthNum}_income_count`, '3')) || 3;
                          const defaultNames = ['Consulting Fees', 'Dividend Payouts', 'Secondary Revenue'];
                          const defaultPlanned = ['$4,500', '$1,200', '$1,500'];
                          const defaultActual = ['$4,500', '$1,050', '$1,800'];
                          
                          return Array.from({ length: count }).map((_, idx) => {
                            const nameKey = `month_${monthNum}_income_${idx}_name`;
                            const plannedKey = `month_${monthNum}_income_${idx}_planned`;
                            const actualKey = `month_${monthNum}_income_${idx}_actual`;
                            
                            return (
                              <div key={idx} className="grid grid-cols-12 gap-2 text-xs items-center bg-[#1C1E22] p-2 rounded-lg border border-gray-850">
                                <input
                                  type="text"
                                  value={getVal(nameKey, defaultNames[idx] || 'Custom Revenue')}
                                  onChange={(e) => onCustomTextChange(nameKey, e.target.value)}
                                  className="col-span-6 bg-transparent border-none text-xs text-white p-0 focus:ring-0 focus:outline-none font-semibold truncate"
                                  placeholder="Revenue source..."
                                />
                                <input
                                  type="text"
                                  value={getVal(plannedKey, defaultPlanned[idx] || '$0')}
                                  onChange={(e) => onCustomTextChange(plannedKey, e.target.value)}
                                  className="col-span-3 bg-[#121316] border border-gray-800 text-center font-mono rounded px-1.5 py-0.5 text-gray-300 focus:outline-none"
                                  placeholder="Planned"
                                />
                                <input
                                  type="text"
                                  value={getVal(actualKey, defaultActual[idx] || '$0')}
                                  onChange={(e) => onCustomTextChange(actualKey, e.target.value)}
                                  className="col-span-3 bg-[#121316] border border-gray-800 text-center font-mono rounded px-1.5 py-0.5 text-emerald-400 font-bold focus:outline-none"
                                  placeholder="Actual"
                                />
                              </div>
                            );
                          });
                        })()}
                      </div>
                    </div>

                    {/* Custom Expenses Tracking Grid */}
                    <div className="bg-[#151619] p-3.5 rounded-xl border border-gray-850 space-y-3 animate-fade-in">
                      <div className="flex justify-between items-center pb-1.5 border-b border-gray-800">
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block font-sans">2. OUTFLOW / EXPENSE TRACKING</span>
                        <button
                          onClick={() => {
                            const count = parseInt(getVal(`month_${monthNum}_expense_count`, '4')) || 4;
                            onCustomTextChange(`month_${monthNum}_expense_count`, String(count + 1));
                          }}
                          className="text-[10px] text-indigo-400 font-bold flex items-center space-x-1 hover:underline"
                        >
                          <PlusCircle className="h-3.5 w-3.5" />
                          <span>Add Outflow</span>
                        </button>
                      </div>

                      <div className="space-y-2.5">
                        {(() => {
                          const count = parseInt(getVal(`month_${monthNum}_expense_count`, '4')) || 4;
                          const defaultNames = ['Rent & Utilities', 'Marketing Budget', 'Travel Logistics', 'Subscriptions'];
                          const defaultPlanned = ['$2,200', '$800', '$500', '$300'];
                          const defaultActual = ['$2,200', '$950', '$420', '$310'];

                          return Array.from({ length: count }).map((_, idx) => {
                            const nameKey = `month_${monthNum}_expense_${idx}_name`;
                            const plannedKey = `month_${monthNum}_expense_${idx}_planned`;
                            const actualKey = `month_${monthNum}_expense_${idx}_actual`;

                            return (
                              <div key={idx} className="grid grid-cols-12 gap-2 text-xs items-center bg-[#1C1E22] p-2 rounded-lg border border-gray-850">
                                <input
                                  type="text"
                                  value={getVal(nameKey, defaultNames[idx] || 'Custom Expense')}
                                  onChange={(e) => onCustomTextChange(nameKey, e.target.value)}
                                  className="col-span-6 bg-transparent border-none text-xs text-white p-0 focus:ring-0 focus:outline-none font-semibold truncate"
                                  placeholder="Expense category..."
                                />
                                <input
                                  type="text"
                                  value={getVal(plannedKey, defaultPlanned[idx] || '$0')}
                                  onChange={(e) => onCustomTextChange(plannedKey, e.target.value)}
                                  className="col-span-3 bg-[#121316] border border-gray-800 text-center font-mono rounded px-1.5 py-0.5 text-gray-300 focus:outline-none"
                                  placeholder="Planned"
                                />
                                <input
                                  type="text"
                                  value={getVal(actualKey, defaultActual[idx] || '$0')}
                                  onChange={(e) => onCustomTextChange(actualKey, e.target.value)}
                                  className="col-span-3 bg-[#121316] border border-gray-800 text-center font-mono rounded px-1.5 py-0.5 text-red-400 font-bold focus:outline-none"
                                  placeholder="Actual"
                                />
                              </div>
                            );
                          });
                        })()}
                      </div>
                    </div>

                    {/* Financial Notes & Budget Categories */}
                    <div className="bg-[#151619] p-3.5 rounded-xl border border-gray-850 space-y-2">
                      <h4 className="text-[10px] text-gray-400 font-bold uppercase tracking-wider pb-1.5 border-b border-gray-800">🗒️ Budget Categories &amp; Financial Notes</h4>
                      <textarea
                        value={getVal(`month_${monthNum}_budget_notes`, 'Capped discretionary expense spillover. Marketing spend exceeded due to portfolio sync promotion efforts, which is covered by secondary revenue overflow.')}
                        onChange={(e) => onCustomTextChange(`month_${monthNum}_budget_notes`, e.target.value)}
                        className="w-full h-18 bg-[#121316] border border-gray-800 rounded p-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder-gray-700 resize-none font-sans leading-relaxed"
                        placeholder="Write down any monthly budget analysis or categories details..."
                      />
                    </div>
                  </div>
                )}

                {/* 7. NOTES TAB */}
                {monthTab === 'notes' && (
                  <div className="space-y-4 animate-fade-in">
                    <div className="flex items-center justify-between pb-1 border-b border-gray-800/60">
                      <div>
                        <h4 className="text-xs font-bold text-gray-200">🗒️ IDEAS, REMINDERS &amp; BRAINSTORMING</h4>
                        <p className="text-[10px] text-gray-500">A clean canvas to write down notes and meeting memos.</p>
                      </div>
                    </div>

                    <div className="relative p-4 rounded-xl border border-gray-850 bg-gradient-to-b from-[#1C1E22] to-[#151619] shadow-inner space-y-3">
                      {/* Stationery lined paper effect background for premium feel */}
                      <span className="text-[10px] text-indigo-400 font-bold block uppercase tracking-widest font-mono">STATIONERY NOTES</span>
                      <textarea
                        value={getVal(`month_${monthNum}_ideas_notes`, '- Map out new content brand strategies next Wednesday.\n- Sync portfolio data across local structures to avoid cold start overhead.\n- Formulate Fall backup planning framework before August.')}
                        onChange={(e) => onCustomTextChange(`month_${monthNum}_ideas_notes`, e.target.value)}
                        className="w-full h-80 bg-transparent border-none text-xs text-white focus:outline-none p-0 focus:ring-0 resize-none font-sans leading-relaxed text-slate-200"
                        placeholder="Write down ideas, notes, brainstorming details here..."
                      />
                    </div>
                  </div>
                )}

                {/* 8. RETROSPECTIVE REVIEW TAB */}
                {monthTab === 'review' && (
                  <div className="space-y-4 animate-fade-in">
                    <div className="flex items-center justify-between pb-1 border-b border-gray-800/60">
                      <div>
                        <h4 className="text-xs font-bold text-gray-200">🏁 MONTHLY RETROSPECTIVE REVIEW</h4>
                        <p className="text-[10px] text-gray-500">Reflect on wins, major blockades, and priorities for next month.</p>
                      </div>
                    </div>

                    {/* Collapsible Section 1: Wins & Achievements */}
                    <div className="bg-[#151619] p-3 rounded-xl border border-gray-850 space-y-2">
                      <div className="flex justify-between items-center pb-1.5 border-b border-gray-850">
                        <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider font-sans">🏅 Collapsible Wins &amp; Achievements</span>
                      </div>
                      <div className="space-y-2 pt-1">
                        {[1, 2].map((num) => (
                          <div key={num} className="space-y-1.5 bg-[#1C1E22] p-2 rounded-lg border border-gray-850 text-xs">
                            <label className="block text-[9px] text-gray-500 font-semibold uppercase">Win #{num} Title</label>
                            <input
                              type="text"
                              value={getVal(`month_${monthNum}_review_win_${num}_title`, num === 1 ? 'Scaled Operational Margins & Business Revenue' : 'Flawless Daily Routine Synchronization')}
                              onChange={(e) => onCustomTextChange(`month_${monthNum}_review_win_${num}_title`, e.target.value)}
                              className="w-full bg-[#121316] border border-gray-800 rounded px-2.5 py-1 text-xs text-white focus:outline-none"
                            />
                            <label className="block text-[9px] text-gray-500 font-semibold uppercase">Win #{num} Details</label>
                            <textarea
                              value={getVal(`month_${monthNum}_review_win_${num}_desc`, 'Completed targets successfully and verified vector output margins.')}
                              onChange={(e) => onCustomTextChange(`month_${monthNum}_review_win_${num}_desc`, e.target.value)}
                              className="w-full h-10 bg-[#121316] border border-gray-800 rounded p-1.5 text-[11px] text-gray-300 resize-none font-sans"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Collapsible Section 2: Critical Blockades & Challenges */}
                    <div className="bg-[#151619] p-3.5 rounded-xl border border-gray-850 space-y-2">
                      <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider block border-b border-gray-850 pb-1.5 font-sans">⚠️ Critical Blockades &amp; Challenges</span>
                      <textarea
                        value={getVal(`month_${monthNum}_review_challenges`, 'Encountered short communication channel delays in the middle of Project 2. Capped by enforcing strict offline calendar time blocks.')}
                        onChange={(e) => onCustomTextChange(`month_${monthNum}_review_challenges`, e.target.value)}
                        className="w-full h-16 bg-[#121316] border border-gray-800 rounded p-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder-gray-700 resize-none font-sans leading-relaxed"
                        placeholder="Detail major challenges and obstacles..."
                      />
                    </div>

                    {/* Collapsible Section 3: Strategic Lessons Learned */}
                    <div className="bg-[#151619] p-3.5 rounded-xl border border-gray-850 space-y-2">
                      <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider block border-b border-gray-850 pb-1.5 font-sans">📚 Strategic Lessons &amp; Reflections</span>
                      <textarea
                        value={getVal(`month_${monthNum}_review_lessons`, 'Focus heavily on automated triggers and daily habit checking rather than manual willpower. Streamlining boundaries keeps cognitive stress extremely low.')}
                        onChange={(e) => onCustomTextChange(`month_${monthNum}_review_lessons`, e.target.value)}
                        className="w-full h-16 bg-[#121316] border border-gray-800 rounded p-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder-gray-700 resize-none font-sans leading-relaxed"
                        placeholder="Write down strategic lessons and reviews..."
                      />
                    </div>

                    {/* Collapsible Section 4: Habits & Goal Review */}
                    <div className="bg-[#151619] p-3.5 rounded-xl border border-gray-850 space-y-2">
                      <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider block border-b border-gray-850 pb-1.5 font-sans">📈 Habit &amp; Goal Progress Reviews</span>
                      <textarea
                        value={weekly_analysis}
                        onChange={(e) => onCustomTextChange(`month_${monthNum}_weekly_analysis`, e.target.value)}
                        className="w-full h-20 bg-[#121316] border border-gray-800 rounded p-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder-gray-750 resize-none font-sans leading-relaxed"
                        placeholder="Review weekly habit consistency & goals success..."
                      />
                    </div>

                    {/* Collapsible Section 5: Priorities for Next Month */}
                    <div className="bg-[#151619] p-3.5 rounded-xl border border-gray-850 space-y-2">
                      <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider block border-b border-gray-850 pb-1.5 font-sans">🎯 Strategic Priorities for Next Month</span>
                      <textarea
                        value={getVal(`month_${monthNum}_next_month_priorities`, '- Launch final Web Architecture features.\n- Complete financial portfolio scaling and re-allocation strategy.\n- Double cardio frequency to maintain peak operational health.')}
                        onChange={(e) => onCustomTextChange(`month_${monthNum}_next_month_priorities`, e.target.value)}
                        className="w-full h-18 bg-[#121316] border border-gray-800 rounded p-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder-gray-700 resize-none font-sans leading-relaxed"
                        placeholder="Detail strategic priorities for the next month..."
                      />
                    </div>
                  </div>
                )}

              </div>
            </>
          )}

        </div>

        {/* RIGHT COLUMN: BLUEPRINT VECTOR PREVIEW */}
        <div className={`flex-1 overflow-auto custom-scrollbar flex flex-col items-center justify-between p-6 relative ${
          mobileMode === 'preview' ? 'flex' : 'hidden lg:flex'
        }`} id="workspace-right-preview">
          
          {/* Zoom / Scale Widgets Panel */}
          <div className="flex items-center space-x-3.5 bg-[#1C1E22] px-4 py-2 rounded-full border border-gray-800 text-xs shadow-lg shrink-0 z-10">
            <button
              onClick={handleZoomOut}
              className="text-gray-400 hover:text-white transition p-1 hover:bg-gray-800 rounded focus:outline-none"
              title="Zoom Out"
              id="zoom-out-btn"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            
            <button
              onClick={handleResetZoom}
              className="font-mono font-bold text-gray-300 hover:text-white transition px-1 focus:outline-none"
              title="Reset Zoom"
              id="zoom-reset-btn"
            >
              {Math.round(scale * 100)}%
            </button>
            
            <button
              onClick={handleZoomIn}
              className="text-gray-400 hover:text-white transition p-1 hover:bg-gray-800 rounded focus:outline-none"
              title="Zoom In"
              id="zoom-in-btn"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>

            <div className="h-3 w-px bg-gray-700"></div>

            <div className="flex items-center space-x-1.5 text-gray-400">
              <FileText className="h-3.5 w-3.5 text-indigo-400" />
              <span className="font-mono text-[11px]">148 × 210 mm (A5 Portrait)</span>
            </div>
          </div>

          {/* Vector Preview Sheet Stage */}
          <div className="flex-1 w-full overflow-auto custom-scrollbar flex items-center justify-center p-8 relative">
            <motion.div
              key={activePage.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              style={{ transform: `scale(${scale})`, transformOrigin: 'center center' }}
              className="relative transition-transform duration-150 shrink-0"
            >
              {/* Main A5 layout card mockup */}
              <div 
                className="bg-[#FAF9F5] rounded shadow-[0_25px_60px_-15px_rgba(0,0,0,0.65)] border border-gray-900/40 relative overflow-hidden select-text text-left"
                style={{ width: '592px', height: '840px' }}
                id="planner-canvas-container"
                dangerouslySetInnerHTML={{ __html: svgString }}
              />
            </motion.div>
          </div>

          {/* Live Syncing Watermark Indicator */}
          <div className="text-[10px] text-gray-500 font-mono tracking-wider bg-gray-900/35 px-3 py-1 rounded-full border border-gray-800/40 shrink-0">
            • WYSIWYG RENDER ACTIVE • CHANNELS CALIBRATED
          </div>

        </div>

      </div>

    </main>
  );
};
