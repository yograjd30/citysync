import React, { useState, useEffect } from 'react';
import { Search, X, Play, Flame, GitFork, ShieldAlert, Cpu } from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';

export function CommandBar({ isOpen, onClose, onNavigate }) {
  const [query, setQuery] = useState('');
  const { togglePlay, addEvent } = useSimulation();

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
      onNavigate('dashboard');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 p-4 bg-black/70 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-[var(--surface-card)] border border-[var(--hairline-focused)] rounded-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Input Bar */}
        <div className="flex items-center gap-3 px-3.5 py-3 border-b border-[var(--hairline)]">
          <Search className="w-4 h-4 text-[var(--text-muted)]" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleCommand(query);
            }}
            placeholder="Type command or jump: 'heatwave', 'stadium', 'run sim'..."
            className="flex-1 bg-transparent text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none"
          />
          <button onClick={onClose} className="p-1 rounded text-[var(--text-muted)] hover:text-[var(--text-primary)]">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Suggestions */}
        <div className="p-2 divide-y divide-[var(--hairline)] text-xs">
          <div className="py-2 px-2.5 rounded-lg flex items-center justify-between hover:bg-white/[0.04] cursor-pointer text-[var(--text-secondary)] hover:text-[var(--text-primary)]" onClick={() => handleCommand('heatwave')}>
            <span className="flex items-center gap-2">
              <Flame className="w-3.5 h-3.5 text-rose-400" /> Inject 38°C Urban Heatwave
            </span>
            <span className="text-[10px] text-[var(--text-muted)] font-mono">Action</span>
          </div>

          <div className="py-2 px-2.5 rounded-lg flex items-center justify-between hover:bg-white/[0.04] cursor-pointer text-[var(--text-secondary)] hover:text-[var(--text-primary)]" onClick={() => handleCommand('stadium')}>
            <span className="flex items-center gap-2">
              <GitFork className="w-3.5 h-3.5 text-amber-400" /> Inject Stadium Match Egress
            </span>
            <span className="text-[10px] text-[var(--text-muted)] font-mono">Action</span>
          </div>

          <div className="py-2 px-2.5 rounded-lg flex items-center justify-between hover:bg-white/[0.04] cursor-pointer text-[var(--text-secondary)] hover:text-[var(--text-primary)]" onClick={() => handleCommand('play')}>
            <span className="flex items-center gap-2">
              <Play className="w-3.5 h-3.5 text-emerald-400" /> Toggle Simulation Clock (Play / Pause)
            </span>
            <span className="text-[10px] text-[var(--text-muted)] font-mono">Sim</span>
          </div>

          <div className="py-2 px-2.5 rounded-lg flex items-center justify-between hover:bg-white/[0.04] cursor-pointer text-[var(--text-secondary)] hover:text-[var(--text-primary)]" onClick={() => handleCommand('graph')}>
            <span className="flex items-center gap-2">
              <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" /> Jump to Ripple Engine
            </span>
            <span className="text-[10px] text-[var(--text-muted)] font-mono">View</span>
          </div>

          <div className="py-2 px-2.5 rounded-lg flex items-center justify-between hover:bg-white/[0.04] cursor-pointer text-[var(--text-secondary)] hover:text-[var(--text-primary)]" onClick={() => handleCommand('models')}>
            <span className="flex items-center gap-2">
              <Cpu className="w-3.5 h-3.5 text-[var(--text-muted)]" /> Model Provenance Cards (BTP / SLDC)
            </span>
            <span className="text-[10px] text-[var(--text-muted)] font-mono">View</span>
          </div>
        </div>
      </div>
    </div>
  );
}
