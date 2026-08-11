import React from 'react';
import { TargetOS } from '../types';
import { X, ShieldAlert, CheckCircle2, HelpCircle, Terminal, AlertTriangle } from 'lucide-react';

interface SmartScreenGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetOS: TargetOS;
}

export const SmartScreenGuideModal: React.FC<SmartScreenGuideModalProps> = ({
  isOpen,
  onClose,
  targetOS,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg">OS Safety & Security Guide</h3>
              <p className="text-xs text-slate-400">Why Windows Defender / Mac Gatekeeper flags setup scripts & how to run them safely</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Explanation of Unsigned Scripts */}
        <div className="bg-indigo-950/20 border border-indigo-500/30 rounded-xl p-4 text-xs text-slate-300 space-y-2">
          <div className="font-semibold text-indigo-300 text-sm flex items-center space-x-1.5">
            <HelpCircle className="w-4 h-4 text-indigo-400" />
            <span>Why does Windows / Mac show a warning?</span>
          </div>
          <p>
            EasySetup generates custom <code className="text-indigo-300">.bat</code> and <code className="text-indigo-300">.command</code> scripts on the fly in your browser. Because these scripts are created locally on demand and are not signed with a paid $400/yr Code Signing Certificate, your operating system shows an unverified script warning.
          </p>
          <p className="text-emerald-400 font-medium">
            ✓ EasySetup scripts only invoke official vendor package managers (<code className="font-mono">winget</code> on Windows, <code className="font-mono">brew</code> on Mac). EasySetup never hosts binaries itself.
          </p>
        </div>

        {/* Windows Guide */}
        <div className="space-y-3">
          <h4 className="font-bold text-white text-sm flex items-center space-x-2">
            <span>🪟 Windows SmartScreen Bypass Instructions</span>
          </h4>
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3 text-xs text-slate-300">
            <div className="flex items-start space-x-3">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center flex-shrink-0 text-xs">
                1
              </span>
              <div>
                <span className="font-semibold text-white">Double click <code className="text-amber-300">easysetup.bat</code></span>
                <p className="text-slate-400 mt-0.5">A blue banner reading <em>"Windows protected your PC"</em> will appear.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center flex-shrink-0 text-xs">
                2
              </span>
              <div>
                <span className="font-semibold text-white">Click <u>"More Info"</u></span>
                <p className="text-slate-400 mt-0.5">Click the underlined text below the message body.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center flex-shrink-0 text-xs">
                3
              </span>
              <div>
                <span className="font-semibold text-white">Click <u>"Run Anyway"</u></span>
                <p className="text-slate-400 mt-0.5">The script will open PowerShell and install your selected apps with progress tracking.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mac Guide */}
        <div className="space-y-3">
          <h4 className="font-bold text-white text-sm flex items-center space-x-2">
            <span>🍎 macOS Gatekeeper Bypass Instructions</span>
          </h4>
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3 text-xs text-slate-300">
            <div className="flex items-start space-x-3">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center flex-shrink-0 text-xs">
                1
              </span>
              <div>
                <span className="font-semibold text-white">Grant Execution Permissions</span>
                <p className="text-slate-400 mt-0.5">
                  Open Terminal and run: <code className="bg-slate-900 px-2 py-0.5 rounded text-amber-300">chmod +x ~/Downloads/easysetup.command</code>
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center flex-shrink-0 text-xs">
                2
              </span>
              <div>
                <span className="font-semibold text-white">Right-Click &rarr; Open</span>
                <p className="text-slate-400 mt-0.5">Right-click <code className="text-amber-300">easysetup.command</code> in Finder and select <strong>Open</strong> to bypass Gatekeeper.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-xl hover:bg-indigo-500 transition-all"
          >
            Got It!
          </button>
        </div>
      </div>
    </div>
  );
};
