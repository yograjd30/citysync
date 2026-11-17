import React, { useState } from 'react';
import { GlassCard } from '../components/common/GlassCard';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { useSimulation } from '../context/SimulationContext';
import { GitFork, Flame, Trophy, AlertTriangle, Droplets, CloudRain, Zap, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { apiRequest } from '../api/client';

const PRESET_EVENTS = [
  {
    title: '38°C Urban Heatwave',
    type: 'heatwave',
    severity: 85,
    startStep: 110,
    durationSteps: 72,
    icon: Flame,
    color: 'rose',
    description: 'Citywide extreme heatwave surges air-conditioning draw and lowers water line pressure.',
  },
  {
    title: 'Stadium Championship Match',
    type: 'stadium_event',
    zoneId: 'stadium',
    severity: 95,
    startStep: 160,
    durationSteps: 48,
    icon: Trophy,
    color: 'amber',
    description: '65,000 spectators cause severe congestion, then flood local electricity and water grids.',
  },
  {
    title: 'Industrial Feeder Pipe Burst',
    type: 'pipe_burst',
    zoneId: 'industrial',
    severity: 90,
    startStep: 120,
    durationSteps: 40,
    icon: Droplets,
    color: 'teal',
    description: 'Major arterial water rupture collapses industrial pressure and triggers backup electric booster pumps.',
  },
  {
    title: 'Downtown Substation Outage',
    type: 'substation_outage',
    zoneId: 'downtown',
    severity: 100,
    startStep: 130,
    durationSteps: 30,
    icon: Zap,
    color: 'yellow',
    description: 'Commercial core power loss trips automated traffic signals into fail-safe mode.',
  },
  {
    title: 'Monsoon Downpour',
    type: 'rain',
    severity: 70,
    startStep: 90,
    durationSteps: 36,
    icon: CloudRain,
    color: 'cyan',
    description: 'Heavy rainfall slows traffic speeds citywide by 45%.',
  },
];

export function ScenarioLab() {
  const { activeEvents, addEvent, removeEvent, clearEvents, step, setStep, currentState, config } = useSimulation();

  // Custom event builder state
  const [eventType, setEventType] = useState('heatwave');
  const [zoneId, setZoneId] = useState('downtown');
  const [severity, setSeverity] = useState(80);
  const [startStep, setStartStep] = useState(120);
  const [durationSteps, setDurationSteps] = useState(36);

  // Future Fork (Branching Timelines) state
  const [isForked, setIsForked] = useState(true);
  const [forkIntervention, setForkIntervention] = useState('reroute_traffic');
  const [forkComparison, setForkComparison] = useState(null);
  const [simulatingFork, setSimulatingFork] = useState(false);

  const handleAddCustomEvent = (e) => {
    e.preventDefault();
    addEvent({
      type: eventType,
      zoneId: eventType === 'heatwave' || eventType === 'rain' ? null : zoneId,
      severity,
      startStep,
      durationSteps,
    });
  };

  const runForkSimulation = async () => {
    setSimulatingFork(true);
    try {
      const res = await apiRequest('/api/recommendations/simulate-choice', {
        method: 'POST',
        body: JSON.stringify({
          step,
          activeEvents,
          interventions: [{ actionId: forkIntervention, targetZone: zoneId }],
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
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-heading text-xl font-bold text-white">Scenario Lab &amp; Future Fork</h2>
            <Badge type="Simulated" />
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Inject extreme events into the city nervous system. Fork the future timeline to contrast baseline degradation
            against active mitigation strategies.
          </p>
        </div>

        {activeEvents.length > 0 && (
          <Button variant="danger" size="sm" icon={Trash2} onClick={clearEvents}>
            Clear All Events ({activeEvents.length})
          </Button>
        )}
      </div>

      {/* Preset Incident Cards */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 font-mono">
          One-Click Incident Presets
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {PRESET_EVENTS.map((preset, idx) => {
            const Icon = preset.icon;
            return (
              <GlassCard
                key={idx}
                className="p-3 flex flex-col justify-between hover:border-teal-500/50 transition-all cursor-pointer group"
                onClick={() =>
                  addEvent({
                    type: preset.type,
                    zoneId: preset.zoneId,
                    severity: preset.severity,
                    startStep: preset.startStep,
                    durationSteps: preset.durationSteps,
                  })
                }
              >
                <div>
                  <div className="flex items-center justify-between pb-2">
                    <Icon className="w-5 h-5 text-teal-400 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-teal-300">
                      Sev {preset.severity}%
                    </span>
                  </div>
                  <h4 className="font-heading text-xs font-bold text-white group-hover:text-teal-300 transition-colors">
                    {preset.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{preset.description}</p>
                </div>

                <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-teal-400">
                  <span>+ Inject Event</span>
                  <Plus className="w-3.5 h-3.5" />
                </div>
              </GlassCard>
            );
          })}
        </div>
      </div>

      {/* Signature Innovation: Future Fork Dual-Lane Timeline */}
      <GlassCard className="p-5 border-teal-500/40 relative overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-white/5">
          <div className="flex items-center gap-2">
            <GitFork className="w-5 h-5 text-teal-400" />
            <h3 className="font-heading text-base font-bold text-white">
              Future Fork: Branching Timeline Simulator
            </h3>
          </div>
          <Badge type="Rule-based" />
        </div>

        <p className="text-xs text-slate-300 mt-2">
          Fork the timeline from current tick <strong>{step}</strong>. The baseline continues unmitigated on Lane 1, while
          Lane 2 runs your proposed intervention to measure the delta stability gain.
        </p>

        {/* Dual Lane Visualizer */}
        <div className="mt-5 space-y-4">
          {/* Lane 1: Baseline Timeline */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400 animate-pulse" />
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-2">
                  Lane 1: Unmitigated Baseline
                  <Badge variant="critical">No Intervention</Badge>
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5 font-mono">
                  Stability Index: {currentState?.stabilityIndex} | Critical Nodes: {currentState?.nodesInCritical}
                </div>
              </div>
            </div>

            <span className="text-xs font-mono text-rose-400 font-semibold">Cascades Spreading Freely</span>
          </div>

          {/* Lane 2: Forked Mitigation Timeline */}
          <div className="p-3.5 rounded-xl bg-teal-950/30 border border-teal-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-400" />
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-2">
                  Lane 2: Forked Timeline (With Mitigation)
                  <Badge variant="normal">Branch Active</Badge>
                </div>
                <div className="flex items-center gap-2 mt-1.5">
                  <select
                    value={forkIntervention}
                    onChange={(e) => setForkIntervention(e.target.value)}
                    className="bg-slate-900 border border-slate-700 text-xs text-white rounded px-2 py-1 focus:outline-none"
                  >
                    <option value="reroute_traffic">Dynamic Arterial Rerouting</option>
                    <option value="retime_signals">Adaptive Green-Wave Signals</option>
                    <option value="shed_industrial_load">Industrial Load Curtailment</option>
                    <option value="start_backup_pump">Municipal Booster Pumps</option>
                  </select>
                </div>
              </div>
            </div>

            <Button size="sm" variant="primary" onClick={runForkSimulation} loading={simulatingFork}>
              Simulate Fork Delta
            </Button>
          </div>
        </div>

        {/* Fork Comparison Scoreboard */}
        {forkComparison && (
          <div className="mt-4 p-4 rounded-xl bg-slate-950/80 border border-teal-500/30 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-[11px] text-slate-400 font-mono">Stability Gain</div>
              <div className="text-2xl font-heading font-bold text-teal-400 mt-0.5">
                +{forkComparison.deltaStability} pts
              </div>
            </div>
            <div>
              <div className="text-[11px] text-slate-400 font-mono">Critical Nodes Saved</div>
              <div className="text-2xl font-heading font-bold text-cyan-400 mt-0.5">
                {forkComparison.criticalReduced} Nodes
              </div>
            </div>
            <div>
              <div className="text-[11px] text-slate-400 font-mono">Improvement Efficacy</div>
              <div className="text-2xl font-heading font-bold text-emerald-400 mt-0.5">
                +{forkComparison.pctImprovement}%
              </div>
            </div>
          </div>
        )}
      </GlassCard>

      {/* Active Injected Events Table */}
      {activeEvents.length > 0 && (
        <GlassCard className="p-4">
          <h3 className="font-heading text-sm font-semibold text-white mb-3">
            Active Scenario Injections ({activeEvents.length})
          </h3>
          <div className="divide-y divide-white/5">
            {activeEvents.map((evt, idx) => (
              <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-white capitalize">{evt.type.replace('_', ' ')}</span>
                  {evt.zoneId && (
                    <span className="text-slate-400 font-mono">Zone: {evt.zoneId}</span>
                  )}
                  <span className="text-amber-400 font-mono">Severity: {evt.severity}%</span>
                  <span className="text-slate-400 font-mono">
                    Ticks: {evt.startStep} – {evt.startStep + evt.durationSteps}
                  </span>
                </div>
                <button
                  onClick={() => removeEvent(idx)}
                  className="p-1 rounded text-rose-400 hover:bg-rose-500/10"
                  title="Remove Event"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </GlassCard>
      )}
    </div>
  );
}
