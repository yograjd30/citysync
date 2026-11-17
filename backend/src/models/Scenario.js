const mongoose = require('mongoose');

const ScenarioSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    seed: { type: Number, default: 42 },
    events: [
      {
        type: { type: String, required: true },
        zoneId: { type: String, default: null },
        nodeId: { type: String, default: null },
        severity: { type: Number, default: 50 },
        startStep: { type: Number, default: 0 },
        durationSteps: { type: Number, default: 12 },
      },
    ],
    interventions: [
      {
        id: { type: String, required: true },
        appliedAtStep: { type: Number, default: 0 },
        targetNodeId: { type: String, default: null },
      },
    ],
    createdBy: { type: String, default: 'system' },
    isTemplate: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Scenario || mongoose.model('Scenario', ScenarioSchema);
