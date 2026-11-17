import React, { useState } from 'react';
import { GlassCard } from '../components/common/GlassCard';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { useSimulation } from '../context/SimulationContext';
import { Network, Car, Zap, Droplets, ArrowRight, Play, Info } from 'lucide-react';

export function InterconnectionsGraph() {
  const { currentState, config, step } = useSimulation();
  const [filterSystem, setFilterSystem] = useState('all');
  const [selectedGraphNode, setSelectedGraphNode] = useState(null);

  if (!currentState || !config) return null;

  const { zones } = currentState;

  // Generate 24 nodes positioned by zone and system
  const nodes = [];
  zones.forEach((z, zIdx) => {
    const angle = (zIdx / zones.length) * 2 * Math.PI - Math.PI / 2;
    const centerX = 400 + Math.cos(angle) * 240;
    const centerY = 320 + Math.sin(angle) * 200;

    ['traffic', 'electricity', 'water'].forEach((sys, sIdx) => {
      const offsetAngle = angle + (sIdx - 1) * 0.28;
      const x = 400 + Math.cos(offsetAngle) * (200 + (sIdx % 2) * 40);
      const y = 320 + Math.sin(offsetAngle) * (180 + (sIdx % 2) * 40);

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

  const getSystemColor = (sys) => {
    switch (sys) {
      case 'traffic':
        return '#38bdf8'; // Sky blue
      case 'electricity':
        return '#fbbf24'; // Amber
      case 'water':
        return '#2dd4bf'; // Teal
      default:
        return '#94a3b8';
    }
  };

  const getStressColor = (stress) => {
    if (stress >= 70) return '#f43f5e';
    if (stress >= 40) return '#fbbf24';
    return '#2dd4bf';
  };

  const filteredNodes = filterSystem === 'all' ? nodes : nodes.filter((n) => n.system === filterSystem);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-heading text-xl font-bold text-white">Ripple Engine: 24-Node Interconnections Graph</h2>
            <Badge type="Rule-based" />
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Watch chain reactions propagate along weighted, directed coupling edges in real time.
            Glowing ripples travel across systems with quantized delays matching the simulation clock.
          </p>
        </div>

        {/* Filter by System */}
        <div className="flex items-center gap-1.5 bg-slate-900/60 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
          {['all', 'traffic', 'electricity', 'water'].map((sys) => (
            <button
              key={sys}
              onClick={() => setFilterSystem(sys)}
              className={`px-3 py-1.5 rounded-lg capitalize transition-all ${
                filterSystem === sys
                  ? 'bg-teal-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {sys}
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Graph Canvas */}
      <GlassCard className="p-4 relative flex flex-col h-[680px]">
        <div className="flex items-center justify-between pb-3 border-b border-white/5 z-10">
          <div className="flex items-center gap-4 text-xs font-mono text-slate-300">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" /> Traffic (8)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Electricity (8)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-400" /> Water (8)
            </span>
          </div>

          <div className="text-xs text-slate-400 font-mono">
            Click any node to trace directional coupling &amp; lags
          </div>
        </div>

        {/* SVG Network Canvas */}
        <div className="relative flex-1 w-full h-full">
          <svg viewBox="0 0 800 600" className="w-full h-full select-none">
            <defs>
              <filter id="rippleGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="8" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Cross-System Coupling Edges */}
            <g className="edges opacity-40">
              {nodes.map((srcNode, i) =>
                nodes.slice(i + 1).map((tgtNode, j) => {
                  // Connect if same zone or adjacent zones
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
                      stroke={isHighStress ? '#f43f5e' : 'rgba(148, 163, 184, 0.2)'}
                      strokeWidth={isHighStress ? 2 : 1}
                      strokeDasharray={isSameZone ? 'none' : '4,3'}
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
                  {/* Active Ripple Wave if Critical */}
                  {isCritical && (
                    <circle
                      r="28"
                      fill="none"
                      stroke="#f43f5e"
                      strokeWidth="2"
                      className="animate-ping opacity-75"
                    />
                  )}

                  {/* Selection Ring */}
                  {isSelected && (
                    <circle
                      r="24"
                      fill="none"
                      stroke="#2dd4bf"
                      strokeWidth="2.5"
                      strokeDasharray="4,2"
                      className="animate-spin"
                    />
                  )}

                  {/* Node Circle */}
                  <circle
                    r="15"
                    fill="rgba(15, 23, 42, 0.9)"
                    stroke={color}
                    strokeWidth={isSelected ? '3' : '2'}
                    filter={isCritical ? 'url(#rippleGlow)' : undefined}
                    className="transition-transform duration-200 group-hover:scale-125"
                  />

                  {/* System Initial */}
                  <text
                    y="4"
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="9"
                    fontWeight="700"
                    fontFamily="monospace"
                  >
                    {node.system[0].toUpperCase()}
                  </text>

                  {/* Zone Label */}
                  <text
                    y="-20"
                    textAnchor="middle"
                    fill="rgba(255,255,255,0.7)"
                    fontSize="8"
                    fontFamily="Inter, sans-serif"
                    className="pointer-events-none"
                  >
                    {node.zoneName.split(' ')[0]}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Node Inspector Overlay Card */}
          {selectedGraphNode && (
            <div className="absolute bottom-4 right-4 w-80 p-4 rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-teal-500/40 shadow-2xl text-xs space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-heading font-bold text-white text-sm">
                    {selectedGraphNode.zoneName}
                  </div>
                  <div className="text-teal-400 font-mono capitalize">
                    {selectedGraphNode.system} Infrastructure Node
                  </div>
                </div>
                <Badge variant={selectedGraphNode.stress >= 70 ? 'critical' : selectedGraphNode.stress >= 40 ? 'warning' : 'normal'}>
                  {selectedGraphNode.stress}% Stress
                </Badge>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 space-y-1.5 font-mono text-[11px]">
                <div className="text-slate-400">Directional Coupling Rules:</div>
                <div className="text-slate-200">
                  {selectedGraphNode.system === 'traffic' && '• Spillover to adjacent roads (lag 10m)'}
                  {selectedGraphNode.system === 'electricity' && '• Degrades traffic signals (lag 10m)\n• Reduces water pumping pressure (lag 15m)'}
                  {selectedGraphNode.system === 'water' && '• Pressure loss engages auxiliary electric pumps (lag 5m)'}
                </div>
              </div>

              <Button
                size="sm"
                variant="glass"
                className="w-full"
                onClick={() => setSelectedGraphNode(null)}
              >
                Close Inspector
              </Button>
            </div>
          )}
        </div>
      </GlassCard>
    </div>
  );
}
