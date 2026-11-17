import React, { useState } from 'react';
import { GlassCard } from '../common/GlassCard';
import { Badge } from '../common/Badge';
import { Sparkles, X, Play, Zap, ShieldAlert, Cpu } from 'lucide-react';

export function GuidedFirstRun({ onSelectTab }) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <GlassCard className="p-4 bg-teal-950/20 border-teal-500/30 relative overflow-hidden">
      <button
        onClick={() => setDismissed(true)}
        className="absolute top-3 right-3 p-1 rounded-lg text-slate-400 hover:text-white"
        title="Dismiss Tour"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="flex items-start gap-3">
        <div className="p-2 rounded-xl bg-teal-500/20 border border-teal-400/40 text-teal-300">
          <Sparkles className="w-5 h-5" />
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-heading text-sm font-bold text-white">
              Evaluator Guided Tour: CitySync Operations Engine
            </h4>
            <Badge type="Simulated" />
          </div>
          <p className="text-xs text-slate-300 mt-1 max-w-3xl">
            Welcome, evaluator! CitySync simulates traffic, electricity, and water as an interconnected urban nervous system.
            Follow these 4 core interactions to experience the decision-support engine:
          </p>

          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
            <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px]">
              <span className="font-semibold text-teal-400 flex items-center gap-1">
                <Play className="w-3 h-3" /> 1. Scrubber &amp; Clock
              </span>
              <p className="text-slate-400 mt-1">
                Click <strong>Run Sim</strong> on the time bar to watch morning &amp; evening commute demand spikes.
              </p>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px]">
              <span className="font-semibold text-amber-400 flex items-center gap-1">
                <Zap className="w-3 h-3" /> 2. Scenario Lab
              </span>
              <p className="text-slate-400 mt-1">
                Inject a 38°C heatwave or stadium surge to trigger multi-hop cross-infrastructure cascades.
              </p>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px]">
              <span className="font-semibold text-rose-400 flex items-center gap-1">
                <ShieldAlert className="w-3 h-3" /> 3. Early Warning
              </span>
              <p className="text-slate-400 mt-1">
                Inspect <strong>Time to Breach</strong> forecasts to intervene up to 2 hours before blackouts.
              </p>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px]">
              <span className="font-semibold text-cyan-400 flex items-center gap-1">
                <Cpu className="w-3 h-3" /> 4. Trained Models
              </span>
              <p className="text-slate-400 mt-1">
                Examine Bangalore Traffic Police &amp; SLDC dataset cards with honest data labeling badges.
              </p>
            </div>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
