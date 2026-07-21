import React, { useState } from 'react';
import { PlannerState, Project, DailyTask, Goal } from '../types';
import { X, Plus, Check, Briefcase, Clock, Target, FileText, Heart } from 'lucide-react';

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: PlannerState;
  onStateChange: (updatedState: PlannerState) => void;
  onSuccess: (message: string) => void;
}

type QuickAddType = 'project' | 'task' | 'goal' | 'note' | 'habit';

export const QuickAddModal: React.FC<QuickAddModalProps> = ({
  isOpen,
  onClose,
  state,
  onStateChange,
  onSuccess
}) => {
  const [activeTab, setActiveTab] = useState<QuickAddType>('project');

  // Project Form State
  const [projectName, setProjectName] = useState('');
  const [projectStatus, setProjectStatus] = useState<'In Progress' | 'Planning' | 'Completed' | 'Blocked'>('In Progress');
  const [projectDue, setProjectDue] = useState('Q3 End');
  const [projectPct, setProjectPct] = useState(0);

  // Task Form State
  const [taskTime, setTaskTime] = useState('10:00 - 11:00');
  const [taskText, setTaskText] = useState('');

  // Goal Form State
  const [goalPillar, setGoalPillar] = useState('05');
  const [goalMilestone, setGoalMilestone] = useState('');
  const [goalProgress, setGoalProgress] = useState(0);

  // Note Form State
  const [noteContent, setNoteContent] = useState('');

  // Habit Form State
  const [habitName, setHabitName] = useState('');
  const [habitFrequency, setHabitFrequency] = useState('Daily');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextState = { ...state };

    if (activeTab === 'project') {
      if (!projectName.trim()) return;
      const newProject: Project = {
        name: projectName.trim(),
        status: projectStatus,
        due: projectDue.trim(),
        pct: projectPct
      };
      nextState.projects = [...nextState.projects, newProject];
      // Update projects count text too
      const currentActive = nextState.projects.filter(p => p.status === 'In Progress').length;
      nextState.customTexts['projects_stat_active'] = `${currentActive} Projects`;
      nextState.customTexts['projects_stat_completed'] = `${nextState.projects.filter(p => p.status === 'Completed').length} Projects`;
      
      onStateChange(nextState);
      onSuccess(`🚀 Project "${newProject.name}" added successfully!`);
      // Reset
      setProjectName('');
      setProjectPct(0);
    } 
    
    else if (activeTab === 'task') {
      if (!taskText.trim()) return;
      const newTask: DailyTask = {
        time: taskTime.trim(),
        text: taskText.trim()
      };
      nextState.dailyTasks = [...nextState.dailyTasks, newTask];
      onStateChange(nextState);
      onSuccess(`⚡ Task added to command center schedule!`);
      setTaskText('');
    } 
    
    else if (activeTab === 'goal') {
      if (!goalMilestone.trim()) return;
      const newGoal: Goal = {
        pillar: goalPillar,
        milestone: goalMilestone.trim(),
        progress: goalProgress
      };
      nextState.annualGoals = [...nextState.annualGoals, newGoal];
      onStateChange(nextState);
      onSuccess(`🎯 Goal added to Annual Vision pillars!`);
      setGoalMilestone('');
      setGoalProgress(0);
    } 
    
    else if (activeTab === 'note') {
      if (!noteContent.trim()) return;
      // Store in notes JSON list in customTexts
      const existingNotesStr = state.customTexts['quick_notes_list'] || '[]';
      let existingNotes: string[] = [];
      try {
        existingNotes = JSON.parse(existingNotesStr);
      } catch (err) {
        existingNotes = [];
      }
      existingNotes.push(noteContent.trim());
      nextState.customTexts['quick_notes_list'] = JSON.stringify(existingNotes);
      onStateChange(nextState);
      onSuccess(`📝 Note saved to workspace journal!`);
      setNoteContent('');
    } 
    
    else if (activeTab === 'habit') {
      if (!habitName.trim()) return;
      // Store in habits JSON list in customTexts
      const existingHabitsStr = state.customTexts['quick_habits_list'] || '[]';
      let existingHabits: Array<{ name: string; frequency: string; done: boolean }> = [];
      try {
        existingHabits = JSON.parse(existingHabitsStr);
      } catch (err) {
        existingHabits = [];
      }
      existingHabits.push({
        name: habitName.trim(),
        frequency: habitFrequency,
        done: false
      });
      nextState.customTexts['quick_habits_list'] = JSON.stringify(existingHabits);
      onStateChange(nextState);
      onSuccess(`🧘 Habit "${habitName.trim()}" set up!`);
      setHabitName('');
    }

    onClose();
  };

  const tabs: Array<{ id: QuickAddType; label: string; icon: React.ReactNode }> = [
    { id: 'project', label: 'Project', icon: <Briefcase className="h-3.5 w-3.5" /> },
    { id: 'task', label: 'Task', icon: <Clock className="h-3.5 w-3.5" /> },
    { id: 'goal', label: 'Goal', icon: <Target className="h-3.5 w-3.5" /> },
    { id: 'note', label: 'Note', icon: <FileText className="h-3.5 w-3.5" /> },
    { id: 'habit', label: 'Habit', icon: <Heart className="h-3.5 w-3.5" /> }
  ];

  return (
    <>
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 transition-opacity animate-in fade-in duration-200 no-print"
      />

      {/* Modal Card */}
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-[#1C1E22] border border-gray-800 rounded-xl shadow-2xl z-50 flex flex-col no-print animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="p-4 border-b border-gray-800 bg-[#22252A] flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2">
            <div className="bg-emerald-500/10 text-emerald-400 p-2 rounded-lg">
              <Plus className="h-4 w-4" />
            </div>
            <div>
              <span className="text-[9px] font-bold text-emerald-400 tracking-widest uppercase block">
                QUICK CREATION
              </span>
              <h3 className="text-white font-bold text-sm tracking-tight">
                Add to Operational Planner
              </h3>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-md hover:bg-gray-800/80 transition"
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="px-4 py-2 border-b border-gray-800 bg-[#151619] flex space-x-1 shrink-0 overflow-x-auto custom-scrollbar">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider rounded-md transition shrink-0 ${
                  isActive 
                    ? 'bg-emerald-600/10 text-emerald-400 border border-emerald-500/20' 
                    : 'text-gray-400 hover:text-white border border-transparent'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
          
          {/* 1. PROJECT TAB */}
          {activeTab === 'project' && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Project Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Q3 SaaS Deployment"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full bg-[#121316] border border-gray-800 rounded-lg py-2.5 px-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Status</label>
                  <select
                    value={projectStatus}
                    onChange={(e: any) => setProjectStatus(e.target.value)}
                    className="w-full bg-[#121316] border border-gray-800 rounded-lg py-2.5 px-3 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="In Progress">In Progress</option>
                    <option value="Planning">Planning</option>
                    <option value="Completed">Completed</option>
                    <option value="Blocked">Blocked</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Due Date / Phase</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dec 15"
                    value={projectDue}
                    onChange={(e) => setProjectDue(e.target.value)}
                    className="w-full bg-[#121316] border border-gray-800 rounded-lg py-2.5 px-3 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  <span>Completion Rate</span>
                  <span className="text-emerald-400 font-mono">{projectPct}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={projectPct}
                  onChange={(e) => setProjectPct(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* 2. TASK TAB */}
          {activeTab === 'task' && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Time Block</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 06:00 - 08:30"
                  value={taskTime}
                  onChange={(e) => setTaskTime(e.target.value)}
                  className="w-full bg-[#121316] border border-gray-800 rounded-lg py-2.5 px-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Action / Priority Details</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe your primary action item block..."
                  value={taskText}
                  onChange={(e) => setTaskText(e.target.value)}
                  className="w-full bg-[#121316] border border-gray-800 rounded-lg py-2.5 px-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>
            </div>
          )}

          {/* 3. GOAL TAB */}
          {activeTab === 'goal' && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1 space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Pillar Index</label>
                  <input
                    type="text"
                    required
                    placeholder="05"
                    value={goalPillar}
                    onChange={(e) => setGoalPillar(e.target.value)}
                    className="w-full bg-[#121316] border border-gray-800 rounded-lg py-2.5 px-3 text-xs text-white text-center focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="col-span-2 space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Category Hint</label>
                  <span className="text-[10px] text-gray-500 font-medium block pt-2.5">Annual Vision Target</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Milestone Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Complete Advanced System Architecture"
                  value={goalMilestone}
                  onChange={(e) => setGoalMilestone(e.target.value)}
                  className="w-full bg-[#121316] border border-gray-800 rounded-lg py-2.5 px-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  <span>Current Milestone Progress</span>
                  <span className="text-emerald-400 font-mono">{goalProgress}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={goalProgress}
                  onChange={(e) => setGoalProgress(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* 4. NOTE TAB */}
          {activeTab === 'note' && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Journal Note Entry</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Type an instant thought, lesson, or reminder to save to your personal notes cache..."
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  className="w-full bg-[#121316] border border-gray-800 rounded-lg py-2.5 px-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>
            </div>
          )}

          {/* 5. HABIT TAB */}
          {activeTab === 'habit' && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Habit Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Meditate 15 minutes, Cardio drill"
                  value={habitName}
                  onChange={(e) => setHabitName(e.target.value)}
                  className="w-full bg-[#121316] border border-gray-800 rounded-lg py-2.5 px-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Frequency Mode</label>
                <select
                  value={habitFrequency}
                  onChange={(e) => setHabitFrequency(e.target.value)}
                  className="w-full bg-[#121316] border border-gray-800 rounded-lg py-2.5 px-3 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Daily">Daily Protocol</option>
                  <option value="Weekly">Weekly Cycle</option>
                  <option value="Bi-Weekly">Bi-Weekly Review</option>
                  <option value="Monthly">Monthly Checkpoint</option>
                </select>
              </div>
            </div>
          )}

          {/* Footer Submit */}
          <div className="pt-4 border-t border-gray-800/60 flex space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white text-xs font-bold py-2.5 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2.5 rounded-lg transition flex items-center justify-center space-x-1"
            >
              <Check className="h-4 w-4" />
              <span>Confirm & Add</span>
            </button>
          </div>

        </form>

      </div>
    </>
  );
};
