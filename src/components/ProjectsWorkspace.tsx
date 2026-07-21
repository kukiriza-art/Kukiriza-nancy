import React from 'react';
import { PageConfig, PlannerState } from '../types';
import { 
  ChevronRight, 
  PlusCircle, 
  Plus, 
  Trash2, 
  Compass, 
  Target, 
  CheckSquare, 
  Award, 
  FileText, 
  Paperclip, 
  Calendar as CalendarIcon, 
  Activity, 
  Smile, 
  ArrowLeft, 
  Search, 
  Check 
} from 'lucide-react';

interface ProjectsWorkspaceProps {
  selectedProjectId: number | null;
  setSelectedProjectId: React.Dispatch<React.SetStateAction<number | null>>;
  projectTab: 'overview' | 'objectives' | 'tasks' | 'milestones' | 'notes' | 'attachments' | 'timeline' | 'activity' | 'reviews';
  setProjectTab: React.Dispatch<React.SetStateAction<'overview' | 'objectives' | 'tasks' | 'milestones' | 'notes' | 'attachments' | 'timeline' | 'activity' | 'reviews'>>;
  projectFilter: 'all' | 'active' | 'completed' | 'archived';
  setProjectFilter: React.Dispatch<React.SetStateAction<'all' | 'active' | 'completed' | 'archived'>>;
  projectSearch: string;
  setProjectSearch: React.Dispatch<React.SetStateAction<string>>;
  state: PlannerState;
  onStateChange?: (updatedState: PlannerState) => void;
  customTexts: { [key: string]: string };
  onCustomTextChange: (key: string, value: string) => void;
  onPageSelect?: (pageId: number) => void;
  activePage: PageConfig;
  selectedDate: number;
}

export const ProjectsWorkspace: React.FC<ProjectsWorkspaceProps> = ({
  selectedProjectId,
  setSelectedProjectId,
  projectTab,
  setProjectTab,
  projectFilter,
  setProjectFilter,
  projectSearch,
  setProjectSearch,
  state,
  onStateChange,
  customTexts,
  onCustomTextChange,
  onPageSelect,
  activePage,
  selectedDate
}) => {
  const getVal = (key: string, fallback: string) => {
    return customTexts[key] !== undefined ? customTexts[key] : fallback;
  };

  return (
    <div className="flex flex-col space-y-4 animate-fade-in h-full">
      {/* Header Breadcrumbs */}
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
            onClick={() => onPageSelect?.(20)} 
            className="text-indigo-400 font-bold hover:text-white transition flex items-center space-x-1"
          >
            <span>💼 Projects</span>
          </button>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center space-x-2">
            {selectedProjectId !== null && (
              <button
                onClick={() => setSelectedProjectId(null)}
                className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg border border-gray-800 transition"
                title="Back to Projects List"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
              </button>
            )}
            <div>
              <span className="text-[9px] font-bold text-indigo-400 tracking-widest uppercase block mb-0.5">Central Portfolio Hub</span>
              <h2 className="text-white text-base font-bold font-sans tracking-tight leading-none">
                {selectedProjectId !== null ? `Workspace: ${state.projects[selectedProjectId]?.name}` : 'Annual Projects Portfolio'}
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onPageSelect?.(20)}
              className={`px-2.5 py-1 text-[10px] font-bold rounded border ${
                activePage.id === 20 
                  ? 'bg-indigo-600/15 border-indigo-500/30 text-indigo-300' 
                  : 'bg-transparent border-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              Portfolio Map
            </button>
            <button
              onClick={() => onPageSelect?.(21)}
              className={`px-2.5 py-1 text-[10px] font-bold rounded border ${
                activePage.id === 21 
                  ? 'bg-indigo-600/15 border-indigo-500/30 text-indigo-300' 
                  : 'bg-transparent border-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              Lessons Audit
            </button>
          </div>
        </div>
      </div>

      {/* MAIN PORTFOLIO DASHBOARD (LIST VIEW) */}
      {selectedProjectId === null ? (
        <div className="space-y-4 flex-1 overflow-y-auto pr-1">
          {/* Visual Stats Overview */}
          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="bg-[#151619] p-2 rounded-xl border border-gray-850">
              <span className="text-[8px] font-bold text-gray-500 block">ACTIVE</span>
              <span className="text-sm font-sans font-extrabold text-white mt-0.5 block">
                {(state.projects || []).filter(p => p.status === 'In Progress').length}
              </span>
            </div>
            <div className="bg-[#151619] p-2 rounded-xl border border-gray-850">
              <span className="text-[8px] font-bold text-gray-500 block">COMPLETED</span>
              <span className="text-sm font-sans font-extrabold text-emerald-400 mt-0.5 block">
                {(state.projects || []).filter(p => p.status === 'Completed').length}
              </span>
            </div>
            <div className="bg-[#151619] p-2 rounded-xl border border-gray-850">
              <span className="text-[8px] font-bold text-gray-500 block">ARCHIVED</span>
              <span className="text-sm font-sans font-extrabold text-gray-400 mt-0.5 block">
                {(state.projects || []).filter(p => p.status === 'Archived' || p.status === 'Delayed').length}
              </span>
            </div>
            <div className="bg-[#151619] p-2 rounded-xl border border-gray-850">
              <span className="text-[8px] font-bold text-gray-500 block">SUCCESS RATE</span>
              <span className="text-sm font-mono font-extrabold text-indigo-300 mt-0.5 block">
                {state.projects && state.projects.length > 0 
                  ? `${Math.round(state.projects.reduce((sum, p) => sum + p.pct, 0) / state.projects.length)}%` 
                  : '0%'}
              </span>
            </div>
          </div>

          {/* Search and Filter Panel */}
          <div className="bg-[#151619] p-3 rounded-xl border border-gray-850 flex items-center justify-between space-x-3">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-gray-500" />
              <input
                type="text"
                value={projectSearch}
                onChange={(e) => setProjectSearch(e.target.value)}
                placeholder="Search central projects..."
                className="w-full bg-[#121316] border border-gray-800 rounded-lg pl-8 pr-2 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-sans"
              />
            </div>
            <div className="flex bg-[#121316] p-1 rounded-lg border border-gray-800 shrink-0">
              {(['all', 'active', 'completed', 'archived'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setProjectFilter(filter)}
                  className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-md transition ${
                    projectFilter === filter 
                      ? 'bg-indigo-600/20 text-indigo-300' 
                      : 'text-gray-500 hover:text-white'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Unlimited Project Creator Panel */}
          <div className="bg-[#151619] p-4 rounded-xl border border-indigo-500/10 space-y-3.5">
            <h3 className="text-xs font-bold text-indigo-400 tracking-wider uppercase flex items-center space-x-1.5">
              <PlusCircle className="h-3.5 w-3.5" />
              <span>Initiate Strategic New Project</span>
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const nameInput = form.elements.namedItem('pName') as HTMLInputElement;
                const dueInput = form.elements.namedItem('pDue') as HTMLInputElement;
                if (!nameInput.value.trim() || !onStateChange) return;

                const newProj = {
                  name: nameInput.value.trim(),
                  status: 'In Progress',
                  due: dueInput.value.trim() || 'Ongoing',
                  pct: 0,
                  description: 'Enter targeted strategic description parameters...',
                  objectives: ['Define primary targeted operational milestone', 'Optimize structural system loops'],
                  tasks: [
                    { id: 't1', text: 'Define project scope & objectives', done: false },
                    { id: 't2', text: 'Run initial technical dry runs', done: false }
                  ],
                  milestones: [{ id: 'm1', name: 'Scope Approval', due: 'Week 2', progress: 0 }],
                  notes: '',
                  attachments: [],
                  timeline: [{ id: 'tm1', phase: 'Planning & Scope', start: 'Jul 01', end: 'Jul 10', progress: 0 }]
                };

                onStateChange({
                  ...state,
                  projects: [...(state.projects || []), newProj]
                });
                nameInput.value = '';
                dueInput.value = '';
              }}
              className="grid grid-cols-3 gap-2.5 items-end"
            >
              <div className="col-span-2 space-y-1.5">
                <label className="text-[9px] text-gray-500 font-bold uppercase block">Project Title Name</label>
                <input
                  name="pName"
                  type="text"
                  required
                  placeholder="e.g. Monetization Engine"
                  className="w-full bg-[#121316] border border-gray-800 rounded p-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-sans"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] text-gray-500 font-bold uppercase block">Due / Target</label>
                <input
                  name="pDue"
                  type="text"
                  placeholder="e.g. Q3 End"
                  className="w-full bg-[#121316] border border-gray-800 rounded p-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-sans"
                />
              </div>
              <button
                type="submit"
                className="col-span-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg transition-all duration-200 mt-2 flex items-center justify-center space-x-1"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Initiate Project into Portfolio</span>
              </button>
            </form>
          </div>

          {/* Filtered Project Cards Grid */}
          <div className="space-y-3.5">
            {(state.projects || [])
              .map((p, idx) => ({ ...p, originalIndex: idx }))
              .filter((p) => {
                const matchesSearch = p.name.toLowerCase().includes(projectSearch.toLowerCase());
                if (!matchesSearch) return false;
                if (projectFilter === 'active') return p.status === 'In Progress';
                if (projectFilter === 'completed') return p.status === 'Completed';
                if (projectFilter === 'archived') return p.status === 'Archived' || p.status === 'Delayed';
                return true;
              })
              .map((proj) => {
                return (
                  <div
                    key={proj.originalIndex}
                    className="bg-[#151619] p-4 rounded-xl border border-gray-850 hover:border-indigo-500/20 transition duration-200 flex flex-col justify-between space-y-4"
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className={`text-[8.5px] font-bold uppercase px-2 py-0.5 rounded ${
                            proj.status === 'Completed' ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/40' :
                            proj.status === 'Archived' ? 'bg-gray-950 text-gray-400' :
                            'bg-indigo-950/40 text-indigo-400 border border-indigo-900/40'
                          }`}>{proj.status}</span>
                          <span className="text-[9.5px] font-mono text-gray-500">DUE: {proj.due}</span>
                        </div>
                        <h4 className="text-white text-sm font-bold font-sans mt-1">{proj.name}</h4>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setSelectedProjectId(proj.originalIndex)}
                          className="px-2.5 py-1 bg-[#1A1C20] hover:bg-indigo-600 text-gray-300 hover:text-white border border-gray-800 hover:border-transparent text-[10.5px] font-bold rounded-lg transition"
                        >
                          Open Workspace
                        </button>
                        <button
                          onClick={() => {
                            if (!onStateChange) return;
                            const updated = state.projects.filter((_, i) => i !== proj.originalIndex);
                            onStateChange({ ...state, projects: updated });
                          }}
                          className="p-1.5 text-gray-500 hover:text-red-400 rounded transition"
                          title="Delete Project"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="text-gray-400 font-bold uppercase">EXECUTION PROGRESS</span>
                        <span className="font-mono text-white font-bold">{proj.pct}%</span>
                      </div>
                      <div className="w-full bg-gray-900 h-2 rounded-full overflow-hidden border border-gray-800">
                        <div 
                          className={`h-full transition-all duration-300 ${
                            proj.status === 'Completed' ? 'bg-emerald-500' : 'bg-indigo-500'
                          }`}
                          style={{ width: `${proj.pct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      ) : (
        /* DEDICATED PROJECT WORKSPACE */
        (() => {
          const project = state.projects[selectedProjectId];
          if (!project) {
            setSelectedProjectId(null);
            return null;
          }

          // Pre-fill missing schema structures
          const desc = project.description || 'Enter targeted strategic description parameters...';
          const valueProp = (project as any).valueProposition || 'Outline the high-level core value proposition for this strategic asset...';
          const pObjectives = project.objectives || ['Define targeted primary operational milestone', 'Optimize structural system loops'];
          const pTasks = project.tasks || [];
          const pMilestones = project.milestones || [];
          const pNotes = project.notes || '';
          const pAttachments = (project as any).attachments || [];
          const pTimeline = (project as any).timeline || [];
          const pActivity = (project as any).activity || [{ id: 'a1', text: 'Project initialized inside planner portfolio.', date: 'July 4' }];

          const updateProjectField = (key: string, value: any) => {
            if (!onStateChange) return;
            const updated = [...state.projects];
            updated[selectedProjectId] = {
              ...updated[selectedProjectId],
              [key]: value
            };
            onStateChange({ ...state, projects: updated });
          };

          return (
            <div className="flex flex-col space-y-4 flex-1 overflow-hidden h-full">
              {/* Dedicated Tab Switcher */}
              <div className="flex items-center space-x-1 bg-[#151619] p-1 rounded-lg border border-gray-850 shrink-0 overflow-x-auto custom-scrollbar whitespace-nowrap scrollbar-none animate-fade-in">
                {[
                  { id: 'overview', label: 'Overview', icon: Compass },
                  { id: 'objectives', label: 'Objectives', icon: Target },
                  { id: 'tasks', label: 'Checklist Tasks', icon: CheckSquare },
                  { id: 'milestones', label: 'Milestones', icon: Award },
                  { id: 'notes', label: 'Notes log', icon: FileText },
                  { id: 'attachments', label: 'Resources', icon: Paperclip },
                  { id: 'timeline', label: 'Timeline Map', icon: CalendarIcon },
                  { id: 'activity', label: 'Activity log', icon: Activity },
                  { id: 'reviews', label: 'Audit Review', icon: Smile }
                ].map((tab) => {
                  const TabIcon = tab.icon;
                  const isActive = projectTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setProjectTab(tab.id as any)}
                      className={`px-2.5 py-1.5 rounded-md text-[10.5px] font-bold uppercase tracking-wider flex items-center space-x-1.5 transition ${
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

              {/* Dedicated Sub-Tab Contents */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                {projectTab === 'overview' && (
                  <div className="bg-[#151619] p-4 rounded-xl border border-gray-850 space-y-3.5 animate-fade-in">
                    <h3 className="text-xs font-bold text-indigo-400 tracking-wider uppercase">Project Details & Identification</h3>

                    <div className="grid grid-cols-2 gap-3.5">
                      <div className="space-y-1.5">
                        <label className="text-[10px] text-gray-500 font-bold uppercase block">Project Title Name</label>
                        <input
                          type="text"
                          value={project.name}
                          onChange={(e) => updateProjectField('name', e.target.value)}
                          className="w-full bg-[#121316] border border-gray-800 rounded p-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-sans"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] text-gray-500 font-bold uppercase block">Timeline Due Date</label>
                        <input
                          type="text"
                          value={project.due}
                          onChange={(e) => updateProjectField('due', e.target.value)}
                          className="w-full bg-[#121316] border border-gray-800 rounded p-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-sans"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] text-gray-500 font-bold uppercase block">Portfolio Status Badge</label>
                        <select
                          value={project.status}
                          onChange={(e) => updateProjectField('status', e.target.value)}
                          className="w-full bg-[#121316] border border-gray-800 rounded p-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-sans"
                        >
                          {['In Progress', 'Completed', 'Blocked', 'Archived', 'Delayed'].map((st) => (
                            <option key={st} value={st}>{st}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                          <label className="text-[10px] text-gray-500 font-bold uppercase block">Completion Ratio</label>
                          <span className="text-[10.5px] font-mono text-indigo-400 font-bold">{project.pct}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={project.pct}
                          onChange={(e) => updateProjectField('pct', parseInt(e.target.value))}
                          className="w-full h-2 bg-gray-900 rounded-lg appearance-none cursor-pointer accent-indigo-500 mt-2.5"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5 pt-1">
                      <label className="text-[10px] text-gray-500 font-bold uppercase block">Core Strategic Description</label>
                      <textarea
                        value={desc}
                        onChange={(e) => updateProjectField('description', e.target.value)}
                        className="w-full h-20 bg-[#121316] border border-gray-800 rounded p-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder-gray-700 resize-none font-sans leading-relaxed"
                        placeholder="Describe the high-level parameters..."
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] text-gray-500 font-bold uppercase block">High-Level Value Proposition</label>
                      <textarea
                        value={valueProp}
                        onChange={(e) => updateProjectField('valueProposition', e.target.value)}
                        className="w-full h-20 bg-[#121316] border border-gray-800 rounded p-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder-gray-700 resize-none font-sans leading-relaxed"
                        placeholder="What business value does this project unlock..."
                      />
                    </div>
                  </div>
                )}

                {projectTab === 'objectives' && (
                  <div className="bg-[#151619] p-4 rounded-xl border border-gray-850 space-y-3.5 animate-fade-in">
                    <h3 className="text-xs font-bold text-indigo-400 tracking-wider uppercase">Strategic Business Objectives</h3>
                    <p className="text-[11px] text-gray-400">Add targeted primary objectives mapping this project to high-level annual vision metrics.</p>

                    <div className="space-y-2 pt-1">
                      {pObjectives.map((obj: string, i: number) => (
                        <div key={i} className="flex items-center space-x-2 bg-[#121316] p-2.5 rounded-lg border border-gray-850 group">
                          <Target className="h-4 w-4 text-indigo-400 shrink-0" />
                          <input
                            type="text"
                            value={obj}
                            onChange={(e) => {
                              const updated = [...pObjectives];
                              updated[i] = e.target.value;
                              updateProjectField('objectives', updated);
                            }}
                            className="flex-1 bg-[#1A1C20] border border-gray-800 rounded p-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-sans"
                          />
                          <button
                            onClick={() => {
                              const updated = pObjectives.filter((_, idx) => idx !== i);
                              updateProjectField('objectives', updated);
                            }}
                            className="p-1.5 text-gray-500 hover:text-red-400 transition opacity-0 group-hover:opacity-100"
                            title="Delete Objective"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}

                      <button
                        onClick={() => {
                          updateProjectField('objectives', [...pObjectives, 'New Strategic Objective Parameter']);
                        }}
                        className="w-full py-2 bg-gray-900 hover:bg-[#1A1C20] border border-dashed border-gray-800 rounded-lg text-xs font-bold text-indigo-400 transition flex items-center justify-center space-x-1"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Add Objective Alignment</span>
                      </button>
                    </div>
                  </div>
                )}

                {projectTab === 'tasks' && (
                  <div className="bg-[#151619] p-4 rounded-xl border border-gray-850 space-y-3.5 animate-fade-in">
                    <h3 className="text-xs font-bold text-indigo-400 tracking-wider uppercase flex items-center justify-between">
                      <span>Checklist Operations & Progress Sync</span>
                      <span className="text-[10px] font-mono text-gray-500">Auto-calculates Completion Ratio</span>
                    </h3>
                    <p className="text-[11px] text-gray-400">Manage individual operations. Completing checklist tasks automatically updates the project's overall completion progress slider!</p>

                    <div className="space-y-2 pt-1">
                      {pTasks.map((task: any, i: number) => (
                        <div key={task.id || i} className="flex items-center space-x-3 bg-[#121316] p-2.5 rounded-lg border border-gray-850 group">
                          <button
                            onClick={() => {
                              const updated = [...pTasks];
                              updated[i] = { ...updated[i], done: !updated[i].done };
                              
                              // Calculate updated dynamic progress
                              const total = updated.length;
                              const completed = updated.filter(t => t.done).length;
                              const newPct = total > 0 ? Math.round((completed / total) * 100) : 0;

                              if (!onStateChange) return;
                              const updatedProjects = [...state.projects];
                              updatedProjects[selectedProjectId] = {
                                ...updatedProjects[selectedProjectId],
                                tasks: updated,
                                pct: newPct
                              };
                              onStateChange({ ...state, projects: updatedProjects });
                            }}
                            className={`h-4.5 w-4.5 rounded border flex items-center justify-center transition ${
                              task.done 
                                ? 'bg-emerald-600 border-emerald-500 text-white' 
                                : 'bg-gray-900 border-gray-800 text-transparent hover:border-indigo-500'
                            }`}
                          >
                            {task.done && <Check className="h-3 w-3 stroke-[3]" />}
                          </button>
                          <input
                            type="text"
                            value={task.text}
                            onChange={(e) => {
                              const updated = [...pTasks];
                              updated[i] = { ...updated[i], text: e.target.value };
                              updateProjectField('tasks', updated);
                            }}
                            className={`flex-1 bg-[#1A1C20] border border-gray-800 rounded p-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-sans ${
                              task.done ? 'line-through text-gray-500' : ''
                            }`}
                          />
                          <button
                            onClick={() => {
                              const updated = pTasks.filter((_, idx: number) => idx !== i);
                              const total = updated.length;
                              const completed = updated.filter(t => t.done).length;
                              const newPct = total > 0 ? Math.round((completed / total) * 100) : 0;

                              if (!onStateChange) return;
                              const updatedProjects = [...state.projects];
                              updatedProjects[selectedProjectId] = {
                                ...updatedProjects[selectedProjectId],
                                tasks: updated,
                                pct: newPct
                              };
                              onStateChange({ ...state, projects: updatedProjects });
                            }}
                            className="p-1.5 text-gray-500 hover:text-red-400 transition opacity-0 group-hover:opacity-100"
                            title="Delete Task"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}

                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          const form = e.currentTarget;
                          const input = form.elements.namedItem('tText') as HTMLInputElement;
                          if (!input.value.trim()) return;

                          const newTask = {
                            id: `t_${Date.now()}`,
                            text: input.value.trim(),
                            done: false
                          };
                          const updated = [...pTasks, newTask];

                          // Recalculate progress pct
                          const total = updated.length;
                          const completed = updated.filter(t => t.done).length;
                          const newPct = total > 0 ? Math.round((completed / total) * 100) : 0;

                          if (!onStateChange) return;
                          const updatedProjects = [...state.projects];
                          updatedProjects[selectedProjectId] = {
                            ...updatedProjects[selectedProjectId],
                            tasks: updated,
                            pct: newPct
                          };
                          onStateChange({ ...state, projects: updatedProjects });
                          input.value = '';
                        }}
                        className="flex items-center space-x-2 bg-[#121316] p-2 rounded-lg border border-gray-850"
                      >
                        <input
                          name="tText"
                          type="text"
                          required
                          placeholder="Enter operation task..."
                          className="flex-1 bg-[#1A1C20] border border-gray-800 rounded p-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-sans"
                        />
                        <button
                          type="submit"
                          className="p-1.5 px-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded transition flex items-center space-x-1"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          <span>Add</span>
                        </button>
                      </form>
                    </div>
                  </div>
                )}

                {projectTab === 'milestones' && (
                  <div className="bg-[#151619] p-4 rounded-xl border border-gray-850 space-y-3.5 animate-fade-in">
                    <h3 className="text-xs font-bold text-indigo-400 tracking-wider uppercase">Strategic Milestones & Gates</h3>
                    <p className="text-[11px] text-gray-400">Map specific milestone targets with target timelines and individual progress sliders.</p>

                    <div className="space-y-3 pt-1">
                      {pMilestones.map((ms: any, i: number) => (
                        <div key={ms.id || i} className="bg-[#121316] p-3 rounded-lg border border-gray-850 space-y-2 group">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-2">
                              <Award className="h-4 w-4 text-amber-400" />
                              <input
                                type="text"
                                value={ms.name}
                                onChange={(e) => {
                                  const updated = [...pMilestones];
                                  updated[i] = { ...updated[i], name: e.target.value };
                                  updateProjectField('milestones', updated);
                                }}
                                className="bg-transparent border-none p-0 text-xs text-white focus:outline-none font-bold"
                              />
                            </div>
                            <div className="flex items-center space-x-2">
                              <input
                                type="text"
                                value={ms.due}
                                onChange={(e) => {
                                  const updated = [...pMilestones];
                                  updated[i] = { ...updated[i], due: e.target.value };
                                  updateProjectField('milestones', updated);
                                }}
                                className="bg-[#1A1C20] border border-gray-800 rounded px-1.5 py-0.5 text-[10px] font-mono text-gray-400 text-center w-18"
                              />
                              <button
                                onClick={() => {
                                  const updated = pMilestones.filter((_, idx: number) => idx !== i);
                                  updateProjectField('milestones', updated);
                                }}
                                className="text-gray-500 hover:text-red-400 p-0.5 transition"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>

                          <div className="flex items-center justify-between space-x-3 pt-1">
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={ms.progress || 0}
                              onChange={(e) => {
                                const updated = [...pMilestones];
                                updated[i] = { ...updated[i], progress: parseInt(e.target.value) };
                                updateProjectField('milestones', updated);
                              }}
                              className="flex-1 h-1 bg-gray-900 rounded appearance-none cursor-pointer accent-indigo-500"
                            />
                            <span className="font-mono text-[9px] font-bold text-gray-400 w-8 text-right">{(ms.progress || 0)}%</span>
                          </div>
                        </div>
                      ))}

                      <button
                        onClick={() => {
                          const newMs = { id: `m_${Date.now()}`, name: 'New Strategic Gate Milestone', due: 'Week 3', progress: 0 };
                          updateProjectField('milestones', [...pMilestones, newMs]);
                        }}
                        className="w-full py-2 bg-gray-900 hover:bg-[#1A1C20] border border-dashed border-gray-800 rounded-lg text-xs font-bold text-indigo-400 transition flex items-center justify-center space-x-1"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Add Project Milestone Gate</span>
                      </button>
                    </div>
                  </div>
                )}

                {projectTab === 'notes' && (
                  <div className="bg-[#151619] p-4 rounded-xl border border-gray-850 space-y-3.5 animate-fade-in">
                    <h3 className="text-xs font-bold text-indigo-400 tracking-wider uppercase">Project Brainstorms & Scrapbook</h3>
                    <p className="text-[11px] text-gray-400">Capture technical specs, integration guidelines, meeting takeaway points, and miscellaneous brain dumps specific to this project.</p>

                    <div className="pt-1">
                      <textarea
                        value={pNotes}
                        onChange={(e) => updateProjectField('notes', e.target.value)}
                        className="w-full h-80 bg-[#121316] border border-gray-800 rounded p-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder-gray-700 resize-none font-sans leading-relaxed"
                        placeholder="Type project-specific unstructured notes, schema drafts, or links..."
                      />
                    </div>
                  </div>
                )}

                {projectTab === 'attachments' && (
                  <div className="bg-[#151619] p-4 rounded-xl border border-gray-850 space-y-3.5 animate-fade-in">
                    <h3 className="text-xs font-bold text-indigo-400 tracking-wider uppercase">Project Resource & Reference Attachments</h3>
                    <p className="text-[11px] text-gray-400">Store active references, design specifications, file directories, or staging URLs for quick team or personal retrieval.</p>

                    <div className="space-y-3 pt-1">
                      {pAttachments.map((att: any, i: number) => (
                        <div key={att.id || i} className="flex items-center justify-between bg-[#121316] p-2.5 rounded-lg border border-gray-850 group">
                          <div className="flex items-center space-x-2">
                            <Paperclip className="h-4 w-4 text-indigo-400" />
                            <a
                              href={att.url}
                              target="_blank"
                              rel="noreferrer referrer"
                              className="text-xs font-bold text-gray-200 hover:text-indigo-300 hover:underline transition"
                            >
                              {att.name}
                            </a>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-[9px] font-mono text-gray-500 bg-[#1A1C20] border border-gray-800 px-1.5 py-0.5 rounded uppercase">LINK</span>
                            <button
                              onClick={() => {
                                const updated = pAttachments.filter((_: any, idx: number) => idx !== i);
                                updateProjectField('attachments', updated);
                              }}
                              className="text-gray-500 hover:text-red-400 p-1 transition opacity-0 group-hover:opacity-100"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}

                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          const form = e.currentTarget;
                          const nIn = form.elements.namedItem('attName') as HTMLInputElement;
                          const uIn = form.elements.namedItem('attUrl') as HTMLInputElement;
                          if (!nIn.value.trim()) return;

                          const newAtt = {
                            id: `att_${Date.now()}`,
                            name: nIn.value.trim(),
                            url: uIn.value.trim() || '#'
                          };
                          updateProjectField('attachments', [...pAttachments, newAtt]);
                          nIn.value = '';
                          uIn.value = '';
                        }}
                        className="grid grid-cols-2 gap-2 bg-[#121316] p-3 rounded-lg border border-gray-850"
                      >
                        <div className="space-y-1">
                          <label className="text-[9px] text-gray-500 font-bold uppercase block">Resource Title</label>
                          <input
                            name="attName"
                            type="text"
                            required
                            placeholder="e.g. Figma Designs Specs"
                            className="w-full bg-[#1A1C20] border border-gray-800 rounded p-1 text-xs text-white focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] text-gray-500 font-bold uppercase block">Resource URL</label>
                          <input
                            name="attUrl"
                            type="text"
                            placeholder="https://figma.com/..."
                            className="w-full bg-[#1A1C20] border border-gray-800 rounded p-1 text-xs text-white focus:outline-none"
                          />
                        </div>
                        <button
                          type="submit"
                          className="col-span-2 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded transition flex items-center justify-center space-x-1"
                        >
                          <Plus className="h-3 w-3" />
                          <span>Add Resource Reference Link</span>
                        </button>
                      </form>
                    </div>
                  </div>
                )}

                {projectTab === 'timeline' && (
                  <div className="bg-[#151619] p-4 rounded-xl border border-gray-850 space-y-3.5 animate-fade-in">
                    <h3 className="text-xs font-bold text-indigo-400 tracking-wider uppercase">Project Phase Gantt Timeline</h3>
                    <p className="text-[11px] text-gray-400">Align execution sequences step-by-step. Timeline coordinates synchronize into structural roadmaps.</p>

                    <div className="space-y-3.5 pt-1">
                      {pTimeline.map((item: any, i: number) => (
                        <div key={item.id || i} className="bg-[#121316] p-3 rounded-lg border border-gray-850 space-y-2 group">
                          <div className="flex justify-between items-center">
                            <input
                              type="text"
                              value={item.phase}
                              onChange={(e) => {
                                const updated = [...pTimeline];
                                updated[i] = { ...updated[i], phase: e.target.value };
                                updateProjectField('timeline', updated);
                              }}
                              className="bg-transparent border-none p-0 text-xs text-white focus:outline-none font-bold"
                            />
                            <button
                              onClick={() => {
                                const updated = pTimeline.filter((_: any, idx: number) => idx !== i);
                                updateProjectField('timeline', updated);
                              }}
                              className="text-gray-500 hover:text-red-400 p-1 transition opacity-0 group-hover:opacity-100"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-[10px]">
                            <div className="space-y-1">
                              <span className="text-gray-500 font-bold uppercase block">Start Date</span>
                              <input
                                type="text"
                                value={item.start}
                                onChange={(e) => {
                                  const updated = [...pTimeline];
                                  updated[i] = { ...updated[i], start: e.target.value };
                                  updateProjectField('timeline', updated);
                                }}
                                className="w-full bg-[#1A1C20] border border-gray-800 rounded p-1 text-white font-mono"
                              />
                            </div>
                            <div className="space-y-1">
                              <span className="text-gray-500 font-bold uppercase block">End Date</span>
                              <input
                                type="text"
                                value={item.end}
                                onChange={(e) => {
                                  const updated = [...pTimeline];
                                  updated[i] = { ...updated[i], end: e.target.value };
                                  updateProjectField('timeline', updated);
                                }}
                                className="w-full bg-[#1A1C20] border border-gray-800 rounded p-1 text-white font-mono"
                              />
                            </div>
                          </div>
                        </div>
                      ))}

                      <button
                        onClick={() => {
                          const newPhase = { id: `tm_${Date.now()}`, phase: 'New Sequential Phase Sprint', start: 'Jul 15', end: 'Jul 25', progress: 0 };
                          updateProjectField('timeline', [...pTimeline, newPhase]);
                        }}
                        className="w-full py-2 bg-gray-900 hover:bg-[#1A1C20] border border-dashed border-gray-800 rounded-lg text-xs font-bold text-indigo-400 transition flex items-center justify-center space-x-1"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Add Timeline Sequence Phase</span>
                      </button>
                    </div>
                  </div>
                )}

                {projectTab === 'activity' && (
                  <div className="bg-[#151619] p-4 rounded-xl border border-gray-850 space-y-3.5 animate-fade-in">
                    <h3 className="text-xs font-bold text-indigo-400 tracking-wider uppercase">Project Chronological Activity Log</h3>
                    <p className="text-[11px] text-gray-400">Keep a historical audit log of strategic status changes, client checkpoints, and technical deployments.</p>

                    <div className="space-y-3 pt-1">
                      {pActivity.map((act: any, i: number) => (
                        <div key={act.id || i} className="flex items-start space-x-3 text-xs bg-[#121316] p-2.5 rounded-lg border border-gray-850">
                          <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                          <div className="flex-1 space-y-0.5">
                            <p className="text-gray-200 font-sans leading-relaxed">{act.text}</p>
                            <span className="text-[9.5px] text-gray-500 font-mono block">{act.date}</span>
                          </div>
                        </div>
                      ))}

                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          const form = e.currentTarget;
                          const input = form.elements.namedItem('actText') as HTMLInputElement;
                          if (!input.value.trim()) return;

                          const newAct = {
                            id: `act_${Date.now()}`,
                            text: input.value.trim(),
                            date: `July ${selectedDate}`
                          };
                          updateProjectField('activity', [...pActivity, newAct]);
                          input.value = '';
                        }}
                        className="flex items-center space-x-2 bg-[#121316] p-2 rounded-lg border border-gray-850"
                      >
                        <input
                          name="actText"
                          type="text"
                          required
                          placeholder="Log strategic action..."
                          className="flex-1 bg-[#1A1C20] border border-gray-800 rounded p-1.5 text-xs text-white focus:outline-none"
                        />
                        <button
                          type="submit"
                          className="p-1.5 px-3 bg-[#1A1C20] hover:bg-gray-800 border border-gray-800 text-gray-300 font-bold text-xs rounded transition"
                        >
                          Log
                        </button>
                      </form>
                    </div>
                  </div>
                )}

                {projectTab === 'reviews' && (
                  <div className="bg-[#151619] p-4 rounded-xl border border-gray-850 space-y-3.5 animate-fade-in">
                    <h3 className="text-xs font-bold text-indigo-400 tracking-wider uppercase">Project Strategic Audits & Lessons</h3>
                    <p className="text-[11px] text-gray-400">Diagnose project blockages and establish high-fidelity action mitigations. These reviews sync directly with Page 21 Project Audit & Lessons!</p>

                    <div className="space-y-3.5 pt-1">
                      <div className="space-y-1.5">
                        <label className="text-[10px] text-gray-500 font-bold uppercase block">Root Cause Blockages Diagnosis</label>
                        <textarea
                          value={project.audit_blockades || getVal('audit_blockades_default', 'Technical Friction: Staging deployment delays due to complex API integration and state nesting bounds.')}
                          onChange={(e) => {
                            updateProjectField('audit_blockades', e.target.value);
                            // Sync back to root-level custom texts if needed
                            onCustomTextChange(`audit_${selectedProjectId}_blockades`, e.target.value);
                          }}
                          className="w-full h-24 bg-[#121316] border border-gray-800 rounded p-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder-gray-700 resize-none font-sans leading-relaxed"
                          placeholder="Diagnose project blockages or hurdles..."
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] text-gray-500 font-bold uppercase block">Structured Action Mitigations Plan</label>
                        <textarea
                          value={project.audit_mitigation || getVal('audit_mitigation_default', 'Action Loop: Establish automated integration triggers and consolidate custom text indices in shared schema mapping.')}
                          onChange={(e) => {
                            updateProjectField('audit_mitigation', e.target.value);
                            // Sync back to root-level custom texts if needed
                            onCustomTextChange(`audit_${selectedProjectId}_mitigation`, e.target.value);
                          }}
                          className="w-full h-24 bg-[#121316] border border-gray-800 rounded p-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder-gray-700 resize-none font-sans leading-relaxed"
                          placeholder="Detail step-by-step mitigation plans..."
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })()
      )}
    </div>
  );
};
