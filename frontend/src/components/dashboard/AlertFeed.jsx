import React, { useState } from 'react';
import { GlassCard } from '../common/GlassCard';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { AlertTriangle, AlertOctagon, ChevronDown, ChevronUp, Car, Zap, Droplets, Users, HelpCircle } from 'lucide-react';

export function AlertFeed({ activeAlerts = [], onSelectNode }) {
  const [expandedAlerts, setExpandedAlerts] = useState({});

  const toggleExpand = (alertKey) => {
    setExpandedAlerts((prev) => ({
      ...prev,
      [alertKey]: !prev[alertKey],
    }));
  };

  const getSystemIcon = (system) => {
    switch (system) {
      case 'traffic':
        return <Car className="w-4 h-4 text-cyan-400" />;
      case 'electricity':
        return <Zap className="w-4 h-4 text-amber-400" />;
      case 'water':
        return <Droplets className="w-4 h-4 text-teal-400" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-rose-400" />;
    }
  };

  return (
    <GlassCard className="p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between pb-2 border-b border-white/5">
        <div className="flex items-center gap-2">
          <AlertOctagon className="w-4 h-4 text-amber-400" />
          <h3 className="font-heading text-sm font-semibold text-white">
            Active Anomaly &amp; Cascade Feed ({activeAlerts.length})
          </h3>
        </div>
        <Badge type="Rule-based" />
      </div>

      {activeAlerts.length === 0 ? (
        <div className="p-6 text-center text-xs text-slate-400 font-mono">
          ✓ All 24 infrastructure nodes operating within nominal thresholds.
        </div>
      ) : (
        <div className="flex flex-col gap-2.5 max-h-[380px] overflow-y-auto pr-1">
          {activeAlerts.map((alert, idx) => {
            const alertKey = `${alert.zoneId}:${alert.system}:${idx}`;
            const isExpanded = !!expandedAlerts[alertKey];

            return (
              <div
                key={alertKey}
                className={`p-3 rounded-xl border transition-all ${
                  alert.level === 'critical'
                    ? 'bg-rose-950/20 border-rose-500/30'
                    : 'bg-amber-950/20 border-amber-500/30'
                }`}
              >
                {/* Alert Top Row */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5">
                    <div className="mt-0.5">{getSystemIcon(alert.system)}</div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-white">{alert.zoneName}</span>
                        <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                          {alert.system}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-0.5">{alert.message}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant={alert.level}>{alert.stress}% Stress</Badge>
                    <button
                      onClick={() => toggleExpand(alertKey)}
                      className="p-1 rounded text-slate-400 hover:text-white"
                      title="Toggle Why Panel"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Human Impact Pill */}
                <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3 text-teal-400" />
                    ~{alert.residentsAffected?.toLocaleString() || '18,500'} residents affected
                  </span>
                  <button
                    onClick={() => toggleExpand(alertKey)}
                    className="text-teal-400 hover:underline flex items-center gap-1"
                  >
                    <HelpCircle className="w-3 h-3" />
                    {isExpanded ? 'Hide Why Panel' : 'Why is this happening?'}
                  </button>
                </div>

                {/* Expandable Why Panel (Cause & Effect Chain) */}
                {isExpanded && (
                  <div className="mt-3 pt-2.5 border-t border-white/10 text-xs space-y-2 bg-slate-950/50 p-2.5 rounded-lg">
                    <div className="font-semibold text-slate-200 flex items-center justify-between">
                      <span>Causal Chain Reaction (Why Panel)</span>
                      <span className="text-[10px] text-teal-400 font-mono">Coupling Lags Quantized</span>
                    </div>

                    <div className="space-y-1.5 text-slate-300 font-sans">
                      <div className="flex items-start gap-2">
                        <span className="text-amber-400 font-bold">1.</span>
                        <span>
                          <strong>Diurnal Peak / Ambient Heat:</strong> Substation load increased to {alert.stress}%, triggering localized voltage sag.
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-amber-400 font-bold">2.</span>
                        <span>
                          <strong>Signal Degradation (~10 min lag):</strong> Street traffic signals downgraded to fail-safe flashing yellows, backing up main egress corridors.
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-amber-400 font-bold">3.</span>
                        <span>
                          <strong>Pump Interruption (~15 min lag):</strong> Water distribution pressure dropped below 40% as secondary pumps were shed.
                        </span>
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
