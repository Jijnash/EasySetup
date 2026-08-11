import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TargetOS, SoftwareApp, AppCategory, AudienceType, DevFieldType } from '../types';
import { SOFTWARE_CATALOG } from '../data/appsData';
import {
  Search, Check, Zap, HardDrive, Clock, Globe, Compass, FileText,
  FileCode, Film, Archive, Edit3, MessageSquare, Video, Headphones,
  MessageCircle, Users, Send, BookOpen, Feather, Music, Layout,
  GitBranch, Code, GitPullRequest, Server, Terminal, Cpu, Database,
  Smartphone, ShieldCheck, Box, Lock, Shield, HelpCircle, GraduationCap,
  Layers, ChevronRight, X, Info, Tag
} from 'lucide-react';

interface OrchestratorViewProps {
  selectedAppIds: string[];
  onToggleApp: (appId: string) => void;
  onSelectAll: (appIds: string[]) => void;
  onDeselectAll: () => void;
  targetOS: TargetOS;
  onGenerateClick: () => void;
  onSelectRecommendation: (audience: AudienceType, devField: DevFieldType | null) => void;
}

const CATEGORIES: AppCategory[] = [
  'Essentials',
  'Communication',
  'Productivity',
  'Dev Tools',
  'Utilities',
];

export const OrchestratorView: React.FC<OrchestratorViewProps> = ({
  selectedAppIds,
  onToggleApp,
  onDeselectAll,
  targetOS,
  onGenerateClick,
  onSelectRecommendation
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [visibleCount, setVisibleCount] = useState(50);

  // Filters
  const filteredApps = useMemo(() => {
    return SOFTWARE_CATALOG.filter((app) => {
      const matchesSearch =
        app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.winget_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.brew_id.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategory === 'All' || app.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const visibleApps = filteredApps.slice(0, visibleCount);

  // Cart Specs
  const selectedAppsList = useMemo(() => {
    return SOFTWARE_CATALOG.filter((app) => selectedAppIds.includes(app.id));
  }, [selectedAppIds]);

  const totalSizeMb = selectedAppsList.reduce((acc, app) => acc + app.estimatedSizeMb, 0);
  const totalTimeMins = selectedAppsList.reduce((acc, app) => acc + app.estimatedTimeMins, 0);
  const formattedSize = totalSizeMb >= 1000 ? `${(totalSizeMb / 1024).toFixed(1)} GB` : `${totalSizeMb} MB`;

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 25);
  };

  const renderIcon = (iconName: string) => {
    const props = { className: 'w-5 h-5 text-cyan-400' };
    switch (iconName) {
      case 'Globe': return <Globe {...props} />;
      case 'Compass': return <Compass {...props} />;
      case 'FileText': return <FileText {...props} />;
      case 'FileCode': return <FileCode {...props} />;
      case 'Film': return <Film {...props} />;
      case 'Archive': return <Archive {...props} />;
      case 'Edit3': return <Edit3 {...props} />;
      case 'MessageSquare': return <MessageSquare {...props} />;
      case 'Video': return <Video {...props} />;
      case 'Headphones': return <Headphones {...props} />;
      case 'MessageCircle': return <MessageCircle {...props} />;
      case 'Users': return <Users {...props} />;
      case 'Send': return <Send {...props} />;
      case 'BookOpen': return <BookOpen {...props} />;
      case 'Feather': return <Feather {...props} />;
      case 'Music': return <Music {...props} />;
      case 'Layout': return <Layout {...props} />;
      case 'GitBranch': return <GitBranch {...props} />;
      case 'Code': return <Code {...props} />;
      case 'GitPullRequest': return <GitPullRequest {...props} />;
      case 'Server': return <Server {...props} />;
      case 'Terminal': return <Terminal {...props} />;
      case 'Cpu': return <Cpu {...props} />;
      case 'Database': return <Database {...props} />;
      case 'Smartphone': return <Smartphone {...props} />;
      case 'ShieldCheck': return <ShieldCheck {...props} />;
      case 'Box': return <Box {...props} />;
      case 'Zap': return <Zap {...props} />;
      case 'Lock': return <Lock {...props} />;
      case 'Shield': return <Shield {...props} />;
      default: return <HelpCircle {...props} />;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row w-full gap-6 lg:items-start min-h-[calc(100vh-100px)]">
      
      {/* 1. LEFT SIDEBAR: Filters & Presets (Sticky) */}
      <div className="w-full lg:w-[280px] flex-shrink-0 flex flex-col space-y-6 lg:sticky lg:top-24 lg:h-[calc(100vh-120px)] lg:overflow-y-auto scrollbar-hide">
        
        {/* Student Mode / Bundles */}
        <div className="glass-panel rounded-2xl p-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[40px] pointer-events-none" />
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center">
            <GraduationCap className="w-4 h-4 mr-2 text-emerald-400" /> Auto-Bundles
          </h3>
          <div className="space-y-2">
            <button
              onClick={() => onSelectRecommendation('both', 'web_dev')}
              className="w-full text-left px-4 py-2.5 rounded-xl bg-white/5 hover:bg-emerald-500/10 border border-white/5 hover:border-emerald-500/30 transition-all text-sm font-semibold text-slate-200 flex justify-between items-center group"
            >
              <span>🎓 B.Tech CS Student</span>
              <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 text-emerald-400 transition-opacity" />
            </button>
            <button
              onClick={() => onSelectRecommendation('developer', 'web_dev')}
              className="w-full text-left px-4 py-2.5 rounded-xl bg-white/5 hover:bg-blue-500/10 border border-white/5 hover:border-blue-500/30 transition-all text-sm font-semibold text-slate-200 flex justify-between items-center group"
            >
              <span>💻 Web Developer</span>
              <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 text-blue-400 transition-opacity" />
            </button>
            <button
              onClick={() => onSelectRecommendation('developer', 'ai_ml')}
              className="w-full text-left px-4 py-2.5 rounded-xl bg-white/5 hover:bg-purple-500/10 border border-white/5 hover:border-purple-500/30 transition-all text-sm font-semibold text-slate-200 flex justify-between items-center group"
            >
              <span>🤖 AI & Data Science</span>
              <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 text-purple-400 transition-opacity" />
            </button>
          </div>
        </div>

        {/* Categories */}
        <div className="glass-panel rounded-2xl p-5">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center">
            <Layers className="w-4 h-4 mr-2 text-blue-400" /> Categories
          </h3>
          <div className="flex flex-col space-y-1">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`text-left px-4 py-2.5 rounded-xl text-sm transition-all ${
                selectedCategory === 'All' ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30' : 'text-slate-400 font-medium hover:text-slate-200 hover:bg-white/5 border border-transparent'
              }`}
            >
              All Softwares
            </button>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-left px-4 py-2.5 rounded-xl text-sm transition-all ${
                  selectedCategory === cat ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30' : 'text-slate-400 font-medium hover:text-slate-200 hover:bg-white/5 border border-transparent'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. CENTER: Catalog Grid (Scrolls) */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-0">
        
        {/* Sticky Search Header */}
        <div className="sticky top-20 lg:top-24 z-30 bg-background/90 backdrop-blur-xl border border-white/10 rounded-2xl p-2.5 mb-6 shadow-2xl flex items-center">
           <Search className="w-5 h-5 text-cyan-400 ml-3" />
           <input
             type="text"
             placeholder="Search Chrome, VS Code, Python..."
             value={searchQuery}
             onChange={e => setSearchQuery(e.target.value)}
             className="flex-1 bg-transparent border-none text-white text-base px-4 py-2 focus:outline-none focus:ring-0 placeholder-slate-500 font-medium"
           />
           {searchQuery && (
             <button onClick={() => setSearchQuery('')} className="mr-3 p-1 rounded bg-white/10 text-slate-300 hover:text-white hover:bg-white/20 transition-all">
               <X className="w-4 h-4" />
             </button>
           )}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 relative">
          <AnimatePresence>
            {visibleApps.map(app => {
              const isSelected = selectedAppIds.includes(app.id);
              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  key={app.id}
                  onClick={() => onToggleApp(app.id)}
                  className={`relative group rounded-2xl border p-5 cursor-pointer transition-all duration-300 overflow-hidden ${
                    isSelected
                      ? 'bg-cyan-950/40 border-cyan-500/60 shadow-[0_0_30px_rgba(6,182,212,0.15)]'
                      : 'glass-panel hover:bg-slate-800/80 hover:border-white/20 hover:shadow-xl'
                  }`}
                >
                  <div className="flex items-start justify-between relative z-10">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg transition-transform ${isSelected ? 'bg-cyan-500/20' : 'bg-slate-900 border border-white/10 group-hover:scale-110'}`}>
                      {renderIcon(app.iconName)}
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      isSelected ? 'bg-cyan-500 border-cyan-500 text-background' : 'border-slate-600 text-transparent group-hover:border-slate-400 group-hover:bg-slate-700/50'
                    }`}>
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  </div>

                  <div className="mt-5 relative z-10">
                    <div className="flex items-center space-x-2">
                      <h3 className={`font-bold text-base ${isSelected ? 'text-cyan-300' : 'text-white group-hover:text-cyan-100'}`}>{app.name}</h3>
                      {app.popular && (
                        <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-violet-500/20 text-violet-300 rounded border border-violet-500/30">Top</span>
                      )}
                    </div>
                    <p className="text-sm text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">{app.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {filteredApps.length > visibleCount && (
          <div className="mt-12 mb-8 flex justify-center">
            <button 
              onClick={handleLoadMore}
              className="px-8 py-3 rounded-full border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 text-sm font-semibold text-cyan-300 transition-all shadow-lg hover:shadow-cyan-500/20"
            >
              Load 25 More Softwares...
            </button>
          </div>
        )}

      </div>

      {/* 3. RIGHT SIDEBAR: Selected Apps / Cart (Sticky) */}
      <div className="w-full lg:w-[320px] flex-shrink-0 flex flex-col lg:sticky lg:top-24 lg:h-[calc(100vh-120px)]">
        <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden flex flex-col h-full shadow-2xl bg-slate-900/60 backdrop-blur-2xl">
          
          <div className="p-6 border-b border-white/10 bg-white/5 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-cyan-500/20 blur-[40px]" />
            <h2 className="text-xl font-bold text-white mb-2 flex items-center relative z-10">
              <Box className="w-5 h-5 mr-2 text-cyan-400" /> Cart Queue
            </h2>
            <div className="flex justify-between text-xs text-slate-400 font-medium relative z-10">
               <span>{selectedAppsList.length} {selectedAppsList.length === 1 ? 'app' : 'apps'} selected</span>
               {selectedAppsList.length > 0 && (
                 <button onClick={onDeselectAll} className="hover:text-red-400 text-slate-500 transition-colors border border-slate-700 hover:border-red-400/50 px-2 rounded bg-slate-900">
                   Clear All
                 </button>
               )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            <AnimatePresence>
              {selectedAppsList.length === 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col items-center justify-center text-center text-slate-500 px-4">
                  <Box className="w-12 h-12 text-slate-800 mb-4" />
                  <p className="text-sm font-medium">Your setup is empty.</p>
                  <p className="text-xs mt-2">Select apps from the catalog or pick a preset bundle to begin.</p>
                </motion.div>
              ) : (
                selectedAppsList.map(app => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    key={`cart-${app.id}`} 
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-950/50 border border-white/5 hover:bg-slate-800 hover:border-white/10 transition-all group shadow-sm"
                  >
                     <div className="flex items-center space-x-3 overflow-hidden">
                        <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex flex-shrink-0 items-center justify-center">
                           {renderIcon(app.iconName)}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-white truncate">{app.name}</span>
                          <span className="text-[10px] text-slate-500 font-mono">{app.estimatedSizeMb} MB</span>
                        </div>
                     </div>
                     <button onClick={() => onToggleApp(app.id)} className="text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-red-400/10 rounded-lg">
                        <X className="w-4 h-4" />
                     </button>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>

          <div className="p-6 border-t border-white/10 bg-black/60 relative overflow-hidden">
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-600/20 blur-[40px]" />
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-3 text-sm">
                <span className="text-slate-400 font-medium">Total Size</span>
                <span className="text-white font-mono font-semibold">{formattedSize}</span>
              </div>
              <div className="flex justify-between items-center mb-6 text-sm">
                <span className="text-slate-400 font-medium">Est. Duration</span>
                <span className="text-white font-mono font-semibold">~{totalTimeMins} mins</span>
              </div>

              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                disabled={selectedAppIds.length === 0}
                onClick={onGenerateClick}
                className={`w-full flex items-center justify-center space-x-2 py-4 rounded-xl font-bold text-sm transition-all shadow-lg ${
                  selectedAppIds.length > 0
                    ? 'bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 text-white shadow-cyan-500/25 hover:shadow-cyan-500/40 border border-white/10'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700 shadow-none'
                }`}
              >
                <Zap className={`w-4 h-4 ${selectedAppIds.length > 0 ? 'fill-current text-amber-300' : ''}`} />
                <span>Generate Script</span>
              </motion.button>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
