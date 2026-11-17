import React, { useState } from 'react';
import { GlassCard } from '../common/GlassCard';
import { Badge } from '../common/Badge';
import { ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';

export function AlertFeed({ activeAlerts = [], onSelectNode }) {
  const [expandedAlerts, setExpandedAlerts] = useState({});

  const toggleExpand = (alertKey) => {
    setExpandedAlerts((prev) => ({
      ...prev,
      [alertKey]: !prev[alertKey],
    }));
  };

  return (
    <GlassCard className="p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between pb-2.5 border-b border-[var(--hairline)]">
        <div>
          <h3 className="text-xs font-semibold text-[var(--text-primary)]">
            Active Anomaly &amp; Cascade Telemetry
          </h3>
          <p className="text-[11px] text-[var(--text-muted)] font-mono mt-0.5">
            {activeAlerts.length} triggered threshold events
          </p>
        </div>
        <Badge type="Rule-based" />
      </div>

      {activeAlerts.length === 0 ? (
        <div className="py-8 text-center text-xs text-[var(--text-muted)] font-mono">
          ✓ All infrastructure operating within nominal thresholds.
        </div>
      ) : (
        <div className="flex flex-col gap-2 max-h-[380px] overflow-y-auto pr-1">
          {activeAlerts.map((alert, idx) => {
            const alertKey = `${alert.zoneId}:${alert.system}:${idx}`;
            const isExpanded = !!expandedAlerts[alertKey];
            const isCritical = alert.level === 'critical';

            return (
              <div
                key={alertKey}
                className={`p-3 rounded-lg border transition-colors ${
                  isCritical
                    ? 'bg-rose-500/[0.04] border-rose-500/20'
                    : 'bg-amber-500/[0.04] border-amber-500/20'
                }`}
              >
                {/* Header Row */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2">
                    <span
                      className={`w-2 h-2 rounded-full mt-1 ${
                        isCritical ? 'bg-rose-500' : 'bg-amber-400'
                      }`}
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-[var(--text-primary)]">
                          {alert.zoneName}
                        </span>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
                          {alert.system}
                        </span>
                      </div>
                      <p className="text-xs text-[var(--text-secondary)] mt-0.5">{alert.message}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-xs font-mono font-bold ${
                        isCritical ? 'text-rose-400' : 'text-amber-400'
                      }`}
                    >
                      {alert.stress}%
                    </span>
                    <button
                      onClick={() => toggleExpand(alertKey)}
                      className="p-1 rounded text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                      title="Inspect causal chain"
                    >
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Sub row: Impact & Why Trigger */}
                <div className="mt-2 flex items-center justify-between text-[11px] text-[var(--text-muted)] font-mono">
                  <span>~{alert.residentsAffected?.toLocaleString() || '18,500'} citizens affected</span>
                  <button
                    onClick={() => toggleExpand(alertKey)}
                    className="text-cyan-400 hover:underline"
                  >
                    {isExpanded ? 'Hide Causal Chain' : 'Inspect Causal Chain (Why)'}
                  </button>
                </div>

                {/* Why Panel */}
                {isExpanded && (
                  <div className="mt-2.5 pt-2.5 border-t border-[var(--hairline)] text-xs space-y-1.5 bg-[var(--surface-raised)] p-2.5 rounded text-[var(--text-secondary)]">
                    <div className="text-[11px] font-semibold text-[var(--text-primary)] font-mono">
                      Coupling Propagation Sequence:
                    </div>
                    <div className="space-y-1 text-[11px] leading-relaxed">
                      <div>
                        1. <strong>Substation Surge:</strong> Ambient heat &amp; diurnal demand drove load to {alert.stress}%.
                      </div>
                      <div>
                        2. <strong>Signal Degradation (10m lag):</strong> Automated corridor signal heads dropped to amber flashing.
                      </div>
                      <div>
                        3. <strong>Pumping Pressure Loss (15m lag):</strong> Auxiliary booster shed to protect transmission feeder.
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </GlassCard>
  );
}
