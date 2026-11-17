import React from 'react';
import { Cpu, GitBranch, Binary, CheckCircle2, AlertTriangle, AlertOctagon } from 'lucide-react';

export function Badge({ type, variant, children, className = '' }) {
  // Three-Tier Data Honesty Badges
  if (type === 'Simulated') {
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/25 backdrop-blur-xs ${className}`}>
        <Binary className="w-3 h-3" />
        <span>Simulated</span>
      </span>
    );
  }

  if (type === 'Rule-based') {
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-amber-500/10 text-amber-400 border border-amber-500/25 backdrop-blur-xs ${className}`}>
        <GitBranch className="w-3 h-3" />
        <span>Rule-based</span>
      </span>
    );
  }

  if (type === 'Trained ML') {
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-purple-500/10 text-purple-300 border border-purple-500/25 backdrop-blur-xs ${className}`}>
        <Cpu className="w-3 h-3" />
        <span>Trained ML</span>
      </span>
    );
  }

  // Source Type Chips
  if (type === 'real-data') {
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono uppercase tracking-wider bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 ${className}`}>
        Real Data
      </span>
    );
  }

  if (type === 'synthetic-data') {
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono uppercase tracking-wider bg-slate-500/15 text-slate-300 border border-slate-500/30 ${className}`}>
        Synthetic
      </span>
    );
  }

  // Status Badges
  if (variant === 'normal') {
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 ${className}`}>
        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
        {children || 'Normal'}
      </span>
    );
  }

  if (variant === 'warning') {
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20 ${className}`}>
        <AlertTriangle className="w-3 h-3 text-amber-400" />
        {children || 'Warning'}
      </span>
    );
  }

  if (variant === 'critical') {
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20 ${className}`}>
        <AlertOctagon className="w-3 h-3 text-red-400 animate-pulse" />
        {children || 'Critical'}
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700 ${className}`}>
      {children}
    </span>
  );
}
