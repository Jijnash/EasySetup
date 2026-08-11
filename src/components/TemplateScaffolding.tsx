import React, { useState } from 'react';
import { SCAFFOLDING_TEMPLATES } from '../data/templatesData';
import { ScaffoldingTemplate } from '../types';
import {
  Terminal,
  Copy,
  Check,
  FolderTree,
  Sparkles,
  Package,
  ArrowRight,
  Code2,
  Box
} from 'lucide-react';

export const TemplateScaffolding: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<ScaffoldingTemplate>(SCAFFOLDING_TEMPLATES[0]);
  const [projectName, setProjectName] = useState<string>('my-app');
  const [copied, setCopied] = useState<boolean>(false);

  const formattedCommand = selectedTemplate.type === 'npm'
    ? `npx create-easysetup-app ${projectName} --template ${selectedTemplate.id}`
    : `pip install easysetup-cli && easysetup create ${projectName} --template ${selectedTemplate.id}`;

  const handleCopyCommand = () => {
    navigator.clipboard.writeText(formattedCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 p-6 rounded-2xl border border-cyan-500/30 shadow-xl">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 flex-shrink-0">
            <Terminal className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-bold text-white">CLI Project Scaffolding (v2)</h2>
              <span className="px-2 py-0.5 text-xs font-mono bg-cyan-500/20 text-cyan-300 rounded border border-cyan-500/30">
                create-easysetup-app
              </span>
            </div>
            <p className="text-sm text-slate-300 mt-1">
              Once your laptop is set up, jump straight into coding! Instant fullstack project scaffolding for terminal-comfortable developers.
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Template Selection & Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Template Cards List */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Select Project Template
          </label>
          {SCAFFOLDING_TEMPLATES.map((tmpl) => (
            <div
              key={tmpl.id}
              onClick={() => setSelectedTemplate(tmpl)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                selectedTemplate.id === tmpl.id
                  ? 'bg-cyan-950/30 border-cyan-500 text-white shadow-lg shadow-cyan-500/10'
                  : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-semibold text-sm text-white">{tmpl.name}</span>
                <span className={`px-2 py-0.5 text-[10px] font-mono rounded ${tmpl.type === 'npm' ? 'bg-amber-500/20 text-amber-300' : 'bg-blue-500/20 text-blue-300'}`}>
                  {tmpl.type}
                </span>
              </div>
              <p className="text-xs text-slate-400 line-clamp-2">{tmpl.description}</p>
              <div className="mt-3 flex flex-wrap gap-1">
                {tmpl.tags.map((tag) => (
                  <span key={tag} className="px-1.5 py-0.5 text-[10px] bg-slate-950 text-slate-400 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Command Generator & Structural Preview */}
        <div className="lg:col-span-2 space-y-6">
          {/* CLI Command Generator Box */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-2">
                <Code2 className="w-4 h-4 text-cyan-400" />
                <span>Customize Project Name</span>
              </label>
              <span className="text-xs text-slate-500 font-mono">{selectedTemplate.framework}</span>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-400 font-mono">Name:</span>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, ''))}
                className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Generated Command Box */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-semibold text-slate-400 uppercase">
                  Run this command in your terminal:
                </span>
                <button
                  onClick={handleCopyCommand}
                  className="flex items-center space-x-1 text-xs text-cyan-400 hover:text-cyan-300"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy Command'}</span>
                </button>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs font-mono text-cyan-300 flex items-center justify-between overflow-x-auto shadow-inner">
                <div className="flex items-center space-x-2">
                  <span className="text-slate-600">$</span>
                  <code>{formattedCommand}</code>
                </div>
              </div>
            </div>
          </div>

          {/* Template Details & File Tree Preview */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-5">
            <div>
              <h3 className="text-base font-bold text-white mb-2">{selectedTemplate.name} Features</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                {selectedTemplate.features.map((feat, i) => (
                  <li key={i} className="flex items-center space-x-2">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4 border-t border-slate-800">
              <div className="flex items-center space-x-2 text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
                <FolderTree className="w-4 h-4 text-cyan-400" />
                <span>Generated File Structure Preview</span>
              </div>
              <pre className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs font-mono text-slate-300 max-h-56 overflow-y-auto">
                {selectedTemplate.fileTree.join('\n')}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
