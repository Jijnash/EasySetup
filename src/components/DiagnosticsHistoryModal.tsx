import React from 'react';
import { GeneratedSetupSession, DiagnosticRecord } from '../types';
import { X, FileCode, Wrench, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

interface DiagnosticsHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: GeneratedSetupSession[];
  diagnostics: DiagnosticRecord[];
}

export const DiagnosticsHistoryModal: React.FC<DiagnosticsHistoryModalProps> = ({
  isOpen,
  onClose,
  sessions,
  diagnostics,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg">Setup & Diagnostics Activity Log</h3>
              <p className="text-xs text-slate-400">Local session snapshot records for auditing setup script generations and AI fixes</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sessions Section */}
        <div className="space-y-3">
          <h4 className="font-bold text-white text-sm flex items-center space-x-2">
            <Clock className="w-4 h-4 text-indigo-400" />
            <span>Generated Installer Scripts ({sessions.length})</span>
          </h4>

          {sessions.length === 0 ? (
            <p className="text-xs text-slate-500 italic bg-slate-950 p-4 rounded-xl border border-slate-800">
              No setup scripts generated yet in this session.
            </p>
          ) : (
            <div className="space-y-2">
              {sessions.map((sess) => (
                <div
                  key={sess.id}
                  className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl text-xs space-y-1"
                >
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="font-semibold text-white">
                      Installer: <code className="text-indigo-400">{sess.scriptType}</code> ({sess.os.toUpperCase()})
                    </span>
                    <span className="text-slate-500 font-mono text-[11px]">{sess.timestamp}</span>
                  </div>
                  <div className="text-slate-400 flex items-center space-x-3 text-[11px]">
                    <span>Apps: {sess.selectedAppIds.length}</span>
                    <span>Est. Download: ~{sess.totalSizeMb} MB</span>
                    <span>Est. Time: ~{sess.totalTimeMins} mins</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Diagnostics Section */}
        <div className="space-y-3 pt-4 border-t border-slate-800">
          <h4 className="font-bold text-white text-sm flex items-center space-x-2">
            <Wrench className="w-4 h-4 text-amber-400" />
            <span>AI Diagnostic Records ({diagnostics.length})</span>
          </h4>

          {diagnostics.length === 0 ? (
            <p className="text-xs text-slate-500 italic bg-slate-950 p-4 rounded-xl border border-slate-800">
              No error diagnoses logged yet. Use the AI Fix tab when an installation error occurs.
            </p>
          ) : (
            <div className="space-y-2">
              {diagnostics.map((diag) => (
                <div
                  key={diag.id}
                  className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl text-xs space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white flex items-center space-x-2">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                      <span>OS: {diag.os.toUpperCase()}</span>
                    </span>
                    <span className="text-slate-500 font-mono text-[11px]">{diag.created_at}</span>
                  </div>

                  <p className="text-slate-300 text-xs">{diag.explanation}</p>

                  {diag.fix_command && (
                    <div className="bg-slate-900 border border-slate-800 p-2 rounded text-[11px] font-mono text-cyan-300">
                      {diag.fix_command}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 text-white text-xs font-semibold rounded-xl hover:bg-slate-700 transition-all"
          >
            Close Activity Log
          </button>
        </div>
      </div>
    </div>
  );
};
