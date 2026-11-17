import React from 'react';
import { GlassCard } from '../common/GlassCard';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';

export function TimeScrubber({
  step,
  setStep,
  isPlaying,
  togglePlay,
  playSpeed,
  setPlaySpeed,
  stepForward,
  stepBackward,
  activeEvents = [],
}) {
  const totalMinutes = step * 5;
  const hours = Math.floor(totalMinutes / 60) % 24;
  const mins = totalMinutes % 60;
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 === 0 ? 12 : hours % 12;
  const clockText = `${displayHours}:${String(mins).padStart(2, '0')} ${ampm}`;

  return (
    <GlassCard className="p-4 flex flex-col gap-3">
      {/* Top Bar: Time, Transport, Speed */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Left: Digital Readout */}
        <div className="flex items-baseline gap-2.5">
          <span className="text-sm font-semibold tracking-tight text-[var(--text-primary)] font-tabular">
            {clockText}
          </span>
          <span className="text-[11px] font-mono text-[var(--text-muted)]">
            Step {step} of 287 (5m interval)
          </span>
        </div>

        {/* Center: Precision Transport */}
        <div className="flex items-center gap-1 bg-[var(--surface-raised)] border border-[var(--hairline)] rounded-lg p-0.5">
          <button
            onClick={stepBackward}
            className="p-1.5 rounded text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/[0.04] transition-colors"
            title="Step Back (-5m)"
          >
            <SkipBack className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={togglePlay}
            className={`px-3 py-1 rounded text-xs font-medium flex items-center gap-1.5 transition-colors ${
              isPlaying
                ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                : 'bg-white text-slate-950 hover:bg-slate-200 font-semibold'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3 h-3 fill-current" /> Pause
              </>
            ) : (
              <>
                <Play className="w-3 h-3 fill-current" /> Run Sim
              </>
            )}
          </button>

          <button
            onClick={stepForward}
            className="p-1.5 rounded text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/[0.04] transition-colors"
            title="Step Forward (+5m)"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right: Clean Speed Multipliers */}
        <div className="flex items-center gap-0.5 bg-[var(--surface-raised)] border border-[var(--hairline)] rounded-lg p-0.5 text-xs font-mono">
          {[1, 2, 5].map((spd) => (
            <button
              key={spd}
              onClick={() => setPlaySpeed(spd)}
              className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
                playSpeed === spd
                  ? 'bg-white/[0.1] text-[var(--text-primary)] font-semibold'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
              }`}
            >
              {spd}x
            </button>
          ))}
        </div>
      </div>

      {/* Scrub Rail */}
      <div className="relative pt-1">
        <input
          type="range"
          min="0"
          max="287"
          value={step}
          onChange={(e) => setStep(parseInt(e.target.value, 10))}
          className="w-full h-1.5 bg-slate-800 rounded-full appearance-none cursor-pointer accent-cyan-400 focus:outline-none"
        />

        {/* Event Markers */}
        {activeEvents.map((evt, idx) => {
          const startPct = (evt.startStep / 287) * 100;
          return (
            <div
              key={idx}
              style={{ left: `${startPct}%` }}
              className="absolute top-0.5 transform -translate-x-1/2 w-2 h-2 rounded-full bg-rose-500 border border-[var(--surface-card)] pointer-events-none"
              title={`Injected Event: ${evt.type}`}
            />
          );
        })}

        {/* Clean Diurnal Markers */}
        <div className="flex justify-between text-[10px] text-[var(--text-muted)] font-mono mt-1.5 px-0.5">
          <span>00:00</span>
          <span>04:00</span>
          <span>08:00 (Rush)</span>
          <span>12:00</span>
          <span>16:00</span>
          <span>19:00 (Peak)</span>
          <span>23:55</span>
        </div>
      </div>
    </GlassCard>
  );
}
