import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { TargetOS, GeneratedSetupSession, DiagnosticResponse, ChatMessage } from '../types';
import { parseSetupLog } from '../utils/logParser';
import { generateWindowsBatScript, generateMacCommandScript, downloadScriptFile } from '../utils/scriptGenerator';
import { SOFTWARE_CATALOG } from '../data/appsData';
import {
  Bot,
  User,
  Send,
  Terminal,
  ShieldCheck,
  AlertTriangle,
  Download,
  Check,
  Loader2,
  Sparkles,
  CheckCircle2,
  Info,
  ShieldAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AiSetupChatProps {
  sessions: GeneratedSetupSession[];
  targetOS: TargetOS;
  setTargetOS: (os: TargetOS) => void;
  onRecordDiagnostic: (res: DiagnosticResponse, rawError: string, os: TargetOS) => void;
}

export const AiSetupChat: React.FC<AiSetupChatProps> = ({
  sessions,
  targetOS,
  setTargetOS,
  onRecordDiagnostic,
}) => {
  const [selectedSessionId, setSelectedSessionId] = useState<string>(
    sessions[0]?.id || 'EZS-7K2P'
  );
  
  // Make sure it updates if sessions change (e.g., right after generate script is clicked)
  useEffect(() => {
    if (sessions.length > 0) {
      setSelectedSessionId(sessions[0].id);
    }
  }, [sessions]);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputContent, setInputContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [acceptedFix, setAcceptedFix] = useState<string | null>(null);
  const [downloadedFixedScript, setDownloadedFixedScript] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Find active session
  const activeSession = sessions.find((s) => s.id === selectedSessionId) || {
    id: selectedSessionId || 'EZS-7K2P',
    timestamp: new Date().toLocaleString(),
    selectedAppIds: ['vscode', 'git', 'nodejs', 'chrome'],
    os: targetOS,
    scriptType: targetOS === 'windows' ? '.bat' : '.command',
    totalSizeMb: 680,
    totalTimeMins: 12,
  };

  const activeApps = SOFTWARE_CATALOG.filter((app) =>
    activeSession.selectedAppIds.includes(app.id)
  );

  const filename = activeSession.os === 'windows' ? `easysetup_${activeSession.id}.bat` : `easysetup_${activeSession.id}.command`;

  const handleManualDownload = () => {
    let content = '';
    if (activeSession.os === 'windows') {
      content = generateWindowsBatScript(activeApps, [], activeSession.id);
    } else {
      content = generateMacCommandScript(activeApps, [], activeSession.id);
    }
    downloadScriptFile(filename, content);
  };

  // Fetch history or initialize proactive AI welcome message
  useEffect(() => {
    const fetchHistory = async () => {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', activeSession.id)
        .order('created_at', { ascending: true });

      if (data && data.length > 0) {
        setMessages(data as ChatMessage[]);
      } else {
        const appNames = activeApps.map((a) => a.name).join(', ') || 'Software Package';
        const initialAiMsg: ChatMessage = {
          id: `msg_init_${Date.now()}`,
          session_id: activeSession.id,
          role: 'assistant',
          content: `Hello! I'm your EasySetup AI Assistant. I see you just generated the script **${filename}** for session **${activeSession.id}** (${activeSession.os.toUpperCase()}).\n\nYour setup includes: **${appNames}**.\n\nI am currently waiting for your installation to finish. If any installation fails or outputs an error, you can find the logs at \`$HOME/Desktop/setup-log.txt\`. Please paste the contents of that log file below, and I will analyze the failure in context and generate a safe fix command!`,
          created_at: new Date().toLocaleTimeString(),
        };
        setMessages([initialAiMsg]);
        await supabase.from('chat_messages').insert(initialAiMsg);
      }
      setAcceptedFix(null);
      setDownloadedFixedScript(false);
    };

    fetchHistory();
  }, [selectedSessionId, activeSession.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async () => {
    if (!inputContent.trim() || loading) return;

    const userText = inputContent.trim();
    setInputContent('');

    const userMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      session_id: activeSession.id,
      role: 'user',
      content: userText,
      created_at: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    // Save user message to Supabase
    await supabase.from('chat_messages').insert(userMsg);

    const parsed = parseSetupLog(userText, targetOS);

    try {
      const { data, error } = await supabase.functions.invoke('diagnose-error', {
        body: {
          app: parsed.failedApps.map((a) => a.name).join(', ') || activeApps.map((a) => a.name).join(', ') || 'Software Package',
          os: activeSession.os || targetOS,
          error_text: userText,
        },
      });

      if (error) throw error;

      let replyContent = data.explanation;
      if (data.source === 'safelist') {
        replyContent = `⚡ **Instant Safelist Match:**\n${data.explanation}`;
      }

      const aiMsg: ChatMessage = {
        id: `msg_${Date.now()}_ai`,
        session_id: activeSession.id,
        role: 'assistant',
        content: replyContent,
        fix_command: data.fix_command,
        created_at: new Date().toLocaleTimeString(),
      };

      setMessages((prev) => [...prev, aiMsg]);
      
      // Save assistant message to Supabase
      await supabase.from('chat_messages').insert(aiMsg);

      onRecordDiagnostic(data, userText, targetOS);
    } catch (err: any) {
      const fallbackMsg: ChatMessage = {
        id: `msg_${Date.now()}_err`,
        session_id: activeSession.id,
        role: 'assistant',
        content: 'I analyzed your error log. Please verify your internet connection and ensure winget/brew is updated.',
        fix_command: targetOS === 'windows' ? 'winget source update' : 'brew update',
        created_at: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptFix = (cmd: string) => {
    setAcceptedFix(cmd);
  };

  const handleDownloadUpdatedScript = () => {
    if (!acceptedFix) return;

    const customPreCmds = [acceptedFix];

    let content = '';
    let updatedFilename = '';

    if (activeSession.os === 'windows') {
      updatedFilename = `easysetup_${activeSession.id}_v2.bat`;
      content = generateWindowsBatScript(activeApps, customPreCmds, activeSession.id);
    } else {
      updatedFilename = `easysetup_${activeSession.id}_v2.command`;
      content = generateMacCommandScript(activeApps, customPreCmds, activeSession.id);
    }

    downloadScriptFile(updatedFilename, content);
    setDownloadedFixedScript(true);
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto pb-12">
      
      {/* 2-Column Dashboard Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Instructions & Status */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="bg-gradient-to-br from-indigo-950/60 to-slate-900 border border-indigo-500/30 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 blur-[50px] pointer-events-none" />
            
            <div className="flex items-center space-x-3 mb-6 relative z-10">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-white">Installation Active</h2>
                <p className="text-sm text-slate-400">Session: <span className="text-amber-300 font-mono">{activeSession.id}</span></p>
              </div>
            </div>

            <div className="space-y-4 relative z-10">
              <div className="bg-slate-950/50 rounded-xl p-4 border border-white/5">
                <h3 className="text-sm font-bold text-white mb-2 flex items-center">
                  <Terminal className="w-4 h-4 mr-2 text-cyan-400" />
                  How to run {filename}
                </h3>
                
                {activeSession.os === 'windows' ? (
                  <ol className="list-decimal list-inside space-y-2 text-xs text-slate-300">
                    <li>Find <code className="text-amber-300 bg-slate-900 px-1 py-0.5 rounded font-mono">{filename}</code> in Downloads.</li>
                    <li>Double click the file to execute.</li>
                    <li>If Windows SmartScreen blocks it, click <strong>More Info</strong> → <strong>Run Anyway</strong>.</li>
                    <li>Accept the Administrator UAC prompt.</li>
                  </ol>
                ) : (
                  <ol className="list-decimal list-inside space-y-2 text-xs text-slate-300">
                    <li>Find <code className="text-amber-300 bg-slate-900 px-1 py-0.5 rounded font-mono">{filename}</code> in Downloads.</li>
                    <li>Open Terminal and run: <br/><code className="text-amber-300 bg-slate-900 px-1.5 py-0.5 rounded font-mono mt-1 inline-block">chmod +x ~/Downloads/{filename}</code></li>
                    <li>Double click the file in Finder to run it.</li>
                  </ol>
                )}
              </div>

              <div className="bg-amber-500/10 rounded-xl p-4 border border-amber-500/20">
                <h3 className="text-sm font-bold text-amber-400 mb-2 flex items-center">
                  <ShieldAlert className="w-4 h-4 mr-2" />
                  Encountered an Error?
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  All installation logs are automatically written to your desktop. If a package fails to install, open the file below and paste the contents into the AI chat.
                </p>
                <code className="block bg-slate-950 p-2 rounded-lg text-xs font-mono text-amber-300 border border-amber-500/20 text-center">
                  $HOME/Desktop/setup-log.txt
                </code>
              </div>

              <button
                onClick={handleManualDownload}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-semibold text-white transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Download {filename} Again</span>
              </button>
            </div>
          </div>
          
        </div>

        {/* Right Column: AI Chat Interface */}
        <div className="lg:col-span-8 flex flex-col h-[calc(100vh-140px)] min-h-[600px] bg-slate-900 border border-white/10 rounded-3xl shadow-2xl relative overflow-hidden">
          
          <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-slate-900 to-transparent z-10 pointer-events-none" />
          
          {/* Chat Header */}
          <div className="p-4 border-b border-white/5 bg-slate-950/30 flex items-center justify-between relative z-20">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-indigo-600/20 flex items-center justify-center text-indigo-400 border border-indigo-500/30 relative">
                <Bot className="w-5 h-5" />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-slate-900"></span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">AI Support Agent</h3>
                <p className="text-[10px] text-slate-400 flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse mr-1.5"></span>
                  Listening for setup-log.txt...
                </p>
              </div>
            </div>
            
            {/* Session Switcher (Hidden if only 1 session) */}
            {sessions.length > 1 && (
              <select
                value={selectedSessionId}
                onChange={(e) => setSelectedSessionId(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-white rounded-lg px-2.5 py-1 text-xs font-mono focus:outline-none focus:border-indigo-500"
              >
                {sessions.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.id}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Scrollable Message History */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            {messages.map((msg) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={msg.id}
                className={`flex items-start space-x-4 ${
                  msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold border ${
                    msg.role === 'user'
                      ? 'bg-indigo-600 text-white border-indigo-500'
                      : 'bg-slate-800 text-cyan-400 border-white/10'
                  }`}
                >
                  {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                </div>

                <div
                  className={`max-w-[85%] rounded-2xl p-5 text-sm space-y-3 leading-relaxed shadow-lg ${
                    msg.role === 'user'
                      ? 'bg-indigo-600/90 text-white rounded-tr-sm border border-indigo-500/50'
                      : 'bg-slate-950/80 border border-white/5 text-slate-200 rounded-tl-sm'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.content}</div>

                  {/* Proposed Fix Command Card inside message */}
                  {msg.fix_command && (
                    <div className="mt-4 p-4 bg-slate-900 border border-cyan-500/30 rounded-xl space-y-3 shadow-inner">
                      <div className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider flex items-center justify-between">
                        <span>Safe Fix Command Generated</span>
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <code className="block bg-black/60 p-3 rounded-lg text-xs font-mono text-cyan-300 overflow-x-auto border border-white/5">
                        {msg.fix_command}
                      </code>

                      <div className="pt-2">
                        <button
                          onClick={() => handleAcceptFix(msg.fix_command!)}
                          className="w-full justify-center px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold text-xs rounded-xl hover:brightness-110 transition-all flex items-center space-x-2 cursor-pointer shadow-lg shadow-emerald-500/20"
                        >
                          <Check className="w-4 h-4" />
                          <span>Approve & Prepend to Setup Script</span>
                        </button>
                      </div>
                    </div>
                  )}

                  <div className={`text-[10px] ${msg.role === 'user' ? 'text-indigo-200' : 'text-slate-500'} text-right`}>{msg.created_at}</div>
                </div>
              </motion.div>
            ))}

            {loading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center">
                  <Loader2 className="w-5 h-5 animate-spin text-cyan-400" />
                </div>
                <div className="bg-slate-950/80 border border-white/5 text-slate-400 p-4 rounded-2xl rounded-tl-sm text-sm">
                  <span className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                    <span>Analyzing setup log against session manifest with AI...</span>
                  </span>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Bar */}
          <div className="p-4 bg-slate-950/50 border-t border-white/5">
            <div className="flex items-end space-x-3 bg-black/40 border border-white/10 rounded-2xl p-2 focus-within:border-indigo-500/50 focus-within:shadow-[0_0_15px_rgba(99,102,241,0.15)] transition-all">
              <textarea
                rows={2}
                value={inputContent}
                onChange={(e) => setInputContent(e.target.value)}
                placeholder="Paste the contents of $HOME/Desktop/setup-log.txt here to diagnose an issue..."
                className="flex-1 bg-transparent border-none p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-0 resize-none min-h-[60px]"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
              />

              <button
                id="chat-send-btn"
                disabled={!inputContent.trim() || loading}
                onClick={handleSend}
                className={`p-4 rounded-xl font-bold transition-all cursor-pointer flex-shrink-0 ${
                  inputContent.trim() && !loading
                    ? 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/30'
                    : 'bg-white/5 text-slate-600 cursor-not-allowed'
                }`}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Fix Review & Re-download Confirmation Card (Absolute Overlay) */}
          <AnimatePresence>
            {acceptedFix && (
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                className="absolute bottom-24 left-6 right-6 bg-gradient-to-r from-slate-900 to-emerald-950/80 backdrop-blur-xl border border-emerald-500/40 rounded-2xl p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] z-30"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shadow-inner border border-emerald-500/30">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-base">Fix Accepted for Session {activeSession.id}</h3>
                      <p className="text-xs text-slate-400 mt-1">
                        Script regenerated with: <code className="text-cyan-300 font-mono bg-black/50 px-1.5 py-0.5 rounded">{acceptedFix}</code>
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end space-y-2 w-full sm:w-auto">
                    <button
                      onClick={handleDownloadUpdatedScript}
                      className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-sm rounded-xl hover:brightness-110 shadow-lg shadow-emerald-500/25 transition-all cursor-pointer whitespace-nowrap"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Fixed Script (v2)</span>
                    </button>
                    {downloadedFixedScript && (
                      <span className="text-[10px] text-emerald-400 font-medium">✓ Download complete. Run it to continue.</span>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
        </div>
      </div>
    </div>
  );
};
