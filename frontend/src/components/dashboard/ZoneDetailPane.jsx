import React, { useState, useEffect } from 'react';
import { GlassCard } from '../common/GlassCard';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Car, Zap, Droplets, Users, ArrowRight, ShieldAlert, GitBranch, X } from 'lucide-react';
import { apiRequest } from '../../api/client';

export function ZoneDetailPane({ zoneId, currentState, onClose, onOpenCascadeTrace }) {
  const [traceData, setTraceData] = useState(null);
  const [loadingTrace, setLoadingTrace] = useState(false);

  const zone = currentState?.zones?.find((z) => z.zoneId === zoneId);

  useEffect(() => {
    // Automatically load cascade trace for the most stressed system in this zone
    if (zone) {
      const systems = [
        { name: 'traffic', stress: zone.traffic.stress },
        { name: 'electricity', stress: zone.electricity.stress },
        { name: 'water', stress: zone.water.stress },
      ];
      systems.sort((a, b) => b.stress - a.stress);
      const topSystem = systems[0].name;

      setLoadingTrace(true);
      apiRequest(`/api/simulation/cascade-trace?nodeId=${zoneId}:${topSystem}&step=${currentState.step}`)
        .then((data) => setTraceData(data))
        .catch(() => setTraceData(null))
        .finally(() => setLoadingTrace(false));
    }
  }, [zoneId, currentState?.step]);

  if (!zone) return null;

  return (
    <GlassCard className="p-4 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start justify-between pb-3 border-b border-white/5">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-heading text-base font-bold text-white">{zone.name}</h3>
            <Badge type="Simulated" />
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-400 font-mono mt-1">
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-teal-400" />
              {zone.population.toLocaleString()} Residents
            </span>
            <span>•</span>
            <span className="capitalize">{zone.type?.replace('_', ' ')}</span>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* 3 Infrastructure Systems Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Traffic Node */}
        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-slate-300 font-medium">
              <Car className="w-4 h-4 text-cyan-400" />
              Traffic
            </div>
            <Badge
              variant={
                zone.traffic.stress >= 70 ? 'critical' : zone.traffic.stress >= 40 ? 'warning' : 'normal'
              }
            >
              {zone.traffic.stress}%
            </Badge>
          </div>
          <div className="mt-2 text-xs font-mono">
            <div className="flex justify-between text-slate-400">
              <span>Congestion:</span>
              <span className="text-white font-semibold">{zone.traffic.congestion}%</span>
            </div>
            <div className="flex justify-between text-slate-400 mt-0.5">
              <span>Avg Speed:</span>
              <span className="text-white font-semibold">{zone.traffic.avgSpeedKmh} km/h</span>
            </div>
          </div>
        </div>

        {/* Electricity Node */}
        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-slate-300 font-medium">
              <Zap className="w-4 h-4 text-amber-400" />
              Electricity
            </div>
            <Badge
              variant={
                zone.electricity.stress >= 70 ? 'critical' : zone.electricity.stress >= 40 ? 'warning' : 'normal'
              }
            >
              {zone.electricity.stress}%
            </Badge>
          </div>
          <div className="mt-2 text-xs font-mono">
            <div className="flex justify-between text-slate-400">
              <span>Substation Load:</span>
              <span className="text-white font-semibold">{zone.electricity.demand}%</span>
            </div>
            <div className="flex justify-between text-slate-400 mt-0.5">
              <span>Capacity:</span>
              <span className="text-white font-semibold">{zone.electricity.capacity}%</span>
            </div>
          </div>
        </div>

        {/* Water Node */}
        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-slate-300 font-medium">
              <Droplets className="w-4 h-4 text-teal-400" />
              Water
            </div>
            <Badge
              variant={
                zone.water.stress >= 70 ? 'critical' : zone.water.stress >= 40 ? 'warning' : 'normal'
              }
            >
              {zone.water.stress}%
            </Badge>
          </div>
          <div className="mt-2 text-xs font-mono">
            <div className="flex justify-between text-slate-400">
              <span>Pressure:</span>
              <span className="text-white font-semibold">{zone.water.pressure}%</span>
            </div>
            <div className="flex justify-between text-slate-400 mt-0.5">
              <span>Stress:</span>
              <span className="text-white font-semibold">{zone.water.stress}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Embedded Why / Cascade Tracing Summary */}
      {traceData && (
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
          <div className="flex items-center justify-between font-semibold text-slate-200 mb-2">
            <span className="flex items-center gap-1.5 text-teal-400">
              <GitBranch className="w-3.5 h-3.5" />
              Chain Reaction Breakdown (Why Panel)
            </span>
            <Badge type="Rule-based" />
          </div>

          <div className="space-y-1.5 text-slate-300">
            {traceData.causes?.slice(0, 2).map((c, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-amber-400">←</span>
                <span>{c.cause}</span>
                <span className="text-[10px] text-slate-400 font-mono">(lag {c.lagMinutes}m)</span>
              </div>
            ))}

            {traceData.forwardImpacts?.slice(0, 2).map((f, i) => (
              <div key={i} className="flex items-center gap-2 text-rose-300">
                <span className="text-rose-400">→</span>
                <span>{f.description}</span>
                <span className="text-[10px] text-slate-400 font-mono">(+{f.lagMinutes}m)</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </GlassCard>
  );
}
