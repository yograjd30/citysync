import React, { useState, useEffect } from 'react';
import { GlassCard } from '../components/common/GlassCard';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { useSimulation } from '../context/SimulationContext';
import { Check, Users, RotateCcw } from 'lucide-react';
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

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-[var(--text-primary)]">Recommended Counter-Measures &amp; Interventions</h2>
            <Badge type="Rule-based" />
          </div>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Evaluated deterministically against current network state; ranked by Stability Index recovery.
          </p>
        </div>

        {interventions.length > 0 && (
          <Button variant="secondary" size="sm" icon={RotateCcw} onClick={clearInterventions}>
            Reset Interventions ({interventions.length})
          </Button>
        )}
      </div>

      {/* Active Interventions Summary */}
      {interventions.length > 0 && (
        <div className="px-4 py-2.5 rounded-lg bg-[var(--surface-raised)] border border-[var(--hairline)] flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2 text-emerald-400">
            <Check className="w-3.5 h-3.5" />
            {interventions.length} Operational Interventions Enforced
          </div>
          <span className="text-[var(--text-muted)]">
            Current Stability: {currentState?.stabilityIndex}/100
          </span>
        </div>
      )}

      {/* Ranked Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {recommendations.slice(0, 8).map((rec, idx) => {
          const isApplied = interventions.some(
            (i) => i.actionId === rec.actionId && i.targetZone === rec.targetZone
          );

          return (
            <GlassCard
              key={`${rec.actionId}-${rec.targetZone}-${idx}`}
              className={`p-4 flex flex-col justify-between ${
                isApplied ? 'border-emerald-500/30' : ''
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between pb-2.5 border-b border-[var(--hairline)]">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-semibold text-[var(--text-muted)]">
                      0{idx + 1}
                    </span>
                    <div>
                      <h4 className="text-xs font-semibold text-[var(--text-primary)]">{rec.name}</h4>
                      <div className="text-[10px] font-mono text-[var(--text-muted)] capitalize">
                        Target: {rec.zoneName}
                      </div>
                    </div>
                  </div>

                  <span className="text-xs font-mono font-semibold text-emerald-400">
                    +{rec.deltaStability} pts
                  </span>
                </div>

                <p className="text-xs text-[var(--text-secondary)] mt-2.5 leading-relaxed">
                  {rec.description}
                </p>

                {/* Metrics */}
                <div className="mt-3.5 grid grid-cols-2 gap-2 p-2.5 rounded bg-[var(--surface-raised)] text-xs font-mono text-[var(--text-secondary)] font-tabular">
                  <div>
                    <span className="text-[10px] text-[var(--text-muted)]">Critical Nodes Saved</span>
                    <div className="text-[var(--text-primary)] font-semibold mt-0.5">{rec.nodesSaved} Nodes</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-[var(--text-muted)]">Citizens Protected</span>
                    <div className="text-[var(--text-primary)] font-semibold mt-0.5">
                      ~{rec.residentsHelped?.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-3.5 pt-2.5 border-t border-[var(--hairline)] flex items-center justify-between">
                <span className="text-[10px] font-mono text-[var(--text-muted)]">
                  Simulation Tested
                </span>

                <Button
                  size="sm"
                  variant={isApplied ? 'secondary' : 'primary'}
                  icon={isApplied ? Check : null}
                  onClick={() =>
                    toggleIntervention({
                      actionId: rec.actionId,
                      targetZone: rec.targetZone,
                      name: rec.name,
                    })
                  }
                >
                  {isApplied ? 'Active' : 'Apply Measure'}
                </Button>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}
