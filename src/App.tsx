"use client";
import React, { useState, useEffect } from 'react';
import { 
  Microscope, 
  Dna, 
  Target, 
  Activity, 
  Zap, 
  FolderOpen, 
  Bot, 
  HelpCircle, 
  Sun, 
  Moon, 
  FileText, 
  Globe, 
  ShieldCheck, 
  Search,
  Sparkles,
  Stethoscope,
  Heart,
  Download,
  User as UserIcon,
  ShieldAlert,
  LogIn,
  Sliders,
  Bookmark
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Auth Context
import { AuthProvider, useAuth } from './context/AuthContext';

// Components
import { ClinicalTrialsExplorer } from './components/ClinicalTrialsExplorer';
import { BiomarkerAnalyzer } from './components/BiomarkerAnalyzer';
import { TreatmentPlanner } from './components/TreatmentPlanner';
import { HealthVitalsDashboard } from './components/HealthVitalsDashboard';
import { EvidenceVault } from './components/EvidenceVault';
import { MedicalRecordsVault } from './components/MedicalRecordsVault';
import { AIChatPanel } from './components/AIChatPanel';
import { HelpKnowledgeBase } from './components/HelpKnowledgeBase';
import { DoctorSummaryModal } from './components/DoctorSummaryModal';
import { AuthModal } from './components/AuthModal';
import { UserProfileModal } from './components/UserProfileModal';
import { AdminDashboard } from './components/AdminDashboard';

type TabType = 'trials' | 'biomarkers' | 'planner' | 'vitals' | 'protocols' | 'records' | 'chat' | 'help' | 'admin';

const LANGUAGES = [
  { code: 'English', label: 'EN • English' },
  { code: 'Spanish', label: 'ES • Español' },
  { code: 'French', label: 'FR • Français' },
  { code: 'German', label: 'DE • Deutsch' },
  { code: 'Arabic', label: 'AR • العربية' },
  { code: 'Chinese', label: 'ZH • 中文' },
  { code: 'Japanese', label: 'JA • 日本語' },
  { code: 'Portuguese', label: 'PT • Português' },
  { code: 'Hindi', label: 'HI • हिन्दी' }
];

function MainAppContent() {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('trials');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('English');
  const [isDoctorModalOpen, setIsDoctorModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  
  // Floating AI drawer / quick search state
  const [initialAIChatQuery, setInitialAIChatQuery] = useState<string>('');

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleAskAIAboutDocument = (docName: string) => {
    setInitialAIChatQuery(`Please synthesize the clinical findings and key markers from "${docName}" for my treatment plan.`);
    setActiveTab('chat');
  };

  const navItems = [
    { id: 'trials', label: 'Clinical Trials', icon: Microscope, badge: 'Live' },
    { id: 'biomarkers', label: 'Biomarker Analyzer', icon: Dna },
    { id: 'planner', label: 'Treatment Planner', icon: Target },
    { id: 'vitals', label: 'Biometric Telemetry', icon: Activity },
    { id: 'protocols', label: 'Protocol Vault', icon: Zap },
    { id: 'records', label: 'Medical Records', icon: FolderOpen },
    { id: 'chat', label: 'AI Clinical Assistant', icon: Bot, badge: 'Gemini' },
    { id: 'help', label: 'Knowledge Base', icon: HelpCircle },
    ...(user?.role === 'admin' ? [{ id: 'admin', label: 'Admin Console', icon: ShieldAlert, badge: 'Admin' }] : [])
  ];

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} transition-colors duration-200`}>
      {/* Top Professional Header */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Logo & Platform Name */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('trials')}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-sm">
                <Stethoscope size={22} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">
                    OmniHealth
                  </span>
                  <span className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold rounded-full border border-indigo-200 dark:border-indigo-800">
                    Clinical Intelligence
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Evidence-based trials, biomarkers & admin management
                </p>
              </div>
            </div>

            {/* Quick Actions & User Account */}
            <div className="flex items-center gap-2.5">
              {/* Language Selector */}
              <div className="hidden sm:flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl text-xs">
                <Globe size={14} className="text-slate-400" />
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="bg-transparent text-slate-700 dark:text-slate-200 text-xs focus:outline-none cursor-pointer font-medium"
                >
                  {LANGUAGES.map(l => (
                    <option key={l.code} value={l.code} className="dark:bg-slate-900 text-slate-800 dark:text-slate-200">
                      {l.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Doctor Consultation Brief Button */}
              <button
                onClick={() => setIsDoctorModalOpen(true)}
                className="hidden md:flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 rounded-xl text-xs font-bold transition-all shadow-xs"
              >
                <FileText size={14} />
                Doctor Summary
              </button>

              {/* Admin Portal Quick Switch */}
              {user?.role === 'admin' && (
                <button
                  onClick={() => setActiveTab(activeTab === 'admin' ? 'trials' : 'admin')}
                  className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'admin'
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 hover:bg-amber-100'
                  }`}
                >
                  <ShieldAlert size={14} />
                  {activeTab === 'admin' ? 'Exit Admin' : 'Admin Console'}
                </button>
              )}

              {/* Dark / Light Mode Toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-xl bg-slate-100 dark:bg-slate-800 transition-colors"
                title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {darkMode ? <Sun size={16} /> : <Moon size={16} />}
              </button>

              {/* User Account / Profile Button */}
              {isAuthenticated && user ? (
                <button
                  onClick={() => setIsProfileModalOpen(true)}
                  className="flex items-center gap-2 p-1 pl-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-2xl border border-slate-200 dark:border-slate-700 transition-all text-xs font-bold"
                  title="View Profile & Settings"
                >
                  <span className="hidden sm:inline text-slate-700 dark:text-slate-300 max-w-[120px] truncate">
                    {user.name.split(' ')[0]}
                  </span>
                  <span className={`px-1.5 py-0.5 rounded-md text-[9px] font-bold uppercase ${
                    user.role === 'admin'
                      ? 'bg-amber-200 text-amber-900 dark:bg-amber-900 dark:text-amber-200'
                      : 'bg-indigo-200 text-indigo-900 dark:bg-indigo-900 dark:text-indigo-200'
                  }`}>
                    {user.role}
                  </span>
                  <img
                    src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}`}
                    alt={user.name}
                    className="w-7 h-7 rounded-xl object-cover bg-slate-200 border border-slate-300 dark:border-slate-600"
                  />
                </button>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
                >
                  <LogIn size={14} />
                  <span>Sign In</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Primary Navigation Tabs */}
        <div className="border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-900/50 overflow-x-auto custom-scrollbar">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex space-x-1 py-1.5" aria-label="Tabs">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as TabType)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                      isActive
                        ? item.id === 'admin'
                          ? 'bg-amber-500 text-white shadow-xs'
                          : 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs border border-slate-200/80 dark:border-slate-700'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <Icon size={15} className={isActive ? (item.id === 'admin' ? 'text-white' : 'text-indigo-600 dark:text-indigo-400') : 'text-slate-400'} />
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className={`px-1.5 py-0.2 rounded-md text-[9px] font-bold ${
                        item.badge === 'Admin'
                          ? 'bg-amber-200 text-amber-900 dark:bg-amber-950/80 dark:text-amber-200'
                          : item.badge === 'Live'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* Main App Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            {/* ADMIN CONSOLE VIEW */}
            {activeTab === 'admin' && (
              <AdminDashboard onBackToUser={() => setActiveTab('trials')} />
            )}

            {/* USER PORTAL VIEWS */}
            {activeTab === 'trials' && (
              <ClinicalTrialsExplorer selectedLanguage={selectedLanguage} />
            )}

            {activeTab === 'biomarkers' && (
              <BiomarkerAnalyzer selectedLanguage={selectedLanguage} />
            )}

            {activeTab === 'planner' && (
              <TreatmentPlanner onExportSummary={() => setIsDoctorModalOpen(true)} />
            )}

            {activeTab === 'vitals' && (
              <HealthVitalsDashboard />
            )}

            {activeTab === 'protocols' && (
              <EvidenceVault selectedLanguage={selectedLanguage} />
            )}

            {activeTab === 'records' && (
              <MedicalRecordsVault onSelectForChat={handleAskAIAboutDocument} />
            )}

            {activeTab === 'chat' && (
              <AIChatPanel 
                selectedLanguage={selectedLanguage}
                onLanguageChange={setSelectedLanguage}
                initialQuery={initialAIChatQuery}
              />
            )}

            {activeTab === 'help' && (
              <HelpKnowledgeBase />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Modals */}
      <DoctorSummaryModal
        isOpen={isDoctorModalOpen}
        onClose={() => setIsDoctorModalOpen(false)}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onOpenAdmin={() => setActiveTab('admin')}
      />

      {/* Floating Quick Research Button */}
      {activeTab !== 'chat' && activeTab !== 'admin' && (
        <button
          onClick={() => setActiveTab('chat')}
          className="fixed bottom-6 right-6 z-30 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-bold transition-all hover:scale-105"
          title="Open AI Research Assistant"
        >
          <Bot size={18} />
          <span>Ask AI Assistant</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </button>
      )}

      {/* Clean Global Footer */}
      <footer className="border-t border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-emerald-500" />
            <span>OmniHealth Enterprise • Clinical Intelligence & Trials Governance Portal</span>
          </div>

          <div className="flex items-center gap-4">
            {user?.role === 'admin' && (
              <button onClick={() => setActiveTab('admin')} className="text-amber-600 dark:text-amber-400 font-bold hover:underline">
                Admin Console
              </button>
            )}
            <button onClick={() => setIsDoctorModalOpen(true)} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Doctor Summary
            </button>
            <button onClick={() => setActiveTab('help')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Medical Glossary
            </button>
            <button onClick={() => setIsProfileModalOpen(true)} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              My Profile
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}
