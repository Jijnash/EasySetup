import React from 'react';
import { TargetOS, UserProfile } from '../types';
import { Cpu, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

export type NavTab = 'landing' | 'installer' | 'fix' | 'scaffolding' | 'catalog' | 'admin';

interface NavbarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  targetOS: TargetOS;
  setTargetOS: (os: TargetOS) => void;
  onOpenSmartScreenGuide: () => void;
  onOpenHistory: () => void;
  generatedCount: number;
  user: UserProfile | null;
  onOpenAuth: (mode?: 'login' | 'signup') => void;
  onOpenAccount: () => void;
  onOpenPricing: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  targetOS,
  setTargetOS,
  onOpenSmartScreenGuide,
  onOpenHistory,
  generatedCount,
  user,
  onOpenAuth,
  onOpenAccount,
  onOpenPricing,
}) => {
  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 bg-background/60 backdrop-blur-xl border-b border-white/10"
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('landing')}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Cpu className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-sm tracking-wide text-white">EasySetup</span>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 bg-surface border border-white/5 p-1 rounded-full">
            <button
              onClick={() => setActiveTab('landing')}
              className={`px-4 py-1.5 text-xs font-medium rounded-full transition-all ${activeTab === 'landing' ? 'bg-white/10 text-white' : 'text-secondary hover:text-white hover:bg-white/5'}`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('installer')}
              className={`px-4 py-1.5 text-xs font-medium rounded-full transition-all ${activeTab === 'installer' ? 'bg-white/10 text-white' : 'text-secondary hover:text-white hover:bg-white/5'}`}
            >
              Orchestrator
            </button>
            <button
              onClick={() => generatedCount > 0 && setActiveTab('fix')}
              disabled={generatedCount === 0}
              title={generatedCount === 0 ? "Generate a script first to access AI Agents" : ""}
              className={`px-4 py-1.5 text-xs font-medium rounded-full transition-all flex items-center ${generatedCount === 0 ? 'opacity-50 cursor-not-allowed text-slate-600' : activeTab === 'fix' ? 'bg-white/10 text-white' : 'text-secondary hover:text-white hover:bg-white/5'}`}
            >
              <span>AI Agents</span>
              {generatedCount > 0 && <span className="ml-2 w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>}
            </button>
            <button
              onClick={() => setActiveTab('catalog')}
              className={`px-4 py-1.5 text-xs font-medium rounded-full transition-all ${activeTab === 'catalog' ? 'bg-white/10 text-white' : 'text-secondary hover:text-white hover:bg-white/5'}`}
            >
              Catalog
            </button>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            
            <div className="hidden sm:flex items-center bg-surface border border-white/5 rounded-full p-0.5">
               <button
                onClick={() => setTargetOS('windows')}
                className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase transition-all ${targetOS === 'windows' ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white' : 'text-secondary hover:text-white'}`}
              >
                Win
              </button>
              <button
                onClick={() => setTargetOS('mac')}
                className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase transition-all ${targetOS === 'mac' ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white' : 'text-secondary hover:text-white'}`}
              >
                Mac
              </button>
            </div>
            
            {user ? (
               <button onClick={onOpenAccount} className="hover:opacity-80 transition-opacity">
                 {user.avatarUrl ? (
                   <img src={user.avatarUrl} alt="Avatar" className="w-8 h-8 rounded-full border border-white/20" />
                 ) : (
                   <div className="w-8 h-8 rounded-full bg-cyan-600 flex items-center justify-center text-xs font-bold text-white">
                     {user.name.charAt(0)}
                   </div>
                 )}
               </button>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onOpenAuth('login')}
                  className="px-4 py-2 text-xs font-semibold text-secondary hover:text-white transition-colors"
                >
                  Sign in
                </button>
                <button
                  onClick={() => onOpenAuth('signup')}
                  className="px-4 py-2 bg-white text-black hover:bg-gray-200 transition-colors rounded-lg text-xs font-bold flex items-center space-x-1"
                >
                  <span>Start Free</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
};
