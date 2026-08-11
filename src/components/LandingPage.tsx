import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  Terminal,
  Cpu,
  Code2,
  Box,
  Globe,
  Cloud,
  Database,
  Monitor,
  Sparkles,
  Zap,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Clock,
  HardDrive
} from 'lucide-react';

interface LandingPageProps {
  onStartSetup: () => void;
  onOpenFix: () => void;
  onOpenScaffolding: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartSetup,
  onOpenFix,
  onOpenScaffolding,
}) => {
  const [demoLines, setDemoLines] = useState<string[]>([]);
  
  useEffect(() => {
    const lines = [
      "> EasySetup Agent Initializing...",
      "> Scanning target OS: Windows 11",
      "> Detected package manager: Winget",
      "> Queued: VS Code, Node.js, Docker, Python",
      "> Generating batch automation script [EZS-72B]",
      "> ---------------------------------------",
      "> 🚀 Ready for execution!"
    ];
    let i = 0;
    const interval = setInterval(() => {
      setDemoLines(prev => [...prev, lines[i]]);
      i++;
      if (i >= lines.length) clearInterval(interval);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center w-full min-h-screen pt-12 pb-24 space-y-32">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-500/20 blur-[120px] pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[30%] h-[50%] rounded-full bg-violet-600/20 blur-[120px] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative flex flex-col items-center text-center w-full max-w-[1000px] px-6 mx-auto mt-12 z-10">
        
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center space-x-2 px-4 py-1.5 mb-8 rounded-full bg-cyan-500/10 border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
        >
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-semibold text-cyan-300 uppercase tracking-wider">AI-Powered Orchestration</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl sm:text-7xl font-extrabold tracking-tight text-white leading-[1.1] mb-6 max-w-4xl"
        >
          Automate your entire <br className="hidden sm:block" /> 
          <span className="text-gradient">developer stack.</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-secondary text-base sm:text-lg max-w-2xl mb-10 leading-relaxed font-light"
        >
          Stop fighting installer wizards and broken path variables. Generate a single, secure script that configures everything you need in exactly 15 minutes.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onStartSetup}
            className="flex items-center justify-center w-full sm:w-auto space-x-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25 transition-all px-8 py-4 rounded-xl font-semibold text-sm"
          >
            <span>Start Automation Setup</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onOpenFix}
            className="flex items-center justify-center w-full sm:w-auto space-x-2 glass-panel hover:bg-white/5 text-white transition-all px-8 py-4 rounded-xl font-medium text-sm"
          >
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Try AI Setup Chat</span>
          </motion.button>
        </motion.div>

        {/* Animated Terminal Demo */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 w-full max-w-2xl text-left"
        >
          <div className="glass-panel rounded-2xl p-6 shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-500" />
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="text-xs font-mono text-secondary ml-2 uppercase">Terminal Execution Sim</span>
            </div>
            <div className="font-mono text-xs sm:text-sm space-y-2 h-[160px] flex flex-col justify-end text-cyan-300">
               {demoLines.map((line, idx) => (
                 <motion.div 
                   key={idx}
                   initial={{ opacity: 0, x: -10 }}
                   animate={{ opacity: 1, x: 0 }}
                 >
                   {line}
                 </motion.div>
               ))}
               {!demoLines.length && <div className="animate-pulse">_</div>}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Bento Grid Features */}
      <section className="w-full max-w-[1200px] mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Intelligent Infrastructure</h2>
          <p className="text-secondary max-w-xl mx-auto">
            Everything you need to orchestrate local setups perfectly, every time.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <motion.div 
            whileHover={{ y: -5 }}
            className="md:col-span-2 glass-panel rounded-3xl p-8 relative overflow-hidden group"
          >
            <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-cyan-500/20 blur-[80px] group-hover:bg-cyan-500/30 transition-all" />
            <Cpu className="w-10 h-10 text-cyan-400 mb-6" />
            <h3 className="text-2xl font-bold text-white mb-3">Session-Aware AI Agents</h3>
            <p className="text-secondary text-sm max-w-sm">
              If a package fails to install, paste the error. Our AI agent knows exactly what you were trying to install and generates the exact command to bypass the block.
            </p>
          </motion.div>

          <motion.div 
            whileHover={{ y: -5 }}
            className="glass-panel rounded-3xl p-8 relative overflow-hidden group"
          >
            <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-violet-500/20 blur-[50px] group-hover:bg-violet-500/30 transition-all" />
            <Layers className="w-10 h-10 text-violet-400 mb-6" />
            <h3 className="text-2xl font-bold text-white mb-3">CLI Scaffolding</h3>
            <p className="text-secondary text-sm">
              One-click boilerplates for Next.js, AI chatbots, and Python backends.
            </p>
          </motion.div>

          <motion.div 
            whileHover={{ y: -5 }}
            className="glass-panel rounded-3xl p-8 relative overflow-hidden group"
          >
             <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-emerald-500/20 blur-[50px] group-hover:bg-emerald-500/30 transition-all" />
            <Globe className="w-10 h-10 text-emerald-400 mb-6" />
            <h3 className="text-2xl font-bold text-white mb-3">Cross-OS Native</h3>
            <p className="text-secondary text-sm">
              Automatically builds `.bat` for Windows using Winget, and `.command` for Mac using Homebrew.
            </p>
          </motion.div>

          <motion.div 
            whileHover={{ y: -5 }}
            className="md:col-span-2 glass-panel rounded-3xl p-8 relative overflow-hidden flex flex-col sm:flex-row items-center justify-between group"
          >
            <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-blue-500/20 blur-[80px] group-hover:bg-blue-500/30 transition-all" />
            <div className="z-10 text-left">
              <Terminal className="w-10 h-10 text-blue-400 mb-6" />
              <h3 className="text-2xl font-bold text-white mb-3">Zero-Dependency Scripts</h3>
              <p className="text-secondary text-sm max-w-sm">
                No bloated agents to install. Just download one script, run it, and watch the official package managers do the work.
              </p>
            </div>
            
            {/* Visual element */}
            <div className="z-10 mt-8 sm:mt-0 p-4 bg-slate-900 rounded-xl border border-white/10 shadow-lg">
              <div className="flex space-x-4 font-mono text-[10px]">
                 <div className="text-center p-3 bg-white/5 rounded"><div className="text-cyan-400 font-bold text-base mb-1">0</div><span>Accounts</span></div>
                 <div className="text-center p-3 bg-white/5 rounded"><div className="text-emerald-400 font-bold text-base mb-1">100%</div><span>Official</span></div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
};
