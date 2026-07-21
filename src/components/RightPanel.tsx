import React, { useState, useRef, useEffect } from 'react';
import { PageConfig, PlannerState } from '../types';
import { PAGES } from '../data/pages';
import { 
  Compass, 
  Sliders, 
  Layout, 
  SlidersHorizontal, 
  Info, 
  Type, 
  FileCode, 
  CheckCircle2, 
  Sparkles, 
  Send, 
  Loader2, 
  RefreshCw,
  HelpCircle,
  TrendingUp,
  Award,
  Calendar,
  CheckSquare,
  Activity,
  Heart
} from 'lucide-react';

interface RightPanelProps {
  activePage: PageConfig;
  state: PlannerState;
  onStateChange: (updatedState: PlannerState) => void;
  customTexts: { [key: string]: string };
  onCustomTextChange: (key: string, value: string) => void;
  onDownloadSVG: () => void;
  onDownloadZip: () => void;
  onPrintPage: () => void;
}

export const RightPanel: React.FC<RightPanelProps> = ({
  activePage,
  state,
  onStateChange,
  customTexts,
  onCustomTextChange,
  onDownloadSVG,
  onDownloadZip,
  onPrintPage
}) => {
  const [activeTab, setActiveTab] = useState<'blueprint' | 'editor'>('editor');

  // Helper to fetch custom text
  const getCustomTextVal = (key: string, fallback: string) => {
    return customTexts[key] !== undefined ? customTexts[key] : fallback;
  };

  // Helper to update state goals
  const updateGoal = (idx: number, key: 'milestone' | 'progress' | 'pillar', val: any) => {
    const updatedGoals = [...state.annualGoals];
    updatedGoals[idx] = {
      ...updatedGoals[idx],
      [key]: key === 'progress' ? parseInt(val) || 0 : val
    };
    onStateChange({ ...state, annualGoals: updatedGoals });
  };

  // Helper to update state projects
  const updateProject = (idx: number, key: 'name' | 'status' | 'due' | 'pct', val: any) => {
    const updatedProjects = [...state.projects];
    updatedProjects[idx] = {
      ...updatedProjects[idx],
      [key]: key === 'pct' ? parseInt(val) || 0 : val
    };
    onStateChange({ ...state, projects: updatedProjects });
  };

  // Helper to update state daily tasks
  const updateDailyTask = (idx: number, text: string) => {
    const updatedTasks = [...state.dailyTasks];
    updatedTasks[idx] = { ...updatedTasks[idx], text };
    onStateChange({ ...state, dailyTasks: updatedTasks });
  };

  // Helper to update life balance scorecard scores
  const updateYearScore = (key: keyof typeof state.yearScores, val: number) => {
    onStateChange({
      ...state,
      yearScores: {
        ...state.yearScores,
        [key]: val
      }
    });
  };

  return (
    <aside 
      className="w-80 bg-[#1C1E22] border-l border-gray-800 flex flex-col shrink-0"
      aria-label="Settings and Editor Panel"
    >
      {/* Workspace Editor Info */}
      <div className="p-4 border-b border-gray-800 bg-[#22252A] shadow-sm space-y-1.5 shrink-0">
        <span className="text-[9px] font-bold text-indigo-400 tracking-widest uppercase block">
          Interactive Controls
        </span>
        <h3 className="text-white font-sans font-bold text-sm tracking-tight leading-tight">
          {activePage.title}
        </h3>
        <p className="text-xs text-gray-400 leading-relaxed font-sans">
          Modify the dynamic values. Central vector canvas updates automatically.
        </p>
      </div>

      {/* Tab Switcher */}
      <div className="px-4 py-2 border-b border-gray-800 bg-[#151619] flex space-x-1 shrink-0">
        <button
          onClick={() => setActiveTab('editor')}
          className={`flex-1 py-1.5 text-center text-[10px] font-bold uppercase tracking-wider rounded-md transition ${
            activeTab === 'editor' 
              ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 font-bold' 
              : 'text-gray-400 hover:text-white border border-transparent'
          }`}
        >
          Element Controls
        </button>
        <button
          onClick={() => setActiveTab('blueprint')}
          className={`flex-1 py-1.5 text-center text-[10px] font-bold uppercase tracking-wider rounded-md transition ${
            activeTab === 'blueprint' 
              ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 font-bold' 
              : 'text-gray-400 hover:text-white border border-transparent'
          }`}
        >
          Blueprint Specs
        </button>
      </div>

      {/* Tab Content Body */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-5">

        {/* TAB 1: BLUEPRINT DESIGN DETAILS */}
        {activeTab === 'blueprint' && (
          <div 
            id="blueprint-tab-panel" 
            role="tabpanel" 
            aria-labelledby="blueprint-tab-btn"
            className="space-y-4"
          >
            <h4 className="text-[10px] font-bold text-white uppercase tracking-wider border-b border-gray-800 pb-2 flex items-center space-x-1.5">
              <Layout className="h-3.5 w-3.5 text-indigo-400" />
              <span>Layout Specifications</span>
            </h4>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-gray-800/60">
                <span className="text-gray-400">Page Sizing Dimensions</span>
                <span className="text-white font-mono font-medium">148 mm × 210 mm (A5)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-800/60">
                <span className="text-gray-400">Layout Safety Margins</span>
                <span className="text-white font-mono font-medium">10 mm All Edges</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-800/60">
                <span className="text-gray-400">Header Typography</span>
                <span className="text-white font-medium flex items-center space-x-1">
                  <Type className="h-3 w-3 text-gray-500" />
                  <span>Montserrat Bold</span>
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-800/60">
                <span className="text-gray-400">Body Typography</span>
                <span className="text-white font-medium flex items-center space-x-1">
                  <Type className="h-3 w-3 text-gray-500" />
                  <span>Inter Regular</span>
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-800/60">
                <span className="text-gray-400">Grids &amp; Wireframe Sizing</span>
                <span className="text-white font-mono font-medium">0.75 pt stroke width</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-800/60">
                <span className="text-gray-400">Calibration Alignment</span>
                <span className="text-emerald-400 font-mono font-bold">100% Vector Crisp</span>
              </div>
            </div>

            {/* Zero Shift Notice */}
            <div className="bg-slate-800/40 border border-slate-800/60 rounded-lg p-3 text-xs leading-relaxed text-gray-400 space-y-1.5 shadow-inner">
              <div className="flex items-center space-x-1.5 text-white font-semibold">
                <Info className="h-3.5 w-3.5 text-indigo-400" />
                <span>Zero-Shift Layout System</span>
              </div>
              <p className="text-[11px] leading-relaxed text-gray-400 font-sans">
                This design template is compiled with precise margins to maintain absolute A5 proportionality when imported into your vector editor of choice.
              </p>
            </div>
          </div>
        )}

        {/* TAB 2: LIVE ELEMENT EDITOR */}
        {activeTab === 'editor' && (
          <div 
            id="editor-tab-panel" 
            role="tabpanel" 
            aria-labelledby="editor-tab-btn"
            className="space-y-4"
          >
            <h4 className="text-[10px] font-bold text-white uppercase tracking-wider border-b border-gray-800 pb-2 flex items-center space-x-1.5">
              <Sliders className="h-3.5 w-3.5 text-indigo-400" />
              <span>Canvas Element Controls</span>
            </h4>

            {/* Annual Vision Controls */}
            {activePage.type === 'annual_vision' && (
              <fieldset className="space-y-3.5 border-none p-0 m-0">
                <legend className="sr-only">Annual Vision Milestones</legend>
                <p className="text-[11px] text-gray-400 font-sans">
                  Adjust goals and progress metrics. The central workspace vector updates in real time.
                </p>
                {state.annualGoals.map((g, idx) => (
                  <div key={idx} className="space-y-1.5 bg-[#18191D] p-3 rounded-lg border border-gray-800/80">
                    <label 
                      htmlFor={`goal-milestone-${idx}`}
                      className="text-[9px] text-indigo-400 font-bold uppercase tracking-wider block"
                    >
                      {g.pillar} Milestone
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        id={`goal-milestone-${idx}`}
                        value={g.milestone}
                        onChange={(e) => updateGoal(idx, 'milestone', e.target.value)}
                        className="flex-1 bg-[#121316] border border-gray-700 text-white rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans transition"
                        placeholder="Define milestone..."
                      />
                      <input
                        type="number"
                        id={`goal-progress-${idx}`}
                        aria-label={`${g.pillar} progress completion percentage`}
                        value={g.progress}
                        min="0"
                        max="100"
                        onChange={(e) => updateGoal(idx, 'progress', e.target.value)}
                        className="w-14 bg-[#121316] border border-gray-700 text-white rounded py-1.5 text-xs text-center font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                ))}
              </fieldset>
            )}

            {/* Project Portfolio Controls */}
            {activePage.type === 'projects_portfolio' && (
              <fieldset className="space-y-3 border-none p-0 m-0">
                <legend className="sr-only">Projects Portfolio Editor</legend>
                <p className="text-[11px] text-gray-400 font-sans">
                  Edit project portfolio parameters. Status flags generate matching color vectors.
                </p>
                {state.projects.map((p, idx) => (
                  <div key={idx} className="bg-[#18191D] p-3 rounded-lg border border-gray-800 space-y-2.5">
                    <span className="text-[10px] text-indigo-400 font-bold block uppercase tracking-wider">
                      PROJECT SLOT 0{idx + 1}
                    </span>
                    <div className="space-y-1">
                      <label htmlFor={`proj-name-${idx}`} className="sr-only">Project Name</label>
                      <input
                        type="text"
                        id={`proj-name-${idx}`}
                        value={p.name}
                        onChange={(e) => updateProject(idx, 'name', e.target.value)}
                        className="w-full bg-[#121316] border border-gray-700 text-white rounded px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans font-medium"
                        placeholder="Project Name..."
                      />
                    </div>
                    <div className="flex space-x-1.5">
                      <label htmlFor={`proj-status-${idx}`} className="sr-only">Status</label>
                      <select
                        id={`proj-status-${idx}`}
                        value={p.status}
                        onChange={(e) => updateProject(idx, 'status', e.target.value)}
                        className="flex-1 bg-[#121316] border border-gray-700 text-white rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans"
                      >
                        <option value="In Progress">In Progress</option>
                        <option value="Planning">Planning</option>
                        <option value="Completed">Completed</option>
                        <option value="Blocked">Blocked</option>
                      </select>
                      <label htmlFor={`proj-due-${idx}`} className="sr-only">Due Date</label>
                      <input
                        type="text"
                        id={`proj-due-${idx}`}
                        value={p.due}
                        onChange={(e) => updateProject(idx, 'due', e.target.value)}
                        className="w-20 bg-[#121316] border border-gray-700 text-white rounded px-1.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans text-center"
                        placeholder="Due Date..."
                      />
                      <label htmlFor={`proj-pct-${idx}`} className="sr-only">Completion ratio</label>
                      <input
                        type="number"
                        id={`proj-pct-${idx}`}
                        value={p.pct}
                        min="0"
                        max="100"
                        onChange={(e) => updateProject(idx, 'pct', e.target.value)}
                        className="w-12 bg-[#121316] border border-gray-700 text-white rounded py-1.5 text-xs text-center font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="%"
                      />
                    </div>
                  </div>
                ))}
              </fieldset>
            )}

            {/* Quarterly OKR Controls */}
            {activePage.type === 'quarterly_okr' && (
              <fieldset className="space-y-3.5 border-none p-0 m-0">
                <legend className="sr-only">Quarterly OKRs Planner</legend>
                <p className="text-[11px] text-gray-400 font-sans">
                  Personalize the core quarterly goals, key result lines, and tactics.
                </p>
                <div className="space-y-1">
                  <label htmlFor={`q_${activePage.q}_objective`} className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider block">
                    Q{activePage.q} Primary Objective
                  </label>
                  <textarea
                    id={`q_${activePage.q}_objective`}
                    value={getCustomTextVal(`q_${activePage.q}_objective`, 'Establish solid operational scale, marketing boundaries, and delivery rhythms across core ventures.')}
                    onChange={(e) => onCustomTextChange(`q_${activePage.q}_objective`, e.target.value)}
                    className="w-full h-16 bg-[#121316] border border-gray-700 text-white rounded p-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans resize-none"
                  />
                </div>

                {[0, 1, 2].map(krIdx => (
                  <div key={krIdx} className="space-y-1">
                    <label htmlFor={`q_${activePage.q}_kr_${krIdx}`} className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider block">
                      Key Result 0{krIdx + 1}
                    </label>
                    <input
                      type="text"
                      id={`q_${activePage.q}_kr_${krIdx}`}
                      value={getCustomTextVal(`q_${activePage.q}_kr_${krIdx}`, 'Implement fully unified alignment & execution workflows across the core operational units.')}
                      onChange={(e) => onCustomTextChange(`q_${activePage.q}_kr_${krIdx}`, e.target.value)}
                      className="w-full bg-[#121316] border border-gray-700 text-white rounded px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans"
                    />
                  </div>
                ))}

                <div className="space-y-1">
                  <label htmlFor={`q_${activePage.q}_tactics`} className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider block">
                    Tactics &amp; Actions
                  </label>
                  <textarea
                    id={`q_${activePage.q}_tactics`}
                    value={getCustomTextVal(`q_${activePage.q}_tactics`, 'Map key tasks, software releases, metrics auditing, and risk management strategies into operational tactics.')}
                    onChange={(e) => onCustomTextChange(`q_${activePage.q}_tactics`, e.target.value)}
                    className="w-full h-16 bg-[#121316] border border-gray-700 text-white rounded p-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans resize-none"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor={`q_${activePage.q}_review`} className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider block">
                    Review Matrix
                  </label>
                  <textarea
                    id={`q_${activePage.q}_review`}
                    value={getCustomTextVal(`q_${activePage.q}_review`, 'Perform quarterly alignment sync with partners. Audit weekly velocity reports. Re-evaluate capital deployment schemes.')}
                    onChange={(e) => onCustomTextChange(`q_${activePage.q}_review`, e.target.value)}
                    className="w-full h-16 bg-[#121316] border border-gray-700 text-white rounded p-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans resize-none"
                  />
                </div>
              </fieldset>
            )}

            {/* Monthly Dashboard Controls */}
            {activePage.type === 'monthly_dashboard' && (
              <fieldset className="space-y-3.5 border-none p-0 m-0">
                <legend className="sr-only">Monthly Dashboard Parameters</legend>
                <p className="text-[11px] text-gray-400 font-sans">
                  Customize core KPI numbers displayed on your {activePage.month} monthly dashboard sheet.
                </p>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label htmlFor={`month_${activePage.num}_revenue`} className="text-[9px] text-indigo-400 font-bold uppercase block">Revenue Target</label>
                    <input
                      type="text"
                      id={`month_${activePage.num}_revenue`}
                      value={getCustomTextVal(`month_${activePage.num}_revenue`, '$8,450')}
                      onChange={(e) => onCustomTextChange(`month_${activePage.num}_revenue`, e.target.value)}
                      className="w-full bg-[#121316] border border-gray-700 text-white rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor={`month_${activePage.num}_savings`} className="text-[9px] text-indigo-400 font-bold uppercase block">Savings Ratio</label>
                    <input
                      type="text"
                      id={`month_${activePage.num}_savings`}
                      value={getCustomTextVal(`month_${activePage.num}_savings`, '34.5%')}
                      onChange={(e) => onCustomTextChange(`month_${activePage.num}_savings`, e.target.value)}
                      className="w-full bg-[#121316] border border-gray-700 text-white rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor={`month_${activePage.num}_work`} className="text-[9px] text-indigo-400 font-bold uppercase block">Deep Work Focus Hours</label>
                    <input
                      type="text"
                      id={`month_${activePage.num}_work`}
                      value={getCustomTextVal(`month_${activePage.num}_work`, '68 Hrs')}
                      onChange={(e) => onCustomTextChange(`month_${activePage.num}_work`, e.target.value)}
                      className="w-full bg-[#121316] border border-gray-700 text-white rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor={`month_${activePage.num}_workouts`} className="text-[9px] text-indigo-400 font-bold uppercase block">Training Sessions</label>
                    <input
                      type="text"
                      id={`month_${activePage.num}_workouts`}
                      value={getCustomTextVal(`month_${activePage.num}_workouts`, '18 Sessions')}
                      onChange={(e) => onCustomTextChange(`month_${activePage.num}_workouts`, e.target.value)}
                      className="w-full bg-[#121316] border border-gray-700 text-white rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                    />
                  </div>
                </div>
              </fieldset>
            )}

            {/* Horizon Priorities */}
            {activePage.type.startsWith('calendar_') && (
              <fieldset className="space-y-3.5 border-none p-0 m-0">
                <legend className="sr-only">Horizon Monthly Focuses</legend>
                <p className="text-[11px] text-gray-400 font-sans">
                  Type priority focus targets for the months on this horizon layout.
                </p>
                {[0, 1, 2, 3].map(mIdx => {
                  const monthsList = activePage.type === 'calendar_jan_apr'
                    ? ['January', 'February', 'March', 'April']
                    : activePage.type === 'calendar_may_aug'
                      ? ['May', 'June', 'July', 'August']
                      : ['September', 'October', 'November', 'December'];
                  const monthName = monthsList[mIdx];
                  const focusKey = `calendar_focus_${activePage.id}_${mIdx}`;
                  return (
                    <div key={mIdx} className="space-y-1 bg-[#18191D] p-2.5 rounded-lg border border-gray-800">
                      <label htmlFor={focusKey} className="text-[10px] text-indigo-400 font-bold block uppercase">
                        {monthName} Priority Focus
                      </label>
                      <input
                        type="text"
                        id={focusKey}
                        value={getCustomTextVal(focusKey, 'Strategic Priority Objective focus points here...')}
                        onChange={(e) => onCustomTextChange(focusKey, e.target.value)}
                        className="w-full bg-[#121316] border border-gray-700 text-white rounded px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans"
                      />
                    </div>
                  );
                })}
              </fieldset>
            )}

            {/* Weekly Roadmap Controls */}
            {activePage.type === 'weekly_roadmap' && (
              <fieldset className="space-y-3.5 border-none p-0 m-0">
                <legend className="sr-only">Weekly Column Focus</legend>
                <p className="text-[11px] text-gray-400 font-sans">
                  Customize the notes/focus element at the bottom of each weekday column.
                </p>
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, idx) => {
                  const key = `weekly_day_focus_${idx}`;
                  return (
                    <div key={idx} className="space-y-1">
                      <label htmlFor={key} className="text-[9px] text-indigo-400 font-bold uppercase tracking-wider block">{day}</label>
                      <input
                        type="text"
                        id={key}
                        value={getCustomTextVal(key, 'Task Core Focus...')}
                        onChange={(e) => onCustomTextChange(key, e.target.value)}
                        className="w-full bg-[#121316] border border-gray-700 text-white rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans"
                      />
                    </div>
                  );
                })}
              </fieldset>
            )}

            {/* Daily Command Center Layout A */}
            {activePage.type === 'daily_center_a' && (
              <fieldset className="space-y-3.5 border-none p-0 m-0">
                <legend className="sr-only">Daily Timeline and Focus Editor</legend>
                <p className="text-[11px] text-gray-400 font-sans">
                  Edit hourly command schedule timelines and morning journal intentions.
                </p>

                <div className="space-y-2 bg-[#18191D] p-3 rounded-lg border border-gray-800">
                  <span className="text-[10px] text-indigo-400 font-bold block uppercase tracking-wider mb-1">Morning Reflections</span>
                  <div className="space-y-2">
                    <div className="space-y-0.5">
                      <label htmlFor="daily_gratitude" className="text-[9px] text-gray-500 uppercase font-bold">1. Grateful for:</label>
                      <input
                        type="text"
                        id="daily_gratitude"
                        value={getCustomTextVal('daily_gratitude', 'This beautiful life path, high cognitive flexibility, and the ability to formulate software solutions.')}
                        onChange={(e) => onCustomTextChange('daily_gratitude', e.target.value)}
                        className="w-full bg-[#121316] border border-gray-700 text-white rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans"
                      />
                    </div>
                    <div className="space-y-0.5">
                      <label htmlFor="daily_metric" className="text-[9px] text-gray-500 uppercase font-bold">2. Primary Success Metric:</label>
                      <input
                        type="text"
                        id="daily_metric"
                        value={getCustomTextVal('daily_metric', 'Deep Work focus concentration blocks strictly exceeding 6 hours.')}
                        onChange={(e) => onCustomTextChange('daily_metric', e.target.value)}
                        className="w-full bg-[#121316] border border-gray-700 text-white rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] text-indigo-400 font-bold block uppercase tracking-wider">Hourly Timeline Actions</span>
                  {state.dailyTasks.map((task, idx) => (
                    <div key={idx} className="flex items-center space-x-2 bg-[#18191D] p-2 rounded border border-gray-800">
                      <span className="text-[10px] font-mono text-gray-500 w-16 shrink-0">{task.time}</span>
                      <input
                        type="text"
                        aria-label={`Hourly Task for ${task.time}`}
                        value={task.text}
                        onChange={(e) => updateDailyTask(idx, e.target.value)}
                        className="flex-1 bg-transparent border-b border-gray-700 text-white text-xs py-0.5 focus:outline-none focus:border-indigo-500 font-sans"
                      />
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] text-indigo-400 font-bold block uppercase tracking-wider">Priority Task Checkboxes</span>
                  {[0, 1, 2, 3, 4, 5].map(todoIdx => (
                    <div key={todoIdx} className="space-y-0.5">
                      <label htmlFor={`daily_todo_${todoIdx}`} className="sr-only">Todo Priority Item {todoIdx + 1}</label>
                      <input
                        type="text"
                        id={`daily_todo_${todoIdx}`}
                        value={getCustomTextVal(`daily_todo_${todoIdx}`, `Priority Strategic Task Module item #${todoIdx + 1}`)}
                        onChange={(e) => onCustomTextChange(`daily_todo_${todoIdx}`, e.target.value)}
                        className="w-full bg-[#121316] border border-gray-700 text-white rounded px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans mb-1"
                        placeholder={`Priority Item #${todoIdx + 1}...`}
                      />
                    </div>
                  ))}
                </div>
              </fieldset>
            )}

            {/* Daily Calibration Layout B */}
            {activePage.type === 'daily_center_b' && (
              <fieldset className="space-y-3.5 border-none p-0 m-0">
                <legend className="sr-only">Evening Calibration Reflections</legend>
                <p className="text-[11px] text-gray-400 font-sans">
                  Custom evening reflections and lessons learned to lock into vector lines.
                </p>
                <div className="space-y-1">
                  <label htmlFor="daily_b_learnings" className="text-[10px] text-indigo-400 font-bold uppercase block">Learnings &amp; Reflections</label>
                  <textarea
                    id="daily_b_learnings"
                    value={getCustomTextVal('daily_b_learnings', 'Ensure strict execution margins. Review cognitive energy decay peaks. Double active rest cycles.')}
                    onChange={(e) => onCustomTextChange('daily_b_learnings', e.target.value)}
                    className="w-full h-24 bg-[#121316] border border-gray-700 text-white rounded p-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans resize-none"
                  />
                </div>
              </fieldset>
            )}

            {/* Project Portfolio Audit */}
            {activePage.type === 'portfolio_audit' && (
              <fieldset className="space-y-3.5 border-none p-0 m-0">
                <legend className="sr-only">Project Audit Blockades and Solutions</legend>
                <p className="text-[11px] text-gray-400 font-sans">
                  Customize the root causes of blocked slots and corresponding action mitigations.
                </p>
                <div className="space-y-1">
                  <label htmlFor="audit_blockades" className="text-[10px] text-indigo-400 font-bold uppercase block">Root Causes &amp; Blockades</label>
                  <textarea
                    id="audit_blockades"
                    value={getCustomTextVal('audit_blockades', '1. Uncontrollable communication channel overhead blocks.\n2. Incomplete API sandbox integration specs.\n3. Server setup cold starts latency.')}
                    onChange={(e) => onCustomTextChange('audit_blockades', e.target.value)}
                    className="w-full h-24 bg-[#121316] border border-gray-700 text-white rounded p-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans resize-none"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="audit_mitigation" className="text-[10px] text-indigo-400 font-bold uppercase block">Action Mitigation Plans</label>
                  <textarea
                    id="audit_mitigation"
                    value={getCustomTextVal('audit_mitigation', 'Initialize local caching layers. Limit sync updates to every 4 hours. Formulate structured API fallback strategies.')}
                    onChange={(e) => onCustomTextChange('audit_mitigation', e.target.value)}
                    className="w-full h-24 bg-[#121316] border border-gray-700 text-white rounded p-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans resize-none"
                  />
                </div>
              </fieldset>
            )}

            {/* Lessons & Reflections */}
            {activePage.type === 'lessons_reflections' && (
              <fieldset className="space-y-3.5 border-none p-0 m-0">
                <legend className="sr-only">Annual Reflections and Intentions</legend>
                <p className="text-[11px] text-gray-400 font-sans">
                  Update reflections and guiding intentions for your commitment block.
                </p>
                <div className="space-y-1">
                  <label htmlFor="lessons_intentions" className="text-[10px] text-indigo-400 font-bold uppercase block">Guiding Intentions Sync</label>
                  <textarea
                    id="lessons_intentions"
                    value={getCustomTextVal('lessons_intentions', '1. Maintain a high-contrast cognitive framework.\n2. Align daily actions strictly with weekly commitments.\n3. Reflect at the end of every active session.')}
                    onChange={(e) => onCustomTextChange('lessons_intentions', e.target.value)}
                    className="w-full h-24 bg-[#121316] border border-gray-700 text-white rounded p-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans resize-none"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="lessons_challenges" className="text-[10px] text-indigo-400 font-bold uppercase block">Biggest Challenges Met</label>
                  <textarea
                    id="lessons_challenges"
                    value={getCustomTextVal('lessons_challenges', 'Ensuring consistent operational speed when scaling digital infrastructure under limited time windows.')}
                    onChange={(e) => onCustomTextChange('lessons_challenges', e.target.value)}
                    className="w-full h-24 bg-[#121316] border border-gray-700 text-white rounded p-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans resize-none"
                  />
                </div>
              </fieldset>
            )}

            {/* Balance Wheel Scorecard Controls */}
            {activePage.type === 'year_review_scorecard' && (
              <fieldset className="space-y-4 border-none p-0 m-0">
                <legend className="sr-only">Life Balance Wheel Values</legend>
                <p className="text-[11px] text-gray-400 font-sans">
                  Drag the sliders below. The visual coordinates of the Balanced Life Wheel morph on the central canvas in real time.
                </p>
                {Object.entries(state.yearScores).map(([scoreKey, val]) => (
                  <div key={scoreKey} className="space-y-1">
                    <div className="flex justify-between text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                      <label htmlFor={`wheel-slider-${scoreKey}`}>{scoreKey}</label>
                      <span className="font-mono text-indigo-400 font-bold">{val}%</span>
                    </div>
                    <input
                      type="range"
                      id={`wheel-slider-${scoreKey}`}
                      value={val}
                      min="10"
                      max="100"
                      step="5"
                      onChange={(e) => updateYearScore(scoreKey as keyof typeof state.yearScores, parseInt(e.target.value))}
                      className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                    />
                  </div>
                ))}
              </fieldset>
            )}

            {/* Default State Message */}
            {!['annual_vision', 'projects_portfolio', 'quarterly_okr', 'monthly_dashboard', 'calendar_jan_apr', 'calendar_may_aug', 'calendar_sept_dec', 'weekly_roadmap', 'daily_center_a', 'daily_center_b', 'portfolio_audit', 'lessons_reflections', 'year_review_scorecard'].includes(activePage.type) && (
              <div className="text-center py-6 text-gray-500 text-xs">
                No advanced editable controllers for this template. Use direct live editing inside the workspace, or download vector blueprint.
              </div>
            )}

          </div>
        )}

      </div>

      {/* EXPORT ACTION FOOTER BAR */}
      <div className="p-4 border-t border-gray-800 bg-[#18191D] shrink-0 no-print">
        <button
          onClick={onPrintPage}
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs py-3 rounded-md font-semibold transition-all flex items-center justify-center space-x-2 shadow-lg shadow-indigo-600/10 focus:outline-none focus:ring-2 focus:ring-indigo-500 active:scale-[0.98]"
          id="print-active-pdf-btn"
        >
          <Info className="h-3.5 w-3.5" />
          <span>Print Active Month to PDF</span>
        </button>
      </div>

    </aside>
  );
};
