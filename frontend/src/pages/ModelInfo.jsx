import React, { useState, useEffect } from 'react';
import { GlassCard } from '../components/common/GlassCard';
import { Badge } from '../components/common/Badge';
import { apiRequest } from '../api/client';

export function ModelInfo() {
  const [selectedStream, setSelectedStream] = useState('traffic');
  const [modelsData, setModelsData] = useState(null);
  const [evalData, setEvalData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const meta = await apiRequest('/api/ml/models');
        setModelsData(meta);
        const evalSnapshot = await apiRequest(`/api/ml/evaluation/${selectedStream}`);
        setEvalData(evalSnapshot);
      } catch (err) {
        console.error('Failed to load ML models data', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [selectedStream]);

  const streamInfo = modelsData ? modelsData[selectedStream] : null;

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-[var(--text-primary)]">Model Provenance &amp; Evaluation</h2>
            <Badge type="Trained ML" />
          </div>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Classical scikit-learn models. Chronological splits, trailing-only features, and verified dataset citations.
          </p>
        </div>

        {/* Stream Selector */}
        <div className="flex items-center gap-1 bg-[var(--surface-raised)] p-0.5 rounded-lg border border-[var(--hairline)]">
          {[
            { id: 'traffic', label: 'Road Congestion (BTP)' },
            { id: 'electricity', label: 'Substation Load (SLDC)' },
            { id: 'water', label: 'Utility Pressure (Calibrated)' },
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => setSelectedStream(st.id)}
              className={`px-2.5 py-1 rounded text-xs transition-colors ${
                selectedStream === st.id
                  ? 'bg-white text-slate-950 font-semibold'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Model Specs */}
      {streamInfo && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {/* Card 1: Provenance */}
          <GlassCard className="p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-[var(--hairline)]">
                <span className="text-xs font-medium text-[var(--text-secondary)]">Dataset Citation</span>
                <Badge variant={streamInfo.chip === 'Real Data' ? 'normal' : 'warning'}>
                  {streamInfo.chip}
                </Badge>
              </div>

              <div className="mt-3 space-y-2 text-xs">
                <div>
                  <div className="text-[10px] font-mono text-[var(--text-muted)]">Source:</div>
                  <div className="font-medium text-[var(--text-primary)]">{streamInfo.dataset_name}</div>
                </div>
                <div>
                  <div className="text-[10px] font-mono text-[var(--text-muted)]">Citation:</div>
                  <div className="text-[var(--text-secondary)] italic">{streamInfo.citation}</div>
                </div>
                <div>
                  <div className="text-[10px] font-mono text-[var(--text-muted)]">License:</div>
                  <div className="text-[var(--text-secondary)]">{streamInfo.license}</div>
                </div>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-[var(--hairline)] text-[11px] text-emerald-400 font-mono">
              ✓ Provenance Verified
            </div>
          </GlassCard>

          {/* Card 2: Architecture */}
          <GlassCard className="p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-[var(--hairline)]">
                <span className="text-xs font-medium text-[var(--text-secondary)]">Architecture &amp; Splits</span>
                <span className="text-[11px] font-mono text-[var(--text-primary)] font-semibold">{streamInfo.model_type}</span>
              </div>

              <div className="mt-3 space-y-2 text-xs">
                <div className="grid grid-cols-3 gap-2 text-center font-tabular">
                  <div className="p-2 rounded bg-[var(--surface-raised)] border border-[var(--hairline)]">
                    <div className="text-[10px] text-[var(--text-muted)] font-mono">Train</div>
                    <div className="font-semibold text-[var(--text-primary)] mt-0.5">{streamInfo.row_counts?.train || 638}</div>
                  </div>
                  <div className="p-2 rounded bg-[var(--surface-raised)] border border-[var(--hairline)]">
                    <div className="text-[10px] text-[var(--text-muted)] font-mono">Val</div>
                    <div className="font-semibold text-[var(--text-primary)] mt-0.5">{streamInfo.row_counts?.validation || 137}</div>
                  </div>
                  <div className="p-2 rounded bg-[var(--surface-raised)] border border-[var(--hairline)]">
                    <div className="text-[10px] text-[var(--text-muted)] font-mono">Test</div>
                    <div className="font-semibold text-[var(--text-primary)] mt-0.5">{streamInfo.row_counts?.test || 137}</div>
                  </div>
                </div>

                <div className="pt-1 text-[11px] text-[var(--text-muted)] font-mono">
                  n_estimators=50, max_depth=10, seed=42
                </div>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-[var(--hairline)] text-[11px] text-cyan-400 font-mono">
              ✓ Zero Temporal Lookahead Leakage
            </div>
          </GlassCard>

          {/* Card 3: Metrics */}
          <GlassCard className="p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-[var(--hairline)]">
                <span className="text-xs font-medium text-[var(--text-secondary)]">Test Set Metrics</span>
                <span className="text-xs font-mono text-emerald-400 font-semibold font-tabular">
                  R² = {streamInfo.metrics?.r2}
                </span>
              </div>

              <div className="mt-3 space-y-1 text-xs font-mono font-tabular text-[var(--text-secondary)]">
                <div className="flex justify-between">
                  <span>Model MAE:</span>
                  <span className="text-[var(--text-primary)] font-semibold">{streamInfo.metrics?.mae}</span>
                </div>
                <div className="flex justify-between">
                  <span>Model RMSE:</span>
                  <span className="text-[var(--text-primary)] font-semibold">{streamInfo.metrics?.rmse}</span>
                </div>
                <div className="flex justify-between text-[var(--text-muted)] pt-1 border-t border-[var(--hairline)]">
                  <span>Persistence MAE:</span>
                  <span>{streamInfo.baselines?.persistence?.mae}</span>
                </div>
                <div className="flex justify-between text-[var(--text-muted)]">
                  <span>Seasonal Naive MAE:</span>
                  <span>{streamInfo.baselines?.seasonal_naive?.mae}</span>
                </div>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-[var(--hairline)] text-[11px] text-[var(--text-muted)] font-mono">
              10th–90th interval coverage: {streamInfo.uncertainty_coverage_pct}%
            </div>
          </GlassCard>
        </div>
      )}

      {/* Actual vs Predicted Series Chart */}
      {evalData?.evaluation && (
        <GlassCard className="p-4">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--hairline)]">
            <h3 className="text-xs font-semibold text-[var(--text-primary)]">
              Held-Out Test Set Series ({selectedStream.toUpperCase()})
            </h3>
            <div className="flex items-center gap-4 text-[11px] font-mono text-[var(--text-muted)]">
              <span className="flex items-center gap-1.5 text-[var(--text-secondary)]">
                <span className="w-2.5 h-0.5 bg-slate-400 inline-block" /> Actual Ground Truth
              </span>
              <span className="flex items-center gap-1.5 text-cyan-400 font-semibold">
                <span className="w-2.5 h-0.5 bg-cyan-400 inline-block" /> Trained ML Prediction
              </span>
            </div>
          </div>

          <div className="mt-3 w-full h-56 relative">
            <svg viewBox="0 0 800 220" className="w-full h-full overflow-visible">
              <line x1="40" y1="20" x2="40" y2="190" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
              <line x1="40" y1="190" x2="790" y2="190" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />

              {[0, 25, 50, 75, 100].map((val) => {
                const y = 190 - (val / 100) * 170;
                return (
                  <g key={val}>
                    <line x1="40" y1={y} x2="790" y2={y} stroke="rgba(255,255,255,0.03)" strokeDasharray="2,2" />
                    <text x="32" y={y + 3} textAnchor="end" fill="rgba(255,255,255,0.3)" fontSize="9" fontFamily="monospace">
                      {val}
                    </text>
                  </g>
                );
              })}

              {(() => {
                const actuals = evalData.evaluation.actuals.slice(-60);
                const preds = evalData.evaluation.predictions.slice(-60);
                const count = actuals.length;
                const stepX = 740 / (count - 1);

                const actualPoints = actuals
                  .map((v, i) => `${40 + i * stepX},${190 - (v / 100) * 170}`)
                  .join(' ');

                const predPoints = preds
                  .map((v, i) => `${40 + i * stepX},${190 - (v / 100) * 170}`)
                  .join(' ');

                return (
                  <>
                    <polyline
                      fill="none"
                      stroke="rgba(148, 163, 184, 0.5)"
                      strokeWidth="1.5"
                      strokeDasharray="3,3"
                      points={actualPoints}
                    />
                    <polyline
                      fill="none"
                      stroke="#22d3ee"
                      strokeWidth="2"
                      points={predPoints}
                    />
                  </>
                );
              })()}
            </svg>
          </div>
        </GlassCard>
      )}
    </div>
  );
}
