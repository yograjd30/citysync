import React, { useState } from 'react';
import { GlassCard } from '../components/common/GlassCard';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { useSimulation } from '../context/SimulationContext';

export function InterconnectionsGraph() {
  const { currentState, config } = useSimulation();
  const [filterSystem, setFilterSystem] = useState('all');
  const [selectedGraphNode, setSelectedGraphNode] = useState(null);

  if (!currentState || !config) return null;

  const { zones } = currentState;

  const nodes = [];
  zones.forEach((z, zIdx) => {
    const angle = (zIdx / zones.length) * 2 * Math.PI - Math.PI / 2;

    ['traffic', 'electricity', 'water'].forEach((sys, sIdx) => {
      const offsetAngle = angle + (sIdx - 1) * 0.28;
      const x = 400 + Math.cos(offsetAngle) * (190 + (sIdx % 2) * 35);
      const y = 300 + Math.sin(offsetAngle) * (170 + (sIdx % 2) * 35);

      nodes.push({
        id: `${z.zoneId}:${sys}`,
        zoneId: z.zoneId,
        zoneName: z.name,
        system: sys,
        stress: z[sys]?.stress || 0,
        x,
        y,
      });
    });
  });

  const getStressColor = (stress) => {
    if (stress >= 70) return '#ef4444';
    if (stress >= 40) return '#f59e0b';
    return '#10b981';
  };

  const filteredNodes = filterSystem === 'all' ? nodes : nodes.filter((n) => n.system === filterSystem);

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-[var(--text-primary)]">Ripple Engine: 24-Node Interconnections</h2>
            <Badge type="Rule-based" />
          </div>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Directional coupling links with quantized lag propagation.
          </p>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-1 bg-[var(--surface-raised)] p-0.5 rounded-lg border border-[var(--hairline)] text-xs">
          {['all', 'traffic', 'electricity', 'water'].map((sys) => (
            <button
              key={sys}
              onClick={() => setFilterSystem(sys)}
              className={`px-2.5 py-1 rounded capitalize transition-colors ${
                filterSystem === sys
                  ? 'bg-white text-slate-950 font-semibold'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {sys}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Canvas */}
      <GlassCard className="p-4 relative flex flex-col h-[640px]">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--hairline)]">
          <div className="flex items-center gap-4 text-xs font-mono text-[var(--text-secondary)]">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" /> Traffic (8)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> Electricity (8)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Water (8)
            </span>
          </div>

          <div className="text-[11px] text-[var(--text-muted)] font-mono">
            Click any node to inspect coupling
          </div>
        </div>

        <div className="relative flex-1 w-full h-full">
          <svg viewBox="0 0 800 580" className="w-full h-full select-none">
            {/* Edges */}
            <g className="edges opacity-30">
              {nodes.map((srcNode, i) =>
                nodes.slice(i + 1).map((tgtNode, j) => {
                  const isSameZone = srcNode.zoneId === tgtNode.zoneId;
                  const isAdjacent = config.adjacency[srcNode.zoneId]?.includes(tgtNode.zoneId);
                  if (!isSameZone && !isAdjacent) return null;

                  const isHighStress = srcNode.stress >= 60 || tgtNode.stress >= 60;

                  return (
                    <line
                      key={`${srcNode.id}-${tgtNode.id}`}
                      x1={srcNode.x}
                      y1={srcNode.y}
                      x2={tgtNode.x}
                      y2={tgtNode.y}
                      stroke={isHighStress ? '#ef4444' : 'rgba(255, 255, 255, 0.08)'}
                      strokeWidth={isHighStress ? 1.5 : 1}
                      strokeDasharray={isSameZone ? 'none' : '3,3'}
                    />
                  );
                })
              )}
            </g>

            {/* Nodes */}
            {filteredNodes.map((node) => {
              const isSelected = selectedGraphNode?.id === node.id;
              const isCritical = node.stress >= 70;
              const color = getStressColor(node.stress);

              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  onClick={() => setSelectedGraphNode(node)}
                  className="cursor-pointer group"
                >
                  {/* Selection Ring */}
                  {isSelected && (
                    <circle
                      r="20"
                      fill="none"
                      stroke="rgba(255, 255, 255, 0.4)"
                      strokeWidth="1.5"
                      strokeDasharray="3,2"
                    />
                  )}

                  {/* Node Circle */}
                  <circle
                    r="12"
                    fill="#0e111a"
                    stroke={color}
                    strokeWidth={isSelected ? '2' : '1.5'}
                    className="transition-colors duration-150"
                  />

                  {/* System Initial */}
                  <text
                    y="3.5"
                    textAnchor="middle"
                    fill="#f0f2f7"
                    fontSize="8"
                    fontWeight="600"
                    fontFamily="monospace"
                  >
                    {node.system[0].toUpperCase()}
                  </text>

                  {/* Label */}
                  <text
                    y="-16"
                    textAnchor="middle"
                    fill="rgba(255,255,255,0.4)"
                    fontSize="7.5"
                    fontFamily="Inter, sans-serif"
                    className="pointer-events-none"
                  >
                    {node.zoneName.split(' ')[0]}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Node Inspector Card */}
          {selectedGraphNode && (
            <div className="absolute bottom-4 right-4 w-72 p-3.5 rounded-xl bg-[var(--surface-card)] border border-[var(--hairline-focused)] shadow-xl text-xs space-y-2.5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-semibold text-[var(--text-primary)]">
                    {selectedGraphNode.zoneName}
                  </div>
                  <div className="text-[11px] font-mono text-[var(--text-muted)] capitalize">
                    {selectedGraphNode.system} Infrastructure
                  </div>
                </div>
                <Badge variant={selectedGraphNode.stress >= 70 ? 'critical' : selectedGraphNode.stress >= 40 ? 'warning' : 'normal'}>
                  {selectedGraphNode.stress}%
                </Badge>
              </div>

              <div className="p-2.5 rounded bg-[var(--surface-raised)] space-y-1 font-mono text-[10px] text-[var(--text-secondary)]">
                <div>Coupling Rules:</div>
                <div className="text-[var(--text-muted)]">
                  {selectedGraphNode.system === 'traffic' && '• Spillover to adjacent roads (10m lag)'}
                  {selectedGraphNode.system === 'electricity' && '• Degrades traffic signals (10m lag)\n• Drops pumping pressure (15m lag)'}
                  {selectedGraphNode.system === 'water' && '• Pressure collapse engages auxiliary pumps (5m lag)'}
                </div>
              </div>

              <Button
                size="sm"
                variant="secondary"
                className="w-full text-xs"
                onClick={() => setSelectedGraphNode(null)}
              >
                Close
              </Button>
            </div>
          )}
        </div>
      </GlassCard>
    </div>
  );
}
