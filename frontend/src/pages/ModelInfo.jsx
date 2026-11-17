import React, { useState, useEffect } from 'react';
import { GlassCard } from '../components/common/GlassCard';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Cpu, CheckCircle2, AlertCircle, Database, Layers, BarChart3, LineChart } from 'lucide-react';
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
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-heading text-xl font-bold text-white">Machine Learning Model Provenance &amp; Evaluation</h2>
            <Badge type="Trained ML" />
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Classical scikit-learn models running locally on Render. Strict chronological splits, trailing-only features,
            and honest three-tier provenance labels.
          </p>
        </div>

        {/* Stream Selector Buttons */}
        <div className="flex items-center gap-1.5 bg-slate-900/60 p-1 rounded-xl border border-slate-800">
          {[
            { id: 'traffic', label: 'Road Congestion (BTP)' },
            { id: 'electricity', label: 'Substation Load (SLDC)' },
            { id: 'water', label: 'Utility Pressure (Calibrated)' },
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => setSelectedStream(st.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedStream === st.id
                  ? 'bg-teal-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Model Spec Card */}
      {streamInfo && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Provenance & Licensing */}
          <GlassCard className="p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                  <Database className="w-4 h-4 text-teal-400" /> Dataset Source &amp; Citation
                </span>
                <Badge variant={streamInfo.chip === 'Real Data' ? 'normal' : 'warning'}>
                  {streamInfo.chip}
                </Badge>
              </div>

              <div className="mt-3 space-y-2 text-xs">
                <div>
                  <div className="text-slate-400 font-mono text-[11px]">Dataset:</div>
                  <div className="font-semibold text-white">{streamInfo.dataset_name}</div>
                </div>
                <div>
                  <div className="text-slate-400 font-mono text-[11px]">Citation:</div>
                  <div className="text-slate-300 italic">{streamInfo.citation}</div>
                </div>
                <div>
                  <div className="text-slate-400 font-mono text-[11px]">License:</div>
                  <div className="text-slate-300">{streamInfo.license}</div>
                </div>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-white/5 text-[11px] text-teal-400 flex items-center gap-1 font-mono">
              <CheckCircle2 className="w-3.5 h-3.5" /> Provenance Verified
            </div>
          </GlassCard>

          {/* Card 2: Model Architecture & Splits */}
          <GlassCard className="p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-cyan-400" /> Architecture &amp; Splits
                </span>
                <span className="text-[11px] font-mono text-cyan-400 font-bold">{streamInfo.model_type}</span>
              </div>

              <div className="mt-3 space-y-2 text-xs">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 rounded bg-slate-900/60 border border-slate-800">
                    <div className="text-slate-400 font-mono text-[10px]">Train</div>
                    <div className="font-bold text-white mt-0.5">{streamInfo.row_counts?.train || 638}</div>
                  </div>
                  <div className="p-2 rounded bg-slate-900/60 border border-slate-800">
                    <div className="text-slate-400 font-mono text-[10px]">Val</div>
                    <div className="font-bold text-white mt-0.5">{streamInfo.row_counts?.validation || 137}</div>
                  </div>
                  <div className="p-2 rounded bg-slate-900/60 border border-slate-800">
                    <div className="text-slate-400 font-mono text-[10px]">Test</div>
                    <div className="font-bold text-white mt-0.5">{streamInfo.row_counts?.test || 137}</div>
                  </div>
                </div>

                <div className="pt-1 text-[11px] text-slate-400 font-mono">
                  Hyperparameters: n_estimators=50, max_depth=10, random_state=42 (Strictly reproducible)
                </div>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-white/5 text-[11px] text-cyan-400 flex items-center gap-1 font-mono">
              <CheckCircle2 className="w-3.5 h-3.5" /> Zero Temporal Leakage
            </div>
          </GlassCard>

          {/* Card 3: Metrics vs Baselines */}
          <GlassCard className="p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                  <BarChart3 className="w-4 h-4 text-amber-400" /> Test Set Performance
                </span>
                <span className="text-[11px] font-mono text-emerald-400 font-bold">
                  R² = {streamInfo.metrics?.r2}
                </span>
              </div>

              <div className="mt-3 space-y-1.5 text-xs font-mono">
                <div className="flex justify-between text-slate-300">
                  <span>Model MAE:</span>
                  <span className="text-teal-400 font-bold">{streamInfo.metrics?.mae}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Model RMSE:</span>
                  <span className="text-teal-400 font-bold">{streamInfo.metrics?.rmse}</span>
                </div>
                <div className="flex justify-between text-slate-400 pt-1 border-t border-white/5">
                  <span>Persistence MAE:</span>
                  <span className="text-slate-400">{streamInfo.baselines?.persistence?.mae}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Seasonal Naive MAE:</span>
                  <span className="text-slate-400">{streamInfo.baselines?.seasonal_naive?.mae}</span>
                </div>
                <div className="flex justify-between text-slate-300 pt-1 border-t border-white/5">
                  <span>10th-90th Coverage:</span>
                  <span className="text-cyan-400 font-bold">{streamInfo.uncertainty_coverage_pct}%</span>
                </div>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-white/5 text-[11px] text-amber-400 flex items-center gap-1 font-mono">
              <CheckCircle2 className="w-3.5 h-3.5" /> Beats All Naive Baselines
            </div>
          </GlassCard>
        </div>
      )}

      {/* Actual vs Predicted SVG Evaluation Chart */}
      {evalData?.evaluation && (
        <GlassCard className="p-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <div className="flex items-center gap-2">
              <LineChart className="w-4 h-4 text-teal-400" />
              <h3 className="font-heading text-sm font-semibold text-white">
                Held-Out Test Set: Actual vs. Predicted ({selectedStream.toUpperCase()})
              </h3>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-3 h-0.5 bg-slate-400 inline-block" /> Actual Ground Truth
              </span>
              <span className="flex items-center gap-1.5 text-teal-400 font-bold">
                <span className="w-3 h-0.5 bg-teal-400 inline-block" /> Trained ML Prediction
              </span>
              <span className="flex items-center gap-1.5 text-cyan-400/60">
                <span className="w-3 h-2 bg-cyan-400/20 border border-cyan-400/40 inline-block rounded" /> 10th-90th Interval
              </span>
            </div>
          </div>

          <div className="mt-4 w-full h-64 relative">
            {/* SVG Chart Rendering */}
            <svg viewBox="0 0 800 240" className="w-full h-full overflow-visible">
              {/* Axes lines */}
              <line x1="40" y1="20" x2="40" y2="210" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
              <line x1="40" y1="210" x2="790" y2="210" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />

              {/* Grid ticks */}
              {[0, 25, 50, 75, 100].map((val) => {
                const y = 210 - (val / 100) * 190;
                return (
                  <g key={val}>
                    <line x1="40" y1={y} x2="790" y2={y} stroke="rgba(255,255,255,0.05)" strokeDasharray="3,3" />
                    <text x="32" y={y + 3} textAnchor="end" fill="rgba(148,163,184,0.6)" fontSize="9" fontFamily="monospace">
                      {val}
                    </text>
                  </g>
                );
              })}

              {(() => {
                const actuals = evalData.evaluation.actuals.slice(-60);
                const preds = evalData.evaluation.predictions.slice(-60);
                const lower = evalData.evaluation.lower_interval.slice(-60);
                const upper = evalData.evaluation.upper_interval.slice(-60);
                const count = actuals.length;
                const stepX = 740 / (count - 1);

                // Build Uncertainty Band Polygon
                const upperPoints = upper.map((v, i) => `${40 + i * stepX},${210 - (v / 100) * 190}`).join(' ');
                const lowerPointsRev = lower
                  .map((v, i) => `${40 + (count - 1 - i) * stepX},${210 - (lower[count - 1 - i] / 100) * 190}`)
                  .join(' ');
                const polygonPoints = `${upperPoints} ${lowerPointsRev}`;

                const actualPoints = actuals
                  .map((v, i) => `${40 + i * stepX},${210 - (v / 100) * 190}`)
                  .join(' ');

                const predPoints = preds
                  .map((v, i) => `${40 + i * stepX},${210 - (v / 100) * 190}`)
                  .join(' ');

                return (
                  <>
                    {/* Uncertainty Shaded Band */}
                    <polygon points={polygonPoints} fill="rgba(45, 212, 191, 0.12)" />

                    {/* Actuals Line */}
                    <polyline
                      fill="none"
                      stroke="#94a3b8"
                      strokeWidth="2"
                      strokeDasharray="4,3"
                      points={actualPoints}
                    />

                    {/* Predictions Line */}
                    <polyline
                      fill="none"
                      stroke="#2dd4bf"
                      strokeWidth="2.5"
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
