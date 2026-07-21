import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Sparkles, ArrowRight, Shield, AlertCircle, Info, ChevronDown, ChevronUp, Copy, Check, Settings } from "lucide-react";

interface LoginScreenProps {
  onLoginStart: () => void;
  isLoading: boolean;
  error: string | null;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLoginStart,
  isLoading,
  error,
}) => {
  const [showDeveloperGuide, setShowDeveloperGuide] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [configStatus, setConfigStatus] = useState<{
    loaded: boolean;
    configured: boolean;
    clientIdPresent: boolean;
    clientSecretPresent: boolean;
  }>({
    loaded: false,
    configured: false,
    clientIdPresent: false,
    clientSecretPresent: false,
  });

  useEffect(() => {
    fetch("/api/auth/config")
      .then((res) => res.json())
      .then((data) => {
        setConfigStatus({
          loaded: true,
          configured: data.configured,
          clientIdPresent: data.clientIdPresent,
          clientSecretPresent: data.clientSecretPresent,
        });
        if (!data.configured) {
          setShowDeveloperGuide(true);
        }
      })
      .catch((err) => {
        console.error("Failed to load auth config status", err);
      });
  }, []);

  // Retrieve actual URL strings from the container context to present to user
  const devCallbackUrl = `${window.location.origin}/auth/callback`;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#121316] text-gray-200 flex flex-col items-center justify-center p-6 relative overflow-y-auto selection:bg-indigo-600/30 font-sans">
      
      {/* Decorative ambient backgrounds */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-[350px] h-[350px] bg-emerald-600/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Primary Card */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md bg-[#1C1E22] border border-gray-800/80 rounded-2xl p-8 shadow-2xl relative z-10"
      >
        {/* Logo Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-indigo-500/30 flex items-center justify-center shadow-lg shadow-indigo-600/20">
            <img 
              src="/src/assets/images/execute_planner_icon_1784605259769.jpg" 
              alt="Execute Personal Planner Icon" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* Heading */}
        <div className="text-center mb-8">
          <h2 className="text-white text-xl md:text-2xl font-bold tracking-tight">
            Personal OS Planner Hub
          </h2>
          <p className="text-gray-400 text-xs mt-2 font-mono">
            SECURE STRATEGIC REALIGNMENT
          </p>
        </div>

        {/* Brief description */}
        <p className="text-gray-300 text-sm leading-relaxed text-center mb-6">
          Welcome to your centralized personal command center. Sign in using your Google Account to securely persist your quarterly roadmap, habit scores, project milestones, and custom schedules.
        </p>

        {/* Dynamic setup warning banner */}
        {configStatus.loaded && !configStatus.configured && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-4 bg-amber-950/30 border border-amber-900/50 rounded-xl text-xs space-y-2 text-amber-300"
          >
            <div className="flex items-start space-x-2.5">
              <AlertCircle className="h-4 w-4 shrink-0 text-amber-500 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-200">OAuth Setup Required</p>
                <p className="text-gray-400 mt-1 leading-normal">
                  Before you can use "Sign in with Google", you must configure your Google Client ID and Client Secret under <strong>Settings &rarr; Secrets</strong>.
                </p>
              </div>
            </div>
            <div className="pt-2 border-t border-amber-900/30 flex justify-between items-center text-[10px] text-gray-500 font-mono">
              <span>GOOGLE_CLIENT_ID: {configStatus.clientIdPresent ? "✅ READY" : "❌ MISSING"}</span>
              <span>CLIENT_SECRET: {configStatus.clientSecretPresent ? "✅ READY" : "❌ MISSING"}</span>
            </div>
          </motion.div>
        )}

        {/* Error Notification */}
        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-4 bg-red-950/40 border border-red-900/50 rounded-xl flex items-start space-x-3 text-xs text-red-400"
          >
            <AlertCircle className="h-4 w-4 shrink-0 text-red-500 mt-0.5" />
            <div>
              <p className="font-semibold text-red-300">Authentication Alert</p>
              <p className="mt-1 text-gray-400 leading-normal">{error}</p>
            </div>
          </motion.div>
        )}

        {/* Login Action Trigger */}
        <button
          onClick={onLoginStart}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white py-3.5 px-4 rounded-xl font-semibold text-sm tracking-wide transition-all duration-200 shadow-lg shadow-indigo-600/10 flex items-center justify-center space-x-2.5 active:scale-98 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
          id="google-login-btn"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white/35 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              {/* Custom SVG Google Logo */}
              <svg className="w-4 h-4" viewBox="0 0 24 24">
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
              <span>Sign in with Google</span>
              <ArrowRight className="h-4 w-4 text-indigo-200" />
            </>
          )}
        </button>

        {/* Security / Verification Stamp */}
        <div className="mt-8 pt-6 border-t border-gray-800/60 flex items-center justify-center space-x-2 text-[11px] text-gray-500 font-mono">
          <Shield className="h-3.5 w-3.5 text-emerald-600" />
          <span>AES-256 SESSION ENCRYPTION ACTIVE</span>
        </div>
      </motion.div>

      {/* Developer Configuration Guide */}
      <div className="w-full max-w-md mt-6 relative z-10">
        <button
          onClick={() => setShowDeveloperGuide(!showDeveloperGuide)}
          className="w-full flex items-center justify-between px-5 py-3.5 bg-[#1C1E22]/60 hover:bg-[#1C1E22]/90 border border-gray-800/50 rounded-xl text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          <span className="flex items-center space-x-2">
            <Info className="h-4 w-4 shrink-0 text-indigo-500" />
            <span>Developer Configuration Settings</span>
          </span>
          {showDeveloperGuide ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>

        {showDeveloperGuide && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#151619] border border-gray-800/80 rounded-xl p-5 mt-2 text-xs space-y-4 shadow-xl"
          >
            <p className="text-gray-400 leading-relaxed font-sans">
              To test or deploy Google Login in this Workspace environment, complete the following steps in your Google Cloud Console:
            </p>

            {/* Steps list */}
            <ol className="list-decimal pl-4 text-gray-300 space-y-3 font-sans">
              <li>
                Go to the <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noreferrer" className="text-indigo-400 underline hover:text-indigo-300">Google Cloud Console APIs & Credentials</a> page.
              </li>
              <li>
                Create a project (or select an existing one) and navigate to the <strong>OAuth consent screen</strong>. Configure it with "External" and fill in the required fields.
              </li>
              <li>
                Go to the <strong>Credentials</strong> tab, click <strong>Create Credentials</strong> &rarr; <strong>OAuth client ID</strong>. Select <strong>Web application</strong>.
              </li>
              <li>
                Under <strong>Authorized redirect URIs</strong>, paste the exact callback URL below:
                <div className="mt-2 flex items-center bg-[#1F2126] border border-gray-800 rounded-lg p-2 font-mono text-[10px] text-gray-300 relative">
                  <span className="truncate pr-10">{devCallbackUrl}</span>
                  <button
                    onClick={() => copyToClipboard(devCallbackUrl, "cb")}
                    className="absolute right-1 top-1 text-gray-500 hover:text-gray-300 p-1.5 rounded transition"
                    title="Copy URL"
                  >
                    {copiedText === "cb" ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </li>
              <li>
                Click <strong>Create</strong>, then copy your <strong>Client ID</strong> and <strong>Client Secret</strong>.
              </li>
              <li>
                Click on the <strong>Settings</strong> gear icon inside AI Studio Build (top right), select <strong>Secrets / Env Variables</strong>, and add:
                <ul className="list-disc pl-5 mt-1.5 space-y-1 text-gray-400 font-mono text-[10px]">
                  <li><strong className="text-gray-300">GOOGLE_CLIENT_ID</strong> = your_client_id</li>
                  <li><strong className="text-gray-300">GOOGLE_CLIENT_SECRET</strong> = your_client_secret</li>
                  <li><strong className="text-gray-300">SESSION_SECRET</strong> = some_long_random_string</li>
                </ul>
              </li>
            </ol>
          </motion.div>
        )}
      </div>
    </div>
  );
};
