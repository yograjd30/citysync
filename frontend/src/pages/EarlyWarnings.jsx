import React, { useState, useEffect } from 'react';
import { GlassCard } from '../components/common/GlassCard';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { useSimulation } from '../context/SimulationContext';
import { ShieldAlert, Clock, AlertTriangle, ChevronDown, ChevronUp, Users, Cpu, ArrowRight } from 'lucide-react';
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
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-heading text-xl font-bold text-white">Early Warning Radar &amp; Time-to-Breach</h2>
            <Badge type="Rule-based" />
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Statistical trend &amp; deterministic coupling model projecting 2 hours into the future.
            Highlights impending critical breaches before they manifest physically in city infrastructure.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant={impending.length > 0 ? 'critical' : 'normal'}>
            {impending.length} Impending Breaches Detected
          </Badge>
        </div>
      </div>

      {/* Impending Breaches Countdown Section */}
      {impending.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {impending.map((item) => {
            const isExpanded = !!expandedNodes[item.nodeId];
            return (
              <GlassCard
                key={item.nodeId}
                variant="warning"
                className="p-4 flex flex-col justify-between border-amber-500/40 relative overflow-hidden"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-heading font-bold text-white text-sm">{item.zoneName}</div>
                      <div className="text-amber-400 font-mono text-xs capitalize mt-0.5">
                        {item.system} Infrastructure
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-mono font-bold text-rose-400 flex items-center gap-1 justify-end">
                        <Clock className="w-3.5 h-3.5" /> in ~{item.timeToBreachMinutes} min
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">Time to Breach</span>
                    </div>
                  </div>

                  {/* Stress Trajectory Bar */}
                  <div className="mt-3">
                    <div className="flex justify-between text-xs font-mono mb-1">
                      <span className="text-slate-400">Current: {item.currentStress}%</span>
                      <span className="text-rose-400 font-bold">Projected: &gt;70% Critical</span>
                    </div>
                    <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-400 to-rose-500 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, item.currentStress)}%` }}
                      />
                    </div>
                  </div>

                  {/* Human Impact */}
                  <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span className="flex items-center gap-1 text-slate-300">
                      <Users className="w-3 h-3 text-teal-400" /> ~24,000 residents affected
                    </span>
                    <button
                      onClick={() => toggleExpand(item.nodeId)}
                      className="text-teal-400 hover:underline"
                    >
                      {isExpanded ? 'Hide Details' : 'Inspect Why'}
                    </button>
                  </div>
                </div>

                {/* Expandable Causal Why Panel */}
                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-white/10 text-xs space-y-2 bg-slate-950/70 p-3 rounded-xl font-mono text-[11px]">
                    <div className="text-slate-300 font-bold font-sans">Chain Reaction Analysis:</div>
                    <div className="text-slate-400">
                      • Adjacent zone spillover propagating in {item.timeToBreachMinutes - 10} minutes.
                    </div>
                    <div className="text-slate-400">
                      • Cross-system coupling coefficient: 0.35 (Lag: 10 min).
                    </div>
                    <div className="text-teal-300 font-semibold font-sans mt-1">
                      Recommended Action: Shift non-critical grid load or reroute arterial traffic immediately.
                    </div>
                  </div>
                )}
              </GlassCard>
            );
          })}
        </div>
      ) : (
        <GlassCard className="p-8 text-center">
          <div className="w-12 h-12 rounded-full bg-teal-500/10 border border-teal-400/30 flex items-center justify-center text-teal-400 mx-auto mb-3">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h3 className="font-heading text-base font-bold text-white">All Infrastructure Operating Reliably</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
            No critical breaches forecasted within the next 2 hours. Use the Scenario Lab to inject weather anomalies
            or major stadium events to evaluate early warning lead times.
          </p>
        </GlassCard>
      )}

      {/* Full 24-Node Early Warning Matrix */}
      <GlassCard className="p-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/5">
          <h3 className="font-heading text-sm font-semibold text-white">
            Full 24-Node 2-Hour Trajectory Matrix
          </h3>
          <Badge type="Rule-based" />
        </div>

        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-white/5 text-slate-400">
                <th className="pb-2 font-medium">Zone</th>
                <th className="pb-2 font-medium">System</th>
                <th className="pb-2 font-medium">Current Stress</th>
                <th className="pb-2 font-medium">2h Trajectory Trend</th>
                <th className="pb-2 font-medium">Time to Breach</th>
                <th className="pb-2 font-medium">Data Provenance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {allForecasts.map((node) => (
                <tr key={node.nodeId} className="hover:bg-white/5 transition-colors">
                  <td className="py-2.5 font-sans font-medium text-white">{node.zoneName}</td>
                  <td className="py-2.5 capitalize text-slate-300">{node.system}</td>
                  <td className="py-2.5">
                    <span
                      className={`font-bold ${
                        node.currentStress >= 70
                          ? 'text-rose-400'
                          : node.currentStress >= 40
                          ? 'text-amber-400'
                          : 'text-teal-400'
                      }`}
                    >
                      {node.currentStress}%
                    </span>
                  </td>
                  <td className="py-2.5">
                    <div className="flex items-center gap-1 w-24">
                      {node.trajectory.slice(0, 12).map((val, i) => (
                        <div
                          key={i}
                          className="w-1.5 rounded-full"
                          style={{
                            height: `${Math.max(4, (val / 100) * 16)}px`,
                            backgroundColor:
                              val >= 70 ? '#f43f5e' : val >= 40 ? '#fbbf24' : '#2dd4bf',
                          }}
                        />
                      ))}
                    </div>
                  </td>
                  <td className="py-2.5">
                    {node.timeToBreachMinutes ? (
                      <span className="text-rose-400 font-bold">~{node.timeToBreachMinutes} min</span>
                    ) : (
                      <span className="text-slate-500">None in horizon</span>
                    )}
                  </td>
                  <td className="py-2.5">
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
