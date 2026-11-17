import React from 'react';
import { GlassCard } from '../common/GlassCard';
import { Badge } from '../common/Badge';

const ZONE_COORDINATES = {
  residential_north: { x: 260, y: 55, label: 'Residential North' },
  old_town: { x: 100, y: 105, label: 'Old Town' },
  tech_park: { x: 420, y: 105, label: 'Tech Park' },
  downtown: { x: 260, y: 175, label: 'Downtown Core' },
  industrial: { x: 90, y: 265, label: 'Industrial Estate' },
  stadium: { x: 260, y: 275, label: 'Stadium District' },
  port_airport: { x: 430, y: 265, label: 'Port & Airport' },
  residential_south: { x: 260, y: 375, label: 'Residential South' },
};

const LINKS = [
  ['residential_north', 'old_town'],
  ['residential_north', 'downtown'],
  ['residential_north', 'tech_park'],
  ['old_town', 'downtown'],
  ['old_town', 'industrial'],
  ['tech_park', 'downtown'],
  ['tech_park', 'port_airport'],
  ['downtown', 'industrial'],
  ['downtown', 'stadium'],
  ['downtown', 'port_airport'],
  ['industrial', 'stadium'],
  ['industrial', 'residential_south'],
  ['stadium', 'residential_south'],
  ['stadium', 'port_airport'],
  ['port_airport', 'residential_south'],
];

function getStressColor(stress) {
  if (stress >= 70) return '#ef4444'; // Red
  if (stress >= 40) return '#f59e0b'; // Amber
  return '#10b981'; // Green
}

export function IsometricMap({ currentState, selectedZone, onSelectZone }) {
  if (!currentState) return null;

  const { zones } = currentState;
  const zoneMap = {};
  zones.forEach((z) => {
    zoneMap[z.zoneId] = z;
  });

  return (
    <GlassCard className="p-4 flex flex-col h-full min-h-[480px]">
      <div className="flex items-center justify-between pb-3 border-b border-[var(--hairline)]">
        <div>
          <h3 className="text-xs font-semibold text-[var(--text-primary)]">
            Metropolitan Topology (8 Sectors)
          </h3>
          <p className="text-[11px] text-[var(--text-muted)] font-mono mt-0.5">
            Coupled dependency graph • Click node to inspect
          </p>
        </div>

        <div className="flex items-center gap-4 text-[11px] font-mono text-[var(--text-secondary)]">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> &lt;40% Nominal
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> 40–70% Warning
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> &gt;70% Critical
          </span>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="relative flex-1 w-full flex items-center justify-center p-2">
        <svg viewBox="0 0 540 430" className="w-full h-full max-h-[430px] select-none">
          <defs>
            <pattern id="grid" width="28" height="28" patternUnits="userSpaceOnUse">
              <path d="M 28 0 L 0 0 0 28" fill="none" stroke="rgba(255, 255, 255, 0.018)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Adjacency Links */}
          <g className="links">
            {LINKS.map(([sourceId, targetId], idx) => {
              const src = ZONE_COORDINATES[sourceId];
              const tgt = ZONE_COORDINATES[targetId];
              if (!src || !tgt) return null;

              const srcData = zoneMap[sourceId];
              const tgtData = zoneMap[targetId];
              const isStressedLink =
                srcData && tgtData && (srcData.traffic.stress > 60 || tgtData.traffic.stress > 60);

              return (
                <g key={idx}>
                  <line
                    x1={src.x}
                    y1={src.y}
                    x2={tgt.x}
                    y2={tgt.y}
                    stroke={isStressedLink ? 'rgba(239, 68, 68, 0.5)' : 'rgba(255, 255, 255, 0.07)'}
                    strokeWidth={isStressedLink ? '1.5' : '1'}
                    strokeDasharray={isStressedLink ? '3,3' : 'none'}
                  />
                  {isStressedLink && (
                    <circle
                      cx={(src.x + tgt.x) / 2}
                      cy={(src.y + tgt.y) / 2}
                      r="2"
                      fill="#ef4444"
                    />
                  )}
                </g>
              );
            })}
          </g>

          {/* 8 Zone Nodes */}
          {Object.entries(ZONE_COORDINATES).map(([zoneId, coords]) => {
            const data = zoneMap[zoneId];
            if (!data) return null;

            const isSelected = selectedZone === zoneId;
            const avgStress = Math.round(
              (data.traffic.stress + data.electricity.stress + data.water.stress) / 3
            );
            const mainColor = getStressColor(avgStress);

            return (
              <g
                key={zoneId}
                transform={`translate(${coords.x}, ${coords.y})`}
                onClick={() => onSelectZone(zoneId)}
                className="cursor-pointer group"
              >
                {/* Selection Ring */}
                {isSelected && (
                  <circle
                    r="40"
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.3)"
                    strokeWidth="1"
                    strokeDasharray="3,3"
                  />
                )}

                {/* Base Plate */}
                <circle
                  r="32"
                  fill="#0e111a"
                  stroke={isSelected ? '#ffffff' : 'rgba(255, 255, 255, 0.1)'}
                  strokeWidth={isSelected ? '1.5' : '1'}
                  className="transition-colors duration-150"
                />

                {/* Status Rim Arc Indicator */}
                <circle
                  r="32"
                  fill="none"
                  stroke={mainColor}
                  strokeWidth="2"
                  strokeDasharray={`${(avgStress / 100) * 201} 201`}
                  strokeLinecap="round"
                  transform="rotate(-90)"
                />

                {/* Label */}
                <text
                  y="-11"
                  textAnchor="middle"
                  fill="#f0f2f7"
                  fontSize="9.5"
                  fontWeight="500"
                  fontFamily="Inter, -apple-system, sans-serif"
                >
                  {data.name.split(' ')[0]}
                </text>

                {/* 3 Mini System Indicator Bars */}
                <g transform="translate(-15, 1)">
                  {/* Traffic */}
                  <rect x="0" y="0" width="7" height="12" rx="1" fill="rgba(255, 255, 255, 0.05)" />
                  <rect
                    x="0"
                    y={12 - (data.traffic.stress / 100) * 12}
                    width="7"
                    height={(data.traffic.stress / 100) * 12}
                    rx="1"
                    fill={getStressColor(data.traffic.stress)}
                  />

                  {/* Electricity */}
                  <rect x="11.5" y="0" width="7" height="12" rx="1" fill="rgba(255, 255, 255, 0.05)" />
                  <rect
                    x="11.5"
                    y={12 - (data.electricity.stress / 100) * 12}
                    width="7"
                    height={(data.electricity.stress / 100) * 12}
                    rx="1"
                    fill={getStressColor(data.electricity.stress)}
                  />

                  {/* Water */}
                  <rect x="23" y="0" width="7" height="12" rx="1" fill="rgba(255, 255, 255, 0.05)" />
                  <rect
                    x="23"
                    y={12 - (data.water.stress / 100) * 12}
                    width="7"
                    height={(data.water.stress / 100) * 12}
                    rx="1"
                    fill={getStressColor(data.water.stress)}
                  />
                </g>

                {/* Tabular Stress Readout */}
                <text
                  y="22"
                  textAnchor="middle"
                  fill={mainColor}
                  fontSize="8.5"
                  fontWeight="600"
                  fontFamily="monospace"
                >
                  {avgStress}%
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </GlassCard>
  );
}
