import React, { useState } from 'react';
import { X, ArrowUpRight } from 'lucide-react';

export function GuidedFirstRun({ onSelectTab }) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="w-full px-4 py-2.5 rounded-xl bg-[var(--surface-card)] border border-[var(--hairline)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
      <div className="flex items-center gap-2.5">
        <span className="w-2 h-2 rounded-full bg-cyan-400" />
        <span className="font-medium text-[var(--text-primary)]">System Initialized</span>
        <span className="text-[var(--text-muted)] hidden md:inline">|</span>
        <span className="text-[var(--text-secondary)] hidden md:inline">
          Deterministic 24-node simulation active. Drag the scrubber or inject events in Scenario Lab to trace cascades.
        </span>
      </div>

      <div className="flex items-center gap-4 text-[11px] font-mono text-[var(--text-secondary)]">
        <button
          onClick={() => onSelectTab('scenarios')}
          className="hover:text-[var(--text-primary)] flex items-center gap-0.5"
        >
          Scenario Lab <ArrowUpRight className="w-3 h-3 text-[var(--text-muted)]" />
        </button>
        <button
          onClick={() => onSelectTab('warnings')}
          className="hover:text-[var(--text-primary)] flex items-center gap-0.5"
        >
          Early Warnings <ArrowUpRight className="w-3 h-3 text-[var(--text-muted)]" />
        </button>
        <button
          onClick={() => onSelectTab('models')}
          className="hover:text-[var(--text-primary)] flex items-center gap-0.5"
        >
          Model Cards <ArrowUpRight className="w-3 h-3 text-[var(--text-muted)]" />
        </button>

        <button
          onClick={() => setDismissed(true)}
          className="p-1 rounded text-[var(--text-muted)] hover:text-[var(--text-primary)] ml-1"
          title="Dismiss"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
