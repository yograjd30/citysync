const { ZONE_ADJACENCY } = require('./cityConfig');

// Quantized coupling rule definitions (Ticks: 1 tick = 5 minutes)
const DEFAULT_COUPLING_RULES = [
  {
    id: 'heat_to_power_water',
    name: 'Heatwave Impact',
    description: 'Elevated ambient temperature increases AC power load and drops water reserves.',
    source: 'heatwave',
    targets: ['electricity', 'water'],
    lagTicks: 0, // immediate
    lagMinutes: 0,
    powerMultiplier: 0.35,
    waterPressureDrop: 20,
  },
  {
    id: 'traffic_spillover',
    name: 'Congestion Spillover',
    description: 'Severe traffic congestion spills over into adjacent urban zones.',
    source: 'traffic',
    target: 'traffic',
    threshold: 60,
    lagTicks: 2, // 10 minutes
    lagMinutes: 10,
    spillRatio: 0.35,
  },
  {
    id: 'power_to_signals',
    name: 'Grid Overload to Traffic Signals',
    description: 'Substation overload degrades automated traffic signaling, increasing congestion.',
    source: 'electricity',
    target: 'traffic',
    threshold: 75,
    lagTicks: 2, // 10 minutes
    lagMinutes: 10,
    trafficCongestionPenalty: 25,
  },
  {
    id: 'power_to_pumps',
    name: 'Grid Overload to Water Pumps',
    description: 'Substation brownout drops main water pumping efficiency and pressure.',
    source: 'electricity',
    target: 'water',
    threshold: 80,
    lagTicks: 3, // 15 minutes
    lagMinutes: 15,
    pressureDropPct: 35,
  },
  {
    id: 'water_to_backup_pumps',
    name: 'Pressure Collapse to Auxiliary Pumps',
    description: 'Severe loss of water line pressure triggers electric auxiliary booster pumps.',
    source: 'water',
    target: 'electricity',
    threshold: 70, // pressure < 30%
    lagTicks: 1, // 5 minutes
    lagMinutes: 5,
    auxPowerDemand: 15,
  },
  {
    id: 'pipe_burst_spread',
    name: 'Pipe Burst Gradient Spillover',
    description: 'Water main rupture causes localized pressure drop and propagates along the distribution grid.',
    source: 'water',
    target: 'water',
    lagTicks: 2, // 10 minutes
    lagMinutes: 10,
    adjacentPressureDrop: 20,
  },
];

module.exports = {
  DEFAULT_COUPLING_RULES,
};
