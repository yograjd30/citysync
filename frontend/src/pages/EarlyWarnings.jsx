import React, { useState, useEffect } from 'react';
import { GlassCard } from '../components/common/GlassCard';
import { Badge } from '../components/common/Badge';
import { useSimulation } from '../context/SimulationContext';
import { Clock, Users, ArrowUpRight } from 'lucide-react';
import { apiRequest } from '../api/client';

export function EarlyWarnings() {
  const { step, seed, activeEvents, interventions } = useSimulation();
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedNodes, setExpandedNodes] = useState({});

  useEffect(() => {
    async function loadForecast() {
      try {
        const qEvents = encodeURIComponent(JSON.stringify(activeEvents));
        const qInterventions = encodeURIComponent(JSON.stringify(interventions));
        const res = await apiRequest(
          `/api/simulation/forecast?step=${step}&seed=${seed}&horizon=24&events=${qEvents}&interventions=${qInterventions}`
        );
        setForecastData(res);
      } catch (err) {
        console.error('Failed to load forecast', err);
      } finally {
        setLoading(false);
      }
    }
    loadForecast();
  }, [step, seed, activeEvents, interventions]);

  const toggleExpand = (nodeId) => {
    setExpandedNodes((prev) => ({
      ...prev,
      [nodeId]: !prev[nodeId],
    }));
  };

  const impending = forecastData?.impendingBreaches || [];
  const allForecasts = forecastData?.forecast || [];

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-[var(--text-primary)]">Early Warning Radar &amp; Time-to-Breach</h2>
            <Badge type="Rule-based" />
          </div>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Statistical trend &amp; deterministic coupling projection across a 2-hour horizon (24 ticks).
          </p>
        </div>

        <div className="text-xs font-mono text-[var(--text-secondary)]">
          {impending.length} Impending Breaches Ahead
        </div>
      </div>

      {/* Impending Breaches Cards */}
      {impending.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {impending.map((item) => {
            const isExpanded = !!expandedNodes[item.nodeId];
            return (
              <GlassCard
                key={item.nodeId}
                variant="warning"
                className="p-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-medium text-[var(--text-primary)] text-sm">{item.zoneName}</div>
                      <div className="text-[11px] font-mono text-[var(--text-muted)] capitalize mt-0.5">
                        {item.system} Sector
                      </div>
                    </div>
                    <div className="text-right font-tabular">
                      <div className="text-xs font-mono font-semibold text-rose-400 flex items-center gap-1 justify-end">
                        <Clock className="w-3 h-3" /> ~{item.timeToBreachMinutes}m
                      </div>
                      <span className="text-[10px] text-[var(--text-muted)] font-mono">Time to Breach</span>
                    </div>
                  </div>

                  {/* Clean Stress Bar */}
                  <div className="mt-3">
                    <div className="flex justify-between text-[11px] font-mono mb-1 text-[var(--text-muted)] font-tabular">
                      <span>Current: {item.currentStress}%</span>
                      <span className="text-rose-400 font-semibold">&gt;70% Critical</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-400 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(100, item.currentStress)}%` }}
                      />
                    </div>
                  </div>

                  {/* Impact */}
                  <div className="mt-3 flex items-center justify-between text-[11px] text-[var(--text-muted)] font-mono">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3 text-[var(--text-secondary)]" /> ~24,000 residents
                    </span>
                    <button
                      onClick={() => toggleExpand(item.nodeId)}
                      className="text-cyan-400 hover:underline"
                    >
                      {isExpanded ? 'Hide Causal Chain' : 'Inspect Causal Chain'}
                    </button>
                  </div>
                </div>

                {/* Why Panel */}
                {isExpanded && (
                  <div className="mt-2.5 pt-2.5 border-t border-[var(--hairline)] text-[11px] space-y-1 bg-[var(--surface-raised)] p-2.5 rounded text-[var(--text-secondary)] font-mono">
                    <div className="text-[var(--text-primary)] font-semibold">Causal Trajectory:</div>
                    <div>• Spillover propagation in {item.timeToBreachMinutes - 10} minutes.</div>
                    <div>• Direct coupling link weight: 0.35 (Lag: 10 min).</div>
                  </div>
                )}
              </GlassCard>
            );
          })}
        </div>
      ) : (
        <GlassCard className="p-8 text-center">
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">All Nodes Operating Nominally</h3>
          <p className="text-xs text-[var(--text-muted)] mt-1 max-w-md mx-auto">
            Zero critical threshold breaches forecasted across the 2-hour horizon.
          </p>
        </GlassCard>
      )}

      {/* 24-Node Horizon Matrix */}
      <GlassCard className="p-4">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--hairline)]">
          <h3 className="text-xs font-semibold text-[var(--text-primary)]">
            24-Node 2-Hour Trajectory Matrix
          </h3>
          <Badge type="Rule-based" />
        </div>

        <div className="mt-2 overflow-x-auto">
          <table className="w-full text-left text-xs font-mono font-tabular">
            <thead>
              <tr className="border-b border-[var(--hairline)] text-[var(--text-muted)]">
                <th className="pb-2 font-medium">Zone</th>
                <th className="pb-2 font-medium">System</th>
                <th className="pb-2 font-medium">Current</th>
                <th className="pb-2 font-medium">2h Trend</th>
                <th className="pb-2 font-medium">Time to Breach</th>
                <th className="pb-2 font-medium">Provenance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--hairline)]">
              {allForecasts.map((node) => (
                <tr key={node.nodeId} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-2 text-[var(--text-primary)] font-sans">{node.zoneName}</td>
                  <td className="py-2 capitalize text-[var(--text-secondary)]">{node.system}</td>
                  <td className="py-2">
                    <span
                      className={`font-semibold ${
                        node.currentStress >= 70
                          ? 'text-rose-400'
                          : node.currentStress >= 40
                          ? 'text-amber-400'
                          : 'text-emerald-400'
                      }`}
                    >
                      {node.currentStress}%
                    </span>
                  </td>
                  <td className="py-2">
                    <div className="flex items-center gap-0.5 w-24">
                      {node.trajectory.slice(0, 12).map((val, i) => (
                        <div
                          key={i}
                          className="w-1 rounded-sm"
                          style={{
                            height: `${Math.max(3, (val / 100) * 14)}px`,
                            backgroundColor:
                              val >= 70 ? '#ef4444' : val >= 40 ? '#f59e0b' : '#10b981',
                          }}
                        />
                      ))}
                    </div>
                  </td>
                  <td className="py-2">
                    {node.timeToBreachMinutes ? (
                      <span className="text-rose-400 font-semibold">~{node.timeToBreachMinutes} min</span>
                    ) : (
                      <span className="text-[var(--text-muted)]">—</span>
                    )}
                  </td>
                  <td className="py-2">
                    <Badge type="Rule-based" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
