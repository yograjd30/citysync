// 8 Urban Zones Configuration
const ZONES = [
  { id: 'downtown', name: 'Downtown', population: 85000, type: 'commercial_core' },
  { id: 'tech_park', name: 'Tech Park', population: 65000, type: 'high_tech_offices' },
  { id: 'res_north', name: 'Residential North', population: 110000, type: 'dense_residential' },
  { id: 'res_south', name: 'Residential South', population: 95000, type: 'suburban_residential' },
  { id: 'industrial', name: 'Industrial Estate', population: 30000, type: 'heavy_industry' },
  { id: 'stadium', name: 'Stadium District', population: 45000, type: 'entertainment_sports' },
  { id: 'old_town', name: 'Old Town', population: 75000, type: 'historic_narrow' },
  { id: 'port_airport', name: 'Port & Airport', population: 25000, type: 'transport_logistics' },
];

// Spatial Adjacency Graph for Road Spillover and Utility Flow
const ZONE_ADJACENCY = {
  downtown: ['old_town', 'tech_park', 'res_north'],
  tech_park: ['downtown', 'res_south', 'industrial'],
  res_north: ['downtown', 'old_town', 'stadium'],
  res_south: ['tech_park', 'industrial', 'port_airport'],
  industrial: ['tech_park', 'res_south', 'port_airport'],
  stadium: ['res_north', 'old_town'],
  old_town: ['downtown', 'res_north', 'stadium'],
  port_airport: ['industrial', 'res_south'],
};

// 3 Systems per Zone = 24 Nodes
const SYSTEMS = ['traffic', 'electricity', 'water'];

// System Weights for Normalized Stability Index (Sum = 8 * (1.0 + 1.2 + 1.1) = 26.4)
const SYSTEM_WEIGHTS = {
  traffic: 1.0,
  electricity: 1.2,
  water: 1.1,
};
const TOTAL_WEIGHT_SUM = 26.4;

// Nominal Capacity per Node (normalized to 100 base units)
const NODE_CAPACITIES = {};
ZONES.forEach((z) => {
  NODE_CAPACITIES[`${z.id}:traffic`] = 100;
  NODE_CAPACITIES[`${z.id}:electricity`] = 100;
  NODE_CAPACITIES[`${z.id}:water`] = 100; // 100% nominal pressure
});

module.exports = {
  ZONES,
  ZONE_ADJACENCY,
  SYSTEMS,
  SYSTEM_WEIGHTS,
  TOTAL_WEIGHT_SUM,
  NODE_CAPACITIES,
};
