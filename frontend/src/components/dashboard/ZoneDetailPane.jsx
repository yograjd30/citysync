import React, { useState, useEffect } from 'react';
import { GlassCard } from '../common/GlassCard';
import { Badge } from '../common/Badge';
import { X, GitBranch } from 'lucide-react';
import { apiRequest } from '../../api/client';

export function ZoneDetailPane({ zoneId, currentState, onClose }) {
  const [traceData, setTraceData] = useState(null);

  const zone = currentState?.zones?.find((z) => z.zoneId === zoneId);

  useEffect(() => {
    if (zone) {
      const topSystem = 'traffic';
      apiRequest(`/api/simulation/cascade-trace?nodeId=${zoneId}:${topSystem}&step=${currentState.step}`)
        .then((data) => setTraceData(data))
        .catch(() => setTraceData(null));
    }
  }, [zoneId, currentState?.step]);

  if (!zone) return null;

  return (
    <GlassCard className="p-4 flex flex-col gap-3.5">
      {/* Header */}
      <div className="flex items-start justify-between pb-2.5 border-b border-[var(--hairline)]">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">{zone.name}</h3>
            <Badge type="Simulated" />
          </div>
          <div className="flex items-center gap-2 text-[11px] text-[var(--text-muted)] font-mono mt-0.5">
            <span>{zone.population.toLocaleString()} Residents</span>
            <span>•</span>
            <span className="capitalize">{zone.type?.replace('_', ' ')}</span>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-1 rounded text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* 3 Infrastructure Systems Grid */}
      <div className="grid grid-cols-3 gap-2.5">
        {/* Traffic */}
        <div className="p-2.5 rounded-lg bg-[var(--surface-raised)] border border-[var(--hairline)] flex flex-col justify-between">
          <div className="text-[11px] font-medium text-[var(--text-secondary)]">Traffic Flow</div>
          <div className="mt-2">
            <div className="text-xl font-semibold font-tabular text-[var(--text-primary)]">
              {zone.traffic.stress}%
            </div>
            <div className="text-[10px] text-[var(--text-muted)] font-mono mt-0.5">
              {zone.traffic.avgSpeedKmh} km/h avg
            </div>
          </div>
        </div>

        {/* Electricity */}
        <div className="p-2.5 rounded-lg bg-[var(--surface-raised)] border border-[var(--hairline)] flex flex-col justify-between">
          <div className="text-[11px] font-medium text-[var(--text-secondary)]">Grid Power</div>
          <div className="mt-2">
            <div className="text-xl font-semibold font-tabular text-[var(--text-primary)]">
              {zone.electricity.stress}%
            </div>
            <div className="text-[10px] text-[var(--text-muted)] font-mono mt-0.5">
              {zone.electricity.demand}% load
            </div>
          </div>
        </div>

        {/* Water */}
        <div className="p-2.5 rounded-lg bg-[var(--surface-raised)] border border-[var(--hairline)] flex flex-col justify-between">
          <div className="text-[11px] font-medium text-[var(--text-secondary)]">Water Main</div>
          <div className="mt-2">
            <div className="text-xl font-semibold font-tabular text-[var(--text-primary)]">
              {zone.water.stress}%
            </div>
            <div className="text-[10px] text-[var(--text-muted)] font-mono mt-0.5">
              {zone.water.pressure}% press.
            </div>
          </div>
        </div>
      </div>

      {/* Causal Chain Trace Summary */}
      {traceData && (
        <div className="p-3 rounded-lg bg-[var(--surface-raised)] border border-[var(--hairline)] text-xs space-y-1.5">
          <div className="flex items-center justify-between font-mono text-[11px] text-[var(--text-secondary)] font-semibold">
            <span className="flex items-center gap-1.5">
              <GitBranch className="w-3.5 h-3.5 text-cyan-400" />
              Direct Causal Coupling
            </span>
            <span className="text-[10px] text-[var(--text-muted)]">Quantized Lags</span>
          </div>

          <div className="space-y-1 text-[11px] text-[var(--text-secondary)]">
            {traceData.causes?.slice(0, 2).map((c, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-amber-400">←</span>
                <span>{c.cause}</span>
                <span className="text-[10px] text-[var(--text-muted)] font-mono">({c.lagMinutes}m lag)</span>
              </div>
            ))}
            {traceData.forwardImpacts?.slice(0, 2).map((f, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-rose-400">→</span>
                <span>{f.description}</span>
                <span className="text-[10px] text-[var(--text-muted)] font-mono">(+{f.lagMinutes}m)</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </GlassCard>
  );
}
