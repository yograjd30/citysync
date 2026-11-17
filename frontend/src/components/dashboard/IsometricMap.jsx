import React from 'react';
import { GlassCard } from '../common/GlassCard';
import { Badge } from '../common/Badge';
import { Car, Zap, Droplets, MapPin, Eye } from 'lucide-react';

const ZONE_COORDINATES = {
  residential_north: { x: 260, y: 60, label: 'Residential North' },
  old_town: { x: 100, y: 110, label: 'Old Town' },
  tech_park: { x: 420, y: 110, label: 'Tech Park' },
  downtown: { x: 260, y: 180, label: 'Downtown Core' },
  industrial: { x: 90, y: 270, label: 'Industrial Estate' },
  stadium: { x: 260, y: 280, label: 'Stadium District' },
  port_airport: { x: 430, y: 270, label: 'Port & Airport' },
  residential_south: { x: 260, y: 380, label: 'Residential South' },
};

// Adjacency connections to draw links
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
  if (stress >= 70) return '#f43f5e'; // Rose
  if (stress >= 40) return '#fbbf24'; // Amber
  return '#2dd4bf'; // Teal
}

export function IsometricMap({ currentState, selectedZone, onSelectZone }) {
  if (!currentState) return null;

  const { zones } = currentState;

  // Map zone data by zoneId
  const zoneMap = {};
  zones.forEach((z) => {
    zoneMap[z.zoneId] = z;
  });

  return (
    <GlassCard className="p-4 flex flex-col h-full min-h-[480px]">
      <div className="flex items-center justify-between pb-3 border-b border-white/5">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-teal-400" />
          <h3 className="font-heading text-sm font-semibold text-white">
            Synthetic City Infrastructure Map (8 Zones)
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <Badge type="Simulated" />
          <div className="hidden sm:flex items-center gap-3 text-[11px] font-mono text-slate-400">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-teal-400" /> &lt;40 Normal
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-400" /> 40-70 Warning
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-rose-400" /> &gt;70 Critical
            </span>
          </div>
        </div>
      </div>

      {/* SVG Interactive Canvas */}
      <div className="relative flex-1 w-full flex items-center justify-center p-2">
        <svg viewBox="0 0 540 440" className="w-full h-full max-h-[440px] select-none">
          {/* Background grid lines */}
          <defs>
            <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="1" />
            </pattern>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
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
                    stroke={isStressedLink ? 'rgba(244, 63, 94, 0.6)' : 'rgba(148, 163, 184, 0.2)'}
                    strokeWidth={isStressedLink ? '2.5' : '1.5'}
                    strokeDasharray={isStressedLink ? '4,4' : 'none'}
                    className={isStressedLink ? 'animate-pulse' : ''}
                  />
                  {/* Ripple pulse dot moving along link if stressed */}
                  {isStressedLink && (
                    <circle
                      cx={(src.x + tgt.x) / 2}
                      cy={(src.y + tgt.y) / 2}
                      r="3.5"
                      fill="#f43f5e"
                      className="animate-ping"
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
                {/* Selection Highlight Ring */}
                {isSelected && (
                  <circle
                    r="44"
                    fill="none"
                    stroke="#2dd4bf"
                    strokeWidth="2"
                    strokeDasharray="5,3"
                    className="animate-spin"
                    style={{ animationDuration: '8s' }}
                  />
                )}

                {/* Ripple Shockwave if Critical */}
                {avgStress >= 70 && (
                  <circle
                    r="40"
                    fill="none"
                    stroke="#f43f5e"
                    strokeWidth="1.5"
                    className="animate-ping opacity-75"
                  />
                )}

                {/* Base Zone Plate */}
                <circle
                  r="34"
                  fill="rgba(15, 23, 42, 0.88)"
                  stroke={mainColor}
                  strokeWidth={isSelected ? '3' : '2'}
                  filter={avgStress >= 70 ? 'url(#glow)' : undefined}
                  className="transition-all duration-300 group-hover:scale-105"
                />

                {/* Inner Zone Label */}
                <text
                  y="-12"
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="9.5"
                  fontWeight="600"
                  fontFamily="Inter, sans-serif"
                >
                  {data.name.split(' ')[0]}
                </text>

                {/* Mini System Bars (Traffic, Electricity, Water) */}
                <g transform="translate(-16, 2)">
                  {/* Traffic */}
                  <rect x="0" y="0" width="8" height="14" rx="1.5" fill="rgba(30, 41, 59, 0.8)" />
                  <rect
                    x="0"
                    y={14 - (data.traffic.stress / 100) * 14}
                    width="8"
                    height={(data.traffic.stress / 100) * 14}
                    rx="1.5"
                    fill={getStressColor(data.traffic.stress)}
                  />

                  {/* Electricity */}
                  <rect x="12" y="0" width="8" height="14" rx="1.5" fill="rgba(30, 41, 59, 0.8)" />
                  <rect
                    x="12"
                    y={14 - (data.electricity.stress / 100) * 14}
                    width="8"
                    height={(data.electricity.stress / 100) * 14}
                    rx="1.5"
                    fill={getStressColor(data.electricity.stress)}
                  />

                  {/* Water */}
                  <rect x="24" y="0" width="8" height="14" rx="1.5" fill="rgba(30, 41, 59, 0.8)" />
                  <rect
                    x="24"
                    y={14 - (data.water.stress / 100) * 14}
                    width="8"
                    height={(data.water.stress / 100) * 14}
                    rx="1.5"
                    fill={getStressColor(data.water.stress)}
                  />
                </g>

                {/* Stress Badge Below */}
                <g transform="translate(0, 24)">
                  <rect
                    x="-14"
                    y="-5"
                    width="28"
                    height="10"
                    rx="5"
                    fill={mainColor}
                    fillOpacity="0.25"
                  />
                  <text
                    y="2.5"
                    textAnchor="middle"
                    fill={mainColor}
                    fontSize="7.5"
                    fontWeight="700"
                    fontFamily="monospace"
                  >
                    {avgStress}%
                  </text>
                </g>
              </g>
            );
          })}
        </svg>
      </div>
    </GlassCard>
  );
}
