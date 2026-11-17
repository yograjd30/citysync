const { ZONES } = require('./cityConfig');
const { simulateStep } = require('./simulationEngine');

// 12 Labeled Incidents for Pattern Memory & Fingerprint Matching
const INCIDENT_LIBRARY = [
  {
    incidentId: 'inc-01',
    name: 'Heatwave + Evening Peak',
    description: 'Elevated city-wide temperature combined with residential AC surge causes cascading transformer trips.',
    primaryZone: 'res_north',
    events: [{ type: 'heatwave', zoneId: 'res_north', severity: 0.85, startStep: 190, durationSteps: 36 }],
    peakDelayMinutes: 85,
    criticalNodesPeak: 6,
  },
  {
    incidentId: 'inc-02',
    name: 'Stadium Event + Arterial Road Closure',
    description: 'Egress traffic diverted onto narrow adjacent roads leads to signal power strain and gridlock.',
    primaryZone: 'stadium',
    events: [
      { type: 'stadium_event', zoneId: 'stadium', severity: 0.9, startStep: 210, durationSteps: 24 },
      { type: 'road_closure', zoneId: 'old_town', severity: 0.7, startStep: 215, durationSteps: 20 },
    ],
    peakDelayMinutes: 45,
    criticalNodesPeak: 8,
  },
  {
    incidentId: 'inc-03',
    name: 'Downtown Pipe Burst + Morning Commute',
    description: 'Water main rupture floods Downtown junction, forcing vehicle rerouting and cutting commercial water.',
    primaryZone: 'downtown',
    events: [{ type: 'pipe_burst', zoneId: 'downtown', severity: 0.8, startStep: 96, durationSteps: 30 }],
    peakDelayMinutes: 30,
    criticalNodesPeak: 5,
  },
  {
    incidentId: 'inc-04',
    name: 'Industrial Substation Outage + Auxiliary Surge',
    description: 'Primary feeder loss cuts industrial production and triggers heavy auxiliary pump electrical draw.',
    primaryZone: 'industrial',
    events: [{ type: 'substation_outage', zoneId: 'industrial', severity: 0.85, startStep: 130, durationSteps: 28 }],
    peakDelayMinutes: 50,
    criticalNodesPeak: 7,
  },
  {
    incidentId: 'inc-05',
    name: 'Tech Park Server Surge + Heatwave',
    description: 'Data center cooling demand coincides with afternoon heatwave, straining the regional substation.',
    primaryZone: 'tech_park',
    events: [{ type: 'heatwave', zoneId: 'tech_park', severity: 0.75, startStep: 150, durationSteps: 40 }],
    peakDelayMinutes: 65,
    criticalNodesPeak: 6,
  },
  {
    incidentId: 'inc-06',
    name: 'Port Logistics Surge + Signal Malfunction',
    description: 'Heavy cargo traffic encounters failing signal controllers, backing up coastal arterial routes.',
    primaryZone: 'port_airport',
    events: [
      { type: 'road_closure', zoneId: 'port_airport', severity: 0.65, startStep: 110, durationSteps: 24 },
      { type: 'substation_outage', zoneId: 'port_airport', severity: 0.5, startStep: 115, durationSteps: 20 },
    ],
    peakDelayMinutes: 40,
    criticalNodesPeak: 4,
  },
  {
    incidentId: 'inc-07',
    name: 'Old Town Historic Main Failure',
    description: 'Aging distribution piping fails under pressure, draining reservoirs and backing up narrow streets.',
    primaryZone: 'old_town',
    events: [{ type: 'pipe_burst', zoneId: 'old_town', severity: 0.9, startStep: 160, durationSteps: 36 }],
    peakDelayMinutes: 60,
    criticalNodesPeak: 5,
  },
  {
    incidentId: 'inc-08',
    name: 'Residential South Substation Brownout',
    description: 'Suburban AC peak overloads local substation, dropping water pump booster pressure across the sector.',
    primaryZone: 'res_south',
    events: [{ type: 'substation_outage', zoneId: 'res_south', severity: 0.8, startStep: 220, durationSteps: 30 }],
    peakDelayMinutes: 35,
    criticalNodesPeak: 5,
  },
  {
    incidentId: 'inc-09',
    name: 'Multi-Zone Gridlock Spillover',
    description: 'Simultaneous events in Stadium and Downtown spill traffic into all connecting residential zones.',
    primaryZone: 'downtown',
    events: [
      { type: 'stadium_event', zoneId: 'stadium', severity: 0.8, startStep: 200, durationSteps: 24 },
      { type: 'road_closure', zoneId: 'downtown', severity: 0.8, startStep: 205, durationSteps: 24 },
    ],
    peakDelayMinutes: 55,
    criticalNodesPeak: 9,
  },
  {
    incidentId: 'inc-10',
    name: 'Industrial Water Main Severance',
    description: 'Construction severance of main water feed triggers emergency electrical pump switchover.',
    primaryZone: 'industrial',
    events: [{ type: 'pipe_burst', zoneId: 'industrial', severity: 0.95, startStep: 140, durationSteps: 30 }],
    peakDelayMinutes: 25,
    criticalNodesPeak: 4,
  },
  {
    incidentId: 'inc-11',
    name: 'Airport Corridor Traffic Paralysis',
    description: 'Logistics corridor closure forces freight traffic through Tech Park, clogging commercial arteries.',
    primaryZone: 'port_airport',
    events: [{ type: 'road_closure', zoneId: 'port_airport', severity: 0.85, startStep: 100, durationSteps: 36 }],
    peakDelayMinutes: 45,
    criticalNodesPeak: 5,
  },
  {
    incidentId: 'inc-12',
    name: 'City-Wide Extreme Heatwave Crisis',
    description: 'Multi-zone severe heatwave pushing all substations into warning and critical territory simultaneously.',
    primaryZone: 'downtown',
    events: [{ type: 'heatwave', zoneId: 'downtown', severity: 1.0, startStep: 140, durationSteps: 60 }],
    peakDelayMinutes: 90,
    criticalNodesPeak: 12,
  },
];

/**
 * Generates synthetic time series history for 30 days.
 * @param {number} days - Number of days to generate (default 30)
 * @param {number} seed - Seed for determinism
 * @returns {Array} Array of historical step points
 */
function generate30DaySyntheticHistory(days = 30, seed = 1337) {
  const dataset = [];
  const totalSteps = days * 288;

  for (let s = 0; s < totalSteps; s++) {
    const day = Math.floor(s / 288);
    const dayStep = s % 288;
    const isWeekend = day % 7 === 5 || day % 7 === 6;

    // Inject synthetic incidents on specific days
    let activeEvents = [];
    if (day === 5) activeEvents = INCIDENT_LIBRARY[0].events;
    if (day === 12) activeEvents = INCIDENT_LIBRARY[1].events;
    if (day === 19) activeEvents = INCIDENT_LIBRARY[2].events;
    if (day === 26) activeEvents = INCIDENT_LIBRARY[11].events;

    const snapshot = simulateStep({
      seed: seed + day * 100,
      step: dayStep,
      activeEvents,
      interventions: [],
    });

    dataset.push({
      globalStep: s,
      day,
      dayStep,
      isWeekend,
      timeFormatted: snapshot.timeFormatted,
      stabilityIndex: snapshot.stabilityIndex,
      nodesInCritical: snapshot.nodesInCritical,
      nodesInWarning: snapshot.nodesInWarning,
      zones: snapshot.zones,
    });
  }

  return dataset;
}

module.exports = {
  INCIDENT_LIBRARY,
  generate30DaySyntheticHistory,
};
