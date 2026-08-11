import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { TargetOS, DiagnosticResponse, SoftwareApp } from '../types';
import { parseSetupLog } from '../utils/logParser';
import { generateWindowsBatScript, generateMacCommandScript, downloadScriptFile } from '../utils/scriptGenerator';
import {
  Wrench,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Copy,
  Check,
  Download,
  Terminal,
  ShieldCheck,
  Loader2,
  FileText,
  HelpCircle
} from 'lucide-react';

interface AiFixLoopProps {
  targetOS: TargetOS;
  setTargetOS: (os: TargetOS) => void;
  onRecordDiagnostic: (res: DiagnosticResponse, rawError: string, os: TargetOS) => void;
}

const SAMPLE_LOGS = [
  {
    label: '🪟 Sample: Winget Missing Error',
    os: 'windows' as TargetOS,
    text: `[START] Session initialized at 08/10/2026 10:15 AM
[INFO] OS: Windows | Total Apps: 3
[FAILED] exit_code=9001 app=Winget id=Microsoft.DesktopAppInstaller
winget : The term 'winget' is not recognized as the name of a cmdlet, function, script file, or operable program. Check the spelling of the name, or if a path was included, verify that the path is correct and try again.`,
  },
  {
    label: '🪟 Sample: PowerShell Policy Error',
    os: 'windows' as TargetOS,
    text: `[START] Session initialized at 08/10/2026 10:20 AM
[INFO] OS: Windows | Total Apps: 2
[FAILED] exit_code=1 app=Visual Studio Code id=Microsoft.VisualStudioCode
File C:\\Users\\Student\\Downloads\\easysetup.ps1 cannot be loaded because running scripts is disabled on this system. For more information, see about_Execution_Policies at https:/go.microsoft.com/fwlink/?LinkID=135170.`,
  },
  {
    label: '🍎 Sample: Homebrew Not Found (Mac)',
    os: 'mac' as TargetOS,
    text: `[START] Session initialized at 08/10/2026 10:25 AM
[INFO] OS: macOS | Total Apps: 4
[FAILED] exit_code=127 app=Node.js id=node
zsh: command not found: brew
/Users/student/Desktop/easysetup.command: line 18: brew: command not found`,
  },
  {
    label: '🪟 Sample: Failed Apps Log (Node & Python)',
    os: 'windows' as TargetOS,
    text: `[START] Session initialized at 08/10/2026 10:30 AM
[INFO] OS: Windows | Total Apps: 5
[OK] Google Chrome
[OK] Git
[FAILED] exit_code=1603 app=Node.js (LTS) id=OpenJS.NodeJS.LTS
[FAILED] exit_code=1618 app=Python 3 id=Python.Python.3.11
Error 1603: A fatal error occurred during installation. Another installation is already in progress.`,
  },
];

export const AiFixLoop: React.FC<AiFixLoopProps> = ({
  targetOS,
  setTargetOS,
  onRecordDiagnostic,
}) => {
  const [logContent, setLogContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [diagnosis, setDiagnosis] = useState<DiagnosticResponse | null>(null);
  const [copiedFix, setCopiedFix] = useState<boolean>(false);
  const [downloadedFixedScript, setDownloadedFixedScript] = useState<boolean>(false);

  const handleSampleClick = (sample: typeof SAMPLE_LOGS[0]) => {
    setLogContent(sample.text);
    setTargetOS(sample.os);
    setDiagnosis(null);
  };

  const handleAnalyze = async () => {
    if (!logContent.trim()) return;

    setLoading(true);
    setDiagnosis(null);
    setDownloadedFixedScript(false);

    const parsed = parseSetupLog(logContent, targetOS);

    try {
      const { data, error } = await supabase.functions.invoke('diagnose-error', {
        body: {
          app: parsed.failedApps.map((a) => a.name).join(', ') || 'Software Package',
          os: parsed.os || targetOS,
          error_text: logContent,
        },
      });

      if (error) throw error;
      setDiagnosis(data);
      onRecordDiagnostic(data, logContent, parsed.os || targetOS);
    } catch (err) {
      const fallbackDiag: DiagnosticResponse = {
        explanation: 'Could not connect to AI diagnostic backend. Please check your network connection.',
        fix_command: targetOS === 'windows' ? 'winget source update' : 'brew update',
        confidence: 'low',
        source: 'fallback',
      };
      setDiagnosis(fallbackDiag);
      onRecordDiagnostic(fallbackDiag, logContent, targetOS);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyFix = () => {
    if (diagnosis?.fix_command) {
      navigator.clipboard.writeText(diagnosis.fix_command);
      setCopiedFix(true);
      setTimeout(() => setCopiedFix(false), 2000);
    }
  };

  const handleDownloadFixedScript = () => {
    if (!diagnosis) return;

    const parsed = parseSetupLog(logContent, targetOS);
    const failedAppsList = parsed.failedApps;

    const customPreCmds = diagnosis.fix_command ? [diagnosis.fix_command] : [];

    let content = '';
    let filename = '';

    if (parsed.os === 'windows') {
      filename = 'easysetup_fixed.bat';
      content = generateWindowsBatScript(failedAppsList, customPreCmds);
    } else {
      filename = 'easysetup_fixed.command';
      content = generateMacCommandScript(failedAppsList, customPreCmds);
    }

    downloadScriptFile(filename, content);
    setDownloadedFixedScript(true);
  };

  const parsedLogInfo = parseSetupLog(logContent, targetOS);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      {/* Header Info Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 p-6 rounded-2xl border border-indigo-500/30 shadow-xl">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 flex-shrink-0">
            <Wrench className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-bold text-white">EasySetup AI Fix Assistant (v1.1)</h2>
              <span className="px-2 py-0.5 text-xs font-semibold bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/30">
                AI Diagnostic Engine
              </span>
            </div>
            <p className="text-sm text-slate-300 mt-1">
              If an installation script failed on your machine, paste your <code className="text-amber-300 bg-slate-950 px-1.5 py-0.5 rounded text-xs">setup-log.txt</code> content or error message below.
              Our Gemini AI will diagnose the failure in plain English and generate a fixed, downloadable follow-up script.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Sample Logs */}
      <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-4">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
          Try a 1-Click Sample Log Error:
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {SAMPLE_LOGS.map((sample, idx) => (
            <button
              key={idx}
              onClick={() => handleSampleClick(sample)}
              className="px-3 py-2 bg-slate-950 border border-slate-800 hover:border-indigo-500/50 rounded-xl text-left text-xs text-slate-300 hover:text-white transition-all flex items-center justify-between"
            >
              <span className="font-medium truncate">{sample.label}</span>
              <span className="text-[10px] text-indigo-400 font-mono uppercase ml-2 flex-shrink-0">
                {sample.os}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-6 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-2">
            <FileText className="w-4 h-4 text-indigo-400" />
            <span>Paste <code className="text-amber-300 bg-slate-950 px-1 text-lowercase">setup-log.txt</code> Content or Raw Error</span>
          </label>
          <span className="text-xs text-slate-500">Target OS: <strong className="text-white uppercase">{targetOS}</strong></span>
        </div>

        <textarea
          id="setup-log-input"
          rows={7}
          value={logContent}
          onChange={(e) => setLogContent(e.target.value)}
          placeholder="[START] Session initialized...&#10;[FAILED] exit_code=1603 app=Node.js id=OpenJS.NodeJS.LTS&#10;Error 1603: A fatal error occurred during installation..."
          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-all"
        />

        {/* Parsed Summary Quick Badge */}
        {logContent.trim() && (
          <div className="text-xs text-slate-400 bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between">
            <span>
              Detected: <strong className="text-emerald-400">{parsedLogInfo.successfulApps.length} OK</strong>,{' '}
              <strong className="text-amber-400">{parsedLogInfo.failedApps.length || 'Error Detected'} Failed</strong>
            </span>
            <button
              onClick={() => setLogContent('')}
              className="text-xs text-slate-500 hover:text-slate-300 underline"
            >
              Clear Log
            </button>
          </div>
        )}

        <div className="flex justify-end">
          <button
            id="diagnose-error-btn"
            disabled={!logContent.trim() || loading}
            onClick={handleAnalyze}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all cursor-pointer ${
              logContent.trim() && !loading
                ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white hover:brightness-110 shadow-lg shadow-indigo-600/30'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-indigo-300" />
                <span>Diagnosing Log with AI...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 fill-current text-amber-300" />
                <span>Diagnose Error & Generate Fix</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* AI Diagnostic Output Result Card */}
      {diagnosis && (
        <div className="bg-slate-900 border border-indigo-500/40 rounded-2xl p-6 shadow-2xl space-y-6 animate-fade-in">
          {/* Header & Confidence Badge */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">AI Error Diagnosis</h3>
                <span className="text-xs text-slate-400">
                  Source: {diagnosis.source === 'safelist' ? '⚡ Instant Safelist Cache' : '🤖 Gemini 3.6 Flash AI'}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-400">Confidence:</span>
              <span
                className={`px-2.5 py-1 text-xs font-bold uppercase rounded-full border ${
                  diagnosis.confidence === 'high'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    : diagnosis.confidence === 'medium'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                    : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                }`}
              >
                {diagnosis.confidence}
              </span>
            </div>
          </div>

          {/* Plain English Explanation */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Plain-English Explanation
            </label>
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-slate-200 leading-relaxed">
              {diagnosis.explanation}
            </div>
          </div>

          {/* Reviewable Fix Command */}
          {diagnosis.fix_command && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                  <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Recommended Fix Command (For User Review)</span>
                </label>
                <button
                  onClick={handleCopyFix}
                  className="flex items-center space-x-1 text-xs text-indigo-400 hover:text-indigo-300"
                >
                  {copiedFix ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedFix ? 'Copied Command!' : 'Copy Command'}</span>
                </button>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs font-mono text-cyan-300 flex items-center justify-between overflow-x-auto">
                <code>{diagnosis.fix_command}</code>
              </div>

              {/* Safety Rule Notice */}
              <div className="mt-2 text-[11px] text-amber-300/80 flex items-center space-x-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                <span>
                  <strong>Safety Rule (§9.2):</strong> EasySetup never auto-executes commands on your machine. Review the fix command above before executing or downloading the regenerated script.
                </span>
              </div>
            </div>
          )}

          {/* Regenerated Script Action Card (FR23) */}
          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 bg-indigo-950/20 p-4 rounded-xl border border-indigo-500/20">
            <div>
              <div className="font-semibold text-sm text-white flex items-center space-x-2">
                <span>Download Fixed Setup Script</span>
                <span className="text-xs text-emerald-400 font-mono font-normal">
                  ({parsedLogInfo.failedApps.length || 1} failed apps)
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Regenerates a script that applies the fix command first, then retries only the failed apps from your log.
              </p>
            </div>

            <button
              id="download-fixed-script-btn"
              onClick={handleDownloadFixedScript}
              className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold text-xs rounded-xl hover:brightness-110 shadow-lg shadow-emerald-600/20 transition-all flex-shrink-0 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download Fixed Script</span>
            </button>
          </div>

          {downloadedFixedScript && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Downloaded <code className="font-mono text-white">easysetup_fixed.{targetOS === 'windows' ? 'bat' : 'command'}</code> successfully! Double click it on your computer to complete setup.</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
