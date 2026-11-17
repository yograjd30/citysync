const fs = require('fs');
const path = require('path');
const { INCIDENT_LIBRARY, generate30DaySyntheticHistory } = require('../engine/syntheticGenerator');
const { DEFAULT_COUPLING_RULES } = require('../engine/couplingModel');
const { ZONES } = require('../engine/cityConfig');

function runSeed() {
  const dataDir = path.join(__dirname);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  // 1. Write Incident Library JSON
  const incidentPath = path.join(dataDir, 'incidentLibrary.json');
  fs.writeFileSync(incidentPath, JSON.stringify(INCIDENT_LIBRARY, null, 2), 'utf-8');
  console.log(`[Seed] Saved 12 incident profiles to ${incidentPath}`);

  // 2. Write Default Coupling Rules JSON
  const couplingPath = path.join(dataDir, 'couplingConfig.json');
  fs.writeFileSync(couplingPath, JSON.stringify(DEFAULT_COUPLING_RULES, null, 2), 'utf-8');
  console.log(`[Seed] Saved default coupling rules to ${couplingPath}`);

  // 3. Write City Topology JSON
  const cityPath = path.join(dataDir, 'cityConfig.json');
  fs.writeFileSync(cityPath, JSON.stringify(ZONES, null, 2), 'utf-8');
  console.log(`[Seed] Saved city zones configuration to ${cityPath}`);

  console.log('[Seed] Seeding completed successfully.');
}

if (require.main === module) {
  runSeed();
}

module.exports = { runSeed };
