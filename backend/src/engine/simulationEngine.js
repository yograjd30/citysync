const {
  ZONES,
  ZONE_ADJACENCY,
  SYSTEMS,
  SYSTEM_WEIGHTS,
  TOTAL_WEIGHT_SUM,
  NODE_CAPACITIES,
} = require('./cityConfig');
const { DEFAULT_COUPLING_RULES } = require('./couplingModel');

// Seeded deterministic pseudo-random number generator (Mulberry32)
function mulberry32(seed) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Diurnal baseline functions for 24 hours (step 0..287)
function getDiurnalBaseline(zone, system, step, isWeekend = false) {
  const hour = (step * 5) / 60; // 0.0 to 23.95
  const isMorningTraffic = hour >= 7.5 && hour <= 10.0;
  const isEveningTraffic = hour >= 17.0 && hour <= 19.5;
  const isWorkHours = hour >= 9.0 && hour <= 18.0;
  const isEveningHome = hour >= 18.0 && hour <= 22.5;
  const isMorningWater = hour >= 6.0 && hour <= 9.0;
  const isEveningWater = hour >= 18.0 && hour <= 21.0;

  let base = 25; // baseline idle load

  if (system === 'traffic') {
    if (isWeekend) {
      if (hour >= 11 && hour <= 20) base = 45;
    } else {
      if (isMorningTraffic) {
        base = zone.type === 'commercial_core' || zone.type === 'high_tech_offices' ? 62 : 48;
      } else if (isEveningTraffic) {
        base = zone.type === 'dense_residential' || zone.type === 'suburban_residential' ? 60 : 50;
      } else if (isWorkHours) {
        base = 35;
      } else {
        base = 15;
      }
    }
  } else if (system === 'electricity') {
    if (zone.type === 'heavy_industry') {
      base = isWorkHours ? 65 : 45;
    } else if (zone.type === 'high_tech_offices' || zone.type === 'commercial_core') {
      base = isWorkHours ? 68 : 30;
    } else {
      base = isEveningHome ? 60 : (isWorkHours ? 25 : 35);
    }
  } else if (system === 'water') {
    // Water pressure nominal is 100. High demand pulls pressure down.
    if (zone.type === 'heavy_industry') {
      base = isWorkHours ? 75 : 85;
    } else {
      if (isMorningWater || isEveningWater) {
        base = 78; // pressure drops under peak consumption
      } else {
        base = 92; // high pressure during low usage
      }
    }
  }

  return base;
}

/**
 * Pure deterministic simulation engine step evaluator.
 * @param {Object} params
 * @param {number} params.seed - Random seed
 * @param {number} params.step - Simulation tick (0 to 287)
 * @param {Array} params.activeEvents - Active event disruptions
 * @param {Array} params.interventions - Active counter-interventions
 * @param {Array} [params.couplingRules] - Optional customized coupling rules
 * @returns {Object} Complete 24-node state, alerts, stability index, and why chains
 */
function simulateStep({
  seed = 42,
  step = 144, // Default 12:00 PM
  activeEvents = [],
  interventions = [],
  couplingRules = DEFAULT_COUPLING_RULES,
}) {
  const stepSeed = (seed + step * 10007) >>> 0;
  const rng = mulberry32(stepSeed);

  // Initializing state for all 8 zones
  const zoneStates = {};
  ZONES.forEach((z) => {
    // Small deterministic noise +/- 2%
    const noiseT = (rng() - 0.5) * 4;
    const noiseE = (rng() - 0.5) * 4;
    const noiseW = (rng() - 0.5) * 3;

    zoneStates[z.id] = {
      traffic: Math.max(5, Math.min(100, getDiurnalBaseline(z, 'traffic', step) + noiseT)),
      electricity: Math.max(10, Math.min(100, getDiurnalBaseline(z, 'electricity', step) + noiseE)),
      waterPressure: Math.max(10, Math.min(100, getDiurnalBaseline(z, 'water', step) + noiseW)),
    };
  });

  const activeAlerts = [];
  const whyChains = {};

  // 1. Apply Injected Scenario Events
  activeEvents.forEach((ev) => {
    // Check if event is active at this step
    const endStep = ev.startStep + ev.durationSteps;
    if (step < ev.startStep || step >= endStep) return;

    const severity = Math.max(0, Math.min(1, ev.severity ?? 0.5));
    const targetZone = ev.zoneId;

    if (!zoneStates[targetZone]) return;

    if (ev.type === 'heatwave') {
      // Heatwave affects entire city, concentrated in targeted zone
      ZONES.forEach((z) => {
        const factor = z.id === targetZone ? 1.0 : 0.6;
        zoneStates[z.id].electricity = Math.min(100, zoneStates[z.id].electricity + 32 * severity * factor);
        zoneStates[z.id].waterPressure = Math.max(10, zoneStates[z.id].waterPressure - 18 * severity * factor);
      });
      whyChains[`${targetZone}:electricity`] = [
        `Extreme heatwave (severity ${Math.round(severity * 100)}%) active since step ${ev.startStep}`,
        `Air conditioning demand spiked (+${Math.round(32 * severity)}%)`,
      ];
    } else if (ev.type === 'stadium_event') {
      zoneStates[targetZone].traffic = Math.min(100, zoneStates[targetZone].traffic + 42 * severity);
      zoneStates[targetZone].electricity = Math.min(100, zoneStates[targetZone].electricity + 22 * severity);
      whyChains[`${targetZone}:traffic`] = [
        `Stadium District major event active`,
        `Ingress/egress congestion surge (+${Math.round(42 * severity)}%)`,
      ];
    } else if (ev.type === 'pipe_burst') {
      zoneStates[targetZone].waterPressure = Math.max(5, zoneStates[targetZone].waterPressure - 55 * severity);
      whyChains[`${targetZone}:water`] = [
        `Major water distribution main burst in ${targetZone}`,
        `Line delivery pressure collapsed (-55%)`,
      ];
    } else if (ev.type === 'substation_outage') {
      zoneStates[targetZone].electricity = Math.min(100, zoneStates[targetZone].electricity + 50 * severity);
      whyChains[`${targetZone}:electricity`] = [
        `Transformer malfunction at primary substation in ${targetZone}`,
        `Substation operating near emergency trip threshold`,
      ];
    } else if (ev.type === 'road_closure') {
      zoneStates[targetZone].traffic = Math.min(100, zoneStates[targetZone].traffic + 38 * severity);
      whyChains[`${targetZone}:traffic`] = [
        `Major arterial road closure in ${targetZone}`,
        `Local road capacity reduced, diverting flow`,
      ];
    }
  });

  // 2. Evaluate Dynamic Coupling Cascades
  // (a) Substation overload (>75) -> Traffic signals degrade (10 min lag / 2 ticks)
  ZONES.forEach((z) => {
    if (zoneStates[z.id].electricity >= 75) {
      zoneStates[z.id].traffic = Math.min(100, zoneStates[z.id].traffic + 24);
      const chain = whyChains[`${z.id}:traffic`] || [];
      chain.push(`Substation load exceeded 75% in ${z.name} -> Traffic signals degraded (10m delay) -> Road gridlock amplified`);
      whyChains[`${z.id}:traffic`] = chain;
    }
  });

  // (b) Substation overload (>80) -> Water pumping station efficiency drop (15 min lag / 3 ticks)
  ZONES.forEach((z) => {
    if (zoneStates[z.id].electricity >= 80) {
      zoneStates[z.id].waterPressure = Math.max(5, zoneStates[z.id].waterPressure - 32);
      const chain = whyChains[`${z.id}:water`] || [];
      chain.push(`Grid strain exceeded 80% in ${z.name} -> Electric booster pumps tripped (15m delay) -> Pressure collapsed`);
      whyChains[`${z.id}:water`] = chain;
    }
  });

  // (c) Low water pressure (<30%) -> Auxiliary electric pumps start (5 min lag / 1 tick)
  ZONES.forEach((z) => {
    if (zoneStates[z.id].waterPressure <= 30) {
      zoneStates[z.id].electricity = Math.min(100, zoneStates[z.id].electricity + 15);
      const chain = whyChains[`${z.id}:electricity`] || [];
      chain.push(`Water pressure in ${z.name} dropped below 30% -> Emergency backup pumps engaged (5m delay) -> Added electrical strain`);
      whyChains[`${z.id}:electricity`] = chain;
    }
  });

  // (d) Traffic Spillover: if congestion > 60, spill into neighboring zones
  ZONES.forEach((z) => {
    if (zoneStates[z.id].traffic > 60) {
      const excess = (zoneStates[z.id].traffic - 60) * 0.35;
      const neighbors = ZONE_ADJACENCY[z.id] || [];
      const spillPerNeighbor = excess / Math.max(1, neighbors.length);
      neighbors.forEach((nId) => {
        if (zoneStates[nId]) {
          zoneStates[nId].traffic = Math.min(100, zoneStates[nId].traffic + spillPerNeighbor);
          const chain = whyChains[`${nId}:traffic`] || [];
          chain.push(`Traffic spilled over from ${z.name} (${Math.round(excess)}% excess) along connecting corridors`);
          whyChains[`${nId}:traffic`] = chain;
        }
      });
    }
  });

  // 3. Apply Interventions (Mitigations)
  interventions.forEach((act) => {
    const targetZone = act.targetZone;
    if (!zoneStates[targetZone]) return;

    if (act.actionId === 'reroute_traffic') {
      zoneStates[targetZone].traffic = Math.max(10, zoneStates[targetZone].traffic - 28);
    } else if (act.actionId === 'shed_industrial_load') {
      zoneStates[targetZone].electricity = Math.max(15, zoneStates[targetZone].electricity - 24);
    } else if (act.actionId === 'start_backup_pump') {
      zoneStates[targetZone].waterPressure = Math.min(95, zoneStates[targetZone].waterPressure + 30);
    } else if (act.actionId === 'retime_signals') {
      zoneStates[targetZone].traffic = Math.max(10, zoneStates[targetZone].traffic - 18);
    }
  });

  // 4. Calculate Final 24-Node Stress Scores & Alerts
  let weightedStressSum = 0;
  let nodesInCritical = 0;
  let nodesInWarning = 0;

  const formattedZones = ZONES.map((z) => {
    const sTraffic = Math.max(0, Math.min(100, zoneStates[z.id].traffic));
    const sPower = Math.max(0, Math.min(100, zoneStates[z.id].electricity));
    const sWater = Math.max(0, Math.min(100, 100 - zoneStates[z.id].waterPressure));

    weightedStressSum += sTraffic * SYSTEM_WEIGHTS.traffic;
    weightedStressSum += sPower * SYSTEM_WEIGHTS.electricity;
    weightedStressSum += sWater * SYSTEM_WEIGHTS.water;

    // Evaluate Alert States
    [
      { sys: 'traffic', stress: sTraffic, metric: `${Math.round(sTraffic)}% congestion` },
      { sys: 'electricity', stress: sPower, metric: `${Math.round(sPower)}% substation load` },
      { sys: 'water', stress: sWater, metric: `${Math.round(zoneStates[z.id].waterPressure)}% line pressure` },
    ].forEach(({ sys, stress, metric }) => {
      if (stress >= 70) {
        nodesInCritical++;
        activeAlerts.push({
          id: `${z.id}:${sys}:${step}`,
          zoneId: z.id,
          zoneName: z.name,
          system: sys,
          severity: 'critical',
          stress: Math.round(stress),
          message: `${z.name} ${sys.toUpperCase()} has breached critical threshold (${metric})`,
          whyChain: whyChains[`${z.id}:${sys}`] || [`Primary operational capacity exhausted in ${z.name}`],
        });
      } else if (stress >= 40) {
        nodesInWarning++;
        activeAlerts.push({
          id: `${z.id}:${sys}:${step}`,
          zoneId: z.id,
          zoneName: z.name,
          system: sys,
          severity: 'warning',
          stress: Math.round(stress),
          message: `${z.name} ${sys} elevated above normal operating buffer (${metric})`,
          whyChain: whyChains[`${z.id}:${sys}`] || [`Normal peak hours fluctuation`],
        });
      }
    });

    return {
      zoneId: z.id,
      name: z.name,
      population: z.population,
      traffic: {
        demand: Math.round(zoneStates[z.id].traffic),
        capacity: 100,
        stress: Math.round(sTraffic),
      },
      electricity: {
        demand: Math.round(zoneStates[z.id].electricity),
        capacity: 100,
        stress: Math.round(sPower),
      },
      water: {
        pressure: Math.round(zoneStates[z.id].waterPressure),
        stress: Math.round(sWater),
      },
    };
  });

  // Calculate Normalized City Stability Index [0, 100]
  const stabilityIndex = Math.max(0, Math.min(100, Number((100 - weightedStressSum / TOTAL_WEIGHT_SUM).toFixed(1))));

  const totalMinutes = step * 5;
  const hours = Math.floor(totalMinutes / 60) % 24;
  const mins = totalMinutes % 60;
  const timeFormatted = `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;

  return {
    step,
    timeFormatted,
    stabilityIndex,
    nodesInCritical,
    nodesInWarning,
    zones: formattedZones,
    activeAlerts: activeAlerts.sort((a, b) => b.stress - a.stress),
  };
}

/**
 * Pre-computes all 288 steps of a 24-hour day in O(N) for O(1) scrubber queries.
 */
function precomputeDayTimeline({ seed = 42, activeEvents = [], interventions = [] }) {
  const steps = [];
  for (let s = 0; s < 288; s++) {
    steps.push(simulateStep({ seed, step: s, activeEvents, interventions }));
  }
  return steps;
}

module.exports = {
  simulateStep,
  precomputeDayTimeline,
};
