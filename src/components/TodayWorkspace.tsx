import React from 'react';
import { PlannerState } from '../types';
import { 
  Compass, 
  Clock, 
  CheckSquare, 
  SlidersHorizontal, 
  Settings, 
  FileText, 
  Smile, 
  ChevronLeft, 
  ChevronRight, 
  Moon, 
  Activity, 
  PlusCircle, 
  Trash2, 
  Check 
} from 'lucide-react';

interface TodayWorkspaceProps {
  selectedDate: number;
  setSelectedDate: React.Dispatch<React.SetStateAction<number>>;
  todayTab: 'overview' | 'schedule' | 'tasks' | 'blocking' | 'habits' | 'notes' | 'reflection';
  setTodayTab: React.Dispatch<React.SetStateAction<'overview' | 'schedule' | 'tasks' | 'blocking' | 'habits' | 'notes' | 'reflection'>>;
  state: PlannerState;
  onStateChange?: (updatedState: PlannerState) => void;
  customTexts: { [key: string]: string };
  onCustomTextChange: (key: string, value: string) => void;
  onPageSelect?: (pageId: number) => void;
}

export const TodayWorkspace: React.FC<TodayWorkspaceProps> = ({
  selectedDate,
  setSelectedDate,
  todayTab,
  setTodayTab,
  state,
  onStateChange,
  customTexts,
  onCustomTextChange,
  onPageSelect
}) => {
  const getVal = (key: string, fallback: string) => {
    return customTexts[key] !== undefined ? customTexts[key] : fallback;
  };

  return (
    <div className="flex flex-col space-y-4 animate-fade-in h-full">
      {/* Breadcrumbs & Navigation Header */}
      <div className="flex flex-col space-y-2 border-b border-gray-800/60 pb-3">
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
            className="hover:text-white transition font-semibold flex items-center space-x-1"
          >
            <span>📈 Week</span>
          </button>
          <ChevronRight className="h-3 w-3 text-gray-700" />
          <button 
            onClick={() => onPageSelect?.(19)} 
            className="text-indigo-400 font-bold hover:text-white transition flex items-center space-x-1"
          >
            <span>🕒 Today</span>
          </button>
        </div>

        <div className="flex items-center justify-between pt-1">
          <button 
            disabled={selectedDate === 1}
            onClick={() => setSelectedDate(prev => Math.max(1, prev - 1))}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg border border-gray-800 disabled:opacity-30 disabled:pointer-events-none transition flex items-center space-x-1"
            title="Previous Day"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            <span className="text-[10px] font-bold hidden sm:inline">Prev</span>
          </button>

          <div className="text-center">
            <span className="text-[9px] font-bold text-indigo-400 tracking-widest uppercase block mb-0.5">Daily Command Center</span>
            <h2 className="text-white text-sm font-bold font-sans tracking-tight leading-none">July {selectedDate < 10 ? `0${selectedDate}` : selectedDate}, 2026</h2>
          </div>

          <button 
            disabled={selectedDate === 31}
            onClick={() => setSelectedDate(prev => Math.min(31, prev + 1))}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg border border-gray-800 disabled:opacity-30 disabled:pointer-events-none transition flex items-center space-x-1"
            title="Next Day"
          >
            <span className="text-[10px] font-bold hidden sm:inline">Next</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Sub-Tab Navigation Switcher */}
      <div className="flex items-center space-x-1 bg-[#151619] p-1 rounded-lg border border-gray-850 shrink-0 overflow-x-auto custom-scrollbar whitespace-nowrap scrollbar-none animate-fade-in">
        {[
          { id: 'overview', label: 'Overview', icon: Compass },
          { id: 'schedule', label: 'Schedule', icon: Clock },
          { id: 'tasks', label: 'Tasks', icon: CheckSquare },
          { id: 'blocking', label: 'Time Blocking', icon: SlidersHorizontal },
          { id: 'habits', label: 'Habits', icon: Settings },
          { id: 'notes', label: 'Notes', icon: FileText },
          { id: 'reflection', label: 'Reflection', icon: Smile }
        ].map((tab) => {
          const TabIcon = tab.icon;
          const isActive = todayTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setTodayTab(tab.id as any)}
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

      {/* Tab Contents */}
      <div className="flex-1 space-y-4 overflow-y-auto pr-1">
        {todayTab === 'overview' && (
          <div className="space-y-4 animate-fade-in">
            <div className="bg-[#151619] p-4 rounded-xl border border-gray-850 space-y-3.5">
              <h3 className="text-xs font-bold text-indigo-400 tracking-wider uppercase flex items-center space-x-1.5">
                <Compass className="h-3.5 w-3.5" />
                <span>Today's Metrics & Mission</span>
              </h3>
              <p className="text-[11px] text-gray-400">Establish your daily core metrics, water intake targets, energy metrics, sleep parameters, and high-level daily focus mission statement.</p>

              <div className="grid grid-cols-2 gap-3.5 pt-1">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-gray-400 font-bold uppercase flex items-center space-x-1">
                    <Moon className="h-3 w-3 text-indigo-400" />
                    <span>Sleep Parameters</span>
                  </label>
                  <input
                    type="text"
                    value={getVal('daily_sleep', '7.5 Hours')}
                    onChange={(e) => onCustomTextChange('daily_sleep', e.target.value)}
                    className="w-full bg-[#121316] border border-gray-800 rounded p-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-sans"
                    placeholder="e.g. 7.5 Hours"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-gray-400 font-bold uppercase flex items-center space-x-1">
                    <Compass className="h-3 w-3 text-emerald-400" />
                    <span>Water Intake</span>
                  </label>
                  <input
                    type="text"
                    value={getVal('daily_water', '3 Liters')}
                    onChange={(e) => onCustomTextChange('daily_water', e.target.value)}
                    className="w-full bg-[#121316] border border-gray-800 rounded p-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-sans"
                    placeholder="e.g. 3 Liters"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-gray-400 font-bold uppercase flex items-center space-x-1">
                    <Activity className="h-3 w-3 text-amber-400" />
                    <span>Energy Metric</span>
                  </label>
                  <input
                    type="text"
                    value={getVal('daily_energy', 'Optimal')}
                    onChange={(e) => onCustomTextChange('daily_energy', e.target.value)}
                    className="w-full bg-[#121316] border border-gray-800 rounded p-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-sans"
                    placeholder="e.g. Peak"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-gray-400 font-bold uppercase flex items-center space-x-1">
                    <SlidersHorizontal className="h-3 w-3 text-pink-400" />
                    <span>Mental Focus</span>
                  </label>
                  <input
                    type="text"
                    value={getVal('daily_focus', 'High')}
                    onChange={(e) => onCustomTextChange('daily_focus', e.target.value)}
                    className="w-full bg-[#121316] border border-gray-800 rounded p-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-sans"
                    placeholder="e.g. Laser-Sharp"
                  />
                </div>
              </div>

              <div className="space-y-1.5 pt-2">
                <label className="text-[10px] text-gray-400 font-bold uppercase block">Daily Focus Mission Statement</label>
                <textarea
                  value={getVal('daily_mission', 'Finalize functional database architecture and deploy to secure staging platform.')}
                  onChange={(e) => onCustomTextChange('daily_mission', e.target.value)}
                  className="w-full h-24 bg-[#121316] border border-gray-800 rounded p-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder-gray-700 resize-none font-sans leading-relaxed"
                  placeholder="Detail your primary core mission for today..."
                />
              </div>
            </div>
          </div>
        )}

        {todayTab === 'schedule' && (
          <div className="space-y-4 animate-fade-in">
            <div className="bg-[#151619] p-4 rounded-xl border border-gray-850 space-y-3.5">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold text-emerald-400 tracking-wider uppercase flex items-center space-x-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  <span>Operational Daily Schedule</span>
                </h3>
                <button
                  onClick={() => {
                    if (!onStateChange) return;
                    onStateChange({
                      ...state,
                      dailyTasks: [
                        { time: '05:00 - 06:00', text: 'Morning Liturgy & Visual Alignment Sprints' },
                        { time: '06:00 - 08:30', text: 'Deep Focus Coding Blocks & API Staging Runs' },
                        { time: '08:30 - 09:30', text: 'Administrative Triage & Email Sync Sprints' },
                        { time: '11:00 - 12:30', text: 'Strategic Pipeline Audits & Client Pitch Runs' },
                        { time: '14:30 - 15:30', text: 'Mentorship Coaching Blocks & System Reviews' },
                        { time: '21:00 - 22:00', text: 'Evening Decouple Sprints & Sleep Hygiene Cycles' }
                      ]
                    });
                  }}
                  className="text-[9px] font-bold text-gray-500 hover:text-gray-300 transition"
                >
                  Reset Defaults
                </button>
              </div>
              <p className="text-[11px] text-gray-400">Map out your day hour-by-hour. These blocks are synchronized dynamically into the primary Daily Command Center timeline visualization.</p>

              <div className="space-y-2.5 pt-1">
                {(state.dailyTasks || []).map((task, idx) => (
                  <div key={idx} className="flex items-center space-x-2 bg-[#121316] p-2 rounded-lg border border-gray-850 animate-fade-in group">
                    <input
                      type="text"
                      value={task.time}
                      onChange={(e) => {
                        if (!onStateChange) return;
                        const updated = [...state.dailyTasks];
                        updated[idx] = { ...updated[idx], time: e.target.value };
                        onStateChange({ ...state, dailyTasks: updated });
                      }}
                      className="w-[110px] bg-[#1A1C20] border border-gray-800 rounded p-1.5 text-[11px] font-mono font-bold text-indigo-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-center"
                      placeholder="08:00 - 09:00"
                    />
                    <input
                      type="text"
                      value={task.text}
                      onChange={(e) => {
                        if (!onStateChange) return;
                        const updated = [...state.dailyTasks];
                        updated[idx] = { ...updated[idx], text: e.target.value };
                        onStateChange({ ...state, dailyTasks: updated });
                      }}
                      className="flex-1 bg-[#1A1C20] border border-gray-800 rounded p-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-sans"
                      placeholder="Detail what you plan to accomplish..."
                    />
                    <button
                      onClick={() => {
                        if (!onStateChange) return;
                        const updated = state.dailyTasks.filter((_, i) => i !== idx);
                        onStateChange({ ...state, dailyTasks: updated });
                      }}
                      className="p-1.5 text-gray-500 hover:text-red-400 rounded transition opacity-0 group-hover:opacity-100"
                      title="Remove Block"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}

                <button
                  onClick={() => {
                    if (!onStateChange) return;
                    onStateChange({
                      ...state,
                      dailyTasks: [...(state.dailyTasks || []), { time: '17:00 - 18:00', text: 'Strategic Execution Session' }]
                    });
                  }}
                  className="w-full py-2 bg-gray-900 hover:bg-[#1A1C20] border border-dashed border-gray-800 rounded-lg text-xs font-bold text-indigo-400 hover:text-indigo-300 transition flex items-center justify-center space-x-1.5"
                >
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span>Add Operational Time Block</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {todayTab === 'tasks' && (
          <div className="space-y-4 animate-fade-in">
            <div className="bg-[#151619] p-4 rounded-xl border border-gray-850 space-y-3.5">
              <h3 className="text-xs font-bold text-amber-400 tracking-wider uppercase flex items-center space-x-1.5">
                <CheckSquare className="h-3.5 w-3.5" />
                <span>Critical Daily Actions</span>
              </h3>
              <p className="text-[11px] text-gray-400">Establish and execute your 3 top non-negotiable critical actions for today to maintain peak strategic momentum.</p>

              <div className="space-y-3.5 pt-2">
                {[1, 2, 3].map((num) => {
                  const isDone = getVal(`daily_act_${num}_done`, 'false') === 'true';
                  return (
                    <div key={num} className="bg-[#121316] p-3 rounded-lg border border-gray-850 flex items-start space-x-3">
                      <button
                        onClick={() => {
                          onCustomTextChange(`daily_act_${num}_done`, isDone ? 'false' : 'true');
                        }}
                        className={`mt-1 h-4.5 w-4.5 rounded border flex items-center justify-center transition shrink-0 ${
                          isDone 
                            ? 'bg-emerald-600 border-emerald-500 text-white' 
                            : 'bg-gray-900 border-gray-800 text-transparent hover:border-indigo-500'
                        }`}
                      >
                        {isDone && <Check className="h-3 w-3 stroke-[3]" />}
                      </button>
                      <div className="flex-1 space-y-1.5">
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] font-mono font-bold text-gray-500">CRITICAL ACTION 0{num}</span>
                          <span className={`text-[9.5px] font-bold font-sans px-2 py-0.5 rounded ${
                            isDone ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/40' : 'bg-[#1C1E22] text-amber-400 border border-amber-900/20'
                          }`}>
                            {isDone ? 'COMPLETED' : 'PENDING'}
                          </span>
                        </div>
                        <input
                          type="text"
                          value={getVal(`daily_act_${num}`, num === 1 ? 'Execute Database Dry Runs' : num === 2 ? 'Complete Team Standup Loop' : 'Update Budget Pipeline Tracker')}
                          onChange={(e) => onCustomTextChange(`daily_act_${num}`, e.target.value)}
                          className={`w-full bg-[#1A1C20] border border-gray-800 rounded p-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-sans ${
                            isDone ? 'line-through text-gray-500' : ''
                          }`}
                          placeholder={`Detail critical action ${num}...`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {todayTab === 'blocking' && (
          <div className="space-y-4 animate-fade-in">
            <div className="bg-[#151619] p-4 rounded-xl border border-gray-850 space-y-3.5">
              <h3 className="text-xs font-bold text-indigo-400 tracking-wider uppercase flex items-center space-x-1.5">
                <SlidersHorizontal className="h-3.5 w-3.5" />
                <span>Today's Time Blocking Strategy</span>
              </h3>
              <p className="text-[11px] text-gray-400">Distribute your hours across strategic priorities to maintain visual balance and keep execution highly optimized.</p>

              <div className="bg-[#121316] p-4 rounded-xl border border-gray-850 space-y-4">
                <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider block border-b border-gray-850 pb-1 font-sans">Visual Timeline Block Assignments</span>
                <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-bold text-gray-400">
                  <div className="p-2 rounded bg-indigo-950/20 text-indigo-300 border border-indigo-900/30">
                    <span className="block text-white font-mono font-bold">Deep Work</span>
                    <span className="text-[9px] font-medium block mt-1">4.5 Hours</span>
                  </div>
                  <div className="p-2 rounded bg-emerald-950/20 text-emerald-300 border border-emerald-900/30">
                    <span className="block text-white font-mono font-bold">Meetings</span>
                    <span className="text-[9px] font-medium block mt-1">2.0 Hours</span>
                  </div>
                  <div className="p-2 rounded bg-amber-950/20 text-amber-300 border border-amber-900/30">
                    <span className="block text-white font-mono font-bold">Admin</span>
                    <span className="text-[9px] font-medium block mt-1">1.5 Hours</span>
                  </div>
                  <div className="p-2 rounded bg-pink-950/20 text-pink-300 border border-pink-900/30">
                    <span className="block text-white font-mono font-bold">Strategy</span>
                    <span className="text-[9px] font-medium block mt-1">2.0 Hours</span>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <span className="text-[9.5px] text-gray-500 font-bold uppercase tracking-wider block font-mono">Hourly Strategy Allocation</span>
                  <div className="space-y-1.5">
                    {[
                      { hour: '05:00 - 08:30', name: 'Strategic Alignment Sprints', cat: 'Deep Work' },
                      { hour: '08:30 - 10:30', name: 'Standup Meetings & Code Reviews', cat: 'Meetings' },
                      { hour: '11:00 - 12:30', name: getVal('daily_act_1', 'Database Architecture Setup'), cat: 'Strategy' },
                      { hour: '14:30 - 15:30', name: 'Administrative Sync & Triage', cat: 'Admin' }
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs p-2 rounded bg-[#18191D] border border-gray-850">
                        <div className="flex items-center space-x-2.5">
                          <span className="font-mono text-[10px] text-indigo-400">{item.hour}</span>
                          <span className="font-medium text-gray-300">{item.name}</span>
                        </div>
                        <span className={`text-[8.5px] font-bold px-2 py-0.5 rounded ${
                          item.cat === 'Deep Work' ? 'bg-indigo-950/50 text-indigo-400' :
                          item.cat === 'Meetings' ? 'bg-emerald-950/50 text-emerald-400' :
                          item.cat === 'Admin' ? 'bg-amber-950/50 text-amber-400' :
                          'bg-pink-950/50 text-pink-400'
                        }`}>{item.cat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {todayTab === 'habits' && (
          <div className="space-y-4 animate-fade-in">
            <div className="bg-[#151619] p-4 rounded-xl border border-gray-850 space-y-3.5">
              <h3 className="text-xs font-bold text-emerald-400 tracking-wider uppercase flex items-center space-x-1.5">
                <Settings className="h-3.5 w-3.5" />
                <span>Daily Habit Execution</span>
              </h3>
              <p className="text-[11px] text-gray-400">Perform and register your daily micro-habits to reinforce physical discipline and long-term habits automation.</p>

              <div className="space-y-2.5 pt-1">
                {[
                  { key: 'daily_habit_hydration', label: '100% Core Hydration (3 Liters)', desc: 'Hydration index tracking' },
                  { key: 'daily_habit_no_sugar', label: 'Zero Refined Sugars / Clean Nutrition', desc: 'Metabolic focus health' },
                  { key: 'daily_habit_cardio', label: '45 Mins Cardio / Aerobic Lung Burn', desc: 'Cardiovascular optimization' },
                  { key: 'daily_habit_writing', label: '60 Mins Technical Journal Sprints', desc: 'Intellectual synthesis habit' }
                ].map((item) => {
                  const isDone = getVal(item.key, 'false') === 'true';
                  return (
                    <button
                      key={item.key}
                      onClick={() => onCustomTextChange(item.key, isDone ? 'false' : 'true')}
                      className={`w-full p-3 rounded-lg border text-left transition flex items-center justify-between ${
                        isDone 
                          ? 'bg-emerald-950/20 border-emerald-900/50 text-emerald-300' 
                          : 'bg-[#121316] border-gray-850 text-gray-400 hover:border-gray-800'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`h-4.5 w-4.5 rounded border flex items-center justify-center transition ${
                          isDone 
                            ? 'bg-emerald-600 border-emerald-500 text-white' 
                            : 'bg-gray-900 border-gray-800 text-transparent'
                        }`}>
                          {isDone && <Check className="h-3 w-3 stroke-[3]" />}
                        </div>
                        <div>
                          <span className={`text-xs font-bold font-sans block ${isDone ? 'text-white' : 'text-gray-300'}`}>{item.label}</span>
                          <span className="text-[10px] text-gray-500 mt-0.5 block font-mono uppercase">{item.desc}</span>
                        </div>
                      </div>
                      <span className={`text-[9.5px] font-bold px-2 py-0.5 rounded ${
                        isDone ? 'bg-emerald-900/40 text-emerald-400' : 'bg-gray-900 text-gray-500'
                      }`}>
                        {isDone ? 'REGISTERED' : 'UNCHECKED'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {todayTab === 'notes' && (
          <div className="space-y-4 animate-fade-in">
            <div className="bg-[#151619] p-4 rounded-xl border border-gray-850 space-y-3.5">
              <h3 className="text-xs font-bold text-indigo-400 tracking-wider uppercase flex items-center space-x-1.5">
                <FileText className="h-3.5 w-3.5" />
                <span>Today's Scrapbook Notes</span>
              </h3>
              <p className="text-[11px] text-gray-400">Capture unstructured brainstorms, code structures, meeting takeaways, or general mental scrapbooks for today.</p>

              <div className="space-y-1.5 pt-1">
                <textarea
                  value={getVal('daily_notes', 'Note: Finalize D3 chart bounds on year workspace, handle scale bounds. Optimize SQL transaction isolation indices for project audits. Staging tests are looking stable.')}
                  onChange={(e) => onCustomTextChange('daily_notes', e.target.value)}
                  className="w-full h-80 bg-[#121316] border border-gray-800 rounded p-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder-gray-700 resize-none font-sans leading-relaxed"
                  placeholder="Type today's unstructured notes or ideas..."
                />
              </div>
            </div>
          </div>
        )}

        {todayTab === 'reflection' && (
          <div className="space-y-4 animate-fade-in">
            <div className="bg-[#151619] p-4 rounded-xl border border-gray-850 space-y-3.5">
              <h3 className="text-xs font-bold text-indigo-400 tracking-wider uppercase flex items-center space-x-1.5">
                <Smile className="h-3.5 w-3.5" />
                <span>Daily Reflection & Performance</span>
              </h3>
              <p className="text-[11px] text-gray-400">Document your morning gratitude, log evening reflections/learnings, and grade today's execution completion score.</p>

              <div className="space-y-3.5 pt-1">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-gray-400 font-bold uppercase block">1. Morning Gratitude (Mental Priming)</label>
                  <textarea
                    value={getVal('daily_gratitude', 'Grateful for pristine mental clarity, robust local execution tooling, and seamless workspace design frameworks.')}
                    onChange={(e) => onCustomTextChange('daily_gratitude', e.target.value)}
                    className="w-full h-20 bg-[#121316] border border-gray-800 rounded p-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder-gray-700 resize-none font-sans leading-relaxed"
                    placeholder="What are you grateful for this morning?"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-gray-400 font-bold uppercase block">2. Evening Learnings & Reflections</label>
                  <textarea
                    value={getVal('daily_b_learnings', 'Consistently pacing strategic sprints with focus-blocking yields significantly reduced friction. Hydration was optimal.')}
                    onChange={(e) => onCustomTextChange('daily_b_learnings', e.target.value)}
                    className="w-full h-20 bg-[#121316] border border-gray-800 rounded p-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder-gray-700 resize-none font-sans leading-relaxed"
                    placeholder="Detail your key takeaways and retrospective reflections from today..."
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-gray-400 font-bold uppercase block">3. Performance Completion Score</label>
                  <div className="flex items-center space-x-3">
                    <select
                      value={getVal('daily_completion_score', '85%')}
                      onChange={(e) => onCustomTextChange('daily_completion_score', e.target.value)}
                      className="bg-[#121316] border border-gray-800 rounded p-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-sans"
                    >
                      {['50%', '55%', '60%', '65%', '70%', '75%', '80%', '85%', '90%', '95%', '100%'].map((score) => (
                        <option key={score} value={score}>{score}</option>
                      ))}
                    </select>
                    <span className="text-[11px] text-gray-400 leading-normal">This score represents your combined task completion, habit checkoff, and timeline efficiency today.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
