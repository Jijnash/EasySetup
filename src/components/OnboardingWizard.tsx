import React, { useState } from 'react';
import { AudienceType, DevFieldType } from '../types';
import { User, Code, Sparkles, GraduationCap, ArrowRight, CheckCircle2 } from 'lucide-react';

interface OnboardingWizardProps {
  onSelectRecommendation: (audience: AudienceType, devField: DevFieldType | null) => void;
  currentAudience: AudienceType | null;
  currentDevField: DevFieldType | null;
}

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({
  onSelectRecommendation,
  currentAudience,
  currentDevField,
}) => {
  const [audience, setAudience] = useState<AudienceType | null>(currentAudience || 'general');
  const [devField, setDevField] = useState<DevFieldType | null>(currentDevField || 'web_dev');
  const [isStudent, setIsStudent] = useState<boolean>(true);
  const [studentBranch, setStudentBranch] = useState<string>('CS');
  const [showNudge, setShowNudge] = useState<boolean>(false);

  const handleAudienceChange = (selected: AudienceType) => {
    setAudience(selected);
    if (selected === 'general' && isStudent && (studentBranch === 'CS' || studentBranch === 'IT')) {
      setShowNudge(true);
    } else {
      setShowNudge(false);
    }
  };

  const handleApply = () => {
    if (!audience) return;
    const finalDevField = (audience === 'developer' || audience === 'both') ? devField : null;
    onSelectRecommendation(audience, finalDevField);
  };

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl mb-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-6 border-b border-slate-800 gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 text-indigo-400 font-semibold text-xs tracking-wider uppercase mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Step 1: Smart Recommendation Engine</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">Tailor Your Laptop Bundle</h2>
          <p className="text-sm text-slate-400 mt-0.5">
            Select who this laptop is for, and EasySetup will automatically select the best essential apps.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs text-slate-300">
          <GraduationCap className="w-4 h-4 text-emerald-400" />
          <span>Student Mode:</span>
          <select
            value={studentBranch}
            onChange={(e) => {
              setStudentBranch(e.target.value);
              if ((e.target.value === 'CS' || e.target.value === 'IT') && audience === 'general') {
                setShowNudge(true);
              } else {
                setShowNudge(false);
              }
            }}
            className="bg-slate-900 border border-slate-700 text-white rounded px-2 py-0.5 text-xs focus:outline-none focus:border-indigo-500"
          >
            <option value="CS">B.Tech CS / CSE</option>
            <option value="IT">B.Tech IT</option>
            <option value="ECE">ECE / EEE</option>
            <option value="GENERAL">General Studies / Non-Tech</option>
          </select>
        </div>
      </div>

      {/* Audience Selection Cards */}
      <div className="mt-6">
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
          1. Primary Audience
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => handleAudienceChange('general')}
            className={`flex flex-col p-4 rounded-xl border text-left transition-all relative ${
              audience === 'general'
                ? 'bg-indigo-600/15 border-indigo-500 text-white shadow-lg shadow-indigo-500/10'
                : 'bg-slate-950/50 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/40'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <User className="w-4 h-4" />
              </div>
              {audience === 'general' && <CheckCircle2 className="w-5 h-5 text-indigo-400" />}
            </div>
            <span className="font-semibold text-sm text-white">General / Student</span>
            <span className="text-xs text-slate-400 mt-1">
              Browser, PDF, Office, Media Players, WhatsApp, Zoom & Utilities.
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleAudienceChange('developer')}
            className={`flex flex-col p-4 rounded-xl border text-left transition-all relative ${
              audience === 'developer'
                ? 'bg-indigo-600/15 border-indigo-500 text-white shadow-lg shadow-indigo-500/10'
                : 'bg-slate-950/50 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/40'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                <Code className="w-4 h-4" />
              </div>
              {audience === 'developer' && <CheckCircle2 className="w-5 h-5 text-indigo-400" />}
            </div>
            <span className="font-semibold text-sm text-white">Developer Focus</span>
            <span className="text-xs text-slate-400 mt-1">
              Git, VS Code, Node.js, Python, Terminal, Docker & Dev Stacks.
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleAudienceChange('both')}
            className={`flex flex-col p-4 rounded-xl border text-left transition-all relative ${
              audience === 'both'
                ? 'bg-indigo-600/15 border-indigo-500 text-white shadow-lg shadow-indigo-500/10'
                : 'bg-slate-950/50 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/40'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
                <Sparkles className="w-4 h-4" />
              </div>
              {audience === 'both' && <CheckCircle2 className="w-5 h-5 text-indigo-400" />}
            </div>
            <span className="font-semibold text-sm text-white">Both (All-in-One)</span>
            <span className="text-xs text-slate-400 mt-1">
              Complete setup combining daily student essentials + full dev tools.
            </span>
          </button>
        </div>
      </div>

      {/* Branch-Aware Nudge */}
      {showNudge && (
        <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center justify-between text-xs text-amber-200">
          <div className="flex items-center space-x-2">
            <GraduationCap className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>Since you're a Computer Science/IT student, would you like developer tools included too?</span>
          </div>
          <button
            type="button"
            onClick={() => {
              setAudience('both');
              setShowNudge(false);
            }}
            className="px-2.5 py-1 bg-amber-500 text-slate-950 font-semibold rounded-lg hover:bg-amber-400 transition-all flex-shrink-0"
          >
            Switch to Both
          </button>
        </div>
      )}

      {/* Developer Field Selector */}
      {(audience === 'developer' || audience === 'both') && (
        <div className="mt-5 pt-5 border-t border-slate-800/80">
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            2. Choose Developer Specialization Field
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            {[
              { id: 'web_dev', label: '🌐 Web Dev', desc: 'Node.js, Postman, GitHub' },
              { id: 'ai_ml', label: '🤖 AI / ML', desc: 'Python, Anaconda, Jupyter' },
              { id: 'app_dev', label: '📱 App Dev', desc: 'Android Studio, Node' },
              { id: 'data_science', label: '📊 Data Science', desc: 'Python, Jupyter, SQL' },
              { id: 'cybersecurity', label: '🛡️ Cybersecurity', desc: 'Wireshark, Python' },
              { id: 'not_sure', label: '❓ Not Sure', desc: 'General Python & Node' },
            ].map((field) => (
              <button
                key={field.id}
                type="button"
                onClick={() => setDevField(field.id as DevFieldType)}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  devField === field.id
                    ? 'bg-indigo-600 border-indigo-500 text-white font-semibold shadow-md'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="text-xs font-medium">{field.label}</div>
                <div className="text-[10px] text-slate-400 mt-0.5 truncate">{field.desc}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={handleApply}
          className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-medium text-sm rounded-xl hover:from-indigo-500 hover:to-blue-500 shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
        >
          <span>Apply Recommended Selection</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
