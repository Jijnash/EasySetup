import React, { useState, useEffect, useMemo } from 'react';
import { AudienceType, DevFieldType, TargetOS, GeneratedSetupSession, DiagnosticRecord, DiagnosticResponse, SoftwareApp, BrandingSettings, ScaffoldingTemplate, UserProfile } from './types';
import { SOFTWARE_CATALOG, recommendApps } from './data/appsData';
import { SCAFFOLDING_TEMPLATES } from './data/templatesData';
import { generateWindowsBatScript, generateMacCommandScript, DEFAULT_BRANDING } from './utils/scriptGenerator';
import { Navbar, NavTab } from './components/Navbar';
import { supabase } from './lib/supabase';
import { LandingPage } from './components/LandingPage';
import { OrchestratorView } from './components/OrchestratorView';
import { AppCatalog } from './components/AppCatalog';
import { AiSetupChat } from './components/AiSetupChat';
import { TemplateScaffolding } from './components/TemplateScaffolding';
import { AdminPanel } from './components/AdminPanel';
import { SmartScreenGuideModal } from './components/SmartScreenGuideModal';
import { DiagnosticsHistoryModal } from './components/DiagnosticsHistoryModal';
import { AuthModal } from './components/AuthModal';
import { PricingModal } from './components/PricingModal';
import { UserAccountModal } from './components/UserAccountModal';
import { Monitor, ShieldAlert, Sparkles, Zap, CheckCircle2, Award, HardDrive, Clock, ArrowRight } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('landing');

  // Software Catalog State
  const [catalog, setCatalog] = useState<SoftwareApp[]>(SOFTWARE_CATALOG);

  // Site Branding State
  const [branding, setBranding] = useState<BrandingSettings>(DEFAULT_BRANDING);

  // Scaffolding Templates State
  const [templates, setTemplates] = useState<ScaffoldingTemplate[]>(SCAFFOLDING_TEMPLATES);

  // User Profile & SaaS Auth State
  const [user, setUser] = useState<UserProfile | null>(null);
  
  // Pending Action State (for intercepting workflows with Auth)
  const [pendingAction, setPendingAction] = useState<'generate' | null>(null);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState<'login' | 'signup'>('login');
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);

  // Auto-detect OS via navigator.userAgent (FR8)
  const [targetOS, setTargetOS] = useState<TargetOS>(() => {
    if (typeof window !== 'undefined' && window.navigator && window.navigator.userAgent) {
      const ua = window.navigator.userAgent.toLowerCase();
      if (ua.includes('mac') || ua.includes('darwin')) {
        return 'mac';
      }
    }
    return 'windows';
  });

  const [currentAudience, setCurrentAudience] = useState<AudienceType | null>('both');
  const [currentDevField, setCurrentDevField] = useState<DevFieldType | null>('web_dev');

  const [selectedAppIds, setSelectedAppIds] = useState<string[]>(() => {
    return recommendApps('both', 'web_dev');
  });

  // Fetch Supabase Data
  useEffect(() => {
    const fetchSupabaseData = async () => {
      const { data: appsData, error: appsError } = await supabase.from('apps').select('*').eq('active', true);
      if (appsData && appsData.length > 0) {
        setCatalog(appsData as SoftwareApp[]);
      }

      const { data: brandingData, error: brandingError } = await supabase.from('branding_settings').select('*').eq('id', 1).single();
      if (brandingData) {
        setBranding(brandingData as BrandingSettings);
      }
    };
    fetchSupabaseData();
  }, []);

  const [isSmartScreenGuideOpen, setIsSmartScreenGuideOpen] = useState<boolean>(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);

  const [sessions, setSessions] = useState<GeneratedSetupSession[]>([]);
  const [diagnostics, setDiagnostics] = useState<DiagnosticRecord[]>([]);

  // Open Auth Modal helper
  const handleOpenAuth = (mode: 'login' | 'signup' = 'login') => {
    setAuthInitialMode(mode);
    setIsAuthModalOpen(true);
  };

  // Upgrade Plan Handler
  const handleUpgradePlan = (planId: 'free' | 'pro' | 'team') => {
    setUser((prev) => {
      if (!prev) {
        return {
          id: `usr_${Date.now()}`,
          name: 'Developer',
          email: 'dev@easysetup.dev',
          plan: planId,
          apiCallsUsed: 1,
          apiCallsLimit: planId === 'free' ? 50 : 1000,
          scriptsGeneratedCount: 1,
          joinedDate: 'Aug 2026',
        };
      }
      return {
        ...prev,
        plan: planId,
        apiCallsLimit: planId === 'free' ? 50 : planId === 'pro' ? 1000 : 5000,
      };
    });
  };

  // Apply recommendations when user changes Audience / Dev Field
  const handleSelectRecommendation = (audience: AudienceType, devField: DevFieldType | null) => {
    setCurrentAudience(audience);
    setCurrentDevField(devField);
    const recommended = recommendApps(audience, devField);
    setSelectedAppIds(recommended);
  };

  const handleToggleApp = (appId: string) => {
    setSelectedAppIds((prev) =>
      prev.includes(appId) ? prev.filter((id) => id !== appId) : [...prev, appId]
    );
  };

  const handleSelectAll = (appIds: string[]) => {
    setSelectedAppIds((prev) => Array.from(new Set([...prev, ...appIds])));
  };

  const handleDeselectAll = () => {
    setSelectedAppIds([]);
  };

  const selectedAppsList = useMemo(() => {
    return catalog.filter((app) => selectedAppIds.includes(app.id));
  }, [selectedAppIds, catalog]);

  const activeSessionId = useMemo(() => {
    return `EZS-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
  }, [selectedAppIds, targetOS]);

  const scriptContent = useMemo(() => {
    if (targetOS === 'windows') {
      return generateWindowsBatScript(selectedAppsList, [], activeSessionId, branding);
    } else {
      return generateMacCommandScript(selectedAppsList, [], activeSessionId, branding);
    }
  }, [selectedAppsList, targetOS, activeSessionId, branding]);

  const handleGenerateScript = async () => {
    if (!user) {
      setPendingAction('generate');
      handleOpenAuth('signup');
      return;
    }

    const totalSize = selectedAppsList.reduce((acc, a) => acc + a.estimatedSizeMb, 0);
    const totalTime = selectedAppsList.reduce((acc, a) => acc + a.estimatedTimeMins, 0);

    const newSession: GeneratedSetupSession = {
      id: activeSessionId,
      timestamp: new Date().toLocaleString(),
      selectedAppIds: [...selectedAppIds],
      os: targetOS,
      scriptType: targetOS === 'windows' ? '.bat' : '.command',
      totalSizeMb: totalSize,
      totalTimeMins: totalTime,
    };

    setSessions((prev) => [newSession, ...prev]);

    // Save to Supabase
    await supabase.from('setup_sessions').insert({
      session_code: activeSessionId,
      selected_apps: [...selectedAppIds],
      os: targetOS,
    });

    // Track user generated count
    if (user) {
      setUser((prev) => prev ? { ...prev, scriptsGeneratedCount: prev.scriptsGeneratedCount + 1 } : null);
    }
    
    // Trigger automatic download
    const filename = targetOS === 'windows' ? `easysetup_${activeSessionId}.bat` : `easysetup_${activeSessionId}.command`;
    const scriptContentStr = targetOS === 'windows' ? generateWindowsBatScript(selectedAppsList, [], activeSessionId, branding) : generateMacCommandScript(selectedAppsList, [], activeSessionId, branding);
    
    // Create a temporary link to trigger download
    const blob = new Blob([scriptContentStr], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // Redirect to AI Agents page
    setActiveTab('fix');
  };

  const handleRecordDiagnostic = (res: DiagnosticResponse, rawError: string, os: TargetOS) => {
    const record: DiagnosticRecord = {
      ...res,
      id: `diag_${Date.now()}`,
      os,
      error_text: rawError,
      resolved: false,
      created_at: new Date().toLocaleString(),
    };
    setDiagnostics((prev) => [record, ...prev]);

    // Increment user API usage
    if (user) {
      setUser((prev) => prev ? { ...prev, apiCallsUsed: prev.apiCallsUsed + 1 } : null);
    }
  };

  return (
    <div className="min-h-screen bg-background bg-grid-pattern text-primary font-sans flex flex-col antialiased relative">
      <div className="absolute inset-0 bg-background/90 z-0 pointer-events-none" />
      
      <div className="relative z-10 flex-1 flex flex-col">
        {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        targetOS={targetOS}
        setTargetOS={setTargetOS}
        onOpenSmartScreenGuide={() => setIsSmartScreenGuideOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        generatedCount={sessions.length}
        user={user}
        onOpenAuth={handleOpenAuth}
        onOpenAccount={() => setIsAccountModalOpen(true)}
        onOpenPricing={() => setIsPricingModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab 1: Home / Landing Page with Live Demo */}
        {activeTab === 'landing' && (
          <LandingPage
            onStartSetup={() => setActiveTab('installer')}
            onOpenFix={() => setActiveTab('fix')}
            onOpenScaffolding={() => setActiveTab('scaffolding')}
          />
        )}

        {/* Tab 2: Orchestrator 3-Column View */}
        {activeTab === 'installer' && (
          <div className="h-full">
            {/* 3-Column Layout Component */}
            <OrchestratorView
              selectedAppIds={selectedAppIds}
              onToggleApp={handleToggleApp}
              onSelectAll={handleSelectAll}
              onDeselectAll={handleDeselectAll}
              targetOS={targetOS}
              onGenerateClick={handleGenerateScript}
              onSelectRecommendation={handleSelectRecommendation}
            />
          </div>
        )}

        {/* Tab 3: Session-Aware AI Setup Chat */}
        {activeTab === 'fix' && (
          <AiSetupChat
            sessions={sessions}
            targetOS={targetOS}
            setTargetOS={setTargetOS}
            onRecordDiagnostic={handleRecordDiagnostic}
          />
        )}

        {/* Tab 4: CLI Scaffolding */}
        {activeTab === 'scaffolding' && <TemplateScaffolding />}

        {/* Tab 5: App Catalog Overview & Stats */}
        {activeTab === 'catalog' && (
          <div className="space-y-6">
            <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 space-y-4">
              <h2 className="text-xl font-bold text-white">Full Software Catalog ({catalog.length} Apps)</h2>
              <p className="text-sm text-slate-400">
                Browse our curated list of student and developer apps with Winget & Homebrew package identifiers.
              </p>
            </div>

            <AppCatalog
              selectedAppIds={selectedAppIds}
              onToggleApp={handleToggleApp}
              onSelectAll={handleSelectAll}
              onDeselectAll={handleDeselectAll}
              targetOS={targetOS}
              onGenerateClick={handleGenerateScript}
            />
          </div>
        )}

        {/* Tab 6: Admin Panel / CMS */}
        {activeTab === 'admin' && (
          <AdminPanel
            catalog={catalog}
            setCatalog={setCatalog}
            branding={branding}
            setBranding={setBranding}
            templates={templates}
            setTemplates={setTemplates}
          />
        )}
      </main>

      {/* Auth Modal (Sign in / Sign up) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authInitialMode}
        onLoginSuccess={async (loggedInUser) => {
          setUser(loggedInUser);
          if (pendingAction === 'generate') {
             setPendingAction(null);
             
             // Directly simulate generating the script now that they are logged in
             const activeSessionIdNow = `EZS-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
             const totalSize = selectedAppsList.reduce((acc, a) => acc + a.estimatedSizeMb, 0);
             const totalTime = selectedAppsList.reduce((acc, a) => acc + a.estimatedTimeMins, 0);

             const newSession: GeneratedSetupSession = {
               id: activeSessionIdNow,
               timestamp: new Date().toLocaleString(),
               selectedAppIds: [...selectedAppIds],
               os: targetOS,
               scriptType: targetOS === 'windows' ? '.bat' : '.command',
               totalSizeMb: totalSize,
               totalTimeMins: totalTime,
             };

             setSessions((prev) => [newSession, ...prev]);

             const filename = targetOS === 'windows' ? `easysetup_${activeSessionIdNow}.bat` : `easysetup_${activeSessionIdNow}.command`;
             const scriptContentStr = targetOS === 'windows' ? generateWindowsBatScript(selectedAppsList, [], activeSessionIdNow, branding) : generateMacCommandScript(selectedAppsList, [], activeSessionIdNow, branding);
             
             const blob = new Blob([scriptContentStr], { type: 'text/plain' });
             const url = URL.createObjectURL(blob);
             const a = document.createElement('a');
             a.href = url;
             a.download = filename;
             document.body.appendChild(a);
             a.click();
             document.body.removeChild(a);
             URL.revokeObjectURL(url);
             
             setActiveTab('fix');
          }
        }}
      />

      {/* Pricing & SaaS Subscription Modal */}
      <PricingModal
        isOpen={isPricingModalOpen}
        onClose={() => setIsPricingModalOpen(false)}
        user={user}
        onUpgradePlan={handleUpgradePlan}
      />

      {/* User Account Drawer / Modal */}
      {user && (
        <UserAccountModal
          isOpen={isAccountModalOpen}
          onClose={() => setIsAccountModalOpen(false)}
          user={user}
          sessions={sessions}
          onOpenPricing={() => setIsPricingModalOpen(true)}
          onOpenSessionChat={(sessionId) => {
            setActiveTab('fix');
          }}
          onLogout={() => setUser(null)}
        />
      )}

      {/* SmartScreen & Gatekeeper Safety Guide Modal */}
      <SmartScreenGuideModal
        isOpen={isSmartScreenGuideOpen}
        onClose={() => setIsSmartScreenGuideOpen(false)}
        targetOS={targetOS}
      />

      {/* Activity Log & Diagnostics Modal */}
      <DiagnosticsHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        sessions={sessions}
        diagnostics={diagnostics}
      />

      {/* Minimal Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <strong>{branding.product_name}</strong> — {branding.tagline} ({branding.developed_by})
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsSmartScreenGuideOpen(true)}
              className="hover:text-slate-300 transition-colors"
            >
              OS Safety Guide
            </button>
            <button
              onClick={() => setActiveTab('fix')}
              className="hover:text-amber-400 transition-colors"
            >
              AI Setup Chat
            </button>
          </div>
        </div>
      </footer>
      </div>
    </div>
  );
}

