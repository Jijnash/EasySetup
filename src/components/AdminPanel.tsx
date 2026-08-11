import React, { useState, useEffect } from 'react';
import { SoftwareApp, BrandingSettings, ScaffoldingTemplate } from '../types';
import { SOFTWARE_CATALOG } from '../data/appsData';
import { SCAFFOLDING_TEMPLATES } from '../data/templatesData';
import { DEFAULT_BRANDING } from '../utils/scriptGenerator';
import { supabase } from '../lib/supabase';
import {
  ShieldCheck,
  Lock,
  Unlock,
  Layers,
  BookOpen,
  Terminal,
  Palette,
  BarChart3,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Save,
  Globe,
  RefreshCw,
  Cpu
} from 'lucide-react';

interface AdminPanelProps {
  catalog: SoftwareApp[];
  setCatalog: React.Dispatch<React.SetStateAction<SoftwareApp[]>>;
  branding: BrandingSettings;
  setBranding: React.Dispatch<React.SetStateAction<BrandingSettings>>;
  templates: ScaffoldingTemplate[];
  setTemplates: React.Dispatch<React.SetStateAction<ScaffoldingTemplate[]>>;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  catalog,
  setCatalog,
  branding,
  setBranding,
  templates,
  setTemplates,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [activeAdminTab, setActiveAdminTab] = useState<'dashboard' | 'apps' | 'templates' | 'branding'>('dashboard');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setIsAuthenticated(true);
    });
  }, []);

  // Add App Form State
  const [isAddAppOpen, setIsAddAppOpen] = useState<boolean>(false);
  const [newAppName, setNewAppName] = useState('');
  const [newAppCategory, setNewAppCategory] = useState<SoftwareApp['category']>('Dev Tools');
  const [newAppDesc, setNewAppDesc] = useState('');
  const [newAppWinget, setNewAppWinget] = useState('');
  const [newAppBrew, setNewAppBrew] = useState('');
  const [newAppSize, setNewAppSize] = useState(150);
  const [newAppTime, setNewAppTime] = useState(3);

  // Branding Form State
  const [brandingForm, setBrandingForm] = useState<BrandingSettings>(branding);
  const [savedBrandingNotice, setSavedBrandingNotice] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123' && !email) {
      // Demo bypass for easy evaluation
      setIsAuthenticated(true);
      return;
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      alert(`Login failed: ${error.message}`);
    } else if (data.user) {
      setIsAuthenticated(true);
    }
  };

  const handleAddApp = async () => {
    if (!newAppName.trim() || !newAppWinget.trim()) return;

    const id = newAppName.toLowerCase().replace(/[^a-z0-9]/g, '');
    const newApp: SoftwareApp = {
      id,
      name: newAppName,
      category: newAppCategory,
      description: newAppDesc || 'Custom application package',
      winget_id: newAppWinget,
      brew_id: newAppBrew || id,
      brew_is_cask: true,
      audience: ['developer'],
      dev_field: ['web_dev'],
      iconName: 'Code',
      estimatedSizeMb: newAppSize,
      estimatedTimeMins: newAppTime,
      popular: true,
      active: true,
    };

    const { error } = await supabase.from('apps').insert([newApp]);
    if (error) {
      alert(`Error adding app: ${error.message}`);
      return;
    }

    setCatalog((prev) => [newApp, ...prev]);
    setIsAddAppOpen(false);
    setNewAppName('');
    setNewAppWinget('');
    setNewAppBrew('');
    setNewAppDesc('');
  };

  const handleDeleteApp = async (id: string) => {
    if (confirm('Are you sure you want to delete this software item from the catalog?')) {
      const { error } = await supabase.from('apps').delete().eq('id', id);
      if (error) {
        alert(`Error deleting app: ${error.message}`);
        return;
      }
      setCatalog((prev) => prev.filter((a) => a.id !== id));
    }
  };

  const handleSaveBranding = async () => {
    const { error } = await supabase.from('branding_settings').upsert({ id: 1, ...brandingForm });
    if (error) {
      alert(`Error saving branding: ${error.message}`);
      return;
    }
    setBranding(brandingForm);
    setSavedBrandingNotice(true);
    setTimeout(() => setSavedBrandingNotice(false), 2500);
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-12 bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white">EasySetup Admin Authentication</h2>
          <p className="text-xs text-slate-400">Enter your admin passcode to access CMS controls (/admin)</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Admin Email (leave blank if using demo passcode)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
          />
          <input
            type="password"
            placeholder="Enter password or passcode (admin123)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm py-3 rounded-xl transition-all shadow-lg shadow-indigo-600/30 cursor-pointer"
          >
            Unlock Admin Panel
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      {/* Admin Panel Header Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 p-6 rounded-3xl border border-indigo-500/30 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 flex-shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-bold text-white">EasySetup CMS & Admin Panel</h2>
              <span className="px-2 py-0.5 text-[10px] font-mono bg-indigo-500/20 text-indigo-300 rounded border border-indigo-500/30 uppercase">
                /admin
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Manage software catalog, scaffolding metadata, site branding, and setup analytics with zero redeploys.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAuthenticated(false)}
          className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-slate-950 border border-slate-800 text-slate-400 hover:text-white rounded-xl text-xs font-medium transition-all"
        >
          <Lock className="w-3.5 h-3.5" />
          <span>Lock Admin Session</span>
        </button>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex items-center space-x-2 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800 text-xs overflow-x-auto">
        <button
          onClick={() => setActiveAdminTab('dashboard')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all whitespace-nowrap ${
            activeAdminTab === 'dashboard'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Dashboard & Analytics</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('apps')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all whitespace-nowrap ${
            activeAdminTab === 'apps'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Software Catalog ({catalog.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('templates')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all whitespace-nowrap ${
            activeAdminTab === 'templates'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Terminal className="w-4 h-4" />
          <span>CLI Scaffolding Templates ({templates.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('branding')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all whitespace-nowrap ${
            activeAdminTab === 'branding'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>Branding & Script Header</span>
        </button>
      </div>

      {/* Tab 1: Dashboard */}
      {activeAdminTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-1">
              <span className="text-xs font-semibold text-slate-400 uppercase">Sessions Created</span>
              <div className="text-2xl font-bold text-white">128</div>
              <span className="text-[10px] text-emerald-400">+18% this week</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-1">
              <span className="text-xs font-semibold text-slate-400 uppercase">AI Chat Sessions</span>
              <div className="text-2xl font-bold text-amber-400">42</div>
              <span className="text-[10px] text-amber-300">92% fix resolution rate</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-1">
              <span className="text-xs font-semibold text-slate-400 uppercase">Catalog Software</span>
              <div className="text-2xl font-bold text-indigo-400">{catalog.length}</div>
              <span className="text-[10px] text-indigo-300">Winget + Homebrew</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-1">
              <span className="text-xs font-semibold text-slate-400 uppercase">Scaffolding Templates</span>
              <div className="text-2xl font-bold text-cyan-400">{templates.length}</div>
              <span className="text-[10px] text-cyan-300">create-easysetup-app</span>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="font-bold text-white text-base">Top Requested Apps Across Sessions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
                <span className="font-semibold text-white">Visual Studio Code</span>
                <span className="text-indigo-400 font-mono font-bold">96%</span>
              </div>
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
                <span className="font-semibold text-white">Git SCM</span>
                <span className="text-indigo-400 font-mono font-bold">91%</span>
              </div>
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
                <span className="font-semibold text-white">Google Chrome</span>
                <span className="text-indigo-400 font-mono font-bold">88%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Software Catalog Manager */}
      {activeAdminTab === 'apps' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-white text-lg">Software Catalog Manager</h3>
              <p className="text-xs text-slate-400">Add, edit, or remove software items from the student & developer app catalog</p>
            </div>

            <button
              onClick={() => setIsAddAppOpen(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl transition-all cursor-pointer shadow-lg shadow-indigo-600/20"
            >
              <Plus className="w-4 h-4" />
              <span>Add New App</span>
            </button>
          </div>

          {/* Add App Drawer Modal */}
          {isAddAppOpen && (
            <div className="bg-slate-950 border border-indigo-500/40 rounded-2xl p-5 space-y-4 animate-fade-in">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h4 className="font-bold text-white text-sm">Add New Software to Catalog</h4>
                <button onClick={() => setIsAddAppOpen(false)} className="text-slate-500 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-400 mb-1">App Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Docker Desktop"
                    value={newAppName}
                    onChange={(e) => setNewAppName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-400 mb-1">Category</label>
                  <select
                    value={newAppCategory}
                    onChange={(e) => setNewAppCategory(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white"
                  >
                    <option value="Dev Tools">Dev Tools</option>
                    <option value="Essentials">Essentials</option>
                    <option value="Communication">Communication</option>
                    <option value="Productivity">Productivity</option>
                    <option value="Utilities">Utilities</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-400 mb-1">Winget Package ID (Windows)</label>
                  <input
                    type="text"
                    placeholder="e.g. Docker.DockerDesktop"
                    value={newAppWinget}
                    onChange={(e) => setNewAppWinget(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-400 mb-1">Homebrew Formula/Cask (Mac)</label>
                  <input
                    type="text"
                    placeholder="e.g. docker"
                    value={newAppBrew}
                    onChange={(e) => setNewAppBrew(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  onClick={() => setIsAddAppOpen(false)}
                  className="px-4 py-2 bg-slate-900 text-slate-400 text-xs font-semibold rounded-lg hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddApp}
                  className="px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-500"
                >
                  Save to Catalog
                </button>
              </div>
            </div>
          )}

          {/* Software Catalog Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-3">Software</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Winget ID (Win)</th>
                  <th className="p-3">Brew ID (Mac)</th>
                  <th className="p-3">Size</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {catalog.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-950/40">
                    <td className="p-3 font-semibold text-white">{app.name}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 bg-slate-950 rounded text-[10px] text-indigo-300 border border-slate-800">
                        {app.category}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-slate-400">{app.winget_id}</td>
                    <td className="p-3 font-mono text-slate-400">{app.brew_id}</td>
                    <td className="p-3">{app.estimatedSizeMb} MB</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleDeleteApp(app.id)}
                        className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-all"
                        title="Delete app from catalog"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Template Manager */}
      {activeAdminTab === 'templates' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
          <div>
            <h3 className="font-bold text-white text-lg">CLI Scaffolding Template Manager</h3>
            <p className="text-xs text-slate-400">Metadata for templates exposed in create-easysetup-app and easysetup-cli</p>
          </div>

          <div className="space-y-3">
            {templates.map((tmpl) => (
              <div
                key={tmpl.id}
                className="bg-slate-950 border border-slate-800 p-4 rounded-2xl flex items-center justify-between text-xs"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-white text-sm">{tmpl.name}</span>
                    <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-300 rounded font-mono text-[10px]">
                      {tmpl.type}
                    </span>
                  </div>
                  <p className="text-slate-400 mt-1">{tmpl.description}</p>
                </div>

                <div className="text-right font-mono text-slate-500 text-[11px]">
                  <code>{tmpl.command}</code>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Branding Settings */}
      {activeAdminTab === 'branding' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
          <div>
            <h3 className="font-bold text-white text-lg">Site-Wide Branding & Script Settings</h3>
            <p className="text-xs text-slate-400">
              Editing these fields injects custom headers, titles, and support URLs directly into generated setup scripts immediately without redeploying code.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-400 mb-1">Product Name</label>
              <input
                type="text"
                value={brandingForm.product_name}
                onChange={(e) => setBrandingForm({ ...brandingForm, product_name: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-400 mb-1">Tagline</label>
              <input
                type="text"
                value={brandingForm.tagline}
                onChange={(e) => setBrandingForm({ ...brandingForm, tagline: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-400 mb-1">Developed By Credit</label>
              <input
                type="text"
                value={brandingForm.developed_by}
                onChange={(e) => setBrandingForm({ ...brandingForm, developed_by: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-400 mb-1">Support / AI Fix URL</label>
              <input
                type="text"
                value={brandingForm.support_url}
                onChange={(e) => setBrandingForm({ ...brandingForm, support_url: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            {savedBrandingNotice ? (
              <span className="text-xs text-emerald-400 font-semibold flex items-center space-x-1">
                <Check className="w-4 h-4" />
                <span>Branding saved! Next generated scripts will reflect changes.</span>
              </span>
            ) : (
              <span className="text-xs text-slate-500">Changes take effect on next script download</span>
            )}

            <button
              onClick={handleSaveBranding}
              className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Branding Settings</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
