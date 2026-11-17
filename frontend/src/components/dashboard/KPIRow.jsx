import React from 'react';
import { GlassCard } from '../common/GlassCard';
import { Badge } from '../common/Badge';

export function KPIRow({ currentState, pulseHistory }) {
  if (!currentState) return null;

  const { stabilityIndex, nodesInCritical, nodesInWarning } = currentState;

  // Mini sparkline calculation
  const minVal = Math.min(...pulseHistory, 40);
  const maxVal = Math.max(...pulseHistory, 100);
  const range = maxVal - minVal || 1;
  const svgWidth = 88;
  const svgHeight = 24;

  const points = pulseHistory
    .map((val, idx) => {
      const x = (idx / (pulseHistory.length - 1 || 1)) * svgWidth;
      const y = svgHeight - ((val - minVal) / range) * (svgHeight - 4) - 2;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  const cascadeDepth = nodesInCritical > 0 ? Math.min(4, Math.ceil(nodesInCritical / 2)) : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
      {/* 1. City Stability Index */}
      <GlassCard className="p-4 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-[var(--text-secondary)]">Stability Index</span>
          <Badge type="Simulated" />
        </div>

        <div className="mt-2.5 flex items-baseline justify-between">
          <div className="flex items-baseline gap-1.5 font-tabular">
            <span className="text-3xl font-semibold tracking-tight text-[var(--text-primary)]">
              {stabilityIndex}
            </span>
            <span className="text-xs text-[var(--text-muted)] font-mono">/100</span>
          </div>

          {/* Thin, clean SVG Sparkline */}
          <div className="w-20 h-6">
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full overflow-visible">
              <polyline
                fill="none"
                stroke={stabilityIndex >= 70 ? '#10b981' : stabilityIndex >= 40 ? '#f59e0b' : '#ef4444'}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={points}
              />
            </svg>
          </div>
        </div>

        <div className="mt-2 flex items-center gap-1.5 text-[11px] text-[var(--text-muted)]">
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              stabilityIndex >= 70 ? 'bg-emerald-400' : stabilityIndex >= 40 ? 'bg-amber-400' : 'bg-rose-400'
            }`}
          />
          {stabilityIndex >= 70 ? 'Nominal grid synchrony' : stabilityIndex >= 40 ? 'Coupled stress detected' : 'Cascade in progress'}
        </div>
      </GlassCard>

      {/* 2. Critical Nodes */}
      <GlassCard className="p-4 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-[var(--text-secondary)]">Critical Nodes</span>
          <Badge type="Rule-based" />
        </div>

        <div className="mt-2.5 flex items-baseline gap-1.5 font-tabular">
          <span className={`text-3xl font-semibold tracking-tight ${nodesInCritical > 0 ? 'text-rose-400' : 'text-[var(--text-primary)]'}`}>
            {nodesInCritical}
          </span>
          <span className="text-xs text-[var(--text-muted)] font-mono">/ 24 total</span>
        </div>

        <div className="mt-2 text-[11px] text-[var(--text-muted)]">
          {nodesInCritical > 0 ? 'Stress > 70% threshold' : 'Zero nodes past threshold'}
        </div>
      </GlassCard>

      {/* 3. Warning Nodes */}
      <GlassCard className="p-4 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-[var(--text-secondary)]">Warning Nodes</span>
          <Badge type="Rule-based" />
        </div>

        <div className="mt-2.5 flex items-baseline gap-1.5 font-tabular">
          <span className={`text-3xl font-semibold tracking-tight ${nodesInWarning > 0 ? 'text-amber-400' : 'text-[var(--text-primary)]'}`}>
            {nodesInWarning}
          </span>
          <span className="text-xs text-[var(--text-muted)] font-mono">/ 24 total</span>
        </div>

        <div className="mt-2 text-[11px] text-[var(--text-muted)]">
          {nodesInWarning > 0 ? 'Impending breach (40–70%)' : 'All systems operating within bounds'}
        </div>
      </GlassCard>

      {/* 4. Cascade Depth */}
      <GlassCard className="p-4 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-[var(--text-secondary)]">Cascade Depth</span>
          <Badge type="Rule-based" />
        </div>

        <div className="mt-2.5 flex items-baseline gap-1.5 font-tabular">
          <span className="text-3xl font-semibold tracking-tight text-[var(--text-primary)]">
            {cascadeDepth}
          </span>
          <span className="text-xs text-[var(--text-muted)] font-mono">hops deep</span>
        </div>

        <div className="mt-2 text-[11px] text-[var(--text-muted)]">
          {cascadeDepth === 0 ? 'Zero active secondary spread' : `${cascadeDepth} coupled links triggered`}
        </div>
      </GlassCard>
    </div>
  );
}
