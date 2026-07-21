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
  Plus
} from 'lucide-react';

const LOCAL_STORAGE_KEY_STATE = 'canva_planner_state_v2';
const LOCAL_STORAGE_KEY_TEXTS = 'canva_planner_texts_v2';

export default function App() {
  const [activePageId, setActivePageId] = useState<number>(2); // Default to Annual Vision (id: 2)
  const [isMonthSelectorOpen, setIsMonthSelectorOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'dashboard' | 'planner'>('dashboard');
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);
  const [isAIDrawerOpen, setIsAIDrawerOpen] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

  // User Authentication states
  const [user, setUser] = useState<{ id: string; email: string; display_name: string; avatar_url: string } | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoginInitiating, setIsLoginInitiating] = useState<boolean>(false);

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

  const activePage = PAGES.find(p => p.id === activePageId) || PAGES[0];

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
      <header className="bg-[#1C1E22] border-b border-gray-800 px-6 py-3.5 flex items-center justify-between shrink-0 no-print">
        <div 
          onClick={handleBackToDashboard}
          className="flex items-center space-x-3 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-lg overflow-hidden border border-indigo-500/30 flex items-center justify-center shadow-md shadow-indigo-600/10 transition-all group-hover:border-indigo-400">
            <img 
              src="/src/assets/images/execute_planner_icon_1784605259769.jpg" 
              alt="Execute Personal Planner Icon" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <h1 className="text-white font-bold font-sans tracking-tight flex items-center text-sm md:text-base group-hover:text-indigo-400 transition-colors">
              Execute Personal Planner
              <span className="ml-2.5 px-2 py-0.5 text-[10px] font-semibold bg-indigo-950 text-indigo-300 rounded border border-indigo-800/40">
                Hub
              </span>
            </h1>
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
              <LayoutGrid className="h-3.5 w-3.5 text-indigo-400" />
              <span className="hidden sm:inline">Dashboard Hub</span>
            </button>
          )}

          {/* Toggle Interactive Element Editor Controls */}
          {currentView === 'planner' && (
            <button
              onClick={() => setIsRightPanelOpen(!isRightPanelOpen)}
              className={`text-xs px-3 py-2 rounded-md font-medium transition flex items-center space-x-1.5 border active:scale-95 ${
                isRightPanelOpen 
                  ? 'bg-indigo-600/10 hover:bg-indigo-600/20 border-indigo-500/30 text-indigo-300' 
                  : 'bg-transparent hover:bg-gray-800 border-gray-700 text-gray-300 hover:text-white'
              }`}
              title="Toggle Element Editor Controls"
              id="toggle-right-panel-btn"
            >
              <Sliders className="h-3.5 w-3.5" />
              <span className="hidden md:inline">{isRightPanelOpen ? 'Hide Controls' : 'Show Controls'}</span>
            </button>
          )}

          {/* Reset Blueprint */}
          <button
            onClick={handleResetToDefaults}
            className="bg-transparent hover:bg-gray-800 border border-gray-700 text-gray-300 hover:text-white text-xs px-3 py-2 rounded-md font-medium transition flex items-center space-x-1.5 active:scale-95"
            title="Reset All Edits to Default"
            id="reset-defaults-btn"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Reset Defaults</span>
          </button>

          {/* Download App (PWA) button */}
          <button
            onClick={handleInstallClick}
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-4 py-2 rounded-md font-semibold transition flex items-center space-x-1.5 shadow-lg shadow-emerald-600/15 active:scale-95"
            id="download-app-btn"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Download App</span>
          </button>

          {/* Optional Google Account access controls (non-blocking) */}
          {user ? (
            <div className="flex items-center space-x-3 pl-3 border-l border-gray-800 ml-1 shrink-0">
              <img
                src={user.avatar_url}
                alt={user.display_name}
                className="w-7 h-7 rounded-full border border-indigo-500/30 object-cover"
                referrerPolicy="no-referrer"
              />
              <span className="hidden lg:inline text-xs font-semibold text-gray-300 max-w-[120px] truncate">
                {user.display_name}
              </span>
              <button
                onClick={handleLogout}
                className="bg-transparent hover:bg-red-950/20 hover:text-red-400 text-gray-400 hover:text-white text-xs px-2.5 py-1.5 rounded border border-transparent hover:border-red-900/40 transition active:scale-95 cursor-pointer font-medium"
                id="header-logout-btn"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2 pl-3 border-l border-gray-800 ml-1 shrink-0">
              <button
                onClick={handleGoogleLogin}
                disabled={isLoginInitiating}
                className="bg-[#2A2D35] hover:bg-indigo-600 hover:text-white hover:border-indigo-500 text-gray-300 text-xs px-3 py-2 rounded-md font-semibold border border-gray-700 transition flex items-center space-x-2 active:scale-95 cursor-pointer disabled:opacity-50"
                id="header-login-btn"
                title="Connect Google Account to store and backup your data"
              >
                {isLoginInitiating ? (
                  <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                )}
                <span>Connect Google</span>
              </button>
            </div>
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
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-3 py-1.5 rounded-md flex items-center justify-center space-x-1.5 transition active:scale-95 shadow-md shadow-indigo-600/15"
              id="mobile-month-select-trigger"
            >
              <Layers className="h-3.5 w-3.5" />
              <span>Select Month: {activePage?.month || 'January'}</span>
            </button>
          </div>
        )}
      </div>

      {/* WORKSPACE DIVISIONS */}
      <div className="flex flex-1 overflow-hidden no-print">
        
        {/* Left selector */}
        {currentView === 'planner' && (
          <Sidebar
            activePageId={activePageId}
            onPageSelect={setActivePageId}
            customTexts={customTexts}
            selectedSection={selectedSection}
            onBackToDashboard={handleBackToDashboard}
          />
        )}

        {/* Center Canvas or Dashboard Hub */}
        {currentView === 'dashboard' ? (
          <DashboardHub
            state={state}
            customTexts={customTexts}
            onNavigateToSection={handleNavigateToSection}
            user={user}
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
          />
        )}

        {/* Right Settings */}
        {currentView === 'planner' && isRightPanelOpen && (
          <RightPanel
            activePage={activePage}
            state={state}
            onStateChange={setState}
            customTexts={customTexts}
            onCustomTextChange={handleCustomTextChange}
            onDownloadSVG={handleDownloadSVG}
            onDownloadZip={handleDownloadAllZip}
            onPrintPage={handlePrintPage}
          />
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
                <Layers className="h-4 w-4 text-indigo-400" />
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
              {PAGES.filter(p => p.section === 'Monthly Dashboards').map(page => {
                const isActive = activePageId === page.id;
                return (
                  <button
                    key={page.id}
                    onClick={() => {
                      setActivePageId(page.id);
                      setIsMonthSelectorOpen(false);
                    }}
                    className={`w-full text-left flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition ${
                      isActive 
                        ? 'bg-indigo-600 text-white font-semibold shadow' 
                        : 'text-gray-300 hover:bg-[#25282E]'
                    }`}
                    id={`modal-month-btn-${page.id}`}
                  >
                    <span>{page.month || page.title}</span>
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
        className="fixed bottom-6 right-6 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white p-4 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:rotate-3 active:scale-95 group z-40 no-print"
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
