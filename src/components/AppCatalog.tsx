import React, { useState, useMemo } from 'react';
import { SoftwareApp, AppCategory, TargetOS } from '../types';
import { SOFTWARE_CATALOG } from '../data/appsData';
import {
  Search,
  Check,
  Plus,
  Zap,
  HardDrive,
  Clock,
  Sparkles,
  Layers,
  Globe,
  Compass,
  FileText,
  FileCode,
  Film,
  Archive,
  Edit3,
  MessageSquare,
  Video,
  Headphones,
  MessageCircle,
  Users,
  Send,
  BookOpen,
  Feather,
  Music,
  Layout,
  GitBranch,
  Code,
  GitPullRequest,
  Server,
  Terminal,
  Cpu,
  Database,
  Smartphone,
  ShieldCheck,
  Box,
  Lock,
  Shield,
  HelpCircle
} from 'lucide-react';

interface AppCatalogProps {
  selectedAppIds: string[];
  onToggleApp: (appId: string) => void;
  onSelectAll: (appIds: string[]) => void;
  onDeselectAll: () => void;
  targetOS: TargetOS;
  onGenerateClick: () => void;
}

const CATEGORIES: AppCategory[] = [
  'Essentials',
  'Communication',
  'Productivity',
  'Dev Tools',
  'Utilities',
];

export const AppCatalog: React.FC<AppCatalogProps> = ({
  selectedAppIds,
  onToggleApp,
  onSelectAll,
  onDeselectAll,
  targetOS,
  onGenerateClick,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Map icon names to Lucide icons dynamically
  const renderIcon = (iconName: string) => {
    const props = { className: 'w-5 h-5 text-indigo-400' };
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

  const filteredApps = useMemo(() => {
    return SOFTWARE_CATALOG.filter((app) => {
      const matchesSearch =
        app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.winget_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.brew_id.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === 'All' || app.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const selectedAppsList = useMemo(() => {
    return SOFTWARE_CATALOG.filter((app) => selectedAppIds.includes(app.id));
  }, [selectedAppIds]);

  const totalSizeMb = useMemo(() => {
    return selectedAppsList.reduce((acc, app) => acc + app.estimatedSizeMb, 0);
  }, [selectedAppsList]);

  const totalTimeMins = useMemo(() => {
    return selectedAppsList.reduce((acc, app) => acc + app.estimatedTimeMins, 0);
  }, [selectedAppsList]);

  const formattedSize = totalSizeMb >= 1000 ? `${(totalSizeMb / 1024).toFixed(1)} GB` : `${totalSizeMb} MB`;

  return (
    <div className="space-y-6 pb-28">
      {/* Search & Category Filter Toolbar */}
      <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-4 shadow-lg flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search 50+ software apps (e.g. VS Code, Chrome, Python, Notion)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center space-x-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none text-xs">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all ${
              selectedCategory === 'All'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            All Apps ({SOFTWARE_CATALOG.length})
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="flex items-center space-x-2 text-xs">
          <button
            onClick={() => onSelectAll(filteredApps.map((a) => a.id))}
            className="px-2.5 py-1.5 bg-slate-950 border border-slate-800 text-slate-300 rounded-lg hover:bg-slate-800 hover:text-white transition-all whitespace-nowrap"
          >
            Select All
          </button>
          <button
            onClick={onDeselectAll}
            className="px-2.5 py-1.5 bg-slate-950 border border-slate-800 text-slate-400 rounded-lg hover:bg-slate-800 hover:text-white transition-all whitespace-nowrap"
          >
            Clear
          </button>
        </div>
      </div>

      {/* App Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredApps.map((app) => {
          const isSelected = selectedAppIds.includes(app.id);
          const pkgId = targetOS === 'windows' ? app.winget_id : app.brew_id;

          return (
            <div
              key={app.id}
              onClick={() => onToggleApp(app.id)}
              className={`group relative rounded-2xl border p-4 cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                isSelected
                  ? 'bg-indigo-950/20 border-indigo-500/80 shadow-lg shadow-indigo-500/10'
                  : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              <div>
                {/* Header: Icon & Checkbox */}
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
                    {renderIcon(app.iconName)}
                  </div>

                  <div
                    className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-indigo-600 border-indigo-500 text-white'
                        : 'border-slate-700 bg-slate-950 text-transparent group-hover:border-slate-500'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                </div>

                {/* Title & Description */}
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-sm text-white group-hover:text-indigo-300 transition-colors">
                      {app.name}
                    </h3>
                    {app.popular && (
                      <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 rounded border border-amber-500/30">
                        Top
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{app.description}</p>
                </div>
              </div>

              {/* Footer: Package ID & Specs */}
              <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                <span className="truncate max-w-[130px]" title={pkgId}>
                  {pkgId}
                </span>
                <span className="text-slate-400 font-sans font-medium">
                  ~{app.estimatedSizeMb} MB
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Bottom Bar for Running Totals & Script Generation */}
      <div className="fixed bottom-4 left-4 right-4 max-w-5xl mx-auto z-30 bg-slate-900/95 backdrop-blur-xl border border-indigo-500/30 rounded-2xl p-4 shadow-2xl shadow-indigo-950/50 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Specs Summary */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-bold text-sm">
              {selectedAppIds.length}
            </div>
            <div>
              <div className="text-xs font-semibold text-white">Selected Apps</div>
              <div className="text-[10px] text-slate-400">Ready for script</div>
            </div>
          </div>

          <div className="hidden sm:block h-8 w-px bg-slate-800" />

          <div className="hidden sm:flex items-center space-x-2 text-xs">
            <HardDrive className="w-4 h-4 text-emerald-400" />
            <div>
              <div className="font-semibold text-white">{formattedSize}</div>
              <div className="text-[10px] text-slate-400">Est. download</div>
            </div>
          </div>

          <div className="hidden sm:block h-8 w-px bg-slate-800" />

          <div className="hidden sm:flex items-center space-x-2 text-xs">
            <Clock className="w-4 h-4 text-cyan-400" />
            <div>
              <div className="font-semibold text-white">~{totalTimeMins} mins</div>
              <div className="text-[10px] text-slate-400">Est. install time</div>
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <button
          id="generate-script-btn"
          disabled={selectedAppIds.length === 0}
          onClick={onGenerateClick}
          className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all cursor-pointer ${
            selectedAppIds.length > 0
              ? 'bg-gradient-to-r from-indigo-600 via-blue-600 to-emerald-500 text-white shadow-lg shadow-indigo-600/30 hover:brightness-110 active:scale-[0.98]'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
          }`}
        >
          <Zap className="w-4 h-4 fill-current" />
          <span>Generate {targetOS === 'windows' ? '.BAT' : '.COMMAND'} Installer Script</span>
        </button>
      </div>
    </div>
  );
};
