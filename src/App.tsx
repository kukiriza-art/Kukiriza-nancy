import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Workspace } from './components/Workspace';
import { RightPanel } from './components/RightPanel';
import { DashboardHub } from './components/DashboardHub';
import { AIDrawer } from './components/AIDrawer';
import { QuickAddModal } from './components/QuickAddModal';
import { LoginScreen } from './components/LoginScreen';
import { PAGES, getInitialPlannerState } from './data/pages';
import { generateSVGString } from './utils/svgGenerator';
import { PlannerState } from './types';
import JSZip from 'jszip';
import { 
  BookOpen, 
  Download, 
  RotateCcw, 
  Sparkles, 
  Check, 
  Flame, 
  Layers, 
  X, 
  Sliders, 
  ArrowLeft,
  LayoutGrid,
  Plus,
  Menu
} from 'lucide-react';

const LOCAL_STORAGE_KEY_STATE = 'canva_planner_state_v2';
const LOCAL_STORAGE_KEY_TEXTS = 'canva_planner_texts_v2';

export default function App() {
  const [activePageId, setActivePageId] = useState<number>(2); // Default to Annual Vision (id: 2)
  const [isMonthSelectorOpen, setIsMonthSelectorOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'dashboard' | 'planner'>('dashboard');
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAIDrawerOpen, setIsAIDrawerOpen] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

  // Lifted Personal OS preferences
  const [operatorName, setOperatorName] = useState<string>(() => {
    return localStorage.getItem('execute_os_operator_name') || '';
  });

  const [soundFXEnabled, setSoundFXEnabled] = useState<boolean>(() => {
    return localStorage.getItem('execute_os_sound_enabled') !== 'false';
  });

  const [themeAccent, setThemeAccent] = useState<string>(() => {
    return localStorage.getItem('execute_os_theme_accent') || 'indigo';
  });

  // Helper mapping for current system theme colors
  const getThemeColors = (accent: string) => {
    switch (accent) {
      case 'emerald':
        return {
          primary: '#10b981',
          text: 'text-emerald-400',
          bg: 'bg-emerald-500',
          hoverBg: 'hover:bg-emerald-600',
          border: 'border-emerald-500/20',
          hoverBorder: 'hover:border-emerald-500',
          shadow: 'shadow-emerald-600/10',
          accentTextHover: 'group-hover:text-emerald-400',
          focusRing: 'focus:ring-emerald-500',
          focusBorder: 'focus:border-emerald-500',
          fromTo: 'from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400',
          btnBg: 'bg-emerald-600 hover:bg-emerald-500',
          badgeText: 'text-emerald-300',
          badgeBg: 'bg-emerald-600/10',
        };
      case 'violet':
        return {
          primary: '#8b5cf6',
          text: 'text-violet-400',
          bg: 'bg-violet-500',
          hoverBg: 'hover:bg-violet-600',
          border: 'border-violet-500/20',
          hoverBorder: 'hover:border-violet-500',
          shadow: 'shadow-violet-600/10',
          accentTextHover: 'group-hover:text-violet-400',
          focusRing: 'focus:ring-violet-500',
          focusBorder: 'focus:border-violet-500',
          fromTo: 'from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400',
          btnBg: 'bg-violet-600 hover:bg-violet-500',
          badgeText: 'text-violet-300',
          badgeBg: 'bg-violet-600/10',
        };
      case 'amber':
        return {
          primary: '#f59e0b',
          text: 'text-amber-400',
          bg: 'bg-amber-500',
          hoverBg: 'hover:bg-amber-600',
          border: 'border-amber-500/20',
          hoverBorder: 'hover:border-amber-500',
          shadow: 'shadow-amber-600/10',
          accentTextHover: 'group-hover:text-amber-400',
          focusRing: 'focus:ring-amber-500',
          focusBorder: 'focus:border-amber-500',
          fromTo: 'from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400',
          btnBg: 'bg-amber-600 hover:bg-amber-500',
          badgeText: 'text-amber-300',
          badgeBg: 'bg-amber-600/10',
        };
      case 'indigo':
      default:
        return {
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
    }
  };

  const theme = getThemeColors(themeAccent);

  // Persist changes to localStorage on updates
  const updateOperatorName = (name: string) => {
    setOperatorName(name);
    localStorage.setItem('execute_os_operator_name', name);
  };

  const updateSoundFXEnabled = (enabled: boolean) => {
    setSoundFXEnabled(enabled);
    localStorage.setItem('execute_os_sound_enabled', String(enabled));
  };

  const updateThemeAccent = (accent: string) => {
    setThemeAccent(accent);
    localStorage.setItem('execute_os_theme_accent', accent);
  };

  // Safe client-side Web Audio API synthesizer for retro mechanical click feedback
  const playSystemSound = (type: 'click' | 'success' | 'warning' | 'theme') => {
    if (!soundFXEnabled) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(850, ctx.currentTime);
        gain.gain.setValueAtTime(0.015, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.08);
        osc.start();
        osc.stop(ctx.currentTime + 0.08);
      } else if (type === 'success') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        osc.frequency.setValueAtTime(880, ctx.currentTime + 0.08); // A5
        gain.gain.setValueAtTime(0.018, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.22);
        osc.start();
        osc.stop(ctx.currentTime + 0.22);
      } else if (type === 'warning') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(110, ctx.currentTime + 0.25);
        gain.gain.setValueAtTime(0.02, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.25);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      } else if (type === 'theme') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.setValueAtTime(554.37, ctx.currentTime + 0.06);
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.012, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.3);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      }
    } catch (e) {
      // Browser blocked autostart or unsupported
    }
  };

  // User Authentication states
  const [user, setUser] = useState<{ id: string; email: string; display_name: string; avatar_url: string } | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoginInitiating, setIsLoginInitiating] = useState<boolean>(false);

  // Keep operatorName in sync with logged in user display name if not custom set
  useEffect(() => {
    if (user && !localStorage.getItem('execute_os_operator_name') && !operatorName) {
      setOperatorName(user.display_name);
    }
  }, [user]);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch("/api/auth/me");
      if (response.ok) {
        const data = await response.json();
        if (data.loggedIn) {
          setUser(data.user);
          setAuthError(null);
        } else {
          setUser(null);
        }
      }
    } catch (e: any) {
      console.error("Failed to check authentication status:", e);
    } finally {
      setIsAuthLoading(false);
      setIsLoginInitiating(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
    
    // Set initial RightPanel visibility based on viewport width
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsRightPanelOpen(true);
      } else {
        setIsRightPanelOpen(false);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const origin = event.origin;
      if (!origin.endsWith(".run.app") && !origin.includes("localhost")) {
        return;
      }
      if (event.data?.type === "OAUTH_AUTH_SUCCESS") {
        checkAuthStatus();
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const handleGoogleLogin = async () => {
    setIsLoginInitiating(true);
    setAuthError(null);
    try {
      const res = await fetch("/api/auth/google/url");
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to retrieve Google Auth URL.");
      }
      const { url } = await res.json();
      
      const width = 600;
      const height = 700;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;
      
      const popup = window.open(
        url,
        "Google Sign In",
        `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes`
      );

      if (!popup) {
        throw new Error("Popup blocked! Please allow popups for this site to sign in.");
      }
    } catch (e: any) {
      console.error("Login initialization error:", e);
      setAuthError(e.message || "An unexpected error occurred.");
      setIsLoginInitiating(false);
    }
  };

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        setUser(null);
        triggerToast("👋 Logged out successfully!");
      } else {
        throw new Error("Logout failed");
      }
    } catch (e) {
      console.error("Logout error:", e);
      triggerToast("Failed to sign out cleanly.");
    }
  };

  // Lifted Workspace & Context States
  const [todayTab, setTodayTab] = useState<'overview' | 'schedule' | 'tasks' | 'blocking' | 'habits' | 'notes' | 'reflection'>('overview');
  const [weekTab, setWeekTab] = useState<'overview' | 'priorities' | 'calendar' | 'schedule' | 'tasks' | 'habits' | 'goals' | 'notes' | 'review'>('overview');
  const [monthTab, setMonthTab] = useState<'overview' | 'calendar' | 'goals' | 'habits' | 'projects' | 'budget' | 'notes' | 'review'>('overview');
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [projectTab, setProjectTab] = useState<'overview' | 'objectives' | 'tasks' | 'milestones' | 'notes' | 'attachments' | 'timeline' | 'activity' | 'reviews'>('overview');
  const [selectedDate, setSelectedDate] = useState<number>(4); // Default to Saturday, July 4

  const [state, setState] = useState<PlannerState>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_STATE);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback to default
      }
    }
    return getInitialPlannerState();
  });

  const [customTexts, setCustomTexts] = useState<{ [key: string]: string }>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_TEXTS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback to empty
      }
    }
    return {};
  });

  const [showToast, setShowToast] = useState<string | null>(null);

  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setIsInstallable(false);
      }
    } else {
      triggerToast("💡 Tap browser menu (3 dots or share) and select 'Add to Home screen' or 'Install' to download!");
    }
  };

  // Sync state to localStorage on modify
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_STATE, JSON.stringify(state));
  }, [state]);

  // Sync custom texts to localStorage on modify
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_TEXTS, JSON.stringify(customTexts));
  }, [customTexts]);

  const [selectedMonthIdx, setSelectedMonthIdx] = useState<number>(6); // Default to July (index 6) as July 4 is active default date

  const monthsData = [
    { num: '01', name: 'January' },
    { num: '02', name: 'February' },
    { num: '03', name: 'March' },
    { num: '04', name: 'April' },
    { num: '05', name: 'May' },
    { num: '06', name: 'June' },
    { num: '07', name: 'July' },
    { num: '08', name: 'August' },
    { num: '09', name: 'September' },
    { num: '10', name: 'October' },
    { num: '11', name: 'November' },
    { num: '12', name: 'December' }
  ];

  const activePageRaw = PAGES.find(p => p.id === activePageId) || PAGES[0];
  const activePage = activePageRaw.type === 'monthly_dashboard'
    ? { 
        ...activePageRaw, 
        num: monthsData[selectedMonthIdx].num, 
        month: monthsData[selectedMonthIdx].name, 
        title: `${monthsData[selectedMonthIdx].name} Monthly Dashboard` 
      }
    : activePageRaw;

  const handleCustomTextChange = (key: string, value: string) => {
    setCustomTexts(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Triggers downloading the active page as an SVG file
  const handleDownloadSVG = () => {
    try {
      const svgContent = generateSVGString(activePage, { ...state, customTexts });
      const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `POS_v2_0_Page_${String(activePage.id).padStart(2, '0')}_${activePage.title.replace(/[^a-zA-Z0-9]/g, '_')}.svg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      triggerToast(`Downloaded Page ${activePage.id} Vector!`);
    } catch (err) {
      console.error('Failed to export vector:', err);
      triggerToast('Error compiling page vector.');
    }
  };

  // Triggers bundling all pages into an organized ZIP archive
  const handleDownloadAllZip = async () => {
    try {
      triggerToast('Compiling 24-Page Vector Pack...');
      const zip = new JSZip();

      // Group templates inside clean folder divisions matching layout sections
      PAGES.forEach(page => {
        const svgContent = generateSVGString(page, { ...state, customTexts });
        const folder = zip.folder(page.section);
        if (folder) {
          const fileName = `POS_v2_0_Page_${String(page.id).padStart(2, '0')}_${page.title.replace(/[^a-zA-Z0-9]/g, '_')}.svg`;
          folder.file(fileName, svgContent);
        }
      });

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `POS_v2_0_Full_Vector_Pack.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      triggerToast('Vector Pack downloaded successfully!');
    } catch (err) {
      console.error('Error generating vector pack:', err);
      triggerToast('Failed to generate ZIP compilation.');
    }
  };

  // Triggers standard window.print()
  const handlePrintPage = () => {
    window.print();
  };

  // Resets all state values back to original blueprint defaults
  const handleResetToDefaults = () => {
    if (window.confirm('Are you sure you want to reset all custom goals, projects, times, and text alignments back to pristine blueprint defaults? This cannot be undone.')) {
      setState(getInitialPlannerState());
      setCustomTexts({});
      triggerToast('Reset all designs back to original templates.');
    }
  };

  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => {
      setShowToast(null);
    }, 3000);
  };

  // Navigate to a specific section and page ID
  const handleNavigateToSection = (section: string, pageId?: number) => {
    setSelectedSection(section);
    if (pageId) {
      setActivePageId(pageId);
    } else {
      // Find default page for section
      const firstPageInSection = PAGES.find(p => p.section === section);
      if (firstPageInSection) {
        setActivePageId(firstPageInSection.id);
      }
    }
    setCurrentView('planner');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedSection(null);
  };

  // Auth is non-blocking to allow immediate guest access without account setup.
  if (authError) {
    console.warn("Authentication warning:", authError);
  }

  return (
    <div className="bg-[#121316] text-gray-200 h-screen overflow-hidden flex flex-col font-sans relative">
      
      {/* HEADER BAR */}
      <header className="bg-[#1C1E22] border-b border-gray-800 px-4 md:px-6 py-3.5 flex items-center justify-between shrink-0 no-print">
        <div className="flex items-center space-x-2.5">
          {/* Hamburger Menu on mobile to open Sidebar */}
          {currentView === 'planner' && (
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-1.5 text-gray-400 hover:text-white hover:bg-gray-850 rounded-md transition"
              title="Open Navigation"
              id="mobile-hamburger-btn"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}

          <div 
            onClick={handleBackToDashboard}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div 
              className="w-8 h-8 md:w-9 md:h-9 rounded-lg overflow-hidden border border-transparent flex items-center justify-center shadow-md transition-all"
              style={{
                borderColor: `${theme.primary}4c`,
                boxShadow: `0 4px 6px -1px ${theme.primary}1a, 0 2px 4px -2px ${theme.primary}1a`
              }}
            >
              <img 
                src="/src/assets/images/execute_planner_icon_1784605259769.jpg" 
                alt="Execute Personal Planner Icon" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h1 className={`text-white font-bold font-sans tracking-tight flex items-center text-xs sm:text-sm md:text-base group-hover:${theme.text} transition-colors`}>
                Execute Personal Planner
              </h1>
            </div>
          </div>
        </div>

        {/* Top Control Buttons */}
        <div className="flex items-center space-x-2">
          {/* Back to Dashboard Hub */}
          {currentView === 'planner' && (
            <button
              onClick={handleBackToDashboard}
              className="bg-[#151619] hover:bg-gray-800 border border-gray-800 hover:border-gray-700 text-gray-300 hover:text-white text-xs px-3 py-2 rounded-md font-medium transition flex items-center space-x-1.5 active:scale-95"
            >
              <LayoutGrid className={`h-3.5 w-3.5 ${theme.text}`} />
              <span className="hidden sm:inline">Dashboard Hub</span>
            </button>
          )}

          {/* Toggle Interactive Element Editor Controls */}
          {currentView === 'planner' && (
            <button
              onClick={() => setIsRightPanelOpen(!isRightPanelOpen)}
              className={`text-xs px-3 py-2 rounded-md font-medium transition flex items-center space-x-1.5 border active:scale-95 ${
                isRightPanelOpen 
                  ? `${theme.badgeBg} ${theme.border} ${theme.text}` 
                  : 'bg-transparent hover:bg-gray-800 border-gray-700 text-gray-300 hover:text-white'
              }`}
              title="Toggle Element Editor Controls"
              id="toggle-right-panel-btn"
            >
              <Sliders className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{isRightPanelOpen ? 'Hide Controls' : 'Show Controls'}</span>
            </button>
          )}

        </div>
      </header>

      {/* MOTIVATIONAL QUOTE & MOBILE NAVIGATION LINE */}
      <div className="bg-[#151619] border-b border-gray-800/60 px-6 py-2.5 flex flex-col sm:flex-row sm:items-center sm:justify-between shrink-0 gap-3 no-print">
        <p className="text-xs text-gray-400 font-sans italic tracking-wide">
          "The key to growth is focusing on execution over outcome. Plan carefully, execute relentlessly."
        </p>
        
        {/* Mobile-only "Monthly Dashboard" select button (Only visible in planner + Monthly section) */}
        {currentView === 'planner' && selectedSection === 'Monthly Dashboards' && (
          <div className="lg:hidden shrink-0">
            <button
              onClick={() => setIsMonthSelectorOpen(true)}
              className={`w-full sm:w-auto ${theme.btnBg} text-white text-xs font-semibold px-3 py-1.5 rounded-md flex items-center justify-center space-x-1.5 transition active:scale-95 shadow-md`}
              style={{ boxShadow: `0 4px 6px -1px ${theme.primary}26` }}
              id="mobile-month-select-trigger"
            >
              <Layers className="h-3.5 w-3.5" />
              <span>Select Month: {activePage?.month || 'January'}</span>
            </button>
          </div>
        )}
      </div>

      {/* WORKSPACE DIVISIONS */}
      <div className="flex flex-1 overflow-hidden no-print relative">
        {/* Backdrop for Sidebar on mobile */}
        {currentView === 'planner' && isSidebarOpen && (
          <div 
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            id="sidebar-mobile-backdrop"
          />
        )}

        {/* Backdrop for RightPanel on mobile */}
        {currentView === 'planner' && isRightPanelOpen && (
          <div 
            onClick={() => setIsRightPanelOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            id="rightpanel-mobile-backdrop"
          />
        )}
        
        {/* Left selector */}
        {currentView === 'planner' && (
          <Sidebar
            activePageId={activePageId}
            onPageSelect={(id) => {
              setActivePageId(id);
              setIsSidebarOpen(false);
            }}
            customTexts={customTexts}
            selectedSection={selectedSection}
            onBackToDashboard={handleBackToDashboard}
            user={user}
            onGoogleLogin={handleGoogleLogin}
            isLoginInitiating={isLoginInitiating}
            onLogout={handleLogout}
            onInstallClick={handleInstallClick}
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            theme={theme}
            playSystemSound={playSystemSound}
            selectedMonthIdx={selectedMonthIdx}
            setSelectedMonthIdx={setSelectedMonthIdx}
          />
        )}

        {/* Center Canvas or Dashboard Hub */}
        {currentView === 'dashboard' ? (
          <DashboardHub
            state={state}
            customTexts={customTexts}
            onNavigateToSection={handleNavigateToSection}
            user={user}
            operatorName={operatorName}
            updateOperatorName={updateOperatorName}
            soundFXEnabled={soundFXEnabled}
            updateSoundFXEnabled={updateSoundFXEnabled}
            themeAccent={themeAccent}
            updateThemeAccent={updateThemeAccent}
            playSystemSound={playSystemSound}
            theme={theme}
          />
        ) : (
          <Workspace
            activePage={activePage}
            state={{ ...state, customTexts }}
            customTexts={customTexts}
            onCustomTextChange={handleCustomTextChange}
            onStateChange={setState}
            onPageSelect={(id) => {
              setActivePageId(id);
              const p = PAGES.find(x => x.id === id);
              if (p) setSelectedSection(p.section);
            }}
            todayTab={todayTab}
            setTodayTab={setTodayTab}
            weekTab={weekTab}
            setWeekTab={setWeekTab}
            monthTab={monthTab}
            setMonthTab={setMonthTab}
            selectedProjectId={selectedProjectId}
            setSelectedProjectId={setSelectedProjectId}
            projectTab={projectTab}
            setProjectTab={setProjectTab}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            selectedMonthIdx={selectedMonthIdx}
            setSelectedMonthIdx={setSelectedMonthIdx}
          />
        )}

        {/* Right Settings */}
        {currentView === 'planner' && (
          <div className={`${isRightPanelOpen ? 'block' : 'hidden lg:block lg:w-0 lg:overflow-hidden lg:border-l-0 shrink-0 z-50'}`}>
            <RightPanel
              activePage={activePage}
              state={state}
              onStateChange={setState}
              customTexts={customTexts}
              onCustomTextChange={handleCustomTextChange}
              onDownloadSVG={handleDownloadSVG}
              onDownloadZip={handleDownloadAllZip}
              onPrintPage={handlePrintPage}
              onResetAllData={handleResetToDefaults}
              isOpen={isRightPanelOpen}
              onClose={() => setIsRightPanelOpen(false)}
            />
          </div>
        )}
      </div>

      {/* PRINT-ONLY EMBEDDED SHEET VIEW */}
      {/* Fully styled block used during browser's native print layout capture */}
      <div className="print-only hidden print:block">
        <div 
          className="bg-[#FAF9F5] w-[148mm] h-[210mm] mx-auto overflow-hidden text-left"
          dangerouslySetInnerHTML={{ __html: generateSVGString(activePage, { ...state, customTexts }) }}
        />
      </div>

      {/* MOBILE MONTH SELECTOR OVERLAY */}
      {isMonthSelectorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 no-print" id="mobile-month-selector-modal">
          <div className="bg-[#1C1E22] border border-gray-800 rounded-xl w-full max-w-sm overflow-hidden shadow-2xl flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-800 flex items-center justify-between">
              <h3 className="text-white font-semibold text-sm flex items-center space-x-2">
                <Layers className={`h-4 w-4 ${theme.text}`} />
                <span>Monthly Dashboards</span>
              </h3>
              <button 
                onClick={() => setIsMonthSelectorOpen(false)}
                className="text-gray-400 hover:text-white p-1 rounded-md transition"
                id="close-month-modal-btn"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            
            {/* List of Months */}
            <div className="p-3 max-h-[320px] overflow-y-auto space-y-1 custom-scrollbar">
              {monthsData.map((m, idx) => {
                const isActive = activePageId === 6 && selectedMonthIdx === idx;
                return (
                  <button
                    key={m.num}
                    onClick={() => {
                      setActivePageId(6);
                      setSelectedMonthIdx(idx);
                      setIsMonthSelectorOpen(false);
                    }}
                    className={`w-full text-left flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition ${
                      isActive 
                        ? `${theme.bg} text-[#0c0c0e] font-semibold shadow` 
                        : 'text-gray-300 hover:bg-[#25282E]'
                    }`}
                    id={`modal-month-btn-${m.num}`}
                  >
                    <span>{m.name} Dashboard</span>
                    {isActive && <Check className="h-3.5 w-3.5" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* FLOATING QUICK ADD BUTTON */}
      <button
        onClick={() => setIsQuickAddOpen(true)}
        className="fixed bottom-24 right-6 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white p-4 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:rotate-6 active:scale-95 group z-40 no-print"
        title="Quick Add Item"
        id="floating-quick-add-trigger"
      >
        <Plus className="h-6 w-6 text-white group-hover:animate-pulse" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-out font-semibold text-xs ml-0 group-hover:ml-2 whitespace-nowrap">
          Quick Add
        </span>
      </button>

      {/* QUICK ADD MODAL */}
      <QuickAddModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        state={state}
        onStateChange={setState}
        onSuccess={triggerToast}
      />

      {/* FLOATING AI COPILOT BUTTON */}
      <button
        onClick={() => setIsAIDrawerOpen(true)}
        className={`fixed bottom-6 right-6 bg-gradient-to-r ${theme.fromTo} text-white p-4 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:rotate-3 active:scale-95 group z-40 no-print`}
        title="Ask Planner Copilot"
        id="floating-copilot-trigger"
      >
        <Sparkles className="h-6 w-6 text-white group-hover:animate-pulse" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-out font-semibold text-xs ml-0 group-hover:ml-2 whitespace-nowrap">
          Planner Copilot
        </span>
      </button>

      {/* AI DRAW PANEL / DRAWER */}
      <AIDrawer
        isOpen={isAIDrawerOpen}
        onClose={() => setIsAIDrawerOpen(false)}
        activePage={activePage}
        state={state}
        onStateChange={setState}
        customTexts={customTexts}
        onCustomTextChange={handleCustomTextChange}
        todayTab={todayTab}
        weekTab={weekTab}
        monthTab={monthTab}
        selectedProjectId={selectedProjectId}
        projectTab={projectTab}
        selectedDate={selectedDate}
        theme={theme}
      />

      {/* NOTIFICATION TOAST */}
      {showToast && (
        <div className="fixed bottom-6 left-6 bg-[#22252A] border border-gray-700 text-white px-4 py-3 rounded-lg shadow-2xl flex items-center space-x-2.5 z-50 text-xs font-medium animate-in fade-in slide-in-from-bottom-5">
          <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Check className="h-3 w-3" />
          </div>
          <span>{showToast}</span>
        </div>
      )}

    </div>
  );
}
