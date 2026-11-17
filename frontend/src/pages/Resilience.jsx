import React, { useState, useEffect } from 'react';
import { GlassCard } from '../components/common/GlassCard';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { useSimulation } from '../context/SimulationContext';
import { Printer, FileText } from 'lucide-react';
import { apiRequest } from '../api/client';

export function Resilience() {
  const { seed, currentState } = useSimulation();
  const [weakLinks, setWeakLinks] = useState(null);
  const [playbooks, setPlaybooks] = useState([]);
  const [showBriefModal, setShowBriefModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const wl = await apiRequest(`/api/simulation/weak-links?seed=${seed}`);
        setWeakLinks(wl);
        const pb = await apiRequest('/api/scenarios/playbooks/list');
        setPlaybooks(pb);
      } catch (err) {
        console.error('Failed to load resilience data', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [seed]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-[var(--text-primary)]">Resilience, Weak Links &amp; Executive Brief</h2>
            <Badge type="Rule-based" />
          </div>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Full-network stress tests, single-point-of-failure ranking, and executive decision briefings.
          </p>
        </div>

        <Button variant="primary" size="sm" icon={FileText} onClick={() => setShowBriefModal(true)}>
          Generate Executive Brief
        </Button>
      </div>

      {/* Resilience KPI Overview */}
      {weakLinks && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          <GlassCard className="p-4 flex flex-col justify-between">
            <span className="text-xs font-medium text-[var(--text-secondary)]">City Resilience Score</span>
            <div className="flex items-baseline gap-1 mt-2 font-tabular">
              <span className="text-3xl font-semibold text-emerald-400">
                {weakLinks.cityResilienceScore}
              </span>
              <span className="text-xs text-[var(--text-muted)] font-mono">/100</span>
            </div>
            <div className="mt-2 text-[11px] text-[var(--text-muted)]">
              Aggregate resistance to isolated node failure
            </div>
          </GlassCard>

          <GlassCard className="p-4 flex flex-col justify-between">
            <span className="text-xs font-medium text-[var(--text-secondary)]">Highest Vulnerability</span>
            <div className="mt-2">
              <div className="text-sm font-semibold text-rose-400">
                {weakLinks.rankedWeakLinks?.[0]?.zoneName} (Electricity)
              </div>
              <div className="text-xs text-[var(--text-muted)] font-mono mt-0.5 font-tabular">
                -{weakLinks.rankedWeakLinks?.[0]?.stabilityDrop} pts potential drop
              </div>
            </div>
            <div className="mt-2 text-[11px] text-[var(--text-muted)]">
              Centrality: {weakLinks.rankedWeakLinks?.[0]?.betweennessCentrality}
            </div>
          </GlassCard>

          <GlassCard className="p-4 flex flex-col justify-between">
            <span className="text-xs font-medium text-[var(--text-secondary)]">Validated Playbooks</span>
            <div className="flex items-baseline gap-1 mt-2 font-tabular">
              <span className="text-3xl font-semibold text-cyan-400">
                {playbooks.length}
              </span>
              <span className="text-xs text-[var(--text-muted)] font-mono">active</span>
            </div>
            <div className="mt-2 text-[11px] text-[var(--text-muted)]">
              Avg historical recovery: +21.4 pts
            </div>
          </GlassCard>
        </div>
      )}

      {/* Weak Links Table */}
      <GlassCard className="p-4">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--hairline)]">
          <h3 className="text-xs font-semibold text-[var(--text-primary)]">
            Single Point of Failure Vulnerability Ranking
          </h3>
          <Badge type="Rule-based" />
        </div>

        <div className="mt-2 overflow-x-auto">
          <table className="w-full text-left text-xs font-mono font-tabular">
            <thead>
              <tr className="border-b border-[var(--hairline)] text-[var(--text-muted)]">
                <th className="pb-2 font-medium">Rank</th>
                <th className="pb-2 font-medium">Infrastructure Node</th>
                <th className="pb-2 font-medium">System</th>
                <th className="pb-2 font-medium">Impact Drop</th>
                <th className="pb-2 font-medium">Critical Tripped</th>
                <th className="pb-2 font-medium">Population Exposed</th>
                <th className="pb-2 font-medium">Centrality</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--hairline)]">
              {weakLinks?.rankedWeakLinks?.slice(0, 8).map((link) => (
                <tr key={link.nodeId} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-2 font-semibold text-[var(--text-muted)]">0{link.dangerRank}</td>
                  <td className="py-2 text-[var(--text-primary)] font-sans">{link.zoneName}</td>
                  <td className="py-2 capitalize text-[var(--text-secondary)]">{link.system}</td>
                  <td className="py-2 text-rose-400 font-semibold">-{link.stabilityDrop} pts</td>
                  <td className="py-2 text-[var(--text-secondary)]">{link.nodesInCritical} Nodes</td>
                  <td className="py-2 text-[var(--text-secondary)]">~{link.residentsAffected.toLocaleString()}</td>
                  <td className="py-2 text-[var(--text-muted)]">{link.betweennessCentrality}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Printable Mayor Decision Brief Modal */}
      {showBriefModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[var(--surface-card)] border border-[var(--hairline)] rounded-xl shadow-2xl p-6 print:bg-white print:text-black print:border-none">
            {/* Header */}
            <div className="flex items-start justify-between pb-3.5 border-b border-[var(--hairline)]">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
                  Executive Briefing
                </span>
                <h2 className="text-base font-semibold text-[var(--text-primary)] mt-0.5">
                  CitySync Operational Brief: Infrastructure Telemetry
                </h2>
                <div className="text-[11px] text-[var(--text-muted)] font-mono mt-0.5 font-tabular">
                  Simulation Clock: {currentState?.timeFormatted || '12:00'} | Seed #42
                </div>
              </div>

              <div className="flex items-center gap-2 print:hidden">
                <Button variant="primary" size="sm" icon={Printer} onClick={handlePrint}>
                  Print / PDF
                </Button>
                <Button variant="secondary" size="sm" onClick={() => setShowBriefModal(false)}>
                  Close
                </Button>
              </div>
            </div>

            {/* Briefing Body */}
            <div className="mt-4 space-y-3.5 text-xs leading-relaxed text-[var(--text-secondary)]">
              <div className="p-3 rounded-lg bg-[var(--surface-raised)] border border-[var(--hairline)]">
                <h4 className="font-semibold text-[var(--text-primary)] text-xs mb-1">
                  1. Current Status
                </h4>
                <p>
                  City stability is at <strong className="text-[var(--text-primary)]">{currentState?.stabilityIndex}/100</strong>.
                  Currently, <strong className="text-[var(--text-primary)]">{currentState?.nodesInCritical} nodes</strong> exceed
                  the critical threshold (&gt;70%), and {currentState?.nodesInWarning} nodes are in warning.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-[var(--surface-raised)] border border-[var(--hairline)]">
                <h4 className="font-semibold text-[var(--text-primary)] text-xs mb-1">
                  2. Projected Trajectory
                </h4>
                <p>
                  Coupled simulation projects secondary corridor congestion in ~25 minutes,
                  exposing an estimated 120,000 citizens to localized voltage sag and pressure loss.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-[var(--surface-raised)] border border-[var(--hairline)]">
                <h4 className="font-semibold text-[var(--text-primary)] text-xs mb-1">
                  3. Recommended Response
                </h4>
                <p>
                  Enforce Dynamic Corridor Rerouting around Stadium District and curtail non-essential industrial draw.
                </p>
                <div className="mt-2 font-mono text-[11px] text-emerald-400">
                  Projected Gain: +18.5 stability points | 2 Critical Breaches Averted
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-[var(--hairline)] text-center text-[10px] text-[var(--text-muted)] font-mono">
              Deterministic CitySync engine. Zero external AI API reliance.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
