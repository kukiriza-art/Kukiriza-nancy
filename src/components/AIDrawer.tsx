import React, { useState, useRef, useEffect } from 'react';
import { PageConfig, PlannerState } from '../types';
import { 
  X, 
  Send, 
  Loader2, 
  Sparkles, 
  Bot, 
  MessageSquare, 
  Info, 
  HelpCircle,
  HelpCircleIcon
} from 'lucide-react';

interface AIDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activePage: PageConfig;
  state: PlannerState;
  onStateChange: (updatedState: PlannerState) => void;
  customTexts: { [key: string]: string };
  onCustomTextChange: (key: string, value: string) => void;
  
  // Lifted UI states for context
  todayTab?: string;
  weekTab?: string;
  monthTab?: string;
  selectedProjectId?: number | null;
  projectTab?: string;
  selectedDate?: number;
}

export const AIDrawer: React.FC<AIDrawerProps> = ({
  isOpen,
  onClose,
  activePage,
  state,
  onStateChange,
  customTexts,
  onCustomTextChange,
  todayTab,
  weekTab,
  monthTab,
  selectedProjectId,
  projectTab,
  selectedDate
}) => {
  const [chatHistory, setChatHistory] = useState<Array<{ role: 'user' | 'assistant' | 'error'; text: string }>>([
    {
      role: 'assistant',
      text: `Hi! I am your **Personal OS AI Copilot**. I am fully synchronized with your active page **"${activePage.title}"**. 

I can instantly write strategy OKRs, build optimized daily schedules, outline project metrics, or customize your scorecard wheel. 

Try clicking one of the **dynamic preset actions** below or type your custom guidelines!`
    }
  ]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isCopilotLoading, setIsCopilotLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, isCopilotLoading]);

  // Assist greeting update when active page changes
  useEffect(() => {
    setChatHistory(prev => {
      return [
        ...prev,
        {
          role: 'assistant',
          text: `🔄 *Context switched to **Page ${activePage.id}: ${activePage.title}***. Click any preset below to automatically optimize this blueprint page!`
        }
      ];
    });
  }, [activePage.id]);

  // Helper to fetch custom text
  const getCustomTextVal = (key: string, fallback: string) => {
    return customTexts[key] !== undefined ? customTexts[key] : fallback;
  };

  // Submit request to Express backend Gemini AI Copilot
  const handleCopilotSubmit = async (promptText: string) => {
    if (!promptText.trim() || isCopilotLoading) return;

    const userMsg = promptText.trim();
    setInputPrompt('');
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsCopilotLoading(true);

    try {
      const response = await fetch('/api/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userMsg,
          activePage,
          state,
          todayTab,
          weekTab,
          monthTab,
          selectedProjectId,
          projectTab,
          selectedDate
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Server returned error status ${response.status}`);
      }

      const data = await response.json();

      // Apply the state updates returned from Gemini
      if (data.updatedState) {
        const nextState = { ...state };
        
        if (data.updatedState.annualGoals) nextState.annualGoals = data.updatedState.annualGoals;
        if (data.updatedState.projects) nextState.projects = data.updatedState.projects;
        if (data.updatedState.dailyTasks) nextState.dailyTasks = data.updatedState.dailyTasks;
        if (data.updatedState.yearScores) nextState.yearScores = data.updatedState.yearScores;

        onStateChange(nextState);

        if (data.updatedState.customTexts) {
          Object.entries(data.updatedState.customTexts).forEach(([key, val]) => {
            onCustomTextChange(key, String(val));
          });
        }
      }

      setChatHistory(prev => [
        ...prev,
        { role: 'assistant', text: data.message || "I have optimized the active page blueprint with high-fidelity targets!" }
      ]);

    } catch (err: any) {
      console.error("AI Copilot request failed:", err);
      setChatHistory(prev => [
        ...prev,
        { role: 'error', text: `⚠️ **AI Copilot offline:** ${err.message || 'Please check that GEMINI_API_KEY is configured in your build environment.'}` }
      ]);
    } finally {
      setIsCopilotLoading(false);
    }
  };

  // Dynamic Suggestion Presets based on Active Page Type
  const getSuggestionPresets = (): Array<{ label: string; prompt: string }> => {
    switch (activePage.type) {
      case 'annual_vision':
        return [
          { label: "🚀 SaaS Startup Targets", prompt: "Fill out the annual goals focusing strictly on SaaS product metrics, startup fundraising, and AI skills growth." },
          { label: "🧘 Healthy & Balanced Life", prompt: "Generate life goals centered on mindfulness practice, cardio conditioning, sleep optimization, and family relationships." }
        ];
      case 'projects_portfolio':
        return [
          { label: "💻 Full-Stack Dev Portfolio", prompt: "Fill out high-impact software engineering projects with realistic progress ratings, target due dates, and statuses." },
          { label: "🎨 Creative Brand Launch", prompt: "Plan my digital art and indie hacking project slots with milestones for launching on Product Hunt." }
        ];
      case 'quarterly_roadmap':
      case 'quarterly_okr':
        return [
          { label: "📈 SaaS Growth OKRs", prompt: "Draft solid Q1 OKRs focused on launching beta tests, collecting user reviews, and scaling deployment speed." },
          { label: "📚 Intensive Learning", prompt: "Set up study and certification objectives focusing on cloud architecture, system design, and AI model tuning." }
        ];
      case 'monthly_dashboard':
        return [
          { label: "💰 High-Revenue Strategy", prompt: "Setup monthly dashboard priorities and target stats focusing on $18,000 MRR, 100 deep work hours, and intense athletic training." },
          { label: "🌱 Focus & Alignment", prompt: "Draft monthly priorities focusing on organic diet logs, daily reading goals, and family alignment meetings." }
        ];
      case 'weekly_planning_roadmaps':
      case 'weekly_roadmap':
        return [
          { label: "⚙️ Programming Sprint Focus", prompt: "Plan weekly goals and day-by-day focus notes for a high-intensity programming sprint week." },
          { label: "🌴 Travel & Recharge Week", prompt: "Structure weekly columns for a creative travel trip combined with mental recharge days." }
        ];
      case 'daily_command_center':
      case 'daily_center_a':
      case 'daily_center_b':
        return [
          { label: "⚡ Extreme Deep Work Day", prompt: "Schedule a robust daily command center agenda with 6 AM routine, heavy programming sprints, and minimal distraction blocks." },
          { label: "🧘 Recover & Recalibrate", prompt: "Optimize my daily timeline for writing, research, creative design sessions, and leisure walking." }
        ];
      case 'portfolio_audit':
        return [
          { label: "🔧 Debug Blocked Projects", prompt: "Structure audit blockades focusing on external API outages and developer coordination lag, giving clear action mitigations." }
        ];
      case 'life_balance_wheel':
      case 'year_review_scorecard':
        return [
          { label: "📊 Maximize Career Scorecard", prompt: "Melt the Life Balance Wheel sliders to reflect highly optimized career, productivity, and financial growth metrics." },
          { label: "🎡 Balanced Life Alignment", prompt: "Configure a highly harmonious wheel with balanced health, fun, relationship, and growth score ratings." }
        ];
      default:
        return [
          { label: "✨ Autofill Best Strategy", prompt: "Intelligently draft realistic high-performance targets for this active blueprint template." }
        ];
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 transition-opacity animate-in fade-in duration-200 no-print"
      />

      {/* Drawer Panel */}
      <div className="fixed right-0 top-0 h-full w-85 md:w-96 bg-[#1C1E22] border-l border-gray-800 shadow-2xl z-50 flex flex-col no-print animate-in slide-in-from-right duration-300">
        
        {/* Drawer Header */}
        <div className="p-4 border-b border-gray-800 bg-[#22252A] flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2">
            <div className="bg-indigo-600/10 text-indigo-400 p-2 rounded-lg">
              <Sparkles className="h-4 w-4 text-indigo-400" />
            </div>
            <div>
              <span className="text-[9px] font-bold text-indigo-400 tracking-widest uppercase block">
                ACTIVE AI WORKSPACE
              </span>
              <h3 className="text-white font-bold text-sm tracking-tight">
                Execute Planner Copilot
              </h3>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-md hover:bg-gray-800/80 transition"
            aria-label="Close AI panel"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Current Page Sync Context Notification bar */}
        <div className="px-4 py-2 bg-indigo-950/40 border-b border-indigo-900/30 text-[10px] text-indigo-300 flex items-center space-x-1.5 shrink-0">
          <Bot className="h-3.5 w-3.5" />
          <span className="font-semibold">Synced Context:</span>
          <span className="font-bold underline truncate">{activePage.title}</span>
        </div>

        {/* Chat History Flow */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
          {chatHistory.map((msg, idx) => {
            const isUser = msg.role === 'user';
            const isError = msg.role === 'error';
            
            return (
              <div 
                key={idx}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
              >
                <div className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-xs font-medium leading-relaxed ${
                  isUser 
                    ? 'bg-indigo-600 text-white rounded-tr-none'
                    : isError
                      ? 'bg-red-950/40 border border-red-900/30 text-red-200 rounded-tl-none'
                      : 'bg-[#151619] border border-gray-800 text-gray-200 rounded-tl-none'
                }`}>
                  {/* Simplistic markdown translation for bold keys */}
                  <p className="whitespace-pre-wrap">
                    {msg.text.split('**').map((chunk, i) => i % 2 === 1 ? <strong key={i} className="font-extrabold text-indigo-300">{chunk}</strong> : chunk)}
                  </p>
                </div>
                <span className="text-[9px] text-gray-500 mt-1 uppercase font-bold tracking-wider px-1">
                  {isUser ? 'You' : isError ? 'System Error' : 'Copilot'}
                </span>
              </div>
            );
          })}

          {isCopilotLoading && (
            <div className="flex flex-col items-start">
              <div className="bg-[#151619] border border-gray-800 rounded-xl px-4 py-3 rounded-tl-none flex items-center space-x-3 text-xs text-indigo-300">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="font-medium animate-pulse">Gemini is rewriting vectors...</span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Dynamic Action Suggestion Presets */}
        <div className="p-3 border-t border-gray-800 bg-[#151619]/60 space-y-2 shrink-0">
          <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest block px-1">
            OPTIMIZATION SUGGESTIONS
          </span>
          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto custom-scrollbar">
            {getSuggestionPresets().map((preset, idx) => (
              <button
                key={idx}
                onClick={() => handleCopilotSubmit(preset.prompt)}
                disabled={isCopilotLoading}
                className="text-[10px] bg-[#1C1E22] hover:bg-indigo-600/10 border border-gray-800 hover:border-indigo-500/30 text-gray-300 hover:text-indigo-300 px-2.5 py-1.5 rounded-md transition text-left shrink-0 max-w-full truncate disabled:opacity-50"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Input Area */}
        <div className="p-4 border-t border-gray-800 bg-[#151619] shrink-0">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleCopilotSubmit(inputPrompt);
            }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              disabled={isCopilotLoading}
              placeholder={`Ask to schedule, optimize OKRs...`}
              className="flex-1 bg-[#121316] border border-gray-800 rounded-xl py-2.5 px-3.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-60 font-sans"
            />
            <button
              type="submit"
              disabled={!inputPrompt.trim() || isCopilotLoading}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-800 text-white disabled:text-gray-500 p-2.5 rounded-xl transition shadow-lg disabled:shadow-none shadow-indigo-600/15"
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
          <div className="mt-2.5 flex items-center justify-between text-[10px] text-gray-500">
            <span className="flex items-center space-x-1">
              <Info className="h-3 w-3" />
              <span>Answers edit layout cells in real time</span>
            </span>
          </div>
        </div>

      </div>
    </>
  );
};
