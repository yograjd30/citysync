import React from 'react';
import { GlassCard } from '../common/GlassCard';
import { Button } from '../common/Button';
import { Play, Pause, SkipBack, SkipForward, Clock, Zap } from 'lucide-react';

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
  const timeFormatted = `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 === 0 ? 12 : hours % 12;
  const clockText = `${displayHours}:${String(mins).padStart(2, '0')} ${ampm}`;

  return (
    <GlassCard className="p-4 flex flex-col gap-3">
      {/* Upper bar: Clock, Play Controls, Speed */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Left: Clock Display */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-400/20 flex items-center justify-center text-teal-400">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <div className="text-base font-heading font-bold text-white flex items-center gap-2">
              {clockText}
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-teal-400 border border-teal-500/30">
                Tick {step} / 287
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">5-min deterministic step</p>
          </div>
        </div>

        {/* Center: Play Controls */}
        <div className="flex items-center gap-1.5 bg-slate-900/60 backdrop-blur-md border border-slate-700/50 rounded-xl p-1">
          <button
            onClick={stepBackward}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all"
            title="Step Back (-5 min)"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            onClick={togglePlay}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              isPlaying
                ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40 shadow-lg shadow-amber-500/10'
                : 'bg-teal-500 text-slate-950 hover:bg-teal-400 font-bold shadow-lg shadow-teal-500/20'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" /> Pause
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" /> Run Sim
              </>
            )}
          </button>

          <button
            onClick={stepForward}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all"
            title="Step Forward (+5 min)"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Right: Play Speed Pills */}
        <div className="flex items-center gap-1 bg-slate-900/60 border border-slate-700/50 rounded-lg p-0.5 text-xs font-mono">
          {[1, 2, 5].map((spd) => (
            <button
              key={spd}
              onClick={() => setPlaySpeed(spd)}
              className={`px-2 py-1 rounded transition-all ${
                playSpeed === spd
                  ? 'bg-teal-500/30 text-teal-300 font-bold border border-teal-400/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {spd}x
            </button>
          ))}
        </div>
      </div>

      {/* Scrubber Range Slider & Hour Tick Marks */}
      <div className="relative pt-2">
        <input
          type="range"
          min="0"
          max="287"
          value={step}
          onChange={(e) => setStep(parseInt(e.target.value, 10))}
          className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-400 focus:outline-none"
        />

        {/* Event Markers Overlay */}
        {activeEvents.map((evt, idx) => {
          const startPct = (evt.startStep / 287) * 100;
          return (
            <div
              key={idx}
              style={{ left: `${startPct}%` }}
              className="absolute top-1 transform -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-rose-500 border border-white shadow-sm pointer-events-none"
              title={`Injected Event: ${evt.type}`}
            />
          );
        })}

        {/* Hour Labels */}
        <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1 px-1">
          <span>00:00</span>
          <span>04:00</span>
          <span className="text-teal-400 font-semibold">08:00 (Rush)</span>
          <span>12:00</span>
          <span>16:00</span>
          <span className="text-amber-400 font-semibold">19:00 (Peak)</span>
          <span>23:55</span>
        </div>
      </div>
    </GlassCard>
  );
}
