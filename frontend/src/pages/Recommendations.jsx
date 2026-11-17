import React, { useState, useEffect } from 'react';
import { GlassCard } from '../components/common/GlassCard';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { useSimulation } from '../context/SimulationContext';
import { Lightbulb, Check, Users, TrendingUp, ShieldCheck, Zap, Car, Droplets, RotateCcw } from 'lucide-react';
import { apiRequest } from '../api/client';

export function Recommendations() {
  const { step, seed, activeEvents, interventions, toggleIntervention, clearInterventions, currentState } = useSimulation();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRecommendations() {
      try {
        const qEvents = encodeURIComponent(JSON.stringify(activeEvents));
        const res = await apiRequest(`/api/recommendations/evaluate?step=${step}&seed=${seed}&events=${qEvents}`);
        setRecommendations(res.recommendations || []);
      } catch (err) {
        console.error('Failed to load recommendations', err);
      } finally {
        setLoading(false);
      }
    }
    loadRecommendations();
  }, [step, seed, activeEvents]);

  const getSystemIcon = (system) => {
    switch (system) {
      case 'traffic':
        return <Car className="w-4 h-4 text-cyan-400" />;
      case 'electricity':
        return <Zap className="w-4 h-4 text-amber-400" />;
      case 'water':
        return <Droplets className="w-4 h-4 text-teal-400" />;
      default:
        return <Lightbulb className="w-4 h-4 text-yellow-400" />;
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-heading text-xl font-bold text-white">Recommended Counter-Measures &amp; Interventions</h2>
            <Badge type="Rule-based" />
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Simulated and ranked in real-time by Stability Index improvement, nodes saved from critical breach,
            and total residents protected.
          </p>
        </div>

        {interventions.length > 0 && (
          <Button variant="glass" size="sm" icon={RotateCcw} onClick={clearInterventions}>
            Reset Applied Interventions ({interventions.length})
          </Button>
        )}
      </div>

      {/* Active Interventions Bar */}
      {interventions.length > 0 && (
        <GlassCard className="p-4 bg-teal-950/30 border-teal-500/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-teal-300">
              <Check className="w-4 h-4 text-teal-400" />
              {interventions.length} Active Operational Interventions Enforced
            </div>
            <span className="text-xs font-mono text-teal-400">
              City Stability: {currentState?.stabilityIndex}/100
            </span>
          </div>
        </GlassCard>
      )}

      {/* Ranked Candidate Interventions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recommendations.slice(0, 8).map((rec, idx) => {
          const isApplied = interventions.some(
            (i) => i.actionId === rec.actionId && i.targetZone === rec.targetZone
          );

          return (
            <GlassCard
              key={`${rec.actionId}-${rec.targetZone}-${idx}`}
              variant={isApplied ? 'normal' : 'default'}
              className={`p-5 flex flex-col justify-between transition-all ${
                isApplied ? 'border-teal-400/60 shadow-lg shadow-teal-500/10' : ''
              }`}
            >
              <div>
                {/* Top: Rank & System */}
                <div className="flex items-start justify-between pb-3 border-b border-white/5">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-400 font-mono font-bold text-xs flex items-center justify-center border border-teal-500/30">
                      #{idx + 1}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        {getSystemIcon(rec.system)}
                        <h4 className="font-heading text-sm font-bold text-white">{rec.name}</h4>
                      </div>
                      <div className="text-[11px] font-mono text-slate-400 capitalize">
                        Target: {rec.zoneName}
                      </div>
                    </div>
                  </div>

                  <Badge variant="normal">+{rec.deltaStability} pts</Badge>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-300 mt-3 leading-relaxed">{rec.description}</p>

                {/* Impact Metrics */}
                <div className="mt-4 grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs font-mono">
                  <div>
                    <span className="text-slate-400 text-[10px]">Critical Nodes Saved</span>
                    <div className="text-cyan-400 font-bold mt-0.5">{rec.nodesSaved} Nodes</div>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px]">Residents Protected</span>
                    <div className="text-teal-400 font-bold mt-0.5 flex items-center gap-1">
                      <Users className="w-3 h-3" /> ~{rec.residentsHelped?.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-mono">
                  Ranked by Delta Stability
                </span>

                <Button
                  size="sm"
                  variant={isApplied ? 'secondary' : 'primary'}
                  icon={isApplied ? Check : PlusIcon}
                  onClick={() =>
                    toggleIntervention({
                      actionId: rec.actionId,
                      targetZone: rec.targetZone,
                      name: rec.name,
                    })
                  }
                >
                  {isApplied ? 'Applied' : 'Apply Intervention'}
                </Button>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}

function PlusIcon(props) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}
