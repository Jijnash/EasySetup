import React from 'react';
import { UserProfile, GeneratedSetupSession } from '../types';
import {
  X,
  User,
  Zap,
  Sparkles,
  Download,
  MessageSquare,
  LogOut,
  ShieldCheck,
  Key,
  HardDrive,
  Calendar,
  CheckCircle2,
  Clock
} from 'lucide-react';

interface UserAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  sessions: GeneratedSetupSession[];
  onOpenPricing: () => void;
  onOpenSessionChat: (sessionId: string) => void;
  onLogout: () => void;
}

export const UserAccountModal: React.FC<UserAccountModalProps> = ({
  isOpen,
  onClose,
  user,
  sessions,
  onOpenPricing,
  onOpenSessionChat,
  onLogout,
}) => {
  if (!isOpen) return null;

  const usagePercent = Math.min(
    100,
    Math.round((user.apiCallsUsed / user.apiCallsLimit) * 100)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 my-8">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* User Card Header */}
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 border-b border-slate-800 pb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 via-blue-500 to-emerald-400 p-0.5 shadow-xl shadow-indigo-500/20 flex-shrink-0">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-full h-full object-cover rounded-[14px]"
              />
            ) : (
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-white font-bold text-xl">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <div className="text-center sm:text-left space-y-1 flex-1">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
              <h2 className="text-xl font-bold text-white">{user.name}</h2>
              <span className="px-3 py-1 bg-gradient-to-r from-indigo-500/20 to-emerald-500/20 text-indigo-300 border border-indigo-500/30 rounded-full text-xs font-bold uppercase tracking-wider">
                {user.plan} PLAN
              </span>
            </div>
            <p className="text-xs text-slate-400">{user.email}</p>
            <div className="text-[11px] text-slate-500 flex items-center justify-center sm:justify-start space-x-2 pt-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>Member since {user.joinedDate}</span>
            </div>
          </div>
        </div>

        {/* Usage & Quota Box */}
        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800/80 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-white flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>AI Diagnostics Usage (Monthly)</span>
            </span>
            <span className="font-mono text-indigo-300">
              {user.apiCallsUsed} / {user.apiCallsLimit} calls
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
            <div
              className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full transition-all duration-500"
              style={{ width: `${usagePercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
            <span>Resets on 1st of next month</span>
            {user.plan === 'free' && (
              <button
                onClick={() => {
                  onClose();
                  onOpenPricing();
                }}
                className="text-indigo-400 hover:text-indigo-300 font-bold underline cursor-pointer"
              >
                Upgrade to Pro for Unlimited
              </button>
            )}
          </div>
        </div>

        {/* Saved Sessions History */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-sm">Saved Setup Sessions</h3>
            <span className="text-xs text-slate-500 font-mono">{sessions.length} sessions</span>
          </div>

          <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1 scrollbar-thin">
            {sessions.map((sess) => (
              <div
                key={sess.id}
                className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between text-xs"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-white font-mono">{sess.id}</span>
                    <span className="px-2 py-0.5 bg-slate-900 border border-slate-800 text-slate-400 rounded text-[10px] uppercase">
                      {sess.os}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    {sess.selectedAppIds.length} apps • {sess.totalSizeMb} MB • {sess.timestamp}
                  </p>
                </div>

                <button
                  onClick={() => {
                    onClose();
                    onOpenSessionChat(sess.id);
                  }}
                  className="px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 rounded-lg font-medium text-[11px] transition-all flex items-center space-x-1 cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Open Chat</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800 text-xs">
          <button
            onClick={() => {
              onClose();
              onOpenPricing();
            }}
            className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold rounded-xl shadow-md hover:brightness-110 transition-all cursor-pointer"
          >
            Upgrade Plan
          </button>

          <button
            onClick={() => {
              onLogout();
              onClose();
            }}
            className="flex items-center space-x-1.5 px-4 py-2 bg-slate-950 border border-slate-800 hover:border-rose-500/40 text-slate-400 hover:text-rose-400 rounded-xl transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};
