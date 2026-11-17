import React, { useState } from 'react';
import { GlassCard } from '../components/common/GlassCard';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { useSimulation } from '../context/SimulationContext';
import { GitFork, Flame, Trophy, Droplets, CloudRain, Zap, Plus, Trash2 } from 'lucide-react';
import { apiRequest } from '../api/client';

const PRESET_EVENTS = [
  {
    title: '38°C Urban Heatwave',
    type: 'heatwave',
    severity: 85,
    startStep: 110,
    durationSteps: 72,
    icon: Flame,
    description: 'Elevated ambient temperature surges residential cooling demand and lowers water pressure.',
  },
  {
    title: 'Stadium Match Egress',
    type: 'stadium_event',
    zoneId: 'stadium',
    severity: 95,
    startStep: 160,
    durationSteps: 48,
    icon: Trophy,
    description: '65,000 spectators exit into arterials, causing immediate congestion and delayed grid spike.',
  },
  {
    title: 'Industrial Feeder Pipe Burst',
    type: 'pipe_burst',
    zoneId: 'industrial',
    severity: 90,
    startStep: 120,
    durationSteps: 40,
    icon: Droplets,
    description: 'Catastrophic rupture on primary industrial main; engages auxiliary electric pumps.',
  },
  {
    title: 'Downtown Substation Outage',
    type: 'substation_outage',
    zoneId: 'downtown',
    severity: 100,
    startStep: 130,
    durationSteps: 30,
    icon: Zap,
    description: 'Transformer trip in commercial core; downgrades traffic signals into fail-safe flashing yellows.',
  },
  {
    title: 'Monsoon Downpour',
    type: 'rain',
    severity: 70,
    startStep: 90,
    durationSteps: 36,
    icon: CloudRain,
    description: 'High precipitation reduces arterial travel speeds by 45% citywide.',
  },
];

export function ScenarioLab() {
  const { activeEvents, addEvent, removeEvent, clearEvents, step, currentState } = useSimulation();

  const [forkIntervention, setForkIntervention] = useState('reroute_traffic');
  const [forkComparison, setForkComparison] = useState(null);
  const [simulatingFork, setSimulatingFork] = useState(false);

  const runForkSimulation = async () => {
    setSimulatingFork(true);
    try {
      const res = await apiRequest('/api/recommendations/simulate-choice', {
        method: 'POST',
        body: JSON.stringify({
          step,
          activeEvents,
          interventions: [{ actionId: forkIntervention, targetZone: 'downtown' }],
        }),
      });
      setForkComparison(res);
    } catch (err) {
      console.error('Failed to simulate future fork', err);
    } finally {
      setSimulatingFork(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-[var(--text-primary)]">Scenario Lab &amp; Future Fork</h2>
            <Badge type="Simulated" />
          </div>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Inject synthetic perturbations into the city network. Fork the future timeline to measure mitigation efficacy.
          </p>
        </div>

        {activeEvents.length > 0 && (
          <Button variant="danger" size="sm" icon={Trash2} onClick={clearEvents}>
            Clear Events ({activeEvents.length})
          </Button>
        )}
      </div>

      {/* Preset Incident Tiles */}
      <div>
        <div className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2 font-mono">
          Stress Injections
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {PRESET_EVENTS.map((preset, idx) => {
            const Icon = preset.icon;
            return (
              <div
                key={idx}
                onClick={() =>
                  addEvent({
                    type: preset.type,
                    zoneId: preset.zoneId,
                    severity: preset.severity,
                    startStep: preset.startStep,
                    durationSteps: preset.durationSteps,
                  })
                }
                className="p-3.5 rounded-xl bg-[var(--surface-card)] border border-[var(--hairline)] hover:border-[var(--hairline-focused)] hover:bg-[var(--surface-raised)] transition-colors cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between pb-2">
                    <Icon className="w-4 h-4 text-cyan-400" />
                    <span className="text-[10px] font-mono text-[var(--text-muted)]">
                      Sev {preset.severity}%
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold text-[var(--text-primary)]">{preset.title}</h4>
                  <p className="text-[11px] text-[var(--text-secondary)] mt-1 line-clamp-2 leading-relaxed">
                    {preset.description}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-[var(--hairline)] flex items-center justify-between text-[11px] font-mono text-cyan-400">
                  <span>+ Inject Event</span>
                  <Plus className="w-3 h-3" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Signature Innovation: Future Fork */}
      <GlassCard className="p-4 flex flex-col gap-3.5">
        <div className="flex items-center justify-between pb-2.5 border-b border-[var(--hairline)]">
          <div className="flex items-center gap-2">
            <GitFork className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-semibold text-[var(--text-primary)]">
              Future Fork: Branching Timeline Simulator
            </h3>
          </div>
          <Badge type="Rule-based" />
        </div>

        <p className="text-xs text-[var(--text-secondary)]">
          Branch reality from tick <strong className="text-[var(--text-primary)] font-mono">{step}</strong>.
          Lane 1 tracks unmitigated degradation; Lane 2 simulates selected counter-measures.
        </p>

        {/* Dual Lanes */}
        <div className="space-y-2.5 mt-1">
          {/* Lane 1 */}
          <div className="p-3 rounded-lg bg-[var(--surface-raised)] border border-[var(--hairline)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <div>
                <span className="font-medium text-[var(--text-primary)]">Lane 1: Unmitigated Baseline</span>
                <div className="text-[11px] text-[var(--text-muted)] font-mono mt-0.5">
                  Stability Index: {currentState?.stabilityIndex} | Critical Nodes: {currentState?.nodesInCritical}
                </div>
              </div>
            </div>
            <span className="text-[11px] font-mono text-rose-400">Cascades Propagating Freely</span>
          </div>

          {/* Lane 2 */}
          <div className="p-3 rounded-lg bg-[var(--surface-raised)] border border-[var(--hairline)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <div>
                <span className="font-medium text-[var(--text-primary)]">Lane 2: Mitigated Fork</span>
                <div className="mt-1 flex items-center gap-2">
                  <select
                    value={forkIntervention}
                    onChange={(e) => setForkIntervention(e.target.value)}
                    className="bg-[var(--surface-page)] border border-[var(--hairline)] text-xs text-[var(--text-primary)] rounded px-2 py-1 focus:outline-none"
                  >
                    <option value="reroute_traffic">Dynamic Arterial Rerouting</option>
                    <option value="retime_signals">Adaptive Green-Wave Signals</option>
                    <option value="shed_industrial_load">Industrial Load Curtailment</option>
                    <option value="start_backup_pump">Auxiliary Municipal Booster</option>
                  </select>
                </div>
              </div>
            </div>

            <Button size="sm" variant="primary" onClick={runForkSimulation} loading={simulatingFork}>
              Simulate Fork Delta
            </Button>
          </div>
        </div>

        {/* Scoreboard */}
        {forkComparison && (
          <div className="mt-2 p-3 rounded-lg bg-[var(--surface-raised)] border border-[var(--hairline)] grid grid-cols-3 gap-3 text-center font-tabular">
            <div>
              <div className="text-[11px] text-[var(--text-muted)] font-mono">Stability Gain</div>
              <div className="text-xl font-semibold text-emerald-400 mt-0.5">
                +{forkComparison.deltaStability} pts
              </div>
            </div>
            <div>
              <div className="text-[11px] text-[var(--text-muted)] font-mono">Critical Nodes Saved</div>
              <div className="text-xl font-semibold text-cyan-400 mt-0.5">
                {forkComparison.criticalReduced} Nodes
              </div>
            </div>
            <div>
              <div className="text-[11px] text-[var(--text-muted)] font-mono">Improvement Rate</div>
              <div className="text-xl font-semibold text-[var(--text-primary)] mt-0.5">
                +{forkComparison.pctImprovement}%
              </div>
            </div>
          </div>
        )}
      </GlassCard>

      {/* Active Injections Table */}
      {activeEvents.length > 0 && (
        <GlassCard className="p-4">
          <h3 className="text-xs font-semibold text-[var(--text-primary)] mb-2.5">
            Active Scenario Injections ({activeEvents.length})
          </h3>
          <div className="divide-y divide-[var(--hairline)]">
            {activeEvents.map((evt, idx) => (
              <div key={idx} className="py-2 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-[var(--text-primary)] capitalize">
                    {evt.type.replace('_', ' ')}
                  </span>
                  {evt.zoneId && <span className="text-[var(--text-muted)]">Zone: {evt.zoneId}</span>}
                  <span className="text-amber-400">Sev: {evt.severity}%</span>
                  <span className="text-[var(--text-muted)]">
                    Ticks {evt.startStep}–{evt.startStep + evt.durationSteps}
                  </span>
                </div>
                <button
                  onClick={() => removeEvent(idx)}
                  className="p-1 rounded text-rose-400 hover:bg-rose-500/10"
                  title="Remove"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </GlassCard>
      )}
    </div>
  );
}
