const mongoose = require('mongoose');

const PlaybookSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    category: { type: String, enum: ['heatwave', 'stadium', 'grid_strain', 'pipe_burst', 'general'], default: 'general' },
    interventions: [
      {
        id: { type: String, required: true },
        description: { type: String },
        delaySteps: { type: Number, default: 0 },
        targetNodeId: { type: String, default: null },
      },
    ],
    timesUsed: { type: Number, default: 0 },
    avgStabilityGain: { type: Number, default: 0 },
    createdBy: { type: String, default: 'system' },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Playbook || mongoose.model('Playbook', PlaybookSchema);
