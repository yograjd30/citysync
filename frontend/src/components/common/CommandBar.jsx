import React, { useState, useEffect } from 'react';
import { GlassCard } from './GlassCard';
import { Search, Command, X, Play, Pause, Flame, GitFork, ShieldAlert, Cpu, FileText } from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';

export function CommandBar({ isOpen, onClose, onNavigate }) {
  const [query, setQuery] = useState('');
  const { togglePlay, addEvent, setStep } = useSimulation();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else window.dispatchEvent(new CustomEvent('citysync:open-command-bar'));
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCommand = (cmd) => {
    const lower = cmd.toLowerCase().trim();

    if (lower.includes('heatwave')) {
      addEvent({ type: 'heatwave', severity: 85, startStep: 120, durationSteps: 72 });
      onClose();
    } else if (lower.includes('stadium')) {
      addEvent({ type: 'stadium_event', zoneId: 'stadium', severity: 95, startStep: 160, durationSteps: 48 });
      onClose();
    } else if (lower.includes('pipe') || lower.includes('water')) {
      addEvent({ type: 'pipe_burst', zoneId: 'industrial', severity: 90, startStep: 110, durationSteps: 40 });
      onClose();
    } else if (lower.includes('play') || lower.includes('run')) {
      togglePlay();
      onClose();
    } else if (lower.includes('graph') || lower.includes('ripple')) {
      onNavigate('graph');
      onClose();
    } else if (lower.includes('scenario') || lower.includes('fork')) {
      onNavigate('scenarios');
      onClose();
    } else if (lower.includes('warn') || lower.includes('breach')) {
      onNavigate('warnings');
      onClose();
    } else if (lower.includes('recommend') || lower.includes('action')) {
      onNavigate('recommendations');
      onClose();
    } else if (lower.includes('weak') || lower.includes('resilience') || lower.includes('brief')) {
      onNavigate('resilience');
      onClose();
    } else if (lower.includes('model') || lower.includes('ml')) {
      onNavigate('models');
      onClose();
    } else {
      // Default to navigating to dashboard
      onNavigate('dashboard');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-xl bg-slate-900 border border-teal-500/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/10">
          <Search className="w-5 h-5 text-teal-400" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleCommand(query);
            }}
            placeholder="Type a command or jump: 'heatwave 80%', 'stadium event', 'run sim'..."
            className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
          />
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Suggestions */}
        <div className="p-3 divide-y divide-white/5 text-xs">
          <div className="pb-2 text-[11px] font-mono text-slate-500 uppercase tracking-wider">
            Quick Actions &amp; Navigation
          </div>

          <div
            onClick={() => handleCommand('heatwave')}
            className="py-2 px-2.5 rounded-lg flex items-center justify-between hover:bg-white/5 cursor-pointer text-slate-200"
          >
            <span className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-rose-400" /> Inject 38°C Urban Heatwave
            </span>
            <span className="text-[10px] text-slate-500 font-mono">Action</span>
          </div>

          <div
            onClick={() => handleCommand('stadium')}
            className="py-2 px-2.5 rounded-lg flex items-center justify-between hover:bg-white/5 cursor-pointer text-slate-200"
          >
            <span className="flex items-center gap-2">
              <GitFork className="w-4 h-4 text-amber-400" /> Inject Stadium Match Egress
            </span>
            <span className="text-[10px] text-slate-500 font-mono">Action</span>
          </div>

          <div
            onClick={() => handleCommand('play')}
            className="py-2 px-2.5 rounded-lg flex items-center justify-between hover:bg-white/5 cursor-pointer text-slate-200"
          >
            <span className="flex items-center gap-2">
              <Play className="w-4 h-4 text-teal-400" /> Toggle Simulation Clock (Play / Pause)
            </span>
            <span className="text-[10px] text-slate-500 font-mono">Sim</span>
          </div>

          <div
            onClick={() => handleCommand('graph')}
            className="py-2 px-2.5 rounded-lg flex items-center justify-between hover:bg-white/5 cursor-pointer text-slate-200"
          >
            <span className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-cyan-400" /> Jump to 24-Node Ripple Engine
            </span>
            <span className="text-[10px] text-slate-500 font-mono">View</span>
          </div>

          <div
            onClick={() => handleCommand('models')}
            className="py-2 px-2.5 rounded-lg flex items-center justify-between hover:bg-white/5 cursor-pointer text-slate-200"
          >
            <span className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-teal-400" /> Inspect Model Provenance (BTP / SLDC)
            </span>
            <span className="text-[10px] text-slate-500 font-mono">View</span>
          </div>
        </div>
      </div>
    </div>
  );
}
