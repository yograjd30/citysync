import React from 'react';
import { GlassCard } from '../common/GlassCard';
import { Badge } from '../common/Badge';
import { ShieldCheck, AlertTriangle, AlertOctagon, GitMerge, TrendingUp, TrendingDown } from 'lucide-react';

export function KPIRow({ currentState, pulseHistory }) {
  if (!currentState) return null;

  const { stabilityIndex, nodesInCritical, nodesInWarning, zones } = currentState;

  // Compute status variant
  const stabilityStatus = stabilityIndex >= 70 ? 'normal' : stabilityIndex >= 40 ? 'warning' : 'critical';

  // Compute mini sparkline path
  const minVal = Math.min(...pulseHistory, 40);
  const maxVal = Math.max(...pulseHistory, 100);
  const range = maxVal - minVal || 1;
  const svgWidth = 100;
  const svgHeight = 28;

  const points = pulseHistory
    .map((val, idx) => {
      const x = (idx / (pulseHistory.length - 1 || 1)) * svgWidth;
      const y = svgHeight - ((val - minVal) / range) * (svgHeight - 6) - 3;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  // Compute cascade depth (simulated rule-based based on critical nodes count)
  const cascadeDepth = nodesInCritical > 0 ? Math.min(4, Math.ceil(nodesInCritical / 2)) : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. City Stability Index */}
      <GlassCard variant={stabilityStatus} className="p-4 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-teal-400" />
            <span className="text-xs font-medium text-slate-300">Stability Index</span>
          </div>
          <Badge type="Simulated" />
        </div>

        <div className="mt-3 flex items-baseline justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-heading font-bold text-white tracking-tight">
              {stabilityIndex}
            </span>
            <span className="text-xs text-slate-400 font-mono">/ 100</span>
          </div>

          {/* SVG Sparkline */}
          <div className="w-24 h-7">
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full overflow-visible">
              <polyline
                fill="none"
                stroke={stabilityIndex >= 70 ? '#2dd4bf' : stabilityIndex >= 40 ? '#fbbf24' : '#f43f5e'}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={points}
              />
            </svg>
          </div>
        </div>

        <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-400 font-mono">
          <span
            className={`w-2 h-2 rounded-full animate-pulse ${
              stabilityIndex >= 70 ? 'bg-teal-400' : stabilityIndex >= 40 ? 'bg-amber-400' : 'bg-rose-400'
            }`}
          />
          {stabilityIndex >= 70 ? 'City Grid Synchronized' : stabilityIndex >= 40 ? 'Cross-System Stress' : 'Critical Failure Cascade'}
        </div>
      </GlassCard>

      {/* 2. Critical Nodes */}
      <GlassCard variant={nodesInCritical > 0 ? 'critical' : 'default'} className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertOctagon className={`w-4 h-4 ${nodesInCritical > 0 ? 'text-rose-400' : 'text-slate-400'}`} />
            <span className="text-xs font-medium text-slate-300">Nodes in Critical</span>
          </div>
          <Badge type="Rule-based" />
        </div>

        <div className="mt-3 flex items-baseline justify-between">
          <div className="flex items-baseline gap-2">
            <span className={`text-3xl font-heading font-bold tracking-tight ${nodesInCritical > 0 ? 'text-rose-400' : 'text-white'}`}>
              {nodesInCritical}
            </span>
            <span className="text-xs text-slate-400 font-mono">/ 24 total</span>
          </div>
        </div>

        <div className="mt-2 text-[11px] text-slate-400 font-mono flex items-center justify-between">
          <span>Stress &gt; 70% threshold</span>
          {nodesInCritical > 0 && <span className="text-rose-400 font-semibold">Action Required</span>}
        </div>
      </GlassCard>

      {/* 3. Warning Nodes */}
      <GlassCard variant={nodesInWarning > 0 ? 'warning' : 'default'} className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className={`w-4 h-4 ${nodesInWarning > 0 ? 'text-amber-400' : 'text-slate-400'}`} />
            <span className="text-xs font-medium text-slate-300">Nodes in Warning</span>
          </div>
          <Badge type="Rule-based" />
        </div>

        <div className="mt-3 flex items-baseline justify-between">
          <div className="flex items-baseline gap-2">
            <span className={`text-3xl font-heading font-bold tracking-tight ${nodesInWarning > 0 ? 'text-amber-400' : 'text-white'}`}>
              {nodesInWarning}
            </span>
            <span className="text-xs text-slate-400 font-mono">/ 24 total</span>
          </div>
        </div>

        <div className="mt-2 text-[11px] text-slate-400 font-mono">
          <span>Stress 40% – 70% (Impending breach)</span>
        </div>
      </GlassCard>

      {/* 4. Cascade Depth */}
      <GlassCard className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GitMerge className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-medium text-slate-300">Cascade Propagation</span>
          </div>
          <Badge type="Rule-based" />
        </div>

        <div className="mt-3 flex items-baseline justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-heading font-bold text-white tracking-tight">
              {cascadeDepth}
            </span>
            <span className="text-xs text-slate-400 font-mono">hops deep</span>
          </div>
        </div>

        <div className="mt-2 text-[11px] text-slate-400 font-mono">
          <span>{cascadeDepth === 0 ? 'Zero active chain reaction' : `${cascadeDepth} coupled infrastructure links tripped`}</span>
        </div>
      </GlassCard>
    </div>
  );
}
