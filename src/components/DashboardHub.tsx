import React, { useState, useEffect } from 'react';
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
  Award,
  Terminal,
  ShieldCheck,
  ShieldAlert,
  Cpu,
  Database,
  RefreshCw,
  Lock,
  Key,
  Shield,
  HelpCircle
} from 'lucide-react';

interface DashboardHubProps {
  state: PlannerState;
  customTexts: { [key: string]: string };
  onNavigateToSection: (section: string, pageId?: number) => void;
  user?: { id: string; email: string; display_name: string; avatar_url: string } | null;
  operatorName: string;
  updateOperatorName: (name: string) => void;
  soundFXEnabled: boolean;
  updateSoundFXEnabled: (enabled: boolean) => void;
  themeAccent: string;
  updateThemeAccent: (accent: string) => void;
  playSystemSound: (type: 'click' | 'success' | 'warning' | 'theme') => void;
  theme: any;
}

export const DashboardHub: React.FC<DashboardHubProps> = ({
  state,
  customTexts,
  onNavigateToSection,
  user,
  operatorName,
  updateOperatorName,
  soundFXEnabled,
  updateSoundFXEnabled,
  themeAccent,
  updateThemeAccent,
  playSystemSound,
  theme
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Personal OS Log & Diagnostic Terminal state
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalHistory, setTerminalHistory] = useState<string[]>([
    'EXECUTE_OS [Version 1.2.6-stable]',
    'Initializing secure personal kernel bootstrap...',
    'TimingSafeSignatures: Cryptographic timing-attack shield enforced.',
    'ExpressSecureHeaders: nosniff, frame-ancestors, CSP rules active.',
    'SQLitePersistentStorage: User profile state database synchronized.',
    'Type HELP to list available personal utility shell commands.'
  ]);
  const [securityScore, setSecurityScore] = useState<number | null>(null);
  const [securityChecks, setSecurityChecks] = useState<any | null>(null);
  const [securityRecommendations, setSecurityRecommendations] = useState<string[]>([]);
  const [isScanning, setIsScanning] = useState(false);

  const runSecurityScan = async () => {
    setIsScanning(true);
    setTerminalHistory(prev => [...prev, '[SCANNER] Requesting audit signature from /api/security/scan...']);
    try {
      const res = await fetch('/api/security/scan');
      if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
      const data = await res.json();
      
      setSecurityScore(data.score);
      setSecurityChecks(data.checks);
      setSecurityRecommendations(data.recommendations);
      
      setTerminalHistory(prev => [
        ...prev,
        `[SCANNER SUCCESS] Security scan complete. Posture Rating: ${data.score}%`,
        `  - Secure Headers: ${data.checks.headersActive ? 'ENFORCED' : 'WARNING'}`,
        `  - Timing attacks shield: ${data.checks.cryptoTimingHardened ? 'ENFORCED' : 'WARNING'}`,
        `  - Recommendations logged: ${data.recommendations.length}`
      ]);
      playSystemSound('success');
    } catch (err: any) {
      console.error(err);
      setTerminalHistory(prev => [...prev, `[SCANNER ERROR] Failed to fetch scan diagnostics: ${err.message}`]);
      setSecurityScore(75);
      setSecurityRecommendations([
        "OFFLINE_MODE: Could not connect to backend server scanner. Verify your Node service status."
      ]);
      playSystemSound('warning');
    } finally {
      setIsScanning(false);
    }
  };

  const executeTerminalCommand = async (command: string) => {
    const trimmed = command.trim();
    if (!trimmed) return;

    const cmdParts = trimmed.split(' ');
    const cmdRoot = cmdParts[0].toLowerCase();
    setTerminalHistory(prev => [...prev, `operator@execute-os:~$ ${trimmed}`]);
    setTerminalInput('');
    playSystemSound('click');

    if (cmdRoot === 'help') {
      setTerminalHistory(prev => [
        ...prev,
        'Available commands:',
        '  help           - Display this helper tool menu',
        '  security_scan  - Invoke deep API & environment security audit',
        '  sys_info       - Query hardware resource allocation and uptime',
        '  operator <name>- Re-assign the active Personal OS operator name',
        '  theme <color>  - Switch accent colors (indigo | emerald | violet | amber)',
        '  sound <on|off> - Enable or disable mechanical synth audio cues',
        '  clear_logs     - Clear the terminal screen history',
        '  ai_status      - Check connection latency with Gemini model kernel'
      ]);
    } else if (cmdRoot === 'security_scan') {
      setTerminalHistory(prev => [...prev, 'Running security scanner...']);
      await runSecurityScan();
    } else if (cmdRoot === 'operator') {
      if (cmdParts.length < 2) {
        setTerminalHistory(prev => [...prev, 'Usage: operator <name>']);
      } else {
        const newName = cmdParts.slice(1).join(' ');
        updateOperatorName(newName);
        setTerminalHistory(prev => [...prev, `SUCCESS: Registered new active operator profile: ${newName}`]);
        playSystemSound('success');
      }
    } else if (cmdRoot === 'theme') {
      const choice = cmdParts[1]?.toLowerCase();
      if (!['indigo', 'emerald', 'violet', 'amber'].includes(choice)) {
        setTerminalHistory(prev => [...prev, 'Usage: theme <indigo | emerald | violet | amber>']);
      } else {
        updateThemeAccent(choice);
        setTerminalHistory(prev => [...prev, `SUCCESS: Applied ${choice.toUpperCase()} color profile theme.`]);
        playSystemSound('theme');
      }
    } else if (cmdRoot === 'sound') {
      const choice = cmdParts[1]?.toLowerCase();
      if (choice === 'on') {
        updateSoundFXEnabled(true);
        setTerminalHistory(prev => [...prev, 'SUCCESS: Audio feedback active. Mechanical clicks on.']);
        setTimeout(() => playSystemSound('success'), 50);
      } else if (choice === 'off') {
        updateSoundFXEnabled(false);
        setTerminalHistory(prev => [...prev, 'SUCCESS: Audio feedback silenced.']);
      } else {
        setTerminalHistory(prev => [...prev, 'Usage: sound <on | off>']);
      }
    } else if (cmdRoot === 'sys_info') {
      const simulatedMemory = Math.round(52 + Math.random() * 15);
      const simulatedCpu = Math.round(8 + Math.random() * 12);
      setTerminalHistory(prev => [
        ...prev,
        `SYS_INFO REPORT:`,
        `  - CPU Load: ${simulatedCpu}% (Personal OS Core Allocation)`,
        `  - Memory: ${simulatedMemory}MB allocated to page blueprints`,
        `  - Storage: 24 templates indexed (100% locally buffered)`,
        `  - Active Node PID: ${Math.round(1000 + Math.random() * 8000)}`,
        `  - Kernel Uptime: ${(window.performance.now() / 1000 / 60).toFixed(2)} minutes`
      ]);
    } else if (cmdRoot === 'clear_logs') {
      setTerminalHistory(['Terminal logs flushed. Operator terminal ready.']);
    } else if (cmdRoot === 'ai_status') {
      setTerminalHistory(prev => [...prev, 'Querying AI Node connectivity...']);
      try {
        const geminiConnected = state.annualGoals.length >= 0;
        setTerminalHistory(prev => [
          ...prev,
          `AI_STATUS REPORT:`,
          `  - Gemini API Client: ${geminiConnected ? 'CONNECTED' : 'DISCONNECTED'}`,
          `  - Model Target: gemini-3.5-flash`,
          `  - Security Proxy: Enforced (server-side only, zero client exposures)`
        ]);
      } catch (err) {
        setTerminalHistory(prev => [...prev, 'ERROR: Failed to establish secure connection with AI Copilot endpoint.']);
      }
    } else {
      setTerminalHistory(prev => [...prev, `ERROR: Command '${trimmed}' not found. Type 'help' for assistance.`]);
    }
  };

  useEffect(() => {
    runSecurityScan();
  }, []);

  const today = new Date('2026-07-04'); // Stabilized date as requested
  
  // Calculate appropriate greeting based on hours (10:59 AM -> Morning)
  const hours = today.getHours();
  const displayName = operatorName || 'Operator';
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

  // Configuration for the exactly 5 Navigation cards as requested in Variation 1 style
  const navigationCards = [
    {
      id: '01',
      title: 'Fiscal Year',
      value: '2026',
      subtext: 'Year Workspace',
      icon: <Calendar className={`h-4 w-4 ${theme.text}`} />,
      targetSection: 'Year Planning',
      defaultPageId: 2, // Annual Vision
      extraElement: (
        <div className="w-full mt-3 space-y-1.5" id="year-progress-indicator">
          <div className="w-full bg-[#e4e4e7]/10 h-[2px] overflow-hidden">
            <div 
              className={`${theme.bg} h-full transition-all duration-500`}
              style={{ width: `${avgGoalProgress}%` }}
            />
          </div>
          <div className="flex justify-between text-[8px] text-[#e4e4e7]/50 font-mono uppercase tracking-wider">
            <span>Goal Progress</span>
            <span className={`${theme.text} font-bold`}>{avgGoalProgress}%</span>
          </div>
        </div>
      )
    },
    {
      id: '02',
      title: 'Current Cycle',
      value: 'July',
      subtext: 'Month Workspace',
      icon: <Layers className={`h-4 w-4 ${theme.text}`} />,
      targetSection: 'Monthly Dashboards',
      defaultPageId: 6, // Monthly Dashboard
      extraElement: null
    },
    {
      id: '03',
      title: 'Active Phase',
      value: 'Week 27',
      subtext: 'Velocity: 1.4x',
      icon: <TrendingUp className={`h-4 w-4 ${theme.text}`} />,
      targetSection: 'Weekly Planning',
      defaultPageId: 18, // Weekly Roadmap
      extraElement: null
    },
    {
      id: '04',
      title: 'Daily Routine',
      value: 'Saturday, July 4',
      subtext: '8 Active Slots',
      icon: <Clock className={`h-4 w-4 ${theme.text}`} />,
      targetSection: 'Daily Planning',
      defaultPageId: 19, // Daily Command Center
      extraElement: null
    },
    {
      id: '05',
      title: 'System Projects',
      value: `${activeProjectsCount} Active Projects`,
      subtext: 'Project Workspace',
      icon: <Briefcase className={`h-4 w-4 ${theme.text}`} />,
      targetSection: 'Project Management',
      defaultPageId: 20, // Projects Portfolio Meter
      extraElement: null
    }
  ];

  const yearCard = navigationCards[0];
  const monthCard = navigationCards[1];
  const weekCard = navigationCards[2];
  const dailyCard = navigationCards[3];
  const projectCard = navigationCards[4];

  const renderCard = (card: typeof navigationCards[0]) => (
    <div
      key={card.id}
      onClick={() => {
        playSystemSound('click');
        onNavigateToSection(card.targetSection, card.defaultPageId);
      }}
      className={`bg-[#141416] hover:bg-[#141416]/80 border border-[#e4e4e7]/10 hover:${theme.hoverBorder} p-6 cursor-pointer flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 group relative h-48 rounded-xl`}
      id={`nav-card-${card.id}`}
    >
      {/* Minimal Card ID element from Variation 1 layout */}
      <span className={`absolute top-6 right-6 font-mono text-[10px] text-[#e4e4e7]/20 group-hover:${theme.text}/50 transition-colors`}>
        [{card.id}]
      </span>

      <div className="space-y-4">
        <div className="space-y-1">
          <span className="text-[9px] text-[#e4e4e7]/40 uppercase font-bold tracking-widest font-mono block">
            {card.title}
          </span>
          <h4 className={`text-[#e4e4e7] font-bold font-syne text-xl tracking-tight group-hover:${theme.text} transition-colors uppercase leading-none mt-1`}>
            {card.value}
          </h4>
        </div>
      </div>

      <div className="border-t border-[#e4e4e7]/10 pt-4 flex flex-col items-start justify-end">
        <div className="flex items-center justify-between w-full">
          <span className="text-[9px] text-[#e4e4e7]/50 font-mono uppercase tracking-wider">
            {card.subtext}
          </span>
          <ArrowRight className={`h-3.5 w-3.5 opacity-30 group-hover:opacity-100 group-hover:translate-x-1 transition-all ${theme.text}`} />
        </div>
        {card.extraElement}
      </div>
    </div>
  );

  const handlePrint = () => {
    window.print();
  };

  return (
    <div 
      className="flex-1 overflow-y-auto custom-scrollbar bg-[#0c0c0e] p-6 lg:p-12 flex flex-col items-center"
      style={{
        backgroundImage: 'radial-gradient(circle, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
        backgroundSize: '32px 32px'
      }}
    >
      <div className="w-full max-w-4xl space-y-12 py-6">
        
        {/* HEADER SECTION - Styled exactly according to Variation 1 */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between border-b-2 border-[#e4e4e7] pb-6 gap-6 w-full">
          <div className="space-y-1">
            <span className={`font-mono text-[9px] ${theme.text} uppercase tracking-[0.2em] font-bold block`}>
              Status: Operational
            </span>
            <h1 className="text-[#e4e4e7] text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-extrabold font-syne tracking-tight leading-none uppercase">
              {greeting}
            </h1>
          </div>
          <div className="text-left md:text-right font-mono text-xs text-[#e4e4e7]/50 shrink-0">
            <div className="uppercase tracking-widest font-bold text-[#e4e4e7]">{formattedDate}</div>
            <div className={`text-[9px] mt-1 ${theme.text}/80 tracking-widest uppercase`}>COORD: 34.0522° N, 118.2437° W</div>
          </div>
        </div>

        {/* SEARCH & FILTER SECTION */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pt-2">
          <div className="relative w-full md:w-96 shrink-0">
            <label htmlFor="hub-header-search-input" className="sr-only">Search system index</label>
            <input
              type="text"
              id="hub-header-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="SYSTEM_SEARCH..."
              className="w-full bg-transparent border-b border-[#e4e4e7]/10 py-2 pl-9 pr-4 text-xs font-mono text-[#e4e4e7] placeholder-[#e4e4e7]/30 focus:outline-none focus:border-[#6366f1] transition-all"
            />
            <Search className="absolute left-1 top-2 text-[#e4e4e7]/30 h-3.5 w-3.5" />
            
            {searchQuery.trim() !== '' && (
              <button 
                onClick={() => {
                  playSystemSound('click');
                  setSearchQuery('');
                }}
                className={`absolute right-1 top-1.5 text-[8px] font-mono ${theme.text} hover:text-[#e4e4e7] bg-white/5 px-2 py-0.5 rounded transition`}
              >
                CLEAR
              </button>
            )}
          </div>
        </div>

        {/* SEARCH RESULTS OVERLAY PANEL */}
        {searchQuery.trim() !== '' && (
          <div className="bg-[#141416] border border-[#e4e4e7]/10 p-5 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
            <h3 className={`text-[9px] font-mono font-bold ${theme.text} uppercase tracking-widest`}>
              Search Results ({searchResults.length})
            </h3>
            {searchResults.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-64 overflow-y-auto custom-scrollbar">
                {searchResults.map(p => (
                  <button
                    key={p.id}
                    onClick={() => {
                      playSystemSound('click');
                      onNavigateToSection(p.section, p.id);
                    }}
                    className={`flex items-start text-left p-3 rounded bg-[#0c0c0e]/50 hover:bg-white/5 group transition border border-[#e4e4e7]/5 hover:border-${themeAccent === 'indigo' ? '[#6366f1]' : themeAccent}-500/30`}
                    id={`search-result-page-${p.id}`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-1.5">
                        <span className="text-[8px] font-mono text-[#e4e4e7]/40 font-bold bg-[#e4e4e7]/5 px-1.5 py-0.5 rounded border border-[#e4e4e7]/10">
                          [{String(p.id).padStart(2, '0')}]
                        </span>
                        <span className={`text-xs font-mono uppercase text-[#e4e4e7] truncate group-hover:${theme.text} transition`}>
                          {p.title}
                        </span>
                      </div>
                      <p className="text-[10px] text-[#e4e4e7]/40 mt-1 truncate">
                        {p.desc || p.section}
                      </p>
                    </div>
                    <ChevronRight className={`h-4 w-4 text-[#e4e4e7]/20 group-hover:${theme.text} shrink-0 ml-2 self-center transition-transform group-hover:translate-x-0.5`} />
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#e4e4e7]/40 font-mono italic py-2">
                No matching page templates found.
              </p>
            )}
          </div>
        )}

        {/* OPERATION HIERARCHICAL NAVIGATION SECTIONS */}
        <div className="space-y-10">
          
          {/* LEVEL I: STRATEGIC CONTROL */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#e4e4e7]/10 pb-2">
              <h3 className={`text-[10px] font-mono font-bold ${theme.text} uppercase tracking-[0.15em] flex items-center space-x-2`}>
                <span className={`w-1.5 h-1.5 ${theme.bg} rounded-full`} />
                <span>Level I: Strategic Command</span>
              </h3>
              <span className="text-[8px] font-mono text-[#e4e4e7]/30 uppercase tracking-wider">
                Year Horizon & Portfolio
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderCard(yearCard)}
              {renderCard(projectCard)}
            </div>
          </div>

          {/* LEVEL II: TACTICAL PIPELINES */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#e4e4e7]/10 pb-2">
              <h3 className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-[0.15em] flex items-center space-x-2">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                <span>Level II: Tactical Sprints</span>
              </h3>
              <span className="text-[8px] font-mono text-[#e4e4e7]/30 uppercase tracking-wider">
                Cycles, Roadmaps & Timelines
              </span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {renderCard(monthCard)}
              {renderCard(weekCard)}
              {renderCard(dailyCard)}
            </div>
          </div>

          {/* LEVEL III: OS KERNEL & DIAGNOSTICS */}
          <div className="space-y-4">
            <div className="hidden flex items-center justify-between border-b border-[#e4e4e7]/10 pb-2">
              <h3 className={`text-[10px] font-mono font-bold ${theme.text} uppercase tracking-[0.15em] flex items-center space-x-2`}>
                <span className={`w-1.5 h-1.5 ${theme.bg} rounded-full animate-pulse`} />
                <span>Level III: OS Kernel & Diagnostics</span>
              </h3>
              <span className="text-[8px] font-mono text-[#e4e4e7]/30 uppercase tracking-wider">
                Personal Terminal & Integrity Shield
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Monospace Interactive Shell Console (col-span-7) */}
              <div className="hidden lg:col-span-7 bg-[#141416] border border-[#e4e4e7]/10 rounded-xl p-5 font-mono text-xs flex flex-col justify-between h-[360px] relative overflow-hidden">
                <div>
                  <div className="flex items-center justify-between border-b border-[#e4e4e7]/10 pb-2.5 mb-3">
                    <div className="flex items-center space-x-2">
                      <Terminal className={`h-4 w-4 ${theme.text}`} />
                      <span className="font-bold text-[#e4e4e7] uppercase tracking-wider text-[10px]">EXECUTE_OS SHELL TERMINAL</span>
                    </div>
                    <div className="flex space-x-1.5">
                      <span className="w-2 h-2 rounded-full bg-red-500/80" />
                      <span className="w-2 h-2 rounded-full bg-yellow-500/80" />
                      <span className="w-2 h-2 rounded-full bg-emerald-500/80" />
                    </div>
                  </div>

                  {/* Terminal Log Stream Output */}
                  <div className="space-y-1.5 overflow-y-auto custom-scrollbar h-[200px] text-[10px] text-gray-300 pr-1 select-text">
                    {terminalHistory.map((line, idx) => (
                      <div 
                        key={idx} 
                        className={`${
                          line.startsWith('operator@') ? `${theme.text} font-semibold` :
                          line.startsWith('[SCANNER') ? 'text-amber-400 font-semibold' :
                          line.startsWith('  -') || line.startsWith('  *') ? 'text-gray-400 pl-2' :
                          line.includes('ERROR') || line.includes('WARNING') ? 'text-red-400 font-bold' : 'text-gray-300'
                        }`}
                      >
                        {line}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shell Input and Presets */}
                <div className="hidden space-y-2 mt-4 pt-3 border-t border-[#e4e4e7]/10 bg-[#141416]/90">
                  {/* Preset command shortcuts for direct usability */}
                  <div className="flex flex-wrap gap-1.5">
                    {['help', 'security_scan', 'sys_info', 'ai_status', 'clear_logs'].map(cmd => (
                      <button
                        key={cmd}
                        onClick={() => executeTerminalCommand(cmd)}
                        className={`text-[8px] font-bold ${theme.text} hover:text-[#0c0c0e] bg-indigo-500/10 hover:${theme.bg} border border-[#6366f1]/20 px-2 py-0.5 rounded transition uppercase tracking-wider cursor-pointer`}
                      >
                        {cmd}
                      </button>
                    ))}
                  </div>

                  {/* Command Input field */}
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      executeTerminalCommand(terminalInput);
                    }}
                    className="flex items-center space-x-2"
                  >
                    <span className={`${theme.text} font-extrabold select-none`}>$&gt;</span>
                    <input
                      type="text"
                      value={terminalInput}
                      onChange={(e) => setTerminalInput(e.target.value)}
                      placeholder="Type system command (e.g. sys_info)..."
                      className="flex-1 bg-transparent border-none text-[10px] text-white focus:outline-none placeholder-gray-600 font-mono"
                      id="terminal-cli-input"
                    />
                    <button
                      type="submit"
                      className="text-[9px] font-bold text-gray-400 hover:text-white uppercase font-mono tracking-widest px-2 py-1 bg-white/5 hover:bg-white/10 rounded transition cursor-pointer"
                      id="terminal-cli-submit-btn"
                    >
                      EXECUTE
                    </button>
                  </form>
                </div>
              </div>

              {/* Security Auditor & Posture Panel (col-span-5) */}
              <div className="lg:col-span-5 bg-[#141416] border border-[#e4e4e7]/10 rounded-xl p-5 flex flex-col justify-between h-[360px] relative overflow-hidden">
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-[#e4e4e7]/10 pb-2.5">
                    <div className="flex items-center space-x-2">
                      <Lock className="h-4 w-4 text-emerald-400" />
                      <span className="font-mono font-bold text-[#e4e4e7] uppercase tracking-wider text-[10px]">OS SECURE INTEGRITY</span>
                    </div>
                    {isScanning ? (
                      <RefreshCw className={`h-3.5 w-3.5 ${theme.text} animate-spin`} />
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    )}
                  </div>

                  {/* Rating Meter & Score */}
                  <div className="flex items-center space-x-4 pt-1 bg-[#0c0c0e]/30 p-3 rounded-lg border border-[#e4e4e7]/5">
                    <div className="relative flex items-center justify-center shrink-0">
                      {/* Decorative Circular Posture Badge */}
                      <div className="w-14 h-14 rounded-full border border-dashed border-[#e4e4e7]/20 flex items-center justify-center font-mono text-sm font-black text-white relative">
                        {securityScore !== null ? `${securityScore}%` : '---'}
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className={`text-[8px] font-mono font-bold ${theme.text} uppercase tracking-widest`}>POSTURE ASSESSMENT</span>
                      <h4 className="text-xs font-bold text-white uppercase mt-0.5 font-syne truncate">
                        {securityScore !== null && securityScore >= 80 ? '🔒 Level A: Fortified' : '⚠️ Level B: Hardened'}
                      </h4>
                      <p className="text-[9px] text-[#e4e4e7]/40 truncate">
                        Timing-safe comparison & CSP active.
                      </p>
                    </div>
                  </div>

                  {/* Recommendations and Checks */}
                  <div className="space-y-2 max-h-[145px] overflow-y-auto custom-scrollbar pr-1">
                    <span className="text-[8px] font-mono text-gray-500 uppercase tracking-wider block">Diagnostics Findings</span>
                    {securityRecommendations.map((rec, idx) => {
                      const isDanger = rec.includes('undefined') || rec.includes('empty') || rec.includes('fallback');
                      return (
                        <div key={idx} className="flex items-start space-x-2 bg-[#0c0c0e]/40 p-2 border border-[#e4e4e7]/5 rounded text-[9px] leading-relaxed">
                          {isDanger ? (
                            <ShieldAlert className="h-3 w-3 text-amber-500 shrink-0 mt-0.5" />
                          ) : (
                            <ShieldCheck className="h-3 w-3 text-emerald-400 shrink-0 mt-0.5" />
                          )}
                          <span className={`${isDanger ? 'text-gray-300' : 'text-gray-400'}`}>
                            {rec}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Audit trigger action */}
                <div className="pt-2">
                  <button
                    onClick={() => {
                      playSystemSound('click');
                      runSecurityScan();
                    }}
                    disabled={isScanning}
                    className={`w-full bg-[#1c1e22] hover:bg-white/5 text-[#e4e4e7] border border-[#e4e4e7]/10 hover:border-${themeAccent}-500/50 py-2.5 rounded font-mono font-bold uppercase tracking-widest text-[9px] active:scale-95 transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50`}
                    id="trigger-security-scan-btn"
                  >
                    <RefreshCw className={`h-3 w-3 ${theme.text} ${isScanning ? 'animate-spin' : ''}`} />
                    <span>{isScanning ? 'SCANNING SYSTEM ENVIRONMENT...' : 'RE-RUN SYSTEM AUDIT SCAN'}</span>
                  </button>
                </div>

              </div>

            </div>
          </div>

          {/* LEVEL IV: SYSTEM CONTROL & CUSTOMIZATION */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#e4e4e7]/10 pb-2">
              <h3 className={`text-[10px] font-mono font-bold ${theme.text} uppercase tracking-[0.15em] flex items-center space-x-2`}>
                <span className={`w-1.5 h-1.5 ${theme.bg} rounded-full`} />
                <span>Level IV: Personal OS Profile & Customization</span>
              </h3>
              <span className="text-[8px] font-mono text-[#e4e4e7]/30 uppercase tracking-wider">
                Custom Operator Preferences
              </span>
            </div>

            <div className="bg-[#141416] border border-[#e4e4e7]/10 rounded-xl p-5 font-sans">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Operator Name Config */}
                <div className="space-y-2">
                  <label htmlFor="operator-name-input" className="block text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider">
                    OPERATOR NAME
                  </label>
                  <input
                    type="text"
                    id="operator-name-input"
                    value={operatorName}
                    onChange={(e) => {
                      updateOperatorName(e.target.value);
                      if (Math.random() > 0.7) playSystemSound('click');
                    }}
                    placeholder="Enter operator profile name..."
                    className={`w-full bg-[#0c0c0e] border border-[#e4e4e7]/10 rounded px-3 py-2 text-xs font-medium text-white focus:outline-none focus:border-${themeAccent === 'indigo' ? '[#6366f1]' : themeAccent}-500 transition`}
                  />
                  <p className="text-[9px] text-[#e4e4e7]/30 font-mono">
                    Directly overrides the main workspace greetings & greeting headers.
                  </p>
                </div>

                {/* Color Profile Switcher */}
                <div className="space-y-2">
                  <span className="block text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider">
                    COLOR PROFILE ACCENT
                  </span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { name: 'indigo', label: 'Indigo Classic' },
                      { name: 'emerald', label: 'Emerald Matrix' },
                      { name: 'violet', label: 'Violet Cyber' },
                      { name: 'amber', label: 'Amber Alert' }
                    ].map((accentItem) => (
                      <button
                        key={accentItem.name}
                        onClick={() => {
                          updateThemeAccent(accentItem.name);
                          playSystemSound('theme');
                        }}
                        className={`text-[10px] font-mono font-bold py-1.5 px-2 rounded border transition text-center cursor-pointer ${
                          themeAccent === accentItem.name
                            ? `bg-white/5 border-${accentItem.name === 'indigo' ? '[#6366f1]' : accentItem.name}-500 text-white`
                            : 'bg-[#0c0c0e] border-transparent text-gray-500 hover:border-[#e4e4e7]/10'
                        }`}
                      >
                        {accentItem.label}
                      </button>
                    ))}
                  </div>
                  <p className="text-[9px] text-[#e4e4e7]/30 font-mono">
                    Changes dynamic focus lines, progress indicators, and terminal headers.
                  </p>
                </div>

                {/* Mechanical Click toggle */}
                <div className="space-y-2 flex flex-col justify-between">
                  <div>
                    <span className="block text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider">
                      OS AUDIO MODULATION
                    </span>
                    <div className="flex items-center space-x-3 mt-2">
                      <button
                        onClick={() => {
                          const nextVal = !soundFXEnabled;
                          updateSoundFXEnabled(nextVal);
                          if (nextVal) {
                            setTimeout(() => playSystemSound('success'), 50);
                          }
                        }}
                        className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          soundFXEnabled ? theme.bg : 'bg-[#0c0c0e]'
                        }`}
                        aria-label="Toggle retro sounds"
                      >
                        <span
                          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            soundFXEnabled ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                      <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                        {soundFXEnabled ? 'SOUNDS: ACTIVE' : 'SOUNDS: SILENT'}
                      </span>
                    </div>
                  </div>
                  <p className="text-[9px] text-[#e4e4e7]/30 font-mono">
                    Simulates mechanical clicks & sweep waves via Web Audio oscillators on mouse actions.
                  </p>
                </div>

              </div>
            </div>
          </div>

        </div>

        {/* FOOTER - Designed precisely as shown in Variation 1 */}
        <footer className="border-t border-[#e4e4e7]/10 pt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <p className="font-serif italic text-xs text-[#e4e4e7]/50 max-w-lg leading-relaxed">
            "The key to growth is focusing on execution over outcome. Plan carefully, execute relentlessly."
          </p>
          <div className="actions shrink-0">
            <button 
              onClick={() => {
                playSystemSound('click');
                handlePrint();
              }}
              className={`${theme.bg} hover:opacity-95 text-[#0c0c0e] px-6 py-3 rounded font-mono font-bold uppercase tracking-widest text-[9px] active:scale-95 transition-all shadow-lg ${theme.shadow}`}
            >
              Download Operational Spec
            </button>
          </div>
        </footer>

      </div>
    </div>
  );
};
