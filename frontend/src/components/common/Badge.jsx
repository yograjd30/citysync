import React from 'react';

export function Badge({ type, variant, children, className = '' }) {
  // Three-Tier Data Honesty Badges
  if (type === 'Simulated') {
    return (
      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[4px] text-[11px] font-mono tracking-tight bg-slate-800/60 text-slate-300 border border-white/[0.08] ${className}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
        <span>Simulated</span>
      </span>
    );
  }

  if (type === 'Rule-based') {
    return (
      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[4px] text-[11px] font-mono tracking-tight bg-slate-800/60 text-slate-300 border border-white/[0.08] ${className}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
        <span>Rule-based</span>
      </span>
    );
  }

  if (type === 'Trained ML') {
    return (
      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[4px] text-[11px] font-mono tracking-tight bg-slate-800/60 text-slate-300 border border-white/[0.08] ${className}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
        <span>Trained ML</span>
      </span>
    );
  }

  // Source Type Chips
  if (type === 'real-data') {
    return (
      <span className={`inline-flex items-center px-1.5 py-0.5 rounded-[4px] text-[10px] font-mono uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 ${className}`}>
        Real Data
      </span>
    );
  }

  if (type === 'synthetic-data') {
    return (
      <span className={`inline-flex items-center px-1.5 py-0.5 rounded-[4px] text-[10px] font-mono uppercase tracking-wider bg-slate-800 text-slate-400 border border-white/[0.06] ${className}`}>
        Synthetic
      </span>
    );
  }

  // Status Badges
  if (variant === 'normal') {
    return (
      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[4px] text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 ${className}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
        {children || 'Normal'}
      </span>
    );
  }

  if (variant === 'warning') {
    return (
      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[4px] text-[11px] font-medium bg-amber-500/10 text-amber-300 border border-amber-500/20 ${className}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
        {children || 'Warning'}
      </span>
    );
  }

  if (variant === 'critical') {
    return (
      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[4px] text-[11px] font-medium bg-rose-500/10 text-rose-300 border border-rose-500/25 ${className}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
        {children || 'Critical'}
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-[4px] text-[11px] font-medium bg-slate-800/60 text-slate-300 border border-white/[0.08] ${className}`}>
      {children}
    </span>
  );
}
